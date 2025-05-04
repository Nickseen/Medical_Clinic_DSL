import { Token } from './Lexer';
import {
  ASTNode,
  Program,
  PatientAddCommand,
  PatientRemoveCommand,
  PatientRegisterCommand,
  PatientStatusCommand,
  PatientDiagnoseCommand,
  PatientTreatmentCommand,
  DrugAddCommand,
  DrugRemoveCommand,
  DrugEditCommand,
  HelpCommandsCommand,
  CommandType
} from './AST';

export class Parser {
  private tokens: Token[];
  private current: number = 0;

  constructor(tokens: Token[]) {
    this.tokens = tokens;
  }

  private peek(): Token | null {
    if (this.current >= this.tokens.length) {
      return null;
    }
    return this.tokens[this.current];
  }

  private advance(): Token {
    const token = this.tokens[this.current];
    this.current++;
    return token;
  }

  private match(types: string[]): boolean {
    const token = this.peek();
    if (!token) return false;

    // Use indexOf instead of includes for better compatibility
    if (types.indexOf(token.type) !== -1) {
      this.advance();
      return true;
    }

    return false;
  }

  private expect(type: string, message: string): Token {
    const token = this.peek();
    if (token && token.type === type) {
      return this.advance();
    }

    throw new Error(`${message}. Expected ${type}, got ${token?.type || 'end of input'}`);
  }

  public parse(): Program {
    const program: Program = {
      type: 'Program',
      commands: []
    };

    while (this.peek()) {
      const command = this.parseCommand();
      if (command) {
        program.commands.push({
          type: 'Command',
          commandType: command
        });
      }
    }

    return program;
  }

  private parseCommand(): CommandType {
    const token = this.peek();
    if (!token) throw new Error('Unexpected end of input');

    switch (token.type) {
      case 'PATIENT':
        this.advance(); // consume 'patient'
        return this.parsePatientCommand();
      case 'DRUG':
        this.advance(); // consume 'drug'
        return this.parseDrugCommand();
      case 'HELPCOMMANDS':
        this.advance(); // consume 'helpcommands'
        return this.parseHelpCommand();
      default:
        throw new Error(`Unexpected token: ${token.type}`);
    }
  }

  private parsePatientCommand(): CommandType {
    const actionToken = this.peek();
    if (!actionToken) throw new Error('Expected patient action');

    switch (actionToken.type) {
      case 'ADD':
        this.advance(); // consume 'add'
        return this.parsePatientAdd();
      case 'REMOVE':
        this.advance(); // consume 'remove'
        return this.parsePatientRemove();
      case 'REGISTER':
        this.advance(); // consume 'register'
        return this.parsePatientRegister();
      case 'STATUS':
        this.advance(); // consume 'status'
        return this.parsePatientStatus();
      case 'DIAGNOSE':
        this.advance(); // consume 'diagnose'
        return this.parsePatientDiagnose();
      case 'TREATMENT':
        this.advance(); // consume 'treatment'
        return this.parsePatientTreatment();
      default:
        throw new Error(`Unexpected patient action: ${actionToken.type}`);
    }
  }

  private parseDrugCommand(): CommandType {
    const actionToken = this.peek();
    if (!actionToken) throw new Error('Expected drug action');

    switch (actionToken.type) {
      case 'ADD':
        this.advance(); // consume 'add'
        return this.parseDrugAdd();
      case 'REMOVE':
        this.advance(); // consume 'remove'
        return this.parseDrugRemove();
      case 'EDIT':
        this.advance(); // consume 'edit'
        return this.parseDrugEdit();
      default:
        throw new Error(`Unexpected drug action: ${actionToken.type}`);
    }
  }

  private parsePatientAdd(): PatientAddCommand {
    const nameToken = this.expect('PATIENT_NAME', 'Expected patient name');
    return {
      type: 'PatientAddCommand',
      patientName: nameToken.value
    };
  }

  private parsePatientRemove(): PatientRemoveCommand {
    const nameToken = this.expect('PATIENT_NAME', 'Expected patient name');
    return {
      type: 'PatientRemoveCommand',
      patientName: nameToken.value
    };
  }

  private parsePatientRegister(): PatientRegisterCommand {
    const nameToken = this.expect('PATIENT_NAME', 'Expected patient name');
    const dateToken = this.expect('DATE', 'Expected date');

    const command: PatientRegisterCommand = {
      type: 'PatientRegisterCommand',
      patientName: nameToken.value,
      date: dateToken.value
    };

    // Optional time
    const nextToken = this.peek();
    if (nextToken && nextToken.type === 'TIME') {
      command.time = this.advance().value;
    }

    return command;
  }

  private parsePatientStatus(): PatientStatusCommand {
    const nameToken = this.expect('PATIENT_NAME', 'Expected patient name');
    const statusToken = this.expect('PATIENT_STATUS', 'Expected patient status');

    return {
      type: 'PatientStatusCommand',
      patientName: nameToken.value,
      status: statusToken.value
    };
  }

  private parsePatientDiagnose(): PatientDiagnoseCommand {
    const nameToken = this.expect('PATIENT_NAME', 'Expected patient name');
    const diagnoseToken = this.expect('DIAGNOSE_TEXT', 'Expected diagnose text');

    return {
      type: 'PatientDiagnoseCommand',
      patientName: nameToken.value,
      diagnoseText: diagnoseToken.value
    };
  }

  private parsePatientTreatment(): PatientTreatmentCommand {
    const nameToken = this.expect('PATIENT_NAME', 'Expected patient name');
    const drugToken = this.expect('DRUG_NAME', 'Expected drug name');
    const startDateToken = this.expect('DATE', 'Expected start date');

    // We expect a 'to' token here
    this.expect('TREATMENT_PERIOD', 'Expected treatment period');

    const endDateToken = this.expect('DATE', 'Expected end date');

    const command: PatientTreatmentCommand = {
      type: 'PatientTreatmentCommand',
      patientName: nameToken.value,
      drugName: drugToken.value,
      startDate: startDateToken.value,
      endDate: endDateToken.value
    };

    let nextToken = this.peek();
    while (nextToken) {
      if (nextToken.type === 'FREQUENCY') {
        command.frequency = this.advance().value;
      } else if (nextToken.type === 'DOSAGE') {
        command.dosage = this.advance().value;
      } else if (nextToken.type === 'TIME') {
        command.time = this.advance().value;
      } else {
        break; // Unknown token type, stop parsing this command
      }
      nextToken = this.peek();
    }

    return command;
  }

  private parseDrugAdd(): DrugAddCommand {
    const nameToken = this.expect('DRUG_NAME', 'Expected drug name');
    const typeToken = this.expect('DRUG_TYPE', 'Expected drug type');

    return {
      type: 'DrugAddCommand',
      drugName: nameToken.value,
      drugType: typeToken.value
    };
  }

  private parseDrugRemove(): DrugRemoveCommand {
    const nameToken = this.expect('DRUG_NAME', 'Expected drug name');

    return {
      type: 'DrugRemoveCommand',
      drugName: nameToken.value
    };
  }

  private parseDrugEdit(): DrugEditCommand {
    const nameToken = this.expect('DRUG_NAME', 'Expected drug name');
    const typeToken = this.expect('DRUG_TYPE', 'Expected drug type');

    return {
      type: 'DrugEditCommand',
      drugName: nameToken.value,
      drugType: typeToken.value
    };
  }

  private parseHelpCommand(): HelpCommandsCommand {
    return {
      type: 'HelpCommandsCommand'
    };
  }
}