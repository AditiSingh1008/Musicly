import React, { useEffect, useState, useRef } from 'react';
import { FaMicrophone, FaPaperPlane } from 'react-icons/fa';

const Chatbot = () => {
  const [input, setInput] = useState('');
  const [messages, setMessages] = useState([]);
  const [listening, setListening] = useState(false);
  const recognitionRef = useRef(null);
  const messagesEndRef = useRef(null);

  useEffect(() => {
    fetch('http://localhost:5001/api/chat/history')
      .then(res => res.json())
      .then(data => setMessages(data.reverse()))
      .catch(err => console.error('Failed to fetch chat history', err));
  }, []);

  useEffect(() => {
    if (!('webkitSpeechRecognition' in window)) {
      alert('Your browser does not support Speech Recognition');
      return;
    }

    const SpeechRecognition = window.webkitSpeechRecognition;
    const recognition = new SpeechRecognition();
    recognition.continuous = false;
    recognition.lang = 'en-US';

    recognition.onstart = () => setListening(true);
    recognition.onend = () => setListening(false);

    recognition.onresult = (event) => {
      const transcript = event.results[0][0].transcript.trim();
      if (!transcript) {
        console.log('⚠️ Empty voice input detected.');
        return;
      }
      setInput(transcript);
      handleSend(transcript);
    };

    recognitionRef.current = recognition;
  }, []);

  useEffect(() => {
    messagesEndRef.current?.scrollIntoView({ behavior: 'smooth' });
  }, [messages]);

  const startListening = () => {
    recognitionRef.current?.start();
  };

  const handleSend = async (query = input) => {
    if (!query.trim()) return;

    const newMessage = { sender: 'user', text: query };
    setMessages(prev => [...prev, newMessage]);
    setInput('');

    try {
      const res = await fetch('http://localhost:5001/api/chat', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ message: query }),
      });

      const data = await res.json();

      const botMessage = {
        sender: 'bot',
        text: data.reply || '❗️Sorry, I didn’t understand that.',
        gif: data.gif || null,
      };

      setMessages(prev => [...prev, botMessage]);
    } catch (err) {
      console.error('Error sending chat:', err);
      const errorMessage = {
        sender: 'bot',
        text: '⚠️ An error occurred while fetching response.',
      };
      setMessages(prev => [...prev, errorMessage]);
    }
  };

  return (
    <div className="p-4 sm:p-6 max-w-2xl mx-auto bg-gradient-to-tr from-indigo-100 to-purple-100 shadow-xl rounded-2xl min-h-[80vh] flex flex-col">
      <div className="text-xl sm:text-2xl font-bold mb-4 sm:mb-6 text-center text-purple-800">
        🎵 AudioZen Chatbot
      </div>

      <div className="flex-1 overflow-y-auto px-2 sm:px-4 pb-3 sm:pb-4 bg-white rounded-xl shadow-inner border flex flex-col">
        {messages
          .filter((msg) => msg?.text?.trim())
          .map((msg, idx) => (
            <div
              key={idx}
              className={`flex mb-2 ${msg.sender === 'user' ? 'justify-end' : 'justify-start'}`}
            >
              <div
                className={`p-3 rounded-2xl max-w-[75%] text-sm shadow-md break-words ${
                  msg.sender === 'user'
                    ? 'bg-purple-500 text-white rounded-tr-none'
                    : 'bg-gray-100 text-black rounded-tl-none'
                }`}
              >
                <p>{msg.text}</p>
                {msg.gif && (
                  <img src={msg.gif} alt="gif" className="mt-2 rounded-md max-w-full" />
                )}
              </div>
            </div>
          ))}
        <div ref={messagesEndRef} />
      </div>

      <div className="mt-4 flex flex-col sm:flex-row items-stretch sm:items-center gap-2">
        <input
          type="text"
          className="flex-1 border border-gray-300 rounded-full px-4 py-2 text-sm shadow-sm focus:ring-2 focus:ring-purple-400 focus:outline-none"
          placeholder="Type your message..."
          value={input}
          onChange={(e) => setInput(e.target.value)}
          onKeyDown={(e) => e.key === 'Enter' && handleSend()}
        />
        <div className="flex gap-2 justify-between sm:justify-normal">
          <button
            onClick={() => handleSend()}
            className="bg-purple-600 hover:bg-purple-700 text-white p-3 rounded-full shadow-md"
          >
            <FaPaperPlane />
          </button>
          <button
            onClick={startListening}
            className={`${
              listening ? 'bg-red-500' : 'bg-green-500'
            } hover:opacity-90 text-white p-3 rounded-full shadow-md`}
          >
            <FaMicrophone />
          </button>
        </div>
      </div>
    </div>
  );
};

export default Chatbot;
