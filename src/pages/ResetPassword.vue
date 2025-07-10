<template>
  <div class="forgot-password-container d-flex justify-content-center align-items-center min-vh-100">
    <div class="forgot-password-card p-4 p-md-5 shadow-lg rounded-4 animate__animated animate__fadeInDown">
      <h2 class="text-center mb-4 forgot-password-title fw-bold">Forgot Your Password?</h2>
      <p class="text-center text-muted mb-4">Enter your email address below and we'll send you a link to reset your password.</p>

      <form @submit.prevent="reset" class="needs-validation" novalidate>
        <div class="mb-4">
          <label for="emailInput" class="form-label visually-hidden">Email address</label>
          <div class="input-group has-validation">
            <span class="input-group-text"><i class="bi bi-envelope-fill"></i></span>
            <input
              v-model="email"
              type="email"
              class="form-control form-control-lg"
              id="emailInput"
              placeholder="Your email address"
              required
              aria-label="Email address"
              :class="{ 'is-invalid': emailError }"
              @input="emailError = ''"
            />
            <div class="invalid-feedback" v-if="emailError">
              {{ emailError }}
            </div>
          </div>
        </div>

        <button type="submit" class="btn btn-warning btn-lg w-100 reset-btn" :disabled="loading">
          <span v-if="!loading"><i class="bi bi-send-fill me-2"></i> Send Reset Link</span>
          <span v-else class="spinner-border spinner-border-sm" role="status" aria-hidden="true"></span>
          <span v-if="loading" class="ms-2">Sending link...</span>
        </button>
      </form>

      <div v-if="successMessage" class="alert alert-success mt-4 animate__animated animate__fadeIn" role="alert">
        <i class="bi bi-check-circle-fill me-2"></i> {{ successMessage }}
      </div>

      <div v-if="errorMessage" class="alert alert-danger mt-4 animate__animated animate__shakeX" role="alert">
        <i class="bi bi-exclamation-triangle-fill me-2"></i> {{ errorMessage }}
      </div>

      <p class="text-center mt-4 text-muted">
        Remembered your password?
        <router-link to="/login" class="text-primary fw-semibold text-decoration-none back-to-login-link">Back to Login</router-link>
      </p>
    </div>
  </div>
</template>

<script>
export default {
  data() {
    return {
      email: '',
      loading: false,
      successMessage: '',
      errorMessage: '',
      emailError: '' // Specific error for email validation
    };
  },
  methods: {
    /**
     * Validates email format using a simple regex.
     * @param {string} email - The email string to validate.
     * @returns {boolean} True if email is valid, false otherwise.
     */
    isValidEmail(email) {
      // Basic regex for email validation
      const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
      return emailRegex.test(email);
    },

    /**
     * Handles the password reset request.
     * Sends the email to the backend to initiate the reset process.
     */
    async reset() {
      this.successMessage = '';
      this.errorMessage = '';
      this.emailError = '';

      // Client-side validation
      if (!this.email) {
        this.emailError = 'Email address is required.';
        return;
      }
      if (!this.isValidEmail(this.email)) {
        this.emailError = 'Please enter a valid email address.';
        return;
      }

      this.loading = true; // Show loading spinner
      const baseUrl = import.meta.env.VITE_API_BASE_URL; // Ensure this is correctly configured in your .env

      try {
        // Assume your backend has an endpoint like /forgot-password
        const res = await fetch(`${baseUrl}forgot-password`, {
          method: 'POST',
          headers: {
            'Content-Type': 'application/json',
          },
          body: JSON.stringify({ email: this.email }),
        });

        const data = await res.json(); // Always parse response, even for errors

        if (!res.ok) {
          // Handle specific backend errors (e.g., email not found)
          this.errorMessage = data.error || 'Failed to send reset link. Please try again.';
          console.error('Forgot password API error:', data.error);
        } else {
          this.successMessage = data.message || `Password reset link sent to ${this.email}. Please check your inbox.`;
          this.email = ''; // Clear the input field on success
          
          // Optional: Redirect to login after a few seconds
          setTimeout(() => {
            if (this.$router) {
              this.$router.push('/login');
            }
          }, 5000); // Redirect after 5 seconds
        }
      } catch (err) {
        console.error('Network or fetch error:', err);
        this.errorMessage = 'A network error occurred. Please check your internet connection and try again.';
      } finally {
        this.loading = false; // Hide loading spinner
      }
    }
  }
};
</script>

<style scoped>
/*
 * General Layout & Container
 */
.forgot-password-container {
  background: linear-gradient(135deg, var(--bs-warning-bg-subtle) 0%, var(--bs-light) 100%);
  /* A fresh gradient background, using warning color for a distinct feel */
  padding: 1.5rem; /* Ensure some padding on very small screens */
}

.forgot-password-card {
  background-color: var(--bs-white);
  border-radius: 1.5rem; /* More rounded corners */
  max-width: 480px; /* Max width for the form */
  width: 100%;
  box-shadow: 0 1rem 3rem rgba(0, 0, 0, 0.15) !important; /* Stronger, modern shadow */
  border: none; /* Remove default card border */
  padding: 3rem; /* Generous padding inside the card */
}

/*
 * Typography
 */
