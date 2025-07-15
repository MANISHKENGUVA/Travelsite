<template>
  <header class="sticky-top bg-white border-bottom shadow-sm py-3">
    <div class="container d-flex align-items-center justify-content-between">
      <router-link to="/" class="d-flex align-items-center text-decoration-none me-auto me-md-0">
        <div class="bg-primary text-white d-flex align-items-center justify-content-center rounded-circle p-2 me-2 logo-icon-wrapper">
          <i class="bi bi-box-seam fs-5"></i>
        </div>
        <span class="fw-bold fs-5 text-dark d-none d-sm-inline">DeliveryLink</span>
      </router-link>

      <nav class="d-none d-md-flex align-items-center gap-4 ms-4">
        <router-link
          v-for="item in navItems"
          :key="item.href"
          :to="item.href"
          class="nav-link d-flex align-items-center text-decoration-none py-2 px-3 rounded-pill transition-all"
          :class="{
            'bg-primary text-white shadow-sm': isActive(item.href),
            'text-muted hover-primary': !isActive(item.href),
          }"
        >
          <i :class="item.icon" class="me-2 fs-6"></i>
          <span class="fw-medium">{{ item.label }}</span>
        </router-link>
      </nav>

      <div v-if="$store.getters.getUser.email" class="d-flex align-items-center ms-md-4 gap-2 gap-md-3">
        <button
          class="btn btn-light rounded-circle p-2 action-btn position-relative"
          type="button"
          data-bs-toggle="offcanvas"
          data-bs-target="#notificationsOffcanvas"
          aria-controls="notificationsOffcanvas"
        >
          <i class="bi bi-bell fs-5"></i>
          <span v-if="unreadNotificationsCount > 0" class="position-absolute top-0 start-100 translate-middle badge rounded-pill bg-danger animate__animated animate__headShake animate__infinite animate__slow">
            {{ unreadNotificationsCount }}
            <span class="visually-hidden">unread notifications</span>
          </span>
        </button>

        <button
          class="btn btn-light rounded-circle p-2 action-btn position-relative"
          type="button"
          data-bs-toggle="offcanvas"
          data-bs-target="#chatOffcanvas"
          aria-controls="chatOffcanvas"
        >
          <i class="bi bi-chat-dots fs-5"></i>
          <span v-if="unreadMessagesCount > 0" class="position-absolute top-0 start-100 translate-middle badge rounded-pill bg-success animate__animated animate__headShake animate__infinite animate__slow">
            {{ unreadMessagesCount }}
            <span class="visually-hidden">unread messages</span>
          </span>
        </button>

        <div  v-if="$store.getters.getUser.email" class="dropdown">
          <button
            class="btn btn-light rounded-pill px-3 py-2 border-0 d-flex align-items-center user-dropdown-toggle"
            data-bs-toggle="dropdown"
            aria-expanded="false"
          >
            <i class="fas fa-user-circle fa-2x text-primary me-2"></i>
            <span class="fw-semibold text-dark d-none d-lg-inline">{{$store.state.user.split('@')[0]}}</span>
            <i class="bi bi-chevron-down ms-2 d-none d-lg-inline text-muted small"></i>
          </button>
          <ul class="dropdown-menu dropdown-menu-end shadow-lg border-0 rounded-3">
            <li class="dropdown-header px-4 py-3 bg-light rounded-top-3">
              <div>
                <strong class="text-dark">{{ $store.state.user.split('@')[0] }}</strong>
                <br />
                <small class="text-muted">{{ $store.state.user }}</small>
              </div>
            </li>
            <li><hr class="dropdown-divider" /></li>
            <li>
              <router-link to="/profile" class="dropdown-item py-2">
                <i class="bi bi-person me-3 text-primary"></i> Profile
              </router-link>
            </li>
            <li>
              <router-link to="/settings" class="dropdown-item py-2">
                <i class="bi bi-gear me-3 text-primary"></i> Settings
              </router-link>
            </li>
            <li><hr class="dropdown-divider" /></li>
            <li>
              <button @click="logout" class="dropdown-item text-danger py-2">
                <i class="bi bi-box-arrow-right me-3"></i> Log out
              </button>
            </li>
          </ul>
        </div>

        <button class="btn btn-light d-md-none p-2 action-btn" @click="isOpen = !isOpen">
          <i class="bi bi-list fs-4"></i>
        </button>
      </div>
    </div>

    <transition name="slide-fade">
      <div v-if="isOpen">
        <div
          class="position-fixed top-0 end-0 bg-white shadow-lg h-100 w-75 d-md-none mobile-sidebar"
          style="z-index: 1050;"
        >
          <div class="p-4 border-bottom d-flex justify-content-between align-items-center bg-light">
            <span class="fw-bold text-primary fs-5">Menu</span>
            <button class="btn-close" @click="isOpen = false" aria-label="Close menu"></button>
          </div>
          <nav class="nav flex-column p-4">
            <router-link
              v-for="item in navItems"
              :key="item.href"
              :to="item.href"
              @click.native="isOpen = false"
              class="nav-link d-flex align-items-center mb-3 py-2 rounded-pill transition-all"
              :class="{
                'bg-primary text-white shadow-sm': isActive(item.href),
                'text-dark hover-primary-mobile': !isActive(item.href),
              }"
            >
              <i :class="item.icon" class="me-3 fs-5"></i>
              <span class="fw-medium">{{ item.label }}</span>
            </router-link>
            <hr class="my-3" />
            <router-link to="/profile" @click.native="isOpen = false" class="nav-link d-flex align-items-center text-dark hover-primary-mobile mb-3 py-2 rounded-pill">
              <i class="bi bi-person me-3 fs-5"></i> Profile
            </router-link>
            <router-link to="/settings" @click.native="isOpen = false" class="nav-link d-flex align-items-center text-dark hover-primary-mobile mb-3 py-2 rounded-pill">
              <i class="bi bi-gear me-3 fs-5"></i> Settings
            </router-link>
            <button @click="logoutAndCloseMobileMenu" class="btn btn-outline-danger w-100 mt-3 py-2 rounded-pill">
              <i class="bi bi-box-arrow-right me-2"></i> Log out
            </button>
          </nav>
        </div>
        <div class="modal-backdrop fade show" @click="isOpen = false"></div>
      </div>
    </transition>
  </header>
