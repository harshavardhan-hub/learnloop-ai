import React, { useEffect, useState } from 'react';
import { RefreshCw, CheckCircle, Clock } from 'lucide-react';
import { adminService } from '../../services/adminService';
import Card from '../common/Card';
import Loader from '../common/Loader';
import ErrorMessage from '../common/ErrorMessage';
import { formatDate } from '../../utils/helpers';

const LearningLoopMonitor = () => {
  const [stats, setStats] = useState(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState('');

  useEffect(() => {
    fetchStats();
  }, []);

  const fetchStats = async () => {
    try {
      const response = await adminService.getLearningLoopStats();
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
      <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
        <Card>
          <div className="flex items-center justify-between">
            <div>
              <p className="text-gray-600 text-sm mb-1">Total Loops</p>
              <p className="text-3xl font-bold text-gray-900">{stats.summary.totalLoops}</p>
            </div>
            <RefreshCw className="w-8 h-8 text-primary-600" />
          </div>
        </Card>

        <Card>
          <div className="flex items-center justify-between">
            <div>
              <p className="text-gray-600 text-sm mb-1">Active Loops</p>
              <p className="text-3xl font-bold text-yellow-600">{stats.summary.activeLoops}</p>
            </div>
            <Clock className="w-8 h-8 text-yellow-600" />
          </div>
        </Card>

        <Card>
          <div className="flex items-center justify-between">
            <div>
              <p className="text-gray-600 text-sm mb-1">Mastered</p>
              <p className="text-3xl font-bold text-green-600">{stats.summary.masteredLoops}</p>
            </div>
            <CheckCircle className="w-8 h-8 text-green-600" />
          </div>
        </Card>
      </div>

      {/* Detailed Stats */}
      <Card>
        <h3 className="text-xl font-semibold text-gray-900 mb-6">Learning Loop Details</h3>
        <div className="overflow-x-auto">
          <table className="w-full">
            <thead className="bg-gray-50 border-b border-gray-200">
              <tr>
                <th className="px-4 py-3 text-left text-xs font-semibold text-gray-600 uppercase">Student</th>
                <th className="px-4 py-3 text-left text-xs font-semibold text-gray-600 uppercase">Test</th>
                <th className="px-4 py-3 text-left text-xs font-semibold text-gray-600 uppercase">Attempts</th>
                <th className="px-4 py-3 text-left text-xs font-semibold text-gray-600 uppercase">AI Questions</th>
                <th className="px-4 py-3 text-left text-xs font-semibold text-gray-600 uppercase">Status</th>
                <th className="px-4 py-3 text-left text-xs font-semibold text-gray-600 uppercase">Started</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-gray-200">
              {stats.stats.map((loop, index) => (
                <tr key={index} className="hover:bg-gray-50">
                  <td className="px-4 py-3 text-sm text-gray-900">{loop.studentName}</td>
                  <td className="px-4 py-3 text-sm text-gray-900">{loop.testName}</td>
                  <td className="px-4 py-3 text-sm text-gray-600">{loop.currentAttempt}</td>
                  <td className="px-4 py-3 text-sm text-gray-600">{loop.totalAIQuestions}</td>
                  <td className="px-4 py-3 text-sm">
                    {loop.isMastered ? (
                      <span className="px-3 py-1 bg-green-100 text-green-700 rounded-full text-xs font-medium">
                        Mastered
                      </span>
                    ) : loop.isActive ? (
                      <span className="px-3 py-1 bg-yellow-100 text-yellow-700 rounded-full text-xs font-medium">
                        Active
                      </span>
                    ) : (
                      <span className="px-3 py-1 bg-gray-100 text-gray-700 rounded-full text-xs font-medium">
                        Ended
                      </span>
                    )}
                  </td>
                  <td className="px-4 py-3 text-sm text-gray-600">{formatDate(loop.startedAt)}</td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </Card>
    </div>
  );
};

export default LearningLoopMonitor;
