<template>
  <div class="bg-white dark:bg-gray-800 rounded-lg shadow-sm p-6">
    <h2 class="text-2xl font-bold text-gray-900 dark:text-white mb-6">
      Feedback Hub
    </h2>

    <!-- Real-time Collaboration -->
    <div class="mb-8">
      <h3 class="text-lg font-semibold text-gray-900 dark:text-white mb-4">
        Active Collaborators
      </h3>
      <div class="flex items-center space-x-4 mb-4">
        <div class="flex -space-x-2">
          <div 
            v-for="user in activeUsers" 
            :key="user.id"
            class="relative"
          >
            <img 
              :src="user.avatar" 
              :alt="user.name"
              class="w-8 h-8 rounded-full border-2 border-white dark:border-gray-800"
            >
            <span 
              class="absolute bottom-0 right-0 w-2 h-2 bg-green-500 rounded-full"
              :title="`${user.name} is online`"
            ></span>
          </div>
        </div>
        <button 
          @click="inviteCollaborator"
          class="btn-secondary text-sm"
        >
          Invite
        </button>
      </div>
    </div>

    <!-- Feedback Thread -->
    <div class="space-y-6">
      <div 
        v-for="feedback in feedbackThread" 
        :key="feedback.id"
        class="p-4 bg-gray-50 dark:bg-gray-700 rounded-lg"
      >
        <div class="flex items-start space-x-4">
          <img 
            :src="feedback.user.avatar" 
            :alt="feedback.user.name"
            class="w-10 h-10 rounded-full"
          >
          <div class="flex-1">
            <div class="flex items-center justify-between mb-2">
              <div>
                <span class="font-medium text-gray-900 dark:text-white">
                  {{ feedback.user.name }}
                </span>
                <span class="text-sm text-gray-500 dark:text-gray-400 ml-2">
                  {{ feedback.timestamp }}
                </span>
              </div>
              <div class="flex items-center space-x-2">
                <button 
                  @click="toggleReaction(feedback.id, 'helpful')"
                  class="text-sm text-gray-500 dark:text-gray-400 hover:text-trust-blue dark:hover:text-trust-teal"
                  :class="{ 'text-trust-blue dark:text-trust-teal': feedback.reactions.helpful }"
                >
                  👍 {{ feedback.reactions.helpful }}
                </button>
                <button 
                  @click="toggleReaction(feedback.id, 'insightful')"
                  class="text-sm text-gray-500 dark:text-gray-400 hover:text-trust-blue dark:hover:text-trust-teal"
                  :class="{ 'text-trust-blue dark:text-trust-teal': feedback.reactions.insightful }"
                >
                  💡 {{ feedback.reactions.insightful }}
                </button>
              </div>
            </div>
            <p class="text-gray-700 dark:text-gray-300 mb-2">
              {{ feedback.content }}
            </p>
            <div 
              v-if="feedback.suggestedEdit"
              class="mt-2 p-3 bg-white dark:bg-gray-800 rounded border border-gray-200 dark:border-gray-600"
            >
              <p class="text-sm text-gray-600 dark:text-gray-400 mb-2">
                Suggested Edit:
              </p>
              <p class="text-sm text-gray-700 dark:text-gray-300">
                {{ feedback.suggestedEdit }}
              </p>
              <div class="mt-2 flex space-x-2">
                <button 
                  @click="applyEdit(feedback.id)"
                  class="btn-primary text-sm"
                >
                  Apply Edit
                </button>
                <button 
                  @click="discardEdit(feedback.id)"
                  class="btn-secondary text-sm"
                >
                  Discard
                </button>
              </div>
            </div>
            <div class="mt-2">
              <button 
                @click="toggleReplyForm(feedback.id)"
                class="text-sm text-gray-500 dark:text-gray-400 hover:text-trust-blue dark:hover:text-trust-teal"
              >
                Reply
              </button>
              <div 
                v-if="activeReplyForm === feedback.id"
                class="mt-2"
              >
                <textarea 
                  v-model="replyContent"
                  rows="2"
                  class="w-full rounded-md border-gray-300 dark:border-gray-600 dark:bg-gray-700"
                  placeholder="Write your reply..."
                ></textarea>
                <div class="mt-2 flex justify-end space-x-2">
                  <button 
                    @click="cancelReply"
                    class="btn-secondary text-sm"
                  >
                    Cancel
                  </button>
                  <button 
                    @click="submitReply(feedback.id)"
                    class="btn-primary text-sm"
                    :disabled="!replyContent.trim()"
                  >
                    Submit Reply
                  </button>
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>

    <!-- New Feedback Form -->
    <div class="mt-8">
      <h3 class="text-lg font-semibold text-gray-900 dark:text-white mb-4">
        Add Feedback
      </h3>
      <div class="space-y-4">
        <textarea 
          v-model="newFeedback"
          rows="4"
          class="w-full rounded-md border-gray-300 dark:border-gray-600 dark:bg-gray-700"
          placeholder="Share your thoughts or suggestions..."
        ></textarea>
        <div class="flex items-center space-x-4">
          <button 
            @click="toggleSuggestedEdit"
            class="text-sm text-gray-500 dark:text-gray-400 hover:text-trust-blue dark:hover:text-trust-teal"
          >
            Add Suggested Edit
          </button>
          <div v-if="showSuggestedEdit" class="flex-1">
            <textarea 
              v-model="suggestedEdit"
              rows="2"
              class="w-full rounded-md border-gray-300 dark:border-gray-600 dark:bg-gray-700"
              placeholder="Enter your suggested edit..."
            ></textarea>
          </div>
        </div>
        <div class="flex justify-end">
          <button 
            @click="submitFeedback"
            class="btn-primary"
            :disabled="!newFeedback.trim()"
          >
            Submit Feedback
          </button>
        </div>
      </div>
    </div>
  </div>
