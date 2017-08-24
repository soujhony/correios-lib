const soap = require('soap')

const URL = 'http://ws.correios.com.br/calculador/CalcPrecoPrazo.asmx?WSDL'
const DEFAULT_SERVICE = '41106'

// Serviços
// 40010	 SEDEX sem contrato
// 40045	 SEDEX a Cobrar, sem contrato
// 40126	 SEDEX a Cobrar, com contrato
// 40215	 SEDEX 10, sem contrato
// 40290	 SEDEX Hoje, sem contrato
// 40096	 SEDEX com contrato
// 40436	 SEDEX com contrato
// 40444	 SEDEX com contrato
// 40568	 SEDEX com contrato
// 40606 	 SEDEX com contrato
// 41106	 PAC sem contrato
// 41211/41068	 PAC com contrato
// 81019	 e-SEDEX, com contrato
// 81027	 e-SEDEX Prioritário, com contrato
// 81035	 e-SEDEX Express, com contrato
// 81868	 (Grupo 1) e-SEDEX, com contrato
// 81833	 (Grupo 2 ) e-SEDEX, com contrato
// 81850	 (Grupo 3 ) e-SEDEX, com contrato

// Formatos
// 1 Caixa
// 2 Rolo
// 3 Envelope

module.exports = function(params, config) {
  config = config || {}

  const args = {
    'nCdEmpresa'         : config.codigoEmpresa || '',
    'sDsSenha'           : config.senhaEmpresa || '',
    'nCdServico'         : Array.isArray(params.servico) ? params.servico.join(',') : params.servico || DEFAULT_SERVICE,
    'sCepOrigem'         : params.cepOrigem.replace(/\D/g, ''),
    'sCepDestino'        : params.cepDestino.replace(/\D/g, ''),
    'nVlPeso'            : params.peso,
    'nCdFormato'         : params.formato,
    'nVlComprimento'     : params.comprimento,
    'nVlAltura'          : params.altura,
    'nVlLargura'         : params.largura,
    'nVlDiametro'        : params.diametro,
    'sCdMaoPropria'      : params.maoPropria || params.maoPropria === 'S' ? 'S' : 'N',
    'nVlValorDeclarado'  : params.valor || 0,
    'sCdAvisoRecebimento': params.avisoRecebimento || params.avisoRecebimento === 'S' ? 'S' : 'N',
    'sDtCalculo'         : params.dataCalculo || new Date()
  }

  return new Promise(function(resolve, reject) {
    soap.createClient(URL, function (err, client) {
      if (err) {
        reject(err)
      } else {
        client.CalcPrecoPrazoRestricao(args, function (err, result) {
          if (err) {
            reject(err)
          } else {
            resolve(result.CalcPrecoPrazoRestricaoResult.Servicos.cServico)
          }
        })
      }
    })
  }).then(function(result) {
    return result.map(function(element) {
      return element.Erro !== '0' ? {
        servico: element.Codigo,
        erro: element.Erro,
        mensagem: element.MsgErro
      } : {
        servico: element.Codigo,
        valorTotal: parseNumber(element.Valor),
        prazo: element.PrazoEntrega,
        composicao: {
          valor: parseNumber(element.ValorSemAdicionais),
          maoPropria: parseNumber(element.ValorMaoPropria),
          avisoRecebimento: parseNumber(element.ValorAvisoRecebimento),
          valorDeclarado: parseNumber(element.ValorValorDeclarado)
        },
        entregaDomiciliar: element.EntregaDomiciliar,
        entregaSabado: element.EntregaSabado
      }
    })
  })
}

function parseNumber(value) {
  return Number.parseFloat(value.split('.').join('').split(',').join('.'))
}