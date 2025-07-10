<template>
  <div class="coming-soon-container d-flex flex-column justify-content-center align-items-center min-vh-100 p-3">
    <div class="coming-soon-card p-4 p-md-5 text-center shadow-lg rounded-4 animate__animated animate__fadeInUp">
      <div class="icon-header mb-4">
        <i class="bi bi-question-circle-fill display-2 text-primary animate__animated animate__pulse animate__infinite"></i>
      </div>

      <h1 class="coming-soon-title fw-bold text-dark-emphasis mb-3 animate__animated animate__fadeIn">Help & Support</h1>
      <p class="text-muted lead mb-4 animate__animated animate__fadeIn animate__delay-1s">
        We're working hard to bring you a comprehensive help and support center.
        It will be your one-stop shop for FAQs, guides, and direct assistance.
      </p>

      <div class="notify-section p-3 p-md-4 rounded-3 mb-4 animate__animated animate__fadeInUp animate__delay-2s">
        <h3 class="mb-3 fw-semibold text-primary-emphasis">Be the First to Know!</h3>
        <p class="text-muted mb-3">Enter your email and we'll notify you as soon as it's ready.</p>
        <form @submit.prevent="subscribeForNotifications" class="d-flex flex-column flex-sm-row gap-3 justify-content-center">
          <div class="input-group flex-grow-1">
            <span class="input-group-text"><i class="bi bi-envelope"></i></span>
            <input
              v-model="email"
              type="email"
              class="form-control form-control-lg"
              placeholder="Your email address"
              aria-label="Your email address"
              required
              :class="{ 'is-invalid': emailError }"
              @input="emailError = ''"
            />
            <div class="invalid-feedback" v-if="emailError">
              {{ emailError }}
            </div>
          </div>
          <button type="submit" class="btn btn-primary btn-lg flex-shrink-0 animate__animated animate__pulse" :disabled="loading">
            <span v-if="!loading"><i class="bi bi-bell-fill me-2"></i> Notify Me</span>
            <span v-else class="spinner-border spinner-border-sm" role="status" aria-hidden="true"></span>
            <span v-if="loading" class="ms-2">Subscribing...</span>
          </button>
        </form>
        <div v-if="successMessage" class="alert alert-success mt-3 animate__animated animate__fadeIn" role="alert">
          <i class="bi bi-check-circle-fill me-2"></i> {{ successMessage }}
        </div>
        <div v-if="errorMessage" class="alert alert-danger mt-3 animate__animated animate__shakeX" role="alert">
          <i class="bi bi-exclamation-triangle-fill me-2"></i> {{ errorMessage }}
        </div>
      </div>

      <button @click="goToDashboard" class="btn btn-outline-secondary btn-lg animate__animated animate__fadeInUp animate__delay-3s">
        <i class="bi bi-arrow-left me-2"></i> Back to Dashboard
      </button>
    </div>
  </div>
</template>

<script>
export default {
  name: 'HelpSupportComingSoon',
  data() {
    return {
      email: '',
      loading: false,
      successMessage: '',
      errorMessage: '',
      emailError: ''
    };
  },
  methods: {
    /**
     * Validates email format using a simple regex.
     * @param {string} email - The email string to validate.
     * @returns {boolean} True if email is valid, false otherwise.
     */
    isValidEmail(email) {
      const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
      return emailRegex.test(email);
    },

    /**
     * Handles the subscription for notifications.
     * Simulates an API call to register the user's email for updates.
     */
    async subscribeForNotifications() {
      this.successMessage = '';
      this.errorMessage = '';
      this.emailError = '';

      if (!this.email) {
        this.emailError = 'Email address cannot be empty.';
        return;
      }
      if (!this.isValidEmail(this.email)) {
        this.emailError = 'Please enter a valid email address.';
        return;
      }

      this.loading = true; // Show loading spinner

      // --- Simulate API Call ---
      // In a real application, you would replace this with an actual fetch or axios call
      // to your backend endpoint (e.g., POST to /api/subscribe-newsletter)
      try {
        console.log(`Attempting to subscribe email: ${this.email}`);
        // Example: const response = await fetch('YOUR_API_ENDPOINT_HERE', { /* ... */ });
        await new Promise(resolve => setTimeout(resolve, 1500)); // Simulate network delay

        // Simulate success or failure
        const success = Math.random() > 0.2; // 80% success rate for demo
        if (success) {
          this.successMessage = `Thanks! We'll notify ${this.email} when Help & Support is live.`;
          this.email = ''; // Clear input on success
        } else {
          this.errorMessage = 'Oops! Something went wrong. Please try again later.';
        }
      } catch (err) {
        console.error('Subscription error:', err);
        this.errorMessage = 'A network error occurred. Please try again.';
      } finally {
        this.loading = false; // Hide loading spinner
      }
    },

    /**
     * Navigates the user back to the dashboard or home page.
     */
    goToDashboard() {
      if (this.$router) {
        this.$router.push('/'); // Adjust this route if your dashboard is elsewhere
      } else {
        alert("Vue Router is not configured or '/' route is missing.");
      }
    }
  }
};
</script>

