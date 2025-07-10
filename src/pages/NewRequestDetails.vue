<template>
  <div class="new-request-details-container py-5 bg-light min-vh-100">
    <div class="container">
      <div class="d-flex align-items-center mb-4">
        <button @click="goBack" class="btn btn-outline-secondary rounded-pill me-3">
          <i class="bi bi-arrow-left me-2"></i> Back
        </button>
        <h2 class="mb-0 fw-bold text-primary">Delivery Request Details</h2>
      </div>

      <transition name="toast-fade-slide">
        <div v-if="toast.show" :class="['custom-toast', `toast-${toast.type}`, 'animate__animated', toast.animationClass]" role="alert">
          <div class="d-flex align-items-center">
            <i :class="['bi', toast.icon, 'me-2', 'toast-icon']"></i>
            <span class="toast-message">{{ toast.message }}</span>
          </div>
          <button type="button" class="toast-close-btn" @click="hideToast" aria-label="Close">
            <i class="bi bi-x-lg"></i>
          </button>
        </div>
      </transition>

      <div v-if="loading" class="text-center py-5">
        <div class="spinner-border text-primary" role="status">
          <span class="visually-hidden">Loading...</span>
        </div>
        <p class="mt-3 text-muted">Fetching request details...</p>
      </div>

      <div v-else-if="!id" class="text-center py-5">
        <i class="bi bi-exclamation-circle-fill text-warning fs-1 mb-3"></i>
        <h3 class="text-dark">Missing Request ID</h3>
        <p class="text-muted">No delivery request ID was provided. Please navigate from a valid requests list or ensure the URL is correct.</p>
        <router-link to="/view-requests" class="btn btn-primary mt-3">View All Requests</router-link>
      </div>

      <div v-else-if="!request" class="text-center py-5">
        <i class="bi bi-x-circle-fill text-danger fs-1 mb-3"></i>
        <h3 class="text-dark">Request Not Found</h3>
        <p class="text-muted">The delivery request with ID "<span class="fw-bold">{{ id }}</span>" could not be found. It might be invalid, completed, or no longer available.</p>
        <router-link to="/view-requests" class="btn btn-primary mt-3">View All Requests</router-link>
      </div>

      <div v-else class="row">
        <div class="col-lg-8 mb-4">
          <div class="card shadow-sm border-0 rounded-4 mb-4">
            <div class="card-body p-4">
              <div class="d-flex align-items-center mb-3">
                <i class="bi bi-box-seam fs-3 text-primary me-3"></i>
                <div>
                  <h4 class="card-title mb-1 fw-bold">{{ request.packageType }} Delivery</h4>
                  <p class="card-subtitle text-muted">{{ request.id }} - <span :class="['badge', getStatusBadgeClass(request.status)]">{{ request.status }}</span></p>
                </div>
              </div>

              <hr class="my-3">

              <div class="row g-3 mb-4">
                <div class="col-md-6">
                  <h6 class="fw-semibold text-muted mb-2">
                    <i class="bi bi-geo-alt-fill me-2 text-success"></i>Pickup Location
                  </h6>
                  <p class="mb-0">{{ request.pickupLocation }}</p>
                  <small class="text-muted">{{ request.pickupTime }}</small>
                </div>
                <div class="col-md-6">
                  <h6 class="fw-semibold text-muted mb-2">
                    <i class="bi bi-geo-alt-fill me-2 text-danger"></i>Delivery Location
                  </h6>
                  <p class="mb-0">{{ request.deliveryLocation }}</p>
                  <small class="text-muted">{{ request.deliveryTime }}</small>
                </div>
              </div>

              <div class="row g-3 mb-4">
                <div class="col-md-6">
                  <h6 class="fw-semibold text-muted mb-2">
                    <i class="bi bi-calendar-check me-2 text-info"></i>Delivery Window
                  </h6>
                  <p class="mb-0">{{ request.deliveryWindow }}</p>
                </div>
                <div class="col-md-6">
                  <h6 class="fw-semibold text-muted mb-2">
                    <i class="bi bi-currency-dollar me-2 text-warning"></i>Offered Price
                  </h6>
                  <p class="mb-0 fs-5 fw-bold text-success">{{ request.offeredPrice }}</p>
                </div>
              </div>

              <h6 class="fw-semibold text-muted mb-2">
                <i class="bi bi-box me-2 text-secondary"></i>Package Details
              </h6>
              <p class="mb-0">{{ request.packageDetails }}</p>

            </div>
          </div>

          <div class="card shadow-sm border-0 rounded-4">
            <div class="card-body p-4">
              <h5 class="card-title fw-bold mb-3">
                <i class="bi bi-person-fill me-2 text-primary"></i>Sender Information
              </h5>
              <div class="d-flex align-items-center mb-3">
                <img :src="request.sender.avatar" class="rounded-circle me-3 sender-avatar" alt="Sender Avatar">
                <div>
                  <h6 class="mb-0 fw-semibold">{{ request.sender.name }}</h6>
                  <span class="text-muted small">Member since {{ request.sender.memberSince }}</span>
                </div>
              </div>
              <p class="mb-2"><i class="bi bi-star-fill text-warning me-1"></i> {{ request.sender.rating }} ({{ request.sender.reviews }} Reviews)</p>
              <p class="mb-0"><i class="bi bi-phone-fill me-1 text-info"></i> {{ request.sender.phone }}</p>
              <p class="mb-0"><i class="bi bi-envelope-fill me-1 text-info"></i> {{ request.sender.email }}</p>
              <hr class="my-3">
              <button class="btn btn-outline-primary w-100 rounded-pill" @click="contactSender">
                <i class="bi bi-chat-dots me-2"></i> Contact Sender
              </button>
            </div>
          </div>
        </div>

        <div class="col-lg-4">
          <div class="card shadow-sm border-0 rounded-4 mb-4 sticky-top-card">
            <div class="card-body p-4 text-center">
              <h5 class="card-title fw-bold mb-3">Actions</h5>
              <p class="text-muted small mb-4">You have 2 hours left to respond to this request.</p>
              <div class="d-grid gap-3">
                <button class="btn btn-success btn-lg rounded-pill" @click="acceptRequest" :disabled="request.status !== 'New'">
                  <i class="bi bi-check-circle me-2"></i> Accept Request
                </button>
                <button class="btn btn-outline-danger btn-lg rounded-pill" @click="declineRequest" :disabled="request.status !== 'New'">
                  <i class="bi bi-x-circle me-2"></i> Decline Request
                </button>
                <button class="btn btn-outline-secondary rounded-pill" @click="shareRequest">
                  <i class="bi bi-share me-2"></i> Share
                </button>
              </div>
            </div>
          </div>

          <div class="card shadow-sm border-0 rounded-4">
            <div class="card-body p-0">
              <h6 class="text-center py-2 mb-0 fw-bold border-bottom">
                <i class="bi bi-map-fill me-2 text-primary"></i>Route Map
              </h6>
              <InteractiveMap
                v-if="request.coordinates && request.coordinates.pickup && request.coordinates.delivery"
                :pickup-coords="request.coordinates.pickup"
                :delivery-coords="request.coordinates.delivery"
                :user-location-coords="userLocation" />
              <div v-else class="text-center p-3 text-muted">
                  Map coordinates not available for this request.
              </div>
              <div class="p-3 text-center">
                <p class="mb-0 text-muted small">Approx. distance: {{ request.approxDistance || 'N/A' }} km</p>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  </div>
