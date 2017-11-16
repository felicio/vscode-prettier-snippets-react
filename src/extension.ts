'use strict'

import {
  ExtensionContext,
  languages,
  CompletionItemProvider,
  CompletionItem,
  CompletionItemKind,
  ProviderResult,
  Disposable,
  SnippetString,
} from 'vscode'

const snippets = require('../snippets/snippets.json')

import {
  Snippets,
  Snippet,
  formatSnippets,
  TABSTOP,
  PLACEHOLDER,
} from './utils'

let registerCompletionProvider: Disposable | undefined

class PSCompletionItem extends CompletionItem {
  constructor(snippet: Snippet) {
    super(snippet.prefix, CompletionItemKind.Snippet)

    this.insertText = new SnippetString(snippet.body)
    this.detail = snippet.description
  }
}

class PSCompletionProvider implements CompletionItemProvider {
  constructor(private snippets: [Snippet]) {}

  provideCompletionItems(): ProviderResult<CompletionItem[]> {
    return Object.keys(snippets).map(key => new PSCompletionItem(snippets[key]))
  }
}

export async function activate(context: ExtensionContext) {
  let registerCompletionProvider = languages.registerCompletionItemProvider(
    'javascript',
    new PSCompletionProvider(snippets as [Snippet]),
    '*'
  )
}

export function deactivate() {
  if (registerCompletionProvider) {
    registerCompletionProvider.dispose()
    registerCompletionProvider = undefined
  }
}
