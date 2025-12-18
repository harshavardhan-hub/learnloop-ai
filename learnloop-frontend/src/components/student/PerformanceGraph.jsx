import React from 'react';
import { LineChart, Line, XAxis, YAxis, CartesianGrid, Tooltip, Legend, ResponsiveContainer } from 'recharts';
import Card from '../common/Card';

const PerformanceGraph = ({ data }) => {
  if (!data || data.length === 0) {
    return (
      <Card>
        <div className="text-center py-8 text-gray-600">
          No performance data available yet. Complete some tests to see your progress!
        </div>
      </Card>
    );
  }

  return (
    <Card>
      <h3 className="text-xl font-semibold text-gray-900 mb-6">Performance Trend</h3>
      <ResponsiveContainer width="100%" height={300}>
        <LineChart data={data}>
          <CartesianGrid strokeDasharray="3 3" stroke="#e5e7eb" />
          <XAxis 
            dataKey="attempt" 
            stroke="#6b7280"
            style={{ fontSize: '12px' }}
          />
          <YAxis 
            stroke="#6b7280"
            style={{ fontSize: '12px' }}
            domain={[0, 100]}
          />
          <Tooltip 
            contentStyle={{ 
              backgroundColor: '#fff',
              border: '1px solid #e5e7eb',
              borderRadius: '8px',
              boxShadow: '0 4px 6px -1px rgba(0, 0, 0, 0.1)'
            }}
          />
          <Legend />
          <Line 
            type="monotone" 
            dataKey="accuracy" 
            stroke="#4f46e5" 
            strokeWidth={2}
            dot={{ fill: '#4f46e5', r: 4 }}
            activeDot={{ r: 6 }}
            name="Accuracy (%)"
          />
        </LineChart>
      </ResponsiveContainer>
    </Card>
  );
};

export default PerformanceGraph;