</template>

<script>
import InteractiveMap from '../compo/InteractiveMap.vue';

export default {
  name: 'NewRequestDetails',
  components: {
    InteractiveMap
  },
  props: {
    id: {
      type: String,
      required: true
    }
  },
  data() {
    return {
      request: null,
      loading: true,
      toast: {
        show: false,
        message: '',
        type: 'success', // success, danger, info, warning
        icon: '',
        animationClass: ''
      },
      toastTimeout: null,
      userLocation: null, // <--- CHANGE: Initialize as null, will be updated by geolocation
      // Mock data for requests
      mockRequests: {
        'REQ-1752086836594': {
          id: 'REQ-1752086836594',
          packageType: 'Small Parcel',
          status: 'New',
          pickupLocation: '123 MG Road, Begumpet, Hyderabad',
          pickupTime: 'Today, 10:00 AM - 11:00 AM',
          deliveryLocation: '456 Jubilee Hills Road, Hyderabad',
          deliveryTime: 'Today, 02:00 PM - 03:00 PM',
          deliveryWindow: 'Within 4 hours',
          offeredPrice: '₹ 250.00',
          packageDetails: 'Documents in an A4 envelope. Needs careful handling. Weight: approx 0.5 kg. Dimensions: 25x35x2 cm.',
          approxDistance: 15,
          sender: {
            name: 'Priya Sharma',
            avatar: 'https://i.pravatar.cc/150?img=32',
            rating: '4.8',
            reviews: 124,
            memberSince: '2023',
            phone: '+91 98765 43210',
            email: 'priya.s@example.com'
          },
          coordinates: {
            pickup: { lat: 17.4399, lng: 78.4475 }, // Begumpet, Hyderabad
            delivery: { lat: 17.4206, lng: 78.4116 } // Jubilee Hills, Hyderabad
          }
        },
        'REQ-1752086836595': {
          id: 'REQ-1752086836595',
          packageType: 'Medium Box',
          status: 'New',
          pickupLocation: '789 Kothaguda X Roads, Hyderabad',
          pickupTime: 'Tomorrow, 09:00 AM - 10:00 AM',
          deliveryLocation: '101 Gachibowli, Hyderabad',
          deliveryTime: 'Tomorrow, 12:00 PM - 01:00 PM',
          deliveryWindow: 'Same Day',
          offeredPrice: '₹ 400.00',
          packageDetails: 'Electronics components. Fragile. Weight: approx 2 kg. Dimensions: 30x20x15 cm.',
          approxDistance: 10,
          sender: {
            name: 'Ravi Kumar',
            avatar: 'https://i.pravatar.cc/150?img=50',
            rating: '4.5',
            reviews: 78,
            memberSince: '2022',
            phone: '+91 99887 76655',
            email: 'ravi.k@example.com'
          },
          coordinates: {
            pickup: { lat: 17.4526, lng: 78.3752 }, // Kothaguda, Hyderabad
            delivery: { lat: 17.4422, lng: 78.3458 } // Gachibowli, Hyderabad
          }
        },
        'REQ-COMPLETED-1': {
            id: 'REQ-COMPLETED-1',
            packageType: 'Large Furniture',
            status: 'Completed',
            pickupLocation: 'Secunderabad',
            pickupTime: 'Yesterday, 03:00 PM',
            deliveryLocation: 'Kukatpally',
            deliveryTime: 'Yesterday, 06:00 PM',
            deliveryWindow: 'Fixed Time',
            offeredPrice: '₹ 800.00',
            packageDetails: 'One wooden table, non-dismantlable. Needs two people for loading/unloading.',
            approxDistance: 20,
            sender: {
                name: 'Anjali Reddy',
                avatar: 'https://i.pravatar.cc/150?img=40',
                rating: '4.9',
                reviews: 200,
                memberSince: '2021',
                phone: '+91 91234 56789',
                email: 'anjali.r@example.com'
            },
            coordinates: {} // No specific coordinates, so map will show default message
        },
        'REQ-ERROR-SIM': {
            error: true,
            message: "Failed to fetch data for this request ID due to server issues."
        }
      }
    };
  },
  created() {
    this.fetchRequestDetails();
    this.getUserLiveLocation(); // <--- ADD THIS: Call geolocation on component creation
  },
  watch: {
    id: 'fetchRequestDetails',
    request(newVal) {
      if (newVal) {
        document.title = `Request: ${newVal.id} - ${newVal.packageType}`;
      } else if (!this.loading && this.id) {
        document.title = `Request Not Found - ${this.id}`;
      } else {
        document.title = 'Delivery Request Details';
      }
    }
  },
  beforeUnmount() {
    if (this.toastTimeout) {
      clearTimeout(this.toastTimeout);
    }
  },
  methods: {
    fetchRequestDetails() {
      if (!this.id || this.id.trim() === '') {
        this.loading = false;
        this.request = null;
        document.title = 'Missing Request ID';
        return;
      }

      this.loading = true;
      this.request = null;
      
      setTimeout(() => {
        const data = this.mockRequests[this.id];
        if (data && !data.error) {
          this.request = data;
        } else if (data && data.error) {
            this.request = null;
            this.showToast('danger', 'bi-exclamation-triangle-fill', data.message || "An unexpected error occurred while fetching this request.", 'animate__shakeX');
            document.title = 'Error Fetching Request';
        }
        this.loading = false;
      }, 1000);
    },
    // <--- ADD THIS NEW METHOD for Geolocation
    getUserLiveLocation() {
      if ("geolocation" in navigator) {
        navigator.geolocation.getCurrentPosition(
          (position) => {
            this.userLocation = {
              lat: position.coords.latitude,
              lng: position.coords.longitude
            };
            this.showToast('success', 'bi-geo-alt-fill', 'Your current location has been loaded on the map.');
          },
          (error) => {
            console.error('Error getting user location:', error);
            let errorMessage = 'Could not get your current location.';
            if (error.code === error.PERMISSION_DENIED) {
              errorMessage = 'Location access denied. Please enable location services in your browser settings to see your position on the map.';
            } else if (error.code === error.POSITION_UNAVAILABLE) {
              errorMessage = 'Location information is unavailable.';
            } else if (error.code === error.TIMEOUT) {
              errorMessage = 'The request to get user location timed out.';
            }
            this.showToast('warning', 'bi-geo-alt-fill', errorMessage, 'animate__shakeX');
            this.userLocation = null; // Ensure null if access is denied or error
          },
          { 
            enableHighAccuracy: true, // Request most precise location
            timeout: 10000,          // Wait up to 10 seconds for a location
            maximumAge: 0            // Don't use a cached position
          }
        );
      } else {
        this.showToast('info', 'bi-info-circle-fill', 'Geolocation is not supported by your browser.', 'animate__shakeX');
        this.userLocation = null;
      }
    },
    // ... existing methods ...
    goBack() {
      this.$router.go(-1);
    },
    acceptRequest() {
      if (this.request && this.request.status === 'New') {
        this.request.status = 'Accepted';
        this.showToast('success', 'bi-check-circle-fill', 'Request Accepted Successfully!');
        setTimeout(() => this.$router.push('/dashboard'), 2000);
      } else {
         this.showToast('info', 'bi-info-circle-fill', 'This request cannot be accepted at this time.');
      }
    },
    declineRequest() {
      if (this.request && this.request.status === 'New') {
        this.request.status = 'Declined';
        this.showToast('danger', 'bi-x-octagon-fill', 'Request Declined.');
        setTimeout(() => this.$router.push('/dashboard'), 2000);
      } else {
          this.showToast('info', 'bi-info-circle-fill', 'This request cannot be declined at this time.');
      }
    },
    contactSender() {
      this.showToast('info', 'bi-chat-dots-fill', `Opening chat with ${this.request.sender.name}...`);
      setTimeout(() => {
        this.$router.push(`/customerchat/support?user=${this.request.sender.name}`);
      }, 1500);
    },
    shareRequest() {
      this.showToast('info', 'bi-share-fill', 'Sharing functionality not implemented yet!');
    },
    getStatusBadgeClass(status) {
      switch (status) {
        case 'New': return 'bg-primary';
        case 'Accepted': return 'bg-success';
        case 'Declined': return 'bg-danger';
        case 'Completed': return 'bg-secondary';
        default: return 'bg-info';
      }
    },
    showToast(type, icon, message, animationClass = 'animate__fadeInDown') {
      if (this.toastTimeout) {
        clearTimeout(this.toastTimeout);
      }
      this.toast = { show: true, type, icon, message, animationClass };
      this.toastTimeout = setTimeout(() => {
        this.hideToast();
      }, 5000);
    },
    hideToast() {
      this.toast.animationClass = 'animate__fadeOutUp';
      setTimeout(() => {
        this.toast.show = false;
        this.toast.message = '';
        this.toast.animationClass = '';
      }, 800);
    }
  }
};
</script>

