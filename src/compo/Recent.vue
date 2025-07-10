Let's give your "Recent Activity" component a modern and refined look. I'll focus on subtle design elements, improved spacing, and enhanced interactivity to make it more engaging and user-friendly, all while keeping the functionality exactly as it is.

Here's the modernized Vue component:

```vue
<template>
  <div class="container my-5">
    <div class="row justify-content-center">
      <div class="col-12">
        <div class="card h-100 border-0 rounded-4 shadow-lg recent-activity-card">
          <div class="card-header bg-white px-4 py-4 border-bottom-0 rounded-top-4">
            <div class="d-flex justify-content-between align-items-center mb-3 flex-wrap gap-2">
              <div>
                <h4 class="fw-bold text-dark mb-1">Recent Activity</h4>
                <p class="text-muted mb-0">Your latest deliveries and trips</p>
              </div>
              <router-link to="/dashboard" class="btn btn-outline-primary btn-sm rounded-pill px-3 py-2 animate-btn">
                View All <i class="bi bi-arrow-right ms-2"></i>
              </router-link>
            </div>

            <ul class="nav nav-pills custom-nav-pills justify-content-start flex-nowrap overflow-auto pb-2 mt-3" role="tablist">
              <li class="nav-item">
                <button
                  class="nav-link"
                  :class="{ active: activeTab === 'all' }"
                  @click="activeTab = 'all'"
                >All</button>
              </li>
              <li class="nav-item">
                <button
                  class="nav-link"
                  :class="{ active: activeTab === 'delivery' }"
                  @click="activeTab = 'delivery'"
                >Deliveries</button>
              </li>
              <li class="nav-item">
                <button
                  class="nav-link"
                  :class="{ active: activeTab === 'trip' }"
                  @click="activeTab = 'trip'"
                >Trips</button>
              </li>
            </ul>

            <div class="mt-4 d-flex flex-wrap align-items-center gap-3">
              <input
                v-model="searchTerm"
                type="text"
                class="form-control flex-grow-1 search-input"
                placeholder="Search by title, location..."
              />
              <input type="date" v-model="filterStartDate" class="form-control date-input" />
              <input type="date" v-model="filterEndDate" class="form-control date-input" />
              <button class="btn btn-outline-secondary rounded-pill px-3 animate-btn" @click="clearFilters">Clear Filters</button>
              <button class="btn btn-success ms-auto rounded-pill px-3 animate-btn" @click="exportCSV">
                <i class="bi bi-download me-2"></i> Export CSV
              </button>
            </div>
          </div>

          <div class="card-body p-4">
            <div class="vstack gap-3">
              <router-link
                v-for="(item, index) in filteredItems"
                :key="index"
                :to="item.type === 'delivery'
                  ? { path: '/find-carriers', query: { id: item.productId } }
                  : { path: '/view-requests', query: { transportTripId: item.transportTripId } }"
                class="activity-item text-decoration-none text-dark p-3 border rounded-3 bg-light d-flex align-items-center transition-all"
              >
                <div
                  class="activity-icon-wrapper d-flex align-items-center justify-content-center rounded-circle text-white me-3 flex-shrink-0"
                  :class="item.type === 'trip' ? 'bg-success' : 'bg-primary'"
                >
                  <i :class="['bi', item.type === 'delivery' ? 'bi-box-seam' : 'bi-truck', 'fs-5']"></i>
                </div>

                <div class="flex-grow-1 me-3">
                  <p class="mb-1 fw-semibold text-truncate text-dark">
                    {{ item.title }}
                    <span class="badge rounded-pill ms-2"
                      :class="item.type === 'trip' ? 'bg-success-subtle text-success' : 'bg-primary-subtle text-primary'">
                      {{ item.type === 'trip' ? 'Trip' : 'Delivery' }}
                    </span>
                  </p>
                  <div class="d-flex align-items-center text-muted small mt-1">
                    <i class="bi bi-geo-alt-fill me-1"></i>
                    <span class="text-truncate">{{ item.from }} &rarr; {{ item.to }}</span>
                  </div>
                </div>

                <div class="text-end flex-shrink-0">
                  <span
                    class="badge rounded-pill px-3 py-1"
                    :class="item.status === 'In Transit' || item.status === 'accepted' ? 'bg-primary' : 'bg-secondary'"
                  >
                    {{ item.status }}
                  </span>
                  <p class="text-muted small mb-0 mt-1">{{ formatTime(item.time) }}</p>
                </div>
              </router-link>

              <div v-if="filteredItems.length === 0" class="text-center text-muted py-5">
                <i class="bi bi-info-circle fs-4 mb-2"></i>
                <p class="mb-0">No activities found matching your criteria.</p>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  </div>
</template>

<script>
export default {
  name: 'RecentActivity',
  data() {
    return {
      deliveryRequests: [],
      tripData: [],
      allItems: [],
      activeTab: 'all',
      searchTerm: '',
      filterStartDate: '',
      filterEndDate: '',
    };
  },
  computed: {
    filteredItems() {
      let items = [...this.allItems];

      if (this.activeTab !== 'all') {
        items = items.filter((item) => item.type === this.activeTab);
      }

      if (this.searchTerm.trim()) {
        const keyword = this.searchTerm.toLowerCase();
        items = items.filter(
          (item) =>
            item.title.toLowerCase().includes(keyword) ||
            item.from.toLowerCase().includes(keyword) ||
            item.to.toLowerCase().includes(keyword)
        );
      }

      if (this.filterStartDate && this.filterEndDate) {
        const start = new Date(this.filterStartDate);
        const end = new Date(this.filterEndDate);
        items = items.filter((item) => {
          const itemDate = new Date(item.time);
          // Adjust end date to include the whole day
          end.setHours(23, 59, 59, 999);
          return itemDate >= start && itemDate <= end;
        });
      }

      return items.sort((a, b) => new Date(b.time) - new Date(a.time));
    },
  },
  created() {
    this.fetchData();
  },
  methods: {
    async fetchData() {
      const baseUrl = import.meta.env.VITE_API_BASE_URL;
      const user = this.$store.getters.getUser;
      if (!user || !user.email) {
        console.warn('User email not available. Cannot fetch data.');
        this.allItems = [];
        return;
      }
      const email = user.email;
      const query = `email=${encodeURIComponent(email)}`;

      try {
        const res = await fetch(`${baseUrl}api/allinfodata?${query}`);
        if (!res.ok) {
          throw new Error(`HTTP error! status: ${res.status}`);
        }
        const data = await res.json();

        const deliveries = (data.deliveryRequests || []).map((item) => ({
          type: 'delivery',
          title: item.item_description,
          from: item.pickup_address,
          to: item.dropoff_address,
          status: item.accepted_travel_id ? 'In Transit' : 'Pending', // Assuming status logic
          time: item.pickup_date, // Assuming pickup_date is suitable for sorting
          productId: item.product_id,
        }));

        const trips = (data.tripData || []).map((trip) => ({
          type: 'trip',
          title: `${trip.start_location} to ${trip.destination}`,
          from: trip.start_location,
          to: trip.destination,
          status: trip.status || 'Scheduled', // Assuming status exists or default
          time: trip.departure_date, // Using departure_date for consistent sorting
          transportTripId: trip.transport_trip_id,
        }));

        // Limit to latest 5 items if more are fetched, or show all if less
        this.allItems = [...deliveries, ...trips].sort((a, b) => new Date(b.time) - new Date(a.time)).slice(0, 5);

      } catch (err) {
        console.error('Failed to fetch data:', err);
        // Handle error, e.g., show a user-friendly message
        this.allItems = []; // Clear items on error
      }
    },
    formatTime(datetime) {
      const date = new Date(datetime);
      if (isNaN(date.getTime())) { // Check if date is valid
        return 'Invalid Date';
      }
      return date.toLocaleString('en-IN', {
        dateStyle: 'medium',
        timeStyle: 'short',
      });
    },
    exportCSV() {
      if (this.filteredItems.length === 0) {
        alert('No data to export.');
        return;
      }
      const headers = ['Type', 'Title', 'From', 'To', 'Status', 'Time'];
      const rows = this.filteredItems.map((item) => [
        item.type,
        `"${item.title.replace(/"/g, '""')}"`, // Handle commas/quotes in title
        `"${item.from.replace(/"/g, '""')}"`,
        `"${item.to.replace(/"/g, '""')}"`,
        item.status,
        this.formatTime(item.time), // Use formatted time for CSV
      ]);
      const csv = [headers.join(','), ...rows.map((r) => r.join(','))].join('\n');

      const blob = new Blob([csv], { type: 'text/csv;charset=utf-8;' });
      const link = document.createElement('a');
      link.href = URL.createObjectURL(blob);
      link.download = 'recent_activity.csv';
      document.body.appendChild(link);
      link.click();
      document.body.removeChild(link);
      URL.revokeObjectURL(link.href); // Clean up
    },
    clearFilters() {
      this.searchTerm = '';
      this.filterStartDate = '';
      this.filterEndDate = '';
      this.activeTab = 'all';
    },
  },
};
</script>

