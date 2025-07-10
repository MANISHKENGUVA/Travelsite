<template>
  <div class="login-container d-flex justify-content-center align-items-center min-vh-100">
    <div class="login-card p-4 p-md-5 shadow-lg rounded-4 animate__animated animate__fadeInDown">
      <h2 class="text-center mb-4 login-title fw-bold">Welcome Back!</h2>
      <p class="text-center text-muted mb-4">Sign in to your account to continue.</p>

      <form @submit.prevent="login" class="needs-validation" novalidate>
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
              placeholder="Enter your password"
              required
              aria-label="Password"
            />
            <div class="invalid-feedback">
              Please enter your password.
            </div>
          </div>
        </div>

        <button type="submit" class="btn btn-primary btn-lg w-100 login-btn">
          <span v-if="!loading">Login</span>
          <span v-else class="spinner-border spinner-border-sm" role="status" aria-hidden="true"></span>
          <span v-if="loading" class="ms-2">Logging in...</span>
        </button>
      </form>

      <p class="text-center mt-4 text-muted">
        Don't have an account?
        <router-link to="/signup" class="text-primary fw-semibold text-decoration-none signup-link">Sign up here</router-link>
      </p>

      <div v-if="errorMessage" class="alert alert-danger mt-3 animate__animated animate__shakeX" role="alert">
        {{ errorMessage }}
      </div>
    </div>
  </div>
</template>

<script>
import { encryptUserData } from "../cry"; // Ensure this path is correct

export default {
  data() {
    return {
      email: '',
      password: '',
      loading: false, // New state for loading indicator
      errorMessage: '' // New state for displaying specific error messages
    };
  },
  methods: {
    async login() {
      // Basic client-side validation
      if (!this.email || !this.password) {
        this.errorMessage = "Please fill in both email and password.";
        return;
      }
      this.errorMessage = ''; // Clear previous errors

      this.loading = true; // Show loading indicator
      const baseUrl = import.meta.env.VITE_API_BASE_URL;

      try {
        const res = await fetch(`${baseUrl}login`, {
          method: 'POST',
          headers: { 'Content-Type': 'application/json' },
          body: JSON.stringify({
            email: this.email,
            password: this.password
          })
        });

        const data = await res.json();

        if (!res.ok) {
          this.errorMessage = data.error || 'Login failed. Please check your credentials.';
        } else {
          // Success message (optional, you might remove alert for smoother UX)
          // alert(data.message); // Commented out to prefer toast/notification system
          
          // Store user data in Vuex or localStorage
          // Ensure your Vuex store has 'setUser' and 'setUserDetails' mutations
          if (this.$store) {
            this.$store.commit('setUser', data.user.email);
            this.$store.commit('setUserDetails', data.user.email); // Assuming userDetails gets email
          } else {
            console.warn("Vuex store not found. Ensure it's initialized if you rely on it for user state.");
          }

          // Encrypt and store user data
          const encrypted = encryptUserData(data.user);
          localStorage.setItem("user", encrypted);

          // Redirect to home page
          if (this.$router) {
            this.$router.push('/');
          } else {
            console.warn("Vue Router not found. Cannot redirect.");
          }
        }
      } catch (err) {
        console.error('Login error:', err);
        this.errorMessage = 'Network error or server unavailable. Please try again later.';
      } finally {
        this.loading = false; // Hide loading indicator
      }
    }
  }
};
</script>

<style scoped>
/*
 * General Layout & Container
 */
.login-container {
  background: linear-gradient(135deg, var(--bs-primary-bg-subtle) 0%, var(--bs-light) 100%);
  /* A subtle gradient background for the whole page */
  padding: 1.5rem; /* Ensure some padding on very small screens */
}

.login-card {
  background-color: var(--bs-white);
  border-radius: 1.5rem; /* More rounded corners */
  max-width: 480px; /* Max width for the login form */
  width: 100%;
  box-shadow: 0 1rem 3rem rgba(0, 0, 0, 0.15) !important; /* Stronger, modern shadow */
  border: none; /* Remove default card border */
  padding: 3rem; /* Generous padding inside the card */
}

/*
 * Typography
 */
.login-title {
  color: var(--bs-primary); /* Use primary brand color for title */
  font-size: 2.2rem; /* Larger, more prominent title */
}

.login-card p {
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
  border-color: var(--bs-primary);
  box-shadow: 0 0 0 0.25rem rgba(var(--bs-primary-rgb), 0.25);
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
 * Login Button
 */
.login-btn {
  font-weight: 600;
  letter-spacing: 0.03em;
  border-radius: 0.75rem; /* Rounded button */
  padding: 0.85rem 1.5rem; /* Generous button padding */
  transition: all 0.3s ease; /* Smooth hover effects */
  background-color: var(--bs-primary);
  border-color: var(--bs-primary);
}

.login-btn:hover {
  transform: translateY(-2px); /* Slight lift on hover */
  box-shadow: 0 0.5rem 1rem rgba(var(--bs-primary-rgb), 0.3) !important; /* Enhanced shadow on hover */
}

.login-btn:active {
  transform: translateY(0);
}

/*
 * Sign Up Link
 */
.signup-link {
  font-weight: 600;
  /* Uses Bootstrap's primary text color by default */
}

.signup-link:hover {
  text-decoration: underline !important; /* Underline on hover */
}

/*
 * Error Message
 */
.alert-danger {
  border-radius: 0.75rem;
  font-size: 0.95rem;
  border-left: 5px solid var(--bs-danger); /* Prominent left border */
  background-color: var(--bs-danger-bg-subtle);
  color: var(--bs-danger-text-emphasis);
  border-color: var(--bs-danger-border-subtle);
}

/*
 * Responsive Adjustments
 */
@media (max-width: 575.98px) {
  .login-card {
    padding: 2rem; /* Smaller padding on extra small screens */
    border-radius: 1rem;
  }
  .login-title {
    font-size: 1.8rem;
  }
  .form-control-lg, .input-group-text {
    padding: 0.75rem 1rem;
    font-size: 1rem;
  }
  .login-btn {
    padding: 0.75rem 1rem;
    font-size: 1rem;
  }
}

/*
 * Dark Mode Compatibility (Requires body.theme-dark class)
 */
body.theme-dark .login-container {
  background: linear-gradient(135deg, #1c2635 0%, #2a2a2a 100%);
}

body.theme-dark .login-card {
  background-color: #2a2a2a;
  box-shadow: 0 1rem 3rem rgba(0, 0, 0, 0.4) !important;
  color: #e0e0e0;
}

body.theme-dark .login-title {
  color: var(--bs-primary-light); /* Assuming you have a lighter primary for dark mode */
}

body.theme-dark .login-card p,
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
  box-shadow: 0 0 0 0.25rem rgba(var(--bs-primary-rgb), 0.35);
}

body.theme-dark .input-group-text {
  background-color: #3a3a3a;
  border-color: #555;
  color: #b0b0b0;
}

body.theme-dark .login-btn {
  background-color: var(--bs-primary-dark); /* Darker primary for dark mode button */
  border-color: var(--bs-primary-dark);
}

body.theme-dark .login-btn:hover {
  box-shadow: 0 0.5rem 1rem rgba(var(--bs-primary-dark-rgb, 106, 110, 224), 0.3) !important;
}

body.theme-dark .signup-link {
  color: var(--bs-primary-light) !important;
}

body.theme-dark .alert-danger {
  background-color: #3a2e2e;
  border-color: #6a3e3e;
  color: #ff9999;
}
</style>