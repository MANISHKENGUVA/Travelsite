<template>
  <div class="container py-4">
    <div class="header-section d-flex flex-column flex-sm-row justify-content-between align-items-start align-items-sm-center mb-5">
      <div class="text-center text-sm-start mb-3 mb-sm-0">
        <h1 class="h3 fw-bold text-primary mb-1">Carrier Dashboard</h1>
        <p class="text-secondary mb-0">Manage your accepted deliveries and track your earnings effortlessly.</p>
      </div>
      <button class="btn btn-success btn-lg post-trip-btn w-100 w-sm-auto" @click="goToPostTrip">
        <i class="bi bi-plus-circle me-2"></i> Post New Trip
      </button>
    </div>

    <div class="row g-4 mb-5 text-center">
      <div class="col-6 col-md-3">
        <div class="card stat-card py-4 animate__animated animate__fadeInUp">
          <div class="icon-circle bg-success-subtle text-success mb-3">
            <i class="bi bi-box-seam fs-3"></i>
          </div>
          <h4 class="fw-bold mb-1">{{ deliveries.length }}</h4>
          <p class="text-muted small mb-0">Active Deliveries</p>
        </div>
      </div>
      <div class="col-6 col-md-3">
        <div class="card stat-card py-4 animate__animated animate__fadeInUp animate__delay-1s">
          <div class="icon-circle bg-primary-subtle text-primary mb-3">
            <i class="bi bi-currency-dollar fs-3"></i>
          </div>
          <h4 class="fw-bold mb-1">${{ totalEarnings }}</h4>
          <p class="text-muted small mb-0">Total Earnings</p>
        </div>
      </div>
      <div class="col-6 col-md-3">
        <div class="card stat-card py-4 animate__animated animate__fadeInUp animate__delay-2s">
          <div class="icon-circle bg-warning-subtle text-warning mb-3">
            <i class="bi bi-star-fill fs-3"></i>
          </div>
          <h4 class="fw-bold mb-1">{{ averageRating.toFixed(1) }}</h4>
          <p class="text-muted small mb-0">Average Rating</p>
        </div>
      </div>
      <div class="col-6 col-md-3">
        <div class="card stat-card py-4 animate__animated animate__fadeInUp animate__delay-3s">
          <div class="icon-circle bg-info-subtle text-info mb-3">
            <i class="bi bi-check-circle-fill fs-3"></i>
          </div>
          <h4 class="fw-bold mb-1">{{ completedDeliveries.length }}</h4>
          <p class="text-muted small mb-0">Completed</p>
        </div>
      </div>
    </div>

    <ul class="nav nav-tabs nav-tabs-modern mb-4" role="tablist">
      <li class="nav-item" role="presentation">
        <a class="nav-link active" id="active-tab" data-bs-toggle="tab" href="#active" role="tab" aria-controls="active" aria-selected="true">
          Active Deliveries
        </a>
      </li>
      <li class="nav-item" role="presentation">
        <a class="nav-link" id="completed-tab" data-bs-toggle="tab" href="#completed" role="tab" aria-controls="completed" aria-selected="false">
          Completed
        </a>
      </li>
    </ul>

    <div class="tab-content pt-3">
      <div class="tab-pane fade show active" id="active" role="tabpanel" aria-labelledby="active-tab">
        <div v-if="deliveries.length === 0" class="alert alert-info text-center animate__animated animate__fadeIn">
          <i class="bi bi-info-circle me-2"></i> No active deliveries right now. Post a new trip to get started!
        </div>
        <div v-for="delivery in deliveries" :key="delivery.id" class="card delivery-card mb-4 animate__animated animate__fadeInUp">
          <div class="card-header d-flex flex-column flex-sm-row justify-content-between align-items-start align-items-sm-center p-3 p-sm-4">
            <div class="mb-2 mb-sm-0">
              <h5 class="card-title fw-bold text-dark-emphasis mb-1">{{ delivery.itemDescription }}</h5>
              <div class="d-flex align-items-center">
                <span :class="getStatusBadgeClass(delivery.status)" class="me-2">{{ getStatusLabel(delivery.status) }}</span>
                <small class="text-secondary fw-medium">{{ delivery.itemType }}</small>
              </div>
            </div>
            <div class="text-sm-end">
              <strong class="text-success fs-5">${{ delivery.amount }}</strong><br>
              <small class="text-muted fw-medium">ETA: {{ delivery.estimatedDelivery }}</small>
            </div>
          </div>
          <div class="card-body p-3 p-sm-4">
            <div class="delivery-details-grid mb-3">
              <p class="mb-2"><i class="bi bi-geo-alt-fill text-warning me-2"></i><strong class="text-dark-emphasis">Pickup:</strong> {{ delivery.pickupAddress }}</p>
              <p class="mb-2"><i class="bi bi-flag-fill text-danger me-2"></i><strong class="text-dark-emphasis">Dropoff:</strong> {{ delivery.dropoffAddress }}</p>
            </div>
            
            <div class="contact-block d-flex justify-content-between align-items-center mb-3">
              <div class="d-flex align-items-center">
                <div class="initials-circle bg-info-subtle text-info me-3">
                  {{ getInitials(delivery.senderName) }}
                </div>
                <div>
                  <p class="mb-0 fw-semibold text-dark-emphasis">Sender: {{ delivery.senderName }}</p>
                  <small class="text-muted"><i class="bi bi-phone me-1"></i>{{ delivery.senderPhone }}</small>
                </div>
              </div>
              <div class="d-flex gap-2">
                <button class="btn btn-outline-secondary btn-icon" @click="openChat(delivery.senderPhone)" title="Chat with Sender">
                  <i class="bi bi-chat-dots-fill"></i>
                </button>
                <button class="btn btn-outline-secondary btn-icon" @click="callNumber(delivery.senderPhone)" title="Call Sender">
                  <i class="bi bi-telephone-fill"></i>
                </button>
              </div>
            </div>

            <div class="contact-block d-flex justify-content-between align-items-center mb-3">
              <div class="d-flex align-items-center">
                <div class="initials-circle bg-primary-subtle text-primary me-3">
                  {{ getInitials(delivery.receiverName) }}
                </div>
                <div>
                  <p class="mb-0 fw-semibold text-dark-emphasis">Receiver: {{ delivery.receiverName }}</p>
                  <small class="text-muted"><i class="bi bi-phone me-1"></i>{{ delivery.receiverPhone }}</small>
                </div>
              </div>
              <div class="d-flex gap-2">
                <button class="btn btn-outline-secondary btn-icon" @click="openChat(delivery.receiverPhone)" title="Chat with Receiver">
                  <i class="bi bi-chat-dots-fill"></i>
                </button>
                <button class="btn btn-outline-secondary btn-icon" @click="callNumber(delivery.receiverPhone)" title="Call Receiver">
                  <i class="bi bi-telephone-fill"></i>
                </button>
              </div>
            </div>

            <div v-if="delivery.specialInstructions" class="alert alert-info bg-info-subtle border-info-subtle text-info-emphasis mt-3 p-3 rounded-3 animate__animated animate__fadeIn">
              <i class="bi bi-lightbulb-fill me-2"></i><strong class="fw-bold">Special Instructions:</strong>
              <p class="mb-0 small text-info-emphasis">{{ delivery.specialInstructions }}</p>
            </div>
            
            <div class="d-flex flex-column flex-sm-row justify-content-end gap-2 mt-4">
              <button v-if="delivery.status === 'accepted'" class="btn btn-primary w-100 w-sm-auto" @click="updateDeliveryStatus(delivery.id, 'picked-up')">
                <i class="bi bi-truck me-2"></i> Mark as Picked Up
              </button>
              <button v-if="delivery.status === 'picked-up'" class="btn btn-warning w-100 w-sm-auto" @click="updateDeliveryStatus(delivery.id, 'in-transit')">
                <i class="bi bi-geo-alt me-2"></i> Start Transit
              </button>
              <button v-if="delivery.status === 'in-transit'" class="btn btn-success w-100 w-sm-auto" @click="goToConfirmDelivery(delivery.id)">
                <i class="bi bi-check-circle me-2"></i> Confirm Delivery
              </button>
            </div>
          </div>
        </div>
      </div>

      <div class="tab-pane fade" id="completed" role="tabpanel" aria-labelledby="completed-tab">
        <div v-if="completedDeliveries.length === 0" class="alert alert-secondary text-center animate__animated animate__fadeIn">
          <i class="bi bi-info-circle me-2"></i> No completed deliveries yet. Keep delivering!
        </div>
        <div v-for="delivery in completedDeliveries" :key="delivery.id" class="card delivery-card mb-4 animate__animated animate__fadeInUp">
          <div class="card-header d-flex flex-column flex-sm-row justify-content-between align-items-start align-items-sm-center p-3 p-sm-4">
            <div class="mb-2 mb-sm-0">
              <h5 class="card-title fw-bold text-dark-emphasis mb-1">{{ delivery.itemDescription }}</h5>
              <div class="d-flex align-items-center">
                <span class="badge bg-success text-white me-2"><i class="bi bi-check-circle-fill me-1"></i> Delivered</span>
                <small class="text-secondary fw-medium">{{ delivery.itemType }}</small>
              </div>
            </div>
            <div class="text-sm-end">
              <strong class="text-success fs-5">+${{ delivery.earnings }}</strong><br>
              <small class="text-muted fw-medium">Rating: <span class="text-warning"><i class="bi bi-star-fill me-1"></i>{{ delivery.rating }}/5</span></small>
            </div>
          </div>
          <div class="card-body p-3 p-sm-4">
            <div class="delivery-details-grid mb-3">
              <p class="mb-2"><i class="bi bi-geo-alt-fill text-warning me-2"></i><strong class="text-dark-emphasis">Pickup:</strong> {{ delivery.pickupAddress }}</p>
              <p class="mb-2"><i class="bi bi-flag-fill text-danger me-2"></i><strong class="text-dark-emphasis">Dropoff:</strong> {{ delivery.dropoffAddress }}</p>
            </div>
            <p class="mb-2"><strong class="text-dark-emphasis">Delivered On:</strong> {{ formatDateTime(delivery.completedAt) }}</p>
            <div v-if="delivery.feedback" class="alert alert-success bg-success-subtle border-success-subtle text-success-emphasis mt-3 p-3 rounded-3 animate__animated animate__fadeIn">
              <i class="bi bi-chat-left-text-fill me-2"></i><strong class="fw-bold">Customer Feedback:</strong>
              <p class="mb-0 small text-success-emphasis">"{{ delivery.feedback }}"</p>
            </div>
          </div>
        </div>
      </div>
    </div>
  </div>
