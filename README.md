# correios-lib
Biblioteca para acesso de funções relacionadas aos correios brasileiros

Biblioteca baseada no projeto [cagartner/correios-consulta](https://github.com/cagartner/correios-consulta)

## Forma de usar

### Instalação
``` bash
npm install git+https://github.com/jhonystein/correios-lib.git
```

### Funcionalidades

1 - Consulta de CEP
``` javascript
const correios = require('correios-lib')

correios.cep('<CEP a ser consultado>')
  .then(function(data) {
    console.log(data)
  }, function(error) {
    console.log(error)
  })
```

2 - Consulta de Rastreio
``` javascript
const correios = require('correios-lib')

correios.rastreio('<Código de rastreio>')
  .then(function(data) {
    console.log(data)
  }, function(error) {
    console.log(error)
  })
```

3 - Consulta de Frete
``` javascript
const correios = require('correios-lib')

var objFrete = {
  servico: '<código ou lista dos códigos de serviço>',
  cepOrigem: '<cep da origem da mercadoria>',
  cepDestino: '<cep de destino da mercadoria>',
  peso: '<peso da mercadoria>',
  formato: '<formato da embalagem>',
  comprimento: '<comprimento da embalagem>',
  altura: '<altura da embalagem>',
  largura: '<largura da embalagem>',
  diametro: '<diâmetro da embalagem>'
}

correios.frete(objFrete)
  .then(function(data) {
    console.log(data)
  }, function(error) {
    console.log(error)
  })
```

3.1 - Formatos possíveis de embalagem
- 1 Caixa
- 2 Rolo
- 3 Envelope
