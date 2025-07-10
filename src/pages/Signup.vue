<template>
  <div class="signup-container d-flex justify-content-center align-items-center min-vh-100">
    <div class="signup-card p-4 p-md-5 shadow-lg rounded-4 animate__animated animate__fadeInDown">
      <h2 class="text-center mb-4 signup-title fw-bold">Join Our Community</h2>
      <p class="text-center text-muted mb-4">Create your account to get started.</p>

      <form @submit.prevent="signup" class="needs-validation" novalidate>
        <div class="mb-3">
          <label for="emailInput" class="form-label visually-hidden">Email address</label>
          <div class="input-group has-validation">
            <span class="input-group-text"><i class="bi bi-envelope-fill"></i></span>
            <input
              v-model="email"
              type="email"
              class="form-control form-control-lg"
              id="emailInput"
              placeholder="Enter your email"
              required
              aria-label="Email address"
            />
            <div class="invalid-feedback">
              Please enter a valid email address.
            </div>
          </div>
        </div>

        <div class="mb-4">
          <label for="passwordInput" class="form-label visually-hidden">Password</label>
          <div class="input-group has-validation">
            <span class="input-group-text"><i class="bi bi-lock-fill"></i></span>
            <input
              v-model="password"
              type="password"
              class="form-control form-control-lg"
              id="passwordInput"
              placeholder="Create a strong password"
              required
              aria-label="Password"
            />
            <div class="invalid-feedback">
              Please create a password.
            </div>
          </div>
        </div>

        <button type="submit" class="btn btn-success btn-lg w-100 signup-btn" :disabled="loading">
          <span v-if="!loading">Sign Up</span>
          <span v-else class="spinner-border spinner-border-sm" role="status" aria-hidden="true"></span>
          <span v-if="loading" class="ms-2">Signing up...</span>
        </button>

        <p class="text-center mt-4 text-muted small terms-policy">
          By signing up, you agree to our
          <a href="#" class="text-primary fw-semibold text-decoration-none">Terms of Service</a> and
          <a href="#" class="text-primary fw-semibold text-decoration-none">Privacy Policy</a>.
        </p>
        <p class="text-center text-muted small no-share-guarantee">
          We will never share your email with anyone else.
        </p>
      </form>

      <div v-if="errorMsg" class="alert alert-danger mt-3 animate__animated animate__shakeX" role="alert">
        {{ errorMsg }}
      </div>

      <div v-if="successMsg" class="alert alert-success mt-3 animate__animated animate__fadeIn" role="alert">
        {{ successMsg }}
      </div>

      <p class="text-center mt-4 text-muted">
        Already have an account?
        <router-link to="/login" class="text-primary fw-semibold text-decoration-none login-link">Login here</router-link>
      </p>
    </div>
  </div>
</template>

<script>
export default {
  data() {
    return {
      email: '',
      password: '',
      errorMsg: '',
      successMsg: '',
      loading: false, // New state for loading indicator
    };
  },
  methods: {
    async signup() {
      this.errorMsg = '';
      this.successMsg = '';
      this.loading = true; // Show loading indicator

      // Basic client-side validation
      if (!this.email || !this.password) {
        this.errorMsg = "Please fill in both email and password.";
        this.loading = false;
        return;
      }

      const baseUrl = import.meta.env.VITE_API_BASE_URL;
      const user = {
        email: this.email,
        password: this.password,
      };

      try {
        const res = await fetch(`${baseUrl}signup`, {
          method: 'POST',
          headers: {
            'Content-Type': 'application/json',
          },
          body: JSON.stringify(user),
        });

        const data = await res.json();
        console.log('Server response:', data);

        if (!res.ok) {
          this.errorMsg = data.error || 'Signup failed';
        } else {
          this.successMsg = 'Signup successful! Redirecting to login...';

          // Redirect after 2 seconds
          setTimeout(() => {
            if (this.$router) {
              this.$router.push('/login');
            } else {
              console.warn("Vue Router not found. Cannot redirect.");
            }
          }, 2000);
        }
      } catch (err) {
        console.error('Fetch error:', err);
        this.errorMsg = 'Network error or server unavailable. Please try again later.';
      } finally {
        this.loading = false; // Hide loading indicator
      }
    },
  },
};
</script>

<style scoped>
/*
 * General Layout & Container
 */
.signup-container {
  background: linear-gradient(135deg, var(--bs-info-bg-subtle) 0%, var(--bs-light) 100%);
  /* A subtle gradient background, using info color for a different feel */
  padding: 1.5rem; /* Ensure some padding on very small screens */
}

