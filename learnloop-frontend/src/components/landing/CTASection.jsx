import React from 'react';
import { Link } from 'react-router-dom';
import { ArrowRight, CheckCircle } from 'lucide-react';
import Button from '../common/Button';

const CTASection = () => {
  const features = [
    'AI-powered question generation',
    'Continuous learning loops',
    'Detailed performance analytics',
    'Domain-specific assessments',
    'Progress tracking & insights',
    'Mastery-focused approach'
  ];

  return (
    <section className="py-20 bg-gradient-to-r from-primary-600 to-accent-600 text-white">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="grid md:grid-cols-2 gap-12 items-center">
          <div>
            <h2 className="text-4xl md:text-5xl font-bold mb-6">
              Ready to Transform Your Learning?
            </h2>
            <p className="text-xl text-primary-50 mb-8">
              Join thousands of students who are mastering their skills through continuous, AI-powered learning.
            </p>
            
            <div className="grid grid-cols-1 sm:grid-cols-2 gap-3 mb-8">
              {features.map((feature, index) => (
                <div key={index} className="flex items-center gap-2">
                  <CheckCircle className="w-5 h-5 text-accent-200 flex-shrink-0" />
                  <span className="text-primary-50">{feature}</span>
                </div>
              ))}
            </div>

            <div className="flex flex-col sm:flex-row gap-4">
              <Link to="/register">
                <Button 
                  variant="secondary" 
                  size="lg" 
                  className="w-full sm:w-auto bg-white text-primary-600 hover:bg-primary-50"
                >
                  Get Started Free
                  <ArrowRight className="w-5 h-5" />
                </Button>
              </Link>
              <Link to="/login">
                <Button 
                  variant="outline" 
                  size="lg" 
                  className="w-full sm:w-auto border-white text-white hover:bg-white/10"
                >
                  Sign In
                </Button>
              </Link>
            </div>
          </div>

          <div className="relative">
            <div className="bg-white/10 backdrop-blur-lg rounded-2xl p-8 border border-white/20">
              <div className="space-y-6">
                <div className="flex items-center gap-4">
                  <div className="w-12 h-12 bg-accent-400 rounded-lg"></div>
                  <div className="flex-1">
                    <div className="h-4 bg-white/30 rounded w-3/4 mb-2"></div>
                    <div className="h-3 bg-white/20 rounded w-1/2"></div>
                  </div>
                </div>
                <div className="flex items-center gap-4">
                  <div className="w-12 h-12 bg-primary-400 rounded-lg"></div>
                  <div className="flex-1">
                    <div className="h-4 bg-white/30 rounded w-3/4 mb-2"></div>
                    <div className="h-3 bg-white/20 rounded w-1/2"></div>
                  </div>
                </div>
                <div className="flex items-center gap-4">
                  <div className="w-12 h-12 bg-accent-300 rounded-lg"></div>
                  <div className="flex-1">
                    <div className="h-4 bg-white/30 rounded w-3/4 mb-2"></div>
                    <div className="h-3 bg-white/20 rounded w-1/2"></div>
                  </div>
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>
    </section>
  );
};

export default CTASection;
