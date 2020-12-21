'use strict'
const { fragment } = require('xmlbuilder2')
const { validate } = require('rdmo-json-schema')
const root = require('./root')
const text = require('./text')
const uri = require('./uri')

module.exports = function questions (catalog) {
  if (validate(catalog) === false) { throw validate.errors }
  const doc = root()
  visitCatalog(doc, catalog)
  return doc.end({ prettyPrint: true })
}

function visitCatalog (doc, { prefix, key, title, sections }) {
  doc.import(serializeCatalog(prefix, key, title))
  sections?.forEach((section, index) => {
    doc.import(serializeSection(prefix, key, section.key, section.title, index))
    section.questionsets?.forEach((questionset, index) => {
      doc.import(serializeQuestionset(prefix, key, section.key, questionset, index))
      questionset.questions?.forEach((question, index) => {
        doc.import(serializeQuestion(prefix, key, section.key, questionset.key, question, index))
      })
    })
  })
}

function serializeCatalog (prefix, key, title) {
  return fragment().ele('catalog', { 'dc:uri': uri.catalog(prefix, key) })
    .ele('uri_prefix').txt(prefix).up()
    .ele('key').txt(key).up()
    .ele('dc:comment').up()
    .ele('order').txt('0').up()
    .import(text(title, 'title'))
}

function serializeSection (prefix, catalog, key, title, order) {
  return fragment().ele('section', { 'dc:uri': uri.section(prefix, catalog, key) })
    .ele('uri_prefix').txt(prefix).up()
    .ele('path').txt([catalog, key].join('/')).up()
    .ele('key').txt(key).up()
    .ele('dc:comment').up()
    .ele('catalog', { 'dc:uri': uri.catalog(prefix, catalog) }).up()
    .ele('order').txt(order).up()
    .import(text(title, 'title'))
}

function serializeQuestionset (prefix, catalog, section, data, order) {
  return fragment().ele('questionset', { 'dc:uri': uri.questionset(prefix, catalog, section, data.key) })
    .ele('uri_prefix').txt(prefix).up()
    .ele('path').txt([catalog, section, data.key].join('/')).up()
    .ele('key').txt(data.key).up()
    .ele('dc:comment').txt(data.comment).up()
    .ele('attribute').txt(data.attribute).up()
    .ele('section', { 'dc:uri': uri.section(prefix, catalog, section) }).up()
    .ele('is_collection').txt(false).up()
    .ele('order').txt(order).up()
    .import(text(data.title, 'title'))
    .import(text(data.help, 'help'))
    .import(text(data.verboseName, 'verbose_name'))
    .import(text(data.verboseNamePlural, 'verbose_name_plural'))
    .ele('conditions').up()
}

function serializeQuestion (prefix, catalog, section, questionset, data, order) {
  return fragment().ele('question', { 'dc:uri': uri.question(prefix, catalog, section, questionset, data.key) })
    .ele('uri_prefix').txt(prefix).up()
    .ele('path').txt([catalog, section, questionset, data.key].join('/')).up()
    .ele('key').txt(data.key).up()
    .ele('dc:comment').txt(data.comment).up()
    .ele('attribute').txt(data.attribute).up()
    .ele('questionset', { 'dc:uri': uri.questionset(prefix, catalog, section, questionset) }).up()
    .ele('is_collection').txt(false).up()
    .ele('order').txt(order).up()
    .import(text(data.text))
    .import(text(data.help, 'help'))
    .import(text(data.verboseName, 'verbose_name'))
    .import(text(data.verboseNamePlural, 'verbose_name_plural'))
    .ele('conditions').up()
}