</template>

<script>
export default {
  name: "CarrierDashboard",
  data() {
    return {
      // Sample data for active deliveries
      deliveries: [
        {
          id: "acc-1",
          itemType: "Electronics",
          itemDescription: "MacBook Pro laptop in original packaging",
          senderName: "Emily Chen",
          senderPhone: "(555) 123-4567",
          receiverName: "John Smith",
          receiverPhone: "(555) 234-5678",
          pickupAddress: "123 Tech Street, Boston, MA 02101",
          dropoffAddress: "456 Innovation Ave, New York, NY 10001",
          status: "in-transit", // Example status: currently in transit
          amount: 40,
          specialInstructions: "Handle with extreme care. Receiver available after 3 PM.",
          requiresSignature: true,
          isFragile: true,
          acceptedAt: "2024-07-08T11:30:00Z",
          estimatedDelivery: "Today 6:00 PM"
        },
        {
          id: "acc-2",
          itemType: "Documents",
          itemDescription: "Legal documents in sealed envelope",
          senderName: "Michael Rodriguez",
          senderPhone: "(555) 345-6789",
          receiverName: "Sarah Johnson",
          receiverPhone: "(555) 456-7890",
          pickupAddress: "789 Legal Plaza, Boston, MA 02102",
          dropoffAddress: "321 Business Center, New York, NY 10002",
          status: "accepted", // Example status: ready for pickup
          amount: 25,
          specialInstructions: "Must be delivered to reception desk. Ask for Sarah Johnson.",
          requiresSignature: true,
          isFragile: false,
          acceptedAt: "2024-07-09T09:45:00Z",
          estimatedDelivery: "Tomorrow 2:00 PM"
        },
        {
          id: "acc-3",
          itemType: "Furniture",
          itemDescription: "Small bedside table (disassembled)",
          senderName: "Olivia Brown",
          senderPhone: "(555) 987-6543",
          receiverName: "James Wilson",
          receiverPhone: "(555) 876-5432",
          pickupAddress: "101 Woodwork Rd, Boston, MA 02104",
          dropoffAddress: "202 Living St, New York, NY 10004",
          status: "picked-up", // Example status: picked up, awaiting transit
          amount: 55,
          specialInstructions: "Use hand truck for transport. Drop off at garage door.",
          requiresSignature: false,
          isFragile: false,
          acceptedAt: "2024-07-09T13:00:00Z",
          estimatedDelivery: "Today 8:00 PM"
        }
      ],
      // Sample data for completed deliveries
      completedDeliveries: [
        {
          id: "comp-1",
          itemType: "Medicine",
          itemDescription: "Prescription medication",
          senderName: "Lisa Wang",
          senderPhone: "(555) 567-8901",
          receiverName: "Robert Davis",
          receiverPhone: "(555) 678-9012",
          pickupAddress: "567 Pharmacy Lane, Boston, MA 02103",
          dropoffAddress: "890 Residential St, New York, NY 10003",
          status: "delivered",
          amount: 35,
          requiresSignature: true,
          isFragile: false,
          acceptedAt: "2024-07-07T10:00:00Z",
          estimatedDelivery: "Yesterday 4:00 PM",
          completedAt: "2024-07-07T15:45:00Z",
          earnings: 35,
          rating: 5,
          feedback: "Excellent service! Very punctual and professional."
        },
        {
          id: "comp-2",
          itemType: "Electronics",
          itemDescription: "iPhone 15 Pro",
          senderName: "David Kim",
          senderPhone: "(555) 789-0123",
          receiverName: "Maria Garcia",
          receiverPhone: "(555) 890-1234",
          pickupAddress: "Apple Store, Boston, MA",
          dropoffAddress: "Home Address, New York, NY",
          status: "delivered",
          amount: 30,
          requiresSignature: false,
          isFragile: true,
          acceptedAt: "2024-07-06T14:20:00Z",
          estimatedDelivery: "Jul 6 8:00 PM",
          completedAt: "2024-07-06T19:30:00Z",
          earnings: 30,
          rating: 4,
          feedback: "Good delivery, but a bit late."
        }
      ]
    };
  },
  computed: {
    /**
     * Calculates the total earnings from all completed deliveries.
     * @returns {number} The sum of earnings.
     */
    totalEarnings() {
      return this.completedDeliveries.reduce((sum, d) => sum + d.earnings, 0);
    },
    /**
     * Calculates the average rating from all completed deliveries.
     * Returns 0 if there are no completed deliveries to avoid division by zero.
     * @returns {number} The average rating.
     */
    averageRating() {
      if (this.completedDeliveries.length === 0) return 0;
      return (
        this.completedDeliveries.reduce((sum, d) => sum + (d.rating || 0), 0) /
        this.completedDeliveries.length
      );
    },
  },
  methods: {
   
    getStatusLabel(status) {
      switch (status) {
        case "accepted": return "Ready for Pickup";
        case "picked-up": return "Picked Up";
        case "in-transit": return "In Transit";
        case "delivered": return "Delivered";
        default: return status;
      }
    },
   
    getStatusBadgeClass(status) {
      switch (status) {
        case "accepted": return "badge bg-primary text-white"; // Ready for pickup: Primary blue
        case "picked-up": return "badge bg-warning text-dark"; // Picked up: Warning yellow
        case "in-transit": return "badge bg-info text-dark"; // In transit: Info blue
        case "delivered": return "badge bg-success text-white"; // Delivered: Success green
        default: return "badge bg-secondary"; // Default for unknown statuses
      }
    },
   
    updateDeliveryStatus(id, newStatus) {
      this.deliveries = this.deliveries.map(d =>
        d.id === id ? { ...d, status: newStatus } : d
      );
    },
    
    goToPostTrip() {
      if (this.$router) {
        this.$router.push("/post-trip");
      } else {
        alert("Vue Router is not configured or '/post-trip' route is missing.");
      }
    },
   
    goToConfirmDelivery(id) {
        if (this.$router) {
            this.$router.push(`/cnf-delivery/${id}`);
        } else {
            alert(`Simulating confirmation for delivery ID: ${id}. In a real app, this would navigate to a confirmation screen.`);
          
        }
    },
   
    getInitials(name) {
      if (!name) return '';
      return name
        .split(" ")
        .map(part => part.charAt(0).toUpperCase())
        .join("");
    },
   
    formatDateTime(dateTimeString) {
      if (!dateTimeString) return 'N/A';
      const options = { year: 'numeric', month: 'short', day: 'numeric', hour: 'numeric', minute: 'numeric', hour12: true };
      return new Date(dateTimeString).toLocaleString('en-US', options);
    },
   
    openChat(phoneNumber) {
        alert(`Simulating chat with: ${phoneNumber}. (In a real app, this would open a chat client)`);
        // Example for WhatsApp: window.open(`https://wa.me/${phoneNumber.replace(/\D/g, '')}`, '_blank');
    },
    /**
     * Initiates a phone call. In a real app, this uses the 'tel:' URI scheme.
     * @param {string} phoneNumber - The phone number to call.
     */
    callNumber(phoneNumber) {
        alert(`Calling: ${phoneNumber}. (In a real app, this would initiate a phone call)`);
        // Example for phone call: window.location.href = `tel:${phoneNumber.replace(/\D/g, '')}`;
    }
  },
  mounted() {
    // This part is for handling messages coming from other routes (e.g., after a successful delivery confirmation)
    if (this.$route && this.$route.query.message) {
      const message = this.$route.query.message;
      const type = this.$route.query.type || 'info'; // Default to info if type not specified
      alert(`${type.charAt(0).toUpperCase() + type.slice(1)}: ${message}`);
      // Clear query parameters to prevent the message from reappearing on refresh
      this.$router.replace({ query: null }).catch(() => {}); // Catch navigation error if replacing same path
    }
  }
};
</script>

