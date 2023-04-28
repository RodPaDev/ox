import CPU from './CPU'
import { Registers, logRegisterTable } from './Shared/Registers'

const cpu = new CPU()

cpu.LDI(Registers.R0, 4)
cpu.LDI(Registers.R1, 3)
cpu.ADD(Registers.R2, Registers.R0, Registers.R1)
cpu.MUL(Registers.R0, Registers.R2, Registers.R2)

logRegisterTable(cpu.registers)
