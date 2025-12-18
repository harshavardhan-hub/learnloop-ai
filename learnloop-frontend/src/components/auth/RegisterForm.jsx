import React, { useState } from 'react';
import { useNavigate, Link } from 'react-router-dom';
import { useAuth } from '../../hooks/useAuth';
import Input from '../common/Input';
import Button from '../common/Button';
import ErrorMessage from '../common/ErrorMessage';
import { DOMAINS } from '../../utils/constants';

const RegisterForm = () => {
  const [formData, setFormData] = useState({
    fullName: '',
    email: '',
    password: '',
    confirmPassword: '',
    tenthMarks: '',
    intermediateMarks: '',
    college: '',
    branch: '',
    interestedDomain: '',
    customDomain: ''
  });
  const [error, setError] = useState('');
  const [loading, setLoading] = useState(false);
  const { register } = useAuth();
  const navigate = useNavigate();

  const handleChange = (e) => {
    setFormData({ ...formData, [e.target.name]: e.target.value });
    setError('');
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setError('');

    // Validation
    if (formData.password !== formData.confirmPassword) {
      setError('Passwords do not match');
      return;
    }

    if (formData.password.length < 6) {
      setError('Password must be at least 6 characters');
      return;
    }

    setLoading(true);

    try {
      const { confirmPassword, ...registrationData } = formData;
      await register(registrationData);
      navigate('/dashboard');
    } catch (err) {
      setError(err.message || 'Registration failed. Please try again.');
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="w-full max-w-2xl">
      <div className="text-center mb-8">
        <img 
          src="https://res.cloudinary.com/drit9nkha/image/upload/v1766071522/AI_LOGO_v85osw.png" 
          alt="LearnLoop AI" 
          className="h-16 w-16 mx-auto mb-4"
        />
        <h2 className="text-3xl font-bold text-gray-900">Create Your Account</h2>
        <p className="text-gray-600 mt-2">Start your journey to continuous learning</p>
      </div>

      <div className="bg-white rounded-xl shadow-lg p-8">
        {error && <ErrorMessage message={error} onClose={() => setError('')} />}

        <form onSubmit={handleSubmit} className="space-y-5 mt-6">
          <div className="grid grid-cols-1 md:grid-cols-2 gap-5">
            <Input
              label="Full Name"
              name="fullName"
              placeholder="John Doe"
              value={formData.fullName}
              onChange={handleChange}
              required
            />

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
              placeholder="At least 6 characters"
              value={formData.password}
              onChange={handleChange}
              required
            />

            <Input
              label="Confirm Password"
              type="password"
              name="confirmPassword"
              placeholder="Re-enter password"
              value={formData.confirmPassword}
              onChange={handleChange}
              required
            />

            <Input
              label="10th Marks (%)"
              type="number"
              name="tenthMarks"
              placeholder="85.5"
              min="0"
              max="100"
              step="0.1"
              value={formData.tenthMarks}
              onChange={handleChange}
              required
            />

            <Input
              label="Intermediate Marks (%)"
              type="number"
              name="intermediateMarks"
              placeholder="82.0"
              min="0"
              max="100"
              step="0.1"
              value={formData.intermediateMarks}
              onChange={handleChange}
              required
            />

            <Input
              label="College / University"
              name="college"
              placeholder="ABC University"
              value={formData.college}
              onChange={handleChange}
              required
            />

            <Input
              label="Branch"
              name="branch"
              placeholder="Computer Science"
              value={formData.branch}
              onChange={handleChange}
              required
            />
          </div>

          <div>
            <label className="block text-sm font-medium text-gray-700 mb-2">
              Interested Domain <span className="text-red-500">*</span>
            </label>
            <select
              name="interestedDomain"
              value={formData.interestedDomain}
              onChange={handleChange}
              className="input-field"
              required
            >
              <option value="">Select Domain</option>
              {DOMAINS.map(domain => (
                <option key={domain} value={domain}>{domain}</option>
              ))}
            </select>
          </div>

          {formData.interestedDomain === 'Other' && (
            <Input
              label="Specify Your Domain"
              name="customDomain"
              placeholder="Enter your domain"
              value={formData.customDomain}
              onChange={handleChange}
              required
            />
          )}

          <Button type="submit" loading={loading} className="w-full">
            Create Account
          </Button>
        </form>

        <div className="mt-6 text-center">
          <p className="text-gray-600 text-sm">
            Already have an account?{' '}
            <Link to="/login" className="text-primary-600 font-medium hover:text-primary-700">
              Login here
            </Link>
          </p>
        </div>
      </div>
    </div>
  );
};

export default RegisterForm;
