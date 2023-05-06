import { OGU_REGISTERS, OguRegister } from './Registers'
import { VideoMemory } from './VRAM'

let width = 256
let height = 240
let tileWidth = 8
let tileHeight = 8
let tileMapSize = (width / tileWidth) * (height / tileHeight)
let tilePatternsSize = tileMapSize * tileWidth * tileHeight

const VRAM_REGIONS = {
  TILE_PATTERN_TABLE: 0x0000,
  TILE_MAP: parseInt(tilePatternsSize.toString(16), 16)
}

export class OGU {
  vram: VideoMemory
  registers: Uint8Array

  constructor() {
    this.vram = new VideoMemory()
    this.registers = new Uint8Array(Object.keys(OGU_REGISTERS).length)
  }

  getReg(register: OguRegister) {
    return this.registers[register]
  }

  setReg(register: OguRegister, value: number) {
    this.registers[register] = value
  }

  write(address: OguRegister, value: number): void {
    switch (address) {
      case OGU_REGISTERS.TILE_DEF:
        const currentTileDefAddr = this.getReg(OGU_REGISTERS.TILE_DEF_ADDR)
        this.vram.write(currentTileDefAddr, value)
        break

      case OGU_REGISTERS.TILE_MAP:
        const currentTileMapAddr = this.getReg(OGU_REGISTERS.TILE_MAP_ADDR)
        this.vram.write(currentTileMapAddr, value)
        break

      case OGU_REGISTERS.SPRITE_DEF:
        const currentSpriteDefAddr = this.getReg(OGU_REGISTERS.SPRITE_DEF_ADDR)
        this.vram.write(currentSpriteDefAddr, value)
        break

      case OGU_REGISTERS.SPRITE_ATTR:
        const currentSpriteAttrAddr = this.getReg(
          OGU_REGISTERS.SPRITE_ATTR_ADDR
        )
        this.vram.write(currentSpriteAttrAddr, value)
        break

      case OGU_REGISTERS.PALETTE:
        const currentPaletteAddr = this.getReg(OGU_REGISTERS.PALETTE_ADDR)
        this.vram.write(currentPaletteAddr, value)
        break

      case OGU_REGISTERS.CONTROL:
        this.setReg(address, value)
        break

      default:
        throw new Error(`Invalid OGU register address: ${address}`)
    }
  }

  read(address: OguRegister) {
    switch (address) {
      case OGU_REGISTERS.TILE_DEF:
        const currentTileDefAddr = this.getReg(OGU_REGISTERS.TILE_DEF_ADDR)
        return this.vram.read(currentTileDefAddr)

      case OGU_REGISTERS.TILE_MAP:
        const currentTileMapAddr = this.getReg(OGU_REGISTERS.TILE_MAP_ADDR)
        return this.vram.read(currentTileMapAddr)

      case OGU_REGISTERS.SPRITE_DEF:
        const currentSpriteDefAddr = this.getReg(OGU_REGISTERS.SPRITE_DEF_ADDR)
        return this.vram.read(currentSpriteDefAddr)

      case OGU_REGISTERS.SPRITE_ATTR:
        const currentSpriteAttrAddr = this.getReg(
          OGU_REGISTERS.SPRITE_ATTR_ADDR
        )
        return this.vram.read(currentSpriteAttrAddr)

      case OGU_REGISTERS.PALETTE:
        const currentPaletteAddr = this.getReg(OGU_REGISTERS.PALETTE_ADDR)
        return this.vram.read(currentPaletteAddr)

      case OGU_REGISTERS.CONTROL:
        return this.getReg(OGU_REGISTERS.CONTROL)

      default:
        throw new Error(`Invalid OGU register address: ${address}`)
    }
  }

  render() {
    // This method will be responsible for generating the final image based
    // on the current state of the OGU and the contents of the VRAM.
    // This method should handle the rendering of background tiles and sprites.
  }

  update() {
    // This method will update the internal state of the OGU, such as updating the scroll position or sprite animations.
    // It should be called periodically, e.g., once per frame.
  }

  isControlBitSet(bit: number): boolean {
    return (this.getReg(OGU_REGISTERS.CONTROL) & bit) === bit
  }

  /* Register Adresser Setters */
  setTileDefAddr(value: number) {
    this.setReg(OGU_REGISTERS.TILE_DEF_ADDR, value)
  }

  setTileMapAddr(value: number) {
    this.setReg(OGU_REGISTERS.TILE_MAP_ADDR, value)
  }

  setSpriteDefAddr(value: number) {
    this.setReg(OGU_REGISTERS.SPRITE_DEF_ADDR, value)
  }

  setSpriteAttrAddr(value: number) {
    this.setReg(OGU_REGISTERS.SPRITE_ATTR_ADDR, value)
  }

  setPaletteAddr(value: number) {
    this.setReg(OGU_REGISTERS.PALETTE_ADDR, value)
  }
}
