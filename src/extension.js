'use strict'

const { languages } = require('vscode')

const PrettierSnippetsCompletionProvider = require('./completion-provider')

exports.activate = context => {
  const disposable = languages.registerCompletionItemProvider(
    'javascript',
    new PrettierSnippetsCompletionProvider(),
    'p'
  )

  context.subscriptions.push(disposable)
}
