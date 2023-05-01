# OitoLang

In the realm of computer programming, there is a constant pursuit of balance between ease of use and powerful functionality. OitoLang, designed specifically for an 8-bit virtual CPU. Oito means eight in Portuguese, and the language is named after the 8-bit CPU, OitoBit.

## Philosophy

The primary philosophy behind OitoLang is simplicity. The aim is to remove all the unnecessary complexities found in many modern programming languages and provide an easy way to code for the 8-bit system. OitoLang should be easy to use, yet powerful enough that you can create complex programs with it without having to deal with the complexities of modern programming languages.

OitoLang deliberately avoids implementing Object-Oriented Programming (OOP) features, and there are no plans to add OOP support in the future. This decision is in line with the philosophy of simplicity, as OOP can add complexity and overhead to the language. By focusing on a functional and procedural programming paradigm, OitoLang remains lightweight and straightforward, making it easier for developers to write efficient code for the 8-bit system.

The language is statically typed, which helps in catching errors early during the compile-time, providing better performance and ensuring type safety. To further promote simplicity, built-in functions are kept minimal on purpose. The standard library will extend any functionality by exposing one Extension per data type, such as string functions, array functions, and so on.

## Features

- Simple, easy-to-read syntax
- Static typing
- C-like structure
- Ownership & borrowing system for memory management
- Compiled language
- Primitive data types (e.g., int, float, string, etc.) and user-defined data types
- Conditional expressions and loops
- User-defined functions and function signatures
- Type casting and type aliases
- Modular code organization with imports and exports (MEME)
- Error handling and custom exceptions
- Built-in support for common data structures (e.g., arrays, lists, maps, etc.)
- Support for inline assembly for low-level optimizations (WIP)
- Documentation features such as comments and docstrings (WIP)
- Minimal built-in functions
- Standard library (String, Array, List, Map, Math, IO, etc...)
- No OOP support

## Examples

A simple Hello World program in OitoLang:

```js

fn main() {
    print("Hello World!");
}

```

A simple program to count word frequency

```js

import { get as MapGet, add as MapAdd, entries as MapEntries } from std:map
import { len, get as ListGet } from std:list
import { readLine } from std:io
import { split } from std:str

type Word = string
type Frequency = int
type WordFrequencyMap = Map<Word, Frequency>

fn countWords(text: &string): WordFrequencyMap {
    // List and Maps need to use var instead of const because they are mutable
    // You can initialize them with const but you can't use any of the mutating functions
    // It will throw an error if you do
    var wordFrequency: WordFrequencyMap = {}

    // Split the text into words
    const words: list<string> = split(text, ' ')

    // Iterate through words and update the frequency map
    for var i = 0; i < len(words); i++ { // this will throw a compile warning because we are unnecessarily copying the value of words to len. We can fix this by using a reference instead
        const word: string = ListGet(&words, i)
        if word == "" {
            continue
        }

        const frequency = MapGet(&wordFrequency, word) // here we are not borrowing but instead we are copying the value of word

        if(frequency == null) {
            frequency = 0
        }
        MapAdd(&wordFrequency, word, frequency + 1) // once again we are not borrowing but instead we are copying the value of word
    }

    return wordFrequency
}

fn main() {
    // Read a line of text from user input
    print("Enter a line of text: ")
    const text: string = readLine()

    // Calculate word frequencies. Borrowing text to avoid copying and is immutable but since & is immutable borrow it's safe to use with const
    const wordFrequencies: WordFrequencyMap = countWords(&text)

    // Display the word frequencies
    print("Word frequencies:");

    const entries: list<Word, Frequency> = MapEntries(wordFrequencies)

    for var i = 0; i < len(entries); i++ {
        const word = entries[i][0]
        const frequency = entries[i][1]

        print(word, ": ", frequency);
    }
}

```

Lastly a simple program

## Data types

The OitoLang has the following data types:

