
import React from 'react';

interface CalcButtonProps {
  label: string;
  onClick: () => void;
  className?: string;
  variant?: 'number' | 'operator' | 'action' | 'equal';
}

const CalcButton: React.FC<CalcButtonProps> = ({ 
  label, 
  onClick, 
  className = '', 
  variant = 'number' 
}) => {
  const baseStyles = "flex items-center justify-center text-xl font-medium transition-all duration-200 active:scale-95 rounded-2xl h-16 w-full shadow-sm";
  
  const variantStyles = {
    number: "bg-white text-slate-700 hover:bg-slate-50 border border-slate-100",
    operator: "bg-indigo-50 text-indigo-600 hover:bg-indigo-100",
    action: "bg-slate-100 text-slate-500 hover:bg-slate-200",
    equal: "bg-indigo-600 text-white hover:bg-indigo-700 shadow-indigo-200 shadow-lg"
  };

  return (
    <button 
      onClick={onClick}
      className={`${baseStyles} ${variantStyles[variant]} ${className}`}
    >
      {label}
    </button>
  );
};

export default CalcButton;
