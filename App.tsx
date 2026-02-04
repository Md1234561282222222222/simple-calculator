
import React, { useState, useCallback, useEffect } from 'react';
import { CalculatorState, Operator } from './types';
import CalcButton from './components/CalcButton';

const App: React.FC = () => {
  const [state, setState] = useState<CalculatorState>({
    displayValue: '0',
    previousValue: null,
    operator: null,
    waitingForOperand: false,
  });

  const clearAll = useCallback(() => {
    setState({
      displayValue: '0',
      previousValue: null,
      operator: null,
      waitingForOperand: false,
    });
  }, []);

  const inputDigit = useCallback((digit: string) => {
    setState(prev => {
      const { displayValue, waitingForOperand } = prev;

      if (waitingForOperand) {
        return {
          ...prev,
          displayValue: String(digit),
          waitingForOperand: false,
        };
      }

      return {
        ...prev,
        displayValue: displayValue === '0' ? String(digit) : displayValue + digit,
      };
    });
  }, []);

  const inputDot = useCallback(() => {
    setState(prev => {
      const { displayValue, waitingForOperand } = prev;

      if (waitingForOperand) {
        return {
          ...prev,
          displayValue: '0.',
          waitingForOperand: false,
        };
      }

      if (!displayValue.includes('.')) {
        return {
          ...prev,
          displayValue: displayValue + '.',
        };
      }

      return prev;
    });
  }, []);

  const performOperation = useCallback((nextOperator: Operator) => {
    setState(prev => {
      const { displayValue, operator, previousValue } = prev;
      const inputValue = parseFloat(displayValue);

      if (previousValue === null) {
        return {
          ...prev,
          previousValue: inputValue,
          operator: nextOperator,
          waitingForOperand: true,
        };
      }

      if (operator) {
        const currentValue = previousValue || 0;
        let newValue = currentValue;

        switch (operator) {
          case '+': newValue = currentValue + inputValue; break;
          case '-': newValue = currentValue - inputValue; break;
          case '*': newValue = currentValue * inputValue; break;
          case '/': 
            if (inputValue !== 0) {
              newValue = currentValue / inputValue;
            } else {
              alert("Cannot divide by zero");
              return prev;
            }
            break;
        }

        return {
          ...prev,
          displayValue: String(newValue),
          previousValue: nextOperator === null ? null : newValue,
          operator: nextOperator,
          waitingForOperand: true,
        };
      }

      return {
        ...prev,
        operator: nextOperator,
        waitingForOperand: true,
      };
    });
  }, []);

  const toggleSign = useCallback(() => {
    setState(prev => ({
      ...prev,
      displayValue: String(parseFloat(prev.displayValue) * -1)
    }));
  }, []);

  const percentage = useCallback(() => {
    setState(prev => ({
      ...prev,
      displayValue: String(parseFloat(prev.displayValue) / 100)
    }));
  }, []);

  // Keyboard support
  useEffect(() => {
    const handleKeyDown = (e: KeyboardEvent) => {
      if (e.key >= '0' && e.key <= '9') inputDigit(e.key);
      if (e.key === '.') inputDot();
      if (e.key === 'Enter' || e.key === '=') performOperation(null);
      if (e.key === '+') performOperation('+');
      if (e.key === '-') performOperation('-');
      if (e.key === '*') performOperation('*');
      if (e.key === '/') performOperation('/');
      if (e.key === 'Escape') clearAll();
      if (e.key === 'Backspace') {
        setState(prev => ({
          ...prev,
          displayValue: prev.displayValue.length > 1 ? prev.displayValue.slice(0, -1) : '0'
        }));
      }
    };

    window.addEventListener('keydown', handleKeyDown);
    return () => window.removeEventListener('keydown', handleKeyDown);
  }, [inputDigit, inputDot, performOperation, clearAll]);

  return (
    <div className="min-h-screen flex items-center justify-center p-4 bg-slate-50">
      <div className="w-full max-w-sm bg-white rounded-[2.5rem] shadow-2xl shadow-indigo-100 overflow-hidden border border-white p-6 md:p-8">
        {/* Header Display */}
        <div className="mb-8 text-right overflow-hidden">
          <p className="text-slate-400 text-sm h-6 font-medium tracking-wider mb-1">
            {state.previousValue !== null && state.operator ? `${state.previousValue} ${state.operator}` : ''}
          </p>
          <h1 className="text-5xl font-light text-slate-800 truncate transition-all duration-300">
            {state.displayValue}
          </h1>
        </div>

        {/* Buttons Grid */}
        <div className="grid grid-cols-4 gap-3 md:gap-4">
          <CalcButton label="AC" variant="action" onClick={clearAll} />
          <CalcButton label="+/-" variant="action" onClick={toggleSign} />
          <CalcButton label="%" variant="action" onClick={percentage} />
          <CalcButton label="÷" variant="operator" onClick={() => performOperation('/')} />

          <CalcButton label="7" onClick={() => inputDigit('7')} />
          <CalcButton label="8" onClick={() => inputDigit('8')} />
          <CalcButton label="9" onClick={() => inputDigit('9')} />
          <CalcButton label="×" variant="operator" onClick={() => performOperation('*')} />

          <CalcButton label="4" onClick={() => inputDigit('4')} />
          <CalcButton label="5" onClick={() => inputDigit('5')} />
          <CalcButton label="6" onClick={() => inputDigit('6')} />
          <CalcButton label="-" variant="operator" onClick={() => performOperation('-')} />

          <CalcButton label="1" onClick={() => inputDigit('1')} />
          <CalcButton label="2" onClick={() => inputDigit('2')} />
          <CalcButton label="3" onClick={() => inputDigit('3')} />
          <CalcButton label="+" variant="operator" onClick={() => performOperation('+')} />

          <CalcButton label="0" onClick={() => inputDigit('0')} className="col-span-2" />
          <CalcButton label="." onClick={inputDot} />
          <CalcButton label="=" variant="equal" onClick={() => performOperation(null)} />
        </div>

        <div className="mt-8 flex justify-center">
            <div className="w-12 h-1 bg-slate-100 rounded-full"></div>
        </div>
      </div>
    </div>
  );
};

export default App;
