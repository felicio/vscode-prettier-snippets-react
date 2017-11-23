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
  DocumentSelector,
  TextEditor,
  SnippetString,
  WorkspaceFoldersChangeEvent,
  WorkspaceFolder,
} from 'vscode'
// TODO: Try to import local instance of prettier
import * as prettier from 'prettier'

import { Snippets, Snippet } from './types'
import { format, METHOD, TABSTOP, PLACEHOLDER, normalize } from './utils'

const snippets = require('../snippets/snippets.json') as Snippets
const PRETTIER_EXTENSION_ID = 'prettier'
const languageSelector: DocumentSelector = [
  'javascript',
  'javascriptreact',
  'typescript',
  'typescriptreact',
]
let registeredProvider: Disposable | undefined

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

// TODO: Declare as asynchronous
export function activate(context: ExtensionContext) {
  let options = getOptions()
  registeredProvider = registerProvider(snippets, options)

  // TODO: Register file watcher + clear chache on change

  // TODO: Register new provider on configuration change

  // TODO: Register new provider on workspace folder change + file watcher

  context.subscriptions.push(registeredProvider)
}

function registerProvider(snippets: Snippets, options: prettier.Options) {
  const formattedSnippets = format(
    snippets,
    // FIXME: Do not expose this parametr (hide it)
    { tokens: [TABSTOP, PLACEHOLDER, METHOD] },
    options
  )

  const provider = languages.registerCompletionItemProvider(
    languageSelector,
    new PSCompletionProvider(formattedSnippets),
    '*'
  )

  return provider
}

/* FIXME: Get configuration for active workspace folder, on config change
in active workspace folder and on start-up */
function getOptions() {
  let options: prettier.Options
  const lastActiveEditor = window.activeTextEditor

  if (lastActiveEditor) {
    const lastActiveDocument = lastActiveEditor.document
    const workspaceFolders = workspace.workspaceFolders

    const lastActiveWorkspaceFolder = workspaceFolders.find(folder => {
      const folderPath = folder.uri.fsPath
      const documentPath = lastActiveDocument.uri.fsPath

      return documentPath.startsWith(`${folderPath}/`)
    })

    // It is not guranteed that document belongs to a certain workspace folder.
    if (lastActiveWorkspaceFolder) {
      // FIXME: Reads only .prettierrc file
      options = prettier.resolveConfig.sync(
        lastActiveWorkspaceFolder.uri.fsPath
      )
    } else {
      options = getConfiguration()
    }
  } else {
    options = getConfiguration()
  }

  function getConfiguration() {
    const configuration = workspace.getConfiguration(PRETTIER_EXTENSION_ID)

    return normalize(configuration)
  }

  return options
}

export function deactivate() {
  if (registeredProvider) {
    registeredProvider.dispose()
    registeredProvider = undefined
  }
}