</template>

<script>
// For 'animate.css' animations on badges, ensure it's imported globally or in your main.js/App.vue
// For example, in your main.js: import 'animate.css/animate.min.css';

export default {
  name: "Navigation",
  data() {
    return {
      isOpen: false, // Controls mobile menu visibility
      navItems: [
        { href: "/", label: "Home", icon: "bi bi-house-door" },
        { href: "/post-delivery", label: "Send Package", icon: "bi bi-box" },
        { href: "/post-trip", label: "Offer Transport", icon: "bi bi-truck" },
        { href: "/dashboard", label: "Dashboard", icon: "bi bi-grid" },
      ],
      notifications: [], // Array to hold notification objects
      chatConversations: [], // Array to hold chat conversation objects
      notificationInterval: null, // To store setInterval ID for simulated notifications
      chatInterval: null,       // To store setInterval ID for simulated chat messages
    };
  },
  computed: {
    // Dynamically calculate unread counts based on the 'notifications' array
    unreadNotificationsCount() {
      return this.notifications.filter(n => !n.read).length;
    },
    // Dynamically calculate unread messages count based on 'chatConversations'
    unreadMessagesCount() {
      return this.chatConversations.filter(c => c.unreadCount > 0).length;
    }
  },
  mounted() {
    // Initialize notifications and chat data
    this.fetchInitialNotifications();
    this.fetchInitialChatConversations();

    // Simulate real-time updates for notifications (every 10 seconds)
    this.notificationInterval = setInterval(this.simulateNewNotification, 10000);
    // Simulate real-time updates for chat messages (every 15 seconds)
    this.chatInterval = setInterval(this.simulateNewMessage, 15000);
  },
  beforeUnmount() {
    // Clear intervals to prevent memory leaks when the component is destroyed
    clearInterval(this.notificationInterval);
    clearInterval(this.chatInterval);
  },
  methods: {
    isActive(path) {
      return this.$route.path === path;
    },
    logout() {
      // Implement your logout logic here (e.g., clear user token, redirect)
     localStorage.removeItem("user")
      this.$router.push('/login');
    },
    logoutAndCloseMobileMenu() {
      this.logout();
      this.isOpen = false;
    },

    // --- Notification Methods ---
    fetchInitialNotifications() {
      // In a real application, this data would come from an API call
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
      this.markNotificationAsRead(notification.id); // Mark as read when clicked
      if (notification.action && notification.action.link) {
        this.$router.push(notification.action.link); // Navigate to linked page
      }
      // Close the offcanvas after an action is taken
      const offcanvasElement = document.getElementById('notificationsOffcanvas');
      if (offcanvasElement) {
        // Use Bootstrap's JS API to hide the offcanvas
        const bsOffcanvas = bootstrap.Offcanvas.getInstance(offcanvasElement) || new bootstrap.Offcanvas(offcanvasElement);
        bsOffcanvas.hide();
      }
    },
    simulateNewNotification() {
      // This function creates a new dummy notification and adds it to the list
      const newNotification = {
        id: Date.now(), // Unique ID for keying
        type: 'delivery',
        icon: 'bi-box-seam',
        title: 'New Delivery Request!',
        message: 'A new package is waiting to be sent from your area. Check details and respond now.',
        time: 'Just now',
        read: false,
        action: { label: 'View Request', link: '/new-request/' + Date.now() }
      };
      // Add to the beginning of the array so new ones appear at the top
      this.notifications.unshift(newNotification);
      console.log('Simulated new notification:', newNotification.title);
    },

    // --- Chat Methods ---
    fetchInitialChatConversations() {
      // In a real application, this data would come from an API call
      this.chatConversations = [
        { id: 101, user: 'Jane Doe', avatar: 'https://i.pravatar.cc/40?img=1', lastMessage: 'Great, thanks for the update!', time: '10 min ago', unreadCount: 1, link: '/chat/jane-doe' },
        { id: 102, user: 'Support Team', avatar: 'https://i.pravatar.cc/40?img=12', lastMessage: 'Your recent query has been resolved. Let us know if you need anything else.', time: '1 hour ago', unreadCount: 0, link: '/chat/support' },
        { id: 103, user: 'Alex Smith', avatar: 'https://i.pravatar.cc/40?img=15', lastMessage: 'I\'ll be there in 5 mins with the package.', time: '1 day ago', unreadCount: 0, link: '/chat/alex-smith' },
      ];
    },
    markChatAsRead(id) {
      const chat = this.chatConversations.find(c => c.id === id);
      if (chat) {
        chat.unreadCount = 0; // Mark messages in this chat as read
      }
      // In a real app, you'd send an API call
      console.log(`Chat ${id} marked as read.`);
    },
    viewChatDetail(chat) {
      this.markChatAsRead(chat.id); // Mark chat as read when opening
      if (chat.link) {
        this.$router.push(chat.link); // Navigate to chat conversation
      }
      // Close the offcanvas after opening a chat
      const offcanvasElement = document.getElementById('chatOffcanvas');
      if (offcanvasElement) {
        const bsOffcanvas = bootstrap.Offcanvas.getInstance(offcanvasElement) || new bootstrap.Offcanvas(offcanvasElement);
        bsOffcanvas.hide();
      }
    },
    simulateNewMessage() {
      // Simulate new message for the first chat in the list
      const targetChat = this.chatConversations[0];
      if (targetChat) {
        targetChat.lastMessage = `New message! The delivery is almost complete. ${new Date().toLocaleTimeString()}`;
        targetChat.time = 'Just now';
        targetChat.unreadCount++;
        console.log('Simulated new message for:', targetChat.user);
      } else if (this.chatConversations.length === 0) {
        // If no chats exist, create a new one to show a new message
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
      // Close the offcanvas and navigate to a new chat composition page
      const offcanvasElement = document.getElementById('chatOffcanvas');
      if (offcanvasElement) {
        const bsOffcanvas = bootstrap.Offcanvas.getInstance(offcanvasElement) || new bootstrap.Offcanvas(offcanvasElement);
        bsOffcanvas.hide();
      }
      this.$router.push('/chat/new'); // Example: redirect to a page to start a new chat
    }
  },
  watch: {
    // Close the mobile menu when the route changes
    '$route'() {
      this.isOpen = false;
    }
  }
};
</script>

<style >
/* Base Header Styling */
header {
  box-shadow: 0 0.125rem 0.25rem rgba(0, 0, 0, 0.075) !important;
  z-index: 1020; /* Ensure header is above other content */
}

.container {
  max-width: 1320px; /* Wider container for larger screens */
}

/* Logo Styling */
.logo-icon-wrapper {
  width: 40px; /* Slightly larger icon */
  height: 40px;
  font-size: 1.2rem;
}

/* Desktop Navigation Links */
.nav-link {
  transition: all 0.2s ease-in-out;
  white-space: nowrap; /* Prevent wrapping on desktop */
}

.nav-link.hover-primary:hover {
  color: var(--bs-primary) !important;
  background-color: var(--bs-primary-bg-subtle) !important; /* Subtle hover background */
}

/* Active Nav Link */
.nav-link.active.bg-primary {
  background-color: var(--bs-primary) !important;
  color: white !important;
}

/* Action Buttons (Notification, Messages, Mobile Toggle) */
.action-btn {
  width: 44px; /* Larger touch target */
  height: 44px;
  display: flex;
  align-items: center;
  justify-content: center;
  font-size: 1.2rem;
  color: var(--bs-dark);
  transition: all 0.2s ease-in-out;
  /* Add position relative for badge positioning */
  position: relative; /* IMPORTANT for badge positioning */
}

.action-btn:hover {
  background-color: var(--bs-light) !important;
  color: var(--bs-primary) !important;
  box-shadow: 0 0 0 0.25rem rgba(var(--bs-primary-rgb), 0.1); /* Subtle hover shadow */
}

/* Badge Styling */
.action-btn .badge {
    padding: 0.4em 0.6em; /* Slightly larger badge */
    font-size: 0.7em; /* Make text within badge smaller */
    line-height: 1; /* Adjust line height */
}

/* User Dropdown Toggle */
.user-dropdown-toggle {
  background-color: var(--bs-light) !important;
  transition: all 0.2s ease-in-out;
}

.user-dropdown-toggle:hover {
  background-color: var(--bs-light) !important;
  box-shadow: 0 0 0 0.25rem rgba(var(--bs-primary-rgb), 0.1);
}

.user-dropdown-toggle .fa-user-circle {
  font-size: 2rem; /* Ensure icon size */
}

/* Dropdown Menu */
.dropdown-menu {
  min-width: 220px; /* Slightly wider dropdown */
}

.dropdown-item {
  color: var(--bs-dark);
  font-weight: 500;
  transition: all 0.15s ease-in-out;
}

.dropdown-item:active,
.dropdown-item:hover {
  background-color: var(--bs-primary-bg-subtle);
  color: var(--bs-primary);
}

.dropdown-item .bi {
  min-width: 24px; /* Align icons */
}

/* Mobile Sidebar */
.mobile-sidebar {
  border-left: 1px solid var(--bs-border-color-translucent);
}

.mobile-sidebar .nav-link {
  padding: 0.75rem 1rem;
}

.mobile-sidebar .nav-link.hover-primary-mobile:hover {
  background-color: var(--bs-primary-bg-subtle) !important;
  color: var(--bs-primary) !important;
}

/* Vue Transition Styles */
.slide-fade-enter-active,
.slide-fade-leave-active {
  transition: transform 0.3s ease-out, opacity 0.3s ease-out;
}
.slide-fade-enter-from, /* Starting state for enter transition */
.slide-fade-leave-to {    /* Ending state for leave transition */
  transform: translateX(100%);
  opacity: 0;
}

/* Modal Backdrop for Mobile Menu */
.modal-backdrop {
  background-color: rgba(0, 0, 0, 0.4); /* Darker, slightly transparent overlay */
  z-index: 1040; /* Below sidebar, above page content */
}


/* --- Offcanvas Specific Styles --- */
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


/* --- Dark Mode Compatibility --- */
/*
 * Requires a parent class, e.g., <body class="theme-dark">
 * Define these variables in your main CSS if not already present
 * :root {
 * --bs-primary-light: #6a9cff;
 * --bs-success-light: #82e0aa;
 * --bs-primary-dark-rgb: 40, 90, 255;
 * --bs-success-dark-rgb: 0, 128, 0;
 * }
 */
body.theme-dark header {
  background-color: #2a2a2a !important;
  border-color: #333 !important;
  box-shadow: 0 0.125rem 0.25rem rgba(0, 0, 0, 0.2) !important;
}

body.theme-dark .text-dark {
  color: #e0e0e0 !important;
}

body.theme-dark .text-muted {
  color: #b0b0b0 !important;
}

body.theme-dark .action-btn {
  background-color: #3a3a3a !important;
  color: #e0e0e0;
}

body.theme-dark .action-btn:hover {
  background-color: #4a4a4a !important;
  color: var(--bs-primary-light) !important;
}

body.theme-dark .user-dropdown-toggle {
  background-color: #3a3a3a !important;
  color: #e0e0e0 !important;
}

body.theme-dark .user-dropdown-toggle:hover {
  background-color: #4a4a4a !important;
}

body.theme-dark .dropdown-menu {
  background-color: #3a3a3a;
  border-color: #555;
  box-shadow: 0 0.5rem 1rem rgba(0, 0, 0, 0.3) !important;
}

body.theme-dark .dropdown-header {
  background-color: #4a4a4a !important;
  border-bottom-color: #555 !important;
}

body.theme-dark .dropdown-header strong,
body.theme-dark .dropdown-header small {
  color: #e0e0e0 !important;
}

body.theme-dark .dropdown-item {
  color: #e0e0e0;
}

body.theme-dark .dropdown-item:active,
body.theme-dark .dropdown-item:hover {
  background-color: #4a4a4a;
  color: var(--bs-primary-light) !important;
}

body.theme-dark .dropdown-divider {
  border-top-color: #555;
}

body.theme-dark .dropdown-item .bi {
  color: var(--bs-primary-light) !important;
}

body.theme-dark .mobile-sidebar {
  background-color: #2a2a2a !important;
  border-left-color: #333 !important;
}

body.theme-dark .mobile-sidebar .nav-link {
  color: #e0e0e0 !important;
}

body.theme-dark .mobile-sidebar .nav-link.hover-primary-mobile:hover {
  background-color: #3a3a3a !important;
  color: var(--bs-primary-light) !important;
}

body.theme-dark .mobile-sidebar .btn-close {
  filter: invert(1); /* Makes close button white in dark mode */
}

/* Dark Mode Offcanvas Content */
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

</style >