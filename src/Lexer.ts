type TokenType =
  | "PATIENT" // patient
  | "DRUG" // drug
  | "ADD" // add
  | "REMOVE" // remove
  | "EDIT" // edit
  | "REGISTER" // register
  | "STATUS" // status
  | "DIAGNOSE" // diagnose
  | "TREATMENT" // treatment
  | "HELPCOMMANDS" // helpcommands
  | "PATIENT_NAME" // "Name_Surname"
  | "DATE" // dd/mm/yyyy
  | "DRUG_NAME" // "name of the drug"
  | "DRUG_TYPE" // {pills}, {syrup}, {solution}, {candles}
  | "PATIENT_STATUS" // ASA-I, ASA-II, ASA-III, ASA-IV, ASA-V, ASA-VI
  | "DIAGNOSE_TEXT" // [string written by doctor about patient]
  | "TREATMENT_PERIOD" // dd/mm/yyyy to dd/mm/yyyy
  | "DOSAGE" // 500mg, 10ml
  | "FREQUENCY" // "1 time per day", "2 times per day"
  | "TIME"; // 10:00

export interface Token {
  type: TokenType;
  value: string;
}

export class Lexer {
  private input: string;
  private position: number;

  constructor(input: string) {
    this.input = input.trim();
    this.position = 0;
  }

  private isWhitespace(char: string): boolean {
    return /\s/.test(char);
  }

  private isQuote(char: string): boolean {
    return char === '"';
  }

  private isBracket(char: string): boolean {
    return char === '[' || char === ']';
  }

  private isCurlyBracket(char: string): boolean {
    return char === '{' || char === '}';
  }

  private readWhile(predicate: (char: string) => boolean): string {
    let result = '';
    while (this.position < this.input.length && predicate(this.input[this.position])) {
      result += this.input[this.position++];
    }
    return result;
  }

  private readQuotedString(): { type: TokenType; value: string } {
    let result = '';
    this.position++;
    result += this.readWhile((char) => !this.isQuote(char));
    this.position++;

    if (/^\d/.test(result)) {
      return { type: "FREQUENCY", value: result };
    }

    if (result.includes('_')) {
      return { type: "PATIENT_NAME", value: result };
    }

    return { type: "DRUG_NAME", value: result };
  }

  private readBracketedString(): string {
    let result = '';
    this.position++;
    result += this.readWhile((char) => !this.isBracket(char));
    this.position++;
    return result;
  }

  private readCurlyBracketedString(): string {
    let result = '';
    this.position++;
    result += this.readWhile((char) => !this.isCurlyBracket(char));
    this.position++;
    return result;
  }

  private readDate(): string {
    return this.readWhile((char) => /\d/.test(char) || char === '/');
  }

  private readTime(): string {
    return this.readWhile((char) => /\d/.test(char) || char === ':');
  }

  private readDosage(): string {
    return this.readWhile((char) => /\d/.test(char) || char === 'm' || char === 'g');
  }

  private readWord(): string {
    return this.readWhile((char) => !this.isWhitespace(char));
  }

  private getTokenType(word: string): TokenType {
    switch (word) {
      case "patient":
        return "PATIENT";
      case "drug":
        return "DRUG";
      case "add":
        return "ADD";
      case "remove":
        return "REMOVE";
      case "edit":
        return "EDIT";
      case "register":
        return "REGISTER";
      case "status":
        return "STATUS";
      case "diagnose":
        return "DIAGNOSE";
      case "treatment":
        return "TREATMENT";
      case "to":
        return "TREATMENT_PERIOD";
      case "helpcommands":
        return "HELPCOMMANDS";
      default:
        if (/^\d+mg$/.test(word)) {
          return "DOSAGE";
        } else if (/^\d+ times? per day$/.test(word)) {
          return "FREQUENCY";
        } else if (/^\d{2}:\d{2}$/.test(word)) {
          return "TIME";
        } else {
          throw new Error(`Unknown word: ${word}`);
        }
    }
  }

  public tokenize(): Token[] {
    const tokens: Token[] = [];

    while (this.position < this.input.length) {
      const currentChar = this.input[this.position];

      if (this.isWhitespace(currentChar)) {
        this.position++;
        continue;
      }

      if (this.isQuote(currentChar)) {
        const { type, value } = this.readQuotedString();
        tokens.push({ type, value });
        continue;
      }

      if (this.isBracket(currentChar)) {
        const value = this.readBracketedString();
        tokens.push({ type: "DIAGNOSE_TEXT", value });
        continue;
      }

      if (this.isCurlyBracket(currentChar)) {
        const value = this.readCurlyBracketedString();
        tokens.push({ type: "DRUG_TYPE", value });
        continue;
      }

      if (/\d/.test(currentChar)) {
        if (this.position + 9 < this.input.length && this.input[this.position + 2] === '/' && this.input[this.position + 5] === '/') {
          const value = this.readDate();
          tokens.push({ type: "DATE", value });
          continue;
        }

        if (this.position + 4 < this.input.length && this.input[this.position + 2] === ':') {
          const value = this.readTime();
          tokens.push({ type: "TIME", value });
          continue;
        }

        if (this.position + 2 < this.input.length && this.input[this.position + 1] === 'm' && this.input[this.position + 2] === 'g') {
          const value = this.readDosage();
          tokens.push({ type: "DOSAGE", value });
          continue;
        }
      }

      const word = this.readWord();
      const type = this.getTokenType(word);
      tokens.push({ type, value: word });
    }

    return tokens;
  }
}