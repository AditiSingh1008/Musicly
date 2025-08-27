import React, { useState } from "react";
import { useNavigate } from "react-router-dom";
import { loadStripe } from "@stripe/stripe-js";
import { FaCrown, FaRocket, FaGem } from "react-icons/fa";

const stripePromise = loadStripe(import.meta.env.VITE_STRIPE_PUBLISHABLE_KEY);

const ExplorePremiumPage = () => {
  const navigate = useNavigate();
  const [selectedPlan, setSelectedPlan] = useState(null);

  const handleCheckout = async () => {
    if (!selectedPlan) {
      alert("Please select a plan!");
      return;
    }

    try {
      const stripe = await stripePromise;
      const response = await fetch("http://localhost:5001/api/explore-premium/create-checkout-session", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ planId: selectedPlan }),
      });

      const session = await response.json();

      if (!session.id) {
        throw new Error("Failed to create Stripe session");
      }

      await stripe.redirectToCheckout({ sessionId: session.id });
    } catch (error) {
      console.error("Checkout error:", error);
      alert("Payment initiation failed.");
    }
  };

  const plans = [
    { id: "basic_plan", name: "Basic Plan", price: "$5.99/month", icon: <FaCrown /> },
    { id: "pro_plan", name: "Pro Plan", price: "$9.99/month", icon: <FaRocket /> },
    { id: "ultimate_plan", name: "Ultimate Plan", price: "$19.99/month", icon: <FaGem /> },
  ];

  return (
   <div className="min-h-screen bg-white text-black dark:bg-gradient-to-br dark:from-black dark:to-gray-900 dark:text-white flex flex-col items-center justify-center px-6 py-12 transition-colors duration-300">

      <h1 className="text-4xl font-extrabold mb-2 text-transparent bg-clip-text bg-gradient-to-r from-purple-400 to-pink-600">
        Explore Premium
      </h1>
      <p className="mb-10 text-gray-400 text-center max-w-md">
        Unlock premium features tailored for your audio journey. Choose the plan that fits you best.
      </p>

      <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 gap-6 mb-10">
        {plans.map((plan) => (
          <div
  key={plan.id}
  className={`backdrop-blur-lg border-2 transition-all duration-300 ${
    selectedPlan === plan.id
      ? "border-pink-500 shadow-lg scale-105"
      : "border-gray-700 hover:border-pink-400"
  } rounded-2xl p-6 w-72 text-center bg-white/80 dark:bg-white/5`}
>
            <div className="text-4xl mb-4 text-pink-400 flex justify-center">{plan.icon}</div>
            <h2 className="text-2xl font-semibold mb-2">{plan.name}</h2>
            <p className="text-green-400 font-medium mb-6">{plan.price}</p>
            <button
              onClick={() => setSelectedPlan(plan.id)}
              className={`w-full py-2 rounded-xl transition font-semibold ${
                selectedPlan === plan.id
                  ? "bg-pink-600"
                  : "bg-pink-500 hover:bg-pink-600"
              } text-white`}
            >
              {selectedPlan === plan.id ? "✓ Selected" : "Choose Plan"}
            </button>
          </div>
        ))}
      </div>

      <div className="flex flex-col items-center gap-4">
        <button
          onClick={handleCheckout}
          disabled={!selectedPlan}
          className="bg-green-500 hover:bg-green-600 px-8 py-3 rounded-full text-white font-semibold text-lg disabled:opacity-50 shadow-lg transition"
        >
          Proceed to Payment
        </button>

        <button
          onClick={() => navigate("/")}
          className="text-sm underline text-blue-400 hover:text-blue-300 mt-2"
        >
          ⬅ Back to Home
        </button>
      </div>
    </div>
  );
};

export default ExplorePremiumPage;
