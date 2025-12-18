import React, { useState } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { Menu, X, LogOut, User, LayoutDashboard } from 'lucide-react';
import { useAuth } from '../../hooks/useAuth';
import Button from '../common/Button';

const Navbar = () => {
  const [isMenuOpen, setIsMenuOpen] = useState(false);
  const { user, logout } = useAuth();
  const navigate = useNavigate();

  const handleLogout = () => {
    logout();
    navigate('/');
  };

  // Get dashboard path based on user role
  const dashboardPath = user?.role === 'admin' ? '/admin/dashboard' : '/dashboard';

  return (
    <nav className="bg-white shadow-sm sticky top-0 z-50">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="flex justify-between items-center h-16">
          {/* Logo */}
          <Link to="/" className="flex items-center space-x-2">
            <div className="w-8 h-8 bg-gradient-to-br from-blue-500 to-purple-600 rounded-lg flex items-center justify-center">
              <span className="text-white font-bold text-xl">L</span>
            </div>
            <span className="text-xl font-bold bg-gradient-to-r from-blue-600 to-purple-600 bg-clip-text text-transparent">
              LearnLoop AI
            </span>
          </Link>

          {/* Desktop Navigation */}
          <div className="hidden md:flex items-center space-x-4">
            {user ? (
              <>
                <Link 
                  to={dashboardPath}
                  className="flex items-center gap-2 px-4 py-2 rounded-lg hover:bg-blue-50 transition"
                >
                  <LayoutDashboard className="w-4 h-4" />
                  Dashboard
                </Link>
                
                <div className="flex items-center gap-3 px-4 py-2 bg-gray-50 rounded-lg">
                  <User className="w-4 h-4 text-gray-600" />
                  <span className="text-sm font-medium">{user.fullName}</span>
                  <span className="text-xs bg-blue-100 text-blue-700 px-2 py-1 rounded">
                    {user.role}
                  </span>
                </div>
                
                <Button
                  onClick={handleLogout}
                  variant="outline"
                  size="sm"
                  className="flex items-center gap-2"
                >
                  <LogOut className="w-4 h-4" />
                  Logout
                </Button>
              </>
            ) : (
              <>
                <Link to="/login">
                  <Button variant="ghost">Login</Button>
                </Link>
                <Link to="/register">
                  <Button>Get Started</Button>
                </Link>
              </>
            )}
          </div>

          {/* Mobile Menu Button */}
          <button
            onClick={() => setIsMenuOpen(!isMenuOpen)}
            className="md:hidden p-2 rounded-lg hover:bg-gray-100"
          >
            {isMenuOpen ? <X className="w-6 h-6" /> : <Menu className="w-6 h-6" />}
          </button>
        </div>

        {/* Mobile Menu */}
        {isMenuOpen && (
          <div className="md:hidden py-4 space-y-2">
            {user ? (
              <>
                <div className="flex items-center gap-3 px-4 py-3 bg-gray-50 rounded-lg mb-2">
                  <User className="w-5 h-5 text-gray-600" />
                  <div className="flex flex-col">
                    <span className="text-sm font-medium">{user.fullName}</span>
                    <span className="text-xs text-gray-500 capitalize">{user.role}</span>
                  </div>
                </div>
                
                <Link
                  to={dashboardPath}
                  className="flex items-center gap-2 px-4 py-3 hover:bg-gray-50 rounded-lg"
                  onClick={() => setIsMenuOpen(false)}
                >
                  <LayoutDashboard className="w-5 h-5" />
                  Dashboard
                </Link>
                
                <button
                  onClick={() => {
                    handleLogout();
                    setIsMenuOpen(false);
                  }}
                  className="w-full flex items-center gap-2 px-4 py-3 hover:bg-gray-50 rounded-lg text-red-600"
                >
                  <LogOut className="w-5 h-5" />
                  Logout
                </button>
              </>
            ) : (
              <>
                <Link
                  to="/login"
                  className="block px-4 py-3 hover:bg-gray-50 rounded-lg"
                  onClick={() => setIsMenuOpen(false)}
                >
                  Login
                </Link>
                <Link
                  to="/register"
                  className="block px-4 py-3 bg-blue-600 text-white rounded-lg text-center hover:bg-blue-700"
                  onClick={() => setIsMenuOpen(false)}
                >
                  Get Started
                </Link>
              </>
            )}
          </div>
        )}
      </div>
    </nav>
  );
};

export default Navbar;
