import React from 'react';
import { Clock, BookOpen, Award, AlertCircle } from 'lucide-react';
import Button from '../common/Button';
import Card from '../common/Card';
import { formatDuration } from '../../utils/helpers';

const TestInstructions = ({ test, onStart, loading }) => {
  const defaultInstructions = [
    'Read each question carefully before selecting your answer',
    'You can navigate between questions using Previous and Next buttons',
    'All questions are mandatory',
    'Your test will be auto-submitted when time expires',
    'Make sure you have a stable internet connection',
    'Do not refresh the page during the test'
  ];

  const instructions = test.instructions?.length > 0 ? test.instructions : defaultInstructions;

  return (
    <div className="max-w-4xl mx-auto space-y-6">
      <Card>
        <div className="space-y-6">
          {/* Test Header */}
          <div>
            <h1 className="text-3xl font-bold text-gray-900 mb-2">{test.title}</h1>
            {test.description && (
              <p className="text-gray-600">{test.description}</p>
            )}
          </div>

          {/* Test Info */}
          <div className="grid grid-cols-1 md:grid-cols-3 gap-4 p-4 bg-gray-50 rounded-lg">
            <div className="flex items-center gap-3">
              <div className="w-10 h-10 bg-primary-100 text-primary-600 rounded-lg flex items-center justify-center">
                <Clock className="w-5 h-5" />
              </div>
              <div>
                <p className="text-sm text-gray-600">Duration</p>
                <p className="font-semibold text-gray-900">{formatDuration(test.duration)}</p>
              </div>
            </div>
            <div className="flex items-center gap-3">
              <div className="w-10 h-10 bg-accent-100 text-accent-600 rounded-lg flex items-center justify-center">
                <BookOpen className="w-5 h-5" />
              </div>
              <div>
                <p className="text-sm text-gray-600">Questions</p>
                <p className="font-semibold text-gray-900">{test.totalQuestions}</p>
              </div>
            </div>
            <div className="flex items-center gap-3">
              <div className="w-10 h-10 bg-purple-100 text-purple-600 rounded-lg flex items-center justify-center">
                <Award className="w-5 h-5" />
              </div>
              <div>
                <p className="text-sm text-gray-600">Total Marks</p>
                <p className="font-semibold text-gray-900">{test.totalMarks}</p>
              </div>
            </div>
          </div>

          {/* Instructions */}
          <div>
            <div className="flex items-center gap-2 mb-4">
              <AlertCircle className="w-5 h-5 text-primary-600" />
              <h2 className="text-xl font-semibold text-gray-900">Instructions</h2>
            </div>
            <ul className="space-y-2">
              {instructions.map((instruction, index) => (
                <li key={index} className="flex items-start gap-3">
                  <span className="flex-shrink-0 w-6 h-6 bg-primary-100 text-primary-600 rounded-full flex items-center justify-center text-sm font-medium">
                    {index + 1}
                  </span>
                  <span className="text-gray-700 pt-0.5">{instruction}</span>
                </li>
              ))}
            </ul>
          </div>

          {/* Start Button */}
          <div className="pt-6 border-t border-gray-200">
            <Button 
              onClick={onStart} 
              loading={loading}
              size="lg"
              className="w-full"
            >
              Start Test
            </Button>
          </div>
        </div>
      </Card>
    </div>
  );
};

export default TestInstructions;