<style scoped>
/*
 * General Layout & Container
 */
.coming-soon-container {
  background: linear-gradient(135deg, var(--bs-primary-bg-subtle) 0%, var(--bs-info-bg-subtle) 100%);
  /* A fresh, vibrant gradient background */
  padding: 1.5rem; /* Ensure some padding on very small screens */
  overflow: hidden; /* Prevent horizontal scroll from animations */
}

.coming-soon-card {
  background-color: var(--bs-white);
  border-radius: 1.75rem; /* Even more rounded corners for ultra-modern feel */
  max-width: 600px; /* Wider card for content */
  width: 100%;
  box-shadow: 0 1.5rem 4rem rgba(0, 0, 0, 0.18) !important; /* Stronger, deeper shadow */
  border: none; /* Remove default card border */
  padding: 3.5rem; /* Generous padding inside the card */
  position: relative;
  z-index: 1; /* Ensure card is above background details */
}

/*
 * Icon Header
 */
.icon-header {
  line-height: 1; /* Adjust line height for icons */
}

.icon-header i {
  display: inline-block; /* For transform properties */
}

/* Pulsing animation for the icon */
@keyframes pulse {
  0% { transform: scale(0.9); opacity: 0.8; }
  50% { transform: scale(1); opacity: 1; }
  100% { transform: scale(0.9); opacity: 0.8; }
}

.icon-header .animate__pulse {
  animation-duration: 2.5s;
  animation-iteration-count: infinite;
}

/*
 * Typography
 */
.coming-soon-title {
  font-size: 2.8rem; /* Large, bold title */
  margin-bottom: 0.75rem !important;
}

.lead {
  font-size: 1.15rem; /* Slightly larger lead paragraph */
}

/*
 * Notify Section
 */
.notify-section {
  background-color: var(--bs-light); /* Slightly off-white background */
  border: 1px solid var(--bs-border-color-translucent);
  box-shadow: inset 0 0.25rem 0.75rem rgba(0, 0, 0, 0.03); /* Inner shadow for depth */
}

.notify-section h3 {
  color: var(--bs-primary); /* Primary color for the "Notify Me" heading */
  font-size: 1.6rem;
}

/* Form inputs & buttons */
.form-control-lg {
  padding: 0.85rem 1.25rem; /* Larger input fields */
  font-size: 1.1rem;
  border-radius: 0.75rem; /* Rounded input fields */
  border-color: var(--bs-border-color-translucent);
}

.form-control-lg:focus {
  border-color: var(--bs-primary);
  box-shadow: 0 0 0 0.25rem rgba(var(--bs-primary-rgb), 0.25);
}

.input-group-text {
  background-color: var(--bs-white); /* White background for icons */
  border-color: var(--bs-border-color-translucent);
  border-right: none;
  padding: 0.85rem 1rem;
  border-top-left-radius: 0.75rem;
  border-bottom-left-radius: 0.75rem;
  color: var(--bs-secondary);
}

.input-group .form-control {
  border-left: none;
}

.btn-lg {
  font-weight: 600;
  letter-spacing: 0.03em;
  border-radius: 0.75rem;
  padding: 0.85rem 1.5rem;
  transition: all 0.3s ease;
  min-width: 150px; /* Ensure button has decent width */
}

