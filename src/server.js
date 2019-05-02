require('dotenv').config()

const express = require('express')
const mongoose = require('mongoose')

// youch é uma biblioteca para renderizar o erro e onde ocorreu o erro
// ele possui dois tipos de visualização, o toJSON() e o toHTML()
const Youch = require('youch')

const Sentry = require('@sentry/node')
const validate = require('express-validation')
const databaseConfig = require('./config/database')
const sentryConfig = require('./config/sentry')

class App {
  constructor () {
    this.express = express()
    this.isDev = process.env.NODE_ENV !== 'production'

    this.sentry()
    this.database()
    this.middlewares()
    this.routes()

    // Exception tem que vir depois da configuração das rotas
    this.exception()
  }

  sentry () {
    Sentry.init(sentryConfig)
  }

  database () {
    mongoose.connect(databaseConfig.uri, {
      useCreateIndex: true,
      useNewUrlParser: true
    })
  }

  middlewares () {
    this.express.use(express.json())
    this.express.use(Sentry.Handlers.requestHandler())
  }

  routes () {
    this.express.use(require('./routes'))
  }

  exception () {
    if (process.env.NODE_ENV === 'production') {
      this.express.use(Sentry.Handlers.errorHandler())
    }

    this.express.use(async (err, req, res, next) => {
      if (err instanceof validate.ValidationError) {
        return res.status(err.status).json(err)
      }

      // Para visualizar o erro enquanto está em ambiente de desenvolvimento
      if (process.env.NODE_ENV !== 'production') {
        const youch = new Youch(err, req)

        return res.json(await youch.toJSON())
      }

      return res
        .status(err.status || 500)
        .json({ error: 'Internal Server Error' })
    })
  }
}
module.exports = new App().express
