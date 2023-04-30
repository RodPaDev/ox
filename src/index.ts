import * as readline from 'readline'

import CPU from './CPU'

import { DeviceRegisters } from './Shared/DeviceRegisters'

const cpu = new CPU()

readline.emitKeypressEvents(process.stdin)

// TODO: make a more elegant solution for this but for testing purposes this works
if (process.stdin.isTTY) process.stdin.setRawMode(true)

process.stdin.on('keypress', (chunk, key) => {
  cpu.mmio.write(DeviceRegisters.KEYBOARD, key.sequence.charCodeAt(0))

  // If the user presses Command + Escape, exit the virtual machine
  if (key.meta && key.name === 'escape') {
    process.exit()
  }
})
