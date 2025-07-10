<template>
  <div class="updates-container py-5 bg-light min-vh-100">
    <div class="container">
      <h2 class="mb-5 fw-bold text-primary text-center">
        <i class="bi bi-bell-fill me-3"></i>Recent Updates
      </h2>

      <div class="card shadow-sm border-0 rounded-4 updates-list-card">
        <div class="card-body p-0">
          <ul class="list-group list-group-flush">
            <li v-if="updates.length === 0" class="list-group-item text-center py-5 text-muted">
              <i class="bi bi-info-circle fs-1 mb-3"></i>
              <p>No new updates at the moment.</p>
              <router-link to="/dashboard" class="btn btn-outline-primary">Go to Dashboard</router-link>
            </li>

            <li v-for="update in sortedUpdates" :key="update.id"
                :class="['list-group-item', 'list-group-item-action', 'py-3', 'px-4', 'd-flex', 'align-items-start', { 'update-unread': !update.read }]"
                @click="markAsReadAndNavigate(update)">
              
              <div class="update-icon me-3 flex-shrink-0">
                <i :class="['bi', update.iconClass, 'fs-4', update.iconColorClass]"></i>
              </div>

              <div class="update-content flex-grow-1">
                <div class="d-flex justify-content-between align-items-baseline mb-1">
                  <h6 class="mb-0 fw-bold update-title">{{ update.title }}</h6>
                  <small class="text-muted update-time">{{ update.time }}</small>
                </div>
                <p class="mb-0 text-muted update-message">{{ update.message }}</p>
                <div v-if="update.link" class="mt-2">
                    <span class="btn btn-sm btn-outline-primary rounded-pill">
                        View Details <i class="bi bi-arrow-right"></i>
                    </span>
                </div>
              </div>

              <div v-if="!update.read" class="unread-dot ms-3 flex-shrink-0"></div>
            </li>
          </ul>
        </div>
      </div>
    </div>
  </div>
</template>

<script>
export default {
  name: 'UpdatesPage',
  data() {
    return {
      updates: [
        { 
          id: 'upd-1', 
          type: 'request', 
          title: 'Request Accepted', 
          message: 'Your delivery request REQ-1752086836594 (Small Parcel) has been accepted by John Doe.', 
          time: '5 min ago', 
          read: false, 
          link: '/new-request/REQ-1752086836594', 
          iconClass: 'bi-check-circle-fill', 
          iconColorClass: 'text-success' 
        },
        { 
          id: 'upd-2', 
          type: 'message', 
          title: 'New Message', 
          message: 'You have a new message from Priya Sharma regarding your package.', 
          time: '15 min ago', 
          read: false, 
          link: '/userchat/priya-sharma', // Assuming a chat route
          iconClass: 'bi-chat-dots-fill', 
          iconColorClass: 'text-primary' 
        },
        { 
          id: 'upd-3', 
          type: 'request', 
          title: 'Pickup Confirmed', 
          message: 'Package for REQ-1752086836595 (Medium Box) has been picked up by Carrier ID#456.', 
          time: '1 hour ago', 
          read: true, 
          link: '/new-request/REQ-1752086836595', 
          iconClass: 'bi-box-seam-fill', 
          iconColorClass: 'text-info' 
        },
        { 
          id: 'upd-4', 
          type: 'announcement', 
          title: 'New Feature Alert!', 
          message: 'Live tracking of your deliveries is now available directly on the Dashboard!', 
          time: '1 day ago', 
          read: true, 
          link: '/dashboard', 
          iconClass: 'bi-megaphone-fill', 
          iconColorClass: 'text-warning' 
        },
        { 
          id: 'upd-5', 
          type: 'system', 
          title: 'System Update', 
          message: 'Scheduled maintenance complete. All services are fully operational.', 
          time: '2 days ago', 
          read: true, 
          link: null, 
          iconClass: 'bi-gear-fill', 
          iconColorClass: 'text-secondary' 
        },
        { 
          id: 'upd-6', 
          type: 'request', 
          title: 'Delivery Confirmed', 
          message: 'Delivery for REQ-COMPLETED-1 (Large Furniture) was successfully completed and signed off.', 
          time: '3 days ago', 
          read: true, 
          link: '/new-request/REQ-COMPLETED-1', 
          iconClass: 'bi-truck-flatbed', 
          iconColorClass: 'text-success' 
        }
      ]
    };
  },
  computed: {
    sortedUpdates() {
      // Sort updates by read status (unread first) and then by time (not truly by time string here, but by order of definition)
      // For real-time sorting, 'time' should be a Date object or timestamp.
      return [...this.updates].sort((a, b) => {
        if (a.read === b.read) {
          return 0; // Maintain original order if read status is same
        }
        return a.read ? 1 : -1; // Unread (false) comes before read (true)
      });
    }
  },
  methods: {
    markAsReadAndNavigate(update) {
      // Find the update in the array and mark it as read
      const index = this.updates.findIndex(u => u.id === update.id);
      if (index !== -1) {
        this.updates[index].read = true; // This will trigger reactivity
      }

      // If there's a link, navigate
      if (update.link) {
        this.$router.push(update.link);
      }
      // You might also implement an API call here to persist the "read" status
    }
  },
  mounted() {
    document.title = 'Your Updates - App Name';
  }
};
</script>