<style scoped>

:root {
  --bs-primary-dark: #6a6ee0; /* A darker shade for dark mode primary */
  --bs-primary-dark-border-subtle: #4a4eaa;
  --bs-primary-bg-subtle-dark: #3a3a5e; /* Darker subtle background for header */
}

/* --- Header Section --- */
.header-section {
  background: linear-gradient(90deg, var(--bs-primary-bg-subtle) 0%, var(--bs-light) 100%);
  padding: 2rem;
  border-radius: 1.25rem; /* Softer corners */
  box-shadow: 0 0.5rem 1.5rem rgba(0, 0, 0, 0.08); /* Subtle shadow for depth */
  margin-bottom: 2.5rem !important; /* Increased margin for spacing */
  align-items: center; /* Vertically align items in the center for larger screens */
}

.header-section h1 {
  font-size: 1.8rem; /* Slightly larger title */
}

.header-section p {
  color: var(--bs-secondary); /* Text muted for description */
  font-size: 0.95rem;
}

.post-trip-btn {
  font-weight: 600;
  padding: 0.75rem 1.75rem; /* Larger padding */
  border-radius: 2.5rem; /* Pill-shaped button */
  transition: all 0.3s ease; /* Smooth transitions for hover effects */
  background-color: var(--bs-success);
  border-color: var(--bs-success);
  box-shadow: 0 4px 10px rgba(var(--bs-success-rgb), 0.3); /* Soft shadow */
}

