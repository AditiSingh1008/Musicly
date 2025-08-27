// src/pages/ForgotPassword.jsx
import React, { useState } from 'react';
import axios from 'axios';
import { useNavigate } from 'react-router-dom';
import { ToastContainer, toast } from 'react-toastify';
import 'react-toastify/dist/ReactToastify.css';

const baseUrl = import.meta.env.VITE_BACKEND_URL;

const ForgotPassword = () => {
  const [email, setEmail] = useState('');
  const navigate = useNavigate();

  const handleSubmit = async (e) => {
    e.preventDefault();
    try {
      const res = await axios.post(`${baseUrl}/api/user/password/forgot`, { email });

      toast.success(res.data.message);
      localStorage.setItem('resetEmail', email);

      setTimeout(() => {
        navigate('/reset-password', { state: { email } });
      }, 1500);
    } catch (error) {
      console.error(error);
      const msg = error?.response?.data?.message || 'Something went wrong. Please try again.';
      toast.error(msg);
    }
  };

  return (
    <div className="min-h-screen bg-white dark:bg-black flex items-center justify-center transition-all duration-300">
      <div className="bg-black text-white p-8 rounded-lg w-full max-w-md shadow-lg">
        <h2 className="text-3xl font-bold mb-6 text-center">Forgot Password</h2>

        <form onSubmit={handleSubmit}>
          <label className="block text-sm font-medium mb-1">Enter your email</label>
          <input
            type="email"
            className="w-full p-3 mb-4 rounded-md bg-gray-100 text-black outline-none focus:ring-2 focus:ring-green-500"
            placeholder="Enter your email"
            value={email}
            onChange={(e) => setEmail(e.target.value)}
            required
          />

          <button
            type="submit"
            className="w-full bg-green-500 text-black font-semibold py-2 rounded-full hover:bg-green-600 transition"
          >
            Send OTP
          </button>
        </form>

        <ToastContainer
          position="top-center"
          autoClose={2000}
          hideProgressBar={false}
          newestOnTop={false}
          closeOnClick
          rtl={false}
          pauseOnFocusLoss
          draggable
          pauseOnHover
          theme="dark"
        />
      </div>
    </div>
  );
};

export default ForgotPassword;
