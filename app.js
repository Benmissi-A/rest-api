const crypto = require('crypto')
const express = require('express')
const { PrismaClient } = require('@prisma/client')

const IP = '192.168.0.10'
const PORT = 3333

const prisma = new PrismaClient()
const app = express()

app.use(express.urlencoded({ extended: false })) // to support URL-encoded bodies
app.use(express.json()) // to support JSON-encoded bodies

app.post('/register', async (req, res) => {
  const username = req.body.username
  const email = req.body.email
  const api_key = crypto.randomUUID()
  const result = await prisma.user.create({
    data: {
      username: username,
      email: email,
      apiKey: {
        create: {
          key: api_key,
        },
      },
    },
  })
  console.log(result)
  res.json({ status: 200, key: api_key })
})

app.listen(PORT, IP, () => {
  console.log(`listening on ${IP}:${PORT}`)
})
