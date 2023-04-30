# OitoBit - 8-Bit Virtual CPU

This document provides an overview of the OitoBit, an 8-bit virtual CPU designed for simplicity and ease of implementation. It outlines the CPU's instruction set, registers, flags, memory organization, MMIO, and cartridge-based storage.

## 1. Instruction Set

The OitoBit virtual CPU uses a minimalistic instruction set that supports basic arithmetic, logic, control flow, and memory operations. The instructions are designed with a varying number of operands, depending on the operation. For example, some instructions might have one or two operands, while others may not have any.

## 1.1. Arithmetic Instructions

| Mnemonic | Opcode | Description                                                | Operands            |
| -------- | ------ | ---------------------------------------------------------- | ------------------- |
| ADD      | 0x01   | Add two registers and store the result in a register.      | Rdest, Rsrc1, Rsrc2 |
| SUB      | 0x02   | Subtract two registers and store the result in a register. | Rdest, Rsrc1, Rsrc2 |
| MUL      | 0x03   | Multiply two registers and store the result in a register. | Rdest, Rsrc1, Rsrc2 |
| DIV      | 0x04   | Divide two registers and store the result in a register.   | Rdest, Rsrc1, Rsrc2 |

## 1.2. Logic Instructions

| Mnemonic | Opcode | Description                                                                   | Operands            |
| -------- | ------ | ----------------------------------------------------------------------------- | ------------------- |
| AND      | 0x05   | Perform bitwise AND on two registers and store the result in a register.      | Rdest, Rsrc1, Rsrc2 |
| OR       | 0x06   | Perform bitwise OR on two registers and store the result in a register.       | Rdest, Rsrc1, Rsrc2 |
| XOR      | 0x07   | Perform bitwise XOR on two registers and store the result in a register.      | Rdest, Rsrc1, Rsrc2 |
| NOT      | 0x08   | Perform bitwise NOT on a register and store the result in a register.         | Rdest, Rsrc         |
| SHL      | 0x09   | Perform bitwise left shift on a register and store the result in a register.  | Rdest, Rsrc         |
| SHR      | 0x0A   | Perform bitwise right shift on a register and store the result in a register. | Rdest, Rsrc         |

## 1.3. Control Flow Instructions

| Mnemonic | Opcode | Description                                                                                                                                   | Operands             |
| -------- | ------ | --------------------------------------------------------------------------------------------------------------------------------------------- | -------------------- |
| JAL      | 0x0b   | Jump and link: jump to an absolute address in memory, store the return address in a register, and push the return address onto the stack.     | Rdest, Address       |
| JALR     | 0x0c   | Jump and link register: jump to an address in a register, store the return address in a register, and push the return address onto the stack. | Rdest, Rsrc          |
| BEQ      | 0x0d   | Branch if equal: jump to an address in memory if two registers are equal.                                                                     | Rsrc1, Rsrc2, Offset |
| BNE      | 0x0e   | Branch if not equal: jump to an address in memory if two registers are not equal.                                                             | Rsrc1, Rsrc2, Offset |
| BLT      | 0x0f   | Branch if less than: jump to an address in memory if one register is less than another.                                                       | Rsrc1, Rsrc2, Offset |
| BGE      | 0x10   | Branch if greater than or equal: jump to an address in memory if one register is greater than or equal to another.                            | Rsrc1, Rsrc2, Offset |
| BLE      | 0x11   | Branch if less than or equal: jump to an address in memory if one register is less than or equal to another.                                  | Rsrc1, Rsrc2, Offset |
| BGT      | 0x12   | Branch if greater than: jump to an address in memory if one register is greater than another.                                                 | Rsrc1, Rsrc2, Offset |
| RET      | 0x13   | Return from a subroutine by popping the return address from the stack and updating the program counter (PC) accordingly.                      | None                 |

## 1.4. Memory Instructions

| Mnemonic | Opcode | Description                                  | Operands         |
| -------- | ------ | -------------------------------------------- | ---------------- |
| LDR      | 0x14   | Load a value from memory into a register.    | Rdest, Address   |
| STR      | 0x15   | Store a value from a register to memory.     | Address, Rsrc    |
| LDI      | 0x16   | Load an immediate value into a register.     | Rdest, Immediate |
| PUSH     | 0x17   | Push a value from a register onto the stack. | Rsrc             |
| POP      | 0x18   | Pop a value from the stack into a register.  | Rdest            |

## 1.5. Miscellaneous Instructions

| Mnemonic | Opcode | Description                                | Operands    |
| -------- | ------ | ------------------------------------------ | ----------- |
| MOV      | 0x19   | Move a value from one register to another. | Rdest, Rsrc |
| NOP      | 0x1a   | No operation (do nothing).                 | None        |
| HLT      | 0x1b   | Halt the CPU execution.                    | None        |

