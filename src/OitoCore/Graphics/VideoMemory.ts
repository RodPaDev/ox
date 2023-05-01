export class VideoMemory {
  private memory: Uint8Array

  constructor(KB: number = 64) {
    this.memory = new Uint8Array(KB * 1024)
  }

  read(address: number): number {
    return this.memory[address]
  }

  write(address: number, value: number): void {
    this.memory[address] = value
  }
}
