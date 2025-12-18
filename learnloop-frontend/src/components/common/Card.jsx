import React from 'react';

const Card = ({ children, hover = false, className = '', onClick }) => {
  const baseStyles = 'bg-white rounded-xl shadow-sm border border-gray-100 p-6 transition-all duration-200';
  const hoverStyles = hover ? 'hover:shadow-lg hover:border-primary-200 cursor-pointer' : '';
  
  return (
    <div 
      className={`${baseStyles} ${hoverStyles} ${className}`}
      onClick={onClick}
    >
      {children}
    </div>
  );
};

export default Card;
