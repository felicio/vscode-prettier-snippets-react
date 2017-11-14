'use strict'

import { ExtensionContext, languages } from 'vscode'

import PSCompletionProvider from './ps-completion-provider'
const snippets = require('../snippets/snippets.json')

export interface snippet {
  prefix: string
  body: string
  description: string
}

export async function activate(context: ExtensionContext) {
  let disposable = languages.registerCompletionItemProvider(
    'javascript',
    new PSCompletionProvider(snippets as [snippet]),
    'p'
  )

  context.subscriptions.push(disposable)
}

export function deactivate() {}
