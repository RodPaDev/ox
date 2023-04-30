import { Memory, MemoryRegions } from './Memory'
import { Registers, logRegisterTable } from '../Shared/Registers'
import { Addr, Rd, Rs, Imm, Ofst } from '../Shared/Instructions'
import { Flags } from '../Shared/Flags'
import { convertToSigned } from './utils'
import { MMIO } from '../MMIO'

export default class CPU {
  halted: boolean = false
  registers: Uint8Array
  memory: Memory
  mmio: MMIO

  // Cycle
  private targetFPS = 60
  private mhz = 8
  private instructionsPerSecond = this.mhz * 1_000_000 // 8 MHz (8 million instructions per second)
  private instructionsPerFrame = this.instructionsPerSecond / this.targetFPS
  private delayBetweenInstructions = 1000 / this.instructionsPerSecond // 1 second / instructions per second

  constructor(rom: Uint8Array = new Uint8Array(0)) {
    this.registers = new Uint8Array(Object.keys(Registers).length)
    this.memory = new Memory(rom)
    this.mmio = new MMIO(this.memory)

    // Initialize the stack pointer
    this.setReg(Registers.SP, MemoryRegions.Stack)

    // Initialize the program counter
    this.setReg(Registers.PC, MemoryRegions.ROM)

    // Initialize the instruction register
    this.setReg(Registers.IR, 0)

    // Initialize the status register
    this.setReg(Registers.FLAGS, 0)
  }

  /*
    Helper Functions
  */

  getReg(register: number) {
    return this.registers[register]
  }

  setReg(register: number, regVal: number) {
    this.registers[register] = regVal
  }

  setFlag(flag: number, flagVal: boolean) {
    if (flagVal) {
      this.registers[Registers.FLAGS] |= flag
    } else {
      this.registers[Registers.FLAGS] &= ~flag
    }
  }

  isFlagSet(flag: number): boolean {
    return (this.registers[Registers.FLAGS] & flag) !== 0
  }

  /*
    Fetch-Decode-Execute Cycle
  */

  run() {
    let instructionsExecuted = 0
    while (!this.halted && instructionsExecuted < this.instructionsPerFrame) {
      // this.execute()
      instructionsExecuted += 1
    }

    setTimeout(() => this.run(), this.delayBetweenInstructions)
  }

  fetch() {}

  decode() {}

  execute() {}

  /*
    Instructions
  */

  ADD(rd: Rd, rs1: Rs, rs2: Rs) {
    const srcVal1 = this.getReg(rs1)
    const srcVal2 = this.getReg(rs2)
    const sum = srcVal1 + srcVal2

    this.setReg(rd, sum & 0xff)

    const carry = sum > 0xff
    this.setFlag(Flags.CF, carry)

    const srcSignedVal1 = convertToSigned(srcVal1)
    const srcSignedVal2 = convertToSigned(srcVal2)
    const signedSum = srcSignedVal1 + srcSignedVal2

    const sign = (sum & 0x80) !== 0
    this.setFlag(Flags.SF, sign)

    const overflow =
      ((srcSignedVal1 ^ signedSum) & (srcSignedVal2 ^ signedSum) & 0x80) !== 0

    this.setFlag(Flags.OF, overflow)
  }
  SUB(rd: Rd, rs1: Rs, rs2: Rs) {
    const srcVal1 = this.getReg(rs1)
    const srcVal2 = this.getReg(rs2)
    const result = srcVal1 - srcVal2

    this.setReg(rd, result & 0xff)

    const carry = srcVal1 < srcVal2
    this.setFlag(Flags.CF, carry)

    const srcSignedVal1 = convertToSigned(srcVal1)
    const srcSignedVal2 = convertToSigned(srcVal2)
    const signedResult = srcSignedVal1 - srcSignedVal2

    const sign = (result & 0x80) !== 0
    this.setFlag(Flags.SF, sign)

    // prettier-ignore
    const overflow =  ((srcSignedVal1 ^ srcSignedVal2 ^ 0x80) &  (srcSignedVal1 ^ signedResult) &   0x80) !==   0
    this.setFlag(Flags.OF, overflow)
  }

  MUL(rd: Rd, rs1: Rs, rs2: Rs) {
    const srcVal1 = this.getReg(rs1)
    const srcVal2 = this.getReg(rs2)
    const result = srcVal1 * srcVal2

    this.setReg(rd, result & 0xff)

    const carry = result > 0xff
    this.setFlag(Flags.CF, carry)

    const sign = (result & 0x80) !== 0
    this.setFlag(Flags.SF, sign)

    // prettier-ignore
    const overflow =  (srcVal1 & 0x80) === (srcVal2 & 0x80) && sign !== ((srcVal1 & 0x80) !== 0)
    this.setFlag(Flags.OF, overflow)
  }

  DIV(rd: Rd, rs1: Rs, rs2: Rs) {
    const srcVal1 = this.getReg(rs1)
    const srcVal2 = this.getReg(rs2)
    const result = srcVal1 / srcVal2

    this.setReg(rd, result & 0xff)

    const carry = false // Division doesn't have a carry flag
    this.setFlag(Flags.CF, carry)

    const sign = (result & 0x80) !== 0
    this.setFlag(Flags.SF, sign)

    const overflow = false // Division doesn't have an overflow flag
    this.setFlag(Flags.OF, overflow)
  }

