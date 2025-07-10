<template>
  <div class="chat-container vh-100 d-flex flex-column bg-light">
    <div class="chat-header p-3 border-bottom d-flex align-items-center justify-content-between shadow-sm">
      <div class="d-flex align-items-center">
        <img src="https://i.pravatar.cc/50?img=68" class="chat-avatar me-3" alt="Support Agent Avatar">
        <div>
          <h5 class="mb-0 fw-bold">Support Agent</h5>
          <span class="text-success small"><i class="bi bi-circle-fill me-1 online-dot"></i> Online</span>
        </div>
      </div>
      <div class="d-flex gap-2">
        <button class="btn btn-outline-danger btn-sm rounded-pill px-3" @click="endChat">
          <i class="bi bi-x-circle me-1"></i> End Chat
        </button>
        <button class="btn btn-outline-secondary btn-sm rounded-circle" @click="minimizeChat" title="Minimize Chat">
          <i class="bi bi-dash-lg"></i>
        </button>
      </div>
    </div>

    <div class="chat-messages flex-grow-1 p-3 overflow-auto" ref="messageArea">
      <div v-for="message in messages" :key="message.id"
           class="message-bubble mb-3 d-flex"
           :class="{ 'sent': message.sender === 'user', 'received': message.sender === 'agent' }">

        <div v-if="message.sender === 'agent'" class="chat-avatar-small me-2">
            <img src="https://i.pravatar.cc/40?img=68" alt="Agent Avatar">
        </div>

        <div class="message-content p-3 rounded-3 shadow-sm">
          <div class="message-meta d-flex justify-content-between align-items-center mb-1">
            <small class="fw-bold">{{ message.sender === 'user' ? 'You' : 'Support Agent' }}</small>
            <small class="text-muted ms-2">{{ formatTime(message.timestamp) }}</small>
          </div>
          <p class="mb-0">{{ message.text }}</p>
          <div v-if="message.status === 'read'" class="text-end mt-1">
            <i class="bi bi-check-all text-info small" title="Read"></i>
          </div>
        </div>

        <div v-if="message.sender === 'user'" class="chat-avatar-small ms-2">
            <img src="https://i.pravatar.cc/40?img=49" alt="User Avatar">
        </div>
      </div>

      <div v-if="agentIsTyping" class="message-bubble received mb-3 d-flex typing-indicator">
        <div class="chat-avatar-small me-2">
            <img src="https://i.pravatar.cc/40?img=68" alt="Agent Avatar">
        </div>
        <div class="message-content p-3 rounded-3 shadow-sm">
          <div class="typing-dot"></div>
          <div class="typing-dot"></div>
          <div class="typing-dot"></div>
        </div>
      </div>
    </div>

    <div class="chat-input p-3 border-top bg-white d-flex align-items-center shadow-lg">
      <button class="btn btn-light rounded-circle me-2 p-2 input-action-btn" title="Attach file">
        <i class="bi bi-paperclip fs-5"></i>
      </button>
      <button class="btn btn-light rounded-circle me-2 p-2 input-action-btn" title="Emojis">
        <i class="bi bi-emoji-smile fs-5"></i>
      </button>
      <input
        type="text"
        v-model="newMessage"
        @keyup.enter="sendMessage"
        class="form-control me-2 py-2 px-3 rounded-pill chat-text-input"
        placeholder="Type a message..."
      >
      <button class="btn btn-primary rounded-circle p-2 send-btn" @click="sendMessage" :disabled="!newMessage.trim()">
        <i class="bi bi-send-fill fs-5"></i>
      </button>
    </div>
  </div>
</template>

<script>
// For full Bootstrap functionality, ensure 'bootstrap.bundle.min.js' is imported in your main.js
// For example: import 'bootstrap/dist/js/bootstrap.bundle.min.js';

