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
import { Token, ValidRegisters } from './types'
import { isTokenExpectedOperand, isValidAddress } from './utills'


export class CodeGenerator {
  symbolTable: Map<string, number>
  currentAddress: number = 0
  tokenIndex: number = 0
  tokens: Array<any>
  machineCode: Array<number> = []
  memoryRegions: IMemoryRegions

  constructor(
    symbolTable: Map<string, number>,
    tokens: Array<any>,
    memoryRegions: IMemoryRegions
  ) {
    this.symbolTable = symbolTable
    this.tokens = tokens
    this.memoryRegions = memoryRegions
  }

  generate() {}

  handleMnemonic(token: Token) {
    const instruction = Instructions[token.value as keyof typeof Instructions]
    if (!instruction) {
      throw new Error(`Invalid mnemonic: ${token.value}`)
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
        // Todo - better error message
        // Compile Error at [line: y, column: x] - {Statement/Line} - {Instruction Description} - Operands should be {operand1}, {operand2}, {operand3}
        throw new Error(
          `Instruction format should be ${instruction.description} `
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

    this.machineCode.concat(statementMachineCode)
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
      throw new Error(`Label not found: ${label}`)
    }

    this.machineCode.push(address)
  }

  handleAddress(token: Token, statementMachineCode: Array<number>) {
    let address = 0

    if (token.type === 'LABEL_REF') {
      const symbol = this.symbolTable.get(token.value)
      if (symbol === undefined) {
        throw new Error(`Label not found: ${token.value}`)
      }
      address = symbol
    } else {
      address = Number(token.value)
    }

    if (!isValidAddress(address, this.memoryRegions)) {
      throw new Error(`Invalid address: ${token.value}`)
    }

    statementMachineCode.push(address)
  }

  handleOffset(token: Token, statementMachineCode: Array<number>) {
    let offset = 0

    if (token.type === 'LABEL_REF') {
      const symbol = this.symbolTable.get(token.value)
      if (symbol === undefined) {
        throw new Error(`Label not found: ${token.value}`)
      }
      offset = symbol - this.currentAddress
    } else {
      offset = Number(token.value)
    }

    if (offset < -128 || offset > 127) {
      throw new Error(`Offset value out of range: ${token.value}`)
    }

    if (offset >= 0) {
      statementMachineCode.push(offset)
    } else {
      statementMachineCode.push((offset ^ 0xff) + 1)
    }
  }

  handleDirective(token: Token) {}

  handleRegister(token: Token, statementMachineCode: Array<number>) {
    if (!ValidRegisters.includes(token.value)) {
      throw new Error(`Invalid register: ${token.value}`)
    }
    statementMachineCode.push(Registers[token.value as keyof typeof Registers])
  }

  handleImmediate(token: Token, statementMachineCode: Array<number>) {
    const immediate = Number(token.value)
    if (isNaN(immediate)) {
      throw new Error(`Invalid immediate value: ${token.value}`)
    }

    if (immediate >= 0 && immediate <= 255) {
      statementMachineCode.push(immediate)
    } else if (immediate < 0 && immediate >= -128) {
      statementMachineCode.push((immediate ^ 0xff) + 1)
    } else {
      throw new Error(`Immediate value out of range: ${token.value}`)
    }
  }

  handleHex(token: Token): number {
    // Validate the hex value (e.g., check if it's a valid hex string)
    const hexValue = token.value.slice(2) // Remove the "0x" prefix
    const numberValue = parseInt(hexValue, 16)

    if (isNaN(numberValue)) {
      throw new Error(`Invalid hex value: ${token.value}`)
    }

    return numberValue
  }

  handleDecimal() {
    // Will maybe implement later if I decide to add support for decimal numbers
  }

  handleString(token: Token) {
    const string = token.value.slice(1, -1) // Remove quotes from string
    for (const char of string) {
      this.handleChar({ type: 'CHAR', value: char }, false, false) // Don't remove quotes, don't null terminate
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
    // .asciiz "Hello World!"
  }
  handleBytez(token: Token) {
    // This is a custom directive
    // It will take the size of bytes to allocate and the value to fill them with
    // this is to simplify the process of allocating a value in memory
    // instead of using .byte, .word, .dword, etc. there is only .bytez
    // .bytez 4, 0x00 Allocates 4 bytes (32bits) and fills them with 0x00
    // if the value exceeds the size of the allocated bytes, an error will be thrown
    // if the value is smaller then the allocated bytes,
    // the remaining bytes will be filled with 0 and a warning will be thrown
  }
  handleSpace(token: Token) {
    // Allocates a specified number of bytes in memory
    // The bytes will be filled with 0
    // .space 4 Allocates 4 bytes (32bits) and fills them with 0
  }
  handleAlign(token: Token) {
    // Aligns the current address to the specified boundary (e.g., 4, 8, 16, etc.)
    // If the current address is already aligned, nothing happens
    // If the current address is not aligned, it will be aligned to the next boundary
    // .align 4 Aligns the current address to the next 4 byte boundary
  }
}
