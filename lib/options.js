'use strict'
const { fragment } = require('xmlbuilder2')
const { validate } = require('rdmo-json-schema')
const root = require('./root')
const text = require('./text')
const uri = require('./uri')

module.exports = function options (catalog) {
  if (validate(catalog) === false) { throw validate.errors }
  const doc = root()
  visitOptions(doc, collectOptions(catalog), catalog.prefix)
  return doc.end({ prettyPrint: true })
}

function collectOptions (catalog) {
  const options = new Map(Object.entries(catalog.optionsets ?? []))
  catalog.sections
    ?.forEach(section => {
      section.questionsets
        ?.forEach(questionset => {
          questionset.questions
            ?.filter(question => typeof question.options === 'object')
            ?.forEach(question => options.set(question.key, question.options))
        })
    })
  return options
}

function visitOptions (doc, optionsets, prefix) {
  optionsets.forEach((options, key) => {
    doc.import(serializeOptionset(prefix, key))
    options.forEach((option, index) => {
      doc.import(serializeOption(prefix, key, option, index))
    })
  })
}

function serializeOptionset (prefix, key) {
  return fragment().ele('optionset', { 'dc:uri': uri.optionset(prefix, key) })
    .ele('uri_prefix').txt(prefix).up()
    .ele('key').txt(key).up()
    .ele('dc:comment').up()
    .ele('order').txt('0').up()
    .ele('provider_key').up()
    .ele('conditions').up()
}

function serializeOption (prefix, optionset, option, order) {
  const optionKey = option.key ?? `${optionset}_${order}`
  return fragment().ele('option', { 'dc:uri': uri.option(prefix, optionset, optionKey) })
    .ele('uri_prefix').txt(prefix).up()
    .ele('key').txt(optionKey).up()
    .ele('path').txt([optionset, optionKey].join('/')).up()
    .ele('dc:comment').up()
    .ele('optionset', { 'dc:uri': uri.optionset(prefix, optionset) }).up()
    .ele('order').txt(order).up()
    .import(text(option.text))
    .ele('additional_input').txt(option.additionalInput ?? false).up()
}
