import * as readline from 'readline'
import fs from 'fs'

import CPU from './CPU'

import { DeviceRegisters } from './Shared/DeviceRegisters'
import { Registers } from './Shared/Registers'

const buffer = fs.readFileSync('out.bin')

// Create a new UINT8Array from the buffer
const machineCode = new Uint8Array(buffer)

const cpu = new CPU(machineCode)
cpu.run()

readline.emitKeypressEvents(process.stdin)

// TODO: make a more elegant solution for this but for testing purposes this works
if (process.stdin.isTTY) process.stdin.setRawMode(true)

process.stdin.on('keypress', (chunk, key) => {
  cpu.mmio.write(DeviceRegisters.KEYBOARD, key.sequence.charCodeAt(0))

  // If the user presses Command + Escape, exit the virtual machine
  if (key.meta && key.name === 'escape') {

    // eslint-disable-next-line no-console
    console.table(
      Object.keys(Registers).map(key => {
        return {
          name: key,
          value: cpu.getReg(Registers[key as keyof typeof Registers])
        }
      })
    )

    process.exit()
  }
})
