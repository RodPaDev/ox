// Todo: Create an actual CLI for this but for now I just use this

import fs from 'fs'
import { assemble } from '../Assembler'
import path from 'path'

// load source filepath from args

const args = process.argv.slice(2)

if (args.length === 0) {
  // eslint-disable-next-line no-console
  console.log('Usage: oito <source>')
  process.exit(1)
}

// eslint-disable-next-line no-console
console.log('Assembling...')
const source = fs.readFileSync(path.resolve(args[0]), 'utf8')

const machineCode = assemble(source)

const buffer = Buffer.from(machineCode)
fs.writeFileSync('out.bin', buffer, 'binary')

// eslint-disable-next-line no-console
console.log('Done!')
