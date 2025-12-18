import React from 'react';
import { Brain, RotateCw, TrendingUp, Target } from 'lucide-react';

const SolutionSection = () => {
  const solutions = [
    {
      icon: <Brain className="w-6 h-6" />,
      title: 'Error-Based AI Questions',
      description: 'AI generates similar questions based on your mistakes to reinforce concepts'
    },
    {
      icon: <RotateCw className="w-6 h-6" />,
      title: 'Continuous Retry Loop',
      description: 'Keep practicing until you master the concept with adaptive difficulty'
    },
    {
      icon: <TrendingUp className="w-6 h-6" />,
      title: 'Personalized Improvement',
      description: 'Data-driven insights show your progress and weak areas in real-time'
    },
    {
      icon: <Target className="w-6 h-6" />,
      title: 'Mastery-Focused Learning',
      description: 'Learning continues until you achieve 80%+ accuracy consistently'
    }
  ];

  return (
    <section className="py-20 bg-white">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="text-center mb-16">
          <h2 className="text-4xl font-bold text-gray-900 mb-4">The Solution</h2>
          <p className="text-xl text-gray-600 max-w-3xl mx-auto">
            LearnLoop AI transforms mistakes into personalized learning opportunities
          </p>
        </div>

        <div className="grid md:grid-cols-2 lg:grid-cols-4 gap-8">
          {solutions.map((solution, index) => (
            <div 
              key={index}
              className="bg-gradient-to-br from-primary-50 to-accent-50 rounded-xl p-6 hover:shadow-lg transition-all duration-300 border border-primary-100"
            >
              <div className="w-12 h-12 bg-primary-600 text-white rounded-lg flex items-center justify-center mb-4">
                {solution.icon}
              </div>
              <h3 className="text-lg font-semibold text-gray-900 mb-2">{solution.title}</h3>
              <p className="text-gray-600 text-sm">{solution.description}</p>
            </div>
          ))}
        </div>
      </div>
    </section>
  );
};

export default SolutionSection;
