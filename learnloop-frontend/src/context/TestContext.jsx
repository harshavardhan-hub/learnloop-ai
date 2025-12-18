import React, { createContext, useState } from 'react';

export const TestContext = createContext();

export const TestProvider = ({ children }) => {
  const [currentTest, setCurrentTest] = useState(null);
  const [currentAttempt, setCurrentAttempt] = useState(null);
  const [answers, setAnswers] = useState({});
  const [timeRemaining, setTimeRemaining] = useState(null);

  const startTest = (test, attemptId, duration) => {
    setCurrentTest(test);
    setCurrentAttempt(attemptId);
    setAnswers({});
    setTimeRemaining(duration * 60); // Convert to seconds
  };

  const updateAnswer = (questionId, answer) => {
    setAnswers(prev => ({
      ...prev,
      [questionId]: answer
    }));
  };

  const clearTest = () => {
    setCurrentTest(null);
    setCurrentAttempt(null);
    setAnswers({});
    setTimeRemaining(null);
  };

  return (
    <TestContext.Provider value={{
      currentTest,
      currentAttempt,
      answers,
      timeRemaining,
      startTest,
      updateAnswer,
      clearTest,
      setTimeRemaining
    }}>
      {children}
    </TestContext.Provider>
  );
};
