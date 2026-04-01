const { test, after, before, beforeEach, describe } = require('node:test')
const mongoose = require('mongoose')
const supertest = require('supertest')
const assert = require('node:assert')
const app = require('../app')
const helper = require('./test_helper')
const bcrypt = require('bcryptjs')
const Blog = require('../models/blog')
const User = require('../models/user')

const api = supertest(app)

describe('Blog API tests', () => {

    // Create a dedicated user and log in ONCE for this suite
    before(async () => {
        // Use a username that doesn't clash with the user tests ("root")
        const username = 'poster'
        const password = 'sekret'

        // create user if not existing
        const existing = await User.findOne({ username })
        if (!existing) {
        const passwordHash = await bcrypt.hash(password, 10)
        await new User({ username, name: 'Poster', passwordHash }).save()
        }

        // login to get a real token
        const loginRes = await api
        .post('/api/login')
        .send({ username, password })
        .expect(200)

        authToken = loginRes.body.token
    })

    beforeEach(async () => {
        await Blog.deleteMany({})
        
        await Blog.insertMany(helper.initialBlogs)
    })
    
    test('blogs are returned as json', async () => {
        const response = await api
        .get('/api/blogs')
        .expect(200)
        .expect('Content-Type', /application\/json/)
        
        assert.strictEqual(response.body.length, helper.initialBlogs.length)
    })
    
    test('verify the id field', async () => {
        const blogs = await helper.blogsInDb();
        
        blogs.forEach(blog => {
            assert.ok(blog.id)
            assert.strictEqual(blog._id, undefined)
        })
    })
    
    test('successfully add a blog', async () => {
        const newBlog = {
            title: "VDC",
            author: "Chiriac Gabriel",
            url: "http://site.com",
            likes: 10,
        }
        
        await api
        .post('/api/blogs')
        .set('Authorization', `Bearer ${authToken}`)
        .send(newBlog)
        .expect(201)
        .expect('Content-Type', /application\/json/)
        
        const blogs = await helper.blogsInDb();
        assert.strictEqual(blogs.length, helper.initialBlogs.length + 1)
        
        const contents = blogs.map(b => b.title)
        assert(contents.includes('VDC'))
    })

    test('error adding a blog - token not provided', async () => {
        const newBlog = {
            title: "VDC",
            author: "Chiriac Gabriel",
            url: "http://site.com",
            likes: 10,
        }
        
        await api
        .post('/api/blogs')
        .send(newBlog)
        .expect(401)
        .expect('Content-Type', /application\/json/)
        
        const blogs = await helper.blogsInDb();
        assert.strictEqual(blogs.length, helper.initialBlogs.length)
    })
    
    test('likes property is missing from the request', async () => {
        const newBlog = {
            title: "VDCASDQWE",
            author: "Chiriac",
            url: "http://site.com",
        }
        
        const responseBlog = await api
        .post('/api/blogs')
        .set('Authorization', `Bearer ${authToken}`)
        .send(newBlog)
        .expect(201)
        .expect('Content-Type', /application\/json/)
        
        assert.strictEqual(responseBlog.body.likes, 0)
    })
    
    test('title or url property is missing', async () => {
        const newBlog = {
            author: "Chiriac",
            url: "http://site.com",
        }
        
        await api
        .post('/api/blogs')
        .set('Authorization', `Bearer ${authToken}`)
        .send(newBlog)
        .expect(400)
    })
})
    
describe('User API tests', () => {

    beforeEach(async () => {
        await User.deleteMany({})

        const passwordHash = await bcrypt.hash('sekret', 10)
        const user = new User({ username: 'root', passwordHash })

        await user.save()
    })

    test('create a invalid user - username length', async () => {
        const usersAtStart = await helper.usersInDb();

        const newUser = {
            username: 'ab',
            name: 'Short Name',
            password: 'validpassword'
        }

        const result = await api
        .post('/api/users')
        .send(newUser)
        .expect(400)
        .expect('Content-Type', /application\/json/)

        const usersAtEnd = await helper.usersInDb();
        assert.strictEqual(usersAtEnd.length, usersAtStart.length)
    })

    test('create a invalid user - password length', async () => {
        const usersAtStart = await helper.usersInDb();

        const newUser = {
            username: 'abcde',
            name: 'Short Name',
            password: 'va'
        }

        await api
        .post('/api/users')
        .send(newUser)
        .expect(400)
        .expect('Content-Type', /application\/json/)

        const usersAtEnd = await helper.usersInDb();
        assert.strictEqual(usersAtEnd.length, usersAtStart.length)
    })

    test('create a invalid user - unique username', async () => {
        const usersAtStart = await helper.usersInDb();

        const newUser = {
            username: 'root',
            name: 'Short Name',
            password: 'validpassword'
        }

        const result = await api
        .post('/api/users')
        .send(newUser)
        .expect(400)
        .expect('Content-Type', /application\/json/)

        const usersAtEnd = await helper.usersInDb();
        assert(result.body.error.includes('expected `username` to be unique'))

        assert.strictEqual(usersAtEnd.length, usersAtStart.length)
    })
})

after(async () => {
  await mongoose.connection.close()
})
