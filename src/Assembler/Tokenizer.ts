import { TokenTypes } from "./types"

type Token = {
  type: string
  value: string
}

type Tokens = Array<Token | null>

export function Tokenizer(source: string): Tokens {
  const tokens = []

  const lines = source.split('\n')

  for (let line of lines) {
    line = line.trim()

    if (line.length === 0) continue

    let position = 0
    while (position < line.length) {
      let foundToken = false

      for (const tokenType in TokenTypes) {
        const regex = new RegExp(
          '^' + TokenTypes[tokenType as keyof typeof TokenTypes]
        )
        const match = line.slice(position).match(regex)
        if (match) {
          foundToken = true
          const token = match[0]
          if (tokenType === 'COMMENT') {
            // Break out of both loops when a comment is found
            position = line.length

            break
          }

          if (tokenType === 'WHITESPACE') {
            position += token.length
            continue
          }

          tokens.push({
            type: tokenType,
            value: token
          })

          position += token.length
          break
        }
      }

      if (!foundToken) {
        // Check for decimal immediates without '#' symbol
        const decimalImmediateRegex = /^[0-9]+/
        if (line.slice(position).match(decimalImmediateRegex)) {
          throw new Error(
            `Invalid immediate value at line: ${line}. Use '#' symbol for immediates.`
          )
        }

        throw new Error(`Invalid token at line: ${line}`)
      }
    }
    tokens.push(null) // Add null token to indicate end of line
  }

  return tokens
}
