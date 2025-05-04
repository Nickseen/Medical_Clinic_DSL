// AST Data Structures

export interface ASTNode {
  type: string;
}

export interface Program extends ASTNode {
  type: 'Program';
  commands: Command[];
}

export interface Command extends ASTNode {
  type: 'Command';
  commandType: CommandType;
}

// Different types of commands
export type CommandType =
  | PatientAddCommand
  | PatientRemoveCommand
  | PatientRegisterCommand
  | PatientStatusCommand
  | PatientDiagnoseCommand
  | PatientTreatmentCommand
  | DrugAddCommand
  | DrugRemoveCommand
  | DrugEditCommand
  | HelpCommandsCommand;

// Patient-related commands
export interface PatientAddCommand extends ASTNode {
  type: 'PatientAddCommand';
  patientName: string;
}

export interface PatientRemoveCommand extends ASTNode {
  type: 'PatientRemoveCommand';
  patientName: string;
}

export interface PatientRegisterCommand extends ASTNode {
  type: 'PatientRegisterCommand';
  patientName: string;
  date: string;
  time?: string;
}

export interface PatientStatusCommand extends ASTNode {
  type: 'PatientStatusCommand';
  patientName: string;
  status: string;
}

export interface PatientDiagnoseCommand extends ASTNode {
  type: 'PatientDiagnoseCommand';
  patientName: string;
  diagnoseText: string;
}

export interface PatientTreatmentCommand extends ASTNode {
  type: 'PatientTreatmentCommand';
  patientName: string;
  drugName: string;
  startDate: string;
  endDate: string;
  frequency?: string;
  dosage?: string;
  time?: string;
}

// Drug-related commands
export interface DrugAddCommand extends ASTNode {
  type: 'DrugAddCommand';
  drugName: string;
  drugType: string;
}

export interface DrugRemoveCommand extends ASTNode {
  type: 'DrugRemoveCommand';
  drugName: string;
}

export interface DrugEditCommand extends ASTNode {
  type: 'DrugEditCommand';
  drugName: string;
  drugType: string;
}

// Help command
export interface HelpCommandsCommand extends ASTNode {
  type: 'HelpCommandsCommand';
}