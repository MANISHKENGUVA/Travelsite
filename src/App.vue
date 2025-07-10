<template>
  <div id="app">
    <Layout />

    <router-view />

    <div class="offcanvas offcanvas-end" tabindex="-1" id="notificationsOffcanvas" aria-labelledby="notificationsOffcanvasLabel">
      <div class="offcanvas-header bg-light border-bottom">
        <h5 class="offcanvas-title fw-bold" id="notificationsOffcanvasLabel">
          <i class="bi bi-bell-fill me-2 text-primary"></i> Notifications
        </h5>
        <button type="button" class="btn-close text-reset" data-bs-dismiss="offcanvas" aria-label="Close"></button>
      </div>
      <div class="offcanvas-body d-flex flex-column p-0">
        <template v-if="notifications.length > 0">
          <ul class="list-group list-group-flush mb-auto">
            <li
              v-for="notification in notifications"
              :key="notification.id"
              class="list-group-item d-flex align-items-start py-3 notification-item"
              :class="{ 'notification-unread': !notification.read }"
              @click="viewNotificationDetail(notification)"
            >
              <div class="me-3 fs-4 text-primary">
                <i :class="notification.icon"></i>
              </div>
              <div class="flex-grow-1">
                <small class="text-muted d-block mb-1">{{ notification.type.toUpperCase() }} - {{ notification.time }}</small>
                <strong class="d-block mb-1">{{ notification.title }}</strong>
                <p class="mb-0 text-muted small text-truncate">{{ notification.message }}</p>
                <div v-if="notification.action" class="mt-2">
                    <button
                        class="btn btn-sm btn-outline-primary"
                        @click.stop="viewNotificationDetail(notification)"
                    >
                        {{ notification.action.label }}
                    </button>
                </div>
              </div>
              <button
                  v-if="!notification.read"
                  class="btn btn-sm btn-outline-secondary ms-3 align-self-center"
                  @click.stop="markNotificationAsRead(notification.id)"
                  title="Mark as Read"
              >
                  <i class="bi bi-check-circle"></i>
              </button>
            </li>
          </ul>
        </template>
        <template v-else>
          <div class="d-flex flex-column align-items-center justify-content-center h-100 text-muted p-4 text-center">
            <i class="bi bi-bell-slash fs-1 mb-3"></i>
            <h5>No new notifications!</h5>
            <p class="mb-0">You're all caught up. Check back later for updates.</p>
          </div>
        </template>

        <div class="mt-auto p-3 border-top d-grid gap-2">
          <button v-if="unreadNotificationsCount > 0" class="btn btn-outline-primary" @click="markAllNotificationsRead">
            <i class="bi bi-envelope-open me-2"></i> Mark All as Read
          </button>
          <router-link to="/notifications" class="btn btn-primary" data-bs-dismiss="offcanvas">
            <i class="bi bi-list-check me-2"></i> View All Notifications
          </router-link>
        </div>
      </div>
    </div>

    <div class="offcanvas offcanvas-end" tabindex="-1" id="chatOffcanvas" aria-labelledby="chatOffcanvasLabel">
      <div class="offcanvas-header bg-light border-bottom">
        <h5 class="offcanvas-title fw-bold" id="chatOffcanvasLabel">
          <i class="bi bi-chat-dots-fill me-2 text-success"></i> Chats
        </h5>
        <button type="button" class="btn-close text-reset" data-bs-dismiss="offcanvas" aria-label="Close"></button>
      </div>
      <div class="offcanvas-body d-flex flex-column p-0">
        <template v-if="chatConversations.length > 0">
          <ul class="list-group list-group-flush mb-auto">
            <li
              v-for="chat in chatConversations"
              :key="chat.id"
              class="list-group-item d-flex align-items-center py-3 chat-item"
              :class="{ 'chat-unread': chat.unreadCount > 0 }"
              @click="viewChatDetail(chat)"
            >
              <img :src="chat.avatar" class="rounded-circle me-3 chat-avatar" :alt="chat.user + ' avatar'" />
              <div class="flex-grow-1">
                <div class="d-flex justify-content-between align-items-baseline">
                    <strong class="d-block">{{ chat.user }}</strong>
                    <small class="text-muted ms-2">{{ chat.time }}</small>
                </div>
                <p class="mb-0 text-muted small text-truncate">{{ chat.lastMessage }}</p>
              </div>
              <span v-if="chat.unreadCount > 0" class="badge bg-success rounded-pill ms-auto animate__animated animate__headShake animate__infinite animate__slow">
                {{ chat.unreadCount }}
              </span>
            </li>
          </ul>
        </template>
        <template v-else>
          <div class="d-flex flex-column align-items-center justify-content-center h-100 text-muted p-4 text-center">
            <i class="bi bi-chat-dots fs-1 mb-3"></i>
            <h5>No active conversations.</h5>
            <p class="mb-0">Start a new chat to connect with others!</p>
          </div>
        </template>

        <div class="mt-auto p-3 border-top d-grid">
          <button class="btn btn-success" @click="startNewChat">
            <i class="bi bi-chat-right-text me-2"></i> Start New Chat
          </button>
          <button @click="viewAllMessages" class="btn btn-outline-success mt-2">
  <i class="bi bi-inbox-fill me-2"></i> View All Messages
