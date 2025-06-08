import React, { useState, useEffect } from "react";
import axios from "axios";

interface Message {
  sender: "user" | "bot";
  text: string;
}

const Chatbot: React.FC = () => {
  const [input, setInput] = useState("");
  const [messages, setMessages] = useState<Message[]>([]);
  const [history, setHistory] = useState<any[]>([]);
  const [open, setOpen] = useState(false);

  const clampPosition = () => {
    const width = Math.min(350, window.innerWidth * 0.9);
    const height = Math.min(400, window.innerHeight * 0.6);
    return {
      top: window.innerHeight - height - 20,
      left: window.innerWidth - width - 20,
      width,
      height,
    };
  };

  const [position, setPosition] = useState(clampPosition());

  useEffect(() => {
    const handleResize = () => {
      const width = Math.min(350, window.innerWidth * 0.9);
      const height = Math.min(400, window.innerHeight * 0.6);
      const maxLeft = window.innerWidth - width - 20;
      const maxTop = window.innerHeight - height - 20;

      setPosition((pos) => ({
        top: Math.min(pos.top, maxTop),
        left: maxLeft,  // Always keep right aligned on resize
        width,
        height,
      }));
    };

    window.addEventListener("resize", handleResize);
    return () => window.removeEventListener("resize", handleResize);
  }, []);

  const handleSend = async () => {
    if (!input.trim()) return;

    const userMessage = { sender: "user", text: input };
    setMessages((prev) => [...prev, userMessage]);
    setInput("");

    try {
      const response = await axios.post("https://dysarthria-chatbot-backend.vercel.app/getanswer", {
        prompt: input,
        history: history,
      });

      const botReply = response.data.answer || "Sorry, no response received from server.";
      const botMessage = { sender: "bot", text: botReply };

      setMessages((prev) => [...prev, botMessage]);
      setHistory(response.data.history || []);
    } catch (error) {
      console.error(error);
      setMessages((prev) => [
        ...prev,
        { sender: "bot", text: "Error contacting server." },
      ]);
    }
  };

  return (
    <>
      {!open && (
        <button
          onClick={() => setOpen(true)}
          className="fixed bottom-5 right-5 bg-slate-800 text-white rounded-full w-14 h-14 flex items-center justify-center shadow-lg hover:bg-blue-700 transition"
          aria-label="Open Chatbot"
          title="Open Chatbot"
        >
          💬
        </button>
      )}

      {open && (
        <div
          style={{
            position: "fixed",
            top: position.top,
            left: position.left,
            width: position.width,
            height: position.height,
            zIndex: 9999,
            borderRadius: 12,
            boxShadow: "0 10px 25px rgba(0,0,0,0.2)",
            backgroundColor: "white",
            display: "flex",
            flexDirection: "column",
            overflow: "hidden",
            animation: "scaleFadeIn 0.3s ease forwards",
          }}
          className="border border-gray-300"
        >
          <div className="bg-slate-800 text-white text-lg px-4 py-2 font-semibold flex justify-between items-center">
            Dysarthria Assistant
            <button
              onClick={() => setOpen(false)}
              className="text-white text-xl font-bold hover:text-gray-300"
              aria-label="Close Chatbot"
              title="Close Chatbot"
            >
              &times;
            </button>
          </div>

          <div className="flex-1 p-3 overflow-y-auto space-y-2 bg-gray-50">
            {messages.map((msg, idx) => (
              <div
                key={idx}
                className={`max-w-[80%] p-2 rounded-lg text-sm break-words ${
                  msg.sender === "user"
                    ? "bg-blue-100 self-end ml-auto"
                    : "bg-gray-200 self-start"
                }`}
              >
                {msg.text}
              </div>
            ))}
          </div>

          <div className="flex border-t border-gray-200">
            <input
              value={input}
              onChange={(e) => setInput(e.target.value)}
              onKeyDown={(e) => e.key === "Enter" && handleSend()}
              className="flex-1 px-3 py-2 text-sm outline-none"
              placeholder="Ask about dysarthria..."
              aria-label="Chatbot input"
            />
            <button
              onClick={handleSend}
              className="bg-blue-600 text-white px-4 text-sm hover:bg-blue-700"
              aria-label="Send message"
            >
              Send
            </button>
          </div>
        </div>
      )}

      <style>{`
        @keyframes scaleFadeIn {
          0% {
            opacity: 0;
            transform: scale(0.8);
          }
          100% {
            opacity: 1;
            transform: scale(1);
          }
        }
      `}</style>
    </>
  );
};

export default Chatbot;
