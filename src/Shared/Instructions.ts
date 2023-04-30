export type Rd = number
export const RdFormat = 'rd'
export type Rs = number
export const RsFormat = 'rs'
export type Addr = number
export const AddrFormat = 'addr'
export type Imm = number
export const ImmFormat = 'imm'
export type Ofst = number
export const OfstFormat = 'ofst'

enum InstructionFormats {
  Register = 'R',
  Immediate = 'I',
  Offset = 'O',
  Address = 'A',
  None = 'N'
}

export type InstructionDescription = {
  format: InstructionFormats
  name: string
  description: string
  operands: Array<string>
  opcode: number
}

export const Instructions = {
  ADD: {
    format: InstructionFormats.Register,
    name: 'ADD',
    description: 'Add two registers and store the result in a register',
    operands: [RdFormat, RsFormat, RsFormat],
    opcode: 0x01
  },
  SUB: {
    format: InstructionFormats.Register,
    name: 'SUB',
    description: 'Subtract two registers and store the result in a register',
    operands: [RdFormat, RsFormat, RsFormat],
    opcode: 0x02
  },
  MUL: {
    format: InstructionFormats.Register,
    name: 'MUL',
    description: 'Multiply two registers and store the result in a register',
    operands: [RdFormat, RsFormat, RsFormat],
    opcode: 0x03
  },
  DIV: {
    format: InstructionFormats.Register,
    name: 'DIV',
    description: 'Divide two registers and store the result in a register',
    operands: [RdFormat, RsFormat, RsFormat],
    opcode: 0x04
  },
  AND: {
    format: InstructionFormats.Register,
    name: 'AND',
    description: 'Bitwise AND two registers and store the result in a register',
    operands: [RdFormat, RsFormat, RsFormat],
    opcode: 0x05
  },
  OR: {
    format: InstructionFormats.Register,
    name: 'OR',
    description: 'Bitwise OR two registers and store the result in a register',
    operands: [RdFormat, RsFormat, RsFormat],
    opcode: 0x06
  },
  XOR: {
    format: InstructionFormats.Register,
    name: 'XOR',
    description: 'Bitwise XOR two registers and store the result in a register',
    operands: [RdFormat, RsFormat, RsFormat],
    opcode: 0x07
  },
  NOT: {
    format: InstructionFormats.Register,
    name: 'NOT',
    description: 'Bitwise NOT a register and store the result in a register',
    operands: [RdFormat, RsFormat],
    opcode: 0x08
  },
  SHL: {
    format: InstructionFormats.Register,
    name: 'SHL',
    description: 'Shift a register left and store the result in a register',
    operands: [RdFormat, RsFormat],
    opcode: 0x09
  },
  SHR: {
    format: InstructionFormats.Register,
    name: 'SHR',
    description: 'Shift a register right and store the result in a register',
    operands: [RdFormat, RsFormat],
    opcode: 0x0a
  },
  JAL: {
    format: InstructionFormats.Address,
    name: 'JAL',
    description:
      'Jump and link: jump to an absolute address in memory, store the return address in a register, and push the return address onto the stack.',
    operands: [RdFormat, AddrFormat],
    opcode: 0x0b
  },
  JALR: {
    format: InstructionFormats.Register,
    name: 'JALR',
    description:
      'Jump and link register: jump to an address in a register, store the return address in a register, and push the return address onto the stack.',
    operands: [RdFormat, RsFormat],
    opcode: 0x0c
  },
  BEQ: {
    format: InstructionFormats.Offset,
    name: 'BEQ',
    description:
      'Branch if equal: jump to an address in memory if two registers are equal.',
    operands: [RsFormat, RsFormat, OfstFormat],
    opcode: 0x0d
  },
  BNE: {
    format: InstructionFormats.Offset,
    name: 'BNE',
    description:
      'Branch if not equal: jump to an address in memory if two registers are not equal.',
    operands: [RsFormat, RsFormat, OfstFormat],
    opcode: 0x0e
  },
  BLT: {
    format: InstructionFormats.Offset,
    name: 'BLT',
    description:
      'Branch if less than: jump to an address in memory if one register is less than another.',
    operands: [RsFormat, RsFormat, OfstFormat],
    opcode: 0x0f
  },
  BGE: {
    format: InstructionFormats.Offset,
    name: 'BGE',
    description:
      'Branch if greater than or equal: jump to an address in memory if one register is greater than or equal to another.',
    operands: [RsFormat, RsFormat, OfstFormat],
    opcode: 0x10
  },
  BLE: {
    format: InstructionFormats.Offset,
    name: 'BLE',
    description:
      'Branch if less than or equal: jump to an address in memory if one register is less than or equal to another.',
    operands: [RsFormat, RsFormat, OfstFormat],
    opcode: 0x11
  },
  BGT: {
    format: InstructionFormats.Offset,
    name: 'BGT',
    description:
      'Branch if greater than: jump to an address in memory if one register is greater than another.',
    operands: [RsFormat, RsFormat, OfstFormat],
    opcode: 0x12
  },
  RET: {
    format: InstructionFormats.None,
    name: 'RET',
    description:
      'Return from a subroutine: pop the return address from the stack and jump to it.',
    operands: [],
    opcode: 0x13
  },
  LDR: {
    format: InstructionFormats.Register,
    name: 'LDR',
    description: 'Load a value from memory into a register.',
    operands: [RdFormat, AddrFormat],
    opcode: 0x14
  },
  STR: {
    format: InstructionFormats.Register,
    name: 'STR',
    description: 'Store a value from a register into memory.',
    operands: [AddrFormat, RsFormat],
    opcode: 0x15
  },
  LDI: {
    format: InstructionFormats.Immediate,
    name: 'LDI',
    description: 'Load an immediate value into a register.',
    operands: [RdFormat, ImmFormat],
    opcode: 0x16
  },
  PUSH: {
    format: InstructionFormats.Register,
    name: 'PUSH',
    description: 'Push a register onto the stack.',
    operands: [RsFormat],
    opcode: 0x17
  },
  POP: {
    format: InstructionFormats.Register,
    name: 'POP',
    description: 'Pop a value from the stack into a register.',
    operands: [RdFormat],
    opcode: 0x18
  },
  MOV: {
    format: InstructionFormats.Register,
    name: 'MOV',
    description: 'Move a value from one register to another.',
    operands: [RdFormat, RsFormat],
    opcode: 0x19
  },
  NOP: {
    format: InstructionFormats.None,
    name: 'NOP',
    description: 'No operation: do nothing.',
    operands: [],
    opcode: 0x1a
  },
  HLT: {
    format: InstructionFormats.None,
    name: 'HLT',
    description: 'Halt: stop the CPU.',
    operands: [],
    opcode: 0x1b
  },
  IN: {
    format: InstructionFormats.Immediate,
    name: 'IN',
    description: 'Read a value from an input device address into a register.',
    operands: [RdFormat, AddrFormat],
    opcode: 0x1c
  },
  OUT: {
    format: InstructionFormats.Register,
    name: 'OUT',
    description:
      'Write a value from a register to an output device via an address.',
    operands: [RsFormat, AddrFormat],
    opcode: 0x1d
  }
}
