<template>
  <div class=" col-12 col-md-6 ">
     <div class=" border-0 rounded-4 shadow-lg offer-transport-card">
      <div
        class="position-absolute top-0 start-0 w-100  rounded-4 overlay-gradient-success"
        aria-hidden="true"
      ></div>

      <div class=" p-4 position-relative z-1 d-flex flex-column">
        <div class="d-flex align-items-center mb-3">
          <div class="icon-wrapper d-flex align-items-center justify-content-center rounded-circle bg-success text-white me-3 flex-shrink-0">
            <i class="bi bi-truck fs-3"></i> </div>
          <div>
            <h5 class="card-title fw-bold text-dark mb-0">Offer Transportation</h5>
            <small class="text-muted">Earn money while you travel</small>
          </div>
        </div>

        <p class="text-secondary mb-4 flex-grow-1">
          Share your travel plans and help others deliver their packages.
        </p>

        <router-link to="/post-trip" class="btn btn-outline-primary btn-lg rounded-pill w-100 mt-auto shadow-sm animate-btn">
          <i class="bi bi-plus-circle-fill me-2"></i> Post Trip Details
        </router-link>
      </div>
    </div>
  </div>
</template>

<script>
export default {
  name: 'OfferTransportationCard',
};
</script>

<style scoped>
/* Consistent card base styling */
.offer-transport-card {
  transition: transform 0.3s ease-out, box-shadow 0.3s ease-out, border-color 0.3s ease-out;
  cursor: pointer;
  border: 2px solid transparent !important; /* Start with transparent border */
}

.offer-transport-card:hover {
  transform: translateY(-5px); /* Lift effect on hover */
  box-shadow: 0 0.75rem 1.5rem rgba(var(--bs-success-rgb), 0.15) !important; /* Shadow subtly tinted with success color */
  border-color: var(--bs-success) !important; /* Success color border on hover */
}

.rounded-4 {
  border-radius: 1.25rem !important; /* Consistent rounded corners */
}

.shadow-lg {
  box-shadow: 0 1rem 3rem rgba(0, 0, 0, 0.08) !important; /* Consistent initial shadow */
}

/* Gradient Overlay - adapted for success color */
.overlay-gradient-success {
  background: linear-gradient(to bottom right, rgba(var(--bs-success-rgb), 0.07), rgba(var(--bs-teal-rgb), 0.05)) !important; /* Greenish/Teal gradient */
  opacity: 0.8;
  z-index: 0;
}

/* Icon Wrapper */
.icon-wrapper {
  width: 60px;
  height: 60px;
  font-size: 1.75rem;
  box-shadow: 0 0.25rem 0.5rem rgba(var(--bs-success-rgb), 0.2); /* Shadow for the icon */
}

/* Typography */
.card-title {
  font-size: 1.6rem;
  line-height: 1.2;
}

.text-secondary {
    color: var(--bs-secondary) !important;
    font-size: 1.05rem;
}

/* Button Styling */
.btn-outline-primary {
    --bs-btn-color: var(--bs-primary);
    --bs-btn-border-color: var(--bs-primary);
    --bs-btn-hover-color: #fff;
    --bs-btn-hover-bg: var(--bs-primary);
    --bs-btn-hover-border-color: var(--bs-primary);
    --bs-btn-active-color: #fff;
    --bs-btn-active-bg: var(--bs-primary);
    --bs-btn-active-border-color: var(--bs-primary);
    --bs-btn-disabled-color: var(--bs-primary);
    --bs-btn-disabled-border-color: var(--bs-primary);
    padding: 0.75rem 1.5rem; /* Larger button padding */
    font-size: 1.1rem; /* Slightly larger text */
    border-width: 2px; /* Make outline button border more prominent */
}

.rounded-pill {
  border-radius: 50rem !important; /* Full pill shape */
}

.animate-btn {
  transition: all 0.2s ease-in-out;
}

.animate-btn:hover {
  transform: translateY(-2px); /* Slight lift on button hover */
  box-shadow: 0 0.5rem 1rem rgba(var(--bs-primary-rgb), 0.25) !important; /* More prominent shadow on button hover */
}

/* Ensure content is above the gradient */
.card-body > *:not(.overlay-gradient-success) {
  position: relative;
  z-index: 1;
}
</style>