const express = require('express')
const mongoose = require('mongoose')
const config = require('./server/utils/config')
const logger = require('./server/utils/logger')
const middleware = require('./server/utils/middleware')
const blogRouter = require('./server/controllers/blogs')
const usersRouter = require('./server/controllers/users')
const loginRouter = require('./server/controllers/login')

const app = express()

logger.info('Connecting to database...');
console.log(config.MONGODB_URI)
const mongoUrl = config.MONGODB_URI
mongoose.connect(mongoUrl).then(() => {
    logger.info('Connected to database');
})
.catch((error) => {
    logger.error('Failed to connect to database', error.message);
})


app.use(express.json())
app.use(middleware.requestLogger)
app.use(middleware.tokenExtractor)

app.use('/api/blogs', blogRouter)
app.use('/api/users', usersRouter)
app.use('/api/login', loginRouter)

  if (process.env.NODE_ENV === 'test') {
    const testingRouter = require('./controllers/testing')
    app.use('/api/testing', testingRouter)
  }

app.use(middleware.unknownEndpoint)
app.use(middleware.errorHandler)

module.exports = app