import { BrowserRouter as Router, Routes, Route, Navigate } from 'react-router-dom';
import { useAuth } from './hooks/useAuth';

// Pages
import LandingPage from './pages/LandingPage';
import LoginPage from './pages/LoginPage';
import RegisterPage from './pages/RegisterPage';
import StudentDashboardPage from './pages/StudentDashboardPage';
import TestPage from './pages/TestPage';
import ResultsPage from './pages/ResultsPage';
import AdminDashboardPage from './pages/AdminDashboardPage';
import NotFoundPage from './pages/NotFoundPage';

// Components
import ProtectedRoute from './components/auth/ProtectedRoute';
import Loader from './components/common/Loader';

function App() {
  const { user, loading } = useAuth();

  if (loading) {
    return <Loader />;
  }

  return (
    <Router>
      <Routes>
        {/* Public Routes */}
        <Route path="/" element={!user ? <LandingPage /> : <Navigate to="/dashboard" />} />
        <Route path="/login" element={!user ? <LoginPage /> : <Navigate to="/dashboard" />} />
        <Route path="/register" element={!user ? <RegisterPage /> : <Navigate to="/dashboard" />} />

        {/* Student Protected Routes */}
        <Route 
          path="/dashboard" 
          element={<ProtectedRoute><StudentDashboardPage /></ProtectedRoute>} 
        />
        <Route 
          path="/test/:testId" 
          element={<ProtectedRoute><TestPage /></ProtectedRoute>} 
        />
        <Route 
          path="/results/:attemptId" 
          element={<ProtectedRoute><ResultsPage /></ProtectedRoute>} 
        />
        
        {/* ✅ NEW: Learning Loop Practice Route */}
        <Route 
          path="/learning-loop/:learningLoopId" 
          element={<ProtectedRoute><ResultsPage isLearningLoop={true} /></ProtectedRoute>} 
        />

        {/* Admin Protected Routes */}
        <Route 
          path="/admin" 
          element={<ProtectedRoute adminOnly><AdminDashboardPage /></ProtectedRoute>} 
        />

        <Route 
          path="/learning-loop/:learningLoopId/results" 
          element={
            <ProtectedRoute>
              <ResultsPage isLearningLoop={true} />
            </ProtectedRoute>
          } 
        />

        {/* 404 */}
        <Route path="*" element={<NotFoundPage />} />
      </Routes>
    </Router>
  );
}

export default App;
