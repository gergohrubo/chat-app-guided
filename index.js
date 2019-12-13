const express = require('express')
const messageRouterFactory = require('./message/router')
const messageModel = require('./message/model')
const bodyParser = require('body-parser')
const cors = require('cors')
const app = express()

const Sse = require('json-sse')

const stream = new Sse()
const messageRouter = messageRouterFactory(stream)

const port = 4000

const corsMiddleware = cors()
const bodyparserMiddleware = bodyParser.json()

app.use(corsMiddleware)

app.get('/', (req, res, next) => {
  stream.send('hello')
  res.send('hello')
})

app.get('/stream', async (req, res, next) => {
  try {
    const messages = await messageModel.findAll()
    const action = {
      type: 'ALL_MESSAGES',
      payload: messages
    }
    const stringified = JSON.stringify(action)
    stream.updateInit(stringified) //send data to client right after they connect
    stream.init(req, res)
  } catch (error) {
    next(error)
  }
})

app.use(bodyparserMiddleware)
app.use(messageRouter)

app.listen(port, () => console.log(`Listening on ${port}`))