.forgot-password-title {
  color: var(--bs-warning); /* Use warning brand color for title */
  font-size: 2.2rem; /* Larger, more prominent title */
}

.forgot-password-card p {
  color: var(--bs-secondary-emphasis); /* Slightly darker muted text */
}

/*
 * Form Elements
 */
.form-control-lg {
  padding: 0.85rem 1.25rem; /* Larger input fields */
  font-size: 1.1rem;
  border-radius: 0.75rem; /* Rounded input fields */
  border-color: var(--bs-border-color-translucent); /* Softer border color */
}

.form-control-lg:focus {
  border-color: var(--bs-warning); /* Focus color matching the theme */
  box-shadow: 0 0 0 0.25rem rgba(var(--bs-warning-rgb), 0.25);
}

.input-group-text {
  background-color: var(--bs-light); /* Light background for icons */
  border-color: var(--bs-border-color-translucent);
  border-right: none; /* No border between icon and input */
  padding: 0.85rem 1rem; /* Match input padding */
  border-top-left-radius: 0.75rem;
  border-bottom-left-radius: 0.75rem;
  color: var(--bs-secondary); /* Muted icon color */
}

.input-group .form-control {
  border-left: none; /* No border between input and icon */
}

/* Invalid feedback styling */
.form-control.is-invalid + .invalid-feedback {
  display: block; /* Ensure invalid feedback is shown */
  font-size: 0.875em;
  color: var(--bs-danger);
}


/*
 * Reset Button
 */
.reset-btn {
  font-weight: 600;
  letter-spacing: 0.03em;
  border-radius: 0.75rem; /* Rounded button */
  padding: 0.85rem 1.5rem; /* Generous button padding */
  transition: all 0.3s ease; /* Smooth hover effects */
  background-color: var(--bs-warning);
  border-color: var(--bs-warning);
  color: var(--bs-white); /* Ensure text is white on warning background */
}

.reset-btn:hover:not(:disabled) {
  transform: translateY(-2px); /* Slight lift on hover */
  box-shadow: 0 0.5rem 1rem rgba(var(--bs-warning-rgb), 0.3) !important; /* Enhanced shadow on hover */
}

.reset-btn:active {
  transform: translateY(0);
}

.reset-btn:disabled {
  opacity: 0.7;
  cursor: not-allowed;
}

/*
 * Success/Error Messages (Alerts)
 */
.alert-success,
.alert-danger {
  border-radius: 0.75rem;
  font-size: 0.95rem;
  padding: 0.75rem 1.25rem; /* Consistent padding */
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

/*
 * Back to Login Link
 */
.back-to-login-link {
  font-weight: 600;
}

.back-to-login-link:hover {
  text-decoration: underline !important; /* Underline on hover */
}

/*
 * Responsive Adjustments
 */
@media (max-width: 575.98px) {
  .forgot-password-card {
    padding: 2rem; /* Smaller padding on extra small screens */
    border-radius: 1rem;
  }
  .forgot-password-title {
    font-size: 1.8rem;
  }
  .form-control-lg, .input-group-text {
    padding: 0.75rem 1rem;
    font-size: 1rem;
  }
  .reset-btn {
    padding: 0.75rem 1rem;
    font-size: 1rem;
  }
}

/*
 * Dark Mode Compatibility (Requires body.theme-dark class)
 */
body.theme-dark .forgot-password-container {
  background: linear-gradient(135deg, #3d3420 0%, #2a2a2a 100%); /* Darker warning gradient */
}

body.theme-dark .forgot-password-card {
  background-color: #2a2a2a;
  box-shadow: 0 1rem 3rem rgba(0, 0, 0, 0.4) !important;
  color: #e0e0e0;
}

body.theme-dark .forgot-password-title {
  color: var(--bs-warning-light); /* Assuming a lighter warning for dark mode */
}

body.theme-dark .forgot-password-card p,
body.theme-dark .text-muted {
  color: #b0b0b0 !important;
}

body.theme-dark .form-control-lg {
  background-color: #3a3a3a;
  border-color: #555;
  color: #e0e0e0;
}

body.theme-dark .form-control-lg::placeholder {
  color: #999;
}

body.theme-dark .form-control-lg:focus {
  box-shadow: 0 0 0 0.25rem rgba(var(--bs-warning-rgb), 0.35);
}

body.theme-dark .input-group-text {
  background-color: #3a3a3a;
  border-color: #555;
  color: #b0b0b0;
}

body.theme-dark .reset-btn {
  background-color: var(--bs-warning-dark); /* Darker warning for dark mode button */
  border-color: var(--bs-warning-dark);
}

body.theme-dark .reset-btn:hover:not(:disabled) {
  box-shadow: 0 0.5rem 1rem rgba(var(--bs-warning-dark-rgb, 255, 193, 7), 0.3) !important;
}

body.theme-dark .back-to-login-link {
  color: var(--bs-primary-light) !important; /* Adjust link color for dark mode */
}

body.theme-dark .alert-danger {
  background-color: #3a2e2e;
  border-color: #6a3e3e;
  color: #ff9999;
}

body.theme-dark .alert-success {
  background-color: #2d423a;
  border-color: #4f7d6a;
  color: #a0e0c0;
}
</style>