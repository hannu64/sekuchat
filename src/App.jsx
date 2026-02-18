// src/App.jsx
import { BrowserRouter as Router, Routes, Route } from 'react-router-dom'
import Chat from './Chat.jsx'  // ← This is the correct import (Chat.jsx in src/)

function App() {
  return (
    <Router>
      <div className="min-h-screen bg-gray-50 flex flex-col">
        <header className="bg-blue-600 text-white p-4 text-center font-bold text-xl">
          SekuChat - Secure Private Chat
        </header>
        <main className="flex-1 p-4">
          <Routes>
            <Route path="/" element={<Home />} />
            <Route path="/chat/:hash" element={<Chat />} />
            {/* Add these later when we implement login/dashboard */}
            {/* <Route path="/login" element={<Login />} /> */}
            {/* <Route path="/dashboard" element={<Dashboard />} /> */}
          </Routes>
        </main>
      </div>
    </Router>
  )
}

function Home() {
  return (
    <div className="max-w-md mx-auto text-center mt-10">
      <h1 className="text-3xl font-bold mb-6">Welcome to SekuChat</h1>
      <p className="mb-4">Enter your invite link or log in.</p>
      <p className="text-gray-600">Example: seku.chat/chat/your-hash-here</p>
    </div>
  )
}

export default App