<style scoped>
/* Base Colors and Variables for Theming */
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

  /* Bootstrap custom shades for dark mode readability */
  --bs-primary-light: #6a9cff;
  --bs-success-light: #82e0aa;
  --bs-danger-light: #ff7f7f;
  --bs-info-light: #80d9ee;
  --bs-warning-light: #ffd700;
  --bs-secondary-light: #a9a9a9;

  /* Custom Toast Colors */
  --toast-success-bg: #d4edda;
  --toast-success-text: #155724;
  --toast-success-border: #c3e6cb;
  --toast-danger-bg: #f8d7da;
  --toast-danger-text: #721c24;
  --toast-danger-border: #f5c6cb;
  --toast-info-bg: #d1ecf1;
  --toast-info-text: #0c5460;
  --toast-info-border: #bee5eb;
  --toast-warning-bg: #fff3cd;
  --toast-warning-text: #856404;
  --toast-warning-border: #ffeeba;

  /* Dark mode toast colors */
  --toast-success-bg-dark: #28a74550; /* Primary with transparency */
  --toast-success-text-dark: #82e0aa;
  --toast-danger-bg-dark: #dc354550;
  --toast-danger-text-dark: #ff7f7f;
  --toast-info-bg-dark: #17a2b850;
  --toast-info-text-dark: #80d9ee;
  --toast-warning-bg-dark: #ffc10750;
  --toast-warning-text-dark: #ffd700;
}

