import React, { useState, useEffect, useRef } from "react";
import "tailwindcss/tailwind.css";

const messagesData = [
  { id: 1, text: "Hello!", sender: "user", timestamp: "10:00 AM" },
  { id: 2, text: "Hi there!", sender: "other", timestamp: "10:01 AM" },
  // Add more initial messages if needed
];

const ChatPage = () => {
  const [messages, setMessages] = useState(messagesData);
  const [input, setInput] = useState("");
  const messagesEndRef = useRef(null);

  const handleSend = (e) => {
    e.preventDefault();
    if (input.trim() === "") return;

    const newMessage = {
      id: messages.length + 1,
      text: input,
      sender: "user", // Assume the current user is 'user'
      timestamp: new Date().toLocaleTimeString([], {
        hour: "2-digit",
        minute: "2-digit",
      }),
    };

    setMessages([...messages, newMessage]);
    setInput("");
  };

  const scrollToBottom = () => {
    messagesEndRef.current?.scrollIntoView({ behavior: "smooth" });
  };

  useEffect(() => {
    scrollToBottom();
  }, [messages]);

  return (
    <div className="flex flex-col h-screen bg-gray-100">
      <div className="flex-1 overflow-y-auto p-4">
        {messages.map((message) => (
          <div
            key={message.id}
            className={`flex ${
              message.sender === "user" ? "justify-end" : "justify-start"
            } mb-4`}
          >
            <div
              className={`max-w-xs md:max-w-md lg:max-w-lg xl:max-w-xl rounded-lg px-4 py-2 relative shadow-md ${
                message.sender === "user"
                  ? "bg-blue-500 text-white"
                  : "bg-white text-black"
              }`}
            >
              {message.text}
            </div>
          </div>
        ))}
        <div ref={messagesEndRef} />
      </div>

      <form
        onSubmit={handleSend}
        className="bg-white p-4 flex border-t border-gray-200"
      >
        <input
          type="text"
          className="flex-1 border rounded-full px-4 py-2 focus:outline-none focus:ring-2 focus:ring-blue-500"
          value={input}
          onChange={(e) => setInput(e.target.value)}
          placeholder="Type a message"
        />
        <button
          type="submit"
          className="ml-2 bg-blue-500 text-white px-4 py-2 rounded-full hover:bg-blue-600 focus:outline-none focus:ring-2 focus:ring-blue-500"
        >
          Send
        </button>
      </form>
    </div>
  );
};

export default ChatPage;
