const crypto = require('crypto')
const { PrismaClient, Prisma } = require('@prisma/client')
const prisma = new PrismaClient()

const customizeError = (e) => {
  // A query error
  if (e instanceof Prisma.PrismaClientKnownRequestError) {
    e.status = 'fail'
    e.dataError = {}
    switch (e.code) {
      case 'P2002':
        e.dataError[e.meta.target[0]] = `${e.meta.target[0]} already exists`
        break
      default:
        e.dataError[e.meta.target[0]] = e.message
    }
  } else {
    e.status = 'error'
  }
  throw e
}

exports.register = async (username, email) => {
  const apiKey = crypto.randomUUID()
  try {
    const result = await prisma.user.create({
      data: {
        username: username,
        email: email,
        apiKey: {
          create: {
            key: apiKey,
          },
        },
      },
    })

    return await prisma.user.findUnique({
      where: {
        id: result.id,
      },
      select: {
        id: true,
        apiKey: {
          select: {
            key: true,
          },
        },
      },
    })
  } catch (e) {
    customizeError(e)
    throw e
  }
}

exports.getUserByApiKey = async (apiKey) => {
  try {
    /* 1ere alternative: la meilleure */
    const result = await prisma.user.findFirst({
      where: {
        apiKey: {
          key: {
            contains: apiKey,
          },
        },
      },
    })
    /* 2eme alternative: result est différent
    const result =  await prisma.apiKey.findUnique({
      where: {
        key: apiKey,
      },
      select: {
        user: true,
      },
    })*/
    /* 3eme alternative: Ne fonctionne pas???
    const result = await prisma.user.findMany({
      select: {
        username: true,
        apiKey: {
          where: {
            key: apiKeyz,
          },
          select: {
            key: true,
          },
        },
      },
    })*/
    return result
  } catch (e) {
    customizeError(e)
    throw e
  }
}