export default {
  name: 'CustomerChat',
  data() {
    return {
      messages: [], // Stores chat messages
      newMessage: '', // Holds the current message being typed
      messageIdCounter: 0, // Unique ID for each message
      agentIsTyping: false, // Flag for typing indicator
      agentResponseTimeout: null, // Timeout for simulated agent response
    };
  },
  mounted() {
    this.addInitialMessages();
    this.scrollToBottom(); // Scroll to bottom on initial load
  },
  watch: {
    // Watch for changes in messages array to auto-scroll
    messages: {
      handler() {
        this.$nextTick(() => {
          this.scrollToBottom();
        });
      },
      deep: true, // Watch deeply for changes within message objects (e.g., status)
    },
  },
  beforeUnmount() {
    // Clear any pending timeouts to prevent memory leaks
    if (this.agentResponseTimeout) {
      clearTimeout(this.agentResponseTimeout);
    }
  },
  methods: {
    addInitialMessages() {
      // Simulate initial chat history
      this.addMessage('agent', "Hi there! How can I help you today?", Date.now() - 120000, 'read'); // 2 minutes ago
      this.addMessage('user', "I have a question about my recent delivery.", Date.now() - 90000, 'read'); // 1.5 minutes ago
      this.addMessage('agent', "Certainly, I can assist with that. Could you please provide your tracking number?", Date.now() - 60000, 'read'); // 1 minute ago
    },
    addMessage(sender, text, timestamp = Date.now(), status = 'sent') {
      this.messageIdCounter++;
      this.messages.push({
        id: this.messageIdCounter,
        sender,
        text,
        timestamp,
        status, // 'sent', 'delivered', 'read'
      });
    },
    sendMessage() {
      if (this.newMessage.trim() === '') return;

      this.addMessage('user', this.newMessage.trim());
      this.newMessage = ''; // Clear input field

      // Simulate agent typing and response
      this.agentIsTyping = true;
      if (this.agentResponseTimeout) {
        clearTimeout(this.agentResponseTimeout);
      }
      this.agentResponseTimeout = setTimeout(() => {
        this.agentIsTyping = false;
        this.simulateAgentResponse();
      }, 1500 + Math.random() * 1000); // Simulate 1.5 to 2.5 seconds typing
    },
    simulateAgentResponse() {
      const responses = [
        "Thank you for that. Please give me a moment to look into it.",
        "I'm checking the status of your delivery now. One moment, please.",
        "Okay, I see the details. It looks like your package is currently in transit.",
        "We appreciate your patience. Is there anything else I can help you with?",
        "I've escalated your issue to a specialist. They will contact you shortly.",
        "Your request has been successfully noted. We will get back to you within 24 hours.",
      ];
      const randomIndex = Math.floor(Math.random() * responses.length);
      const agentText = responses[randomIndex];

      this.addMessage('agent', agentText, Date.now(), 'read'); // Agent messages are instantly 'read' by user in this simulation
    },
    scrollToBottom() {
      const container = this.$refs.messageArea;
      if (container) {
        container.scrollTop = container.scrollHeight;
      }
    },
    formatTime(timestamp) {
      const date = new Date(timestamp);
      return date.toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' });
    },
    endChat() {
      if (confirm("Are you sure you want to end this chat?")) {
        alert("Chat ended. Thank you for contacting support!");
        // In a real app, you would send an API call to end the chat
        // and then navigate away or close the chat interface.
        // Example: this.$router.push('/dashboard');
        this.messages = []; // Clear messages for demo
        this.newMessage = '';
        this.agentIsTyping = false;
        if (this.agentResponseTimeout) {
          clearTimeout(this.agentResponseTimeout);
        }
      }
    },
    minimizeChat() {
      alert("Chat minimized! (In a real app, this would hide the chat window.)");
      // You would emit an event to a parent component to hide this chat interface
      // this.$emit('minimize-chat');
    },
  },
};
</script>

<style scoped>
/* Base Colors and Variables for Theming */
:root {
  --chat-bg-light: #f8f9fa;
  --chat-bg-dark: #2c2c2c;
  --header-bg-light: #ffffff;
  --header-bg-dark: #3a3a3a;
  --input-bg-light: #ffffff;
  --input-bg-dark: #3a3a3a;
  --sent-bubble-bg-light: #0d6efd; /* Bootstrap primary */
  --sent-bubble-bg-dark: #4a8dff;
  --sent-bubble-text-light: #ffffff;
  --sent-bubble-text-dark: #ffffff;
  --received-bubble-bg-light: #e2e6ea; /* Bootstrap secondary-light */
  --received-bubble-bg-dark: #4a4a4a;
  --received-bubble-text-light: #212529; /* Bootstrap dark */
  --received-bubble-text-dark: #e0e0e0;
  --border-color-light: #dee2e6;
  --border-color-dark: #444444;
  --text-color-light: #212529;
  --text-color-dark: #e0e0e0;
  --muted-text-color-light: #6c757d;
  --muted-text-color-dark: #b0b0b0;
  --shadow-color-light: rgba(0, 0, 0, 0.1);
  --shadow-color-dark: rgba(0, 0, 0, 0.3);
}

