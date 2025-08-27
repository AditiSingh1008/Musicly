import React from "react";
import Chatbot from "../components/Chatbot"; // path may vary if you placed Chatbot somewhere else

const ChatbotPage = () => {
  return (
    <div className="min-h-screen bg-black-100 p-4">
<h1 className="text-3xl text-white font-bold text-center mb-6">🎧 Chat with ZenBot</h1>

      <Chatbot />
    </div>
  );
};

export default ChatbotPage;
