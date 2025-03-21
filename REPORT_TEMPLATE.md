# Lexer for Medical Clinic DSL

## Table of Contents
1. [Introduction](#introduction)
2. [Project Overview](#project-overview)
3. [Implementation Details](#implementation-details)
   - [Token Types](#token-types)
   - [Lexer Class](#lexer-class)
   - [Key Methods](#key-methods)
4. [Usage](#usage)
   - [Example Input](#example-input)
5. [Evaluation](#evaluation)
   - [Strengths](#strengths)
6. [Conclusion](#conclusion)

---

## Introduction

This project implements a lexer (lexical analyzer) for a Domain-Specific Language (DSL) designed for managing medical clinic operations. The lexer processes input commands and converts them into a sequence of tokens, which can later be used for further processing, such as parsing or executing commands.

The DSL supports commands for managing patients, drugs, diagnoses, treatments, and appointments. The lexer is implemented in TypeScript and is designed to be modular and extensible.

---

## Project Overview

The lexer is part of a larger system that could be used in a medical clinic to automate tasks such as adding, removing, or editing patient records; managing drug prescriptions; recording diagnoses and treatments; and scheduling appointments.

The lexer's primary responsibility is to tokenize input commands, breaking them down into meaningful components (tokens) that can be processed by a parser or interpreter.

---

## Implementation Details

### Token Types

The lexer recognizes the following token types:

| Token Type         | Description                                                                 |
|--------------------|-----------------------------------------------------------------------------|
| `PATIENT`          | Represents the `patient` command.                                           |
| `DRUG`             | Represents the `drug` command.                                              |
| `ADD`              | Represents the `add` action.                                                |
| `REMOVE`           | Represents the `remove` action.                                             |
| `EDIT`             | Represents the `edit` action.                                               |
| `REGISTER`         | Represents the `register` action.                                           |
| `STATUS`           | Represents the `status` action.                                             |
| `DIAGNOSE`         | Represents the `diagnose` action.                                           |
| `TREATMENT`        | Represents the `treatment` action.                                          |
| `HELPCOMMANDS`     | Represents the `helpcommands` action.                                       |
| `PATIENT_NAME`     | Represents a patient's name (e.g., `"John_Doe"`).                           |
| `DATE`             | Represents a date in `dd/mm/yyyy` format.                                   |
| `DRUG_NAME`        | Represents a drug's name (e.g., `"Paracetamol"`).                           |
| `DRUG_TYPE`        | Represents a drug's type (e.g., `{pills}`, `{syrup}`).                      |
| `PATIENT_STATUS`   | Represents a patient's status (e.g., `ASA-I`, `ASA-II`).                    |
| `DIAGNOSE_TEXT`    | Represents a diagnosis description (e.g., `[Mild fever]`).                  |
| `TREATMENT_PERIOD` | Represents a treatment period (e.g., `01/01/2023 to 05/01/2023`).           |
| `FREQUENCY`        | Represents the frequency of drug intake (e.g., `"1 time per day"`).         |
| `DOSAGE`           | Represents the dosage of a drug (e.g., `500mg`).                            |
| `TIME`             | Represents a time in `hh:mm` format (e.g., `10:00`).                        |

---

### Lexer Class

The lexer is implemented as a TypeScript class with the following structure:

```typescript
export class Lexer {
  private input: string; // Input string to tokenize
  private position: number; // Current position in the input string

  constructor(input: string) {
    this.input = input.trim();
    this.position = 0;
  }

  // Methods for reading and tokenizing the input
  private readQuotedString(): { type: TokenType; value: string };
  private readBracketedString(): string;
  private readCurlyBracketedString(): string;
  private readDate(): string;
  private readTime(): string;
  private readDosage(): string;
  private readWord(): string;
  private getTokenType(word: string): TokenType;
  public tokenize(): Token[];
}
```
---
## Key Methods

### `readQuotedString`
This method reads a string enclosed in double quotes (`"`). It determines the token type based on content: if the string starts with a digit, it is a `FREQUENCY`; if it contains an underscore (`_`), it is a `PATIENT_NAME`; otherwise, it is a `DRUG_NAME`.

### `readBracketedString`
This method reads a string enclosed in square brackets (`[` and `]`) and returns the content as a `DIAGNOSE_TEXT`.

### `readCurlyBracketedString`
This method reads a string enclosed in curly braces (`{` and `}`) and returns the content as a `DRUG_TYPE`.

### `readDate`
This method reads a date in `dd/mm/yyyy` format and returns it as a `DATE`.

### `readTime`
This method reads a time in `hh:mm` format and returns it as a `TIME`.

### `readDosage`
This method reads a dosage (e.g., `500mg`) and returns it as a `DOSAGE`.

### `tokenize`
This method processes the input string and returns an array of tokens.

---

## Usage

### Example Input

```typescript
const input = `
  patient add "John_Doe"
  patient remove "Jane_Doe"
  drug add "Paracetamol" {pills}
  patient diagnose "John_Doe" [Mild fever]
  patient treatment "John_Doe" "Paracetamol" 01/01/2023 to 05/01/2023 "1 time per day" 500mg
  patient register "John_Doe" 01/01/2023 10:00
`;

const lexer = new Lexer(input);
const tokens = lexer.tokenize();

console.log(tokens);
```
---
## Evaluation

### Strengths
The lexer features a modular design that is easy to extend with new token types or rules. It clearly distinguishes between different types of tokens based on well-defined rules and throws meaningful errors for unknown tokens, making debugging easier.

---

## Conclusion

The lexer provides a solid foundation for processing commands in a medical clinic DSL. It is designed to be extensible and can be integrated with a parser or interpreter to build a complete system for managing clinic operations. Future improvements could include better error recovery, syntax validation, and support for more complex commands.