.signup-card {
  background-color: var(--bs-white);
  border-radius: 1.5rem; /* More rounded corners */
  max-width: 480px; /* Max width for the signup form */
  width: 100%;
  box-shadow: 0 1rem 3rem rgba(0, 0, 0, 0.15) !important; /* Stronger, modern shadow */
  border: none; /* Remove default card border */
  padding: 3rem; /* Generous padding inside the card */
}

/*
 * Typography
 */
.signup-title {
  color: var(--bs-success); /* Use success brand color for title for a positive vibe */
  font-size: 2.2rem; /* Larger, more prominent title */
}

.signup-card p {
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
  border-color: var(--bs-success); /* Focus color matching the theme */
  box-shadow: 0 0 0 0.25rem rgba(var(--bs-success-rgb), 0.25);
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

/*
 * Signup Button
 */
.signup-btn {
  font-weight: 600;
  letter-spacing: 0.03em;
  border-radius: 0.75rem; /* Rounded button */
  padding: 0.85rem 1.5rem; /* Generous button padding */
  transition: all 0.3s ease; /* Smooth hover effects */
  background-color: var(--bs-success);
  border-color: var(--bs-success);
}

.signup-btn:hover {
  transform: translateY(-2px); /* Slight lift on hover */
  box-shadow: 0 0.5rem 1rem rgba(var(--bs-success-rgb), 0.3) !important; /* Enhanced shadow on hover */
}

.signup-btn:active {
  transform: translateY(0);
}

.signup-btn:disabled {
  opacity: 0.7;
  cursor: not-allowed;
}

/*
 * Terms and Policy / No Share Guarantee
 */
.terms-policy,
.no-share-guarantee {
  font-size: 0.85rem; /* Smaller text for legal/guarantee info */
}

.terms-policy a,
.login-link {
  font-weight: 600;
  /* Uses Bootstrap's primary text color by default */
}

.terms-policy a:hover,
.login-link:hover {
  text-decoration: underline !important; /* Underline on hover */
}

/*
 * Error/Success Messages
 */
.alert-danger,
.alert-success {
  border-radius: 0.75rem;
  font-size: 0.95rem;
  padding: 0.75rem 1.25rem; /* Consistent padding */
}

.alert-danger {
  border-left: 5px solid var(--bs-danger);
  background-color: var(--bs-danger-bg-subtle);
  color: var(--bs-danger-text-emphasis);
  border-color: var(--bs-danger-border-subtle);
}

.alert-success {
  border-left: 5px solid var(--bs-success);
  background-color: var(--bs-success-bg-subtle);
  color: var(--bs-success-text-emphasis);
  border-color: var(--bs-success-border-subtle);
}

/*
 * Responsive Adjustments
 */
@media (max-width: 575.98px) {
  .signup-card {
    padding: 2rem; /* Smaller padding on extra small screens */
    border-radius: 1rem;
  }
  .signup-title {
    font-size: 1.8rem;
  }
  .form-control-lg, .input-group-text {
    padding: 0.75rem 1rem;
    font-size: 1rem;
  }
  .signup-btn {
    padding: 0.75rem 1rem;
    font-size: 1rem;
  }
}

/*
 * Dark Mode Compatibility (Requires body.theme-dark class)
 */
body.theme-dark .signup-container {
  background: linear-gradient(135deg, #1d3a4c 0%, #2a2a2a 100%); /* Darker info gradient */
}

body.theme-dark .signup-card {
  background-color: #2a2a2a;
  box-shadow: 0 1rem 3rem rgba(0, 0, 0, 0.4) !important;
  color: #e0e0e0;
}

body.theme-dark .signup-title {
  color: var(--bs-success-light); /* Assuming a lighter success for dark mode */
}

body.theme-dark .signup-card p,
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
  box-shadow: 0 0 0 0.25rem rgba(var(--bs-success-rgb), 0.35);
}

body.theme-dark .input-group-text {
  background-color: #3a3a3a;
  border-color: #555;
  color: #b0b0b0;
}

body.theme-dark .signup-btn {
  background-color: var(--bs-success-dark); /* Darker success for dark mode button */
  border-color: var(--bs-success-dark);
}

body.theme-dark .signup-btn:hover {
  box-shadow: 0 0.5rem 1rem rgba(var(--bs-success-dark-rgb, 40, 167, 69), 0.3) !important;
}

body.theme-dark .terms-policy a,
body.theme-dark .login-link {
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