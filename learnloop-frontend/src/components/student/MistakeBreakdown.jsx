import React from 'react';
import { CheckCircle, XCircle, Lightbulb } from 'lucide-react';
import Card from '../common/Card';

const MistakeBreakdown = ({ mistakes }) => {
  if (!mistakes || mistakes.length === 0) {
    return (
      <Card>
        <div className="text-center py-8">
          <CheckCircle className="w-16 h-16 text-green-600 mx-auto mb-4" />
          <h3 className="text-xl font-semibold text-gray-900 mb-2">Perfect Score!</h3>
          <p className="text-gray-600">You answered all questions correctly!</p>
        </div>
      </Card>
    );
  }

  return (
    <div className="space-y-4">
      {mistakes.map((mistake, index) => (
        <Card key={index}>
          <div className="space-y-4">
            {/* Question */}
            <div>
              <div className="flex items-start gap-3 mb-3">
                <span className="flex-shrink-0 w-8 h-8 bg-red-100 text-red-600 rounded-full flex items-center justify-center font-semibold text-sm">
                  {index + 1}
                </span>
                <p className="font-medium text-gray-900 flex-1">{mistake.questionText}</p>
              </div>
            </div>

            {/* Answers */}
            <div className="grid md:grid-cols-2 gap-4 pl-11">
              <div className="flex items-start gap-2 p-3 bg-red-50 border border-red-200 rounded-lg">
                <XCircle className="w-5 h-5 text-red-600 flex-shrink-0 mt-0.5" />
                <div>
                  <p className="text-xs text-red-600 font-medium mb-1">Your Answer</p>
                  <p className="text-red-900">{mistake.studentAnswer}</p>
                </div>
              </div>
              
              <div className="flex items-start gap-2 p-3 bg-green-50 border border-green-200 rounded-lg">
                <CheckCircle className="w-5 h-5 text-green-600 flex-shrink-0 mt-0.5" />
                <div>
                  <p className="text-xs text-green-600 font-medium mb-1">Correct Answer</p>
                  <p className="text-green-900">{mistake.correctAnswer}</p>
                </div>
              </div>
            </div>

            {/* Explanation */}
            {mistake.explanation && (
              <div className="pl-11">
                <div className="flex items-start gap-2 p-3 bg-blue-50 border border-blue-200 rounded-lg">
                  <Lightbulb className="w-5 h-5 text-blue-600 flex-shrink-0 mt-0.5" />
                  <div>
                    <p className="text-xs text-blue-600 font-medium mb-1">Explanation</p>
                    <p className="text-blue-900 text-sm">{mistake.explanation}</p>
                  </div>
                </div>
              </div>
            )}

            {/* Tags */}
            {(mistake.topic || mistake.concept) && (
              <div className="flex gap-2 pl-11">
                {mistake.topic && (
                  <span className="px-3 py-1 bg-gray-100 text-gray-700 rounded-full text-xs font-medium">
                    📚 {mistake.topic}
                  </span>
                )}
                {mistake.concept && (
                  <span className="px-3 py-1 bg-primary-100 text-primary-700 rounded-full text-xs font-medium">
                    💡 {mistake.concept}
                  </span>
                )}
              </div>
            )}
          </div>
        </Card>
      ))}
    </div>
  );
};

export default MistakeBreakdown;
