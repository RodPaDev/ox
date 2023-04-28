export type Register = number
export type Flag = number

export const Registers = {
  R0: 0,
  R1: 1,
  R2: 2,
  R3: 3,
  R4: 4,
  R5: 5,
  R6: 6,
  R7: 7,
  PC: 8,
  IR: 9,
  SP: 10,
  FLAGS: 11
}

export const logRegisterTable = (registers: Uint8Array) => {
  /* eslint-disable no-console */
  console.table({
    RO: registers[Registers.R0],
    R1: registers[Registers.R1],
    R2: registers[Registers.R2],
    R3: registers[Registers.R3],
    R4: registers[Registers.R4],
    R5: registers[Registers.R5],
    R6: registers[Registers.R6],
    R7: registers[Registers.R7],
    PC: registers[Registers.PC],
    IR: registers[Registers.IR],
    SP: registers[Registers.SP],
    FLAGS: registers[Registers.FLAGS]
  })
}