.post-trip-btn:hover {
  transform: translateY(-3px); /* Lift effect on hover */
  box-shadow: 0 6px 15px rgba(var(--bs-success-rgb), 0.4); /* Enhanced shadow on hover */
}

/* --- Statistics Cards --- */
.stat-card {
  border: none;
  border-radius: 1.25rem; /* Consistent rounded corners */
  box-shadow: 0 0.5rem 1.5rem rgba(0, 0, 0, 0.08);
  transition: all 0.3s ease;
  overflow: hidden; /* Ensures content stays within rounded corners */
  background-color: var(--bs-white); /* Explicit white background */
}

.stat-card:hover {
  transform: translateY(-5px); /* Lift effect on hover */
  box-shadow: 0 0.75rem 2rem rgba(0, 0, 0, 0.12); /* More prominent shadow on hover */
}

.stat-card h4 {
  font-size: 1.6rem; /* Larger numbers */
  color: var(--bs-dark); /* Darker text for emphasis */
}

.stat-card p {
  font-size: 0.85rem; /* Smaller, subtle description */
}

.icon-circle {
  width: 65px; /* Larger circles for icons */
  height: 65px;
  border-radius: 50%;
  display: flex;
  align-items: center;
  justify-content: center;
  margin: 0 auto 1.25rem; /* Centered with more space below */
  font-size: 2.8rem; /* Larger icon size */
  animation: pulse 2s infinite cubic-bezier(0.66, 0, 0, 1); /* Gentle pulse animation */
}