| Data type | Size (bits) | Description                                                                                                                                                        |
| --------- | ----------- | ------------------------------------------------------------------------------------------------------------------------------------------------------------------ |
| `int`     | 8           | signed integer                                                                                                                                                     |
| `uint`    | 8           | unsigned integer                                                                                                                                                   |
| `float`   | 8           | floating point number                                                                                                                                              |
| `ufloat`  | 8           | unsigned floating point number                                                                                                                                     |
| `bool`    | 1           | 1-bit boolean                                                                                                                                                      |
| `char`    | 8           | 8-bit character                                                                                                                                                    |
| `string`  | 8 \* n      | multiple 8-bit characters                                                                                                                                          |
| `array`   | 8 \* n      | multiple values of the same type with a fixed size                                                                                                                 |
| `list`    | 8 \* n      | multiple values of the same type with a dynamic size                                                                                                               |
| `map`     | 8 \* n      | multiple values of different types with a dynamic size and a key. The key can be string or int. The value can be any type. The map is implemented as a hash table. |
| `struct`  | 8 \* n      | multiple values of different types with a fixed size. The struct is implemented as a struct in C.                                                                  |
| `null`    | 0           | pointer value that does not point to any valid data object                                                                                                         |

### Operators

OitoLang includes the following operators:

### Arithmetic operators

Arithmetic operators can be used with the following data types: `int`, `float` and `char`.
All arithmetic operators have assignment operators that can be used to assign the result to a variable. For example: `a += 10`.

- `+`: addition
- `-`: subtraction
- `*`: multiplication
- `/`: division
- `%`: modulo

### Comparison operators

- `==`: equal
- `!=`: not equal
- `>`: greater than
- `<`: less than
- `>=`: greater than or equal
- `<=`: less than or equal
- `&&`: and
- `||`: or
- `!`: not

### Bitwise operators

Bitwise operators can be used with the following data types: `int` and `char`.
All bitwise operators have assignment operators that can be used to assign the result to a variable. For example: `a &= 10`.

- `&`: bitwise and
- `|`: bitwise or
- `^`: bitwise xor
- `~`: bitwise not
- `<<`: bitwise left shift
- `>>`: bitwise right shift

### Control flow

The OitoLang has the following control flow statements:

- `if` statement
- `if else` statement
- `else` statement
- `match` statement
- `while` statement
- `for` statement
- `break` statement
- `continue` statement
- `return` statement

### If statement

The `if` statement is used to execute a block of code if a condition is true.

```js

if a == 10 {
    // do something
} else if a == 20 {
    // do something else
} else {
    // do something else
}

```

### Match statement

The `match` statement is used to match a value against multiple patterns. The `no_match` pattern is used to match any value.
Unlike switch statements in other languages, the `match` statement does not fallthrough to the next pattern. If you want to fallthrough to the next pattern, you have to use the `thru` keyword.

You can use the `thru` keyword to fallthrough to the next pattern.

```rust
match a {
    10 => {
        // do something
    }
    20 => {
        // do something else
        thru // fallthrough to the next pattern
    }
    no_match => {
        // do something else
    }
}
```

### While statement

The `while` statement is used to execute a block of code while a condition is true.

```js

while a < 10 {
    // do something
}

```

### For statement

The `for` statement is used to execute a block of code for a number of times.

```js

for i = 0; i < 10; i += 1 {
    // do something
}

```

### Break statement

The `break` statement is used to break out of a loop.

```js

while true { // same for for loops
    break
}

```

### Continue statement

The `continue` statement is used to continue to the next iteration of a loop.

```js

for i = 0; i < 10; i += 1 { // same for while loops
    continue
}

```

### Variables

OitoLang has two types of variables: mutable and immutable. Mutable variables are declared with the var keyword, and immutable variables are declared with the const keyword.

The philosophy behind this is that `const` are for values that never change and are constant throughout the program, and `var` are for values that can change.
You can still borrow a constant but you can't modify it.
You can also borrow a mutable variable mutably or immutably.

