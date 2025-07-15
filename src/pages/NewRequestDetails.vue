I've updated your `NewRequestDetails.vue` component. The primary change ensures that the **sender and receiver names derived from email addresses are properly capitalized**, with the first letter of each word in the name part of the email becoming uppercase.

This modification is within the `deriveNameFromEmail` helper function, which is used when setting up the `sender` and `receiver` objects in the `transformRealDataToMock` method.

```vue
<template>
  <div class="new-request-details-container py-5 bg-light min-vh-100">
   <pre>{{ JSON.stringify(zz, null, 2)}}</pre> {{  }}
    <div class="container">
      <div class="d-flex align-items-center mb-4">
        <button @click="goBack" class="btn btn-outline-secondary rounded-pill me-3">
          <i class="bi bi-arrow-left me-2"></i> Back
        </button>
        <h2 class="mb-0 fw-bold text-primary">Delivery Request Details</h2>
      </div>

      <transition name="toast-fade-slide">
        <div v-if="toast.show" :class="['custom-toast', `toast-${toast.type}`, 'animate__animated', toast.animationClass]" role="alert">
          <div class="d-flex align-items-center">
            <i :class="['bi', toast.icon, 'me-2', 'toast-icon']"></i>
            <span class="toast-message">{{ toast.message }}</span>
          </div>
          <button type="button" class="toast-close-btn" @click="hideToast" aria-label="Close">
            <i class="bi bi-x-lg"></i>
          </button>
        </div>
      </transition>

      <div v-if="loading" class="text-center py-5">
        <div class="spinner-border text-primary" role="status">
          <span class="visually-hidden">Loading...</span>
        </div>
        <p class="mt-3 text-muted">Fetching request details...</p>
      </div>

      <div v-else-if="!$route.query.id" class="text-center py-5">
        <i class="bi bi-exclamation-circle-fill text-warning fs-1 mb-3"></i>
        <h3 class="text-dark">Missing Request ID</h3>
        <p class="text-muted">No delivery request ID was provided in the URL. Please navigate from a valid requests list or ensure the URL is correct.</p>
        <router-link to="/view-requests" class="btn btn-primary mt-3">View All Requests</router-link>
      </div>

      <div v-else-if="!request" class="text-center py-5">
        <i class="bi bi-x-circle-fill text-danger fs-1 mb-3"></i>
        <h3 class="text-dark">Request Not Found</h3>
        <p class="text-muted">The delivery request could not be found. It might be invalid, completed, or no longer available.</p>
        <router-link to="/view-requests" class="btn btn-primary mt-3">View All Requests</router-link>
      </div>

      <div v-else class="row">
        <div class="col-lg-8 mb-4">
          <div class="card shadow-sm border-0 rounded-4 mb-4">
            <div class="card-body p-4">
              <div class="d-flex align-items-center mb-3">
                <i class="bi bi-box-seam fs-3 text-primary me-3"></i>
                <div>
                  <h4 class="card-title mb-1 fw-bold">{{ request.packageType }} Delivery</h4>
                  <p class="card-subtitle text-muted">{{ request.id }} - <span :class="['badge', getStatusBadgeClass(request.status)]">{{ request.status }}</span></p>
                </div>
              </div>

              <hr class="my-3">

              <div class="row g-3 mb-4">
                <div class="col-md-6">
                  <h6 class="fw-semibold text-muted mb-2">
                    <i class="bi bi-geo-alt-fill me-2 text-success"></i>Pickup Location
                  </h6>
                  <p class="mb-0">{{ request.pickupLocation }}</p>
                  <small class="text-muted">{{ request.pickupTime }}</small>
                </div>
                <div class="col-md-6">
                  <h6 class="fw-semibold text-muted mb-2">
                    <i class="bi bi-geo-alt-fill me-2 text-danger"></i>Delivery Location
                  </h6>
                  <p class="mb-0">{{ request.deliveryLocation }}</p>
                  <small class="text-muted">{{ request.deliveryTime }}</small>
                </div>
              </div>

              <div class="row g-3 mb-4">
                <div class="col-md-6">
                  <h6 class="fw-semibold text-muted mb-2">
                    <i class="bi bi-calendar-check me-2 text-info"></i>Delivery Window
                  </h6>
                  <p class="mb-0">{{ request.deliveryWindow }}</p>
                </div>
                <div class="col-md-6">
                  <h6 class="fw-semibold text-muted mb-2">
                    <i class="bi bi-currency-dollar me-2 text-warning"></i>Offered Price
                  </h6>
                  <p class="mb-0 fs-5 fw-bold text-success">{{ request.offeredPrice }}</p>
                </div>
              </div>

              <h6 class="fw-semibold text-muted mb-2">
                <i class="bi bi-box me-2 text-secondary"></i>Package Details
              </h6>
              <p class="mb-0">{{ request.packageDetails }}</p>

            </div>
          </div>

          <div class="container-fluid p-0 m-0">
            <div class="row g-3">
              <div class="col-md-6">
                <div class="card shadow-sm border-0 rounded-4 h-100">
                  <div class="card-body p-4">
                    <h5 class="card-title fw-bold mb-3">
                      <i class="bi bi-person-fill me-2 text-primary"></i>Sender Information
                    </h5>
                    <div class="d-flex align-items-center mb-3">
                      <img :src="request.sender.avatar" class="rounded-circle me-3 sender-avatar" alt="Sender Avatar" />
                      <div>
                        <h6 class="mb-0 fw-semibold">{{ request.sender.name }}</h6>
                        <span class="text-muted small">Member since {{ request.sender.memberSince }}</span>
                      </div>
                    </div>
                    <p class="mb-2"><i class="bi bi-star-fill text-warning me-1"></i> {{ request.sender.rating }} ({{ request.sender.reviews }} Reviews)</p>
                    <p class="mb-0"><i class="bi bi-phone-fill me-1 text-info"></i> {{ request.sender.phone }}</p>
                    <p class="mb-0"><i class="bi bi-envelope-fill me-1 text-info"></i> {{ request.sender.email }}</p>
                    <hr class="my-3">
                    <button class="btn btn-outline-primary w-100 rounded-pill" @click="contactSender">
                      <i class="bi bi-chat-dots me-2"></i> Contact Sender
                    </button>
                  </div>
                </div>
              </div>
              <div class="col-md-6">
                <div class="card shadow-sm border-0 rounded-4 h-100">
                  <div class="card-body p-4">
                    <h5 class="card-title fw-bold mb-3">
                      <i class="bi bi-person-fill me-2 text-primary"></i>Receiver Information
                    </h5>
                    <div class="d-flex align-items-center mb-3">
                      <img :src="request.receiver.avatar" class="rounded-circle me-3 sender-avatar" alt="Receiver Avatar" />
                      <div>
                        <h6 class="mb-0 fw-semibold">{{ request.receiver.name }}</h6>
                        <span class="text-muted small">Member since {{ request.receiver.memberSince }}</span>
                      </div>
                    </div>
                    <p class="mb-2"><i class="bi bi-star-fill text-warning me-1"></i> {{ request.receiver.rating }} ({{ request.receiver.reviews }} Reviews)</p>
                    <p class="mb-0"><i class="bi bi-phone-fill me-1 text-info"></i> {{ request.receiver.phone }}</p>
                    <p class="mb-0"><i class="bi bi-envelope-fill me-1 text-info"></i> {{ request.receiver.email }}</p>
                    <hr class="my-3">
                    <button class="btn btn-outline-primary w-100 rounded-pill" @click="contactreciver">
                      <i class="bi bi-chat-dots me-2"></i> Contact Receiver
                    </button>
                  </div>
                </div>
              </div>
            </div>
          </div>
        </div>

        <div class="col-lg-4">
          <div class="card shadow-sm border-0 rounded-4 mb-4 sticky-top-card">
            <div class="card-body p-4 text-center">
              <h5 class="card-title fw-bold mb-3">Actions</h5>
              <p class="text-muted small mb-4">You have 2 hours left to respond to this request.</p>
              <div class="d-grid gap-3">
                <button class="d-flex align-items-center justify-content-center btn btn-success btn-lg rounded-pill" @click="acceptRequest" :disabled="zz.deldata[0].confirmation_by_sender || zz.tripdata[0].transport_trip_id === zz.deldata[0].confirmation_by_sender ">
                  <i class="bi bi-check-circle me-2"></i>
                  <pre v-if="zz.deldata[0].confirmation_by_sender === null">Accept Request  </pre>
                    
                  <pre v-if="zz.deldata[0].confirmation_by_sender && zz.tripdata[0].transport_trip_id !== zz.deldata[0].confirmation_by_sender ">offer Not accepted </pre>
                   <pre v-if="zz.deldata[0].confirmation_by_sender && zz.tripdata[0].transport_trip_id === zz.deldata[0].confirmation_by_sender ">Accepted Offer Request by  You</pre>
                </button>
                <button class="btn btn-outline-danger btn-lg rounded-pill" @click="declineRequest" :disabled="zz.deldata[0].confirmation_by_sender ">
                  <i class="bi bi-x-circle me-2"></i> Decline Request
                </button>
                <button class="btn btn-outline-secondary rounded-pill" @click="shareRequest" :disabled="zz.deldata[0].confirmation_by_sender ">
                  <i class="bi bi-share me-2"></i> Share
                </button>
              </div>
            </div>
          </div>

          <div class="card shadow-sm border-0 rounded-4">
            <div class="card-body p-0">
              <h6 class="text-center py-2 mb-0 fw-bold border-bottom">
                <i class="bi bi-map-fill me-2 text-primary"></i>Route Map
              </h6>
              <InteractiveMap
                v-if="request.coordinates && request.coordinates.pickup && request.coordinates.delivery"
                :pickup-coords="request.coordinates.pickup"
                :delivery-coords="request.coordinates.delivery"
                :user-location-coords="userLocation" />
              <div v-else class="text-center p-3 text-muted">
                Map coordinates not available for this request.
              </div>
              <div class="p-3 text-center">
                <p class="mb-0 text-muted small">Approx. distance: {{ request.approxDistance || 'N/A' }} km</p>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  </div>
</template>

<script>
import InteractiveMap from '../compo/InteractiveMap.vue';
import { decryptUserData } from '../cry'; // Assuming this utility is correctly implemented

export default {
  name: 'NewRequestDetails',
  components: {
    InteractiveMap
  },
  // The 'id' prop will now receive the *encrypted* data string from the route query
  props: {
    id: {
      type: String, // This will be the encrypted string from the query
      required: true
    }
  },

  data() {
    return {
      request: null, // Transformed data for display
      zz: null, // To store the raw API response for debugging
      loading: true, // Loading state
      datatopage: null, // To store the decrypted data for inspection (e.g., prodid, transid)
      allgetdata: null, // To store the raw API response (tripdata, deldata)
      toast: { // Toast notification state
        show: false,
        message: '',
        type: 'success', // success, danger, info, warning
        icon: '',
        animationClass: ''
      },
      toastTimeout: null, // Timeout ID for hiding toast
      userLocation: null, // User's live geolocation for map centering

      // Mock data is no longer actively used for display if real API works,
      // but kept for reference on expected structure if needed.
      mockRequests: {
        'REQ-1752086836594': {
          id: 'REQ-1752086836594',
          packageType: 'Small Parcel',
          status: 'New',
          pickupLocation: '123 MG Road, Begumpet, Hyderabad',
          pickupTime: 'Today, 10:00 AM - 11:00 AM',
          deliveryLocation: '456 Jubilee Hills Road, Hyderabad',
          deliveryTime: 'Today, 02:00 PM - 03:00 PM',
          deliveryWindow: 'Within 4 hours',
          offeredPrice: '₹ 250.00',
          packageDetails: 'Documents in an A4 envelope. Needs careful handling. Weight: approx 0.5 kg. Dimensions: 25x35x2 cm.',
          approxDistance: 15,
          sender: {
            name: 'Priya Sharma',
            avatar: 'https://i.pravatar.cc/150?img=32',
            rating: '4.8',
            reviews: 124,
            memberSince: '2023',
            phone: '+91 98765 43210',
            email: 'priya.s@example.com'
          },
          receiver: { // Added receiver for consistency, assuming it's available in mock structure
            name: 'Rahul Kumar',
            avatar: 'https://i.pravatar.cc/150?img=51',
            rating: '4.7',
            reviews: 90,
            memberSince: '2022',
            phone: '+91 99001 12233',
            email: 'rahul.k@example.com'
          },
          coordinates: {
            pickup: { lat: 17.4399, lng: 78.4475 }, // Begumpet, Hyderabad
            delivery: { lat: 17.4206, lng: 78.4116 } // Jubilee Hills, Hyderabad
          }
        },
        // ... (other mock requests if you want to keep them)
      }
    };
  },
  created() {
    this.fetchRequestDetails();
    this.getUserLiveLocation();
  },
  watch: {
    // Watch for changes in the 'id' prop (the encrypted string) to refetch details
    // Also watch $route.query.id as it's the direct source
    '$route.query.id': 'fetchRequestDetails',
    // Update document title based on request data
    request(newVal) {
      if (newVal) {
        document.title = `Request: ${newVal.id} - ${newVal.packageType}`;
      } else if (!this.loading && this.$route.query.id) {
        document.title = `Request Not Found - ${this.$route.query.id.substring(0, 10)}...`; // Show truncated encrypted ID
      } else {
        document.title = 'Delivery Request Details';
      }
    }
  },
  beforeUnmount() {
    // Clear any pending toast timeouts to prevent memory leaks
    if (this.toastTimeout) {
      clearTimeout(this.toastTimeout);
    }
  },
  methods: {
    /**
     * Generates a unique linear gradient avatar URL based on the provided email.
     * The gradient colors are derived from a hash of the email.
     * This method returns a data URL for an SVG image.
     * @param {string} email - The user's email address.
     * @returns {string} Data URL for an SVG image with a linear gradient.
     */
    generateGradientAvatar(email) {
      if (!email) return 'data:image/svg+xml;base64,PHN2ZyB3aWR0aD0iNjQiIGhlaWdodD0iNjQiIHZpZXdCb2M9IjAgMCA2NCA2NCIgeG1sbnM9Imh0dHA6Ly93d3cudzMub3JnLzIwMDAvc3ZnIj48cmVjdCB3aWR0aD0iNjQiIGhlaWdodD0iNjQiIGZpbGw9IiNDQ0NDQ2IvPjwvc3ZnPg=='; // Default grey SVG

      let hash = 0;
      for (let i = 0; i < email.length; i++) {
        hash = email.charCodeAt(i) + ((hash << 5) - hash);
      }

      const colors = [];
      for (let i = 0; i < 3; i++) {
        const value = (hash >> (i * 8)) & 0xFF;
        colors.push(`hsl(${value % 360}, ${75 + (value % 25)}%, ${60 + (value % 20)}%)`);
      }

      const svg = `
        <svg width="64" height="64" viewBox="0 0 64 64" xmlns="http://www.w3.org/2000/svg">
          <defs>
            <linearGradient id="gradient" x1="0%" y1="0%" x2="100%" y2="100%">
              <stop offset="0%" style="stop-color:${colors[0]};stop-opacity:1" />
              <stop offset="50%" style="stop-color:${colors[1]};stop-opacity:1" />
              <stop offset="100%" style="stop-color:${colors[2]};stop-opacity:1" />
            </linearGradient>
          </defs>
          <rect width="64" height="64" fill="url(#gradient)" />
        </svg>
      `;
      return 'data:image/svg+xml;base64,' + btoa(svg);
    },

    // --- Data Transformation Logic ---
    transformRealDataToMock(tripData, delData, prodIdToMatch) {
      // Find the specific trip and delivery data matching the prodIdToMatch (which is the actual product_id)
      const relevantTrip = tripData.find(trip => trip.offeredprod_ids && trip.offeredprod_ids.includes(prodIdToMatch));
      const relevantDel = delData.find(del => del.product_id === prodIdToMatch);

      if (!relevantTrip || !relevantDel) {
        console.warn(`Could not find complete data for product_id: ${prodIdToMatch}`);
        return null; // Return null if essential data is missing
      }

      // Helper function to format date and time strings
      const formatDateTime = (dateStr, timeStr) => {
        if (!dateStr || !timeStr) return 'N/A';

        const [year, month, day] = dateStr.split('-').map(Number);
        const [hours, minutes] = timeStr.split(':').map(Number);

        // Create a Date object (month is 0-indexed in JavaScript Date, so month - 1)
        const dateTime = new Date(year, month - 1, day, hours, minutes);

        // Get current date for 'Today'/'Tomorrow' logic (normalize to start of day)
        const today = new Date();
        today.setHours(0, 0, 0, 0);
        const tomorrow = new Date(today);
        tomorrow.setDate(today.getDate() + 1);

        let dayPrefix = '';
        if (dateTime.toDateString() === today.toDateString()) {
          dayPrefix = 'Today, ';
        } else if (dateTime.toDateString() === tomorrow.toDateString()) {
          dayPrefix = 'Tomorrow, ';
        } else {
          // For other dates, format as "Mon, Day Year"
          const options = { month: 'short', day: 'numeric', year: 'numeric' };
          dayPrefix = `${dateTime.toLocaleDateString(undefined, options)}, `;
        }

        // Format time to 12-hour with AM/PM
        const formattedTime = dateTime.toLocaleTimeString(undefined, {
          hour: '2-digit',
          minute: '2-digit',
          hour12: true
        });

        return `${dayPrefix}${formattedTime}`;
      };

      // Helper function to get approximate coordinates for known addresses
      // This should ideally be replaced with actual Geoapify or similar service
      const getCoordinates = (address, latitude, longitude) => {
        if (latitude && longitude) {
          return { lat: latitude, lng: longitude };
        }
        // Fallback for hardcoded coordinates if lat/long are missing from API
        if (address.includes('Guruitoli')) {
          return { lat: 24.0235457, lng: 84.0968845 };
        }
        if (address.includes('Eruveli- Thuppampady Road')) {
          return { lat: 9.920605704212418, lng: 76.40824397013918 };
        }
        if (address.includes('Hussa')) {
          return { lat: 18.9005459, lng: 77.6331181 };
        }
        if (address.includes('Safeer Newyork Gents Club')) {
          return { lat: 10.9886257, lng: 76.4510887 };
        }
        // Default central Hyderabad if no match or coordinates
        return { lat: 17.3850, lng: 78.4867 };
      };

      // Map item_type to packageType, considering special requirements
      const getPackageType = (itemType, specialRequirements) => {
        if (specialRequirements && specialRequirements.includes('Fragile item')) {
          return 'Fragile Parcel';
        }
        switch (itemType) {
          case 'documents':
            return 'Small Parcel (Documents)';
          case 'electronics':
            return 'Medium Box (Electronics)';
          case 'medicine':
            return 'Small Parcel (Medicine)';
          // Add more cases based on your `item_type` values if needed
          default:
            return 'General Item';
        }
      };

      // Construct package details string
      const packageDetailsArray = [];
      if (relevantDel.item_description) {
        packageDetailsArray.push(`Description: ${relevantDel.item_description}`);
      }
      packageDetailsArray.push(`Type: ${getPackageType(relevantDel.item_type, relevantDel.special_requirements)}`);

      if (relevantDel.item_weight) {
        packageDetailsArray.push(`Weight: ${relevantDel.item_weight} kg`);
      }
      if (relevantDel.item_length && relevantDel.item_width && relevantDel.item_height) {
        packageDetailsArray.push(`Dimensions: ${relevantDel.item_length}x${relevantDel.item_width}x${relevantDel.item_height} cm`);
      } else if (relevantTrip.max_package_size) {
        // Fallback to trip's max_package_size if individual item dimensions are missing
        packageDetailsArray.push(`Max Trip Dimensions: ${relevantTrip.max_package_size}`);
      }

      if (relevantDel.special_instructions) {
        packageDetailsArray.push(`Instructions: ${relevantDel.special_instructions}`);
      }
      if (relevantDel.special_requirements && relevantDel.special_requirements.length > 0) {
        packageDetailsArray.push(`Requirements: ${relevantDel.special_requirements.join(', ')}`);
      }

      // --- MODIFIED: Derive name from email and capitalize first letter of each part ---
      const deriveNameFromEmail = (email, fallbackName = 'Unknown User') => {
        if (!email) return fallbackName;
        // Take the part before '@'
        const namePart = email.split('@')[0];
        // Replace non-alphabetic characters (except perhaps periods or hyphens if desired) with spaces
        // Then split by spaces to get individual words/segments
        const words = namePart.replace(/[^a-zA-Z]/g, ' ').split(' ').filter(Boolean); // Filter out empty strings from multiple spaces
        // Capitalize the first letter of each word and join them
        return words.map(word => word.charAt(0).toUpperCase() + word.slice(1).toLowerCase()).join(' ') || fallbackName;
      };
      // --- END MODIFIED ---


      // Determine the status for display
      let displayStatus = 'New'; // Default if not explicitly accepted
      if (relevantTrip.status === 'accepted' && relevantTrip.accepted_product_id.includes(relevantDel.product_id)) {
          displayStatus = 'Accepted';
      }
      // You can add more status mappings as needed (e.g., 'pending', 'completed')

      // Placeholder for memberSince, rating, reviews for sender/receiver
      const defaultProfile = {
        rating: 'N/A',
        reviews: 0,
        memberSince: 'N/A'
      };

      return {
        id: relevantDel.product_id,
        packageType: getPackageType(relevantDel.item_type, relevantDel.special_requirements),
        status: displayStatus,
        pickupLocation: relevantDel.pickup_address,
        pickupTime: formatDateTime(relevantDel.pickup_date, relevantDel.pickup_time),
        deliveryLocation: relevantDel.dropoff_address,
        // Assuming delivery is same day as pickup, or can be adjusted based on delivery_timeframe
        deliveryTime: relevantDel.delivery_timeframe === 'same-day' ? formatDateTime(relevantDel.pickup_date, '23:59') : 'Flexible',
        deliveryWindow: relevantDel.delivery_timeframe || 'Flexible',
        offeredPrice: `₹ ${relevantDel.budget ? parseFloat(relevantDel.budget).toFixed(2) : '0.00'}`,
        packageDetails: packageDetailsArray.filter(Boolean).join('. '), // Filter out any empty strings and join
        // Approx distance is not in your provided data, keeping placeholder or assuming calculations on backend
        approxDistance: relevantDel.approx_distance || 'N/A', // Use actual approx_distance if available

        sender: {
          name: relevantDel.receiver_name || deriveNameFromEmail(relevantDel.email, 'Sender'), // Using receiver_name for sender if it's the package owner
          avatar: this.generateGradientAvatar(relevantDel.email), // Dynamic avatar for sender
          rating: defaultProfile.rating,
          reviews: defaultProfile.reviews,
          memberSince: defaultProfile.memberSince,
          phone: relevantDel.sender_phone || 'N/A',
          email: relevantDel.email || 'N/A'
        },
        receiver: {
          name: relevantDel.receiver_name || deriveNameFromEmail(relevantDel.receiver_email, 'Receiver'),
          avatar: this.generateGradientAvatar(relevantDel.receiver_email), // Dynamic avatar for receiver
          rating: defaultProfile.rating,
          reviews: defaultProfile.reviews,
          memberSince: defaultProfile.memberSince,
          phone: relevantDel.receiver_phone || 'N/A',
          email: relevantDel.receiver_email || 'N/A'
        },
        coordinates: {
          pickup: getCoordinates(relevantDel.pickup_address, relevantDel.pickup_latitude, relevantDel.pickup_longitude),
          delivery: getCoordinates(relevantDel.dropoff_address, relevantDel.dropoff_latitude, relevantDel.dropoff_longitude)
        }
      };
    },

    // --- API Call and Data Fetching ---
    async fetchRequestDetails() {
      const encryptedIdString = this.$route.query.id;

      if (!encryptedIdString || encryptedIdString.trim() === '') {
        this.loading = false;
        this.request = null;
        document.title = 'Missing Request ID';
        this.showToast('danger', 'bi-exclamation-triangle-fill', 'No encrypted request ID provided in URL.', 'animate__shakeX');
        return;
      }

      this.loading = true;
      this.request = null; // Reset request data before fetching

      try {
        const rawData = await this.getapialldata(); // This will now handle decryption and pass parameters

        this.allgetdata = rawData; // Store the raw data for debugging if needed

        // Check for error from API call itself (e.g., if getapialldata returns { error: true, message: ... })
        if (rawData && rawData.error) {
          console.error("API returned an error:", rawData.message);
          this.showToast('danger', 'bi-exclamation-triangle-fill', rawData.message, 'animate__shakeX');
          document.title = 'API Error';
          return; // Stop execution if API call itself failed
        }

        // Before transforming, we need the actual product_id from the decrypted data
        // Assumes `this.datatopage` holds the decrypted data from `getapialldata`
        if (!this.datatopage || !this.datatopage.prodid) {
          this.showToast('danger', 'bi-exclamation-triangle-fill', 'Decrypted data missing product ID.', 'animate__shakeX');
          document.title = 'Decryption Error';
          return;
        }
        const actualProdId = this.datatopage.prodid;


        // Check if both tripdata and deldata are present in the API response
        if (rawData && rawData.tripdata && Array.isArray(rawData.tripdata) && rawData.deldata && Array.isArray(rawData.deldata)) {
          // Transform the real data to match the UI's expected mock structure
          this.request = this.transformRealDataToMock(
            rawData.tripdata,
            rawData.deldata,
            actualProdId // Use the actual product_id from decrypted data for transformation
          );

          if (this.request) {
            console.log('Transformed Request for UI:', this.request);
            // Optionally, show a success toast if request is found
            this.showToast('success', 'bi-check-circle-fill', 'Request details loaded successfully!');
          } else {
            // If transformation returns null (meaning data for this ID wasn't found/matched)
            this.showToast(
              'danger',
              'bi-exclamation-triangle-fill',
              `Delivery request with product ID "${actualProdId}" not found or data is incomplete in API response.`,
              'animate__shakeX'
            );
            document.title = 'Request Data Incomplete';
          }
        } else {
          // Handle cases where the API response structure is not as expected
          this.showToast(
            'danger',
            'bi-exclamation-triangle-fill',
            "Invalid data structure received from the API (missing tripdata/deldata arrays).",
            'animate__shakeX'
          );
          document.title = 'API Response Error';
        }
      } catch (err) {
        console.error('Unexpected error during fetchRequestDetails:', err);
        this.showToast('danger', 'bi-bug-fill', `An unexpected error occurred: ${err.message}`, 'animate__shakeX');
        this.request = null; // Ensure request is null on error
      } finally {
        this.loading = false; // Always set loading to false after attempt
      }
    },

    // This method is responsible for making the actual API call to your backend
    async getapialldata() {
      const encryptedDataFromUrl = this.$route.query.id; // Get the encrypted string from the URL query

      if (!encryptedDataFromUrl) {
        console.error("No encrypted 'id' found in route query.");
        return { error: true, message: "No encrypted request ID found in URL." };
      }

      try {
        const decryptedData = decryptUserData(encryptedDataFromUrl);
        console.log('Decrypted Data for API Call:', decryptedData);
        this.datatopage = decryptedData; // Store the decrypted data in component state

        // Ensure decryptedData contains all required parameters for your backend
        if (!decryptedData || !decryptedData.transid || !decryptedData.transmailid || !decryptedData.prodid || !decryptedData.prodmailid) {
          console.error('Decrypted data is incomplete for API call:', decryptedData);
          throw new Error('Missing required parameters in decrypted data (transid, transmailid, prodid, or prodmailid).');
        }

        const baseUrl = import.meta.env.VITE_API_BASE_URL;
        // URLSearchParams handles proper encoding of parameters
        const queryParams = new URLSearchParams(decryptedData);
        const url = `${baseUrl}get-new-request-id?${queryParams.toString()}`;

        console.log("Constructed API URL:", url); // Log the full URL for debugging

        const response = await fetch(url, {
          method: 'GET',
          headers: {
            'Content-Type': 'application/json',
            // Add any necessary authentication headers (e.g., 'Authorization': `Bearer ${token}`)
          },
        });

        if (!response.ok) {
          const errorBody = await response.text(); // Get raw text for more detail
          throw new Error(`HTTP error! Status: ${response.status}. Message: ${errorBody}`);
        }

        const result = await response.json();
        this.zz = result; // Store the raw API response for debugging
        console.log('Raw API Response (getapialldata):', result);
        return result; // This should be the object containing 'tripdata' and 'deldata'
      } catch (error) {
        console.error('Error in getapialldata:', error);
        return { error: true, message: `Failed to fetch or decrypt data: ${error.message}` };
      }
    },

    // --- Geolocation Logic ---
    getUserLiveLocation() {
      if (navigator.geolocation) {
        navigator.geolocation.getCurrentPosition(
          (position) => {
            this.userLocation = {
              lat: position.coords.latitude,
              lng: position.coords.longitude,
            };
            console.log('User live location:', this.userLocation);
          },
          (error) => {
            console.error('Error getting user location:', error);
            // Optionally, set a default location or show a message
          },
          {
            enableHighAccuracy: true,
            timeout: 5000,
            maximumAge: 0,
          }
        );
      } else {
        console.warn('Geolocation is not supported by this browser.');
      }
    },

    // --- UI Utility Methods ---
    goBack() {
      this.$router.go(-1);
    },
    getStatusBadgeClass(status) {
      switch (status) {
        case 'New':
          return 'bg-primary';
        case 'Accepted':
          return 'bg-success';
        case 'Declined':
          return 'bg-danger';
        case 'Completed':
          return 'bg-info';
        default:
          return 'bg-secondary';
      }
    },
    showToast(type, icon, message, animationClass = 'animate__fadeInDown') {
      if (this.toastTimeout) {
        clearTimeout(this.toastTimeout);
      }
      this.toast = {
        show: true,
        message,
        type,
        icon,
        animationClass,
      };
      this.toastTimeout = setTimeout(() => {
        this.hideToast();
      }, 5000); // Hide after 5 seconds
    },
    hideToast() {
      this.toast.animationClass = 'animate__fadeOutUp'; // Add an exit animation
      this.toastTimeout = setTimeout(() => {
        this.toast.show = false;
        this.toast.message = '';
        this.toast.icon = '';
        this.toast.animationClass = ''; // Reset animation class
      }, 500); // Allow animation to complete before hiding
    },
    // --- Action Buttons ---
    // async acceptRequest() {
    //   // Implement logic to accept the request
    //   // This would involve making an API call to your backend
    //   console.log('Accept Request clicked for:', this.request.id);
    //   // if (this.request.status !== 'New') {
    //   //   this.showToast('warning', 'bi-exclamation-triangle-fill', 'This request is not in a "New" status and cannot be accepted.', 'animate__shakeX');
    //   //   return;
    //   // }

    //   try {
    //     const baseUrl = import.meta.env.VITE_API_BASE_URL;
    //     const response = await fetch(`${baseUrl}accept-request`, {
    //       method: 'POST',
    //       headers: {
    //         'Content-Type': 'application/json',
    //         // Include authentication token if required
    //       },
    //       body: JSON.stringify({
    //         // Data needed by your backend to accept the request
    //         transporter_trip_id: this.datatopage.transid, // The trip ID from the transporter side
    //         product_request_id: this.datatopage.prodid, // The product request ID
    //         transporter_email: this.datatopage.transmailid,
    //         sender_email: this.datatopage.prodmailid // The sender's email
    //       }),
    //     });

    //     if (!response.ok) {
    //       const errorData = await response.json();
    //       throw new Error(errorData.message || 'Failed to accept request.');
    //     }

    //     const result = await response.json();
    //     console.log('Accept request response:', result);
    //     this.showToast('success', 'bi-check-circle-fill', 'Request accepted successfully!');
    //     // Update local status or refetch data if necessary
    //     this.request.status = 'Accepted'; // Optimistically update UI
    //   } catch (error) {
    //     console.error('Error accepting request:', error);
    //     this.showToast('danger', 'bi-x-circle-fill', `Failed to accept request: ${error.message}`, 'animate__shakeX');
    //   }
    // },
    async acceptRequest() {
  console.log('Accept Request clicked for:', this.request.id);

  // You had this commented out, but it's good practice to keep such checks.
  // Uncomment if you want to ensure requests can only be accepted if their status is 'New'.
  // if (this.request.status !== 'New') {
  //   this.showToast('warning', 'bi-exclamation-triangle-fill', 'This request is not in a "New" status and cannot be accepted.', 'animate__shakeX');
  //   return;
  // }

  try {
    const baseUrl = import.meta.env.VITE_API_BASE_URL;

    // Use the parameters needed by the /acceptedbytheperson endpoint
    // Make sure this.datatopage has transid and prodid available
    if (!this.datatopage || !this.datatopage.transid || !this.datatopage.prodid) {
      throw new Error('Missing necessary IDs to accept the request (transid or prodid).');
    }

    const accepted_travel_id = this.datatopage.transid; // Corresponds to tripid
    const product_id = this.datatopage.prodid;       // Corresponds to productId

    const response = await fetch(`${baseUrl}acceptedbytheperson?tripid=${accepted_travel_id}&productId=${product_id}`, {
      method: "POST",
      headers: {
        'Content-Type': 'application/json', // Even for POST with query params, good to specify
        // Include authentication token if required, e.g., 'Authorization': `Bearer ${yourAuthToken}`
      },
     
    });

    if (!response.ok) {
      // Attempt to parse JSON error, but fall back to status text if not JSON
      let errorMessage = `Failed to accept request. Server responded with status: ${response.status}.`;
      try {
        const errorData = await response.json();
        errorMessage = errorData.message || errorData.error || errorMessage;
      } catch (e) {
        // If response body is not JSON, use status text
        errorMessage = await response.text() || errorMessage;
      }
      throw new Error(errorMessage);
    }

    
    const result = await response.json(); // Use .text() if it's not guaranteed JSON, or .json() if it is.
    console.log('Accept request API response:', result);

    this.showToast('success', 'bi-check-circle-fill', 'Request accepted successfully!');

   
    this.request.status = 'Accepted';

    

  } catch (error) {
    console.error('Error accepting request:', error);
    this.showToast('danger', 'bi-x-circle-fill', `Failed to accept request: ${error.message}`, 'animate__shakeX');
  }
},
    declineRequest() {
      // Implement logic to decline the request
      console.log('Decline Request clicked for:', this.request.id);
      if (this.request.status !== 'New') {
        this.showToast('warning', 'bi-exclamation-triangle-fill', 'This request is not in a "New" status and cannot be declined.', 'animate__shakeX');
        return;
      }
      this.showToast('info', 'bi-info-circle-fill', 'Request declined. (This is a placeholder action)', 'animate__bounceIn');
      this.request.status = 'Declined'; // Optimistically update UI
      // In a real app, you'd make an API call here.
    },
    shareRequest() {
      // Implement share functionality (e.g., Web Share API or copy to clipboard)
      console.log('Share Request clicked for:', this.request.id);
      if (navigator.share) {
        navigator.share({
          title: `Delivery Request: ${this.request.packageType}`,
          text: `Check out this delivery request from ${this.request.pickupLocation} to ${this.request.deliveryLocation}. Price: ${this.request.offeredPrice}`,
          url: window.location.href, // Current URL of the details page
        })
          .then(() => this.showToast('success', 'bi-share-fill', 'Request shared successfully!'))
          .catch((error) => console.error('Error sharing:', error));
      } else {
        // Fallback for browsers that don't support Web Share API
        navigator.clipboard.writeText(window.location.href)
          .then(() => this.showToast('info', 'bi-clipboard-fill', 'Request URL copied to clipboard!', 'animate__pulse'))
          .catch((err) => console.error('Failed to copy URL:', err));
      }
    },
    contactSender() {
      // Logic to initiate contact with sender (e.g., open email client or chat window)
      if (this.request.sender.email && this.request.sender.email !== 'N/A') {
        window.location.href = `mailto:${this.request.sender.email}`;
      } else {
        this.showToast('warning', 'bi-exclamation-triangle-fill', 'Sender email not available.', 'animate__shakeX');
      }
      console.log('Contact Sender clicked for:', this.request.sender.email);
    },
    contactreciver() {
      // Logic to initiate contact with receiver
      if (this.request.receiver.email && this.request.receiver.email !== 'N/A') {
        window.location.href = `mailto:${this.request.receiver.email}`;
      } else {
        this.showToast('warning', 'bi-exclamation-triangle-fill', 'Receiver email not available.', 'animate__shakeX');
      }
      console.log('Contact Receiver clicked for:', this.request.receiver.email);
    }
  }
};
</script>

<style scoped>
/* Main container styling */
.new-request-details-container {
  font-family: 'Inter', sans-serif;
  color: #333;
}

/* Header and button styling */
.btn-outline-secondary {
  border-color: #dee2e6;
  color: #6c757d;
  transition: all 0.3s ease;
}

.btn-outline-secondary:hover {
  background-color: #f8f9fa;
  color: #495057;
  border-color: #adb5bd;
}

/* Card styling */
.card {
  border-radius: 1rem;
  transition: all 0.3s ease;
}

.card-title {
  color: #0d6efd;
}

/* Status badges */
.badge {
  padding: 0.5em 0.75em;
  border-radius: 0.5rem;
  font-weight: 600;
  font-size: 0.85em;
}

.bg-primary {
  background-color: #0d6efd !important;
}

.bg-success {
  background-color: #198754 !important;
}

.bg-danger {
  background-color: #dc3545 !important;
}

.bg-info {
  background-color: #0dcaf0 !important;
}

.bg-warning {
  background-color: #ffc107 !important;
}

.bg-secondary {
  background-color: #6c757d !important;
}

/* Avatar styling */
.sender-avatar {
  width: 64px;
  height: 64px;
  object-fit: cover;
  border: 2px solid #0d6efd;
  box-shadow: 0 4px 8px rgba(0, 0, 0, 0.1);
  transition: transform 0.3s ease;
}

.sender-avatar:hover {
  transform: scale(1.05);
}

/* Sticky card for actions/map */
.sticky-top-card {
  position: sticky;
  top: 20px; /* Adjust as needed */
  z-index: 100;
}

/* Toast Notification Styling */
.custom-toast {
  position: fixed;
  bottom: 20px;
  left: 50%;
  transform: translateX(-50%);
  min-width: 300px;
  max-width: 90%;
  padding: 15px 20px;
  border-radius: 10px;
  box-shadow: 0 5px 15px rgba(0, 0, 0, 0.2);
  display: flex;
  justify-content: space-between;
  align-items: center;
  font-weight: bold;
  z-index: 1050; /* Above modals */
}

.toast-success {
  background-color: #d4edda;
  color: #155724;
  border: 1px solid #c3e6cb;
}

.toast-danger {
  background-color: #f8d7da;
  color: #721c24;
  border: 1px solid #f5c6cb;
}

.toast-info {
  background-color: #d1ecf1;
  color: #0c5460;
  border: 1px solid #bee5eb;
}

.toast-warning {
  background-color: #fff3cd;
  color: #856404;
  border: 1px solid #ffeeba;
}

.toast-icon {
  font-size: 1.5rem;
  margin-right: 10px;
}

.toast-message {
  flex-grow: 1;
}

.toast-close-btn {
  background: none;
  border: none;
  color: inherit;
  font-size: 1.2rem;
  cursor: pointer;
  margin-left: 10px;
  opacity: 0.7;
}

.toast-close-btn:hover {
  opacity: 1;
}

/* Animate.css integration (ensure you have Animate.css imported in your project) */
.animate__animated.animate__fadeInDown {
  animation-duration: 0.5s;
}
.animate__animated.animate__fadeOutUp {
  animation-duration: 0.5s;
}
.animate__animated.animate__shakeX {
  animation-duration: 0.8s;
}
.animate__animated.animate__pulse {
  animation-duration: 0.5s;
}
.animate__animated.animate__bounceIn {
  animation-duration: 0.8s;
}

/* Transition for toast */
.toast-fade-slide-enter-active,
.toast-fade-slide-leave-active {
  transition: all 0.5s ease;
}
.toast-fade-slide-enter-from,
.toast-fade-slide-leave-to {
  opacity: 0;
  transform: translateX(-50%) translateY(50px);
}
</style>
```