  AND(rd: Rd, rs1: Rs, rs2: Rs) {
    const srcVal1 = this.getReg(rs1)
    const srcVal2 = this.getReg(rs2)
    const result = srcVal1 & srcVal2

    this.setReg(rd, result)
  }
  OR(rd: Rd, rs1: Rs, rs2: Rs) {
    const srcVal1 = this.getReg(rs1)
    const srcVal2 = this.getReg(rs2)
    const result = srcVal1 | srcVal2

    this.setReg(rd, result)
  }
  XOR(rd: Rd, rs1: Rs, rs2: Rs) {
    const srcVal1 = this.getReg(rs1)
    const srcVal2 = this.getReg(rs2)
    const result = srcVal1 ^ srcVal2

    this.setReg(rd, result)
  }
  NOT(rd: Rd, rs: Rs) {
    const srcVal = this.getReg(rs)
    const result = ~srcVal

    this.setReg(rd, result)
  }
  SHL(rd: Rd, rs: Rs, imm: Imm) {
    const srcVal = this.getReg(rs)
    const result = srcVal << imm

    this.setReg(rd, result)
  }
  SHR(rd: Rd, rs: Rs, imm: Imm) {
    const srcVal = this.getReg(rs)
    const result = srcVal >> imm

    this.setReg(rd, result)
  }
  JAL(rd: Rd, addr: Addr) {
    this.setReg(rd, this.getReg(Registers.PC) + 1)

    // Push return address onto the stack
    const sp = this.getReg(Registers.SP)
    this.memory.write(sp, this.getReg(Registers.PC) + 1)
    this.setReg(Registers.SP, sp + 1)

    // Jump to the target address
    this.setReg(Registers.PC, addr)
  }

  JALR(rd: Rd, rs: Rs) {
    this.setReg(rd, this.getReg(Registers.PC) + 1)

    // Push return address onto the stack
    const sp = this.getReg(Registers.SP)
    this.memory.write(sp, this.getReg(Registers.PC) + 1)
    this.setReg(Registers.SP, sp + 1)

    // Jump to the target address from the source register
    const addr = this.getReg(rs)
    this.setReg(Registers.PC, addr)
  }
  BEQ(rs1: Rs, rs2: Rs, ofst: Ofst) {
    const srcVal1 = this.getReg(rs1)
    const srcVal2 = this.getReg(rs2)

    if (srcVal1 === srcVal2) {
      this.setReg(Registers.PC, this.getReg(Registers.PC) + ofst)
    }
  }
  BNE(rs1: Rs, rs2: Rs, ofst: Ofst) {
    const srcVal1 = this.getReg(rs1)
    const srcVal2 = this.getReg(rs2)

    if (srcVal1 !== srcVal2) {
      this.setReg(Registers.PC, this.getReg(Registers.PC) + ofst)
    }
  }
  BLT(rs1: Rs, rs2: Rs, ofst: Ofst) {
    const srcVal1 = this.getReg(rs1)
    const srcVal2 = this.getReg(rs2)

    if (srcVal1 < srcVal2) {
      this.setReg(Registers.PC, this.getReg(Registers.PC) + ofst)
    }
  }
  BGE(rs1: Rs, rs2: Rs, ofst: Ofst) {
    const srcVal1 = this.getReg(rs1)
    const srcVal2 = this.getReg(rs2)

    if (srcVal1 >= srcVal2) {
      this.setReg(Registers.PC, this.getReg(Registers.PC) + ofst)
    }
  }
  RET() {
    const returnAddress = this.memory.read(this.getReg(Registers.SP)) // Pop return address from the stack
    this.setReg(Registers.SP, this.getReg(Registers.SP) + 1) // Increment the stack pointer
    this.setReg(Registers.PC, returnAddress) // Set PC to the return address
  }
  LDR(rd: Rd, addr: Addr) {
    this.setReg(rd, this.memory.read(addr))
  }
  STR(addr: Addr, rs: Rs) {
    this.memory.write(addr, this.getReg(rs))
  }
  LDI(rd: Rd, immediate: Imm) {
    this.setReg(rd, immediate)
  }
  PUSH(rs: Rs) {
    const sp = this.getReg(Registers.SP)
    this.memory.write(sp, this.getReg(rs))
    this.setReg(Registers.SP, sp - 1)
  }
  POP(rd: Rd) {
    const sp = this.getReg(Registers.SP)
    this.setReg(Registers.SP, sp + 1)
    this.setReg(rd, this.memory.read(sp))
  }
  MOV(rd: Rd, rs: Rs) {
    const srcVal = this.getReg(rs)
    this.setReg(rd, srcVal)
  }
  NOP() {
    // do nothing
  }
  HLT() {
    this.halted = true
  }

  IN(rd: Rd, addr: Addr) {
    const value = this.mmio.read(addr)
    this.setReg(rd, value)
  }

  OUT(addr: Addr, rs: Rs) {
    const value = this.getReg(rs)
    this.mmio.write(addr, value)
  }
}