```js
var a = 10; // mutable
const b = 20; // immutable
```

### Functions

Functions are declared with the `fn` keyword. The return type is declared after the arguments. If the function doesn't return anything, the return type is void. Void functions do not need a return statement. The function body is wrapped in curly braces, and the return statement is used to return a value from the function.

```js

fn add(a: int, b: int): int {
    return a + b
}

fn main(): void {
    var a: int = add(10, 20)
}

```

### Ownership and Borrowing

OitoLang introduces ownership and borrowing concepts similar to Rust, which allows you to manage memory safety without a garbage collector. To do this, you can use the `&` and `#` symbols to indicate whether a variable is being borrowed immutably or mutably.

### Immutable Borrowing

When a function needs to read the value of a variable without modifying it, you can use the `&` symbol to indicate that the variable is being borrowed immutably. Here's an example of a function `add` that takes two variables and returns their sum:

```js
fn add(a: &int, b: &int): int {
    return a + b;
}
```

In this example, the `&` symbol in the function signature indicates that the variables `a` and `b` are being borrowed immutably. This means the function can read the values of `a` and `b` but cannot modify them.

When calling the `add` function, you would use the same `&` symbol to indicate that the variables are being borrowed:

```js
var x = 10;
var y = 20;
var sum = add(&x, &y);

const z = 30;
sum = add(&x, &z); // still works because & is a borrwed immutably
```

### Mutable Borrowing

When a function needs to modify a mutable variable, you can use the `#` symbol to indicate that the variable is being borrowed mutably. Here's an example of a function `increment` that takes a mutable reference to an `int` and increments its value:

```js
fn increment(a: #int) {
    #a += 1;
}
```

In this example, the `#` symbol in the function signature indicates that the variable `a` is being borrowed mutably. This allows the function to modify the value of `a`.

To call the `increment` function, you would use the `#` symbol:

```js
increment(#x);

const y = 10;
increment(#y); // error: cannot borrow immutable variable `y` as mutable becaues y is defined as const
```

By using this borrowing system, OitoLang allows you to manage memory safely while maintaining simplicity in the language's design.

### Comments

OitoLang has two types of comments: single line comments and multi-line comments.

```js
// This is a single line comment

/*
This is a multi line comment
*/
```

### Arrays

Arrays are declared with the `type[]` syntax. The array size is declared after the type. The array size must be a constant value.

```js

var a: int[10] = [1, 2, 3, 4, 5, 6, 7, 8, 9, 10]
// or
var a: int[10] = []  // all values are null
// or
var a: int[10] = [...1] // all values are 1
// or
var a: int[10] = [0..10] // values are 0 to 10
// or
var a: int[10] = [0..5, 7..9, ...null] // values are 0 to 5 and 7 to 9 (6 is skipped) and fill the rest with null

```

### Lists

Lists are declared with the `list` keyword. The list size is not declared. The list size is dynamic.

```js
var a: list<int> = [];
```

### Maps

Maps are declared with the `map` keyword. The map size is not declared. The map size is dynamic.
Keys can be `int` or `string`. Values can be any type.

```js
var a: map<int, int> = {};
```

### Structs

Structs are declared with the `struct` keyword. Structs are key-value pairs. The key is the name of the field and the value is the type of the field.
Structs can be nested but are of fixed size.

```js
struct Person {
    name: string
    age: int
}

```

### Strings and chars

Strings use double quotes, and chars use single quotes.

```js
var a: string = 'Hello World';
var b: char = 'a';
```

### Null

Null is a special value representing the absence of a value. Null is used to initialize variables or to indicate that a value is not present. Nulls can be used with all data types. A void function returns null. Constants cannot be null for obvious reasons.

I may remove the null type in the future.

```js
var a: int = null;
var b: string = null;
var c: list<int> = null;
var d: map<int, int> = null;
```

### Type casting

