import { ref } from 'vue'

class WebSocketService {
  constructor() {
    this.ws = null
    this.connected = ref(false)
    this.roomId = null
    this.userId = null
    this.messageHandlers = new Map()
  }

  connect(userId) {
    this.userId = userId
    this.ws = new WebSocket('ws://localhost:3000')

    this.ws.onopen = () => {
      console.log('WebSocket connected')
      this.connected.value = true
    }

    this.ws.onclose = () => {
      console.log('WebSocket disconnected')
      this.connected.value = false
      // Attempt to reconnect after 5 seconds
      setTimeout(() => this.connect(userId), 5000)
    }

    this.ws.onerror = (error) => {
      console.error('WebSocket error:', error)
    }

    this.ws.onmessage = (event) => {
      const message = JSON.parse(event.data)
      const handler = this.messageHandlers.get(message.type)
      if (handler) {
        handler(message.data)
      }
    }
  }

  disconnect() {
    if (this.ws) {
      this.ws.close()
      this.ws = null
      this.connected.value = false
      this.roomId = null
    }
  }

  joinRoom(roomId) {
    if (this.ws && this.connected.value) {
      this.roomId = roomId
      this.send({
        type: 'join',
        data: {
          roomId,
          userId: this.userId
        }
      })
    }
  }

  leaveRoom() {
    if (this.ws && this.connected.value && this.roomId) {
      this.send({
        type: 'leave',
        data: {
          roomId: this.roomId,
          userId: this.userId
        }
      })
      this.roomId = null
    }
  }

  sendFeedback(feedback) {
    if (this.ws && this.connected.value && this.roomId) {
      this.send({
        type: 'feedback',
        data: {
          roomId: this.roomId,
          userId: this.userId,
          feedback
        }
      })
    }
  }

  sendReaction(feedbackId, reaction) {
    if (this.ws && this.connected.value && this.roomId) {
      this.send({
        type: 'reaction',
        data: {
          roomId: this.roomId,
          userId: this.userId,
          feedbackId,
          reaction
        }
      })
    }
  }

  sendReply(feedbackId, reply) {
    if (this.ws && this.connected.value && this.roomId) {
      this.send({
        type: 'reply',
        data: {
          roomId: this.roomId,
          userId: this.userId,
          feedbackId,
          reply
        }
      })
    }
  }

  sendEdit(feedbackId, edit) {
    if (this.ws && this.connected.value && this.roomId) {
      this.send({
        type: 'edit',
        data: {
          roomId: this.roomId,
          userId: this.userId,
          feedbackId,
          edit
        }
      })
    }
  }

  onMessage(type, handler) {
    this.messageHandlers.set(type, handler)
  }

  offMessage(type) {
    this.messageHandlers.delete(type)
  }

  private send(message) {
    if (this.ws && this.connected.value) {
      this.ws.send(JSON.stringify(message))
    }
  }
}

export const websocketService = new WebSocketService() 