/* Light Mode Defaults */
.chat-container {
  background-color: var(--chat-bg-light);
  color: var(--text-color-light);
}

.chat-header {
  background-color: var(--header-bg-light);
  border-color: var(--border-color-light) !important;
  color: var(--text-color-light);
}

.chat-input {
  background-color: var(--input-bg-light);
  border-color: var(--border-color-light) !important;
}

.chat-text-input {
  background-color: var(--chat-bg-light);
  border-color: var(--border-color-light);
  color: var(--text-color-light);
}

.message-bubble.sent .message-content {
  background-color: var(--sent-bubble-bg-light);
  color: var(--sent-bubble-text-light);
  box-shadow: 0 4px 8px var(--shadow-color-light);
}

.message-bubble.received .message-content {
  background-color: var(--received-bubble-bg-light);
  color: var(--received-bubble-text-light);
  box-shadow: 0 4px 8px var(--shadow-color-light);
}

.message-meta small.text-muted {
  color: var(--muted-text-color-light) !important;
}

/* Dark Mode Overrides (Assumes a 'theme-dark' class on body or a parent element) */
body.theme-dark .chat-container {
  background-color: var(--chat-bg-dark);
  color: var(--text-color-dark);
}

body.theme-dark .chat-header {
  background-color: var(--header-bg-dark);
  border-color: var(--border-color-dark) !important;
  color: var(--text-color-dark);
}

body.theme-dark .chat-input {
  background-color: var(--input-bg-dark);
  border-color: var(--border-color-dark) !important;
}

body.theme-dark .chat-text-input {
  background-color: var(--chat-bg-dark);
  border-color: var(--border-color-dark);
  color: var(--text-color-dark);
}

body.theme-dark .chat-text-input::placeholder { /* For dark mode placeholder text */
  color: var(--muted-text-color-dark);
  opacity: 0.7;
}

body.theme-dark .btn-light {
  background-color: #4a4a4a !important;
  color: var(--text-color-dark);
  border-color: var(--border-color-dark) !important;
}

body.theme-dark .btn-light:hover {
  background-color: #5a5a5a !important;
}

body.theme-dark .btn-outline-secondary {
  color: var(--muted-text-color-dark);
  border-color: var(--muted-text-color-dark);
}
body.theme-dark .btn-outline-secondary:hover {
  background-color: var(--muted-text-color-dark);
  color: var(--chat-bg-dark);
}

body.theme-dark .message-bubble.sent .message-content {
  background-color: var(--sent-bubble-bg-dark);
  color: var(--sent-bubble-text-dark);
  box-shadow: 0 4px 8px var(--shadow-color-dark);
}

body.theme-dark .message-bubble.received .message-content {
  background-color: var(--received-bubble-bg-dark);
  color: var(--received-bubble-text-dark);
  box-shadow: 0 4px 8px var(--shadow-color-dark);
}

body.theme-dark .message-meta small.text-muted {
  color: var(--muted-text-color-dark) !important;
}
/* End Dark Mode Overrides */


/* General Chat Styles */
.chat-container {
  max-width: 800px; /* Max width for larger screens */
  margin: auto; /* Center the chat window */
  border-radius: 12px;
  overflow: hidden; /* Ensures rounded corners */
  box-shadow: 0 8px 30px var(--shadow-color-light); /* Prominent shadow for the chat window */
  min-height: 70vh; /* Minimum height to make it visible */
}

.chat-header {
  border-bottom: 1px solid var(--border-color-light);
  z-index: 10; /* Ensure header is above messages */
}

.chat-avatar {
  width: 50px;
  height: 50px;
  border-radius: 50%;
  object-fit: cover;
  border: 2px solid var(--bs-primary);
}

.chat-avatar-small {
  width: 32px;
  height: 32px;
  border-radius: 50%;
  object-fit: cover;
  flex-shrink: 0;
  margin-top: 10px; /* Align with top of message bubble */
}

