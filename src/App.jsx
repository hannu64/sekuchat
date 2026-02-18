import { BrowserRouter as Router, Routes, Route } from 'react-router-dom'

function App() {
  return (
    <Router>
      <div className="min-h-screen bg-gray-100">
        <Routes>
          <Route path="/" element={<Home />} />
          <Route path="/chat/:hash" element={<Chat />} />
          <Route path="/login" element={<Login />} />
          <Route path="/dashboard" element={<Dashboard />} />
        </Routes>
      </div>
    </Router>
  )
}

function Home() {
  return (
    <div className="p-8 text-center">
      <h1 className="text-4xl font-bold">SekuChat</h1>
      <p className="mt-4">Secure private chat. Enter your invite link or log in.</p>
    </div>
  )
}

// Placeholder components - we'll fill them next
function Chat() { return <div>Chat page (coming soon)</div> }
function Login() { return <div>Login page (coming soon)</div> }
function Dashboard() { return <div>Dashboard (coming soon)</div> }

export default App
