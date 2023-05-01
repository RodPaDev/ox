// KeyboardDevice.ts

export interface KeyEvent {
  key: string
}

export const KEYBOARD_REGISTER = 0x9010

export class KeyboardDevice {
  private buffer: number[]
  private currentIndex: number

  constructor() {
    this.buffer = []
    this.currentIndex = 0
  }

  public read(): number {
    if (this.currentIndex < this.buffer.length) {
      const value = this.buffer[this.currentIndex]
      this.currentIndex += 1
      return value
    } else {
      return 0
    }
  }

  public write(value: number): void {
    this.buffer.push(value)
  }
}
