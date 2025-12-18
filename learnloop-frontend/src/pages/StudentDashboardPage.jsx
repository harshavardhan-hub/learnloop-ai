import React, { useState, useEffect } from 'react';
import { BookOpen, History, RefreshCw } from 'lucide-react';
import DashboardLayout from '../components/layout/DashboardLayout';
import StudentDashboard from '../components/student/StudentDashboard';
import TestCard from '../components/student/TestCard';
import LearningLoopStatus from '../components/student/LearningLoopStatus';
import Card from '../components/common/Card';
import Loader from '../components/common/Loader';
import ErrorMessage from '../components/common/ErrorMessage';
import { testService } from '../services/testService';
import { useAuth } from '../hooks/useAuth';

const StudentDashboardPage = () => {
  const [activeTab, setActiveTab] = useState('overview');
  const [tests, setTests] = useState([]);
  const [history, setHistory] = useState([]);
  const [learningLoops, setLearningLoops] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState('');
  const { user } = useAuth();

  useEffect(() => {
    fetchData();
  }, []);

  const fetchData = async () => {
    try {
      const [testsRes, historyRes, loopsRes] = await Promise.all([
        testService.getAllTests({ isActive: true }),
        testService.getTestHistory(),
        testService.getActiveLearningLoops()
      ]);

      setTests(testsRes.tests);
      setHistory(historyRes.history);
      setLearningLoops(loopsRes.learningLoops);
    } catch (err) {
      setError(err.message);
    } finally {
      setLoading(false);
    }
  };

  const tabs = [
    { id: 'overview', label: 'Overview', icon: <BookOpen className="w-5 h-5" /> },
    { id: 'tests', label: 'Available Tests', icon: <BookOpen className="w-5 h-5" /> },
    { id: 'history', label: 'Test History', icon: <History className="w-5 h-5" /> },
    { id: 'loops', label: 'Learning Loops', icon: <RefreshCw className="w-5 h-5" /> }
  ];

  return (
    <DashboardLayout>
      <div className="space-y-6">
        {/* Header */}
        <div>
          <h1 className="text-3xl font-bold text-gray-900">
            Welcome back, {user?.fullName}!
          </h1>
          <p className="text-gray-600 mt-2">Track your progress and continue learning</p>
        </div>

        {/* Tab Navigation */}
        <Card>
          <div className="flex flex-wrap gap-2">
            {tabs.map((tab) => (
              <button
                key={tab.id}
                onClick={() => setActiveTab(tab.id)}
                className={`flex items-center gap-2 px-4 py-2 rounded-lg font-medium transition-all ${
                  activeTab === tab.id
                    ? 'bg-primary-600 text-white'
                    : 'bg-gray-100 text-gray-600 hover:bg-gray-200'
                }`}
              >
                {tab.icon}
                {tab.label}
              </button>
            ))}
          </div>
        </Card>

        {/* Content */}
        {loading ? (
          <Loader size="lg" />
        ) : error ? (
          <ErrorMessage message={error} />
        ) : (
          <>
            {activeTab === 'overview' && <StudentDashboard />}

            {activeTab === 'tests' && (
              <div className="space-y-6">
                <h2 className="text-2xl font-bold text-gray-900">Available Tests</h2>
                {tests.length === 0 ? (
                  <Card>
                    <div className="text-center py-12 text-gray-600">
                      No tests available at the moment
                    </div>
                  </Card>
                ) : (
                  <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
                    {tests.map((test) => (
                      <TestCard key={test._id} test={test} />
                    ))}
                  </div>
                )}
              </div>
            )}

            {activeTab === 'history' && (
              <div className="space-y-6">
                <h2 className="text-2xl font-bold text-gray-900">Test History</h2>
                {history.length === 0 ? (
                  <Card>
                    <div className="text-center py-12 text-gray-600">
                      No test history yet. Take your first test!
                    </div>
                  </Card>
                ) : (
                  <Card>
                    <div className="overflow-x-auto">
                      <table className="w-full">
                        <thead className="bg-gray-50 border-b border-gray-200">
                          <tr>
                            <th className="px-4 py-3 text-left text-xs font-semibold text-gray-600 uppercase">Test Name</th>
                            <th className="px-4 py-3 text-left text-xs font-semibold text-gray-600 uppercase">Domain</th>
                            <th className="px-4 py-3 text-left text-xs font-semibold text-gray-600 uppercase">Date</th>
                            <th className="px-4 py-3 text-left text-xs font-semibold text-gray-600 uppercase">Score</th>
                            <th className="px-4 py-3 text-left text-xs font-semibold text-gray-600 uppercase">Accuracy</th>
                            <th className="px-4 py-3 text-left text-xs font-semibold text-gray-600 uppercase">Attempt</th>
                          </tr>
                        </thead>
                        <tbody className="divide-y divide-gray-200">
                          {history.map((item) => (
                            <tr key={item.attemptId} className="hover:bg-gray-50">
                              <td className="px-4 py-3 text-sm text-gray-900">{item.testName}</td>
                              <td className="px-4 py-3 text-sm text-gray-600">{item.domain}</td>
                              <td className="px-4 py-3 text-sm text-gray-600">
                                {new Date(item.date).toLocaleDateString()}
                              </td>
                              <td className="px-4 py-3 text-sm font-semibold text-gray-900">{item.score}</td>
                              <td className="px-4 py-3 text-sm">
                                <span className={`font-semibold ${
                                  item.accuracy >= 80 ? 'text-green-600' : 
                                  item.accuracy >= 60 ? 'text-yellow-600' : 
                                  'text-red-600'
                                }`}>
                                  {item.accuracy}%
                                </span>
                              </td>
                              <td className="px-4 py-3 text-sm text-gray-600">#{item.attemptNumber}</td>
                            </tr>
                          ))}
                        </tbody>
                      </table>
                    </div>
                  </Card>
                )}
              </div>
            )}

            {activeTab === 'loops' && (
              <div className="space-y-6">
                <h2 className="text-2xl font-bold text-gray-900">Active Learning Loops</h2>
                <LearningLoopStatus loops={learningLoops} />
              </div>
            )}
          </>
        )}
      </div>
    </DashboardLayout>
  );
};

export default StudentDashboardPage;
