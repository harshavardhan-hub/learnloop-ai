import { useState, useEffect, useRef } from 'react';

export const useTimer = (initialTime, onTimeUp) => {
  const [timeRemaining, setTimeRemaining] = useState(initialTime);
  const [isActive, setIsActive] = useState(false);
  const intervalRef = useRef(null);

  useEffect(() => {
    if (isActive && timeRemaining > 0) {
      intervalRef.current = setInterval(() => {
        setTimeRemaining(prev => {
          if (prev <= 1) {
            setIsActive(false);
            if (onTimeUp) onTimeUp();
            return 0;
          }
          return prev - 1;
        });
      }, 1000);
    }

    return () => {
      if (intervalRef.current) {
        clearInterval(intervalRef.current);
      }
    };
  }, [isActive, timeRemaining, onTimeUp]);

  const start = () => setIsActive(true);
  const pause = () => setIsActive(false);
  const reset = (newTime) => {
    setIsActive(false);
    setTimeRemaining(newTime || initialTime);
  };

  return { timeRemaining, isActive, start, pause, reset };
};
