<template>
  <div>
    <div class="container py-5">
      <div class="hero-section p-4 rounded-4 shadow-sm mb-5">
        <div class="d-flex flex-column flex-lg-row align-items-lg-center justify-content-lg-between">
          <div>
            <h1 class="display-5 fw-bold mb-2 text-dark">
              Welcome back, <span class="text-primary">{{ userDetails.name }}</span>! 👋
            </h1>
            <p class="lead text-muted mb-0">
              Ready to send packages or offer transportation?
            </p>
          </div>
          <div v-if="userDetails.userVerified" class="mt-4 mt-lg-0 flex-shrink-0">
            <span class="badge bg-success-subtle text-success fs-6 px-3 py-2 rounded-pill">
              <i class="bi bi-shield-check-fill me-2"></i>
              Verified User
            </span>
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
      userDetails: {
        name: '',
        email: '',
        userVerified: false, // Initialize as false
      },
    };
  },
  methods: {
    checkUserLogined() {
      const checking = this.$store.getters.getUser;
      if (checking) {
        this.userDetails.name = checking.name;
        this.userDetails.email = checking.email;
        this.userDetails.userVerified = checking.userVerified;
      }
    },
  },
  created() {
    this.checkUserLogined();
  },
};
</script>

<style scoped>
/* These are standard CSS styles that will work with Bootstrap */
/* No need for lang="scss" when using plain CSS */

.hero-section {
  background-color: var(--bs-light); /* Using a light background for modern feel */
  border: 1px solid var(--bs-border-color-translucent); /* Subtle border */
}

.display-5 {
  font-size: 2.5rem; /* Larger and more impactful heading */
}

.lead {
  font-size: 1.15rem; /* Slightly larger lead text */
}

.text-primary {
  color: var(--bs-primary) !important; /* Emphasize user's name with primary color */
}

.badge.bg-success-subtle {
  background-color: var(--bs-success-bg-subtle) !important;
  color: var(--bs-success-text-emphasis) !important;
  font-weight: 600; /* Bolder text for the badge */
}

.rounded-4 {
  border-radius: 1rem !important; /* More rounded corners for the hero section card */
}

.shadow-sm {
  box-shadow: 0 0.25rem 0.75rem rgba(0, 0, 0, 0.05) !important; /* Lighter shadow */
}

.fs-6 {
  font-size: 1rem !important; /* Standard font size for badges */
}

.px-3 {
  padding-left: 1rem !important;
  padding-right: 1rem !important;
}

.py-2 {
  padding-top: 0.5rem !important;
  padding-bottom: 0.5rem !important;
}

.rounded-pill {
  border-radius: 50rem !important; /* Pill shape for badges */
}
</style>