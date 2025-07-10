<template>
  <div class="container my-5">
    <div class="row row-cols-1 row-cols-md-2 row-cols-lg-4 g-4">
      <div v-for="(stat, index) in stats" :key="index" class="col">
        <div class="stat-card card h-100 border-0 rounded-5 shadow-lg text-center">
          <div class="glass-overlay"></div> <div class="card-body p-4 d-flex flex-column justify-content-center align-items-center position-relative z-1">
            <div class="icon-wrapper d-flex align-items-center justify-content-center rounded-circle mb-3">
              <i :class="`bi ${stat.icon} fs-3`"></i>
            </div>
            <div class="h2 fw-bolder text-dark mb-1">{{ stat.value }}</div> <div class="text-secondary small fw-medium text-uppercase ls-1">{{ stat.label }}</div> </div>
        </div>
      </div>
    </div>
  </div>
</template>

<script>
export default {
  name: 'StatsGrid',
  data() {
    return {
      stats: [
        { label: "Active Deliveries", value: "12", icon: "bi-box-seam" },
        { label: "Completed Trips", value: "156", icon: "bi-truck" },
        { label: "Trust Score", value: "4.9", icon: "bi-star-fill" },
        { label: "Response Time", value: "5min", icon: "bi-clock" },
      ],
    };
  },
};
</script>

<style scoped>
/* CSS Variables for potential theming */
:root {
  --card-bg-start: rgba(255, 255, 255, 0.9);
  --card-bg-end: rgba(245, 245, 255, 0.8);
  --card-shadow-color: rgba(var(--bs-primary-rgb), 0.1);
  --icon-bg-color: var(--bs-primary);
  --icon-color: #fff;
  --text-dark-color: var(--bs-gray-900);
  --text-muted-color: var(--bs-gray-600);
}

.stat-card {
  /* Removed border-0 as glass-overlay handles the visual border */
  background: linear-gradient(145deg, var(--card-bg-start), var(--card-bg-end));
  transition: transform 0.4s cubic-bezier(0.25, 0.8, 0.25, 1), box-shadow 0.4s cubic-bezier(0.25, 0.8, 0.25, 1);
  overflow: hidden;
  position: relative; /* Needed for z-index of children */
  cursor: pointer;
  border-radius: 1.875rem !important; /* Even more rounded */
  box-shadow: 0 1rem 2rem rgba(0, 0, 0, 0.05); /* Softer initial shadow */
}

.stat-card:hover {
  transform: translateY(-8px) scale(1.02); /* More pronounced lift and slight scale */
  box-shadow: 0 1.5rem 3rem var(--card-shadow-color); /* Enhanced shadow with primary tint */
}

/* Glassmorphism Effect */
.glass-overlay {
  position: absolute;
  top: 0;
  left: 0;
  width: 100%;
  height: 100%;
  background: rgba(255, 255, 255, 0.2); /* Slightly visible background */
  backdrop-filter: blur(8px); /* Frosted glass effect */
  border: 1px solid rgba(255, 255, 255, 0.3); /* Subtle border */
  border-radius: 1.875rem; /* Match card radius */
  z-index: 0; /* Behind content */
}

/* Ensure content is above the glass overlay */
.stat-card .card-body {
  position: relative;
  z-index: 1;
}

/* Icon Styling */
.icon-wrapper {
  width: 70px; /* Larger icon wrapper */
  height: 70px;
  font-size: 2.2rem; /* Even larger icon size */
  background-color: var(--icon-bg-color); /* Primary background for icon */
  color: var(--icon-color); /* White icon */
  box-shadow: 0 0.5rem 1rem rgba(var(--bs-primary-rgb), 0.3); /* Stronger icon shadow */
  transition: all 0.3s ease;
}

.stat-card:hover .icon-wrapper {
  transform: scale(1.1); /* Pop effect on icon on hover */
}

/* Typography */
.h2 {
  font-size: 2.2rem; /* Larger value font size */
  font-weight: 800 !important; /* Even bolder value */
  color: var(--text-dark-color) !important;
  text-shadow: 1px 1px 2px rgba(0, 0, 0, 0.05); /* Subtle text shadow */
}

.text-secondary {
    color: var(--text-muted-color) !important;
}

.small {
  font-size: 0.9rem !important; /* Slightly adjusted label size */
}

.fw-medium {
    font-weight: 600 !important; /* Bolder label */
}

.text-uppercase {
    text-transform: uppercase !important;
}

.ls-1 {
    letter-spacing: 0.05em; /* Add subtle letter spacing to labels */
}

/* Responsive adjustments */
@media (max-width: 767.98px) {
  .icon-wrapper {
    width: 60px;
    height: 60px;
    font-size: 1.8rem;
  }
  .h2 {
    font-size: 1.8rem;
  }
}
</style>