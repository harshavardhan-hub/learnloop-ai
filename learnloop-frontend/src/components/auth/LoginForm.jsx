import React, { useState } from 'react';
import { useNavigate, Link } from 'react-router-dom';
import { Mail, Lock } from 'lucide-react';
import { useAuth } from '../../hooks/useAuth';
import Input from '../common/Input';
import Button from '../common/Button';
import ErrorMessage from '../common/ErrorMessage';

const LoginForm = () => {
  const [formData, setFormData] = useState({ email: '', password: '' });
  const [error, setError] = useState('');
  const [loading, setLoading] = useState(false);
  const { login } = useAuth();
  const navigate = useNavigate();

  const handleChange = (e) => {
    setFormData({ ...formData, [e.target.name]: e.target.value });
    setError('');
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setError('');
    setLoading(true);

    try {
      const response = await login(formData.email, formData.password);
      navigate(response.user.role === 'admin' ? '/admin/dashboard' : '/dashboard');
    } catch (err) {
      setError(err.message || 'Login failed. Please try again.');
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="w-full max-w-md">
      <div className="text-center mb-8">
        <img 
          src="https://res.cloudinary.com/drit9nkha/image/upload/v1766036404/LearnLoopAI_LOGO_crucfj.png" 
          alt="LearnLoop AI" 
          className="h-16 w-16 mx-auto mb-4"
        />
        <h2 className="text-3xl font-bold text-gray-900">Welcome Back</h2>
        <p className="text-gray-600 mt-2">Sign in to continue your learning journey</p>
      </div>

      <div className="bg-white rounded-xl shadow-lg p-8">
        {error && <ErrorMessage message={error} onClose={() => setError('')} />}

        <form onSubmit={handleSubmit} className="space-y-5 mt-6">
          <Input
            label="Email"
            type="email"
            name="email"
            placeholder="your.email@example.com"
            value={formData.email}
            onChange={handleChange}
            required
          />

          <Input
            label="Password"
            type="password"
            name="password"
            placeholder="Enter your password"
            value={formData.password}
            onChange={handleChange}
            required
          />

          <Button type="submit" loading={loading} className="w-full">
            Sign In
          </Button>
        </form>

        <div className="mt-6 text-center">
          <p className="text-gray-600 text-sm">
            Don't have an account?{' '}
            <Link to="/register" className="text-primary-600 font-medium hover:text-primary-700">
              Register here
            </Link>
          </p>
        </div>
      </div>
    </div>
  );
};

export default LoginForm;