OitoLang uses explicit type casting. A type casting function is used to convert a value from one type to another. The type casting function is declared after the type name. Type casting is subject to certain rules and restrictions, depending on the types involved. For example, casting between numeric types is generally allowed, but attempting to cast between incompatible types (e.g., from a string to an integer) would result in a compile-time error.

```js
var a: int = 10;
var b: float = float(a);
```

### Type aliases

Type aliases are declared with the `type` keyword. Type aliases are used to give a type a different name, which can improve code readability by providing more descriptive names for types, especially when working with complex or user-defined types.

```js
type CoolNum = int;
var a: CoolNum = 10;
```

### Expressions

Expressions are used to compute values. Expressions can be used in variable declarations, function calls, return statements, etc.

```js
var a: int = 10 + 20;
var b: int = 10 * 20;
// etc
```

```js
// expression statement
var a: int = 10;
```

### Operators precedence

The OitoLang uses PEMDAS for operator precedence (Parentheses, Exponents, Multiplication, Division, Addition, Subtraction) and the following table for operator associativity.

| Operator | Associativity |
| -------- | ------------- |
| `=`      | Right         |
| `+=`     | Right         |
| `-=`     | Right         |
| `*=`     | Right         |
| `/=`     | Right         |
| `%=`     | Right         |
| `^=`     | Right         |
| `++`     | Right         |
| `--`     | Right         |
| `!`      | Right         |
| `#`      | Right         |
| `*`      | Left          |
| `/`      | Left          |
| `%`      | Left          |
| `+`      | Left          |
| `-`      | Left          |
| `<<`     | Left          |
| `>>`     | Left          |
| `&`      | Left          |
| `^`      | Left          |
| `\|`     | Left          |
| `&&`     | Left          |
| `\|\|`   | Left          |
| `==`     | Left          |
| `!=`     | Left          |
| `<`      | Left          |
| `<=`     | Left          |
| `>`      | Left          |
| `>=`     | Left          |

### Error handling

The OitoLang uses exceptions for error handling. Exceptions are thrown with the `throw` keyword. Exceptions are caught with the `try` keyword. Exceptions are handled with the `catch` key

```js
try {
  throw 'Error';
} catch (e) {
  println(e);
}
```

### Built-in functions

There are some built-in functions that don't need to be imported.

- Type Casters (`#int`, `#float`, `#string`, `#bool`, `#char`, `#null`)
- Printers (`print`, `println`)
- Readers (`read`, `readln`)
- Type Related (`sizeof`, `typeof`)
- Memory Related (`malloc`, `free`, `realloc`)

### Compile Warnings

The OitoLang uses compile warnings to warn the user about possible errors. Compile warnings are not errors, but they should be fixed.
This could inlcude things like using len to get the length of a list but instead of borrowing the list, you are passing it by value.

```js
var a: list<int> = [1, 2, 3, 4, 5];
var b: int = len(a); // warning: len should be used with a borrowed list
```

Will output:

```
Compile Warnings:
 - At [line 3, column 13]: variable 'a' is passed by value to the len function. This could be a mistake. Consider borrowing the variable instead since this function does not modify the list.
```

Any function you create that takes borrowed paramters will display a warning if the user passes a value instead of a borrowed variable.

You can also create your own compile warnings with the `warn` keyword.

```js
func add(a: int, b: int): int {
    warn "This function is deprecated. Use the sum function instead."
    return a + b
}
```

Will output:

```
Compile Warnings:
 - At [line 2, column 5]: This function is deprecated. Use the sum function instead.
```

You can disable compile warning for a specific line or multiple lines with the `warn-disable-next-line` and `warn-disable-start` and `warn-disable-end` keywords.

```js
var a: list<int> = [1, 2, 3, 4, 5];
// warn-disable-next-line
var b: int = len(a);

// warn-disable-start
var c: int = len(a);
var d: int = len(a);
// warn-disable-end
```

You can disable all compile warnings with the `warn-disable-all` keyword at the top of the file.

