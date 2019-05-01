const Mail = require('../services/Mail')

class PurchaseMail {
  // o get server para que quando fazer 'PurchaseMail.key' da para ter acesso
  get key () {
    // retorna a key que é uma chave única para esse Job
    return 'PurchaseMail'
  }

  // - Responsável por executar a função ou seja enviar email

  // - Quando Queue.process(jobs.PurchaseMail.key, jobs.PurchaseMail.handle)
  // é chamado ele passa dois parametros para a função handle, 'job' e 'done'

  // - O 'job' que contem várias inforamções sobre o job

  // - E uma função chamada 'done' que devemos chamar assim que terminar
  // de chamar o job
  async handle (job, done) {
    const { ad, user, content } = job.data

    // - O Main.sendMail pode também declarar html e passar tags html para
    // formar o corpo da mensagem
    await Mail.sendMail({
      from: '"Thiago Fukunaga" <thiagoyudifukunaga@gmail.com>',
      to: ad.author.email,
      subject: `Solicitação de compra: ${ad.title}`,
      template: 'purchase',
      context: { user, content, ad }
    })

    // - O 'done()' avisa o job que ele finalizou, tirando essa tarefa da fila
    return done()
  }
}

module.exports = new PurchaseMail()
