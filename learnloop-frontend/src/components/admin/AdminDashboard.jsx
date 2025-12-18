import React, { useState } from 'react';
import { Upload, Users, TrendingUp, Sparkles } from 'lucide-react';
import Card from '../common/Card';

const AdminDashboard = ({ activeTab, setActiveTab }) => {
  const tabs = [
    { id: 'upload', label: 'Upload Test', icon: <Upload className="w-5 h-5" /> },
    { id: 'students', label: 'Student Analytics', icon: <Users className="w-5 h-5" /> },
    { id: 'loops', label: 'Learning Loops', icon: <TrendingUp className="w-5 h-5" /> },
    { id: 'ai', label: 'AI Usage', icon: <Sparkles className="w-5 h-5" /> }
  ];

  return (
    <Card>
      <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
        {tabs.map((tab) => (
          <button
            key={tab.id}
            onClick={() => setActiveTab(tab.id)}
            className={`p-4 rounded-lg border-2 transition-all ${
              activeTab === tab.id
                ? 'border-primary-600 bg-primary-50'
                : 'border-gray-200 hover:border-primary-300 hover:bg-gray-50'
            }`}
          >
            <div className="flex flex-col items-center gap-2">
              <div className={`${activeTab === tab.id ? 'text-primary-600' : 'text-gray-600'}`}>
                {tab.icon}
              </div>
              <span className={`text-sm font-medium ${
                activeTab === tab.id ? 'text-primary-600' : 'text-gray-600'
              }`}>
                {tab.label}
              </span>
            </div>
          </button>
        ))}
      </div>
    </Card>
  );
};

export default AdminDashboard;
