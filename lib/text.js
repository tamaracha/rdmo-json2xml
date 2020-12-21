'use strict'
const { fragment } = require('xmlbuilder2')

module.exports = function text (content, element = 'text') {
  if (typeof content === 'string') {
    return translatedText({ de: content, en: content }, element)
  } else {
    return translatedText(content, element)
  }
}

function translatedText (translations = {}, element) {
  const doc = fragment()
  for (const [lang, text] of Object.entries(translations)) {
    doc.ele(element, { lang }).txt(text)
  }
  return doc
}