## 1.6. I/O Instructions

| Mnemonic | Opcode | Description                                                   | Operands             |
| -------- | ------ | ------------------------------------------------------------- | -------------------- |
| IN       | 0x1c   | Read a value from an input device and store it in a register. | Rdest, DeviceAddress |
| OUT      | 0x1d   | Write a value from a register to an output device.            | Rsrc, DeviceAddress  |

## 2. Registers

The OitoBit virtual CPU has eight general-purpose 8-bit registers (R0-R7) that can be used for arithmetic, logic, and memory operations. Additionally, there are two 8-bit special-purpose registers: the Program Counter (PC) and the Stack Pointer (SP).

| Register | Description                     | Size   |
| -------- | ------------------------------- | ------ |
| R0-R7    | General-purpose 8-bit registers | 8 bits |
| PC       | 8-bit Program Counter           | 8 bits |
| IR       | 8-bit Instruction Register      | 8 bits |
| SP       | 8-bit Stack Pointer             | 8 bits |
| FLAGS    | 8-bit Status Flags              | 8 bits |

## 3. Flags

The OitoBit virtual CPU has two status flags: the Zero Flag (ZF) and the Sign Flag (SF). These flags are set or cleared based on the result of specific instructions.

| Flag | Description                                                                  |
| ---- | ---------------------------------------------------------------------------- |
| ZF   | Zero Flag: Set if the result of an operation is zero; cleared otherwise.     |
| SF   | Sign Flag: Set if the result of an operation is negative; cleared otherwise. |
| IF   | Interrupt Flag: Set if interrupts are enabled; cleared otherwise.            |
| CF   | Carry Flag: Set if the result of an operation overflows; cleared otherwise.  |

## 4. Memory Organization

The OitoBit virtual CPU has a 64KB (65536 bytes) addressable memory space. The memory is organized into the following regions:

| Region | Start Address | End Address | Description                         |
| ------ | ------------- | ----------- | ----------------------------------- |
| ROM    | 0x0000        | 0x0FFF      | Onboard firmware and BIOS           |
| RAM    | 0x1000        | 0x7FFF      | General-purpose data storage        |
| Stack  | 0x8000        | 0x8FFF      | Stack for subroutine calls and data |
| MMIO   | 0x9000        | 0x9FFF      | Memory-mapped I/O region            |

## 5. MMIO (Memory-Mapped I/O)

Memory-Mapped I/O (MMIO) is a technique used by the OitoBit virtual CPU to communicate with external devices, such as display, keyboard, audio, gamepad, and the cartridge. MMIO maps the control registers and data buffers of these devices into a specific region of the CPU's memory address space. This allows the CPU to read or write to these registers and buffers using standard memory access instructions.

## 5.1. MMIO Operation

When the CPU accesses a memory address within the MMIO region, the corresponding peripheral device detects the access and performs the required operation. For example, if the CPU writes a value to the display controller's control register, the display controller updates its internal state and performs any necessary actions, such as updating the screen.

Each device within the MMIO region has a specific address range reserved for its control registers and data buffers. The device responds only to memory accesses within its designated address range, ignoring other memory accesses.

| Device    | Start Address | End Address | Description         |
| --------- | ------------- | ----------- | ------------------- |
| Display   | 0x9000        | 0x900F      | Display controller  |
| Keyboard  | 0x9010        | 0x901F      | Keyboard controller |
| Audio     | 0x9020        | 0x902F      | Audio controller    |
| Gamepad   | 0x9030        | 0x903F      | Gamepad controller  |
| Cartridge | 0x9040        | 0x904F      | Cartridge interface |

## 6. Cartridge Support

The OitoBit virtual CPU supports cartridges that contain ROM and/or RAM. The cartridge interface is responsible for managing the connection between the virtual CPU and the cartridge, ensuring proper memory mapping and address translation.

## 6.1 Cartridge Interface

To integrate cartridges with the OitoBit virtual CPU, the cartridge interface must be implemented as part of the MMIO region. The cartridge interface is responsible for the following tasks:

- Detecting when a cartridge is inserted or removed.
- Mapping the cartridge ROM into the CPU's memory address space.
- Handling address translation between the CPU's memory accesses and the cartridge ROM.
- Managing any additional hardware features present in the cartridge, such as extra RAM or custom chips.

## 6.2. Cartridge Operation

When a cartridge is inserted into the system, the cartridge interface maps the cartridge ROM into the CPU's memory address space. This is achieved by defining a base address for the cartridge ROM and translating the CPU's memory accesses to the correct address within the cartridge ROM.

During program execution, the CPU reads instructions and data from the cartridge ROM as needed. The cartridge ROM is typically read-only, so the CPU cannot modify its contents. However, some cartridges may include writable memory, such as RAM or flash memory, which can be used to store data, such as save games, high scores, and other persistent information.

