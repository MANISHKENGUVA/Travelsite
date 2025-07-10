<template>
  <div class="col-12 col-md-6  mb-4"> <div class="card border-0 rounded-4 shadow-lg h-100 send-package-card">
      <div
        class="position-absolute top-0 start-0 w-100 h-100 rounded-4 overlay-gradient"
        aria-hidden="true"
      ></div>

      <div class="card-body p-4 position-relative z-1 d-flex flex-column">
        <div class="d-flex align-items-center mb-3">
          <div class="icon-wrapper d-flex align-items-center justify-content-center rounded-circle bg-primary text-white me-3 flex-shrink-0">
            <i class="bi bi-box-seam fs-3"></i> </div>
          <div>
            <h5 class="card-title fw-bold text-dark mb-0">Send a Package</h5>
            <small class="text-muted">Quick and secure delivery service</small>
          </div>
        </div>

        <p class="text-secondary mb-4 flex-grow-1"> Get your packages delivered by trusted carriers traveling your route.
        </p>

        <router-link to="/post-delivery" class="btn btn-primary btn-lg rounded-pill w-100 mt-auto shadow-sm animate-btn">
          <i class="bi bi-plus-circle-fill me-2"></i> Post Delivery Request
        </router-link>
      </div>
    </div>
  </div>
</template>

<script>
export default {
  name: 'SendPackageCard', // Added a component name for clarity
}
</script>

<style scoped>
/* Scoped styles for this component */

.send-package-card {
  transition: transform 0.3s ease-out, box-shadow 0.3s ease-out, border-color 0.3s ease-out;
  cursor: pointer;
  border: 2px solid transparent !important; /* Start with transparent border */
}

.send-package-card:hover {
  transform: translateY(-5px); /* Lift effect on hover */
  box-shadow: 0 0.75rem 1.5rem rgba(var(--bs-primary-rgb), 0.15) !important; /* More pronounced shadow, subtly tinted */
  border-color: var(--bs-primary) !important; /* Primary color border on hover */
}

.rounded-4 {
  border-radius: 1.25rem !important; /* Even more rounded corners */
}

.shadow-lg {
  box-shadow: 0 1rem 3rem rgba(0, 0, 0, 0.08) !important; /* Softer, larger initial shadow */
}

.overlay-gradient {
  background: linear-gradient(to bottom right, rgba(var(--bs-primary-rgb), 0.07), rgba(var(--bs-info-rgb), 0.05)) !important; /* Lighter, more subtle gradient */
  opacity: 0.8; /* Slightly less opaque */
  z-index: 0;
}

.icon-wrapper {
  width: 60px; /* Larger icon wrapper */
  height: 60px;
  font-size: 1.75rem; /* Icon size */
  box-shadow: 0 0.25rem 0.5rem rgba(var(--bs-primary-rgb), 0.2); /* Small shadow for the icon */
}

.card-title {
  font-size: 1.6rem; /* Slightly larger, more impactful title */
  line-height: 1.2;
}

.text-secondary {
    color: var(--bs-secondary) !important; /* Using Bootstrap's secondary color for content text */
    font-size: 1.05rem;
}

.btn-lg {
  padding: 0.75rem 1.5rem; /* Larger button padding */
  font-size: 1.1rem; /* Slightly larger text */
}

.rounded-pill {
  border-radius: 50rem !important; /* Full pill shape for the button */
}

.animate-btn {
  transition: all 0.2s ease-in-out;
}

.animate-btn:hover {
  transform: translateY(-2px); /* Slight lift on button hover */
  box-shadow: 0 0.5rem 1rem rgba(var(--bs-primary-rgb), 0.25) !important; /* More prominent shadow on button hover */
}

/* Ensure content is above the gradient */
.card-body > *:not(.overlay-gradient) {
  position: relative;
  z-index: 1;
}
</style>