/* Light Mode Defaults */
.new-request-details-container {
  background-color: var(--page-bg-light);
  color: var(--text-color-light);
}

.card {
  background-color: var(--card-bg-light);
  border-color: var(--border-color-light) !important;
  box-shadow: 0 4px 15px var(--shadow-color-light);
}

.text-muted {
  color: var(--muted-text-color-light) !important;
}

/* Dark Mode Overrides (Assumes a 'theme-dark' class on body or a parent element) */
body.theme-dark .new-request-details-container {
  background-color: var(--page-bg-dark);
  color: var(--text-color-dark);
}

body.theme-dark .card {
  background-color: var(--card-bg-dark);
  border-color: var(--border-color-dark) !important;
  box-shadow: 0 4px 15px var(--shadow-color-dark);
}

body.theme-dark .text-dark {
  color: var(--text-color-dark) !important;
}

body.theme-dark .text-muted {
  color: var(--muted-text-color-dark) !important;
}

body.theme-dark .btn-outline-secondary {
  color: var(--muted-text-color-dark);
  border-color: var(--muted-text-color-dark);
}

body.theme-dark .btn-outline-secondary:hover {
  background-color: var(--muted-text-color-dark);
  color: var(--page-bg-dark);
}

body.theme-dark hr {
  border-top-color: var(--border-color-dark);
}

