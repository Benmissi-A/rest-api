const express = require('express')
const db = require('./mydb')

const IP = '192.168.0.10'
const PORT = 3333

const app = express()

// A middle for checking if an api key is provided by the user
// If an api key is provided in the authorization header field then
// the api key is attached to the req object
const getApiKey = async (req, res, next) => {
  const apiKey = req.headers.authorization
  if (!apiKey) {
    res.status(403).json({
      status: 'fail',
      data: { apiKey: 'No api key in Authorization header' },
    })
  } else {
    req.apiKey = apiKey.replace('Bearer ', '').trim()
    next()
  }
}

// A middleware for checking if an api key is valid
// and is still active.
// if Ok the id of the user performing the request is attached to the req object.

const validateApiKey = async (req, res, next) => {
  try {
    const result = await db.getUserByApiKey(req.apiKey)
    console.log(result)
    // check if null result then not found
    if (!result) {
      res.status(403).json({ status: 'fail', data: { key: 'Invalid api key' } })
    } else {
      req.userId = result.id
      next()
    }
  } catch (e) {
    console.log(e)
    res.status(500).json({ code: 'error', message: 'Internal server error' })
  }
}

app.use(express.urlencoded({ extended: false })) // to support URL-encoded bodies
app.use(express.json()) // to support JSON-encoded bodies

app.post('/register', async (req, res) => {
  const username = req.body.username
  const email = req.body.email
  try {
    const result = await db.register(username, email)
    res.json({
      status: 'success',
      data: { id: result.id, key: result.apiKey.key },
    })
  } catch (e) {
    if (e.status === 'fail') {
      res.status(400).json({ status: e.status, data: e.dataError })
    } else {
      // e.status === 50X
      res.status(500).json({ status: e.status, message: e.message })
    }
  }
})

app.use(getApiKey)
app.use(validateApiKey)

app.get('/getUserById/:userId', async (req, res) => {
  // A implementer
})

app.get('/myInfo', async (req, res) => {
  // A implmenter
})

app.listen(PORT, IP, () => {
  console.log(`listening on ${IP}:${PORT}`)
})
