import { IMemoryRegions } from '../CPU/Memory'
import { AddrFormat, OfstFormat } from '../Shared/Instructions'
import { OperandFormatToTokenType, Token, Tokens } from './types'

/**
 * Determines if the given token matches the expected operand format.
 */
export function isTokenExpectedOperand(token: Token, operand: string) {
  const expectedTokenType =
    OperandFormatToTokenType[operand as keyof typeof OperandFormatToTokenType]

  // If the token type is a label, also allow offset and address operands
  if (token.type === 'LABEL_REF') {
    return operand === OfstFormat || operand === AddrFormat
  }
  if (token.type === 'HEX_VALUE') {
    return operand === AddrFormat
  }
  return token.type === expectedTokenType
}

/**
 * Checks if the given address is within the valid memory regions.
 */
export function isValidAddress(address: number, memoryRegions: IMemoryRegions) {
  return (
    (address >= memoryRegions.ROM && address <= memoryRegions.IO) ||
    (address >= memoryRegions.RAM && address <= memoryRegions.Stack + 0x0fff)
  )
}

/**
 * Retrieves the statement (sequence of tokens) surrounding the specified token index.
 */
function getStatementFromTokens(tokens: Tokens, tokenIndex: number) {
  // take the current position
  // go backwards until you find a null token
  // go forwards until you find a null token
  // return the tokens in between
  let start = tokenIndex
  let end = tokenIndex

  while (tokens[start] !== null) {
    start -= 1
  }

  while (tokens[end] !== null) {
    end += 1
  }

  return tokens.slice(start + 1, end)
}

/**
 * Reconstructs a statement from the tokens surrounding the specified token index.
 */
function rebuildStatementFromTokens(tokens: Tokens, tokenIndex: number) {
  const statement = getStatementFromTokens(tokens, tokenIndex)
  return statement.map(token => token?.value || '').join(' ')
}

/**
 * Builds the expected string representation of an instruction and its operands.
 */
function buildExpected(instruction: string, operands: Array<string>) {
  return `${instruction} ${operands.join(', ')}`
}

/**
 * Creates an error message for the given token.  The message will include the token's value, line, and column.
 * The message will also include the expected operands for the given instruction.
 * This function is used to create error messages.
 */
export function createErrorMessage(
  token: Token,
  tokens: Tokens,
  tokenIndex: number,
  message: string,
  operands: Array<string> = []
) {
  let errMsg = `Invalid operand: ${token.value} at [line: ${
    token.line
  }, column: ${token.column}]
  Description: ${message}
  Got: ${rebuildStatementFromTokens(tokens, tokenIndex)}
  `
  if (operands.length > 0) {
    errMsg += `Expected: ${buildExpected(message, operands)}`
  }

  return errMsg
}

/**
 * Creates a list of tokens from the given line of assembly code.
 */
export function createTokenList(line: string) {
  const tokenList = []
  let currentToken = ''
  let inString = false
  let inChar = false

  for (let i = 0; i < line.length; i++) {
    const currentChar = line[i]

    if (currentChar === '"' && !inChar) {
      inString = !inString
      currentToken += currentChar
      // eslint-disable-next-line quotes
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
