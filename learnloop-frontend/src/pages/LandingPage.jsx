import React from 'react';
import Navbar from '../components/layout/Navbar';
import Footer from '../components/layout/Footer';
import HeroSection from '../components/landing/HeroSection';
import ProblemSection from '../components/landing/ProblemSection';
import SolutionSection from '../components/landing/SolutionSection';
import HowItWorksSection from '../components/landing/HowItWorksSection';
import CTASection from '../components/landing/CTASection';

const LandingPage = () => {
  return (
    <div className="min-h-screen flex flex-col">
      <Navbar />
      <main className="flex-1">
        <HeroSection />
        <ProblemSection />
        <SolutionSection />
        <HowItWorksSection />
        <CTASection />
      </main>
      <Footer />
    </div>
  );
};

export default LandingPage;
