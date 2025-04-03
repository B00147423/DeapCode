"use client";

import React, { useState } from 'react';
import Login from '../components/login';
import SignUp from '../components/signUp';

const AuthPage = () => {
    const [isLogin, setIsLogin] = useState(true);
  
    return (
      <div className="flex justify-center items-center min-h-screen bg-gray-100 p-8">
        <div className="bg-white p-8 rounded-lg shadow-lg w-full sm:w-96">
          <h1 className="text-3xl font-bold text-center mb-6">
            {isLogin ? 'Login' : 'Sign Up'}
          </h1>
          {isLogin ? <Login /> : <SignUp />}
  
          <div className="flex justify-center mt-4">
            <button
              onClick={() => setIsLogin(!isLogin)}
              className="px-4 py-2 mt-4 bg-blue-500 text-white rounded-md hover:bg-blue-600 transition"
              aria-label={isLogin ? 'Switch to Sign Up' : 'Switch to Login'}
            >
              Switch to {isLogin ? 'Sign Up' : 'Login'}
            </button>
          </div>
        </div>
      </div>
    );
  };
  
  export default AuthPage;