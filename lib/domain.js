'use strict'
const { fragment } = require('xmlbuilder2')
const { validate } = require('rdmo-json-schema')
const root = require('./root')
const uri = require('./uri')

module.exports = function domain (catalog) {
  if (validate(catalog) === false) { throw validate.errors }
  const doc = root()
  if (Array.isArray(catalog.domain)) {
    visitDomainList(doc, catalog.domain, catalog.prefix, [])
  } else if (typeof catalog.domain === 'object') {
    visitDomainMap(doc, catalog.domain, catalog.prefix, [])
  }
  return doc.end({ prettyPrint: true })
}

function visitDomainList (doc, attributes, prefix, parentPath = []) {
  attributes.forEach(({ key, children }) => {
    doc.import(serializeAttribute(prefix, key, parentPath))
    if (Array.isArray(children)) {
      visitDomainList(doc, children, prefix, parentPath.concat(key))
    }
  })
  return doc
}

function visitDomainMap (doc, attributes, prefix, parentPath = []) {
  Object.entries(attributes).forEach(([key, children]) => {
    doc.import(serializeAttribute(prefix, key, parentPath))
    visitDomainMap(doc, children, prefix, parentPath.concat(key))
  })
  return doc
}

function serializeAttribute (prefix, key, parentPath = []) {
  const path = parentPath.concat(key)
  const doc = fragment().ele('attribute', { 'dc:uri': uri.attribute(prefix, path) })
    .ele('uri_prefix').txt(prefix).up()
    .ele('key').txt(key).up()
    .ele('path').txt(path.join('/')).up()
    .ele('dc:comment').up()
  if (parentPath.length > 0) {
    doc.ele('parent', { 'dc:uri': uri.attribute(prefix, parentPath) })
  } else {
    doc.ele('parent')
  }
  return doc.up()
}
