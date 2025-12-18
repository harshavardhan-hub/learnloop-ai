import React, { useEffect, useState } from 'react';
import { BookOpen, Target, TrendingUp, RefreshCw } from 'lucide-react';
import { testService } from '../../services/testService';
import Card from '../common/Card';
import Loader from '../common/Loader';
import ErrorMessage from '../common/ErrorMessage';

const StudentDashboard = () => {
  const [stats, setStats] = useState(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState('');

  useEffect(() => {
    fetchDashboardStats();
  }, []);

  const fetchDashboardStats = async () => {
    try {
      const response = await testService.getDashboardStats();
      setStats(response.stats);
    } catch (err) {
      setError(err.message);
    } finally {
      setLoading(false);
    }
  };

  if (loading) return <Loader size="lg" />;
  if (error) return <ErrorMessage message={error} />;
  if (!stats) return null;

  const statCards = [
    {
      icon: <BookOpen className="w-6 h-6" />,
      label: 'Tests Attempted',
      value: stats.totalTestsAttempted,
      color: 'bg-blue-500'
    },
    {
      icon: <Target className="w-6 h-6" />,
      label: 'Average Score',
      value: `${stats.averageScore}%`,
      color: 'bg-primary-600'
    },
    {
      icon: <TrendingUp className="w-6 h-6" />,
      label: 'Accuracy',
      value: `${stats.overallAccuracy}%`,
      color: 'bg-accent-600'
    },
    {
      icon: <RefreshCw className="w-6 h-6" />,
      label: 'Active Loops',
      value: stats.activeLearningLoops,
      color: 'bg-purple-600'
    }
  ];

  return (
    <div className="space-y-6">
      {/* Stats Grid */}
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6">
        {statCards.map((stat, index) => (
          <Card key={index} className="hover:shadow-lg transition-shadow">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-gray-600 text-sm mb-1">{stat.label}</p>
                <p className="text-3xl font-bold text-gray-900">{stat.value}</p>
              </div>
              <div className={`${stat.color} text-white p-3 rounded-lg`}>
                {stat.icon}
              </div>
            </div>
          </Card>
        ))}
      </div>

      {/* Weak Areas */}
      {stats.weakAreas && stats.weakAreas.length > 0 && (
        <Card>
          <h3 className="text-xl font-semibold text-gray-900 mb-4">Weak Areas</h3>
          <div className="space-y-3">
            {stats.weakAreas.map((area, index) => (
              <div key={index} className="flex items-center justify-between p-3 bg-gray-50 rounded-lg">
                <span className="text-gray-900 font-medium">{area.topic}</span>
                <span className="text-red-600 font-semibold">{area.errorCount} errors</span>
              </div>
            ))}
          </div>
        </Card>
      )}
    </div>
  );
};

export default StudentDashboard;
