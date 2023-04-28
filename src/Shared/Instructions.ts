export const Instructions = {
  ADD: 0x01, // Add
  SUB: 0x02, // Subtract
  MUL: 0x03, // Multiply
  DIV: 0x04, // Divide
  AND: 0x05, // Bitwise AND
  OR: 0x06, // Bitwise OR
  XOR: 0x07, // Bitwise XOR
  NOT: 0x08, // Bitwise NOT
  SHL: 0x09, // Shift Left
  SHR: 0x0a, // Shift Right
  JAL: 0x0b, // Jump and Link
  JALR: 0x0c, // Jump and Link Register
  BEQ: 0x0d, // Branch if Equal
  BNE: 0x0e, // Branch if Not Equal
  BLT: 0x0f, // Branch if Less Than
  BGE: 0x10, // Branch if Greater Than or Equal
  BLE: 0x11, // Branch if Less Than or Equal
  BGT: 0x12, // Branch if Greater Than
  RET: 0x13, // Return
  LDR: 0x14, // Load Register
  STR: 0x15, // Store Register
  LDI: 0x16, // Load Immediate
  PUSH: 0x17, // Push
  POP: 0x18, // Pop
  MOV: 0x19, // Move
  NOP: 0x1a, // No Operation
  HLT: 0x1b // Halt
}

export type Rdest = number
export type Rsrc = number
export type Address = number
export type Immediate = number
export type Offset = number
