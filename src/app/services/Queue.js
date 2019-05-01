const kue = require('kue')
const Sentry = require('@sentry/node')
const redisConfig = require('../../config/redis')
const jobs = require('../jobs')

// cria a fila com as configurações passadas para ela
const Queue = kue.createQueue({ redis: redisConfig })

// processa a job com chave 'jobs.PurchaseMail.key'
// e executa 'jobs.PurchaseMail.handle'
Queue.process(jobs.PurchaseMail.key, jobs.PurchaseMail.handle)

Queue.on('error', Sentry.captureException)

module.exports = Queue
