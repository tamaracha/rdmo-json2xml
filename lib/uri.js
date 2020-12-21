'use strict'

/**
 * Construct an URI for the dc:uri attribute
 * @param {string} collection - The element type the uri is constructed for
 * @param {string} prefix - The URL prefix
 * @param {string[]|string} path - Intermediate element keys of parent elements
 * @return {string} The URI value
*/
function uri (prefix, collection, path) {
  return [prefix, collection].concat(path).join('/')
}

module.exports = {
  attribute: (prefix, path) => uri(prefix, 'domain', path),
  optionset: (prefix, key) => uri(prefix, 'options', key),
  option: (prefix, optionset, key) => uri(prefix, 'options', [optionset, key]),
  catalog: (prefix, key) => uri(prefix, 'questions', [key]),
  section: (prefix, catalog, key) => uri(prefix, 'questions', [catalog, key]),
  questionset: (prefix, catalog, section, key) => uri(prefix, 'questions', [catalog, section, key]),
  question: (prefix, catalog, section, questionset, key) => uri(prefix, 'questions', [catalog, section, questionset, key])
}
