const got = require('got')
const cheerio = require('cheerio')

const URL = 'http://www.buscacep.correios.com.br/sistemas/buscacep/detalhaCEP.cfm'

module.exports = function(cep) {
  cep = cep.replace(/[^0-9]/, '')
  return got.post(URL, {
    body: {
      CEP: cep
    },
    encoding: 'binary',
    form: true
  }).then( function(html) {
    const $ = cheerio.load(html.body, { decodeEntities: true })
    var result = {}
    $('table.tmptabela').each(function (index, element) {
      result = {
        cliente: extract('Unidade Operacional:', $, this),
        logradouro: extract('Endereço:', $, this) || extract('Logradouro:', $, this),
        bairro: extract('Bairro/Distrito:', $, this) || extract('Bairro:', $, this),
        cep: extract('CEP:', $, this),
        cidade: extract('Localidade/UF:', $, this).split('/')[0].trim(),
        uf: extract('Localidade/UF:', $, this).split('/')[1].trim()
      }
    })
    return Promise.resolve(result)
  }, function(error) {
    return Promise.reject(error)
  })
}

function extract(str, parser, node) {
  return parser(node).find('th:contains("' + str + '")+td').first().text().trim()
}