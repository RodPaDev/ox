export type OguRegister = number

export const OGU_REGISTERS = {
  TILE_DEF: 0,
  TILE_DEF_ADDR: 1,
  TILE_MAP: 2,
  TILE_MAP_ADDR: 3,
  SPRITE_DEF: 4,
  SPRITE_DEF_ADDR: 5,
  SPRITE_ATTR: 6,
  SPRITE_ATTR_ADDR: 7,
  PALETTE: 8,
  PALETTE_ADDR: 9,
  CONTROL: 10
}

// 8 bits per register
export const ControlBits = {
  background: 0b0000_0001, // 0 = off, 1 = on
  sprites: 0b0000_0010,
  tileMap: 0b0000_0100,
  tilePattern: 0b0000_1000
}

export const logOguRegisterTable = (registers: Uint8Array) => {
  /* eslint-disable no-console */
  console.table({
    TILE_DEF: registers[OGU_REGISTERS.TILE_DEF],
    TILE_MAP: registers[OGU_REGISTERS.TILE_MAP],
    SPRITE_DEF: registers[OGU_REGISTERS.SPRITE_DEF],
    SPRITE_ATTR: registers[OGU_REGISTERS.SPRITE_ATTR],
    PALETTE: registers[OGU_REGISTERS.PALETTE],
    CONTROL: registers[OGU_REGISTERS.CONTROL]
  })
}