/* Animation for icons */
@keyframes pulse {
  0% { transform: scale(0.95); opacity: 0.7; }
  70% { transform: scale(1); opacity: 1; }
  100% { transform: scale(0.95); opacity: 0.7; }
}

/* --- Modern Tabs --- */
.nav-tabs-modern {
  border-bottom: 2px solid var(--bs-border-color-translucent); /* Subtle bottom border */
}

.nav-tabs-modern .nav-link {
  color: var(--bs-secondary-emphasis); /* Muted color for inactive tabs */
  font-weight: 500;
  padding: 0.85rem 1.75rem; /* Larger clickable area */
  border: none;
  border-bottom: 3px solid transparent; /* Highlight active tab with a border */
  transition: all 0.3s ease; /* Smooth transition for hover/active states */
  border-top-left-radius: 0.75rem; /* Rounded top corners */
  border-top-right-radius: 0.75rem;
}

.nav-tabs-modern .nav-link.active {
  color: var(--bs-primary); /* Primary color for active tab */
  border-color: var(--bs-primary); /* Primary color border */
  background-color: var(--bs-body-bg); /* Match body background for a flush look */
  font-weight: 600; /* Bolder text for active tab */
}

.nav-tabs-modern .nav-link:hover:not(.active) {
  color: var(--bs-primary); /* Highlight color on hover */
  border-color: var(--bs-primary-border-subtle); /* Subtle border color on hover */
  background-color: var(--bs-light); /* Light background on hover */
}

