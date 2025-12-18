import React, { useEffect, useState } from 'react';
import { Search, Filter } from 'lucide-react';
import { adminService } from '../../services/adminService';
import Card from '../common/Card';
import Input from '../common/Input';
import Loader from '../common/Loader';
import ErrorMessage from '../common/ErrorMessage';
import { formatDate } from '../../utils/helpers';

const StudentAnalytics = () => {
  const [results, setResults] = useState([]);
  const [filteredResults, setFilteredResults] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState('');
  const [searchTerm, setSearchTerm] = useState('');

  useEffect(() => {
    fetchResults();
  }, []);

  useEffect(() => {
    filterResults();
  }, [searchTerm, results]);

  const fetchResults = async () => {
    try {
      const response = await adminService.getStudentResults();
      setResults(response.results);
      setFilteredResults(response.results);
    } catch (err) {
      setError(err.message);
    } finally {
      setLoading(false);
    }
  };

  const filterResults = () => {
    if (!searchTerm) {
      setFilteredResults(results);
      return;
    }

    const filtered = results.filter(result =>
      result.studentName.toLowerCase().includes(searchTerm.toLowerCase()) ||
      result.studentEmail.toLowerCase().includes(searchTerm.toLowerCase()) ||
      result.testName.toLowerCase().includes(searchTerm.toLowerCase())
    );
    setFilteredResults(filtered);
  };

  if (loading) return <Loader size="lg" />;
  if (error) return <ErrorMessage message={error} />;

  return (
    <div className="space-y-6">
      <Card>
        <div className="flex items-center justify-between mb-6">
          <h2 className="text-2xl font-bold text-gray-900">Student Results</h2>
          <div className="flex items-center gap-4">
            <div className="relative">
              <Search className="absolute left-3 top-1/2 -translate-y-1/2 w-5 h-5 text-gray-400" />
              <input
                type="text"
                placeholder="Search students or tests..."
                value={searchTerm}
                onChange={(e) => setSearchTerm(e.target.value)}
                className="pl-10 pr-4 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-primary-500"
              />
            </div>
          </div>
        </div>

        <div className="overflow-x-auto">
          <table className="w-full">
            <thead className="bg-gray-50 border-b border-gray-200">
              <tr>
                <th className="px-4 py-3 text-left text-xs font-semibold text-gray-600 uppercase">Student</th>
                <th className="px-4 py-3 text-left text-xs font-semibold text-gray-600 uppercase">Email</th>
                <th className="px-4 py-3 text-left text-xs font-semibold text-gray-600 uppercase">Test</th>
                <th className="px-4 py-3 text-left text-xs font-semibold text-gray-600 uppercase">Domain</th>
                <th className="px-4 py-3 text-left text-xs font-semibold text-gray-600 uppercase">Score</th>
                <th className="px-4 py-3 text-left text-xs font-semibold text-gray-600 uppercase">Accuracy</th>
                <th className="px-4 py-3 text-left text-xs font-semibold text-gray-600 uppercase">Date</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-gray-200">
              {filteredResults.map((result, index) => (
                <tr key={index} className="hover:bg-gray-50">
                  <td className="px-4 py-3 text-sm text-gray-900">{result.studentName}</td>
                  <td className="px-4 py-3 text-sm text-gray-600">{result.studentEmail}</td>
                  <td className="px-4 py-3 text-sm text-gray-900">{result.testName}</td>
                  <td className="px-4 py-3 text-sm text-gray-600">{result.domain}</td>
                  <td className="px-4 py-3 text-sm font-semibold text-gray-900">
                    {result.score}/{result.totalMarks}
                  </td>
                  <td className="px-4 py-3 text-sm">
                    <span className={`font-semibold ${
                      result.accuracy >= 80 ? 'text-green-600' : 
                      result.accuracy >= 60 ? 'text-yellow-600' : 
                      'text-red-600'
                    }`}>
                      {result.accuracy}%
                    </span>
                  </td>
                  <td className="px-4 py-3 text-sm text-gray-600">
                    {formatDate(result.completedAt)}
                  </td>
                </tr>
              ))}
            </tbody>
          </table>

          {filteredResults.length === 0 && (
            <div className="text-center py-12 text-gray-600">
              No results found
            </div>
          )}
        </div>
      </Card>
    </div>
  );
};

export default StudentAnalytics;
