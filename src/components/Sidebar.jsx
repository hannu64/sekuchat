// src/components/Sidebar.jsx
// import { PlusCircle, Trash2, MessageSquare } from 'lucide-react';  // commented out 14:16

import { NavLink } from 'react-router-dom';

export default function Sidebar({
  chats,
  activeChatId,
  onNewChat,
  onSelectChat,
  onDeleteChat,
  onUpdateTitle,
}) {
  return (
    <div className="w-72 bg-gray-800 text-white flex flex-col h-screen">
      <div className="p-4 border-b border-gray-700 flex justify-between items-center">
        <h2 className="font-bold text-lg">Your Chats</h2>
        <button
          onClick={onNewChat}
          className="text-blue-400 hover:text-blue-300 px-2 py-1 rounded"
          title="New Chat"
        >
          + New Chat  {/* text instead of icon */}
        </button>
      </div>

      <div className="flex-1 overflow-y-auto">
        {chats.length === 0 ? (
          <p className="text-center text-gray-400 mt-10">No chats yet.<br />Create one!</p>
        ) : (
          chats.map(chat => (
            <div
              key={chat.id}
              className={`group flex items-center justify-between p-3 cursor-pointer hover:bg-gray-700 ${
                activeChatId === chat.id ? 'bg-gray-700' : ''
              }`}
              onClick={() => onSelectChat(chat.id)}
            >
              <div className="flex items-center gap-3 flex-1">
                <span>Chat</span>  {/* text instead of icon */}
                <input
                  type="text"
                  value={chat.title}
                  onChange={e => onUpdateTitle(chat.id, e.target.value)}
                  onClick={e => e.stopPropagation()}
                  className="bg-transparent border-none focus:outline-none focus:bg-gray-600 px-1 flex-1 text-sm"
                />
              </div>
              <button
                onClick={e => {
                  e.stopPropagation();
                  onDeleteChat(chat.id);
                }}
                className="opacity-0 group-hover:opacity-100 text-red-400 hover:text-red-300 px-2 py-1 rounded"
              >
                Delete  {/* text instead of icon */}
              </button>
            </div>
          ))
        )}
      </div>

      <div className="p-4 border-t border-gray-700 text-xs text-gray-400">
        Private chats • End-to-end encryption coming soon
      </div>
    </div>
  );
}