/* --- Delivery Cards (Active & Completed) --- */
.delivery-card {
  border: none;
  border-radius: 1.25rem; /* Consistent rounded corners */
  box-shadow: 0 0.25rem 0.75rem rgba(0, 0, 0, 0.06); /* Lighter shadow for cards */
  transition: all 0.3s ease;
  background-color: var(--bs-white); /* Explicit white background */
}

.delivery-card:hover {
  transform: translateY(-3px); /* Subtle lift on hover */
  box-shadow: 0 0.5rem 1.25rem rgba(0, 0, 0, 0.1); /* Enhanced shadow on hover */
}

.delivery-card .card-header {
  background-color: var(--bs-body-bg); /* Background color to blend with container */
  border-bottom: 1px solid var(--bs-border-color-translucent); /* Light separator */
  padding: 1.25rem 1.5rem !important; /* More padding */
}

.delivery-card .card-body {
  padding: 1.5rem !important; /* More padding */
}

.card-title {
  font-size: 1.25rem; /* Slightly larger title for items */
}

/* Specific layout for pickup/dropoff */
.delivery-details-grid p {
  display: flex;
  align-items: center;
  gap: 0.75rem; /* More space between icon and text */
  margin-bottom: 0.75rem;
  font-size: 0.95rem;
}

.delivery-details-grid i {
  font-size: 1.2rem; /* Larger icons for addresses */
  min-width: 1.2em; /* Ensure consistent spacing for icons */
  text-align: center;
}

