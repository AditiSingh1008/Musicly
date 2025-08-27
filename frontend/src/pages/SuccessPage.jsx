import React, { useEffect, useState } from 'react';
import { useLocation, useNavigate } from 'react-router-dom';

const SuccessPage = () => {
  const navigate = useNavigate();
  const location = useLocation();
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const [theme, setTheme] = useState('dark'); // Default to dark

  const sessionId = new URLSearchParams(location.search).get('session_id');

  useEffect(() => {
    const storedTheme = localStorage.getItem('theme');
    setTheme(storedTheme || 'dark');
  }, []);

  useEffect(() => {
    const verifyPayment = async () => {
      if (!sessionId) {
        setError('Invalid session ID');
        setLoading(false);
        return;
      }

      try {
        const response = await fetch(
          `http://localhost:5001/api/explore-premium/verify-session?session_id=${sessionId}`
        );
        const data = await response.json();

        if (!data.success) {
          throw new Error(data.error || 'Payment verification failed');
        }

        setLoading(false);
      } catch (err) {
        console.error('Verification error:', err.message);
        setError(err.message);
        setLoading(false);
      }
    };

    verifyPayment();
  }, [sessionId]);

  const isDark = theme === 'dark';

  if (loading) {
    return (
      <div className={`${isDark ? 'bg-black text-white' : 'bg-white text-black'} min-h-screen flex flex-col items-center justify-center px-4 sm:px-6`}>
        <div className="animate-pulse text-center">
          <p className="text-lg sm:text-xl font-semibold">Verifying your payment...</p>
        </div>
      </div>
    );
  }

  return (
    <div className={`${isDark ? 'bg-black text-white' : 'bg-white text-black'} min-h-screen flex items-center justify-center px-4 sm:px-6 py-10 transition-colors duration-300`}>
      <div className={`${isDark
        ? 'bg-white bg-opacity-10 backdrop-blur-md text-white'
        : 'bg-black bg-opacity-5 text-black'
        } rounded-2xl shadow-2xl w-full max-w-md text-center p-6 sm:p-8`}>
        <h1 className="text-3xl sm:text-4xl font-extrabold mb-4">
          {error ? 'Payment Failed' : '✅ Payment Successful!'}
        </h1>

        <p className={`text-base sm:text-lg mb-6 ${isDark ? 'text-gray-100' : 'text-gray-700'}`}>
          {error
            ? `Oops! ${error}`
            : 'Thanks for your purchase. Premium features are now unlocked!'}
        </p>

        <button
          onClick={() => navigate('/')}
          className={`${isDark
            ? 'bg-green-500 hover:bg-green-600 text-black'
            : 'bg-blue-600 hover:bg-blue-700 text-white'
            } transition duration-300 px-5 py-2.5 sm:px-6 sm:py-3 rounded-full font-semibold shadow-md text-sm sm:text-base`}
        >
          Go to Home
        </button>
      </div>
    </div>
  );
};

export default SuccessPage;
