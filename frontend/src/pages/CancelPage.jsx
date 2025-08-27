// CancelPage.jsx
import React from 'react';
import { useNavigate } from 'react-router-dom';

const CancelPage = () => {
  const navigate = useNavigate();

  return (
    <div className="min-h-screen flex items-center justify-center bg-gradient-to-br from-red-500 to-red-700 text-white px-6 py-10">
      <div className="bg-white bg-opacity-10 backdrop-blur-md rounded-2xl shadow-2xl max-w-md w-full text-center p-8">
        <h1 className="text-4xl font-extrabold mb-4">❌ Payment Canceled</h1>

        <p className="text-gray-100 text-lg mb-6">
          You canceled the payment. Feel free to try again or choose a different plan.
        </p>

        <button
          onClick={() => navigate('/explore-premium')}
          className="mt-4 bg-blue-600 hover:bg-blue-700 transition duration-300 px-6 py-3 rounded-lg font-semibold text-white shadow-md"
        >
          Back to Plans
        </button>
      </div>
    </div>
  );
};

export default CancelPage;
