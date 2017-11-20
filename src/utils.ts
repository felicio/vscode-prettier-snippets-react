'use strict'

import { format, Options } from 'prettier'

type Body = string | string[]

type From = 'snippet' | 'variable'

export interface Snippets {
  [name: string]: Snippet
}

export interface Snippet {
  prefix: string
  body: Body
  description: string
}

interface Syntax {
  tokens: Token[]
}

interface Token {
  snippet: Pattern
  variable: Pattern
}

interface Pattern {
  re: RegExp
  replacement: string
}

export const TABSTOP: Token = {
  snippet: {
    re: /\$(\d)/g,
    replacement: 'TABSTOP_$1',
  },
  variable: {
    re: /TABSTOP_(\d)/g,
    replacement: '$$$1',
  },
}

export const PLACEHOLDER: Token = {
  snippet: {
    re: /\$\{(\d):(\w+)\}/g, // tabstop : default value
    replacement: 'PLACEHOLDER_$1_$2',
  },
  variable: {
    re: /PLACEHOLDER_(\d)_(\w+)/g,
    replacement: '${$1:$2}',
  },
}

export function formatSnippets(
  snippets: Snippets,
  syntax: Syntax,
  options: Options
) {
  return Object.keys(snippets).reduce((accumulator: Snippets, name: string) => {
    const snippet = snippets[name]
    const from = parseSnippets(snippet.body, 'snippet', syntax)
    const formatted = format(from, options)
    const to = parseSnippets(formatted, 'variable', syntax)
    accumulator[name] = { ...snippet, body: to }

    return accumulator
  }, {} as Snippets)
}

function parseSnippets(
  snippetBody: Body,
  from: From,
  syntax: Syntax
) {
  let body = resolveSnippetBody(snippetBody)

  syntax.tokens.forEach(token => (body = replaceToken(body, from, token)))

  return body
}

function replaceToken(text: string, from: From, token: Token) {
  return text.replace(token[from].re, token[from].replacement)
}

export function resolveSnippetBody(body: Body) {
  return Array.isArray(body) ? body.join('\n') : body
}
