import React from 'react';
import { Loader2 } from 'lucide-react';

const Loader = ({ fullScreen = false, size = 'md', text = '' }) => {
  const sizes = {
    sm: 'w-4 h-4',
    md: 'w-8 h-8',
    lg: 'w-12 h-12',
    xl: 'w-16 h-16'
  };

  const loader = (
    <div className="flex flex-col items-center justify-center gap-3">
      <Loader2 className={`${sizes[size]} text-primary-600 animate-spin`} />
      {text && <p className="text-gray-600 text-sm">{text}</p>}
    </div>
  );

  if (fullScreen) {
    return (
      <div className="fixed inset-0 flex items-center justify-center bg-white z-50">
        {loader}
      </div>
    );
  }

  return loader;
};

export default Loader;
