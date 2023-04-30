import { MemoryRegions } from '../CPU/Memory'
import { CodeGenerator } from './CodeGenerator'
import { SymbolResolver } from './SymbolResolver'
import { Tokenizer } from './Tokenizer'

const exampleSource = `
; Initialize registers
LDI R1, #5
LDI R2, #3

; Perform arithmetic operations
ADD R3, R1, R2 ; R3 = R1 + R2
SUB R4, R1, R2 ; R4 = R1 - R2
MUL R5, R1, R2 ; R5 = R1 * R2
DIV R6, R1, R2 ; R6 = R1 / R2

; Store the results in memory
STR 0x100, R3 ; Store the addition result at address 0x100
STR 0x101, R4 ; Store the subtraction result at address 0x101
STR 0x102, R5 ; Store the multiplication result at address 0x102
STR 0x103, R6 ; Store the division result at address 0x103

; Load values from memory into registers
LDR R1, 0x100 ; R7 = Memory[0x100]
LDR R2, 0x101 ; R8 = Memory[0x101]

; Check if R7 is equal to R8
BEQ R1, R2, equal

; If not equal, jump to not_equal
BNE R1, R2, not_equal

equal:
  ; Execute instructions for equal case
  NOP
  JAL R0, end ; Jump to 'end' without using the link

not_equal:
  ; Execute instructions for not equal case
  NOP

end:
  HLT ; Halt the CPU

.asciiz "Hello, world!"
string: .asciiz 'O'
`
export function assemble(source: string) {
  const tokens = Tokenizer(source)

  const symbolTable = SymbolResolver(tokens)
  const codeGenerator = new CodeGenerator(symbolTable, tokens, MemoryRegions)
  const machineCode = codeGenerator.generate()

  return machineCode
}

console.log(assemble(exampleSource))