/* Initials Circle for Sender/Receiver */
.initials-circle {
  min-width: 44px; /* Larger circle for initials */
  height: 44px;
  border-radius: 50%;
  display: flex;
  justify-content: center;
  align-items: center;
  font-size: 0.95rem;
  font-weight: bold;
  box-shadow: 0 2px 6px rgba(0, 0, 0, 0.08); /* Soft shadow */
  background-color: var(--bs-secondary-bg-subtle); /* Default subtle background */
  color: var(--bs-secondary-emphasis); /* Default text color */
}

/* Specific colors for initials circles based on context */
.initials-circle.bg-info-subtle { color: var(--bs-info-text-emphasis); }
.initials-circle.bg-primary-subtle { color: var(--bs-primary-text-emphasis); }

/* Contact Block styling */
.contact-block {
    padding: 0.75rem 0; /* Vertical padding */
    border-top: 1px dashed var(--bs-border-color-translucent); /* Dashed separator */
}
.contact-block:first-of-type {
    border-top: none; /* No top border for the first one */
}

/* Contact Buttons (Chat/Call) */
.btn-icon {
  width: 42px; /* Slightly larger buttons */
  height: 42px;
  display: flex;
  align-items: center;
  justify-content: center;
  border-radius: 50%;
  font-size: 1.1rem; /* Larger icon */
  transition: all 0.2s ease;
  border-color: var(--bs-border-color); /* Lighter border */
  color: var(--bs-secondary); /* Muted color */
}

.btn-icon:hover {
  background-color: var(--bs-primary); /* Primary color on hover */
  border-color: var(--bs-primary);
  color: white;
  transform: scale(1.08); /* Pop effect on hover */
  box-shadow: 0 2px 8px rgba(var(--bs-primary-rgb), 0.2);
}

/* Special Instructions/Feedback Alerts */
.alert {
  border-left: 6px solid; /* More prominent left border */
  border-radius: 0.85rem; /* Rounded corners for alerts */
  font-size: 0.9rem;
}

.alert strong {
    font-size: 1rem; /* Slightly larger bold text */
}

/* Action Buttons within cards */
.delivery-card .btn {
  font-weight: 500;
  border-radius: 0.85rem; /* Rounded buttons */
  padding: 0.7rem 1.4rem; /* More padding */
  transition: all 0.2s ease;
}

.delivery-card .btn-primary:hover,
.delivery-card .btn-warning:hover,
.delivery-card .btn-success:hover {
  transform: translateY(-2px); /* Lift effect */
  box-shadow: 0 4px 10px rgba(0, 0, 0, 0.1); /* Soft shadow */
}

/* --- Responsive Adjustments --- */
@media (max-width: 767.98px) {
  .header-section {
    padding: 1.5rem;
    border-radius: 1rem;
    margin-bottom: 2rem !important;
  }
  .header-section h1 {
    font-size: 1.6rem;
  }
  .post-trip-btn {
    width: 100%; /* Full width on small screens */
    padding: 0.65rem 1.25rem;
  }
  .stat-card {
    padding: 1rem !important;
    border-radius: 1rem;
  }
  .stat-card h4 {
    font-size: 1.4rem;
  }
  .stat-card .icon-circle {
    width: 55px;
    height: 55px;
    font-size: 2.2rem;
    margin-bottom: 0.75rem;
  }
  .nav-tabs-modern .nav-item {
    flex: 1 1 auto; /* Distribute tabs evenly */
    text-align: center;
  }
  .nav-tabs-modern .nav-link {
    padding: 0.65rem 1rem;
    font-size: 0.9rem;
  }
  .delivery-card {
    border-radius: 1rem;
  }
  .delivery-card .card-header,
  .delivery-card .card-body {
    padding: 1rem !important; /* Smaller padding on small screens */
  }
  .delivery-card .card-title {
    font-size: 1.1rem;
  }
  .contact-block {
      flex-direction: column; /* Stack contact info vertically */
      align-items: flex-start !important;
  }
  .contact-block > div:last-child {
      margin-top: 0.75rem; /* Space between info and buttons */
      width: 100%;
      justify-content: flex-end; /* Align buttons to the right */
  }
  .delivery-card .btn {
    width: 100%; /* Full width action buttons */
  }
}

