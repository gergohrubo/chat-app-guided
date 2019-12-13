const { Router } = require('express')
const Message = require('./model')


function factory(stream) {
  const router = new Router()
  router.get('/message', async (req, res, next) => {
    const messages = await Message.findAll()
    res.send(messages)
  })

  router.post('/message', async (req, res, next) => {
    const message = await Message.create(req.body)
    const action = {
      type: 'NEW_MESSAGE',
      payload: message
    }
    stream.send(JSON.stringify(action))
    res.send(message)
  })
  return router
}

module.exports = factory