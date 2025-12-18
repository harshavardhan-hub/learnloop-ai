import React from 'react';
import { Loader2 } from 'lucide-react';

const Button = ({ 
  children, 
  variant = 'primary', 
  size = 'md', 
  loading = false, 
  disabled = false,
  className = '',
  type = 'button',
  onClick,
  ...props 
}) => {
  const baseStyles = 'font-medium rounded-lg transition-all duration-200 flex items-center justify-center gap-2 disabled:opacity-50 disabled:cursor-not-allowed';
  
  const variants = {
    primary: 'bg-primary-600 text-white hover:bg-primary-700 active:bg-primary-800 shadow-sm hover:shadow-md',
    secondary: 'bg-white text-primary-600 border-2 border-primary-600 hover:bg-primary-50 active:bg-primary-100',
    accent: 'bg-accent-600 text-white hover:bg-accent-700 active:bg-accent-800 shadow-sm hover:shadow-md',
    danger: 'bg-red-600 text-white hover:bg-red-700 active:bg-red-800 shadow-sm hover:shadow-md',
    ghost: 'bg-transparent text-gray-700 hover:bg-gray-100 active:bg-gray-200',
    outline: 'bg-transparent border-2 border-gray-300 text-gray-700 hover:bg-gray-50 active:bg-gray-100'
  };
  
  const sizes = {
    sm: 'px-4 py-2 text-sm',
    md: 'px-6 py-3 text-base',
    lg: 'px-8 py-4 text-lg'
  };

  return (
    <button
      type={type}
      disabled={disabled || loading}
      onClick={onClick}
      className={`${baseStyles} ${variants[variant]} ${sizes[size]} ${className}`}
      {...props}
    >
      {loading && <Loader2 className="w-4 h-4 animate-spin" />}
      {children}
    </button>
  );
};

export default Button;
