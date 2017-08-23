const got = require('got')
const cheerio = require('cheerio')

const URL = 'http://m.correios.com.br/movel/buscaCepConfirma.do'

module.exports = function(cep) {
  cep = cep.replace(/[^0-9]/, '')
  return got.post(URL, {
    body: {
      cepEntrada: cep,
      tipoCep: '',
      cepTemp: '',
      metodo: 'buscarCep'
    },
    encoding: 'binary',
    form: true
  }).then( function(html) {
    const $ = cheerio.load(html.body, { decodeEntities: true })
    var result = {}
    $('form[name=buscaCepForm] > div').each(function (index, element) {
      if ($(this).hasClass('caixacampobranco') || $(this).hasClass('caixacampoazul')) {
        result = {
          cliente: extract('Cliente: ', $, this),
          logradouro: extract('Endere�o: ', $, this) || extract('Logradouro: ', $, this),
          bairro: extract('Bairro: ', $, this),
          cep: extract('CEP: ', $, this),
          cidade: extract('Localidade', $, this).split('/')[0].trim(),
          uf: extract('Localidade', $, this).split('/')[1].trim()
        }
      }
    })
    return Promise.resolve(result)
  }, function(error) {
    return Promise.reject(error)
  })
}

function extract(str, parser, node) {
  return parser(node).find('.resposta:contains("' + str + '")+.respostadestaque').first().text().trim()
}