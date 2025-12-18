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
        <Route 
          path="/" 
          element={
            user ? (
              <Navigate to={user.role === 'admin' ? '/admin/dashboard' : '/dashboard'} replace />
            ) : (
              <LandingPage />
            )
          } 
        />
        
        <Route 
          path="/login" 
          element={user ? <Navigate to={user.role === 'admin' ? '/admin/dashboard' : '/dashboard'} replace /> : <LoginPage />} 
        />
        
        <Route 
          path="/register" 
          element={user ? <Navigate to={user.role === 'admin' ? '/admin/dashboard' : '/dashboard'} replace /> : <RegisterPage />} 
        />

        {/* Student Protected Routes */}
        <Route
          path="/dashboard"
          element={
            <ProtectedRoute role="student">
              <StudentDashboardPage />
            </ProtectedRoute>
          }
        />

        <Route
          path="/test/:testId"
          element={
            <ProtectedRoute role="student">
              <TestPage />
            </ProtectedRoute>
          }
        />

        <Route
          path="/results/:attemptId"
          element={
            <ProtectedRoute role="student">
              <ResultsPage />
            </ProtectedRoute>
          }
        />

        {/* Admin Protected Routes */}
        <Route
          path="/admin/dashboard"
          element={
            <ProtectedRoute role="admin">
              <AdminDashboardPage />
            </ProtectedRoute>
          }
        />

        <Route
          path="/admin/*"
          element={
            <ProtectedRoute role="admin">
              <AdminDashboardPage />
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
