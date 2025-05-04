import { Lexer } from './Lexer';
import { Parser } from './Parser';

const testCases = [
  // Test case 1: Basic commands
  `
  patient add "John_Doe"
  patient remove "Jane_Doe"
  drug add "Paracetamol" {pills}
  patient diagnose "John_Doe" [Mild fever]
  patient treatment "John_Doe" "Paracetamol" 01/01/2023 to 05/01/2023
  helpcommands
  `,

  // Test case 2: Commands with additional parameters
  `
  patient treatment "John_Doe" "Paracetamol" 01/01/2023 to 05/01/2023 "1 time per day" 500mg
  patient register "John_Doe" 01/01/2023 23:00
  `
];

// Process each test case
testCases.forEach((input, index) => {
  console.log(`\n----- Test Case ${index + 1} -----`);

  try {
    const lexer = new Lexer(input);
    const tokens = lexer.tokenize();

    console.log('Tokens:');
    console.log(tokens);

    const parser = new Parser(tokens);
    const ast = parser.parse();

    console.log('\nAST:');
    console.log(JSON.stringify(ast, null, 2));

    console.log(`\nNumber of commands: ${ast.commands.length}`);

    console.log('Command types:');
    ast.commands.forEach((command, cmdIndex) => {
      console.log(`  ${cmdIndex + 1}: ${command.commandType.type}`);
    });
  } catch (error) {
    console.error(`Error processing test case ${index + 1}:`, error.message);
  }
});

// Example function to demonstrate how to interpret the AST
function interpretCommand(command) {
  const { commandType } = command;

  switch (commandType.type) {
    case 'PatientAddCommand':
      return `Add patient: ${commandType.patientName}`;

    case 'PatientRemoveCommand':
      return `Remove patient: ${commandType.patientName}`;

    case 'PatientRegisterCommand':
      return `Register patient: ${commandType.patientName} on ${commandType.date}${commandType.time ? ` at ${commandType.time}` : ''}`;

    case 'PatientStatusCommand':
      return `Set patient status: ${commandType.patientName} to ${commandType.status}`;

    case 'PatientDiagnoseCommand':
      return `Diagnose patient: ${commandType.patientName} with "${commandType.diagnoseText}"`;

    case 'PatientTreatmentCommand':
      let treatmentStr = `Treat patient: ${commandType.patientName} with ${commandType.drugName}`;
      treatmentStr += ` from ${commandType.startDate} to ${commandType.endDate}`;

      if (commandType.frequency) treatmentStr += `, ${commandType.frequency}`;
      if (commandType.dosage) treatmentStr += `, dosage: ${commandType.dosage}`;
      if (commandType.time) treatmentStr += ` at ${commandType.time}`;

      return treatmentStr;

    case 'DrugAddCommand':
      return `Add drug: ${commandType.drugName} (${commandType.drugType})`;

    case 'DrugRemoveCommand':
      return `Remove drug: ${commandType.drugName}`;

    case 'DrugEditCommand':
      return `Edit drug: ${commandType.drugName} to type ${commandType.drugType}`;

    case 'HelpCommandsCommand':
      return `Show help commands`;

    default:
      return `Unknown command type: ${commandType.type}`;
  }
}



// Example usage of the interpreter
console.log('\n----- Interpreting Commands 1st test -----');
const lexer = new Lexer(testCases[0]);
const tokens = lexer.tokenize();
const parser = new Parser(tokens);
const ast = parser.parse();

ast.commands.forEach((command, index) => {
  console.log(`Command ${index + 1}: ${interpretCommand(command)}`);
});

console.log('\n----- Interpreting Commands 2st test -----');
const lexer1 = new Lexer(testCases[1]);
const tokens1 = lexer1.tokenize();
const parser1 = new Parser(tokens1);
const ast1 = parser1.parse();

ast1.commands.forEach((command, index) => {
  console.log(`Command ${index + 1}: ${interpretCommand(command)}`);
});