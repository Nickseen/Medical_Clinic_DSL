# Medical Clinic DSL System

## Table of Contents
1. [Introduction](#introduction)
2. [Project Overview](#project-overview)
3. [Implementation Details](#implementation-details)
   - [System Architecture](#system-architecture)
   - [Lexer (Tokenization)](#lexer-tokenization)
   - [Parser (Syntactic Analysis)](#parser-syntactic-analysis)
   - [Abstract Syntax Tree (AST)](#abstract-syntax-tree-ast)
4. [Usage](#usage)
   - [Example Input](#example-input)
   - [Processing Flow](#processing-flow)
   - [Command Interpretation](#command-interpretation)
5. [Evaluation](#evaluation)
   - [Strengths](#strengths)
   - [Potential Improvements](#potential-improvements)
6. [Conclusion](#conclusion)

---

## Introduction

This project implements a complete language processing system for a Domain-Specific Language (DSL) designed for managing medical clinic operations. The system processes textual commands into actionable instructions through a three-stage pipeline: lexical analysis (lexer), syntactic analysis (parser), and semantic representation (Abstract Syntax Tree).

The DSL supports various commands for managing patients, drugs, diagnoses, treatments, and appointments in a medical clinic environment. The system is implemented in TypeScript, making it suitable for integration with web-based or Node.js applications.

---

## Project Overview

The Medical Clinic DSL system is designed to automate common tasks in a clinical setting, including:

- Patient management (adding, removing, registering patients)
- Drug inventory management (adding, removing, editing drug information)
- Clinical processes (diagnosing patients, prescribing treatments)
- Appointment scheduling
- Status tracking

The system transforms natural language-like commands into structured data that can be processed by application logic. This approach allows medical staff to interact with the system using familiar terminology while maintaining data integrity and structure.

---

## Implementation Details

### System Architecture

The system follows a classic compiler front-end architecture with three main components:

1. **Lexer (Lexical Analyzer)**: Breaks down input text into tokens
2. **Parser (Syntactic Analyzer)**: Organizes tokens into a syntactic structure
3. **AST (Abstract Syntax Tree)**: Represents the semantic meaning of commands

These components work together to process user input from raw text to executable commands.

### Lexer (Tokenization)

The lexer identifies and categorizes language elements from the input string. It recognizes the following token types:

| Token Type         | Description                                                  | Example                   |
|--------------------|--------------------------------------------------------------|---------------------------|
| `PATIENT`          | Patient-related command                                      | `patient`                 |
| `DRUG`             | Drug-related command                                         | `drug`                    |
| `ADD`              | Add action                                                   | `add`                     |
| `REMOVE`           | Remove action                                                | `remove`                  |
| `EDIT`             | Edit action                                                  | `edit`                    |
| `REGISTER`         | Register action                                              | `register`                |
| `STATUS`           | Status action                                                | `status`                  |
| `DIAGNOSE`         | Diagnose action                                              | `diagnose`                |
| `TREATMENT`        | Treatment action                                             | `treatment`               |
| `HELPCOMMANDS`     | Help command                                                 | `helpcommands`            |
| `PATIENT_NAME`     | Patient identifier                                           | `"John_Doe"`              |
| `DATE`             | Date in dd/mm/yyyy format                                    | `01/01/2023`              |
| `DRUG_NAME`        | Drug identifier                                              | `"Paracetamol"`           |
| `DRUG_TYPE`        | Type of drug                                                 | `{pills}`, `{syrup}`      |
| `PATIENT_STATUS`   | Patient health status                                        | `ASA-I`, `ASA-II`         |
| `DIAGNOSE_TEXT`    | Diagnostic information                                       | `[Mild fever]`            |
| `TREATMENT_PERIOD` | Treatment duration marker                                    | `to`                      |
| `DOSAGE`           | Drug dosage                                                  | `500mg`                   |
| `FREQUENCY`        | Frequency of administration                                  | `"1 time per day"`        |
| `TIME`             | Time in hh:mm format                                         | `10:00`                   |

The lexer employs several specialized methods for recognizing different token types:

- `readQuotedString()`: Processes strings in double quotes
- `readBracketedString()`: Processes diagnostic text in square brackets
- `readCurlyBracketedString()`: Processes drug types in curly braces
- `readDate()`, `readTime()`, `readDosage()`: Process specialized data formats

### Parser (Syntactic Analysis)

The parser transforms the token stream into a structured representation by applying grammar rules. It uses a recursive descent approach with the following key methods:

- `parse()`: Entry point that returns a complete program AST
- `parseCommand()`: Identifies the command type (patient, drug, help)
- `parsePatientCommand()`: Handles specific patient command types
- `parseDrugCommand()`: Handles specific drug command types
- Specialized methods for each command variant (e.g., `parsePatientAdd()`, `parseDrugEdit()`)

The parser includes error handling to provide meaningful feedback when input doesn't conform to expected syntax.

### Abstract Syntax Tree (AST)

The AST provides a hierarchical representation of commands with the following structure:

1. `Program`: Root node containing a list of commands
2. `Command`: Generic command node with a specific command type
3. Command Types:
   - Patient commands: `PatientAddCommand`, `PatientRemoveCommand`, `PatientRegisterCommand`, `PatientStatusCommand`, `PatientDiagnoseCommand`, `PatientTreatmentCommand`
   - Drug commands: `DrugAddCommand`, `DrugRemoveCommand`, `DrugEditCommand`
   - Help command: `HelpCommandsCommand`

Each command type contains specific fields relevant to that operation. For example:

- `PatientAddCommand`: Contains `patientName`
- `PatientTreatmentCommand`: Contains `patientName`, `drugName`, `startDate`, `endDate`, optional `frequency`, `dosage`, and `time`
- `DrugAddCommand`: Contains `drugName` and `drugType`

---

## Usage

### Example Input

```
patient add "John_Doe"
patient remove "Jane_Doe"
drug add "Paracetamol" {pills}
patient diagnose "John_Doe" [Mild fever]
patient treatment "John_Doe" "Paracetamol" 01/01/2023 to 05/01/2023 "1 time per day" 500mg
helpcommands
```

### Processing Flow

1. **Lexical Analysis**: The lexer converts the input text into tokens
   ```typescript
   const lexer = new Lexer(input);
   const tokens = lexer.tokenize();
   ```

2. **Syntactic Analysis**: The parser organizes tokens into an AST
   ```typescript
   const parser = new Parser(tokens);
   const ast = parser.parse();
   ```

3. **Interpretation**: The AST can be interpreted to perform actions
   ```typescript
   // Example interpretation function provided in main.ts
   ast.commands.forEach((command, index) => {
     console.log(`Command ${index + 1}: ${interpretCommand(command)}`);
   });
   ```

### Command Interpretation

The system includes an `interpretCommand` function that translates AST nodes into human-readable descriptions:

```typescript
function interpretCommand(command) {
  const { commandType } = command;

  switch (commandType.type) {
    case 'PatientAddCommand':
      return `Add patient: ${commandType.patientName}`;
    case 'PatientTreatmentCommand':
      let treatmentStr = `Treat patient: ${commandType.patientName} with ${commandType.drugName}`;
      treatmentStr += ` from ${commandType.startDate} to ${commandType.endDate}`;
      // Additional fields (frequency, dosage, time)
      return treatmentStr;
    // Other command types...
  }
}
```

---

## Evaluation

### Strengths

1. **Modular Design**: The system is divided into distinct components (lexer, parser, AST) that can be developed and tested independently.

2. **Extensive Command Support**: The DSL supports a wide range of clinical operations, making it versatile for different medical settings.

3. **Flexible Syntax**: The language allows for optional parameters (like time, frequency, dosage) that make commands both concise and expressive.

4. **Strong Typing**: The TypeScript implementation provides type safety and better tooling support.

5. **Error Handling**: The parser includes error messages that help identify syntax issues in commands.

6. **Extensibility**: New commands or parameters can be added without major architectural changes.

### Potential Improvements

1. **Input Validation**: More comprehensive validation could be added to ensure dates, times, and dosages meet format requirements.

2. **Error Recovery**: Currently, errors stop processing; a more robust system could attempt to recover and continue parsing.

3. **Command Execution**: Adding actual execution logic that interfaces with a database or other systems.

4. **Test Coverage**: Expanding test cases to cover edge cases and invalid inputs.

5. **User Interface**: Developing a front-end that provides command suggestions and syntax highlighting.

---

## Conclusion

The Medical Clinic DSL system provides a powerful way to translate domain-specific commands into executable actions for medical clinic management. By separating lexical analysis, syntactic analysis, and semantic representation, the system maintains a clean architecture that is both maintainable and extensible.

This approach allows medical staff to use natural language-like commands while ensuring that the underlying data remains structured and consistent. The system could serve as the foundation for a complete clinic management solution when integrated with appropriate back-end services and user interfaces.

Future work could focus on expanding the command set, enhancing error handling, and implementing actual command execution logic that interfaces with medical databases and healthcare systems.