import React from 'react';
import { Link } from 'react-router-dom';
import { Mail, Github, Linkedin, Twitter } from 'lucide-react';

const Footer = () => {
  const currentYear = new Date().getFullYear();

  return (
    <footer className="bg-gray-900 text-gray-300 mt-auto">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-12">
        <div className="grid grid-cols-1 md:grid-cols-4 gap-8">
          {/* Brand */}
          <div className="col-span-1 md:col-span-2">
            <div className="flex items-center gap-3 mb-4">
              <img 
                src="https://res.cloudinary.com/drit9nkha/image/upload/v1766071522/AI_LOGO_v85osw.png" 
                alt="LearnLoop AI" 
                className="h-10 w-10"
              />
              <span className="text-xl font-bold text-white">LearnLoop AI</span>
            </div>
            <p className="text-gray-400 mb-4 max-w-md">
              Professional AI-powered assessment platform where mistakes become training data and learning continues in a loop until mastery.
            </p>
            <div className="flex gap-4">
              <a href="mailto:contact@learnloop.ai" className="hover:text-primary-400 transition-colors">
                <Mail className="w-5 h-5" />
              </a>
              <a href="#" className="hover:text-primary-400 transition-colors">
                <Github className="w-5 h-5" />
              </a>
              <a href="#" className="hover:text-primary-400 transition-colors">
                <Linkedin className="w-5 h-5" />
              </a>
              <a href="#" className="hover:text-primary-400 transition-colors">
                <Twitter className="w-5 h-5" />
              </a>
            </div>
          </div>

          {/* Quick Links */}
          <div>
            <h3 className="text-white font-semibold mb-4">Quick Links</h3>
            <ul className="space-y-2">
              <li><Link to="/" className="hover:text-primary-400 transition-colors">Home</Link></li>
              <li><Link to="/login" className="hover:text-primary-400 transition-colors">Login</Link></li>
              <li><Link to="/register" className="hover:text-primary-400 transition-colors">Register</Link></li>
            </ul>
          </div>

          {/* Legal */}
          <div>
            <h3 className="text-white font-semibold mb-4">Legal</h3>
            <ul className="space-y-2">
              <li><a href="#" className="hover:text-primary-400 transition-colors">Privacy Policy</a></li>
              <li><a href="#" className="hover:text-primary-400 transition-colors">Terms of Service</a></li>
              <li><a href="#" className="hover:text-primary-400 transition-colors">Contact Us</a></li>
            </ul>
          </div>
        </div>

        <div className="border-t border-gray-800 mt-8 pt-8 text-center text-gray-400 text-sm">
          <p>&copy; {currentYear} LearnLoop AI. All rights reserved.</p>
        </div>
      </div>
    </footer>
  );
};

export default Footer;
