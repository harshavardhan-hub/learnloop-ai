import { useContext } from 'react';
import { TestContext } from '../context/TestContext';

export const useTest = () => {
  const context = useContext(TestContext);
  
  if (!context) {
    throw new Error('useTest must be used within TestProvider');
  }
  
  return context;
};
