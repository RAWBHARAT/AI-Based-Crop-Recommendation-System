import React, { useState } from "react";
import { useNavigate } from "react-router-dom";
import { useLang } from "../utils/useLang";





function Dashboard() {

  const t = useLang();

  const navigate = useNavigate();
  const name = localStorage.getItem("name");

  const [messages, setMessages] = useState([]);
  const [input, setInput] = useState("");
  const [isOpen, setIsOpen] = useState(false);
  

  const sendMessage = async () => {
    if (!input) return;

    const userMsg = { text: input, sender: "user" };
    setMessages((prev) => [...prev, userMsg]);

    try {
      const res = await fetch("http://localhost:5000/api/chat", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({ message: input }),
      });

      const data = await res.json();

      const botMsg = { text: data.reply, sender: "bot" };

      setMessages((prev) => [...prev, botMsg]);

    } catch (error) {
      console.log(error);
    }

    setInput("");
  };


  const logout = () => {
    localStorage.clear();
    navigate("/");
  };

  return (
    <div className="flex min-h-screen bg-gray-100">

      

      {/* 🔹 MAIN CONTENT */}
      <div className="flex-1 p-8">

        {/* HEADER */}
        <div className="flex justify-between items-center mb-6">
          <h1 className="text-3xl font-bold text-green-700">
            📊 {t.dashboard}
          </h1>
          <p className="text-gray-600">
            {t.welcome} {name} 👋
          </p>
        </div>

        {/* 🔹 CARDS */}
        <div className="grid grid-cols-3 gap-6 mb-8">

          <div className="bg-blue-100 p-6 rounded-xl shadow">
            <h2 className="text-lg font-semibold text-blue-700">
              Current Weather
            </h2>
            <p className="text-blue-500 mt-2">Loading...</p>
          </div>

          <div className="bg-yellow-100 p-6 rounded-xl shadow">
            <h2 className="text-lg font-semibold text-yellow-700">
              Latest Mandi Prices
            </h2>
            <p className="text-yellow-500 mt-2">Loading...</p>
          </div>

          <div className="bg-green-100 p-6 rounded-xl shadow">
            <h2 className="text-lg font-semibold text-green-700">
              Recent Recommendation
            </h2>
            <p className="text-green-500 mt-2">Loading...</p>
          </div>

        </div>

        {/* 🔹 RECENT ACTIVITY */}
        <div className="bg-white p-6 rounded-xl shadow">
          <h2 className="text-xl font-semibold mb-4">
            Recent Activity & Recommendations
          </h2>

          <div className="h-32 bg-gray-100 rounded-lg flex items-center justify-center text-gray-400">
            No recent activity
          </div>
        </div>

      </div>

      {/* 🔹 AI BUTTON */}
      {isOpen && (
        <div className="fixed bottom-6 right-6 w-80 bg-white shadow-xl rounded-xl p-4">

          {/* HEADER */}
          <div className="flex justify-between items-center mb-2">
            <h2 className="font-bold">🤖 AI Assistant</h2>

            <button
              onClick={() => setIsOpen(false)}
              className="text-red-500 font-bold"
            >
              ✖
            </button>
          </div>

          {/* CHAT MESSAGES */}
          <div className="h-40 overflow-y-auto mb-2 border p-2 rounded">
            {messages.map((msg, i) => (
              <div
                key={i}
                className={`mb-1 ${msg.sender === "user" ? "text-right" : "text-left"
                  }`}
              >
                <span
                  className={`px-2 py-1 rounded ${msg.sender === "user"
                    ? "bg-green-200"
                    : "bg-gray-200"
                    }`}
                >
                  {msg.text}
                </span>
              </div>
            ))}
          </div>

          {/* INPUT */}
          <input
            value={input}
            onChange={(e) => setInput(e.target.value)}
            onKeyDown={(e) => e.key === "Enter" && sendMessage()}
            placeholder="Ask about crops..."
            className="border p-2 w-full mb-2 rounded"
          />

          {/* SEND BUTTON */}
          <button
            onClick={sendMessage}
            className="bg-green-600 text-white w-full py-2 rounded"
          >
            Send
          </button>

        </div>
      )}
      {!isOpen && (
        <button
          onClick={() => setIsOpen(true)}
          className="fixed bottom-6 right-6 bg-green-600 text-white p-4 rounded-full shadow-lg"
        >
          🤖
        </button>
      )}

    </div>
  );
}

export default Dashboard;