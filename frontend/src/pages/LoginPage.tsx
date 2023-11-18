import React, { useState } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { User } from '../model';

interface LoginPageProps {
  setUser: React.Dispatch<React.SetStateAction<User | undefined>>;
}

export const LoginPage = ({ setUser }: LoginPageProps) => {
  const navigation = useNavigate();
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [errorMessage, setErrorMessage] = useState('');

  const handleLogin = async () => {
    await fetch(import.meta.env.VITE_BACKEND_URL + '/user/login', {
      method: 'POST',
      credentials: 'include',
      headers: {
        'Content-Type': 'application/json',
      },
      body: JSON.stringify({ email, password }),
    })
      .then((response) => {
        if (response.ok) {
          return response.json();
        } else {
          setErrorMessage('Invalid email or password');
        }
      })
      .then((user) => {
        setUser(user);
        navigation('/home', { replace: true });
      });
  };

  // inspired by https://flowbite.com/blocks/marketing/login/
  return (
    <div className="min-h-screen flex items-center justify-center">
      <form
        className="bg-white shadow-md rounded border px-8 pt-6 pb-8 mb-4"
        onSubmit={(e) => {
          e.preventDefault();
          handleLogin();
        }}
      >
        <h2 className="text-2xl font-bold mb-6">Login</h2>
        {errorMessage && (
          <p className="text-red-500 mb-4 text-center">{errorMessage}</p>
        )}
        <div className="mb-4">
          <label
            className="block text-gray-700 text-sm font-bold mb-2"
            htmlFor="email"
          >
            Email
          </label>
          <input
            className="shadow appearance-none border rounded w-full py-2 px-3 text-gray-700 leading-tight"
            id="email"
            type="text"
            placeholder="Email"
            value={email}
            onChange={(e) => setEmail(e.target.value)}
            autoComplete="email"
          />
        </div>
        <div className="mb-6">
          <label
            className="block text-gray-700 text-sm font-bold mb-2"
            htmlFor="password"
          >
            Password
          </label>
          <input
            className="shadow appearance-none border rounded w-full py-2 px-3 text-gray-700 leading-tight"
            id="password"
            type="password"
            placeholder="Password"
            value={password}
            onChange={(e) => setPassword(e.target.value)}
            autoComplete="password"
          />
        </div>
        <div className="flex items-center justify-between">
          <button
            className="w-24 bg-blue-500 border-2 border-blue-500 hover:bg-blue-700 text-white font-bold py-2 px-4 rounded"
            type="submit"
          >
            Login
          </button>
          <Link to="/register">
            <button className="w-24 border-2 border-blue-500 text-blue-500 font-bold py-2 px-4 rounded">
              Register
            </button>
          </Link>
        </div>
      </form>
    </div>
  );
};
