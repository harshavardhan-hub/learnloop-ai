import React from 'react';
import Navbar from '../components/layout/Navbar';
import RegisterForm from '../components/auth/RegisterForm';

const RegisterPage = () => {
  return (
    <div className="min-h-screen flex flex-col bg-gray-50">
      <Navbar />
      <main className="flex-1 flex items-center justify-center px-4 py-12">
        <RegisterForm />
      </main>
    </div>
  );
};

export default RegisterPage;
