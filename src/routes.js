const express = require('express')
const validate = require('express-validation')

// - Por padrão o as function async/promises não disparam erro, para
// disparar erros teria  que envolver o código dentro do da função assíncrona
// e not catch, retornar o next passando o erro: 'return next(err)'
// - A biblioteca handle, permite que você envie o erro que acontece dentro das
// promises sem ter que utilizar o try/catch
const handle = require('express-async-handler')

const routes = express.Router()

const authMiddleware = require('./app/middlewares/auth')

const controllers = require('./app/controllers')
const validators = require('./app/validators')

routes.post(
  '/users',
  validate(validators.User),
  handle(controllers.UserController.store)
)
routes.post(
  '/sessions',
  validate(validators.Session),
  handle(controllers.SessionController.store)
)

// usa o authMiddleware em todas as rotas apartir das rotas seguintes
routes.use(authMiddleware)

/**
 * Ads
 */
routes.get('/ads', handle(controllers.AdController.index))
routes.get('/ads/:id', handle(controllers.AdController.show))
routes.post(
  '/ads',
  validate(validators.Ad),
  handle(controllers.AdController.store)
)
routes.put(
  '/ads/:id',
  validate(validators.Ad),
  handle(controllers.AdController.update)
)
routes.delete('/ads/:id', handle(controllers.AdController.destroy))

/**
 * Purchases
 */
routes.post(
  '/purchases',
  validate(validators.Purchase),
  handle(controllers.PurchaseController.store)
)
routes.put('/purchases/:id', handle(controllers.ApproveController.update))

module.exports = routes
