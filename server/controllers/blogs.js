const blogRouter = require('express').Router();
const jwt = require('jsonwebtoken');
const Blog = require('../models/blog');
const User = require('../models/user');
const logger = require('../utils/logger');
const { userExtractor } = require('../utils/middleware');

blogRouter.get('/', async (request, response) => {
  var blogs = await Blog.find({}).populate('user', { username: 1, name: 1 });
  response.json(blogs)
})

blogRouter.post('/', userExtractor, async (request, response) => {
  const body = request.body
  const user = request.user

  if(!body.title || !body.url)
    response.status(400).end()

  const blog = new Blog({
    title: body.title,
    author: body.author,
    url: body.url,
    likes: body.likes || 0,
    user: user._id,
    comments: body.comments || []
  })

  const result = await blog.save()
  user.blogs = user.blogs.concat(result._id)
  await user.save()
  response.status(201).json(result)
})

blogRouter.delete('/:id', userExtractor, async (request, response) => {
  const blog = await Blog.findById(request.params.id)
  const user = request.user

  if(!blog)
    return response.status(404).end();

  if(blog.user.toString() !== user._id.toString()) {
    return response.status(401).json({ error: 'only the creator can delete a blog' })
  }

  await Blog.findByIdAndDelete(request.params.id)
  user.blogs = user.blogs.filter(b => b.toString() !== request.params.id)
  await user.save()
  response.status(204).end()
})

blogRouter.put('/:id', async (request, response) => {
  const allowed = ['title', 'author', 'url', 'likes', 'user', 'comments'];
  const updates = {};

  for (const key of allowed) {
    if (Object.prototype.hasOwnProperty.call(request.body, key)) {
      updates[key] = request.body[key];
    }
  }

  const updated = await Blog.findByIdAndUpdate(
    request.params.id,
    updates,
    { new: true, runValidators: true, context: 'query' }
  );

  if (!updated) return response.status(404).end();
  response.json(updated);
})

blogRouter.post('/:id/comments', async (request, response) => {
  const blogToFind = await Blog.findById(request.params.id)

  blogToFind.comments = blogToFind.comments.concat(request.body.comment)

  const updatedBlog = await blogToFind.save()

  if (!updatedBlog) return response.status(404).end();
  response.json(updatedBlog);
})


module.exports = blogRouter