import React from 'react';
import { CheckCircle, XCircle, Trophy, RefreshCw, AlertCircle } from 'lucide-react';
import Card from '../common/Card';
import Button from '../common/Button';

const AIPracticeResults = ({ result, onContinue, onBackToDashboard, generating }) => {
  const percentage = result.accuracy;
  const isMastered = result.isMastered;
  const hasMistakes = result.mistakes && result.mistakes.length > 0;

  return (
    <div className="max-w-4xl mx-auto space-y-6">
      {/* Header */}
      <Card className={`p-6 ${isMastered ? 'bg-gradient-to-r from-green-50 to-emerald-50' : 'bg-gradient-to-r from-blue-50 to-indigo-50'}`}>
        <div className="text-center">
          {isMastered ? (
            <Trophy className="w-16 h-16 text-green-600 mx-auto mb-4" />
          ) : (
            <RefreshCw className="w-16 h-16 text-blue-600 mx-auto mb-4" />
          )}
          <h1 className="text-3xl font-bold text-gray-800 mb-2">
            {isMastered ? '🎉 Mastered!' : 'Practice Complete!'}
          </h1>
          <p className="text-gray-600">
            {isMastered 
              ? "Congratulations! You've mastered this topic!" 
              : "Keep practicing to achieve mastery"}
          </p>
        </div>
      </Card>

      {/* Score Summary */}
      <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
        <Card className="p-6 text-center">
          <div className="text-3xl font-bold text-blue-600 mb-2">
            {percentage}%
          </div>
          <div className="text-sm text-gray-600">Accuracy</div>
        </Card>

        <Card className="p-6 text-center">
          <div className="flex items-center justify-center mb-2">
            <CheckCircle className="w-6 h-6 text-green-600 mr-2" />
            <span className="text-3xl font-bold text-green-600">
              {result.correctAnswers}
            </span>
          </div>
          <div className="text-sm text-gray-600">Correct</div>
        </Card>

        <Card className="p-6 text-center">
          <div className="flex items-center justify-center mb-2">
            <XCircle className="w-6 h-6 text-red-600 mr-2" />
            <span className="text-3xl font-bold text-red-600">
              {result.wrongCount}
            </span>
          </div>
          <div className="text-sm text-gray-600">Wrong</div>
        </Card>
      </div>

      {/* Mistakes Breakdown */}
      {hasMistakes && (
        <Card className="p-6">
          <div className="flex items-center mb-4">
            <AlertCircle className="w-5 h-5 text-red-600 mr-2" />
            <h3 className="font-semibold text-gray-800">Questions You Got Wrong</h3>
          </div>
          
          <div className="space-y-4">
            {result.mistakes.map((mistake, index) => (
              <div key={index} className="border border-red-200 rounded-lg p-4 bg-red-50">
                <div className="mb-3">
                  <span className="text-sm font-medium text-purple-600 bg-purple-100 px-2 py-1 rounded">
                    {mistake.topic}
                  </span>
                </div>
                
                <p className="font-medium text-gray-800 mb-3">
                  {index + 1}. {mistake.questionText}
                </p>
                
                <div className="grid grid-cols-1 md:grid-cols-2 gap-3 mb-3">
                  <div className="bg-red-100 border border-red-300 rounded p-3">
                    <div className="text-xs font-semibold text-red-700 mb-1">Your Answer</div>
                    <div className="text-sm text-red-900">{mistake.studentAnswer}</div>
                  </div>
                  
                  <div className="bg-green-100 border border-green-300 rounded p-3">
                    <div className="text-xs font-semibold text-green-700 mb-1">Correct Answer</div>
                    <div className="text-sm text-green-900">{mistake.correctAnswer}</div>
                  </div>
                </div>
                
                {mistake.explanation && (
                  <div className="bg-blue-50 border border-blue-200 rounded p-3">
                    <div className="text-xs font-semibold text-blue-700 mb-1">Explanation</div>
                    <div className="text-sm text-blue-900">{mistake.explanation}</div>
                  </div>
                )}
              </div>
            ))}
          </div>
        </Card>
      )}

      {/* Action Buttons */}
      <Card className="p-6">
        <div className="flex flex-col sm:flex-row gap-4 justify-center">
          {!isMastered && result.wrongCount > 0 ? (
            <>
              <Button
                onClick={onContinue}
                disabled={generating}
                className="bg-purple-600 hover:bg-purple-700 flex items-center justify-center"
              >
                <RefreshCw className={`w-5 h-5 mr-2 ${generating ? 'animate-spin' : ''}`} />
                {generating ? 'Generating Questions...' : `Generate ${result.wrongCount * 2} More Questions`}
              </Button>
              <Button
                onClick={onBackToDashboard}
                variant="outline"
              >
                Back to Dashboard
              </Button>
            </>
          ) : (
            <Button
              onClick={onBackToDashboard}
              className="bg-blue-600 hover:bg-blue-700"
            >
              Back to Dashboard
            </Button>
          )}
        </div>

        {!isMastered && result.wrongCount > 0 && (
          <p className="text-sm text-gray-600 text-center mt-4">
            💡 Tip: Continue the loop to practice these {result.wrongCount} concepts again
          </p>
        )}
      </Card>
    </div>
  );
};

export default AIPracticeResults;
