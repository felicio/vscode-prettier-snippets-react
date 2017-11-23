type Body = string | string[]

type From = 'snippet' | 'variable'

export interface Snippets {
  [name: string]: Snippet
}

export interface Snippet {
  readonly prefix: string
  body: Body
  readonly description: string
}

export interface Syntax {
  readonly tokens: Token[]
}

export interface Token {
  readonly snippet: Pattern
  readonly variable: Pattern
}

interface Pattern {
  readonly re: RegExp
  readonly replacement: any // string | function
}
