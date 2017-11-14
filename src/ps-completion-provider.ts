import {
  CompletionItemProvider,
  CompletionItem,
  CompletionItemKind,
  ProviderResult,
} from 'vscode'

import { snippet } from './extension'

class PSCopmletionItem extends CompletionItem {
  constructor(snippet: snippet) {
    super('psr', CompletionItemKind.Snippet)
  }
}

export default class PSCopmletionProvider implements CompletionItemProvider {
  constructor(private snippets: [snippet]) {}

  provideCompletionItems(): ProviderResult<CompletionItem[]> {
    return this.snippets.map(s => new PSCopmletionItem(s))
  }
}