.btn-primary {
  background-color: var(--bs-primary);
  border-color: var(--bs-primary);
  box-shadow: 0 4px 12px rgba(var(--bs-primary-rgb), 0.2);
}

.btn-primary:hover:not(:disabled) {
  transform: translateY(-3px);
  box-shadow: 0 6px 15px rgba(var(--bs-primary-rgb), 0.35);
}

/* Alerts for messages */
.alert-success,
.alert-danger {
  border-radius: 0.75rem;
  font-size: 0.95rem;
  padding: 0.75rem 1.25rem;
  display: flex;
  align-items: center;
}

.alert-success {
  border-left: 5px solid var(--bs-success);
  background-color: var(--bs-success-bg-subtle);
  color: var(--bs-success-text-emphasis);
  border-color: var(--bs-success-border-subtle);
}

.alert-danger {
  border-left: 5px solid var(--bs-danger);
  background-color: var(--bs-danger-bg-subtle);
  color: var(--bs-danger-text-emphasis);
  border-color: var(--bs-danger-border-subtle);
}

/* Back to Dashboard Button */
.btn-outline-secondary {
  border-color: var(--bs-border-color);
  color: var(--bs-secondary);
  font-weight: 500;
}

.btn-outline-secondary:hover {
  color: var(--bs-primary);
  border-color: var(--bs-primary);
  box-shadow: 0 4px 8px rgba(var(--bs-primary-rgb), 0.1);
}

/*
 * Responsive Adjustments
 */
@media (max-width: 767.98px) {
  .coming-soon-card {
    padding: 2.5rem;
    border-radius: 1.5rem;
  }
  .coming-soon-title {
    font-size: 2.2rem;
  }
  .lead {
    font-size: 1rem;
  }
  .notify-section h3 {
    font-size: 1.4rem;
  }
  .notify-section form {
    flex-direction: column; /* Stack input and button vertically */
  }
  .btn-lg {
    width: 100%; /* Full width button */
    min-width: unset;
  }
}

@media (max-width: 575.98px) {
  .coming-soon-card {
    padding: 2rem;
    border-radius: 1.25rem;
  }
  .coming-soon-title {
    font-size: 1.8rem;
  }
  .icon-header i {
    font-size: 3.5rem;
  }
}

/*
 * Dark Mode Compatibility (Requires body.theme-dark class)
 */
body.theme-dark .coming-soon-container {
  background: linear-gradient(135deg, #1f2a3a 0%, #2f3a4b 100%); /* Darker gradient */
}

body.theme-dark .coming-soon-card {
  background-color: #2a2a2a;
  box-shadow: 0 1.5rem 4rem rgba(0, 0, 0, 0.4) !important;
  color: #e0e0e0;
}

body.theme-dark .text-dark-emphasis {
  color: #f8f9fa !important;
}

body.theme-dark .text-muted {
  color: #b0b0b0 !important;
}

body.theme-dark .notify-section {
  background-color: #333;
  border-color: #444;
}

body.theme-dark .notify-section h3 {
  color: var(--bs-primary-light); /* Lighter primary for dark mode */
}

body.theme-dark .form-control-lg {
  background-color: #3a3a3a;
  border-color: #555;
  color: #e0e0e0;
}

body.theme-dark .form-control-lg::placeholder {
  color: #999;
}

body.theme-dark .input-group-text {
  background-color: #3a3a3a;
  border-color: #555;
  color: #b0b0b0;
}

body.theme-dark .btn-primary {
  background-color: var(--bs-primary-dark); /* Darker primary for dark mode button */
  border-color: var(--bs-primary-dark);
}

body.theme-dark .btn-primary:hover:not(:disabled) {
  box-shadow: 0 6px 15px rgba(var(--bs-primary-dark-rgb, 106, 110, 224), 0.35);
}

body.theme-dark .btn-outline-secondary {
  border-color: #555;
  color: #b0b0b0;
}

body.theme-dark .btn-outline-secondary:hover {
  color: var(--bs-primary-light);
  border-color: var(--bs-primary-light);
}

body.theme-dark .alert-success {
  background-color: #2d423a;
  border-color: #4f7d6a;
  color: #a0e0c0;
}

body.theme-dark .alert-danger {
  background-color: #3a2e2e;
  border-color: #6a3e3e;
  color: #ff9999;
}
</style>