</template>

<script setup>
import { ref, onMounted, onUnmounted } from 'vue'
import { useToast } from '@/composables/useToast'
import { websocketService } from '@/services/websocket'

const toast = useToast()

const props = defineProps({
  documentId: {
    type: String,
    required: true
  }
})

// State
const activeUsers = ref([
  { id: 1, name: 'John Doe', avatar: '/images/avatar.jpg' },
  { id: 2, name: 'Jane Smith', avatar: '/images/avatar.jpg' },
  { id: 3, name: 'Mike Johnson', avatar: '/images/avatar.jpg' }
])

const feedbackThread = ref([
  {
    id: 1,
    user: { id: 1, name: 'John Doe', avatar: '/images/avatar.jpg' },
    content: 'I noticed some potential gender bias in the third paragraph. Consider using more inclusive language.',
    timestamp: '2 hours ago',
    reactions: { helpful: 3, insightful: 2 },
    suggestedEdit: 'Replace "he" with "they" to be more inclusive.',
    replies: []
  },
  {
    id: 2,
    user: { id: 2, name: 'Jane Smith', avatar: '/images/avatar.jpg' },
    content: 'Great suggestion! I also think we should add more diverse examples in the case studies section.',
    timestamp: '1 hour ago',
    reactions: { helpful: 2, insightful: 1 },
    replies: []
  }
])

const newFeedback = ref('')
const suggestedEdit = ref('')
const showSuggestedEdit = ref(false)
const activeReplyForm = ref(null)
const replyContent = ref('')

// Add WebSocket handlers
onMounted(() => {
  // Connect to WebSocket
  websocketService.connect('user-' + Math.random().toString(36).substr(2, 9))
  
  // Join room
  websocketService.joinRoom(props.documentId)
  
  // Set up message handlers
  websocketService.onMessage('user_joined', (data) => {
    activeUsers.value.push(data.user)
  })
  
  websocketService.onMessage('user_left', (data) => {
    activeUsers.value = activeUsers.value.filter(u => u.id !== data.userId)
  })
  
  websocketService.onMessage('feedback', (data) => {
    feedbackThread.value.unshift(data.feedback)
  })
  
  websocketService.onMessage('reaction', (data) => {
    const feedback = feedbackThread.value.find(f => f.id === data.feedbackId)
    if (feedback) {
      if (data.reaction === 'helpful') {
        feedback.reactions.helpful++
      } else if (data.reaction === 'insightful') {
        feedback.reactions.insightful++
      }
    }
  })
  
  websocketService.onMessage('reply', (data) => {
    const feedback = feedbackThread.value.find(f => f.id === data.feedbackId)
    if (feedback) {
      feedback.replies.push(data.reply)
    }
  })
  
  websocketService.onMessage('edit', (data) => {
    const feedback = feedbackThread.value.find(f => f.id === data.feedbackId)
    if (feedback) {
      feedback.suggestedEdit = data.edit
    }
  })
})

