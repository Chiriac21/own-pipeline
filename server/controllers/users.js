const usersRouter = require('express').Router();
const bcrypt = require('bcryptjs');
const User = require('../models/user');

usersRouter.get('/', async (request, response) => {
    const users = await User.find({}).populate('blogs', { title: 1, author: 1, url: 1 });
    response.json(users);
})

usersRouter.get('/:id', async (request, response) => {
    const user = await User.findById(request.params.id).populate('blogs', { title: 1, author: 1, url: 1 })
    response.json(user);
})

usersRouter.post('/', async (request, response) => {
    const { username, name, password } = request.body;

    if(!password || password.length < 3) {
        return response.status(400).json({ error: 'password must be at least 3 characters long' });
    }

    const salt = 10;
    const passwordHash = await bcrypt.hash(password, salt);

    const newUser = new User({
        username,
        name,
        passwordHash
    })

    const savedUser = await newUser.save();
    response.status(201).json(savedUser);
})

module.exports = usersRouter;