import React, { useState } from 'react';
import DashboardLayout from '../components/layout/DashboardLayout';
import AdminDashboard from '../components/admin/AdminDashboard';
import TestUpload from '../components/admin/TestUpload';
import StudentAnalytics from '../components/admin/StudentAnalytics';
import LearningLoopMonitor from '../components/admin/LearningLoopMonitor';
import AIUsageStats from '../components/admin/AIUsageStats';
import { useAuth } from '../hooks/useAuth';

const AdminDashboardPage = () => {
  const [activeTab, setActiveTab] = useState('upload');
  const { user } = useAuth();

  return (
    <DashboardLayout>
      <div className="space-y-6">
        {/* Header */}
        <div>
          <h1 className="text-3xl font-bold text-gray-900">Admin Dashboard</h1>
          <p className="text-gray-600 mt-2">Manage tests, monitor students, and track AI usage</p>
        </div>

        {/* Tab Navigation */}
        <AdminDashboard activeTab={activeTab} setActiveTab={setActiveTab} />

        {/* Content */}
        <div>
          {activeTab === 'upload' && <TestUpload />}
          {activeTab === 'students' && <StudentAnalytics />}
          {activeTab === 'loops' && <LearningLoopMonitor />}
          {activeTab === 'ai' && <AIUsageStats />}
        </div>
      </div>
    </DashboardLayout>
  );
};

export default AdminDashboardPage;
