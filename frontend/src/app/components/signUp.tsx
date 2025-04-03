"use client";
import React, { useState } from 'react';

const SignUp = () => {
    const [username, setUsername] = useState('');
    const [email, setEmail] = useState('');
    const [password, setPassword] = useState('');
    const [repeatPassword, setRepeatPassword] = useState('');
    const [error, setError] = useState('');

    const handleSignUp = async () => {
        if (password !== repeatPassword) {
          setError('Passwords do not match');
          return;
        }
    
        try {
          const response = await fetch('http://127.0.0.1:8000/auth/signup', {
            method: 'POST',
            headers: {
              'Content-Type': 'application/json',
            },
            body: JSON.stringify({
              username,
              email,
              password,
              repeat_password: repeatPassword,
            }),
          });
    
          const data = await response.json();
    
          if (!response.ok) {
            throw new Error(data.detail || 'Something went wrong');
          }
    
          console.log('Signup successful:', data);
          // Optionally save token or redirect
        } catch (error: any) {
          setError(error.message || 'Something went wrong');
        }
      };
    

  return (
    <div>
      <h2>Sign Up</h2>
      <input
        type="text"
        placeholder="Username"
        value={username}
        onChange={(e) => setUsername(e.target.value)}
      />
      <input
        type="email"
        placeholder="Email"
        value={email}
        onChange={(e) => setEmail(e.target.value)}
      />
      <input
        type="password"
        placeholder="Password"
        value={password}
        onChange={(e) => setPassword(e.target.value)}
      />
      <button onClick={handleSignUp}>Sign Up</button>
    </div>
  );
};

export default SignUp;
