'use strict'

import {
  ExtensionContext,
  languages,
  workspace,
  window,
  CompletionItemProvider,
  CompletionItem,
  CompletionItemKind,
  ProviderResult,
  Disposable,
  TextEditor,
  SnippetString,
  WorkspaceFoldersChangeEvent,
  WorkspaceFolder,
} from 'vscode'
import * as prettier from 'prettier'

import {
  Snippets,
  Snippet,
  formatSnippets,
  resolveSnippetBody,
  METHOD,
  TABSTOP,
  PLACEHOLDER,
  normalize
} from './utils'

const snippets = require('../snippets/snippets.json') as Snippets

let registeredCompletionProvider: Disposable | undefined

const PRETTIER_EXTENSION_ID = 'prettier'

class PSCompletionItem extends CompletionItem {
  constructor(snippet: Snippet) {
    super(snippet.prefix, CompletionItemKind.Snippet)

    this.insertText = new SnippetString(snippet.body as string)
    this.detail = snippet.description
  }
}

class PSCompletionProvider implements CompletionItemProvider {
  constructor(private snippets: Snippets) {}

  provideCompletionItems(): ProviderResult<CompletionItem[]> {
    return Object.keys(this.snippets).map(
      key => new PSCompletionItem(this.snippets[key])
    )
  }
}

export async function activate(context: ExtensionContext) {
  async function workspaceFoldersChange(folders: WorkspaceFolder[]) {
    let options: prettier.Options

    if (folders) {
      options = await prettier.resolveConfig(folders[0].uri.fsPath)
    } else {
      const configuration = workspace.getConfiguration(PRETTIER_EXTENSION_ID)
      options = normalize(configuration)
    }

    const formattedSnippets = formatSnippets(
      snippets,
      { tokens: [TABSTOP, PLACEHOLDER, METHOD] },
      options
    )

    if (registeredCompletionProvider) {
      registeredCompletionProvider.dispose()
    }

    registeredCompletionProvider = languages.registerCompletionItemProvider(
      'javascript',
      new PSCompletionProvider(formattedSnippets),
      '*'
    )
  }

  let folders = workspace.workspaceFolders
  await workspaceFoldersChange(folders)
}

export function deactivate() {
  if (registeredCompletionProvider) {
    registeredCompletionProvider.dispose()
    registeredCompletionProvider = undefined
  }
}
