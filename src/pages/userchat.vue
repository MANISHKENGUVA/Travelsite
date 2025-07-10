<template>
  <div class="container py-5">
    <div class="card shadow-sm mb-4 border-0 rounded-4">
      <div class="card-body d-flex justify-content-between align-items-center p-4">
        <div class="d-flex align-items-center">
          <img
            :src="participant.avatar || 'https://api.dicebear.com/8.x/fun-emoji/svg?seed=' + participant.name"
            class="rounded-circle me-3 border border-2 border-primary"
            width="56"
            height="56"
            alt="Avatar"
          />
          <div>
            <h5 class="mb-0 fw-bold text-primary">{{ participant.name }}</h5>
            <small class="text-muted">
              {{ participant.role.charAt(0).toUpperCase() + participant.role.slice(1) }}
              <span v-if="participant.isOnline" class="badge bg-success-subtle text-success ms-2">Online</span>
              <span v-else class="badge bg-secondary-subtle text-secondary ms-2">Last seen: {{ participant.lastSeen }}</span>
            </small>
          </div>
        </div>
        <div>
          <button class="btn btn-outline-primary rounded-circle btn-lg me-2" title="Call">
            <i class="bi bi-telephone fs-5"></i>
          </button>
          <button class="btn btn-outline-primary rounded-circle btn-lg me-2" title="Video Call">
            <i class="bi bi-camera-video fs-5"></i>
          </button>
          <button class="btn btn-outline-secondary rounded-circle btn-lg" title="More Options">
            <i class="bi bi-three-dots-vertical fs-5"></i>
          </button>
        </div>
      </div>
    </div>

    <div class="row g-4">
      <div class="col-lg-8">
        <div class="card h-100 d-flex flex-column shadow-sm border-0 rounded-4">
          <div class="card-body overflow-auto p-4 chat-messages-container">
            <div v-for="msg in messages" :key="msg.id" class="mb-3">
              <div v-if="msg.type === 'system'" class="text-center text-muted small fst-italic my-3">
                {{ msg.content }}
              </div>
              <div v-else class="d-flex" :class="{'justify-content-end': msg.senderId === currentUserId}">
                <div class="d-flex align-items-end" :class="{'flex-row-reverse': msg.senderId === currentUserId}">
                  <div class="flex-shrink-0" :class="msg.senderId === currentUserId ? 'ms-3' : 'me-3'">
                    <img
                      v-if="msg.senderId !== currentUserId"
                      :src="participant.avatar || 'https://api.dicebear.com/8.x/fun-emoji/svg?seed=' + participant.name"
                      class="rounded-circle border border-1"
                      width="36"
                      height="36"
                      alt="Avatar"
                    />
                    </div>
                  <div>
                    <div
                      class="p-3 rounded-3 message-bubble"
                      :class="msg.senderId === currentUserId ? 'bg-primary text-white' : 'bg-light text-dark border'"
                      
                    >
                      {{ msg.content }}
                    </div>
                    <small class="text-muted d-block mt-1" :class="{'text-end': msg.senderId === currentUserId}">
                      {{ formatTime(msg.timestamp) }}
                      <span v-if="msg.senderId === currentUserId && msg.read" class="ms-1 text-info" title="Read">
                        <i class="bi bi-check-all"></i>
                      </span>
                      <span v-else-if="msg.senderId === currentUserId && msg.delivered" class="ms-1 text-secondary" title="Delivered">
                        <i class="bi bi-check"></i>
                      </span>
                    </small>
                  </div>
                </div>
              </div>
            </div>
          </div>

          <div class="card-footer bg-light border-top-0 p-3 rounded-bottom-4">
            <div class="input-group">
              <input
                type="text"
                class="form-control form-control-lg rounded-pill-start border-0 shadow-sm"
                v-model="newMessage"
                @keyup.enter="sendMessage"
                placeholder="Type your message here..."
              />
              <button class="btn btn-primary btn-lg rounded-pill-end shadow-sm px-4" @click="sendMessage" :disabled="!newMessage.trim()">
                <i class="bi bi-send-fill fs-5"></i>
              </button>
            </div>
          </div>
        </div>
      </div>

      <div class="col-lg-4">
        <div class="card mb-4 shadow-sm border-0 rounded-4">
          <div class="card-header bg-primary text-white fw-bold py-3 rounded-top-4">Delivery Details</div>
          <div class="card-body p-4">
            <h5 class="fw-bold text-dark mb-2">{{ delivery.itemDescription }}</h5>
            <p><span class="badge bg-info-subtle text-info fw-bold fs-6 px-3 py-2 rounded-pill">{{ delivery.status }}</span></p>
            <hr class="my-3" />
            <p class="mb-2">
              <strong class="text-primary"><i class="bi bi-geo-alt-fill me-2"></i>Pickup Location:</strong><br />
              <span class="text-muted ms-4">{{ delivery.pickupAddress }}</span>
            </p>
            <p class="mb-4">
              <strong class="text-primary"><i class="bi bi-geo-alt-fill me-2"></i>Delivery Location:</strong><br />
              <span class="text-muted ms-4">{{ delivery.dropoffAddress }}</span>
            </p>
            <div class="text-end">
                <span class="text-success display-6 fw-bold">${{ delivery.amount }}</span>
            </div>
          </div>
        </div>

        <div class="card shadow-sm border-0 rounded-4">
          <div class="card-header bg-primary text-white fw-bold py-3 rounded-top-4">Quick Actions</div>
          <div class="card-body p-4">
            <button class="btn btn-outline-primary w-100 mb-3 btn-lg rounded-pill">
              <i class="bi bi-geo-alt-fill me-2"></i> Share Live Location
            </button>
            <button class="btn btn-outline-primary w-100 mb-3 btn-lg rounded-pill">
              <i class="bi bi-clock-history me-2"></i> Update Estimated Time
            </button>
            <button class="btn btn-danger w-100 btn-lg rounded-pill shadow-sm">
              <i class="bi bi-exclamation-circle-fill me-2"></i> Report an Issue
            </button>
          </div>
        </div>
      </div>
    </div>
  </div>
