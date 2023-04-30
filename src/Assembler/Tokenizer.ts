import { TokenTypes, Tokens } from './types'

function createTokenList(line: string) {
  const tokenList = []
  let currentToken = ''
  let inString = false
  let inChar = false

  for (let i = 0; i < line.length; i++) {
    const currentChar = line[i]

    if (currentChar === '"' && !inChar) {
      inString = !inString
      currentToken += currentChar
    } else if (currentChar === "'" && !inString) {
      inChar = !inChar
      currentToken += currentChar
    } else if (
      (currentChar === ' ' || currentChar === ',') &&
      !inString &&
      !inChar
    ) {
      if (currentToken.length > 0) {
        tokenList.push(currentToken)
        currentToken = ''
      }
      if (currentChar === ',') {
        tokenList.push(currentChar)
      }
    } else {
      currentToken += currentChar
    }
  }

  if (currentToken.length > 0) {
    tokenList.push(currentToken)
  }

  return tokenList
}

export function Tokenizer(source: string): Tokens {
  const tokens = []

  const lines = source.split('\n')

  let lineIndex = 0
  while (lineIndex < lines.length) {
    let line = lines[lineIndex]
    line = line.trim()

    // Remove inline comments
    const commentIndex = line.indexOf(';')
    if (commentIndex !== -1) {
      line = line.slice(0, commentIndex).trim()
    }
    line = line.trim()

    const tokenList = createTokenList(line)

    let position = 0
    for (const token of tokenList) {
      if (!token) {
        position += 1
        continue
      }

      let foundToken = false
      for (const { tokenType, regex } of TokenTypes) {
        const match = token.match(regex)

        if (match) {
          foundToken = true

          if (tokenType === 'COMMENT') {
            // Break out of both loops when a comment is found
            position = line.length
            break
          }

          if (tokenType === 'WHITESPACE') {
            position += token.length
            continue
          }

          const isImmediate = tokenType === 'IMMEDIATE'

          tokens.push({
            type: tokenType,
            value: isImmediate ? token.slice(1) : token,
            line: lineIndex,
            column: position
          })

          break
        }
      }
      position += token.length

      if (!foundToken) {
        const decimalImmediateRegex = /^[0-9]+/
        if (token.match(decimalImmediateRegex)) {
          const immediatePosition = line.indexOf(token)
          throw new Error(
            `Invalid immediate value at [line: ${lineIndex}, column: ${position}]. Use '#' symbol for immediates.
            Got: ${line}
            Expected: ${line.slice(0, immediatePosition)}#${line.slice(
              immediatePosition
            )}
            `
          )
        }
        throw new Error(`Invalid token at line: ${line}`)
      }
    }

    // if last token is null don't add a new null token
    if (tokens.at(-1) !== null) {
      tokens.push(null) // Add null token to indicate end of line
    }
    lineIndex += 1
  }

  return tokens
}
