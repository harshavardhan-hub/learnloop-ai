import React, { useState, useEffect } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import DashboardLayout from '../components/layout/DashboardLayout';
import TestInstructions from '../components/student/TestInstructions';
import TestInterface from '../components/student/TestInterface';
import Loader from '../components/common/Loader';
import ErrorMessage from '../components/common/ErrorMessage';
import { testService } from '../services/testService';

const TestPage = () => {
  const { testId } = useParams();
  const navigate = useNavigate();
  const [test, setTest] = useState(null);
  const [questions, setQuestions] = useState([]);
  const [attemptId, setAttemptId] = useState(null);
  const [testStarted, setTestStarted] = useState(false);
  const [loading, setLoading] = useState(true);
  const [startingTest, setStartingTest] = useState(false);
  const [error, setError] = useState('');

  useEffect(() => {
    fetchTest();
    // ✅ RESET STATE when testId changes (navigating back to same test)
    setTestStarted(false);
    setAttemptId(null);
    setQuestions([]);
  }, [testId]);

  const fetchTest = async () => {
    try {
      const response = await testService.getTestById(testId);
      setTest(response.test);
    } catch (err) {
      setError(err.message);
    } finally {
      setLoading(false);
    }
  };

  const handleStartTest = async () => {
    setStartingTest(true);
    try {
      console.log('🚀 Starting new test attempt for testId:', testId);
      
      const startResponse = await testService.startTest(testId);
      const newAttemptId = startResponse.attemptId;
      
      console.log('✅ New Attempt ID:', newAttemptId);
      
      setAttemptId(newAttemptId);
      
      const questionsResponse = await testService.getTestQuestions(testId);
      setQuestions(questionsResponse.questions);
      setTestStarted(true);
    } catch (err) {
      setError(err.message);
    } finally {
      setStartingTest(false);
    }
  };

  const handleSubmitTest = async (answers, timeTaken) => {
    try {
      console.log('📝 Submitting test with Attempt ID:', attemptId);
      
      await testService.submitTest(attemptId, answers, timeTaken);
      
      console.log('✅ Navigating to results:', `/results/${attemptId}`);
      
      navigate(`/results/${attemptId}`);
    } catch (err) {
      setError(err.message);
    }
  };

  if (loading) {
    return (
      <DashboardLayout>
        <Loader />
      </DashboardLayout>
    );
  }

  if (error) {
    return (
      <DashboardLayout>
        <ErrorMessage message={error} />
      </DashboardLayout>
    );
  }

  return (
    <DashboardLayout>
      {!testStarted ? (
        <TestInstructions 
          test={test} 
          onStart={handleStartTest}
          loading={startingTest}
        />
      ) : (
        <TestInterface 
          test={test}
          questions={questions}
          onSubmit={handleSubmitTest}
          initialTime={test.duration * 60}
        />
      )}
    </DashboardLayout>
  );
};

export default TestPage;