/* --- Dark Mode Compatibility --- */
/* Add this to your global stylesheet or ensure your theme toggle adds 'theme-dark' to <body> */
body.theme-dark {
  background-color: #1a1a1a;
  color: #e0e0e0; /* Lighter text color */
}

body.theme-dark .header-section {
  background: linear-gradient(90deg, var(--bs-primary-bg-subtle-dark) 0%, #2a2a2a 100%);
  color: #e0e0e0;
  box-shadow: 0 0.5rem 1.5rem rgba(0, 0, 0, 0.2);
}

body.theme-dark .card,
body.theme-dark .delivery-card {
  background-color: #2a2a2a; /* Darker card background */
  border-color: #3a3a3a; /* Darker border */
  color: #e0e0e0;
  box-shadow: 0 0.25rem 0.75rem rgba(0, 0, 0, 0.15);
}
body.theme-dark .card:hover,
body.theme-dark .delivery-card:hover {
  box-shadow: 0 0.75rem 2rem rgba(0, 0, 0, 0.25);
}


body.theme-dark .card-header,
body.theme-dark .delivery-card .card-header {
  background-color: #2a2a2a; /* Match card background */
  border-bottom-color: #3a3a3a;
}

body.theme-dark .text-muted,
body.theme-dark .text-secondary {
  color: #b0b0b0 !important; /* Lighter muted text */
}

body.theme-dark .text-dark-emphasis {
  color: #f8f9fa !important; /* White text for emphasis */
}

body.theme-dark .nav-tabs-modern {
  border-bottom-color: #3a3a3a;
}

body.theme-dark .nav-tabs-modern .nav-link {
  color: #b0b0b0;
}

body.theme-dark .nav-tabs-modern .nav-link.active {
  color: var(--bs-primary-dark); /* Adjust primary for dark theme */
  border-color: var(--bs-primary-dark);
  background-color: #2a2a2a; /* Match card background */
}

body.theme-dark .nav-tabs-modern .nav-link:hover:not(.active) {
  color: var(--bs-primary-dark);
  border-color: var(--bs-primary-dark-border-subtle);
  background-color: #3a3a3a; /* Darker hover background */
}

/* Dark mode specific icon circle backgrounds */
body.theme-dark .bg-success-subtle { background-color: rgba(var(--bs-success-rgb), 0.2) !important; color: var(--bs-success) !important; }
body.theme-dark .bg-primary-subtle { background-color: rgba(var(--bs-primary-rgb), 0.2) !important; color: var(--bs-primary) !important; }
body.theme-dark .bg-warning-subtle { background-color: rgba(var(--bs-warning-rgb), 0.2) !important; color: var(--bs-warning) !important; }
body.theme-dark .bg-info-subtle { background-color: rgba(var(--bs-info-rgb), 0.2) !important; color: var(--bs-info) !important; }

body.theme-dark .initials-circle {
  background-color: rgba(var(--bs-secondary-rgb), 0.2);
  color: #e0e0e0;
}

body.theme-dark .btn-outline-secondary {
  border-color: #555;
  color: #b0b0b0;
}

body.theme-dark .btn-outline-secondary:hover {
  background-color: var(--bs-primary-dark);
  border-color: var(--bs-primary-dark);
  color: #fff;
}

body.theme-dark .alert-info {
  background-color: #2c3a4a;
  border-color: #4a6788;
  color: #a0c0e0;
}

body.theme-dark .alert-success {
  background-color: #2d423a;
  border-color: #4f7d6a;
  color: #a0e0c0;
}

body.theme-dark .badge.bg-primary { background-color: var(--bs-primary-dark) !important; }
body.theme-dark .badge.bg-warning { background-color: var(--bs-warning-dark) !important; } /* assuming you define this */
body.theme-dark .badge.bg-info { background-color: var(--bs-info-dark) !important; } /* assuming you define this */
body.theme-dark .badge.bg-success { background-color: var(--bs-success-dark) !important; } /* assuming you define this */

</style>