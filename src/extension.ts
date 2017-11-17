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
  TABSTOP,
  PLACEHOLDER,
} from './utils'

const snippets = require('../snippets/snippets.json') as Snippets

let disposable: Disposable | undefined

let PRETTIER_EXTENSION = 'prettier'

class PSCompletionItem extends CompletionItem {
  constructor(snippet: Snippet) {
    super(snippet.prefix, CompletionItemKind.Snippet)

    this.insertText = new SnippetString(snippet.body)
    this.detail = snippet.description
  }
}

class PSCompletionProvider implements CompletionItemProvider {
  constructor(private snippets: Snippets) {}

  provideCompletionItems(): ProviderResult<CompletionItem[]> {
    return Object.keys(snippets).map(key => new PSCompletionItem(snippets[key]))
  }
}

export async function activate(context: ExtensionContext) {
  async function workspaceFoldersChange(folders: WorkspaceFolder[]) {
    let config
    if (folders) {
      config = await prettier.resolveConfig(folders[0].uri.path)
    } else {
      config = workspace.getConfiguration(PRETTIER_EXTENSION)
    }

    let formattedSnippets = formatSnippets(
      snippets,
      { tokens: [TABSTOP, PLACEHOLDER] },
      config
    )

    if (disposable) {
      disposable.dispose()
    }

    disposable = languages.registerCompletionItemProvider(
      'javascript',
      new PSCompletionProvider(formattedSnippets),
      '*'
    )
  }

  let folders = workspace.workspaceFolders
  await workspaceFoldersChange(folders)

  // TODO: Somehow handle workspaces
  // workspace.onDidChangeWorkspaceFolders(workspaceFoldersChange)
}

export function deactivate() {
  if (disposable) {
    disposable.dispose()
    disposable = undefined
  }
}
