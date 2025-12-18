import React, { useEffect, useState } from 'react';
import { Sparkles, TrendingUp, CheckCircle } from 'lucide-react';
import { adminService } from '../../services/adminService';
import Card from '../common/Card';
import Loader from '../common/Loader';
import ErrorMessage from '../common/ErrorMessage';

const AIUsageStats = () => {
  const [stats, setStats] = useState(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState('');

  useEffect(() => {
    fetchStats();
  }, []);

  const fetchStats = async () => {
    try {
      const response = await adminService.getAIUsageStats();
      setStats(response);
    } catch (err) {
      setError(err.message);
    } finally {
      setLoading(false);
    }
  };

  if (loading) return <Loader size="lg" />;
  if (error) return <ErrorMessage message={error} />;
  if (!stats) return null;

  return (
    <div className="space-y-6">
      {/* Summary Cards */}
      <div className="grid grid-cols-1 md:grid-cols-4 gap-6">
        <Card>
          <div className="flex items-center justify-between">
            <div>
              <p className="text-gray-600 text-sm mb-1">Total AI Questions</p>
              <p className="text-3xl font-bold text-gray-900">{stats.summary.totalAIQuestions}</p>
            </div>
            <Sparkles className="w-8 h-8 text-primary-600" />
          </div>
        </Card>

        <Card>
          <div className="flex items-center justify-between">
            <div>
              <p className="text-gray-600 text-sm mb-1">Attempted</p>
              <p className="text-3xl font-bold text-accent-600">{stats.summary.attemptedAIQuestions}</p>
            </div>
            <TrendingUp className="w-8 h-8 text-accent-600" />
          </div>
        </Card>

        <Card>
          <div className="flex items-center justify-between">
            <div>
              <p className="text-gray-600 text-sm mb-1">Correct</p>
              <p className="text-3xl font-bold text-green-600">{stats.summary.correctAIAnswers}</p>
            </div>
            <CheckCircle className="w-8 h-8 text-green-600" />
          </div>
        </Card>

        <Card>
          <div className="flex items-center justify-between">
            <div>
              <p className="text-gray-600 text-sm mb-1">Accuracy</p>
              <p className="text-3xl font-bold text-primary-600">{stats.summary.accuracy}%</p>
            </div>
            <div className="w-8 h-8 bg-primary-100 rounded-full flex items-center justify-center">
              <span className="text-primary-600 font-bold">%</span>
            </div>
          </div>
        </Card>
      </div>

      {/* By Test */}
      <Card>
        <h3 className="text-xl font-semibold text-gray-900 mb-6">AI Questions by Test</h3>
        <div className="space-y-3">
          {stats.byTest.map((test, index) => (
            <div key={index} className="flex items-center justify-between p-4 bg-gray-50 rounded-lg hover:bg-gray-100 transition-colors">
              <div className="flex-1">
                <p className="font-medium text-gray-900">{test.testName}</p>
                <p className="text-sm text-gray-600">{test.domain}</p>
              </div>
              <div className="text-right">
                <p className="text-2xl font-bold text-primary-600">{test.aiQuestionsGenerated}</p>
                <p className="text-xs text-gray-600">questions</p>
              </div>
            </div>
          ))}

          {stats.byTest.length === 0 && (
            <div className="text-center py-12 text-gray-600">
              No AI questions generated yet
            </div>
          )}
        </div>
      </Card>
    </div>
  );
};

export default AIUsageStats;
