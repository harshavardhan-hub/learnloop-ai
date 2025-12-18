import React from 'react';
import { ClipboardList, AlertTriangle, Sparkles, RefreshCw, BarChart3 } from 'lucide-react';

const HowItWorksSection = () => {
  const steps = [
    {
      icon: <ClipboardList className="w-8 h-8" />,
      title: 'Take Test',
      description: 'Choose from domain-specific assessments and complete the test'
    },
    {
      icon: <AlertTriangle className="w-8 h-8" />,
      title: 'See Mistakes',
      description: 'Get detailed breakdown of wrong answers with explanations'
    },
    {
      icon: <Sparkles className="w-8 h-8" />,
      title: 'AI Generates Questions',
      description: 'AI creates similar questions targeting your weak concepts'
    },
    {
      icon: <RefreshCw className="w-8 h-8" />,
      title: 'Retry Until Mastery',
      description: 'Keep practicing in continuous loops until you achieve mastery'
    },
    {
      icon: <BarChart3 className="w-8 h-8" />,
      title: 'Track Growth',
      description: 'Monitor your improvement with detailed analytics and insights'
    }
  ];

  return (
    <section className="py-20 bg-gradient-to-br from-gray-50 to-primary-50">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="text-center mb-16">
          <h2 className="text-4xl font-bold text-gray-900 mb-4">How It Works</h2>
          <p className="text-xl text-gray-600 max-w-3xl mx-auto">
            A simple 5-step process to transform your learning experience
          </p>
        </div>

        <div className="relative">
          {/* Connection Line */}
          <div className="hidden lg:block absolute top-1/2 left-0 right-0 h-1 bg-gradient-to-r from-primary-200 via-accent-200 to-primary-200 -translate-y-1/2 -z-10"></div>

          <div className="grid md:grid-cols-2 lg:grid-cols-5 gap-8">
            {steps.map((step, index) => (
              <div key={index} className="relative">
                <div className="bg-white rounded-xl p-6 shadow-sm hover:shadow-lg transition-all duration-300 border border-gray-100 h-full">
                  {/* Step Number */}
                  <div className="absolute -top-4 -left-4 w-10 h-10 bg-primary-600 text-white rounded-full flex items-center justify-center font-bold text-lg shadow-md">
                    {index + 1}
                  </div>

                  <div className="w-16 h-16 bg-primary-100 text-primary-600 rounded-xl flex items-center justify-center mb-4 mx-auto">
                    {step.icon}
                  </div>

                  <h3 className="text-lg font-semibold text-gray-900 mb-2 text-center">
                    {step.title}
                  </h3>
                  <p className="text-gray-600 text-sm text-center">
                    {step.description}
                  </p>
                </div>
              </div>
            ))}
          </div>
        </div>
      </div>
    </section>
  );
};

export default HowItWorksSection;