## 7. Clock Cycle and Emulation

To accurately emulate the OitoBit virtual CPU, the system must emulate the clock cycles that occur during each instruction's execution. Each instruction may take a different number of clock cycles to complete, depending on factors such as instruction type, addressing mode, and memory access requirements.

When emulating the CPU, the system should maintain a counter for the number of clock cycles that have elapsed. During each clock cycle, the CPU should perform the appropriate operations for the current instruction, such as fetching the next instruction, decoding it, executing the operation, updating registers and flags, and handling any required peripheral device communication.

## 7.1. Synchronizing Peripheral Devices

In addition to emulating the CPU's clock cycles, the system must also synchronize the operation of peripheral devices. These devices may have their own internal clocks or may rely on the CPU's clock signal for timing.

To maintain synchronization, the system should update the state of each peripheral device at regular intervals, typically after a fixed number of CPU clock cycles have elapsed. This allows the devices to respond to changes in their control registers and perform any required actions, such as updating the display or processing audio data.

## 8. Programming the OitoBit Virtual CPU with Assembly and High-Level Language

To create programs for the OitoBit virtual CPU, developers can use a combination of assembly language and a high-level programming language that can be compiled to generate assembly code. The assembly code can then be assembled into binary files that can be loaded into the virtual CPU's memory or stored on a virtual cartridge.

## 8.1. Assembly Language

Assembly language offers a direct, low-level representation of the OitoBit virtual CPU's instruction set and memory organization. This makes it well-suited for tasks that require precise control over the hardware, such as writing firmware, device drivers, or performance-critical routines.

To support the development of assembly language programs, an assembler specifically designed for the OitoBit virtual CPU should be created. This assembler will take assembly code as input and generate binary files that can be loaded into the virtual CPU's memory or stored on a cartridge.

## 8.2. High-Level Language

To improve productivity and enable more complex programs, a high-level language can be used to develop software for the OitoBit virtual CPU. The high-level language should be designed to compile into assembly code, which can then be assembled into binary files using the OitoBit assembler.

When designing the high-level language, the following features should be considered, taking into account the OitoBit virtual CPU's capabilities:

- Basic data types: Support for integers, characters, and boolean values.
- Control structures: Conditional statements (if, else) and loops (for, while).
  Functions and subroutines: Support for user-defined functions and subroutines with parameter passing and local variables.
- Memory management: Simple memory allocation and deallocation primitives, in accordance with the virtual CPU's memory organization.
- Input/Output: High-level abstractions for reading and writing data to peripheral devices:
  - display
  - keyboard
  - gamepad
  - audio
  - cartridge

## 8.3. Compiler and Toolchain

A compiler will be required to translate the high-level language code into assembly code for the OitoBit virtual CPU. The compiler should be designed to optimize the generated assembly code, taking into account the virtual CPU's instruction set and performance characteristics.

Additionally, a toolchain can be developed to streamline the process of compiling, assembling, linking, and debugging code for the OitoBit virtual CPU. This toolchain may include a linker to combine multiple object files into a single executable and a debugger to help identify and fix issues in the code.

## 9. Implementing ROM, Bootloader, and Firmware for the OitoBit Virtual CPU

The onboard ROM of the OitoBit virtual CPU plays a crucial role in booting up the system, initializing hardware, and providing a minimal OS with essential programs. The following components should be implemented to create a functional and versatile base system:

## 9.1. Bootloader

The bootloader resides in the onboard ROM and is responsible for initializing the virtual CPU, setting up memory, and loading the firmware or OS into RAM. The bootloader performs the following tasks:

- Initialize the CPU registers and flags.
- Set up memory regions, such as stack and MMIO.
- Load the firmware or OS from ROM into RAM.
- Transfer control to the firmware or OS entry point.

## 9.2. Firmware

The firmware is the core software that manages the OitoBit virtual CPU's hardware components and provides low-level functionality. It includes routines for:

- Handling interrupts and exceptions.
- Initializing and managing peripheral devices.
- Providing basic I/O operations for devices such as display, keyboard, and gamepad.

## 9.3. Minimal Shell OS

The minimal shell OS is a lightweight operating system that offers basic functionality and essential programs for users. The shell OS can include the following features and programs:

- A simple command-line interface to interact with the system.
- Text editor: A basic text editor for creating and modifying text files.
- Load Cartridge: A utility for loading and executing programs from cartridges.
- Basic Interpreter: An implementation of a Basic interpreter, such as Basic-80 or TinyBasic, to enable users to write and execute Basic programs.
- File Management: Basic file management utilities for browsing, copying, and deleting files.
- Settings: A utility for configuring system settings, such as display resolution, audio volume, and input mappings.
