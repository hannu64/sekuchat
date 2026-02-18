import { BrowserRouter as Router, Routes, Route, useParams } from 'react-router-dom'
import { useState, useEffect, useRef } from 'react'

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
            {/* Add /login and /dashboard later */}
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

function Chat() {
  const { hash } = useParams()
  const [nickname, setNickname] = useState('')
  const [isJoined, setIsJoined] = useState(false) // New state
  const [messages, setMessages] = useState([])
  const [input, setInput] = useState('')
  const [ws, setWs] = useState(null)
  const messagesEndRef = useRef(null)

  useEffect(() => {
    messagesEndRef.current?.scrollIntoView({ behavior: "smooth" })
  }, [messages])

  useEffect(() => {
    if (!isJoined) return // Don't connect WS until joined

    const backendUrl = import.meta.env.VITE_BACKEND_URL || 'https://sekuchatback-production.up.railway.app'
    const socketUrl = `wss://${backendUrl.replace('https://', '')}/ws/${hash}`

    console.log("Connecting WS to:", socketUrl)

    const socket = new WebSocket(socketUrl)

    socket.onopen = () => {
      console.log('WebSocket connected!')
      setWs(socket)
    }

    socket.onmessage = (event) => {
      const data = JSON.parse(event.data)
      console.log('Received:', data)
      setMessages(prev => [...prev, data])
    }

    socket.onclose = () => console.log('WS closed')
    socket.onerror = (err) => console.error('WS error:', err)

    return () => socket.close()
  }, [hash, isJoined])

  const joinChat = () => {
    if (nickname.trim()) {
      setIsJoined(true)
    }
  }

  const sendMessage = () => {
    if (input.trim() && ws && ws.readyState === WebSocket.OPEN) {
      const msg = { nick: nickname, content: input }
      ws.send(JSON.stringify(msg))
      setMessages(prev => [...prev, { ...msg, timestamp: new Date().toISOString() }])
      setInput('')
    }
  }

  if (!isJoined) {
    return (
      <div className="max-w-md mx-auto mt-10 p-6 bg-white rounded-lg shadow">
        <h2 className="text-2xl font-bold mb-6 text-center">Join Chat</h2>
        <p className="text-center mb-4">Choose a nickname</p>
        <input
          type="text"
          placeholder="Your nickname (e.g. CoolUser123)"
          value={nickname}
          onChange={(e) => setNickname(e.target.value)}
          className="w-full p-3 border rounded-lg mb-4 focus:outline-none focus:ring-2 focus:ring-blue-500"
        />
        <button
          onClick={joinChat}
          disabled={!nickname.trim()}
          className="w-full bg-green-600 text-white p-3 rounded-lg hover:bg-green-700 disabled:bg-gray-400"
        >
          Join Chat
        </button>
      </div>
    )
  }

  return (
    <div className="max-w-2xl mx-auto flex flex-col h-[70vh] bg-white rounded-lg shadow">
      <div className="flex-1 overflow-y-auto p-4 space-y-3">
        {messages.map((msg, i) => (
          <div key={i} className={`p-3 rounded-lg ${msg.nick === nickname ? 'bg-blue-100 ml-auto' : 'bg-gray-100'}`}>
            <span className="font-bold">{msg.nick}: </span>
            {msg.content}
            <span className="text-xs text-gray-500 block mt-1">
              {msg.timestamp ? new Date(msg.timestamp).toLocaleTimeString() : ''}
            </span>
          </div>
        ))}
        <div ref={messagesEndRef} />
      </div>
      <div className="p-4 border-t flex">
        <input
          type="text"
          value={input}
          onChange={(e) => setInput(e.target.value)}
          onKeyPress={(e) => e.key === 'Enter' && sendMessage()}
          className="flex-1 p-3 border rounded-l-lg focus:outline-none focus:ring-2 focus:ring-blue-500"
          placeholder="Type a message..."
        />
        <button
          onClick={sendMessage}
          className="bg-blue-600 text-white px-6 rounded-r-lg hover:bg-blue-700"
        >
          Send
        </button>
      </div>
    </div>
  )
}

export default App
