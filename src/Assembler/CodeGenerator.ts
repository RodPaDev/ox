import { IMemoryRegions, MemoryRegions } from '../CPU/Memory'
import {
  AddrFormat,
  ImmFormat,
  Instructions,
  OfstFormat,
  RdFormat,
  RsFormat
} from '../Shared/Instructions'
import { Registers } from '../Shared/Registers'
import {
  SymbolTable,
  Token,
  Tokens,
  ValidDirectives,
  ValidRegisters
} from './types'
import { isTokenExpectedOperand, isValidAddress } from './utills'

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

function rebuildStatementFromTokens(tokens: Tokens, tokenIndex: number) {
  const statement = getStatementFromTokens(tokens, tokenIndex)
  return statement.map(token => token?.value || '').join(' ')
}

function buildExpected(instruction: string, operands: Array<string>) {
  return `${instruction} ${operands.join(', ')}`
}

function createErrorMessage(
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

export class CodeGenerator {
  symbolTable: Map<string, number>
  currentAddress: number = 0
  tokenIndex: number = 0
  tokens: Array<any>
  machineCode: Array<number> = []
  memoryRegions: IMemoryRegions

  constructor(
    symbolTable: SymbolTable,
    tokens: Tokens,
    memoryRegions: IMemoryRegions
  ) {
    this.symbolTable = symbolTable
    this.tokens = tokens
    this.memoryRegions = memoryRegions
  }

  generate() {
    while (this.tokenIndex < this.tokens.length) {
      const token = this.tokens[this.tokenIndex]

      if (token === null) {
        this.tokenIndex += 1
        continue
      }

      if (token.type === 'LABEL') {
        this.handleLabel()
      } else if (token.type === 'LABEL_REF') {
        this.handleLabelRef(token)
      } else if (token.type === 'MNEMONIC') {
        this.handleMnemonic(token)
      } else if (token.type === 'DIRECTIVE') {
        this.handleDirective(token)
      }

      this.tokenIndex += 1
    }

    return this.machineCode
  }

  handleMnemonic(token: Token) {
    const instruction = Instructions[token.value as keyof typeof Instructions]
    if (!instruction) {
      throw new Error(
        createErrorMessage(
          token,
          this.tokens,
          this.tokenIndex,
          `Invalid instruction. Supported instructions ${Object.keys(
            Instructions
          )}`
        )
      )
    }

    const { format, operands } = instruction
    const statementMachineCode = [instruction.opcode]

    let operandIndex = 0
    while (operandIndex < operands.length) {
      const operand = operands[operandIndex]
      const token = this.tokens[this.tokenIndex + operandIndex + 1]

      if (token === null) {
        // end of line - no more operands
        break
      }

      if (token.value === 'COMMA') {
        this.tokenIndex += 1
        continue
      }
      if (!isTokenExpectedOperand(token, operand)) {
        throw new Error(
          createErrorMessage(
            token,
            this.tokens,
            this.tokenIndex,
            instruction.description,
            operands
          )
        )
      }

      if (operand === RdFormat || operand === RsFormat) {
        this.handleRegister(token, statementMachineCode)
      } else if (operand === ImmFormat) {
        this.handleImmediate(token, statementMachineCode)
      } else if (operand === OfstFormat) {
        this.handleOffset(token, statementMachineCode)
      } else if (operand === AddrFormat) {
        this.handleAddress(token, statementMachineCode)
      }

      operandIndex += 1
    }

    this.machineCode.push(...statementMachineCode)
  }

  handleLabel() {
    this.tokenIndex += 1 // Skip the label token
  }

  handleLabelRef(token: Token) {
    const label = token.value.includes(':')
      ? token.value.slice(0, -1)
      : token.value

    const address = this.symbolTable.get(label)

    if (address === undefined) {
      throw new Error(
        createErrorMessage(
          token,
          this.tokens,
          this.tokenIndex,
          'Label Reference not found. Did you forget to define it?'
        )
      )
    }

    this.machineCode.push(address)
  }

  handleAddress(token: Token, statementMachineCode: Array<number>) {
    let address = 0

    if (token.type === 'LABEL_REF') {
      const symbol = this.symbolTable.get(token.value)
      if (symbol === undefined) {
        throw new Error(
          createErrorMessage(
            token,
            this.tokens,
            this.tokenIndex,
            'Label Reference not found. Did you forget to define it?'
          )
        )
      }
      address = symbol
    } else {
      address = Number(token.value)
    }

    if (!isValidAddress(address, this.memoryRegions)) {
      throw new Error(
        createErrorMessage(
          token,
          this.tokens,
          this.tokenIndex,
          'Address value out of range. Check your memory regions.'
        )
      )
    }

    statementMachineCode.push(address)
  }

  handleOffset(token: Token, statementMachineCode: Array<number>) {
    let offset = 0

    if (token.type === 'LABEL_REF') {
      const symbol = this.symbolTable.get(token.value)
      if (symbol === undefined) {
        throw new Error(
          createErrorMessage(
            token,
            this.tokens,
            this.tokenIndex,
            'Label Reference not found. Did you forget to define it?'
          )
        )
      }
      offset = symbol - this.currentAddress
    } else {
      offset = Number(token.value)
    }

    if (offset < -128 || offset > 127) {
      throw new Error(
        createErrorMessage(
          token,
          this.tokens,
          this.tokenIndex,
          'Offset value out of range. Must be between -128 and 127.'
        )
      )
    }

    if (offset >= 0) {
      statementMachineCode.push(offset)
    } else {
      statementMachineCode.push((offset ^ 0xff) + 1)
    }
  }

  handleDirective(token: Token) {
    switch (token.value) {
      case '.asciiz':
        this.handleAsciiz(this.tokens[this.tokenIndex + 1])
        break
      case '.alloc_init':
        this.handleAllocInit(this.tokens[this.tokenIndex + 1])
        break
      case '.space':
        this.handleSpace(this.tokens[this.tokenIndex + 1])
        break
      case '.align':
        this.handleAlign(this.tokens[this.tokenIndex + 1])
        break
      default:
        // Todo - better error message
        // Compile Error at [line: y, column: x] - {Statement/Line} - {Directive} is not supported
        throw new Error(
          createErrorMessage(
            token,
            this.tokens,
            this.tokenIndex,
            `Directive not supported. Supported directives are: ${ValidDirectives.join(
              ', '
            )}`
          )
        )
    }
  }

  handleRegister(token: Token, statementMachineCode: Array<number>) {
    if (!ValidRegisters.includes(token.value)) {
      throw new Error(
        createErrorMessage(
          token,
          this.tokens,
          this.tokenIndex,
          'Invalid register. Valid registers are: ' + ValidRegisters.join(', ')
        )
      )
    }
    statementMachineCode.push(Registers[token.value as keyof typeof Registers])
  }

  handleImmediate(token: Token, statementMachineCode: Array<number>) {
    const immediate = Number(token.value)
    if (isNaN(immediate)) {
      throw new Error(
        createErrorMessage(
          token,
          this.tokens,
          this.tokenIndex,
          'Invalid immediate value. Must be a number.'
        )
      )
    }

    if (immediate >= 0 && immediate <= 255) {
      statementMachineCode.push(immediate)
    } else if (immediate < 0 && immediate >= -128) {
      statementMachineCode.push((immediate ^ 0xff) + 1)
    } else {
      throw new Error(
        createErrorMessage(
          token,
          this.tokens,
          this.tokenIndex,
          'Immediate value out of range. Must be between -128 and 255.'
        )
      )
    }
  }

  handleHex(token: Token): number {
    // Validate the hex value (e.g., check if it's a valid hex string)
    const hexValue = token.value.slice(2) // Remove the "0x" prefix
    const numberValue = parseInt(hexValue, 16)

    if (isNaN(numberValue)) {
      throw new Error(
        createErrorMessage(
          token,
          this.tokens,
          this.tokenIndex,
          'Invalid hex value. Must be a valid hex string.'
        )
      )
    }

    return numberValue
  }

  handleString(token: Token) {
    const string = token.value.slice(1, -1) // Remove quotes from string
    for (const char of string) {
      this.handleChar({ ...token, type: 'CHAR', value: char }, false, false) // Don't remove quotes, don't null terminate
    }
    this.machineCode.push(0) // Null terminate
  }

  handleChar(token: Token, removeQuotes = true, nullTerminated = true) {
    const char = removeQuotes ? token.value.slice(1, -1) : token.value
    this.machineCode.push(
      Instructions.LDI.opcode,
      Registers.R0,
      char.charCodeAt(0)
    )
    this.machineCode.push(
      Instructions.STR.opcode,
      Registers.R0,
      this.currentAddress
    )
    this.currentAddress += 1
    if (nullTerminated) {
      this.machineCode.push(0)
    }
  }

  handleAsciiz(token: Token) {
    // Allocates a string in memory
    // The string will be null terminated
    // for each character in the string, a byte will be allocated
    // .asciiz "Hello World!"
    const string = token.value.slice(1, -1) // Remove quotes from string
    this.handleString({ ...token, type: 'STRING', value: string })
  }

  handleAllocInit(token: Token) {
    const size = Number(token.value)
    const valueToken = this.tokens[this.tokenIndex + 1]
    const value =
      valueToken.type === 'HEX'
        ? this.handleHex(valueToken)
        : Number(valueToken.value)
    const maxValSize = Math.pow(2, size * 8) - 1
    if (value > maxValSize) {
      throw new Error(
        createErrorMessage(
          token,
          this.tokens,
          this.tokenIndex,
          `Value too large for specified size. Allocated: ${size} bytes. Max value: ${maxValSize}`
        )
      )
    }

    for (let i = 0; i < size; i++) {
      this.machineCode.push(Instructions.LDI.opcode, Registers.R0, value)
      this.machineCode.push(
        Instructions.STR.opcode,
        Registers.R0,
        this.currentAddress
      )
      this.currentAddress += 1
    }

    this.tokenIndex += 1 // To account for the size and value tokens
  }

  handleSpace(token: Token) {
    // Allocates a specified number of bytes in memory
    // The bytes will be filled with 0
    // .space 4 Allocates 4 bytes (32bits) and fills them with 0
    this.machineCode.push(Instructions.LDI.opcode, Registers.R0, 0)
    let size = Number(token.value)
    let i = 0
    while (i < size) {
      this.machineCode.push(
        Instructions.STR.opcode,
        Registers.R0,
        this.currentAddress
      )
      this.currentAddress += 1
      i += 1
    }
  }

  handleAlign(token: Token) {
    const boundary = Number(token.value)

    if (boundary <= 0) {
      throw new Error(
        createErrorMessage(
          token,
          this.tokens,
          this.tokenIndex,
          `Boundary ${boundary} must be greater than 0.`
        )
      )
    }

    const paddingSize = (boundary - (this.currentAddress % boundary)) % boundary

    for (let i = 0; i < paddingSize; i++) {
      this.machineCode.push(Instructions.LDI.opcode, Registers.R0, 0)
      this.machineCode.push(
        Instructions.STR.opcode,
        Registers.R0,
        this.currentAddress
      )
      this.currentAddress += 1
    }

    this.tokenIndex += 1 // To account for the boundary token
  }
}
