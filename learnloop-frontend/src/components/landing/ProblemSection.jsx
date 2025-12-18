import React from 'react';
import { AlertCircle, X, TrendingDown } from 'lucide-react';

const ProblemSection = () => {
  const problems = [
    {
      icon: <AlertCircle className="w-6 h-6" />,
      title: 'Students Repeat Mistakes',
      description: 'Traditional tests show results but don\'t help fix recurring errors'
    },
    {
      icon: <X className="w-6 h-6" />,
      title: 'No Feedback-Driven Learning',
      description: 'One-time assessments without personalized improvement paths'
    },
    {
      icon: <TrendingDown className="w-6 h-6" />,
      title: 'Tests Don\'t Improve Outcomes',
      description: 'Static questions fail to adapt to individual learning needs'
    }
  ];

  return (
    <section className="py-20 bg-gray-50">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="text-center mb-16">
          <h2 className="text-4xl font-bold text-gray-900 mb-4">The Problem</h2>
          <p className="text-xl text-gray-600 max-w-3xl mx-auto">
            Current learning platforms fail to address the core issue: mistakes aren't learning opportunities
          </p>
        </div>

        <div className="grid md:grid-cols-3 gap-8">
          {problems.map((problem, index) => (
            <div 
              key={index}
              className="bg-white rounded-xl p-8 shadow-sm border border-red-100 hover:shadow-md transition-shadow"
            >
              <div className="w-12 h-12 bg-red-50 text-red-600 rounded-lg flex items-center justify-center mb-4">
                {problem.icon}
              </div>
              <h3 className="text-xl font-semibold text-gray-900 mb-3">{problem.title}</h3>
              <p className="text-gray-600">{problem.description}</p>
            </div>
          ))}
        </div>
      </div>
    </section>
  );
};

export default ProblemSection;