</template>

<script>
export default {
  data() {
    return {
      currentUserId: 'user-1',
      newMessage: '',
      participant: {
        id: 'user-2',
        name: 'Sarah Johnson',
        avatar: '', // This will now use DiceBear for a playful avatar if empty
        role: 'carrier',
        rating: 4.9,
        isOnline: true,
        lastSeen: '10:30 AM',
      },
      delivery: {
        id: 'del-1',
        itemDescription: 'MacBook Pro laptop',
        status: 'In Transit',
        pickupAddress: '123 Tech Street, Boston, MA',
        dropoffAddress: '456 Innovation Ave, New York, NY',
        amount: 40,
      },
      messages: [
        {
          id: '1',
          senderId: 'system',
          content: 'Sarah has accepted your delivery request!',
          timestamp: '2025-06-23T10:00:00Z',
          type: 'system',
        },
        {
          id: '2',
          senderId: 'user-2',
          content: "Hi Emily! I'll pick up the package at 2:30 PM.",
          timestamp: '2025-06-23T10:02:00Z',
          type: 'text',
          delivered: true,
          read: true,
        },
        {
          id: '3',
          senderId: 'user-1',
          content: 'Perfect, thanks!',
          timestamp: '2025-06-23T10:05:00Z',
          type: 'text',
          delivered: true,
          read: true,
        },
      ],
    };
  },
  methods: {
    sendMessage() {
      if (!this.newMessage.trim()) return;

      const newMsg = {
        id: Date.now().toString(),
        senderId: this.currentUserId,
        content: this.newMessage,
        timestamp: new Date().toISOString(),
        type: 'text',
        delivered: false,
        read: false,
      };
      this.messages.push(newMsg);
      this.newMessage = '';

      // Scroll to bottom after sending message
      this.$nextTick(() => {
        const container = this.$el.querySelector('.chat-messages-container');
        if (container) {
          container.scrollTop = container.scrollHeight;
        }
      });


      // Simulate message delivery
      setTimeout(() => {
        newMsg.delivered = true;
        // In a real app, you'd mark as read when the other user views it
        // For simulation, let's mark it as read after a delay
        setTimeout(() => {
          newMsg.read = true;
          this.$forceUpdate(); // Force Vue to re-render to show read status
        }, 1500);
      }, 1000);
    },
    formatTime(timestamp) {
      const date = new Date(timestamp);
      // Format time based on current locale and time in Hyderabad, India
      return date.toLocaleTimeString('en-IN', {
        hour: '2-digit',
        minute: '2-digit',
        hour12: true, // Use 12-hour format with AM/PM
        timeZone: 'Asia/Kolkata' // Set timezone to IST
      });
    },
  },
  mounted() {
    // Scroll to bottom when component mounts
    this.$nextTick(() => {
      const container = this.$el.querySelector('.chat-messages-container');
      if (container) {
        container.scrollTop = container.scrollHeight;
      }
    });
  }
};
</script>

