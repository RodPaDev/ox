import { IMemoryRegions } from '../CPU/Memory'
import { AddrFormat, OfstFormat } from '../Shared/Instructions'
import { OperandFormatToTokenType, Token } from './types'

export function isTokenExpectedOperand(token: Token, operand: string) {
  const expectedTokenType =
    OperandFormatToTokenType[operand as keyof typeof OperandFormatToTokenType]

  // If the token type is a label, also allow offset and address operands
  if (token.type === 'LABEL_REF') {
    return operand === OfstFormat || operand === AddrFormat
  }
  if (token.type === 'HEX_VALUE') {
    return operand === AddrFormat
  }
  return token.type === expectedTokenType
}

export function isValidAddress(address: number, memoryRegions: IMemoryRegions) {
  return (
    (address >= memoryRegions.ROM && address <= memoryRegions.IO) ||
    (address >= memoryRegions.RAM && address <= memoryRegions.Stack + 0x0fff)
  )
}
