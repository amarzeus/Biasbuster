const WebSocket = require('ws')
const http = require('http')
const express = require('express')
const cors = require('cors')

const app = express()
app.use(cors())

const server = http.createServer(app)
const wss = new WebSocket.Server({ server })

// Store active connections and rooms
const connections = new Map()
const rooms = new Map()

wss.on('connection', (ws) => {
  const userId = Date.now().toString()
  connections.set(userId, ws)

  // Send initial connection success
  ws.send(JSON.stringify({
    type: 'connected',
    userId
  }))

  ws.on('message', (message) => {
    try {
      const data = JSON.parse(message)
      handleMessage(userId, data)
    } catch (error) {
      console.error('Error handling message:', error)
    }
  })

  ws.on('close', () => {
    handleDisconnect(userId)
  })
})

function handleMessage(userId, data) {
  switch (data.type) {
    case 'join_room':
      joinRoom(userId, data.roomId)
      break
    case 'leave_room':
      leaveRoom(userId, data.roomId)
      break
    case 'feedback':
      broadcastFeedback(data.roomId, data)
      break
    case 'reaction':
      broadcastReaction(data.roomId, data)
      break
    case 'reply':
      broadcastReply(data.roomId, data)
      break
    case 'edit':
      broadcastEdit(data.roomId, data)
      break
  }
}

function handleDisconnect(userId) {
  // Remove from all rooms
  rooms.forEach((users, roomId) => {
    if (users.has(userId)) {
      users.delete(userId)
      broadcastUserLeft(roomId, userId)
    }
  })

  // Remove connection
  connections.delete(userId)
}

function joinRoom(userId, roomId) {
  if (!rooms.has(roomId)) {
    rooms.set(roomId, new Set())
  }
  
  const room = rooms.get(roomId)
  room.add(userId)
  
  // Notify others in the room
  broadcastUserJoined(roomId, userId)
}

function leaveRoom(userId, roomId) {
  const room = rooms.get(roomId)
  if (room) {
    room.delete(userId)
    broadcastUserLeft(roomId, userId)
  }
}

function broadcastToRoom(roomId, message) {
  const room = rooms.get(roomId)
  if (room) {
    const messageStr = JSON.stringify(message)
    room.forEach(userId => {
      const ws = connections.get(userId)
      if (ws && ws.readyState === WebSocket.OPEN) {
        ws.send(messageStr)
      }
    })
  }
}

function broadcastUserJoined(roomId, userId) {
  broadcastToRoom(roomId, {
    type: 'user_joined',
    userId,
    timestamp: new Date().toISOString()
  })
}

function broadcastUserLeft(roomId, userId) {
  broadcastToRoom(roomId, {
    type: 'user_left',
    userId,
    timestamp: new Date().toISOString()
  })
}

function broadcastFeedback(roomId, data) {
  broadcastToRoom(roomId, {
    type: 'new_feedback',
    feedback: {
      ...data,
      timestamp: new Date().toISOString()
    }
  })
}

function broadcastReaction(roomId, data) {
  broadcastToRoom(roomId, {
    type: 'reaction_updated',
    ...data,
    timestamp: new Date().toISOString()
  })
}

function broadcastReply(roomId, data) {
  broadcastToRoom(roomId, {
    type: 'new_reply',
    ...data,
    timestamp: new Date().toISOString()
  })
}

function broadcastEdit(roomId, data) {
  broadcastToRoom(roomId, {
    type: 'edit_applied',
    ...data,
    timestamp: new Date().toISOString()
  })
}

// Start server
const PORT = process.env.PORT || 3000
server.listen(PORT, () => {
  console.log(`WebSocket server running on port ${PORT}`)
}) 