</button>
        </div>
      </div>
    </div>

  </div>
</template>

<script>
// Assuming 'Layout' is your Navigation.vue component.
// You might want to rename it to Navigation to be clearer.
import Layout from './compo/Layout.vue';
// Import the Bootstrap JS bundle if not done globally in main.js
// import * as bootstrap from 'bootstrap'; // If you want to use it directly here

export default {
  components: {
    Layout,
  },
  data() {
    return {
      
      notifications: [],
      chatConversations: [],
      notificationInterval: null,
      chatInterval: null,
    };
  },
  computed: {
    user() {
      return this.$store.state.user;
    },
    userLogined() {
      return this.$store.getters.isLoggedIn;
    },
    deliveries() {
      return this.$store.state.deliveries;
    },
    unreadNotificationsCount() {
      return this.notifications.filter(n => !n.read).length;
    },
    unreadMessagesCount() {
      return this.chatConversations.filter(c => c.unreadCount > 0).length;
    }
  },
  methods: {
    viewAllMessages() {
      // 1. Navigate to the messages page
      this.$router.push('/messages');

      // 2. Dismiss the offcanvas programmatically
      // Replace 'YOUR_OFFCANVAS_ID' with the actual ID of your Bootstrap offcanvas element
      const offcanvasElement = document.getElementById('YOUR_OFFCANVAS_ID'); 
      if (offcanvasElement) {
        // Get the Offcanvas instance, or create one if it doesn't exist yet
        const offcanvas = Offcanvas.getInstance(offcanvasElement) || new Offcanvas(offcanvasElement);
        offcanvas.hide(); // Hide the offcanvas
      }
    },
    fetchInitialNotifications() {
      this.notifications = [
        { id: 1, type: 'delivery', icon: 'bi-truck', title: 'Package Delivered!', message: 'Your package DL987654 has been delivered. View details now!', time: '1 hour ago', read: false, action: { label: 'View Details', link: '/delivery/123' } },
        { id: 2, type: 'system', icon: 'bi-info-circle', title: 'System Update', message: 'Exciting new features have been rolled out across the platform. Check them out!', time: '2 hours ago', read: false, action: { label: 'Read More', link: '/updates' } },
        { id: 3, type: 'promo', icon: 'bi-gift', title: 'Special Offer', message: 'Get 10% off your next delivery when you send a package this week!', time: '1 day ago', read: true, action: { label: 'Claim Now', link: '/promo/xyz' } },
        { id: 4, type: 'alert', icon: 'bi-exclamation-triangle', title: 'Action Required', message: 'Your payment method needs to be updated to continue service. Please update it soon.', time: '3 days ago', read: false, action: { label: 'Update Payment', link: '/settings#billing' } },
      ];
    },
    markNotificationAsRead(id) {
      const notification = this.notifications.find(n => n.id === id);
      if (notification) {
        notification.read = true;
      }
      console.log(`Notification ${id} marked as read.`);
    },
    markAllNotificationsRead() {
      this.notifications.forEach(n => n.read = true);
      console.log('All notifications marked as read.');
    },
    viewNotificationDetail(notification) {
      this.markNotificationAsRead(notification.id);
      if (notification.action && notification.action.link) {
        this.$router.push(notification.action.link);
      }
      const offcanvasElement = document.getElementById('notificationsOffcanvas');
      if (offcanvasElement) {
        const bsOffcanvas = bootstrap.Offcanvas.getInstance(offcanvasElement) || new bootstrap.Offcanvas(offcanvasElement);
        bsOffcanvas.hide();
      }
    },
    simulateNewNotification() {
      const newNotification = {
        id: Date.now(),
        type: 'delivery',
        icon: 'bi-box-seam',
        title: 'New Delivery Request!',
        message: 'A new package is waiting to be sent from your area. Check details and respond now.',
        time: 'Just now',
        read: false,
        action: { label: 'View Request', link: '/new-request/' + Date.now() }
      };
      this.notifications.unshift(newNotification);
      console.log('Simulated new notification:', newNotification.title);
    },

    // --- Chat Methods ---
    fetchInitialChatConversations() {
      this.chatConversations = [
        { id: 101, user: 'Jane Doe', avatar: 'https://i.pravatar.cc/40?img=1', lastMessage: 'Great, thanks for the update!', time: '10 min ago', unreadCount: 1, link: '/userchat/jane-doe' },
        { id: 102, user: 'Support Team', avatar: 'https://i.pravatar.cc/40?img=12', lastMessage: 'Your recent query has been resolved. Let us know if you need anything else.', time: '1 hour ago', unreadCount: 0, link: '/customerchat/support' },
        { id: 103, user: 'Alex Smith', avatar: 'https://i.pravatar.cc/40?img=15', lastMessage: 'I\'ll be there in 5 mins with the package.', time: '1 day ago', unreadCount: 0, link: '/userchat/jane-doe' },
      ];
    },
    markChatAsRead(id) {
      const chat = this.chatConversations.find(c => c.id === id);
      if (chat) {
        chat.unreadCount = 0;
      }
      console.log(`Chat ${id} marked as read.`);
    },
    viewChatDetail(chat) {
      alert(`Viewing chat with ${JSON.stringify( chat)}`);
      this.markChatAsRead(chat.id);
      if (chat.link) {
        this.$router.push(chat.link);

      }
      const offcanvasElement = document.getElementById('chatOffcanvas');
      if (offcanvasElement) {
        const bsOffcanvas = bootstrap.Offcanvas.getInstance(offcanvasElement) || new bootstrap.Offcanvas(offcanvasElement);
        bsOffcanvas.hide();
      }
    },
    simulateNewMessage() {
      const targetChat = this.chatConversations[0];
      if (targetChat) {
        targetChat.lastMessage = `New message! The delivery is almost complete. ${new Date().toLocaleTimeString()}`;
        targetChat.time = 'Just now';
        targetChat.unreadCount++;
      } else if (this.chatConversations.length === 0) {
        this.chatConversations.unshift({
          id: Date.now(),
          user: 'New Customer',
          avatar: 'https://i.pravatar.cc/40?img=20',
          lastMessage: 'Hello there! I have a question about my order.',
          time: 'Just now',
          unreadCount: 1,
          link: '/chat/new-customer'
        });
      }
    },
    startNewChat() {
      console.log('Simulating starting a new chat...');
      const offcanvasElement = document.getElementById('chatOffcanvas');
      if (offcanvasElement) {
        const bsOffcanvas = bootstrap.Offcanvas.getInstance(offcanvasElement) || new bootstrap.Offcanvas(offcanvasElement);
        bsOffcanvas.hide();
      }
      this.$router.push('/chat/new');
    }
  },
  mounted() {
    this.fetchInitialNotifications();
    this.fetchInitialChatConversations();
    this.notificationInterval = setInterval(this.simulateNewNotification, 10000);
    this.chatInterval = setInterval(this.simulateNewMessage, 15000);
  },
  beforeUnmount() {
    clearInterval(this.notificationInterval);
    clearInterval(this.chatInterval);
  }
};
</script>

