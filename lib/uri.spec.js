'use strict'
const test = require('ava')
const uri = require('./uri')
const prefix = 'example.com'

test('domain uri', t => {
  t.is(uri.attribute(prefix, ['parent1', 'parent2', 'key']), prefix + '/domain/parent1/parent2/key')
})

test('optionset uri', t => {
  t.is(uri.optionset(prefix, 'key'), prefix + '/options/key')
})

test('option uri', t => {
  t.is(uri.option(prefix, 'optionset', 'key'), prefix + '/options/optionset/key')
})
