import React from 'react';
import { AlertCircle, X } from 'lucide-react';

const ErrorMessage = ({ message, onClose }) => {
  if (!message) return null;

  return (
    <div className="bg-red-50 border border-red-200 rounded-lg p-4 flex items-start gap-3 animate-fadeIn">
      <AlertCircle className="w-5 h-5 text-red-600 flex-shrink-0 mt-0.5" />
      <p className="text-red-800 text-sm flex-1">{message}</p>
      {onClose && (
        <button
          onClick={onClose}
          className="text-red-600 hover:text-red-800 transition-colors"
        >
          <X className="w-4 h-4" />
        </button>
      )}
    </div>
  );
};

export default ErrorMessage;