<style scoped>
/* Add your component-specific styles here */
/* These styles are for the Offcanvas panels themselves,
   not the Navigation bar. */

/* Offcanvas Header & Body adjustments */
.offcanvas-header {
  border-bottom: 1px solid var(--bs-border-color-translucent);
  padding: 1.25rem 1.5rem;
}

.offcanvas-title {
  font-size: 1.4rem;
}

.offcanvas-body {
  padding: 0; /* Remove default body padding as list items have their own */
  overflow-y: auto; /* Allow scrolling within the panel */
}

/* Notification List Item Styling */
.notification-item {
  cursor: pointer;
  border-bottom: 1px solid var(--bs-border-color-translucent);
  transition: all 0.2s ease-in-out;
}

.notification-item:hover {
  background-color: var(--bs-light);
  transform: translateY(-2px); /* Subtle lift effect */
  box-shadow: 0 0.25rem 0.5rem rgba(0, 0, 0, 0.05);
}

.notification-item:last-child {
  border-bottom: none; /* No border for the last item in the list */
}

.notification-unread {
  background-color: var(--bs-primary-bg-subtle); /* Highlight unread items */
  font-weight: 500;
}

.notification-unread .text-muted {
  color: var(--bs-primary-text-emphasis) !important;
}

/* Chat List Item Styling */
.chat-item {
  cursor: pointer;
  border-bottom: 1px solid var(--bs-border-color-translucent);
  transition: all 0.2s ease-in-out;
}

