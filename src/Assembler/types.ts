import {
  AddrFormat,
  ImmFormat,
  Instructions,
  OfstFormat,
  RdFormat,
  RsFormat
} from '../Shared/Instructions'

export type Token = {
  type: string
  value: string
}

export type SymbolTable = Map<string, number>

export type Tokens = Array<Token | null>

export const OperandFormatToTokenType = {
  [RdFormat]: 'REGISTER',
  [RsFormat]: 'REGISTER',
  [ImmFormat]: 'IMMEDIATE',
  [OfstFormat]: 'OFFSET',
  [AddrFormat]: 'ADDRESS'
}

export const TokenTypes = {
  MNEMONIC: '[A-Z]+', // Uppercase alphabetic characters (e.g., ADD, MOV, JMP)
  REGISTER: '[Rr][0-9]+', // Registers (e.g., R0, R1, R2)
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

export const ValidMnemonics = Object.values(Instructions).map(
  ({ name }) => name
)
// Only General Purpose Registers are valid. Other registers are reserved for special purposes.
export const ValidRegisters = ['R0', 'R1', 'R2', 'R3', 'R4', 'R5', 'R6', 'R7']
export const ValidDirectives = ['.asciiz', '.bytez', '.space', '.align']