<style scoped>
/* Card Styling */
.recent-activity-card {
  box-shadow: 0 0.5rem 2rem rgba(0, 0, 0, 0.08) !important; /* Deeper, softer shadow */
}

.rounded-4 {
  border-radius: 1.5rem !important; /* More rounded corners */
}

/* Header Styling */
.card-header {
  border-bottom: 1px solid var(--bs-border-color-translucent) !important;
}

h4 {
  font-size: 1.6rem; /* Larger header title */
}

/* Tabs */
.custom-nav-pills .nav-link {
  color: var(--bs-dark);
  font-weight: 500;
  transition: all 0.2s ease-in-out;
  padding: 0.6rem 1.2rem;
  border-radius: 0.75rem; /* Softer rounded pills */
}

.custom-nav-pills .nav-link.active {
  background-color: var(--bs-primary);
  color: white;
  box-shadow: 0 0.25rem 0.75rem rgba(var(--bs-primary-rgb), 0.2);
}

.custom-nav-pills .nav-link:hover:not(.active) {
  background-color: var(--bs-light);
  color: var(--bs-primary);
}

/* Input Fields */
.search-input {
  max-width: 300px; /* Control width of search input */
}

.date-input {
  flex-basis: 150px; /* Give date inputs a consistent width */
  min-width: 120px;
}

