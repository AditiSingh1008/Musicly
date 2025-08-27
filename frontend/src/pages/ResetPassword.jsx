import React, { useState, useEffect } from 'react';
import { useLocation, useNavigate } from 'react-router-dom';
import axios from 'axios';
import { Eye, EyeOff } from 'lucide-react';
import { ToastContainer, toast } from 'react-toastify';
import 'react-toastify/dist/ReactToastify.css';

const ResetPassword = () => {
  const [otp, setOtp] = useState('');
  const [newPassword, setNewPassword] = useState('');
  const [showPassword, setShowPassword] = useState(false);
  const [emailMissing, setEmailMissing] = useState(false);

  const navigate = useNavigate();
  const location = useLocation();

  const email = location.state?.email || localStorage.getItem('resetEmail');

  useEffect(() => {
    if (!email) {
      setEmailMissing(true);
    } else {
      localStorage.setItem('resetEmail', email);
    }
  }, [email]);

  const handleSubmit = async (e) => {
    e.preventDefault();

    if (!email) {
      toast.error("Email not found. Please go back to 'Forgot Password'.");
      return;
    }

    try {
      const res = await axios.post('http://localhost:5001/api/user/password/reset', {
        email,
        otp,
        newPassword,
      });

      toast.success(res.data.message);

      if (res.data.success) {
        setTimeout(() => {
          localStorage.removeItem('resetEmail');
          navigate('/login');
        }, 2000);
      }
    } catch (err) {
      toast.error('Failed to reset password. Check OTP and try again.');
    }
  };

  return (
    <div className="min-h-screen bg-white dark:bg-black flex items-center justify-center transition-all duration-300">
      <div className="bg-black text-white p-8 rounded-lg w-full max-w-md shadow-lg">
        <h2 className="text-3xl font-bold mb-6 text-center">Reset Password</h2>

        {emailMissing ? (
          <p className="text-red-400 text-center">
            Email not found. Please go back to{' '}
            <span
              className="text-green-400 underline cursor-pointer"
              onClick={() => navigate('/forgot-password')}
            >
              Forgot Password
            </span>
            .
          </p>
        ) : (
          <form onSubmit={handleSubmit}>
            <label className="block text-sm font-medium mb-1">Enter OTP</label>
            <input
              type="text"
              className="w-full p-3 mb-4 rounded-md bg-gray-100 text-black outline-none focus:ring-2 focus:ring-green-500"
              placeholder="Enter OTP"
              value={otp}
              onChange={(e) => setOtp(e.target.value)}
              required
            />

            <label className="block text-sm font-medium mb-1">New Password</label>
            <div className="relative">
              <input
                type={showPassword ? 'text' : 'password'}
                className="w-full p-3 pr-10 rounded-md bg-gray-100 text-black outline-none focus:ring-2 focus:ring-green-500"
                placeholder="Enter new password"
                value={newPassword}
                onChange={(e) => setNewPassword(e.target.value)}
                required
              />
              <div
                className="absolute inset-y-0 right-3 flex items-center cursor-pointer"
                onClick={() => setShowPassword(!showPassword)}
              >
                {showPassword ? (
                  <EyeOff className="w-5 h-5 text-gray-600" />
                ) : (
                  <Eye className="w-5 h-5 text-gray-600" />
                )}
              </div>
            </div>

            <button
              type="submit"
              className="w-full bg-green-500 text-black font-semibold py-2 rounded-full hover:bg-green-600 transition mt-4"
            >
              Reset Password
            </button>
          </form>
        )}

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

export default ResetPassword;
