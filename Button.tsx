import React from 'react';

interface ButtonProps extends React.ButtonHTMLAttributes<HTMLButtonElement> {
  variant?: 'primary' | 'secondary' | 'danger' | 'outline';
  fullWidth?: boolean;
}

export const Button: React.FC<ButtonProps> = ({ 
  children, 
  variant = 'primary', 
  fullWidth = false, 
  className = '',
  ...props 
}) => {
  const baseStyles = "px-6 py-3 font-bold text-lg transition-all duration-150 active:translate-y-1 active:translate-x-1 active:shadow-none border-2 border-bauhaus-black rounded-none flex items-center justify-center gap-2";
  
  const variants = {
    primary: "bg-bauhaus-yellow text-bauhaus-black hover:bg-yellow-400 shadow-bauhaus",
    secondary: "bg-bauhaus-blue text-white hover:bg-blue-700 shadow-bauhaus",
    danger: "bg-bauhaus-red text-white hover:bg-red-700 shadow-bauhaus",
    outline: "bg-transparent text-bauhaus-black hover:bg-gray-100 shadow-bauhaus"
  };

  const widthClass = fullWidth ? "w-full" : "";

  return (
    <button 
      className={`${baseStyles} ${variants[variant]} ${widthClass} ${className}`}
      {...props}
    >
      {children}
    </button>
  );
};