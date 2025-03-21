import { Lexer } from './Lexer';

// Пример использования
const input1 = `
  patient add "John_Doe"
  patient remove "Jane_Doe"
  drug add "Paracetamol" {pills}
  patient diagnose "John_Doe" [Mild fever]
  patient treatment "John_Doe" "Paracetamol" 01/01/2023 to 05/01/2023
  helpcommands
`;

const input2 = `
  patient treatment "John_Doe" "Paracetamol" 01/01/2023 to 05/01/2023 "1 time per day" 500mg
  patient register "John_Doe" 01/01/2023 23:00
`;

const lexer = new Lexer(input2);
const tokens = lexer.tokenize();

console.log(tokens);