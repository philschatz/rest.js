const {readFileSync, writeFileSync} = require('fs')
const {join: pathJoin} = require('path')
const Handlebars = require('handlebars')

const ROUTES = require('../lib/routes.json')

const templatePath = pathJoin(__dirname, 'templates', 'generate-response-types-tests.tpl')
const template = readFileSync(templatePath, 'utf8')

const methodsToTest = []

Object.entries(ROUTES).forEach(([sectionName, val1]) => {
  Object.entries(val1).forEach(([methodName, {url, method, params, description, yields, yields_array: yieldsArray, yields_is_empty: yieldsIsEmpty}]) => {
    if (method === 'GET' && yields) {
      methodsToTest.push({
        sectionName,
        methodName,
        params: JSON.stringify(params),
        yields,
        yieldsArray: yieldsArray || false,
        yieldsIsEmpty: yieldsIsEmpty || false
      })
    }
  })
})

const body = Handlebars.compile(template)({
  methodsToTest
})

writeFileSync(pathJoin(__dirname, '../test/autogenerated-response-types-test.js'), body)
