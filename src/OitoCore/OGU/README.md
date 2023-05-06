# Oito Graphical Unit (OGU) Specification - Extended Version

## Introduction

The Oito Graphical Unit (OGU) is a custom co-processor designed for the Oito Emulator. The OGU aims to provide simplified graphics capabilities that support the development of games similar to Super Mario Bros while minimizing the complexity of the implementation. The OGU features a tile-based rendering approach, sprite rendering, a fixed function pipeline, a limited color palette, and instruction-based communication with the main CPU.

## Tile-based Rendering

The OGU uses a tile-based rendering approach to draw the screen. The display is divided into a grid of tiles, where each tile consists of a fixed size (e.g., 8x8 pixels). The screen resolution is 256x240 pixels, resulting in a grid of 32x30 tiles.

Tile Definitions:

- Tile definitions are stored in a dedicated section of memory, with each tile definition consisting of a fixed number of bytes.
- Each tile definition includes the pixel data for the tile, where each pixel is represented by a color index from the palette.
- The number of tile definitions is limited to keep memory usage reasonable (e.g., 256 or 512 tile definitions).

Tile Map:

- The Tile Map is a separate section of memory that maps the tile definitions to the screen grid.
- Each entry in the Tile Map corresponds to a tile on the screen and contains the index of the tile definition to be displayed at that position.

## Sprite Rendering

The OGU supports sprite rendering, allowing for small images to be drawn independently of the tile grid. Sprites can be used for characters, items, and other game objects that need to move or change independently of the background.

Sprite Definitions:

- Sprite definitions are stored in a dedicated section of memory, similar to tile definitions.
- Each sprite definition includes the pixel data for the sprite, where each pixel is represented by a color index from the palette.
- The number of sprite definitions is limited to keep memory usage reasonable (e.g., 64 or 128 sprite definitions).

Sprite Attributes:

- Each sprite on the screen has a set of attributes that define its position, size, and appearance.
- Sprite attributes include the X and Y coordinates, the index of the sprite definition, and optional flags for flipping the sprite horizontally or vertically.
- The OGU can support a limited number of sprites on the screen at once (e.g., 32 or 64 sprites).

Rendering Process:

- The OGU renders the screen in two passes: first, it renders the tiles based on the Tile Map, and then it renders the sprites on top of the tiles.
- A simple depth sorting or priority system can be used to handle overlaps and determine the drawing order of sprites.

## Fixed Function Pipeline

The OGU uses a fixed function pipeline for rendering graphics. Instead of allowing programmable shaders or other complex operations, the OGU provides a predefined set of operations for rendering tiles and sprites.

- Tile rendering: The OGU renders tiles based on the Tile Map and the tile definitions in memory. It updates the screen by drawing the tiles one by one, following the order of the Tile Map.
- Sprite rendering: The OGU renders sprites based on their attributes and the sprite definitions in memory. It updates the screen by drawing the sprites one by one, following the priority or depth sorting order.

## Limited Color Palette

The OGU uses an 8-bit color palette to keep memory requirements and rendering logic simple. The color palette can consist of a limited number of colors (e.g., 16 or 32 colors). Each color is represented by an 8-bit value, and each pixel in a tile or sprite uses a color index from the palette.

## Instruction-based Communication

The main CPU communicates with the OGU using instructions that target specific registers or memory locations. These instructions allow the CPU to control the OGU's behavior and modify its internal state.

Some of the operations the CPU can perform using these instructions include:

- Loading tile or sprite definitions into memory.
- Updating the Tile Map or sprite attributes.
- Changing the color palette.
- Controlling the rendering process (e.g., enabling/disabling specific layers, clearing the screen, etc.).

To facilitate this communication, the OGU exposes a set of registers or memory-mapped I/O (MMIO) locations that the CPU can access using the OUT and IN instructions. These registers or MMIO locations correspond to various aspects of the OGU's functionality, such as:

- Tile definition memory.
- Tile Map memory.
- Sprite definition memory.
- Sprite attribute memory.
- Color palette memory.
- Control registers (e.g., enabling/disabling layers, clearing the screen, etc.).

Example instructions for communication between the main CPU and the OGU might include:

- OUT(OGU_REG_TILE_DEF, value): Write a value to the current tile definition memory location.
- OUT(OGU_REG_TILE_MAP, value): Write a value to the current Tile Map memory location.
- OUT(OGU_REG_SPRITE_DEF, value): Write a value to the current sprite definition memory location.
- OUT(OGU_REG_SPRITE_ATTR, value): Write a value to the current sprite attribute memory location.
- OUT(OGU_REG_PALETTE, value): Write a value to the current color palette memory location.
- OUT(OGU_REG_CONTROL, value): Write a value to the control register, affecting the OGU's behavior.

By using these instructions and registers, the main CPU can control the OGU's rendering process and generate graphics for the emulator. This approach provides a balance between simplicity and flexibility, enabling the development of a wide range of games while keeping the implementation straightforward.

## Rendering Pipeline

The OGU processes graphics in a sequence of stages called the rendering pipeline. The pipeline consists of several steps that transform and combine graphical data into a final framebuffer, which is then displayed on the screen.

The typical stages in the OGU rendering pipeline include:

1. Tile and sprite data fetching: The OGU reads tile and sprite definitions from its memory, converting the stored data into a format suitable for rendering. This stage may involve decompressing or decoding graphical data, depending on the storage format.

2. Tile Map processing: The OGU processes the Tile Map to determine the positions and properties of tiles on the screen. This stage may involve applying transformations or scrolling effects to create parallax or other visual effects.

3. Sprite processing: The OGU processes sprite attributes to determine the positions, sizes, and orientations of sprites on the screen. This stage may involve applying transformations or animations to create dynamic, moving objects.

4. Layer composition: The OGU composes the Tile Map and sprite layers to create the final framebuffer. This stage involves blending and combining the layers according to their depth and transparency properties.

5. Color palette application: The OGU applies the color palette to the framebuffer, converting the indexed color data into RGB values suitable for display.

6. Framebuffer output: The OGU sends the final framebuffer to the display for rendering. This stage may involve scaling or filtering the framebuffer to fit the display resolution or aspect ratio.

## Interrupts and Synchronization

To maintain smooth animation and gameplay, the OGU and the main CPU must synchronize their operations. This synchronization can be achieved using interrupts or other signaling mechanisms.

For example, the OGU might generate a Vertical Blank (VBlank) interrupt when it has finished rendering a frame and is ready to receive new graphical data. The main CPU can then update the OGU's memory with new tile, sprite, and color palette information in response to the VBlank interrupt, ensuring that the updated data is used for the next frame.

By synchronizing their operations in this way, the OGU and main CPU can work together to create smooth, responsive graphics for the emulator.