.chat-avatar-small img {
  width: 100%;
  height: 100%;
  border-radius: 50%;
}

.online-dot {
  font-size: 0.7em;
  vertical-align: middle;
}

.chat-messages {
  scroll-behavior: smooth;
}

/* Message Bubble Styles */
.message-bubble {
  max-width: 75%;
}

.message-bubble.sent {
  justify-content: flex-end; /* Align to right */
  margin-left: auto; /* Push to right */
}

.message-bubble.received {
  justify-content: flex-start; /* Align to left */
  margin-right: auto; /* Push to left */
}

.message-content {
  position: relative;
  border-radius: 0.75rem; /* Rounded corners for bubbles */
  padding: 0.8rem 1rem;
  word-wrap: break-word; /* Ensure long words break */
  white-space: pre-wrap; /* Preserve whitespace and breaks */
  font-size: 0.95rem;
}

/* Message bubble tail (optional, more complex CSS for actual bubble shape) */
/* .message-bubble.sent .message-content::after {
  content: '';
  position: absolute;
  right: -8px;
  top: 10px;
  width: 0;
  height: 0;
  border: 10px solid transparent;
  border-left-color: var(--sent-bubble-bg-light);
  border-right: 0;
  border-top: 0;
}

.message-bubble.received .message-content::after {
  content: '';
  position: absolute;
  left: -8px;
  top: 10px;
  width: 0;
  height: 0;
  border: 10px solid transparent;
  border-right-color: var(--received-bubble-bg-light);
  border-left: 0;
  border-top: 0;
}

body.theme-dark .message-bubble.sent .message-content::after {
  border-left-color: var(--sent-bubble-bg-dark);
}
body.theme-dark .message-bubble.received .message-content::after {
  border-right-color: var(--received-bubble-bg-dark);
} */


.message-meta {
  font-size: 0.75rem;
  color: var(--muted-text-color-light);
}
body.theme-dark .message-meta {
  color: var(--muted-text-color-dark) !important;
}


/* Input Area Styles */
.chat-input {
  border-top: 1px solid var(--border-color-light);
  z-index: 10; /* Ensure input is above messages */
}

.chat-text-input {
  height: 50px; /* A bit taller for easier typing */
  resize: none; /* Prevent manual resizing */
}

.input-action-btn {
  width: 44px;
  height: 44px;
  flex-shrink: 0; /* Prevent shrinking */
  color: var(--text-color-light);
}
body.theme-dark .input-action-btn {
  color: var(--text-color-dark);
}


.send-btn {
  width: 44px;
  height: 44px;
  flex-shrink: 0; /* Prevent shrinking */
}

/* Typing Indicator Animation */
.typing-indicator .message-content {
  display: flex;
  align-items: center;
  gap: 4px;
}

.typing-dot {
  width: 8px;
  height: 8px;
  background-color: var(--muted-text-color-light);
  border-radius: 50%;
  animation: bounce 1.4s infinite ease-in-out both;
}
body.theme-dark .typing-dot {
  background-color: var(--muted-text-color-dark);
}

.typing-dot:nth-child(1) { animation-delay: -0.32s; }
.typing-dot:nth-child(2) { animation-delay: -0.16s; }
.typing-dot:nth-child(3) { animation-delay: 0s; }

@keyframes bounce {
  0%, 80%, 100% { transform: translateY(0); }
  40% { transform: translateY(-7px); }
}

/* Responsive Adjustments */
@media (max-width: 768px) {
  .chat-container {
    height: 100vh; /* Full screen height on mobile */
    min-height: 100vh;
    border-radius: 0; /* No rounded corners on full screen */
    box-shadow: none; /* No shadow on full screen */
  }

  .chat-header .btn-sm {
    padding: 0.3rem 0.6rem; /* Smaller buttons */
    font-size: 0.8rem;
  }

  .chat-avatar {
    width: 40px;
    height: 40px;
  }

  .chat-avatar-small {
    width: 28px;
    height: 28px;
  }

  .message-bubble {
    max-width: 85%; /* Wider bubbles on small screens */
  }

  .chat-input .input-action-btn,
  .chat-input .send-btn {
    width: 40px;
    height: 40px;
    font-size: 1.1rem;
    padding: 0; /* Remove padding */
  }
}
</style>