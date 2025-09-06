import React from 'react';

interface ButtonProps extends React.ButtonHTMLAttributes<HTMLButtonElement> {
  variant?: 'primary' | 'secondary';
  fullWidth?: boolean;
}

const Button: React.FC<ButtonProps> = ({ children, variant = 'primary', fullWidth = false, ...props }) => {
  const baseClasses = "group px-6 py-2.5 text-sm font-semibold rounded-md shadow-md focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-offset-slate-900 transition-all duration-200 ease-in-out transform hover:-translate-y-1 disabled:opacity-50 disabled:cursor-not-allowed disabled:transform-none disabled:shadow-sm";

  const variantClasses = {
    primary: "bg-blue-600 text-white hover:bg-blue-500 hover:shadow-lg hover:shadow-blue-600/30 focus:ring-blue-500 active:scale-95",
    secondary: "bg-slate-700 text-slate-200 hover:bg-slate-600 hover:shadow-lg hover:shadow-slate-600/30 focus:ring-slate-500 active:scale-95",
  };

  const widthClass = fullWidth ? "w-full flex justify-center items-center" : "inline-flex justify-center items-center";

  return (
    <button className={`${baseClasses} ${variantClasses[variant]} ${widthClass}`} {...props}>
      {children}
    </button>
  );
};

export default Button;