const backendUrl = import.meta.env.VITE_BACKEND_URL || 'https://sekuchatback-production.up.railway.app'
const socket = new WebSocket(`wss://${backendUrl.replace('https://', '')}/ws/${hash}`)

ws.send(JSON.stringify({ nick: nickname, content: input }))

socket.onmessage = (event) => {
  const data = JSON.parse(event.data)
  setMessages(prev => [...prev, data])
}
