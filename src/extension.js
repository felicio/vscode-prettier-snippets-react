'use strict'

// const fs = require('fs')
// const path = require('path')
const { languages } = require('vscode')
// const prettier = require('prettier')

const PrettierSnippetsCompletionProvider = require('./completion-provider')

exports.activate = context => {
  // const snippetsPath = path.resolve(__dirname, '../snippets/snippets.json')
  // let obj = undefined

  const disposable = languages.registerCompletionItemProvider(
    'javascript',
    new PrettierSnippetsCompletionProvider(),
    'p'
  )

  // try {
  //   const snippets = fs.readFileSync(snippetsPath, 'utf8')
  //   obj = JSON.parse(snippets)
  // } catch (error) {
  //   console.error(error)
  // }

  // FIXME: Wrap tokens signalling tab stop in quotes, then strip them down before inserting
  // const output = prettier.format(obj.body, { semi: false })

  context.subscriptions.push(disposable)
}
