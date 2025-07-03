import React, { useState } from 'react';
import { loginUser } from '../services/api';
import { setToken, getToken } from '../utils/auth';
import { useNavigate, Navigate, Link } from 'react-router-dom';

export default function Login() {
  let [credentials, setCredentials] = useState({ email: '', password: '' });
  let [error, setError] = useState('');
  let navigate = useNavigate();

  let token = getToken();
  if (token) return <Navigate to="/" replace />;

  let handleChange = (e) => {
    setCredentials({ ...credentials, [e.target.name]: e.target.value });
  };

  let handleLogin = async (e) => {
    e.preventDefault();
    try {
      let res = await loginUser(credentials);
      setToken(res.data.token);
      localStorage.setItem('userId', res.data.user._id);
      localStorage.setItem('userEmail', res.data.user.email);
      navigate('/');
    } catch (err) {
      setError(err.response?.data?.msg || 'Login failed');
    }
  };

  return (
    <div className="flex min-h-full flex-col justify-center px-6 py-12 lg:px-8">
      <div className="sm:mx-auto sm:w-full sm:max-w-sm">
        <h2 className="mt-10 text-center text-2xl/9 font-bold tracking-tight text-gray-900">Sign in to your account</h2>
      </div>

      <div className="mt-10 sm:mx-auto sm:w-full sm:max-w-sm">
        <form className="space-y-6" onSubmit={handleLogin} method="POST">
          <div>
            <label for="email" className="block text-sm/6 font-medium text-gray-900">Email address</label>
            <div className="mt-2">
              <input type="email" name="email" onChange={handleChange} id="email" autocomplete="email" required className="block w-full rounded-md bg-white px-3 py-1.5 text-base text-gray-900 outline-1 -outline-offset-1 outline-gray-300 placeholder:text-gray-400 focus:outline-2 focus:-outline-offset-2 focus:outline-indigo-600 sm:text-sm/6" />
            </div>
          </div>

          <div>
            <div className="flex items-center justify-between">
              <label for="password" className="block text-sm/6 font-medium text-gray-900">Password</label>
            </div>
            <div className="mt-2">
              <input type="password" name="password" onChange={handleChange} id="password" autocomplete="current-password" required className="block w-full rounded-md bg-white px-3 py-1.5 text-base text-gray-900 outline-1 -outline-offset-1 outline-gray-300 placeholder:text-gray-400 focus:outline-2 focus:-outline-offset-2 focus:outline-indigo-600 sm:text-sm/6" />
            </div>
          </div>

          <div>
            <button type="submit" className="flex w-full justify-center rounded-md bg-indigo-600 px-3 py-1.5 text-sm/6 font-semibold text-white shadow-xs hover:bg-indigo-500 focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-indigo-600">Sign in</button>
          </div>
        </form>

        <p className="mt-10 text-center text-sm/6 text-gray-500">
          Not a member?
          <Link to="/register" className="font-medium text-primary-600 hover:underline dark:text-primary-500">
            Sign up
          </Link>
        </p>
      </div>
    </div>
  );
}


