import { MemoryRegions } from '../CPU/Memory'
import { Instructions } from '../Shared/Instructions'
import { Registers } from '../Shared/Registers'

const exampleSource = `
; Initialize registers
LDI R1, 5
LDI R2, 3

; Perform arithmetic operations
ADD R3, R1, R2 ; R3 = R1 + R2
SUB R4, R1, R2 ; R4 = R1 - R2
MUL R5, R1, R2 ; R5 = R1 * R2
DIV R6, R1, R2 ; R6 = R1 / R2

; Store the results in memory
STR 0x100, R3 ; Store the addition result at address 0x100
STR 0x101, R4 ; Store the subtraction result at address 0x101
STR 0x102, R5 ; Store the multiplication result at address 0x102
STR 0x103, R6 ; Store the division result at address 0x103

; Load values from memory into registers
LDR R7, 0x100 ; R7 = Memory[0x100]
LDR R8, 0x101 ; R8 = Memory[0x101]

; Check if R7 is equal to R8
BEQ R7, R8, equal

; If not equal, jump to not_equal
BNE R7, R8, not_equal

equal:
  ; Execute instructions for equal case
  NOP
  JAL R0, end ; Jump to 'end' without using the link

not_equal:
  ; Execute instructions for not equal case
  NOP

end:
  HLT ; Halt the CPU

string .asciiz "Hello, world!"
string .asciiz 'O'

`

const TokenTypes = {
  MNEMONIC: '[A-Z]+', // Uppercase alphabetic characters (e.g., ADD, MOV, JMP)
  REGISTER: 'R[0-9]+', // Registers (e.g., R0, R1, R2)
  IMMEDIATE: '#[0-9]+', // Immediate values (e.g., #42)
  LABEL: '[a-zA-Z0-9_]+:', // Labels (e.g., loop_start:)
  LABEL_REF: '[a-zA-Z0-9_]+', // Label references (e.g., loop_start) - should be the last type checked because other types can match this regex
  DIRECTIVE: '\\.[a-zA-Z0-9_]+', // Directives (e.g., .data, .org)
  HEX_VALUE: '0x[0-9a-fA-F]+', // Hexadecimal values (e.g., 0x1F)
  DEC_VALUE: '[0-9]+', // Decimal values (e.g., 42)
  COMMA: ',', // Comma delimiter (used to separate operands)
  WHITESPACE: '\\s+', // Whitespace (spaces, tabs, newlines)
  COMMENT: ';[^\n]*', // Comments (e.g., ; This is a comment)
  STRING: '"[^"]*"', // Strings (e.g., "Hello, world!")
  CHARACTER: "'[^']'" // Characters (e.g., 'A')
}

const ValidMnemonics = Object.keys(Instructions)
const ValidRegisters = Object.keys(Registers)
const ValidDirectives = ['.data', '.asciiz', '.org']

export function assemble(source: string) {
  const tokens = tokenize(source)

  const symbolTable = firstPass(tokens)

  // second pass

  console.log(symbolTable)
}

export function firstPass(tokens: Array<any>) {
  const symbolTable = new Map<string, number>()

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

export function secondPass(
  tokens: Array<any>,
  symbolTable: Map<string, number>
) {
  const machineCode = []

  let tokenIndex = 0
  while (tokenIndex < tokens.length) {
    const token = tokens[tokenIndex]

    if (token === null) {
      // End of line
      tokenIndex++
      continue
    }

    switch (token.type) {
      case 'MNEMONIC':
        // Generate the machine code for the mnemonic and its operands
        // Use the symbolTable to resolve label references
        // If the mnemonic is a branch instruction then calculate the offset
        // If the mnemonic is a jump instruction then calculate the address
        // If the mnemonic is not found then throw an error
        break

      case 'LABEL':
        // Skip labels, as they are already handled in the first pass
        break

      case 'LABEL_REF':
        // Get the address from the symbol table corresponding to the label reference
        break

      case 'DIRECTIVE':
        // Handle each directive individually
        // For .data, store the value in memory
        // For .org, set the current address
        // For .asciiz, allocate space in memory for the string, and store each character's ASCII value
        break

      case 'REGISTER':
        // Map the register to its binary value or corresponding register number
        break

      case 'IMMEDIATE':
        // Handle immediate values
        // If the immediate value is larger than the maximum allowed size (e.g., 8 bits), throw an error
        // If the immediate value is negative, handle it accordingly (e.g., using two's complement)
        break

      case 'HEX_VALUE':
        // Handle hexadecimal values by converting them to their corresponding binary or decimal values
        break

      case 'DEC_VALUE':
        // Handle decimal values by converting them to their corresponding binary values
        break

      case 'COMMA':
        // Ignore commas, as they are only used as separators between operands
        break

      case 'STRING':
        // Handle strings by splitting the string into characters and storing each character's ASCII value in memory
        break

      case 'CHARACTER':
        // Handle characters by storing the character's ASCII value in memory
        break

      default:
        // Throw an error for unexpected token types
        throw new Error(`Unexpected token type: ${token.type}`)
    }

    tokenIndex += 1
  }

  return machineCode
}

export function tokenize(source: string) {
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
