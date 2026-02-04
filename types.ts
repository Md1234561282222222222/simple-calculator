
export type Operator = '+' | '-' | '*' | '/' | null;

export interface CalculatorState {
  displayValue: string;
  previousValue: number | null;
  operator: Operator;
  waitingForOperand: boolean;
}
