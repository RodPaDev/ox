import { Memory, MemoryRegions } from './Memory'
import { Registers, logRegisterTable } from '../Shared/Registers'
import { Address, Rdest, Rsrc, Immediate, Offset } from '../Shared/Instructions'
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

  setReg(register: number, value: number) {
    this.registers[register] = value
  }

  setFlag(flag: number, value: boolean) {
    if (value) {
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

  ADD(rdest: Rdest, rsrc1: Rsrc, rsrc2: Rsrc) {
    const srcVal1 = this.getReg(rsrc1)
    const srcVal2 = this.getReg(rsrc2)
    const sum = srcVal1 + srcVal2

    this.setReg(rdest, sum & 0xff)

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
  SUB(rdest: Rdest, rsrc1: Rsrc, rsrc2: Rsrc) {
    const srcVal1 = this.getReg(rsrc1)
    const srcVal2 = this.getReg(rsrc2)
    const result = srcVal1 - srcVal2

    this.setReg(rdest, result & 0xff)

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

  MUL(rdest: Rdest, rsrc1: Rsrc, rsrc2: Rsrc) {
    const srcVal1 = this.getReg(rsrc1)
    const srcVal2 = this.getReg(rsrc2)
    const result = srcVal1 * srcVal2

    this.setReg(rdest, result & 0xff)

    const carry = result > 0xff
    this.setFlag(Flags.CF, carry)

    const sign = (result & 0x80) !== 0
    this.setFlag(Flags.SF, sign)

    // prettier-ignore
    const overflow =  (srcVal1 & 0x80) === (srcVal2 & 0x80) && sign !== ((srcVal1 & 0x80) !== 0)
    this.setFlag(Flags.OF, overflow)
  }

  DIV(rdest: Rdest, rsrc1: Rsrc, rsrc2: Rsrc) {
    const srcVal1 = this.getReg(rsrc1)
    const srcVal2 = this.getReg(rsrc2)
    const result = srcVal1 / srcVal2

    this.setReg(rdest, result & 0xff)

    const carry = false // Division doesn't have a carry flag
    this.setFlag(Flags.CF, carry)

    const sign = (result & 0x80) !== 0
    this.setFlag(Flags.SF, sign)

    const overflow = false // Division doesn't have an overflow flag
    this.setFlag(Flags.OF, overflow)
  }

  AND(rdest: Rdest, rsrc1: Rsrc, rsrc2: Rsrc) {
    const srcVal1 = this.getReg(rsrc1)
    const srcVal2 = this.getReg(rsrc2)
    const result = srcVal1 & srcVal2

    this.setReg(rdest, result)
  }
  OR(rdest: Rdest, rsrc1: Rsrc, rsrc2: Rsrc) {
    const srcVal1 = this.getReg(rsrc1)
    const srcVal2 = this.getReg(rsrc2)
    const result = srcVal1 | srcVal2

    this.setReg(rdest, result)
  }
  XOR(rdest: Rdest, rsrc1: Rsrc, rsrc2: Rsrc) {
    const srcVal1 = this.getReg(rsrc1)
    const srcVal2 = this.getReg(rsrc2)
    const result = srcVal1 ^ srcVal2

    this.setReg(rdest, result)
  }
  NOT(rdest: Rdest, rsrc: Rsrc) {
    const srcVal = this.getReg(rsrc)
    const result = ~srcVal

    this.setReg(rdest, result)
  }
  SHL(rdest: Rdest, rsrc: Rsrc, value: Immediate) {
    const srcVal = this.getReg(rsrc)
    const result = srcVal << value

    this.setReg(rdest, result)
  }
  SHR(rdest: Rdest, rsrc: Rsrc, value: Immediate) {
    const srcVal = this.getReg(rsrc)
    const result = srcVal >> value

    this.setReg(rdest, result)
  }
  JAL(rdest: Rdest, addr: Address) {
    this.setReg(rdest, this.getReg(Registers.PC) + 1)

    // Push return address onto the stack
    const sp = this.getReg(Registers.SP)
    this.memory.write(sp, this.getReg(Registers.PC) + 1)
    this.setReg(Registers.SP, sp + 1)

    // Jump to the target address
    this.setReg(Registers.PC, addr)
  }

  JALR(rdest: Rdest, rsrc: Rsrc) {
    this.setReg(rdest, this.getReg(Registers.PC) + 1)

    // Push return address onto the stack
    const sp = this.getReg(Registers.SP)
    this.memory.write(sp, this.getReg(Registers.PC) + 1)
    this.setReg(Registers.SP, sp + 1)

    // Jump to the target address from the source register
    const addr = this.getReg(rsrc)
    this.setReg(Registers.PC, addr)
  }
  BEQ(rsrc1: Rsrc, rsrc2: Rsrc, offset: Offset) {
    const srcVal1 = this.getReg(rsrc1)
    const srcVal2 = this.getReg(rsrc2)

    if (srcVal1 === srcVal2) {
      this.setReg(Registers.PC, this.getReg(Registers.PC) + offset)
    }
  }
  BNE(rsrc1: Rsrc, rsrc2: Rsrc, offset: Offset) {
    const srcVal1 = this.getReg(rsrc1)
    const srcVal2 = this.getReg(rsrc2)

    if (srcVal1 !== srcVal2) {
      this.setReg(Registers.PC, this.getReg(Registers.PC) + offset)
    }
  }
  BLT(rsrc1: Rsrc, rsrc2: Rsrc, offset: Offset) {
    const srcVal1 = this.getReg(rsrc1)
    const srcVal2 = this.getReg(rsrc2)

    if (srcVal1 < srcVal2) {
      this.setReg(Registers.PC, this.getReg(Registers.PC) + offset)
    }
  }
  BGE(rsrc1: Rsrc, rsrc2: Rsrc, offset: Offset) {
    const srcVal1 = this.getReg(rsrc1)
    const srcVal2 = this.getReg(rsrc2)

    if (srcVal1 >= srcVal2) {
      this.setReg(Registers.PC, this.getReg(Registers.PC) + offset)
    }
  }
  RET() {
    const returnAddress = this.memory.read(this.getReg(Registers.SP)) // Pop return address from the stack
    this.setReg(Registers.SP, this.getReg(Registers.SP) + 1) // Increment the stack pointer
    this.setReg(Registers.PC, returnAddress) // Set PC to the return address
  }
  LDR(rdest: Rdest, addr: Address) {
    this.setReg(rdest, this.memory.read(addr))
  }
  STR(addr: Address, rsrc: Rsrc) {
    this.memory.write(addr, this.getReg(rsrc))
  }
  LDI(rdest: Rdest, immediate: Immediate) {
    this.setReg(rdest, immediate)
  }
  PUSH(rsrc: Rsrc) {
    const sp = this.getReg(Registers.SP)
    this.memory.write(sp, this.getReg(rsrc))
    this.setReg(Registers.SP, sp - 1)
  }
  POP(rdest: Rdest) {
    const sp = this.getReg(Registers.SP)
    this.setReg(Registers.SP, sp + 1)
    this.setReg(rdest, this.memory.read(sp))
  }
  MOV(rdest: Rdest, rsrc: Rsrc) {
    const srcVal = this.getReg(rsrc)
    this.setReg(rdest, srcVal)
  }
  NOP() {
    // do nothing
  }
  HLT() {
    this.halted = true
  }

  IN(rdest: Rdest, addr: Address) {
    const value = this.mmio.read(addr)
    this.setReg(rdest, value)
  }

  OUT(addr: Address, rsrc: Rsrc) {
    const value = this.getReg(rsrc)
    this.mmio.write(addr, value)
  }
}