<style scoped>
/* Main container padding for overall spacing */
.container.py-5 {
  padding-top: 3rem !important;
  padding-bottom: 3rem !important;
}

/* Card General Styling */
.card {
  border-radius: 1rem !important; /* Softer rounded corners */
  box-shadow: 0 0.5rem 1rem rgba(0, 0, 0, 0.08); /* Subtle shadow */
}

/* Header Specifics */
.card-body.d-flex.justify-content-between.align-items-center.p-4 {
  padding: 1.5rem !important; /* More internal padding */
}

.rounded-circle.border.border-2.border-primary {
  border-color: var(--bs-primary) !important;
  box-shadow: 0 0 0 3px rgba(var(--bs-primary-rgb), 0.25); /* Glow effect */
}

.btn.rounded-circle.btn-lg {
  width: 48px;
  height: 48px;
  display: inline-flex;
  align-items: center;
  justify-content: center;
  font-size: 1.25rem; /* Larger icons */
  border-width: 2px; /* Slightly thicker border for outline buttons */
}

/* Chat Panel Specifics */
.chat-messages-container {
  max-height: 550px; /* Slightly increased max-height */
  min-height: 300px; /* Ensure a minimum height for smaller screens */
  display: flex;
  flex-direction: column;
  gap: 10px; /* Space between messages */
}

/* Scrollbar Styling for Chat Panel */
.chat-messages-container::-webkit-scrollbar {
  width: 6px; /* Wider scrollbar */
}
.chat-messages-container::-webkit-scrollbar-thumb {
  background-color: rgba(0, 123, 255, 0.3); /* Primary color for thumb */
  border-radius: 6px; /* More rounded thumb */
}
.chat-messages-container::-webkit-scrollbar-track {
  background: rgba(0, 0, 0, 0.05); /* Lighter track */
  border-radius: 6px;
}

.message-bubble {
  border-radius: 1.25rem !important; /* More rounded message bubbles */
  padding: 0.75rem 1.25rem !important; /* Comfortable padding */
  word-wrap: break-word; /* Ensure long words wrap */
}

.bg-primary {
  background-color: var(--bs-primary) !important;
}

.bg-light {
  background-color: var(--bs-light) !important;
}

.text-dark {
  color: var(--bs-dark) !important;
}

/* Input Group Styling */
.input-group .form-control {
  border-top-left-radius: 50rem !important; /* pill-like input */
  border-bottom-left-radius: 50rem !important;
  border-top-right-radius: 0 !important;
  border-bottom-right-radius: 0 !important;
  padding: 0.75rem 1.5rem; /* Taller input */
}

.input-group .btn {
  border-top-right-radius: 50rem !important; /* pill-like button */
  border-bottom-right-radius: 50rem !important;
  border-top-left-radius: 0 !important;
  border-bottom-left-radius: 0 !important;
  padding: 0.75rem 1.5rem; /* Taller button */
}

/* Sidebar Specifics */
.card-header.bg-primary {
  background-color: var(--bs-primary) !important;
  border-bottom: none;
  font-size: 1.15rem;
}

.badge.bg-info-subtle {
  background-color: var(--bs-info-bg-subtle) !important;
  color: var(--bs-info-text-emphasis) !important;
}

.btn.btn-lg.rounded-pill {
  border-radius: 50rem !important;
  padding: 0.75rem 1.5rem;
  font-size: 1.1rem;
}

.btn-danger {
  box-shadow: 0 0.25rem 0.5rem rgba(var(--bs-danger-rgb), 0.2);
}

.text-primary {
  color: var(--bs-primary) !important;
}

.text-success {
  color: var(--bs-success) !important;
}

.text-info {
  color: var(--bs-info) !important;
}

.text-muted {
  color: var(--bs-secondary-text) !important;
}

.fw-bold {
  font-weight: 700 !important;
}

.fs-5 {
  font-size: 1.25rem !important;
}

.display-6 {
    font-size: 2.5rem !important;
}

.bi {
    vertical-align: middle;
}
</style>