import { MemoryRegions } from '../CPU/Memory'
import { CodeGenerator } from './CodeGenerator'
import { SymbolResolver } from './SymbolResolver'
import { Tokenizer } from './Tokenizer'

export function assemble(source: string) {
  const tokens = Tokenizer(source)

  const symbolTable = SymbolResolver(tokens)
  const codeGenerator = new CodeGenerator(symbolTable, tokens, MemoryRegions)
  const machineCode = codeGenerator.generate()

  return machineCode
}