/* Badge colors for dark mode */
body.theme-dark .badge.bg-primary { background-color: var(--bs-primary-light) !important; color: var(--text-color-dark) !important; }
body.theme-dark .badge.bg-success { background-color: var(--bs-success-light) !important; color: var(--text-color-dark) !important; }
body.theme-dark .badge.bg-danger { background-color: var(--bs-danger-light) !important; color: var(--text-color-dark) !important; }
body.theme-dark .badge.bg-info { background-color: var(--bs-info-light) !important; color: var(--text-color-dark) !important; }
body.theme-dark .badge.bg-warning { background-color: var(--bs-warning-light) !important; color: var(--text-color-dark) !important; }
body.theme-dark .badge.bg-secondary { background-color: var(--bs-secondary-light) !important; color: var(--text-color-dark) !important; }


/* Buttons for dark mode */
body.theme-dark .btn-outline-primary {
  color: var(--bs-primary-light);
  border-color: var(--bs-primary-light);
}
body.theme-dark .btn-outline-primary:hover {
  background-color: var(--bs-primary-light);
  color: var(--page-bg-dark);
}

body.theme-dark .btn-outline-danger {
  color: var(--bs-danger-light);
  border-color: var(--bs-danger-light);
}
body.theme-dark .btn-outline-danger:hover {
  background-color: var(--bs-danger-light);
  color: var(--page-bg-dark);
}

