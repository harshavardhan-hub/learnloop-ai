import React, { useState, useEffect } from 'react';
import { Sparkles, RefreshCw, CheckCircle } from 'lucide-react';
import { aiService } from '../../services/aiService';
import Card from '../common/Card';
import Button from '../common/Button';
import Loader from '../common/Loader';
import ErrorMessage from '../common/ErrorMessage';

const AIRetrySection = ({ learningLoopId, onComplete }) => {
  const [questions, setQuestions] = useState([]);
  const [currentQuestion, setCurrentQuestion] = useState(0);
  const [answers, setAnswers] = useState({});
  const [loading, setLoading] = useState(true);
  const [submitting, setSubmitting] = useState(false);
  const [generating, setGenerating] = useState(false);
  const [error, setError] = useState('');

  useEffect(() => {
    fetchAIQuestions();
  }, [learningLoopId]);

  const fetchAIQuestions = async () => {
    try {
      console.log('🔍 ========== FRONTEND: FETCHING AI QUESTIONS ==========');
      console.log('🔗 Learning Loop ID:', learningLoopId);
      
      const response = await aiService.getAIQuestions(learningLoopId);
      
      console.log('✅ API Response:', response);
      console.log('📦 Questions Count:', response.aiQuestions?.length);
      console.log('========================================');
      
      setQuestions(response.aiQuestions);
    } catch (err) {
      console.error('❌ Error fetching AI questions:', err);
      setError(err.message);
    } finally {
      setLoading(false);
    }
  };

  const handleAnswerSelect = (questionId, answer) => {
    setAnswers(prev => ({
      ...prev,
      [questionId]: answer
    }));
  };

  const handleSubmit = async () => {
    setSubmitting(true);
    try {
      const response = await aiService.submitAIQuestions(learningLoopId, answers);
      onComplete(response.result);
    } catch (err) {
      setError(err.message);
    } finally {
      setSubmitting(false);
    }
  };

  const handleGenerateMore = async () => {
    setGenerating(true);
    try {
      console.log('🔄 Generating more questions from practice mistakes...');
      const response = await aiService.generateQuestionsFromPractice(learningLoopId);
      console.log('✅ Generated:', response.aiQuestions?.length, 'questions');
      
      // Refresh questions
      await fetchAIQuestions();
    } catch (err) {
      setError(err.message);
    } finally {
      setGenerating(false);
    }
  };

  if (loading) return <Loader />;

  if (error) return <ErrorMessage message={error} />;

  if (questions.length === 0) {
    return (
      <Card className="p-8 text-center">
        <CheckCircle className="w-16 h-16 text-green-500 mx-auto mb-4" />
        <h2 className="text-2xl font-bold text-gray-800 mb-2">All Questions Completed!</h2>
        <p className="text-gray-600 mb-6">
          You've answered all available practice questions.
        </p>
        <Button 
          onClick={handleGenerateMore}
          disabled={generating}
          className="mx-auto"
        >
          {generating ? 'Generating...' : 'Generate More Practice Questions'}
        </Button>
      </Card>
    );
  }

  const question = questions[currentQuestion];
  const answeredCount = Object.keys(answers).length;

  return (
    <div className="space-y-6">
      <Card className="p-6 bg-gradient-to-r from-purple-50 to-indigo-50 border-2 border-purple-200">
        <div className="flex items-center justify-between">
          <div className="flex items-center space-x-3">
            <Sparkles className="w-6 h-6 text-purple-600" />
            <div>
              <h2 className="text-xl font-bold text-gray-800">AI-Generated Practice</h2>
              <p className="text-sm text-gray-600">
                Question {currentQuestion + 1} of {questions.length} | Answered: {answeredCount}
              </p>
            </div>
          </div>
        </div>
      </Card>

      <Card className="p-6">
        <div className="mb-4">
          <span className="text-sm font-medium text-purple-600 bg-purple-100 px-3 py-1 rounded-full">
            {question.topic}
          </span>
        </div>

        <h3 className="text-lg font-semibold text-gray-800 mb-4">
          {question.questionText}
        </h3>

        <div className="space-y-3">
          {question.options.map((option, index) => (
            <button
              key={index}
              onClick={() => handleAnswerSelect(question._id, option.text)}
              className={`w-full text-left p-4 rounded-lg border-2 transition-all ${
                answers[question._id] === option.text
                  ? 'border-purple-500 bg-purple-50'
                  : 'border-gray-200 hover:border-purple-300'
              }`}
            >
              <span className="font-medium">{String.fromCharCode(65 + index)}.</span> {option.text}
            </button>
          ))}
        </div>

        <div className="flex justify-between mt-6">
          <Button
            variant="outline"
            onClick={() => setCurrentQuestion(prev => Math.max(0, prev - 1))}
            disabled={currentQuestion === 0}
          >
            Previous
          </Button>

          {currentQuestion < questions.length - 1 ? (
            <Button
              onClick={() => setCurrentQuestion(prev => prev + 1)}
            >
              Next
            </Button>
          ) : (
            <Button
              onClick={handleSubmit}
              disabled={submitting || answeredCount === 0}
              className="bg-green-600 hover:bg-green-700"
            >
              {submitting ? 'Submitting...' : 'Submit All Answers'}
            </Button>
          )}
        </div>
      </Card>
    </div>
  );
};

export default AIRetrySection;
