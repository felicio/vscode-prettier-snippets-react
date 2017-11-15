'use strict'

import {
  ExtensionContext,
  languages,
  CompletionItemProvider,
  CompletionItem,
  CompletionItemKind,
  ProviderResult,
  Disposable,
} from 'vscode'

const snippets = require('../snippets/snippets.json')

interface Snippet {
  prefix: string
  body: string
  description: string
}

let registerCompletionProvider: Disposable | undefined

class PSCompletionItem extends CompletionItem {
  constructor(snippet: Snippet) {
    super('psr', CompletionItemKind.Snippet)
  }
}

class PSCompletionProvider implements CompletionItemProvider {
  constructor(private snippets: [Snippet]) {}

  provideCompletionItems(): ProviderResult<CompletionItem[]> {
    return this.snippets.map(s => new PSCompletionItem(s))
  }
}

export async function activate(context: ExtensionContext) {
  let registerCompletionProvider = languages.registerCompletionItemProvider(
    'javascript',
    new PSCompletionProvider(snippets as [Snippet]),
    'p'
  )
}

export function deactivate() {
  if (registerCompletionProvider) {
    registerCompletionProvider.dispose()
    registerCompletionProvider = undefined
  }
}
