// src/App.jsx
import { BrowserRouter as Router, Routes, Route, useNavigate } from 'react-router-dom';
import { useState, useEffect } from 'react';
import PrivateChat from './PrivateChat.jsx';
import Chat from './Chat.jsx'; // keep old group chat
import Sidebar from './components/Sidebar.jsx';
import { v4 as uuidv4 } from 'uuid';
import toast, { Toaster } from 'react-hot-toast';
import { PlusCircle } from 'lucide-react';

function App() {
  return (
    <Router>
      <div className="min-h-screen bg-gray-100 flex">
        <Toaster position="top-center" />
        <AppContent />
      </div>
    </Router>
  );
}

function AppContent() {
  const navigate = useNavigate();
  const [chats, setChats] = useState([]); // list of private chats
  const [activeChatId, setActiveChatId] = useState(null);

  // Load private chats from localStorage on mount
  useEffect(() => {
    const saved = localStorage.getItem('seku_private_chats');
    if (saved) {
      try {
        const parsed = JSON.parse(saved);
        setChats(parsed.chats || []);
        setActiveChatId(parsed.activeChatId || null);
      } catch (e) {
        console.error('Failed to load chats', e);
      }
    }
  }, []);

  // Save chats + active id whenever they change
  useEffect(() => {
    if (chats.length > 0 || activeChatId) {
      localStorage.setItem('seku_private_chats', JSON.stringify({ chats, activeChatId }));
    }
  }, [chats, activeChatId]);

  const createNewPrivateChat = () => {
    const newId = uuidv4();
    const newChat = {
      id: newId,
      title: `Chat ${new Date().toLocaleDateString()}`,
      createdAt: new Date().toISOString(),
    };
    setChats(prev => [...prev, newChat]);
    setActiveChatId(newId);
    navigate(`/private/${newId}`);
    toast.success('New private chat created');
  };

  const deleteChat = (id) => {
    if (window.confirm('Delete this chat? Messages will be lost.')) {
      setChats(prev => prev.filter(c => c.id !== id));
      if (activeChatId === id) {
        setActiveChatId(null);
        navigate('/');
      }
      toast.success('Chat deleted');
    }
  };

  const updateChatTitle = (id, newTitle) => {
    setChats(prev =>
      prev.map(c => (c.id === id ? { ...c, title: newTitle } : c))
    );
  };

  return (
    <>
      {/* Sidebar for private chats */}
      <Sidebar
        chats={chats}
        activeChatId={activeChatId}
        onNewChat={createNewPrivateChat}
        onSelectChat={(id) => {
          setActiveChatId(id);
          navigate(`/private/${id}`);
        }}
        onDeleteChat={deleteChat}
        onUpdateTitle={updateChatTitle}
      />

      {/* Main content */}
      <div className="flex-1 flex flex-col">
        <header className="bg-blue-600 text-white p-4 text-center font-bold text-xl flex justify-between items-center">
          <span>SekuChat - Secure Private Chat</span>
          <button
            onClick={() => navigate('/')}
            className="text-sm bg-white/20 px-3 py-1 rounded hover:bg-white/30"
          >
            Home
          </button>
        </header>

        <main className="flex-1 p-4 overflow-hidden">
          <Routes>
            <Route path="/" element={<Home onNewPrivate={createNewPrivateChat} />} />
            <Route
              path="/private/:chatId"
              element={
                <PrivateChat
                  chats={chats}
                  onUpdateTitle={updateChatTitle}
                />
              }
            />
            {/* Keep the old group PoC route */}
            <Route path="/chat/:hash" element={<Chat />} />
            {/* You can add /group/:hash later if renaming */}
          </Routes>
        </main>
      </div>
    </>
  );
}

function Home({ onNewPrivate }) {
  return (
    <div className="max-w-lg mx-auto text-center mt-12">
      <h1 className="text-4xl font-bold mb-8 text-blue-700">Welcome to SekuChat</h1>
      <p className="text-lg mb-8 text-gray-700">
        Private, secure 1:1 chats between you and another person.<br />
        Messages stay on your device for now (local-only).
      </p>

      <div className="space-y-6">
        <button
          onClick={onNewPrivate}
          className="w-full max-w-xs mx-auto bg-green-600 text-white py-4 rounded-lg text-xl hover:bg-green-700 flex items-center justify-center gap-3"
        >
          <PlusCircle size={28} />
          Start New Private Chat
        </button>

        <div className="text-gray-500 mt-10">
          <p className="mb-2">For group chats (PoC):</p>
          <p>Use link like: <code className="bg-gray-200 px-2 py-1 rounded">/chat/your-hash-here</code></p>
          <p className="text-sm mt-4">(Group mode will get E2EE upgrades later if possible)</p>
        </div>
      </div>
    </div>
  );
}

export default App;
