const backendUrl = import.meta.env.VITE_BACKEND_URL || 'https://sekuchatback-production.up.railway.app'
const socket = new WebSocket(`wss://${backendUrl.replace('https://', '')}/ws/${hash}`)

ws.send(JSON.stringify({ nick: nickname, content: input }))

socket.onmessage = (event) => {
  const data = JSON.parse(event.data)
  console.log('Received:', data)

  // Avoid duplicate in sender's view (check nick)
  setMessages(prev => {
    // Only add if not already the last message (simple dedupe)
    if (prev.length > 0 && prev[prev.length - 1].content === data.content && prev[prev.length - 1].nick === data.nick) {
      return prev
    }
    return [...prev, data]
  })
}
