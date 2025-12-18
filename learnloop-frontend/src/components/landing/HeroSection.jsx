import React from 'react';
import { Link } from 'react-router-dom';
import { ArrowRight, Sparkles } from 'lucide-react';
import Button from '../common/Button';

const HeroSection = () => {
  return (
    <section className="relative bg-gradient-to-br from-primary-50 via-white to-accent-50 py-20 md:py-32 overflow-hidden">
      {/* Background Decoration */}
      <div className="absolute inset-0 overflow-hidden">
        <div className="absolute -top-40 -right-40 w-80 h-80 bg-primary-200 rounded-full opacity-20 blur-3xl"></div>
        <div className="absolute -bottom-40 -left-40 w-80 h-80 bg-accent-200 rounded-full opacity-20 blur-3xl"></div>
      </div>

      <div className="relative max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="grid md:grid-cols-2 gap-12 items-center">
          {/* Left Content */}
          <div className="space-y-8 animate-fadeIn">
            <div className="inline-flex items-center gap-2 bg-primary-100 text-primary-700 px-4 py-2 rounded-full text-sm font-medium">
              <Sparkles className="w-4 h-4" />
              AI-Powered Continuous Learning
            </div>

            <h1 className="text-5xl md:text-6xl font-bold text-gray-900 leading-tight">
              Turn Mistakes into{' '}
              <span className="text-primary-600">Mastery</span>
            </h1>

            <p className="text-xl text-gray-600 leading-relaxed">
              Professional AI-powered assessment platform where mistakes become training data and learning continues in a loop until mastery.
            </p>

            <div className="flex flex-col sm:flex-row gap-4">
              <Link to="/register">
                <Button size="lg" className="w-full sm:w-auto">
                  Get Started
                  <ArrowRight className="w-5 h-5" />
                </Button>
              </Link>
              <Link to="/login">
                <Button variant="secondary" size="lg" className="w-full sm:w-auto">
                  Try Demo
                </Button>
              </Link>
            </div>

            <div className="flex items-center gap-8 pt-4">
              <div>
                <p className="text-3xl font-bold text-gray-900">10K+</p>
                <p className="text-sm text-gray-600">Questions Generated</p>
              </div>
              <div className="h-12 w-px bg-gray-300"></div>
              <div>
                <p className="text-3xl font-bold text-gray-900">95%</p>
                <p className="text-sm text-gray-600">Improvement Rate</p>
              </div>
              <div className="h-12 w-px bg-gray-300"></div>
              <div>
                <p className="text-3xl font-bold text-gray-900">AI</p>
                <p className="text-sm text-gray-600">Powered Learning</p>
              </div>
            </div>
          </div>

          {/* Right Content - Image */}
          <div className="relative animate-slideInRight">
            <div className="relative bg-white rounded-2xl shadow-2xl p-8 border border-gray-100">
              <img 
                src="https://res.cloudinary.com/drit9nkha/image/upload/v1766036404/LearnLoopAI_LOGO_crucfj.png" 
                alt="LearnLoop AI Platform" 
                className="w-full h-auto"
              />
              <div className="absolute -bottom-6 -right-6 bg-accent-500 text-white px-6 py-3 rounded-xl shadow-lg">
                <p className="text-sm font-medium">Continuous Learning Loop</p>
              </div>
            </div>
          </div>
        </div>
      </div>
    </section>
  );
};

export default HeroSection;
