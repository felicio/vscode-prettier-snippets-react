const { CompletionItem, CompletionItemKind, SnippetString } = require('vscode')

const snippet = `import React from 'react'

const \${1:Component} = () => {
  return (

  )
} 

export default \${1:Component}
`

class PrettierSnippetsCompletionItem extends CompletionItem {
  constructor() {
    super('psr', CompletionItemKind.Snippet)
    this.insertText = new SnippetString(snippet)
    this.detail = 'Create React Stateless Component'
  }
}

class PrettierSnippetsCompletionProvider {
  provideCompletionItems() {
    return [new PrettierSnippetsCompletionItem()]
  }
}

module.exports = PrettierSnippetsCompletionProvider
