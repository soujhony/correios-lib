const got = require('got')
const cheerio = require('cheerio')

const URL = 'http://www2.correios.com.br/sistemas/rastreamento/resultado_semcontent.cfm'

module.exports = function(cdRatreio) {
  process.env["NODE_TLS_REJECT_UNAUTHORIZED"] = 0;
  return got.post(URL, {
    body: {
      Objetos: cdRatreio
    },
    form: true
  }).then( function(html) {
    const $ = cheerio.load(html.body, { decodeEntities: true })
    const result = []
    $('tr').each( function(index, element) {
      result.push({
        dataHota: extractDataHora($, this),
        local: extractLocal($, this),
        status: extractStatus($, this),
        encaminhado: extractEncaminhado($, this)
      })
    })
    return Promise.resolve(result)
  }, function(error) {
    return Promise.reject(error)
  })
}

function extractDataHora(parser, node) {
  return parser(node).find('.sroDtEvent').text().match(/(\d{2}\/\d{2}\/\d{4})|(\d{2}\:\d{2})/gm).join(' ')
}

function extractLocal(parser, node) {
  return parser(node).find('.sroDtEvent label').text().replace(/\s\/\s/, '/').trim()
}

function extractStatus(parser, node) {
  return parser(node).find('.sroLbEvent').html().split('<br>')[0].replace(/([\t\n]|<\/?strong>)/g, '').trim()
}

function extractEncaminhado(parser, node) {
  return parser(node).find('.sroLbEvent').html().split('<br>')[1].replace(/[\t\n]/g, '').trim()
}
