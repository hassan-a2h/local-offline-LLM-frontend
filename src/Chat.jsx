import React, { useState, useEffect, useRef } from "react";
import axios from "axios";

const ChatPage = () => {
  const [messages, setMessages] = useState([]);
  const [input, setInput] = useState("");
  const messagesEndRef = useRef(null);
  const backendChatURL = "http://localhost:3000/chat";
  const [waiting, setWaiting] = useState(false);

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

    setMessages((prevMessages) => [...prevMessages, newMessage]);
    setInput("");
    setWaiting(true);
    getReply(newMessage.text);
  };

  async function getReply(input) {
    let reply = { sender: "other" };

    try {
      const response = await axios.post(backendChatURL, {
        query: input,
      });
      reply.text = response?.data?.content;
      console.log(response.data);
    } catch (error) {
      console.error(error);
      reply.text = "error loading message";
    }

    setMessages((prevMessages) => [...prevMessages, reply]);
    setWaiting(false);
  }

  const scrollToBottom = () => {
    messagesEndRef.current?.scrollIntoView({ behavior: "smooth" });
  };

  useEffect(() => {
    scrollToBottom();
  }, [messages]);

  return (
    <div className="flex flex-col h-screen bg-gray-100 mx-32 border border-1 border-slate-300">
      <div className="flex-1 overflow-y-auto p-4">
        {messages.length > 0 &&
          messages.map((message, index) => (
            <div
              key={index}
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

        {waiting && (
          <p className="">
            <svg
              className="animate-spin h-5 w-5 mr-3 ..."
              viewBox="0 0 24 24"
            ></svg>
            fetching reply...
          </p>
        )}
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
