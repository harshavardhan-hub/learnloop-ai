import React from 'react';
import { useNavigate } from 'react-router-dom';
import { RefreshCw, Trophy, Target } from 'lucide-react';
import Card from '../common/Card';
import Button from '../common/Button';

const LearningLoopStatus = ({ learningLoops }) => {
  const navigate = useNavigate();

  const handleContinueLoop = (learningLoopId) => {
    console.log('🔄 Continue Loop clicked for:', learningLoopId);
    // ✅ Navigate to results page to show last attempt results
    navigate(`/learning-loop/${learningLoopId}/results`);
  };

  if (!learningLoops || learningLoops.length === 0) {
    return (
      <Card className="p-6">
        <div className="text-center text-gray-500">
          <Target className="w-12 h-12 mx-auto mb-3 text-gray-400" />
          <p>No active learning loops</p>
          <p className="text-sm mt-2">Complete a test to start your learning journey!</p>
        </div>
      </Card>
    );
  }

  return (
    <div className="space-y-4">
      <h2 className="text-xl font-bold text-gray-800 flex items-center">
        <RefreshCw className="w-5 h-5 mr-2 text-purple-600" />
        Active Learning Loops
      </h2>

      <div className="grid grid-cols-1 gap-4">
        {learningLoops.map((loop) => (
          <Card key={loop._id} className="p-4 hover:shadow-md transition-shadow">
            <div className="flex items-center justify-between">
              <div className="flex-1">
                <h3 className="font-semibold text-gray-800 mb-1">
                  {loop.testTitle}
                </h3>
                <div className="flex items-center space-x-4 text-sm text-gray-600">
                  <span className="bg-blue-100 text-blue-700 px-2 py-1 rounded">
                    {loop.domain}
                  </span>
                  <span>Attempt: {loop.currentAttempt}</span>
                  <span>AI Questions: {loop.totalAIQuestions}</span>
                  <span className="text-gray-400">
                    {new Date(loop.createdAt).toLocaleDateString('en-US', {
                      month: 'short',
                      day: 'numeric',
                      year: 'numeric'
                    })}
                  </span>
                </div>
              </div>

              <Button
                onClick={() => handleContinueLoop(loop._id)}
                className="bg-purple-600 hover:bg-purple-700 flex items-center"
              >
                <RefreshCw className="w-4 h-4 mr-2" />
                Continue Loop
              </Button>
            </div>
          </Card>
        ))}
      </div>
    </div>
  );
};

export default LearningLoopStatus;
