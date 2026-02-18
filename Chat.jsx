const backendUrl = import.meta.env.VITE_BACKEND_URL || 'https://sekuchatback-production.up.railway.app'
const socket = new WebSocket(`wss://${backendUrl.replace('https://', '')}/ws/${hash}`)