onUnmounted(() => {
  websocketService.leaveRoom()
  websocketService.disconnect()
})

function inviteCollaborator() {
  // TODO: Implement invitation logic
  toast.show({
    type: 'info',
    message: 'Invitation feature coming soon!'
  })
}

function toggleReaction(feedbackId, reaction) {
  websocketService.sendReaction(feedbackId, reaction)
}

function toggleSuggestedEdit() {
  showSuggestedEdit.value = !showSuggestedEdit.value
  if (!showSuggestedEdit.value) {
    suggestedEdit.value = ''
  }
}

function toggleReplyForm(feedbackId) {
  activeReplyForm.value = activeReplyForm.value === feedbackId ? null : feedbackId
  replyContent.value = ''
}

function cancelReply() {
  activeReplyForm.value = null
  replyContent.value = ''
}

function submitReply(feedbackId) {
  const feedback = feedbackThread.value.find(f => f.id === feedbackId)
  if (feedback && replyContent.value.trim()) {
    feedback.replies.push({
      id: Date.now(),
      user: { id: 1, name: 'Current User', avatar: '/images/avatar.jpg' },
      content: replyContent.value,
      timestamp: 'Just now'
    })
    replyContent.value = ''
    activeReplyForm.value = null
    
    websocketService.sendReply(feedbackId, {
      id: Date.now(),
      content: replyContent.value,
      userId: websocketService.userId,
      timestamp: 'Just now'
    })
  }
}

function submitFeedback() {
  if (newFeedback.value.trim()) {
    const feedback = {
      id: Date.now(),
      user: { id: 1, name: 'Current User', avatar: '/images/avatar.jpg' },
      content: newFeedback.value,
      timestamp: 'Just now',
      reactions: { helpful: 0, insightful: 0 },
      suggestedEdit: showSuggestedEdit.value ? suggestedEdit.value : null,
      replies: []
    }
    
    feedbackThread.value.unshift(feedback)
    newFeedback.value = ''
    suggestedEdit.value = ''
    showSuggestedEdit.value = false
    
    websocketService.sendFeedback({
      id: Date.now(),
      content: feedback.content,
      userId: websocketService.userId,
      timestamp: feedback.timestamp,
      helpfulCount: 0,
      insightfulCount: 0,
      replies: [],
      suggestedEdits: feedback.suggestedEdit ? [feedback.suggestedEdit] : []
    })
    
    toast.show({
      type: 'success',
      message: 'Feedback submitted successfully!'
    })
  }
}

function applyEdit(feedbackId) {
  // TODO: Implement edit application logic
  toast.show({
    type: 'success',
    message: 'Edit applied successfully!'
  })
}

function discardEdit(feedbackId) {
  const feedback = feedbackThread.value.find(f => f.id === feedbackId)
  if (feedback) {
    feedback.suggestedEdit = null
  }
}
</script>

<style scoped>
.btn-primary {
  @apply px-4 py-2 bg-trust-blue text-white rounded-md hover:bg-trust-blue-dark focus:outline-none focus:ring-2 focus:ring-trust-blue focus:ring-offset-2 dark:bg-trust-teal dark:hover:bg-trust-teal-dark dark:focus:ring-trust-teal disabled:opacity-50 disabled:cursor-not-allowed;
}

.btn-secondary {
  @apply px-4 py-2 bg-gray-100 text-gray-700 rounded-md hover:bg-gray-200 focus:outline-none focus:ring-2 focus:ring-gray-500 focus:ring-offset-2 dark:bg-gray-700 dark:text-gray-300 dark:hover:bg-gray-600;
}
</style> 