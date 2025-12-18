import React from 'react';
import { CheckCircle, XCircle, Trophy, Clock } from 'lucide-react';
import Card from '../common/Card';
import Button from '../common/Button';
import { formatTime, calculatePercentage, getScoreColor } from '../../utils/helpers';

const ResultsDisplay = ({ result, onGenerateAI, onViewDashboard, generatingAI }) => {
  const percentage = calculatePercentage(result.score, result.totalMarks);

  return (
    <div className="max-w-4xl mx-auto space-y-6">
      {/* Score Card */}
      <Card className="text-center bg-gradient-to-br from-primary-50 to-accent-50">
        <div className="space-y-4">
          <div className="w-20 h-20 bg-white rounded-full flex items-center justify-center mx-auto shadow-lg">
            <Trophy className="w-10 h-10 text-primary-600" />
          </div>
          <div>
            <h2 className="text-3xl font-bold text-gray-900 mb-2">Test Completed!</h2>
            <p className="text-gray-600">Here's how you performed</p>
          </div>
        </div>
      </Card>

      {/* Stats Grid */}
      <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
        <Card className="text-center">
          <div className={`text-3xl font-bold mb-2 ${getScoreColor(percentage)}`}>
            {result.score}/{result.totalMarks}
          </div>
          <p className="text-gray-600 text-sm">Score</p>
        </Card>

        <Card className="text-center">
          <div className="text-3xl font-bold text-green-600 mb-2">
            {result.correctAnswers}
          </div>
          <p className="text-gray-600 text-sm">Correct</p>
        </Card>

        <Card className="text-center">
          <div className="text-3xl font-bold text-red-600 mb-2">
            {result.wrongAnswers}
          </div>
          <p className="text-gray-600 text-sm">Wrong</p>
        </Card>

        <Card className="text-center">
          <div className="text-3xl font-bold text-primary-600 mb-2">
            {result.accuracy}%
          </div>
          <p className="text-gray-600 text-sm">Accuracy</p>
        </Card>
      </div>

      {/* Mistake Breakdown */}
      {result.mistakeBreakdown && result.mistakeBreakdown.length > 0 && (
        <Card>
          <h3 className="text-xl font-semibold text-gray-900 mb-4">Mistake Breakdown</h3>
          <div className="space-y-4">
            {result.mistakeBreakdown.map((mistake, index) => (
              <div key={index} className="border border-gray-200 rounded-lg p-4 space-y-3">
                <p className="font-medium text-gray-900">{mistake.questionText}</p>
                
                <div className="grid md:grid-cols-2 gap-4">
                  <div className="flex items-start gap-2">
                    <XCircle className="w-5 h-5 text-red-600 flex-shrink-0 mt-0.5" />
                    <div>
                      <p className="text-sm text-gray-600">Your Answer</p>
                      <p className="text-red-600 font-medium">{mistake.studentAnswer}</p>
                    </div>
                  </div>
                  
                  <div className="flex items-start gap-2">
                    <CheckCircle className="w-5 h-5 text-green-600 flex-shrink-0 mt-0.5" />
                    <div>
                      <p className="text-sm text-gray-600">Correct Answer</p>
                      <p className="text-green-600 font-medium">{mistake.correctAnswer}</p>
                    </div>
                  </div>
                </div>

                {mistake.explanation && (
                  <div className="bg-blue-50 border border-blue-200 rounded-lg p-3">
                    <p className="text-sm text-blue-900">
                      <span className="font-semibold">Explanation:</span> {mistake.explanation}
                    </p>
                  </div>
                )}

                {mistake.topic && (
                  <div className="flex gap-2">
                    <span className="px-3 py-1 bg-gray-100 text-gray-700 rounded-full text-xs font-medium">
                      {mistake.topic}
                    </span>
                    {mistake.concept && (
                      <span className="px-3 py-1 bg-primary-100 text-primary-700 rounded-full text-xs font-medium">
                        {mistake.concept}
                      </span>
                    )}
                  </div>
                )}
              </div>
            ))}
          </div>
        </Card>
      )}

      {/* AI Practice Section */}
      {result.mistakeBreakdown && result.mistakeBreakdown.length > 0 && (
        <Card className="bg-gradient-to-r from-accent-50 to-primary-50 border-2 border-accent-200">
          <div className="text-center space-y-4">
            <h3 className="text-2xl font-bold text-gray-900">
              🔝 AI Practice Based on Your Mistakes
            </h3>
            <p className="text-gray-700">
              Generate personalized questions to master the concepts you struggled with
            </p>
            <Button 
              variant="accent" 
              size="lg"
              onClick={onGenerateAI}
              loading={generatingAI}
            >
              Generate AI Questions
            </Button>
          </div>
        </Card>
      )}

      {/* Actions */}
      <div className="flex gap-4">
        <Button variant="outline" onClick={onViewDashboard} className="flex-1">
          Back to Dashboard
        </Button>
      </div>
    </div>
  );
};

export default ResultsDisplay;
