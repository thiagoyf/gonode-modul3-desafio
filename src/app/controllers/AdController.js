const Ad = require('../models/Ad')

class AdController {
  // Metodo para listagem
  async index (req, res) {
    const filters = {
      purchasedBy: null
    }

    if (req.query.price_min || req.query.price_max) {
      filters.price = {}

      if (req.query.price_min) {
        filters.price.$gte = req.query.price_min
      }

      if (req.query.price_max) {
        filters.price.$lte = req.query.price_max
      }
    }

    if (req.query.title) {
      filters.title = new RegExp(req.query.title, 'i')
    }

    // - Troca o find por paginate para trazer paginado
    // o primeiro parametro de paginate seriam os filtros passado para ele
    // - O populate insere informações de um relacionamente
    // nesse exemplo, Ad tem author que é um User
    // o author de Ad vai receber todas informações do usuário correspondente
    const ads = await Ad.paginate(filters, {
      page: req.query.page || 1,
      limit: 20,
      populate: ['author'],
      sort: '-createdAt'
    })

    return res.json(ads)
  }

  // Metodo para mostrar um unico elemento
  async show (req, res) {
    const ad = await Ad.findById(req.params.id)

    return res.json(ad)
  }

  // Metodo para criar
  async store (req, res) {
    const ad = await Ad.create({ ...req.body, author: req.userId })

    return res.json(ad)
  }

  // Metodo para editar
  async update (req, res) {
    const ad = await Ad.findByIdAndUpdate(req.params.id, req.body, {
      new: true
    })

    return res.json(ad)
  }

  // Metodo para deletar
  async destroy (req, res) {
    await Ad.findByIdAndDelete(req.params.id)

    return res.send()
  }
}

module.exports = new AdController()
