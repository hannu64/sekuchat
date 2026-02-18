import { BrowserRouter as Router, Routes, Route, useParams } from 'react-router-dom'
import { useState, useEffect } from 'react'

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
            <Route path="/login" element={<Login />} />
            <Route path="/dashboard" element={<Dashboard />} />
            <Route path="/chat/:hash" element={<Chat />} />
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
      <a href="/login" className="bg-blue-600 text-white px-6 py-3 rounded-lg hover:bg-blue-700">
        Log In
      </a>
    </div>
  )
}

function Login() {
  const [email, setEmail] = useState('')
  const [password, setPassword] = useState('')

  const handleLogin = async (e) => {
    e.preventDefault()
    // TODO: call backend /login endpoint
    alert('Login coming soon - backend integration next')
  }

  return (
    <div className="max-w-md mx-auto mt-10">
      <h2 className="text-2xl font-bold mb-6 text-center">Log In</h2>
      <form onSubmit={handleLogin} className="space-y-4">
        <input
          type="email"
          placeholder="Email"
          value={email}
          onChange={(e) => setEmail(e.target.value)}
          className="w-full p-3 border rounded-lg"
          required
        />
        <input
          type="password"
          placeholder="Password"
          value={password}
          onChange={(e) => setPassword(e.target.value)}
          className="w-full p-3 border rounded-lg"
          required
        />
        <button type="submit" className="w-full bg-blue-600 text-white p-3 rounded-lg hover:bg-blue-700">
          Log In
        </button>
      </form>
    </div>
  )
}

function Dashboard() {
  return (
    <div className="max-w-2xl mx-auto">
      <h2 className="text-2xl font-bold mb-6">Your Chats</h2>
      <p>Dashboard coming soon - list of chats from backend</p>
    </div>
  )
}

function Chat() {
  const { hash } = useParams()
  const [nickname, setNickname] = useState('')
  const [messages, setMessages] = useState([])
  const [input, setInput] = useState('')
  const [ws, setWs] = useState(null)

  useEffect(() => {
    const backendUrl = import.meta.env.VITE_BACKEND_URL || 'https://sekuchatback-production.up.railway.app'
    const socket = new WebSocket(`wss://${backendUrl.replace('https://', '')}/ws/${hash}`)

    socket.onopen = () => {
      console.log('WebSocket connected')
    }

    socket.onmessage = (event) => {
      const data = JSON.parse(event.data)
      setMessages(prev => [...prev, data])
    }

    socket.onclose = () => console.log('WebSocket closed')

    setWs(socket)

    return () => socket.close()
  }, [hash])

  const sendMessage = () => {
    if (input.trim() && ws) {
      ws.send(JSON.stringify({ type: 'message', nick: nickname || 'Guest', content: input }))
      setInput('')
    }
  }

  if (!nickname) {
    return (
      <div className="max-w-md mx-auto mt-10">
        <h2 className="text-2xl font-bold mb-6">Welcome to Chat</h2>
        <input
          type="text"
          placeholder="Choose a nickname"
          value={nickname}
          onChange={(e) => setNickname(e.target.value)}
          className="w-full p-3 border rounded-lg mb-4"
        />
        <button onClick={() => nickname.trim() && alert('Chat starting!')} className="w-full bg-green-600 text-white p-3 rounded-lg">
          Join Chat
        </button>
      </div>
    )
  }

  return (
    <div className="max-w-2xl mx-auto flex flex-col h-[80vh]">
      <div className="flex-1 overflow-y-auto border p-4 mb-4 bg-white rounded-lg">
        {messages.map((msg, i) => (
          <div key={i} className="mb-2">
            <span className="font-bold">{msg.nick}: </span>
            {msg.content}
          </div>
        ))}
      </div>
      <div className="flex">
        <input
          type="text"
          value={input}
          onChange={(e) => setInput(e.target.value)}
          onKeyPress={(e) => e.key === 'Enter' && sendMessage()}
          className="flex-1 p-3 border rounded-l-lg"
          placeholder="Type a message..."
        />
        <button onClick={sendMessage} className="bg-blue-600 text-white px-6 rounded-r-lg">
          Send
        </button>
      </div>
    </div>
  )
}

export default App
