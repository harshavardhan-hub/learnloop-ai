import React, { useState, useEffect } from 'react';
import { Clock, ChevronLeft, ChevronRight, Flag } from 'lucide-react';
import Button from '../common/Button';
import Card from '../common/Card';
import { formatTime } from '../../utils/helpers';
import { useTimer } from '../../hooks/useTimer';

const TestInterface = ({ test, questions, onSubmit, initialTime }) => {
  const [currentQuestion, setCurrentQuestion] = useState(0);
  const [answers, setAnswers] = useState({});
  const [flagged, setFlagged] = useState({});
  const [submitting, setSubmitting] = useState(false);

  const { timeRemaining, start } = useTimer(initialTime, () => handleSubmit());

  useEffect(() => {
    start();
  }, []);

  const handleAnswerSelect = (questionId, answer) => {
    setAnswers(prev => ({
      ...prev,
      [questionId]: answer
    }));
  };

  const toggleFlag = (questionId) => {
    setFlagged(prev => ({
      ...prev,
      [questionId]: !prev[questionId]
    }));
  };

  const handleSubmit = async () => {
    if (submitting) return;
    
    const confirmSubmit = window.confirm(
      'Are you sure you want to submit the test? This action cannot be undone.'
    );
    
    if (!confirmSubmit) return;

    setSubmitting(true);
    const timeTaken = initialTime - timeRemaining;
    await onSubmit(answers, timeTaken);
  };

  const question = questions[currentQuestion];
  const isAnswered = answers[question._id];
  const isFlagged = flagged[question._id];
  const answeredCount = Object.keys(answers).length;

  return (
    <div className="max-w-5xl mx-auto space-y-6">
      {/* Header */}
      <Card>
        <div className="flex items-center justify-between">
          <div>
            <h2 className="text-2xl font-bold text-gray-900">{test.title}</h2>
            <p className="text-gray-600 mt-1">
              Question {currentQuestion + 1} of {questions.length}
            </p>
          </div>
          <div className="flex items-center gap-4">
            <div className={`flex items-center gap-2 px-4 py-2 rounded-lg ${
              timeRemaining < 300 ? 'bg-red-100 text-red-600' : 'bg-primary-100 text-primary-600'
            }`}>
              <Clock className="w-5 h-5" />
              <span className="font-semibold">{formatTime(timeRemaining)}</span>
            </div>
            <Button 
              variant="danger"
              onClick={handleSubmit}
              loading={submitting}
            >
              Submit Test
            </Button>
          </div>
        </div>
      </Card>

      {/* Question Card */}
      <Card>
        <div className="space-y-6">
          <div className="flex items-start justify-between">
            <h3 className="text-lg font-medium text-gray-900 flex-1">
              {question.questionText}
            </h3>
            <button
              onClick={() => toggleFlag(question._id)}
              className={`p-2 rounded-lg transition-colors ${
                isFlagged 
                  ? 'bg-yellow-100 text-yellow-600' 
                  : 'bg-gray-100 text-gray-400 hover:text-yellow-600'
              }`}
            >
              <Flag className="w-5 h-5" />
            </button>
          </div>

          <div className="space-y-3">
            {question.options.map((option, index) => {
              const optionLetter = String.fromCharCode(65 + index);
              const isSelected = answers[question._id] === option.text;

              return (
                <button
                  key={index}
                  onClick={() => handleAnswerSelect(question._id, option.text)}
                  className={`w-full p-4 rounded-lg border-2 text-left transition-all ${
                    isSelected
                      ? 'border-primary-600 bg-primary-50'
                      : 'border-gray-200 hover:border-primary-300 hover:bg-gray-50'
                  }`}
                >
                  <div className="flex items-center gap-3">
                    <div className={`w-8 h-8 rounded-full flex items-center justify-center font-semibold ${
                      isSelected
                        ? 'bg-primary-600 text-white'
                        : 'bg-gray-200 text-gray-600'
                    }`}>
                      {optionLetter}
                    </div>
                    <span className="text-gray-900">{option.text}</span>
                  </div>
                </button>
              );
            })}
          </div>
        </div>
      </Card>

      {/* Navigation */}
      <div className="flex items-center justify-between">
        <Button
          variant="outline"
          onClick={() => setCurrentQuestion(prev => Math.max(0, prev - 1))}
          disabled={currentQuestion === 0}
        >
          <ChevronLeft className="w-4 h-4" />
          Previous
        </Button>

        <div className="text-center">
          <p className="text-sm text-gray-600">
            Answered: <span className="font-semibold text-gray-900">{answeredCount}/{questions.length}</span>
          </p>
        </div>

        <Button
          onClick={() => setCurrentQuestion(prev => Math.min(questions.length - 1, prev + 1))}
          disabled={currentQuestion === questions.length - 1}
        >
          Next
          <ChevronRight className="w-4 h-4" />
        </Button>
      </div>

      {/* Question Navigator */}
      <Card>
        <h4 className="font-semibold text-gray-900 mb-4">Question Navigator</h4>
        <div className="grid grid-cols-5 sm:grid-cols-10 gap-2">
          {questions.map((q, index) => {
            const isCurrentQuestion = index === currentQuestion;
            const isAnsweredQuestion = answers[q._id];
            const isFlaggedQuestion = flagged[q._id];

            return (
              <button
                key={index}
                onClick={() => setCurrentQuestion(index)}
                className={`aspect-square rounded-lg font-semibold text-sm transition-all relative ${
                  isCurrentQuestion
                    ? 'bg-primary-600 text-white scale-110'
                    : isAnsweredQuestion
                    ? 'bg-green-100 text-green-700 hover:bg-green-200'
                    : 'bg-gray-100 text-gray-600 hover:bg-gray-200'
                }`}
              >
                {index + 1}
                {isFlaggedQuestion && (
                  <Flag className="w-3 h-3 absolute -top-1 -right-1 text-yellow-600 fill-yellow-600" />
                )}
              </button>
            );
          })}
        </div>
      </Card>
    </div>
  );
};

export default TestInterface;