body.theme-dark .btn-success {
  background-color: var(--bs-success-light) !important;
  border-color: var(--bs-success-light) !important;
  color: var(--text-color-dark) !important;
}
body.theme-dark .btn-success:hover {
  background-color: #72cf9a !important; /* Slightly darker hover */
  border-color: #72cf9a !important;
}


/* Specific Component Styles */
.sender-avatar {
  width: 60px;
  height: 60px;
  object-fit: cover;
  border: 3px solid var(--bs-primary);
}

/* Map specific adjustments */
.card-body.p-0 {
    position: relative; /* Needed for map to render properly within card */
}


.sticky-top-card {
  top: 20px; /* Adjust as needed for spacing from header */
  position: sticky;
  z-index: 1; /* Ensure it's above other content when scrolled */
}

/* Custom Toast Notification Styles */
.custom-toast {
  position: fixed;
  top: 20px;
  right: 20px;
  padding: 1rem 1.5rem;
  border-radius: 8px;
  display: flex;
  align-items: center;
  justify-content: space-between;
  gap: 15px;
  box-shadow: 0 4px 12px rgba(0, 0, 0, 0.2);
  z-index: 1080; /* Higher than Bootstrap modals/offcanvas */
  min-width: 280px;
  max-width: 400px;
  color: #fff; /* Default text color for toasts */
  font-weight: 500;
  border: 1px solid transparent;
}

.toast-success {
  background-color: var(--toast-success-bg);
  color: var(--toast-success-text);
  border-color: var(--toast-success-border);
}
body.theme-dark .toast-success {
  background-color: var(--toast-success-bg-dark);
  color: var(--toast-success-text-dark);
}

.toast-danger {
  background-color: var(--toast-danger-bg);
  color: var(--toast-danger-text);
  border-color: var(--toast-danger-border);
}
body.theme-dark .toast-danger {
  background-color: var(--toast-danger-bg-dark);
  color: var(--toast-danger-text-dark);
}

.toast-info {
  background-color: var(--toast-info-bg);
  color: var(--toast-info-text);
  border-color: var(--toast-info-border);
}
body.theme-dark .toast-info {
  background-color: var(--toast-info-bg-dark);
  color: var(--toast-info-text-dark);
}

.toast-warning {
  background-color: var(--toast-warning-bg);
  color: var(--toast-warning-text);
  border-color: var(--toast-warning-border);
}
body.theme-dark .toast-warning {
  background-color: var(--toast-warning-bg-dark);
  color: var(--toast-warning-text-dark);
}


.toast-icon {
  font-size: 1.2rem;
  margin-right: 0.5rem;
  flex-shrink: 0;
}

.toast-message {
  flex-grow: 1;
}

.toast-close-btn {
  background: none;
  border: none;
  color: inherit; /* Inherit color from parent toast */
  font-size: 1.1rem;
  cursor: pointer;
  padding: 0;
  margin-left: 10px;
  opacity: 0.7;
  transition: opacity 0.2s ease;
}

.toast-close-btn:hover {
  opacity: 1;
}

/* Animate.css integration (make sure you link Animate.css in public/index.html or import it) */
/* If you want manual Vue transitions, uncomment the block below and remove animate.css classes from template */
/*
.toast-fade-slide-enter-active, .toast-fade-slide-leave-active {
  transition: opacity 0.5s ease, transform 0.5s ease;
}
.toast-fade-slide-enter-from, .toast-fade-slide-leave-to {
  opacity: 0;
  transform: translateY(-20px) translateX(20px);
}
*/

/* Responsive adjustments */
@media (max-width: 768px) {
  .sticky-top-card {
    position: static; /* Disable sticky on smaller screens */
    margin-top: 20px;
  }
  .custom-toast {
    top: 10px;
    right: 10px;
    left: 10px; /* Make it full width with padding */
    min-width: unset;
    max-width: unset;
    padding: 0.8rem 1rem;
  }
}
</style>