<template>
  <div class="messages-container py-5 bg-light min-vh-100">
    <div class="container">
      <h2 class="mb-4 fw-bold text-primary text-center">
        <i class="bi bi-chat-dots me-3"></i>Your Messages
      </h2>

      <div class="card shadow-sm border-0 rounded-4 message-list-card">
        <div class="card-body p-0">
          <ul class="list-group list-group-flush">
            <li v-for="message in messages" :key="message.id"
                class="list-group-item list-group-item-action py-3 px-4 d-flex align-items-center"
                @click="goToChat(message.link)">
              
              <div class="message-avatar me-3 flex-shrink-0">
                <img :src="message.avatar" class="rounded-circle" :alt="message.user + ' avatar'">
                <span v-if="message.unreadCount > 0" class="badge bg-danger rounded-pill unread-badge">{{ message.unreadCount }}</span>
              </div>

              <div class="message-content flex-grow-1">
                <div class="d-flex justify-content-between align-items-baseline mb-1">
                  <h6 class="mb-0 fw-bold message-user">{{ message.user }}</h6>
                  <small class="text-muted message-time">{{ message.time }}</small>
                </div>
                <p class="mb-0 text-truncate text-muted message-last">{{ message.lastMessage }}</p>
              </div>

              <div class="message-arrow ms-3 flex-shrink-0">
                <i class="bi bi-chevron-right text-muted"></i>
              </div>
            </li>
            <li v-if="messages.length === 0" class="list-group-item text-center py-5 text-muted">
                <i class="bi bi-chat-dots fs-1 mb-3"></i>
                <p>You don't have any messages yet.</p>
                <router-link to="/dashboard" class="btn btn-outline-primary">Go to Dashboard</router-link>
            </li>
          </ul>
        </div>
      </div>
    </div>
  </div>
</template>

<script>
export default {
  name: 'MessagesPage',
  data() {
    return {
      messages: [
        { id: 101, user: 'Jane Doe', avatar: 'https://i.pravatar.cc/40?img=1', lastMessage: 'Great, thanks for the update!', time: '10 min ago', unreadCount: 1, link: '/userchat/jane-doe' },
        { id: 102, user: 'Support Team', avatar: 'https://i.pravatar.cc/40?img=12', lastMessage: 'Your recent query has been resolved. Let us know if you need anything else.', time: '1 hour ago', unreadCount: 0, link: '/customerchat/support' },
        { id: 103, user: 'Alex Smith', avatar: 'https://i.pravatar.cc/40?img=15', lastMessage: 'I\'ll be there in 5 mins with the package.', time: '1 day ago', unreadCount: 0, link: '/userchat/jane-doe' },
        // Add more mock data if needed
      ]
    };
  },
  methods: {
    goToChat(link) {
      this.$router.push(link);
    }
  },
  // Optional: Set document title
  mounted() {
    document.title = 'Your Messages - App Name';
  }
};
</script>

<style scoped>
/* Base Colors and Variables for Theming (re-use from other components or define globally) */
:root {
  --page-bg-light: #f4f7f6;
  --page-bg-dark: #202020;
  --card-bg-light: #ffffff;
  --card-bg-dark: #2a2a2a;
  --text-color-light: #333;
  --text-color-dark: #e0e0e0;
  --muted-text-color-light: #6c757d;
  --muted-text-color-dark: #b0b0b0;
  --border-color-light: #e0e0e0;
  --border-color-dark: #3a3a3a;
  --shadow-color-light: rgba(0, 0, 0, 0.05);
  --shadow-color-dark: rgba(0, 0, 0, 0.2);
}

/* Light Mode Defaults */
.messages-container {
  background-color: var(--page-bg-light);
  color: var(--text-color-light);
}

.message-list-card {
  background-color: var(--card-bg-light);
  border-color: var(--border-color-light) !important;
  box-shadow: 0 4px 15px var(--shadow-color-light);
  max-width: 700px; /* Limit width for better readability */
  margin: 0 auto; /* Center the card */
}

.list-group-item {
  cursor: pointer;
  border-color: var(--border-color-light);
  transition: background-color 0.2s ease;
}

.list-group-item:hover {
  background-color: #f8f9fa; /* Light hover effect */
}

.message-avatar img {
  width: 50px;
  height: 50px;
  object-fit: cover;
  border: 2px solid var(--bs-primary);
}

.unread-badge {
  position: absolute;
  top: -5px;
  right: -5px;
  font-size: 0.7em;
  padding: 0.3em 0.6em;
  border-radius: 50%;
}

.message-last {
  white-space: nowrap;
  overflow: hidden;
  text-overflow: ellipsis;
  max-width: 90%; /* Prevent last message from pushing arrow too far */
}

/* Dark Mode Overrides */
body.theme-dark .messages-container {
  background-color: var(--page-bg-dark);
  color: var(--text-color-dark);
}

body.theme-dark .message-list-card {
  background-color: var(--card-bg-dark);
  border-color: var(--border-color-dark) !important;
  box-shadow: 0 4px 15px var(--shadow-color-dark);
}

body.theme-dark .list-group-item {
  background-color: transparent; /* Inherit from card or set specific dark background */
  border-color: var(--border-color-dark);
  color: var(--text-color-dark);
}

body.theme-dark .list-group-item:hover {
  background-color: rgba(255, 255, 255, 0.05); /* Subtle dark hover */
}

body.theme-dark .message-user {
  color: var(--text-color-dark);
}

body.theme-dark .message-last,
body.theme-dark .message-time {
  color: var(--muted-text-color-dark) !important;
}

body.theme-dark .message-avatar img {
  border: 2px solid var(--bs-primary-light); /* Use lighter primary for contrast */
}

body.theme-dark .text-primary {
  color: var(--bs-primary-light) !important;
}

body.theme-dark .btn-outline-primary {
  color: var(--bs-primary-light);
  border-color: var(--bs-primary-light);
}
body.theme-dark .btn-outline-primary:hover {
  background-color: var(--bs-primary-light);
  color: var(--page-bg-dark);
}

</style>