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
  line: number
  column: number
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

/*
 REGISTER: '[Rr][0-9]+',
  DIRECTIVE: '\\.[a-zA-Z0-9_]+',
  MNEMONIC: '[A-Z]+',
  IMMEDIATE: '#[0-9]+',
  LABEL: '[a-zA-Z_][a-zA-Z0-9_]*:',
  HEX_VALUE: '0x[0-9a-fA-F]+',
  DEC_VALUE: '#[0-9]+',
  COMMA: ',',
  WHITESPACE: '\\s+',
  COMMENT: ';[^\n]*',
  STRING: '"[^"]*"',
  CHARACTER: "'[^']'",
  LABEL_REF: '[a-zA-Z_][a-zA-Z0-9_]*'
  */

export const TokenTypes = [
  {
    tokenType: 'REGISTER',
    regex: new RegExp('[Rr][0-9]+')
  },
  {
    tokenType: 'DIRECTIVE',
    regex: new RegExp('^\\.[a-z]+')
  },
  {
    tokenType: 'MNEMONIC',
    regex: new RegExp('^[A-Z][A-Za-z]*(?!\\"|\\\')$')
  },
  {
    tokenType: 'IMMEDIATE',
    regex: new RegExp('^#[0-9]+')
  },
  {
    tokenType: 'OFFSET',
    regex: new RegExp('#[0-9]+')
  },
  {
    tokenType: 'LABEL',
    regex: new RegExp('[a-zA-Z_][a-zA-Z0-9_]*:')
  },
  {
    tokenType: 'HEX_VALUE',
    regex: new RegExp('0x[0-9a-fA-F]+')
  },
  {
    tokenType: 'COMMA',
    regex: new RegExp(',')
  },
  {
    tokenType: 'WHITESPACE',
    regex: new RegExp('\\s+')
  },
  {
    tokenType: 'COMMENT',
    regex: new RegExp(';[^\n]*')
  },
  {
    tokenType: 'LITERAL',
    regex: new RegExp(/(['"])(.*?)\1/)
  },
  {
    tokenType: 'LABEL_REF',
    regex: new RegExp('[a-zA-Z_][a-zA-Z0-9_]*')
  }
]

export const ValidMnemonics = Object.values(Instructions).map(
  ({ name }) => name
)
// Only General Purpose Registers are valid. Other registers are reserved for special purposes.
export const ValidRegisters = ['R0', 'R1', 'R2', 'R3', 'R4', 'R5', 'R6', 'R7']
export const ValidDirectives = ['.asciiz', '.alloc_init', '.space', '.align']
