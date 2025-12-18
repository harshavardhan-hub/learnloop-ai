import React, { useState, useEffect } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import DashboardLayout from '../components/layout/DashboardLayout';
import ResultsDisplay from '../components/student/ResultsPage';
import AIRetrySection from '../components/student/AIRetrySection';
import AIPracticeResults from '../components/student/AIPracticeResults';
import Loader from '../components/common/Loader';
import ErrorMessage from '../components/common/ErrorMessage';
import { testService } from '../services/testService';
import { aiService } from '../services/aiService';

const ResultsPage = ({ isLearningLoop = false }) => {
  const { attemptId, learningLoopId: urlLearningLoopId } = useParams();
  const navigate = useNavigate();
  const [result, setResult] = useState(null);
  const [aiPracticeResult, setAIPracticeResult] = useState(null);
  const [showAIQuestions, setShowAIQuestions] = useState(false);
  const [learningLoopId, setLearningLoopId] = useState(urlLearningLoopId || null);
  const [loading, setLoading] = useState(true);
  const [generatingAI, setGeneratingAI] = useState(false);
  const [error, setError] = useState('');

  useEffect(() => {
    if (isLearningLoop && urlLearningLoopId) {
      // ✅ Coming from "Continue Loop" - fetch last AI practice results
      fetchAIPracticeResults(urlLearningLoopId);
    } else if (attemptId) {
      // Coming from test completion
      fetchResult();
    } else {
      setLoading(false);
    }
  }, [attemptId, urlLearningLoopId, isLearningLoop]);

  const fetchResult = async () => {
    try {
      const response = await testService.getAttemptResult(attemptId);
      setResult(response.result);
    } catch (err) {
      setError(err.message);
    } finally {
      setLoading(false);
    }
  };

  const fetchAIPracticeResults = async (loopId) => {
    try {
      console.log('📊 Fetching AI practice results for loop:', loopId);
      const response = await aiService.getAIPracticeResults(loopId);
      console.log('✅ Results:', response.result);
      
      setAIPracticeResult(response.result);
      setLearningLoopId(loopId);
    } catch (err) {
      console.error('❌ Error fetching results:', err);
      setError(err.message);
    } finally {
      setLoading(false);
    }
  };

  const handleGenerateAI = async () => {
    setGeneratingAI(true);
    try {
      console.log('🤖 Generating AI questions for attempt:', attemptId);
      
      const response = await aiService.generateQuestions(attemptId);
      
      console.log('✅ Generated:', response.aiQuestions?.length, 'questions');
      
      setLearningLoopId(response.learningLoopId);
      setShowAIQuestions(true);
      setAIPracticeResult(null);
    } catch (err) {
      console.error('❌ Generation Error:', err);
      setError(err.message);
    } finally {
      setGeneratingAI(false);
    }
  };

  const handleAIComplete = async (submissionResult) => {
    console.log('🎯 AI Practice submitted');
    
    try {
      // ✅ Fetch detailed results with mistakes
      const detailedResults = await aiService.getAIPracticeResults(learningLoopId);
      console.log('📊 Detailed results:', detailedResults.result);
      
      setAIPracticeResult(detailedResults.result);
      setShowAIQuestions(false);
    } catch (err) {
      console.error('❌ Error fetching results:', err);
      // Fallback to submission result
      setAIPracticeResult(submissionResult);
      setShowAIQuestions(false);
    }
  };

  const handleContinuePractice = async () => {
    setGeneratingAI(true);
    try {
      console.log('🔄 Generating from practice mistakes...');
      const response = await aiService.generateQuestionsFromPractice(learningLoopId);
      console.log('✅ Generated:', response.aiQuestions?.length, 'questions');
      
      if (response.aiQuestions?.length > 0) {
        setAIPracticeResult(null);
        setShowAIQuestions(true);
      } else {
        setError('No new questions generated. You may have answered everything correctly!');
      }
    } catch (err) {
      setError(err.message);
    } finally {
      setGeneratingAI(false);
    }
  };

  const handleBackToDashboard = () => {
    navigate('/dashboard');
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
      {showAIQuestions ? (
        <AIRetrySection 
          learningLoopId={learningLoopId} 
          onComplete={handleAIComplete} 
        />
      ) : aiPracticeResult ? (
        <AIPracticeResults 
          result={aiPracticeResult}
          onContinue={handleContinuePractice}
          onBackToDashboard={handleBackToDashboard}
          generating={generatingAI}
        />
      ) : (
        <ResultsDisplay 
          result={result}
          onGenerateAI={handleGenerateAI}
          onBackToDashboard={handleBackToDashboard}
          generatingAI={generatingAI}
        />
      )}
    </DashboardLayout>
  );
};

export default ResultsPage;
