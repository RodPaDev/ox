export interface IMemoryRegions {
  ROM: number
  RAM: number
  Stack: number
  IO: number
}

export const MemoryRegions = {
  ROM: 0x0000, // 0x0000 - 0x0fff (4KB)
  RAM: 0x1000, // 0x1000 - 0x7fff (28KB)
  Stack: 0x8000, // 0x8000 - 0x8fff (4KB)
  IO: 0x9000 // 0x9000 - 0x9fff (4KB)
}

export class Memory {
  memory: Uint8Array

  constructor(ROM = new Uint8Array(0)) {
    this.memory = new Uint8Array(MemoryRegions.IO + 1)

    if (ROM.length > MemoryRegions.RAM) {
      throw new Error('ROM is too big')
    }

    this.memory.set(ROM, MemoryRegions.ROM)
  }

  read(address: number): number {
    return this.memory[address]
  }

  write(address: number, value: number): void {
    this.memory[address] = value
  }
}
