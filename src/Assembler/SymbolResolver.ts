import { SymbolTable, Tokens } from './types'

export function SymbolResolver(tokens: Tokens) {
  const symbolTable: SymbolTable = new Map()
  let currentAddress = 0
  let tokenIndex = 0
  while (tokenIndex < tokens.length) {
    const token = tokens[tokenIndex]

    if (token === null) {
      // End of line
      tokenIndex++
      continue
    }

    if (token.type === 'LABEL') {
      const label = token.value.slice(0, -1) // Remove ':' from label
      symbolTable.set(label, currentAddress)
    } else if (token.type === 'DIRECTIVE') {
      if (token.value === '.data') {
        // Skip to next line
        tokenIndex += 1
        continue
      } else if (token.value === '.org') {
        // Get the next token
        const nextToken = tokens[tokenIndex + 1]

        if (!nextToken) {
          throw new Error(
            `Expected a value after '.org' directive at line: ${token.value}`
          )
        }

        if (nextToken.type !== 'HEX_VALUE' && nextToken.type !== 'DEC_VALUE') {
          throw new Error(
            `Expected a hexadecimal or decimal value after '.org' directive at line: ${token.value}`
          )
        }

        currentAddress = parseInt(nextToken.value)
      }
    } else {
      currentAddress += 1
    }

    tokenIndex += 1
  }

  return symbolTable
}