.chat-item:hover {
  background-color: var(--bs-light);
  transform: translateY(-2px);
  box-shadow: 0 0.25rem 0.5rem rgba(0, 0, 0, 0.05);
}

.chat-item:last-child {
  border-bottom: none;
}

.chat-unread {
  background-color: var(--bs-success-bg-subtle); /* Highlight unread chat */
  font-weight: 500;
}

.chat-unread .text-muted {
  color: var(--bs-success-text-emphasis) !important;
}

.chat-avatar {
  width: 45px;
  height: 45px;
  object-fit: cover;
  flex-shrink: 0; /* Prevent avatar from shrinking */
}


body.theme-dark .offcanvas-header {
  background-color: #3a3a3a !important;
  border-color: #555 !important;
}

body.theme-dark .offcanvas-title {
  color: #e0e0e0;
}

body.theme-dark .offcanvas-body {
  background-color: #2a2a2a;
}

body.theme-dark .list-group-item {
  background-color: #2a2a2a;
  color: #e0e0e0;
  border-color: #3a3a3a;
}

body.theme-dark .notification-item:hover,
body.theme-dark .chat-item:hover {
  background-color: #3a3a3a;
}

body.theme-dark .notification-unread {
  background-color: rgba(var(--bs-primary-dark-rgb), 0.15); /* Darker subtle highlight */
}
body.theme-dark .chat-unread {
  background-color: rgba(var(--bs-success-dark-rgb), 0.15);
}

body.theme-dark .notification-item .text-muted,
body.theme-dark .chat-item .text-muted {
  color: #b0b0b0 !important;
}

body.theme-dark .notification-unread .text-muted {
  color: var(--bs-primary-light) !important;
}
body.theme-dark .chat-unread .text-muted {
  color: var(--bs-success-light) !important;
}

body.theme-dark .offcanvas-body .border-top {
  border-top-color: #3a3a3a !important;
}

body.theme-dark .btn-outline-primary {
  color: var(--bs-primary-light);
  border-color: var(--bs-primary-light);
}
body.theme-dark .btn-outline-primary:hover {
  background-color: var(--bs-primary-light);
  color: #2a2a2a;
}

body.theme-dark .btn-outline-success {
  color: var(--bs-success-light);
  border-color: var(--bs-success-light);
}
body.theme-dark .btn-outline-success:hover {
  background-color: var(--bs-success-light);
  color: #2a2a2a;
}

body.theme-dark .text-primary {
  color: var(--bs-primary-light) !important;
}
body.theme-dark .text-success {
  color: var(--bs-success-light) !important;
}
</style>