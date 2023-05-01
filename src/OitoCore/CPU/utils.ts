export function convertToSigned(value: number) {
  if (value < 128) {
    return value
  }
  return value - 256
}