<style scoped>
/* Re-using theme variables from previous components if available globally, otherwise define them here */
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

  /* Lighter shades for dark mode icons/text for better visibility on dark backgrounds */
  --bs-primary-light: #6a9cff;
  --bs-success-light: #82e0aa;
  --bs-danger-light: #ff7f7f;
  --bs-info-light: #80d9ee;
  --bs-warning-light: #ffd700;
  --bs-secondary-light: #a9a9a9;
}

/* Light Mode Defaults */
.updates-container {
  background-color: var(--page-bg-light);
  color: var(--text-color-light);
}

.updates-list-card {
  background-color: var(--card-bg-light);
  border-color: var(--border-color-light) !important;
  box-shadow: 0 4px 15px var(--shadow-color-light);
  max-width: 800px; /* Limit width for better readability */
  margin: 0 auto; /* Center the card */
}

.list-group-item {
  cursor: pointer;
  border-color: var(--border-color-light);
  transition: background-color 0.2s ease, opacity 0.3s ease;
  position: relative; /* For unread dot */
}

.list-group-item:hover {
  background-color: #f8f9fa; /* Light hover effect */
}

.update-unread {
  font-weight: bold;
  background-color: #eaf3fe; /* Subtle background for unread items */
}

.update-unread:hover {
  background-color: #ddebfd !important;
}

.update-icon {
  margin-top: 5px; /* Align icon better with text */
}

.unread-dot {
  width: 10px;
  height: 10px;
  background-color: var(--bs-primary); /* Use primary color for unread dot */
  border-radius: 50%;
  position: absolute;
  top: 15px;
  right: 15px;
}

/* Dark Mode Overrides */
body.theme-dark .updates-container {
  background-color: var(--page-bg-dark);
  color: var(--text-color-dark);
}

body.theme-dark .updates-list-card {
  background-color: var(--card-bg-dark);
  border-color: var(--border-color-dark) !important;
  box-shadow: 0 4px 15px var(--shadow-color-dark);
}

body.theme-dark .list-group-item {
  background-color: transparent;
  border-color: var(--border-color-dark);
  color: var(--text-color-dark);
}

body.theme-dark .list-group-item:hover {
  background-color: rgba(255, 255, 255, 0.05);
}

body.theme-dark .update-unread {
  background-color: rgba(var(--bs-primary-rgb), 0.1); /* Primary with transparency */
}

body.theme-dark .update-unread:hover {
  background-color: rgba(var(--bs-primary-rgb), 0.2) !important;
}

body.theme-dark .update-title {
  color: var(--text-color-dark);
}

body.theme-dark .update-message,
body.theme-dark .update-time {
  color: var(--muted-text-color-dark) !important;
}

body.theme-dark .text-primary { color: var(--bs-primary-light) !important; }
body.theme-dark .text-success { color: var(--bs-success-light) !important; }
body.theme-dark .text-danger { color: var(--bs-danger-light) !important; }
body.theme-dark .text-info { color: var(--bs-info-light) !important; }
body.theme-dark .text-warning { color: var(--bs-warning-light) !important; }
body.theme-dark .text-secondary { color: var(--bs-secondary-light) !important; }

body.theme-dark .unread-dot {
  background-color: var(--bs-primary-light);
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