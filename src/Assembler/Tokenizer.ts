import { TokenTypes, Tokens } from './types'

export function Tokenizer(source: string): Tokens {
  const tokens = []

  const lines = source.split('\n')

  const tokenRegexes = Object.entries(TokenTypes).map(
    ([tokenType, tokenPattern]) => ({
      tokenType,
      regex: new RegExp('^' + tokenPattern)
    })
  )

  let lineIndex = 0
  while (lineIndex < lines.length) {
    let line = lines[lineIndex]
    line = line.trim()

    if (line.length === 0) {
      lineIndex += 1
      continue
    }

    let position = 0
    while (position < line.length) {
      let foundToken = false

      for (const { tokenType, regex } of tokenRegexes) {
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
            value: token,
            line: lineIndex,
            column: position
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
    lineIndex += 1
  }

  return tokens
}