.form-control {
  border-radius: 0.75rem; /* Rounded inputs */
  padding: 0.6rem 1rem;
  border-color: var(--bs-border-color);
  transition: all 0.2s ease-in-out;
}

.form-control:focus {
  border-color: var(--bs-primary);
  box-shadow: 0 0 0 0.25rem rgba(var(--bs-primary-rgb), 0.25);
}

/* Buttons (Export, Clear Filters) */
.btn.rounded-pill {
  font-weight: 600;
  white-space: nowrap; /* Prevent text wrapping */
}

.animate-btn {
  transition: all 0.2s ease-in-out;
}

.animate-btn:hover {
  transform: translateY(-1px); /* Slight lift */
  box-shadow: 0 0.25rem 0.5rem rgba(0, 0, 0, 0.1) !important;
}

/* Activity Item Links */
.activity-item {
  transition: all 0.2s ease-in-out;
  border: 1px solid var(--bs-border-color-translucent) !important;
  border-radius: 1rem !important; /* More rounded individual items */
}

.activity-item:hover {
  background-color: var(--bs-light) !important;
  transform: translateY(-3px); /* Lift effect on hover */
  box-shadow: 0 0.5rem 1rem rgba(0, 0, 0, 0.08) !important; /* Item-specific shadow */
}

.activity-icon-wrapper {
  width: 48px; /* Slightly larger icon wrapper for items */
  height: 48px;
  font-size: 1.25rem;
}

.text-dark {
  color: var(--bs-dark) !important; /* Ensure text is dark for readability */
}

.badge.rounded-pill {
  font-weight: 600;
  padding: 0.4em 0.8em;
  font-size: 0.75em; /* Slightly smaller badge text */
}

.bg-primary-subtle {
  background-color: var(--bs-primary-bg-subtle) !important;
  color: var(--bs-primary-text-emphasis) !important;
}

.bg-success-subtle {
  background-color: var(--bs-success-bg-subtle) !important;
  color: var(--bs-success-text-emphasis) !important;
}

/* No results found message */
.text-center.text-muted {
  color: var(--bs-secondary) !important;
}
</style>
```