// MMIO.ts
import { Memory } from '../CPU/Memory'
import { DeviceRegisters } from '../Shared/DeviceRegisters'
import { KeyboardDevice } from './Keyboard'

export class MMIO {
  private memory: Memory
  private keyboardDevice: KeyboardDevice

  constructor(memory: Memory) {
    this.memory = memory
    this.keyboardDevice = new KeyboardDevice()
  }

  public read(addr: number): number {
    if (addr === DeviceRegisters.KEYBOARD) {
      return this.keyboardDevice.read()
    }

    // Handle other devices here...

    // Fallback to reading directly from memory
    return this.memory.read(addr)
  }

  public write(addr: number, value: number): void {
    if (addr === DeviceRegisters.KEYBOARD) {
      this.keyboardDevice.write(value)
    }

    // Handle other devices here...

    // Fallback to writing directly to memory
    this.memory.write(addr, value)
  }
}
