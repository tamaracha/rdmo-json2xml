'use strict'
const { create } = require('xmlbuilder2')

module.exports = function root () {
  return create({ version: '1.0', encoding: 'UTF-8' })
    .ele('rdmo', { 'xmlns:dc': 'http://purl.org/dc/elements/1.1/' })
}
