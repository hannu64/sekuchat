// src/PrivateChat.jsx
import { useState, useEffect, useRef } from 'react';
import { useParams } from 'react-router-dom';
// import toast from 'react-hot-toast';

export default function PrivateChat({ chats, onUpdateTitle }) {
  const { chatId } = useParams();
  const chat = chats.find(c => c.id === chatId);

  const [messages, setMessages] = useState([]);
  const [input, setInput] = useState('');
  const [nickname, setNickname] = useState('You'); // temp – later per-chat or login
  const messagesEndRef = useRef(null);

  // Load messages for this chat from localStorage
  useEffect(() => {
    if (!chatId) return;
    const saved = localStorage.getItem(`private_messages_${chatId}`);
    if (saved) {
      try {
        setMessages(JSON.parse(saved));
      } catch (e) {
        console.error('Failed to load messages', e);
      }
    }
  }, [chatId]);

  // Save messages after change
  useEffect(() => {
    if (messages.length > 0 && chatId) {
      localStorage.setItem(`private_messages_${chatId}`, JSON.stringify(messages));
    }
  }, [messages, chatId]);

  // Auto-scroll
  useEffect(() => {
    messagesEndRef.current?.scrollIntoView({ behavior: 'smooth' });
  }, [messages]);

  const sendMessage = () => {
    if (!input.trim()) return;
    const newMsg = {
      id: Date.now(),
      sender: nickname,
      content: input.trim(),
      timestamp: new Date().toISOString(),
    };
    setMessages(prev => [...prev, newMsg]);
    setInput('');
//     toast.success('Message sent (local)');
    // Later: encrypt + send to backend if synced mode
  };

  if (!chat) {
    return <div className="text-center mt-20 text-gray-600">Chat not found</div>;
  }

  return (
    <div className="flex flex-col h-full max-w-3xl mx-auto bg-white rounded-lg shadow">
      {/* Chat header */}
      <div className="p-4 border-b bg-gray-50">
        <input
          type="text"
          value={chat.title}
          onChange={(e) => onUpdateTitle(chat.id, e.target.value)}
          className="text-xl font-bold bg-transparent border-b border-gray-300 focus:outline-none focus:border-blue-500 w-full"
        />
        <p className="text-sm text-gray-500 mt-1">Private 1:1 • Local only for now</p>
      </div>

      {/* Messages */}
      <div className="flex-1 overflow-y-auto p-4 space-y-4">
        {messages.map(msg => (
          <div
            key={msg.id}
            className={`flex ${msg.sender === nickname ? 'justify-end' : 'justify-start'}`}
          >
            <div
              className={`max-w-[80%] p-3 rounded-lg ${
                msg.sender === nickname
                  ? 'bg-blue-500 text-white'
                  : 'bg-gray-200 text-black'
              }`}
            >
              <p className="font-semibold text-sm">{msg.sender}</p>
              <p>{msg.content}</p>
              <p className="text-xs opacity-70 mt-1">
                {new Date(msg.timestamp).toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' })}
              </p>
            </div>
          </div>
        ))}
        <div ref={messagesEndRef} />
      </div>

      {/* Input */}
      <div className="p-4 border-t flex gap-2">
        <input
          type="text"
          value={input}
          onChange={e => setInput(e.target.value)}
          onKeyDown={e => e.key === 'Enter' && sendMessage()}
          placeholder="Type your message..."
          className="flex-1 p-3 border rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500"
        />
        <button
          onClick={sendMessage}
          disabled={!input.trim()}
          className="bg-blue-600 text-white px-6 rounded-lg hover:bg-blue-700 disabled:opacity-50"
        >
          Send
        </button>
      </div>
    </div>
  );
}