```js
// warn-disable-all
```

If you want to disable all compile warnings for all files in a project, you can use the `--warnings` flag.

```bash
oito main.oo --warnings
```

### Modules, Extensions, Members and Environment (MEME)

Modules, extensions, members, and the environment provide a structured way to organize and manage code, while allowing access to imported elements.

Modules can be thought of as containers for code that export specific members or extensions. Members can be of all data types except null. Extensions are used to group related members together, providing a clean and logical organization.

The environment, which represents the global scope, provides access to imported modules and their contents, making them available for use throughout the program.

Here's an example of importing a module with members:

```js
// Import the abs member from the math extension of the std module.
import { abs } from std:math
// Here's another example of importing a module but not choosing an extension.
import { foo } from bar

var a: int = abs(-10)
var b: int = foo()

```

To create a module with members, follow this structure:

```js
// DataStructures.oo

// Assume create, push, and pop functions are implemented elsewhere.
extension LinkedList {
  create
  reverse
  sort
}

// Assume create, push, and pop functions are implemented elsewhere.
extension Stack {
  create
  push
  pop
}

Module DataStructures {
  LinkedList
  Stack
}

// Usage main.oo

import { create as LLCreate } from DataStructures:LinkedList
import { create as SCreate } from DataStructures:Stack

```

Multi-file programs can be created by using the import keyword, as long as there is a module declaration. Any file within the same directory or subdirectory of the entry file (the file that is passed to the compiler) is part of the environment aka global scope.

For example, consider the following directory structure:

- src
  - main.oo (entry file)
  - math.oo (module)
  - dataStructures.oo (module)

Both `math.oo` and `dataStructures.oo` are part of the same environment as `main.oo`.

To import from these files:

```js

// main.oo

import { abs } from math
import { create as LLCreate } from dataStructures

var a: int = abs(-10)

```

### Multi-file programs (linking and link-time optimization)

In multi-file programs, the compiler effectively processes imports using a technique similar to linking and link-time optimization (LTO). Linking involves merging code from different files, resolving symbol references, and creating a single output file. Link-time optimization helps eliminate duplicate code, inline functions, and remove unused functions to optimize the final output.

When compiling multi-file programs, the compiler creates a reference table, hoists imports, and reuses them with unique names. This approach ensures that a module is included only once in the final output, no matter how many times it is imported.

If you provide the --stage flag, you can view the linked and optimized code that includes all imports merged into a single file. However, if you don't use this flag, the compiler will directly output a binary file.

Example of the output of a multi-file program:

```js
// staged-main.oo

fn abs(a: int): int {
  if (a < 0) {
    return -a
  }
  return a
}

fn LLCreate(): LinkedList {
  return new LinkedList()
}

var a: int = abs(-10)
```

The compiler ensures that all imported code is properly integrated and renames imported members to prevent name collisions. As a result, the linked and optimized code is ready for compilation.

### Compiling

To compile a program, use the oito command. The compiler automatically detects and compiles multi-file programs without requiring any special steps. In order to be compiled, a file must contain a main function, which serves as the program's entry point. For multi-file programs, the main function must be located in the main file. While other files can also have a main function, the compiler will ignore these, allowing for individual file testing.

In the future, a JIT compiler may be implemented to further facilitate file testing, depending on the developer's state of mind after the current development phase.

The compiler exports to binary by default, but it also supports exporting to staging, assembly, and potentially C in the future. The following flags can be used to customize the compilation process:

- `-o` or `--output`: Specify the output file.
- `-s` or `--stage`: Export to staging.
- `-a` or `--assembly`: Export to assembly.
- `-w` or `--warnings`: Disable warnings.

Compiling a program:

```bash

# Compile to binary
oito main.oo

# Compile to staging
oito main.oo --stage

# Compile to assembly
oito main.oo --assembly

# Compile to binary with custom output file
oito main.oo -o main.bin

```
