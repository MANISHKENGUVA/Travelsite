Got it\! Here's the complete, corrected frontend code for your `ShareTripForm.vue` component, incorporating all the fixes discussed, including the crucial change for the router push.

-----

### `src/components/ShareTripForm.vue`

```vue
<template>
  <div class="container py-5">
    <div class="text-center mb-5">
      <div class="icon-circle bg-success d-inline-flex align-items-center justify-content-center mb-3">
        <i class="fas fa-truck text-white fa-2x"></i>
      </div>
      <h2 class="fw-bold text-primary">Share Your Trip</h2>
      <p class="text-muted fs-5">Earn money by helping others deliver packages on your route</p>
    </div>

    <form @submit.prevent="submitForm">
      <div class="card shadow-sm mb-4 border-0 rounded-4">
        <div class="card-header bg-light-subtle py-3 border-bottom-0 rounded-top-4">
          <h5 class="mb-0 text-primary"><i class="fas fa-map-marker-alt me-2"></i>Trip Route</h5>
        </div>
        <div class="card-body p-4">
          <div class="row">
            <div class="col-md-6 mb-3">
              <label for="startLocation" class="form-label fw-bold">Starting Location <span class="text-danger">*</span></label>
              <div class="position-relative">
                <input
                  type="text"
                  v-model.trim="form.startLocation"
                  class="form-control rounded-3"
                  :class="{'is-invalid': errors.startLocation}"
                  id="startLocation"
                  placeholder="City, state or full address"
                  @input="searchAddress('start')"
                  @focus="showSuggestions('start')"
                  @blur="hideSuggestionsDelayed('start')"
                />
                <div class="invalid-feedback" v-if="errors.startLocation">{{ errors.startLocation }}</div>
                <ul v-if="showStartSuggestions && startSuggestions.length" class="list-group position-absolute w-100 z-1000 mt-1 shadow-sm">
                  <li
                    v-for="(suggestion, index) in startSuggestions"
                    :key="index"
                    class="list-group-item list-group-item-action cursor-pointer"
                    @mousedown.prevent="selectAddress(suggestion, 'start')"
                  >
                    {{ suggestion.formatted }}
                  </li>
                </ul>
              </div>
            </div>
            <div class="col-md-6 mb-3">
              <label for="destination" class="form-label fw-bold">Destination <span class="text-danger">*</span></label>
              <div class="position-relative">
                <input
                  type="text"
                  v-model.trim="form.destination"
                  class="form-control rounded-3"
                  :class="{'is-invalid': errors.destination}"
                  id="destination"
                  placeholder="City, state or full address"
                  @input="searchAddress('destination')"
                  @focus="showSuggestions('destination')"
                  @blur="hideSuggestionsDelayed('destination')"
                />
                <div class="invalid-feedback" v-if="errors.destination">{{ errors.destination }}</div>
                <ul v-if="showDestinationSuggestions && destinationSuggestions.length" class="list-group position-absolute w-100 z-1000 mt-1 shadow-sm">
                  <li
                    v-for="(suggestion, index) in destinationSuggestions"
                    :key="index"
                    class="list-group-item list-group-item-action cursor-pointer"
                    @mousedown.prevent="selectAddress(suggestion, 'destination')"
                  >
                    {{ suggestion.formatted }}
                  </li>
                </ul>
              </div>
            </div>
          </div>
        </div>
      </div>

      <div class="card shadow-sm mb-4 border-0 rounded-4">
        <div class="card-header bg-light-subtle py-3 border-bottom-0 rounded-top-4">
          <h5 class="mb-0 text-primary"><i class="fas fa-car me-2"></i>Vehicle & Available Space</h5>
        </div>
        <div class="card-body p-4">
          <div class="mb-4">
            <label class="form-label fw-bold">Vehicle Type <span class="text-danger">*</span></label>
            <div class="d-flex flex-wrap gap-2">
              <button v-for="vehicle in vehicleTypes"
                      :key="vehicle.value"
                      type="button"
                      class="btn btn-outline-success btn-lg rounded-pill px-4 py-2"
                      :class="{ 'active': form.vehicleType === vehicle.value, 'btn-success text-white': form.vehicleType === vehicle.value, 'is-invalid-btn': errors.vehicleType && form.vehicleType !== vehicle.value }"
                      @click="form.vehicleType = vehicle.value">
                <i :class="vehicle.icon" class="me-2"></i> {{ vehicle.label }}
              </button>
            </div>
            <small v-if="errors.vehicleType" class="text-danger mt-1 d-block">{{ errors.vehicleType }}</small>
          </div>

          <div class="row">
            <div class="col-md-6 mb-3">
              <label for="availableSpace" class="form-label fw-bold">Available Space <span class="text-danger">*</span></label>
              <select v-model="form.availableSpace" class="form-select rounded-3" :class="{'is-invalid': errors.availableSpace}" id="availableSpace">
                <option disabled value="">Select space available</option>
                <option value="small">Small (backpack/envelope)</option>
                <option value="medium">Medium (small box/bag)</option>
                <option value="large">Large (large box/suitcase)</option>
                <option value="extra-large">Extra Large (multiple boxes)</option>
              </select>
              <div class="invalid-feedback" v-if="errors.availableSpace">{{ errors.availableSpace }}</div>
            </div>
            <div class="col-md-6 mb-3">
              <label for="maxPackageSize" class="form-label fw-bold">Max Package Dimensions (LxWxH in cm) <span class="text-danger">*</span></label>
              <input v-model.trim="form.maxPackageSize" class="form-control rounded-3" :class="{'is-invalid': errors.maxPackageSize}" id="maxPackageSize" placeholder="e.g., 60x40x30 cm" />
              <div class="invalid-feedback" v-if="errors.maxPackageSize">{{ errors.maxPackageSize }}</div>
            </div>
            <div class="col-md-6 mb-3">
              <label for="maxPackageWeight" class="form-label fw-bold">Max Package Weight (kg) <span class="text-danger">*</span></label>
              <input
                type="number"
                v-model.number="form.maxPackageWeight"
                class="form-control rounded-3"
                :class="{'is-invalid': errors.maxPackageWeight}"
                id="maxPackageWeight"
                placeholder="e.g., 20"
                min="0.1"
                step="0.1"
              />
              <div class="invalid-feedback" v-if="errors.maxPackageWeight">{{ errors.maxPackageWeight }}</div>
            </div>
          </div>
        </div>
      </div>

      <div class="card shadow-sm mb-4 border-0 rounded-4">
        <div class="card-header bg-light-subtle py-3 border-bottom-0 rounded-top-4">
          <h5 class="mb-0 text-primary"><i class="fas fa-clock me-2"></i>Departure Schedule</h5>
        </div>
        <div class="card-body p-4 row">
          <div class="col-md-6 mb-3">
            <label for="departureDate" class="form-label fw-bold">Departure Date <span class="text-danger">*</span></label>
            <input
              type="date"
              v-model="form.departureDate"
              class="form-control rounded-3"
              :class="{'is-invalid': errors.departureDate}"
              id="departureDate"
              :min="today"
            />
            <div class="invalid-feedback" v-if="errors.departureDate">{{ errors.departureDate }}</div>
          </div>
          <div class="col-md-6 mb-3">
            <label for="departureTime" class="form-label fw-bold">Departure Time <span class="text-danger">*</span></label>
            <select v-model="form.departureTime" class="form-select rounded-3" :class="{'is-invalid': errors.departureTime}" id="departureTime">
              <option disabled value="">Select time</option>
              <option v-for="time in timeSlots" :key="time" :value="time">{{ time }}</option>
            </select>
            <div class="invalid-feedback" v-if="errors.departureTime">{{ errors.departureTime }}</div>
          </div>
          <div class="col-md-6 mb-3">
            <label for="availableFromTime" class="form-label fw-bold">Available From Time</label>
            <input type="time" v-model="form.availableFromTime" class="form-control rounded-3" id="availableFromTime" />
          </div>
          <div class="col-md-6 mb-3">
            <label for="availableToTime" class="form-label fw-bold">Available To Time</label>
            <input type="time" v-model="form.availableToTime" class="form-control rounded-3" id="availableToTime" />
          </div>
        </div>
      </div>

      <div class="card shadow-sm mb-4 border-0 rounded-4">
        <div class="card-header bg-light-subtle py-3 border-bottom-0 rounded-top-4">
          <h5 class="mb-0 text-primary"><i class="fas fa-box me-2"></i>Package Types & Pricing</h5>
        </div>
        <div class="card-body p-4">
          <label class="form-label fw-bold">Accepted Package Types</label>
          <div class="row mb-3 g-3">
            <div class="col-md-3" v-for="(label, key) in packageTypes" :key="key">
              <div class="form-check form-check-inline">
                <input class="form-check-input" type="checkbox" v-model="form[key]" :id="key" />
                <label class="form-check-label fw-medium" :for="key">{{ label }}</label>
              </div>
            </div>
          </div>

          <div class="row align-items-center">
            <div class="col-md-6 mb-3">
              <label for="pricePerKg" class="form-label fw-bold">Price Per KG (₹) <span class="text-danger">*</span></label>
              <div class="input-group">
                <span class="input-group-text rounded-start-3">₹</span>
                <input
                  v-model.number="form.pricePerKg"
                  type="number"
                  class="form-control rounded-end-3"
                  :class="{'is-invalid': errors.pricePerKg}"
                  id="pricePerKg"
                  placeholder="e.g., 25"
                  min="0"
                  step="0.01"
                />
              </div>
              <div class="invalid-feedback" v-if="errors.pricePerKg">{{ errors.pricePerKg }}</div>
            </div>
            <div class="col-md-6 mb-3">
              <div class="form-check mt-3">
                <input class="form-check-input" type="checkbox" v-model="form.hasInsurance" id="hasInsurance" />
                <label class="form-check-label fw-medium" for="hasInsurance">I have delivery insurance</label>
              </div>
            </div>
          </div>
        </div>
      </div>

      <div class="card shadow-sm mb-4 border-0 rounded-4">
        <div class="card-header bg-light-subtle py-3 border-bottom-0 rounded-top-4">
          <h5 class="mb-0 text-primary">Additional Notes</h5>
        </div>
        <div class="card-body p-4">
          <textarea v-model="form.additionalNotes" class="form-control rounded-3" rows="3" placeholder="Optional notes..."></textarea>
        </div>
      </div>

      <div class="d-flex justify-content-end gap-3 mt-4">
        <button type="button" class="btn btn-outline-secondary btn-lg rounded-pill px-4" @click="$router.push('/')">Cancel</button>
        <button type="submit" class="btn btn-success btn-lg rounded-pill px-4">
          <i class="fas fa-paper-plane me-2"></i> Publish Trip
        </button>
      </div>
    </form>
  </div>
</template>

<script>
// No need to import Vuex related code if you're not using it or if it's managed elsewhere
// import { mapGetters } from 'vuex'; // If you're using Vuex, keep this and the computed property

export default {
  name: "ShareTripForm",
  data() {
    return {
      today: new Date().toISOString().substr(0, 10), // For min date on departureDate input
      geoapifyApiKey: import.meta.env.VITE_GEOAPIFY_API_KEY, // Make sure this is set in your .env
      startSuggestions: [],
      destinationSuggestions: [],
      showStartSuggestions: false,
      showDestinationSuggestions: false,
      searchTimeout: null,
      form: {
        email: this.$store.getters.getUser.email, // Placeholder email; replace with actual user email if using auth/store
        startLocation: "",
        startCoordinates: null, // { lat: number, lon: number } - Will be populated by Geoapify
        destination: "",
        destinationCoordinates: null, // { lat: number, lon: number } - Will be populated by Geoapify
        departureDate: "",
        departureTime: "",
        availableFromTime: "", // Optional: specific time when package can be picked up
        availableToTime: "",    // Optional: specific time when package can be delivered
        vehicleType: "",
        availableSpace: "",
        maxPackageSize: "", // e.g., "60x40x30 cm"
        maxPackageWeight: null, // New field: max weight in kg for a package
        pricePerKg: null, // Price per kilogram (can be decimal)
        acceptDocuments: true, // Default to true
        acceptMedicine: false,
        acceptElectronics: true, // Default to true
        acceptFragile: false,
        hasInsurance: false,
        additionalNotes: "",
      },
      errors: {}, // Object to store validation errors
      vehicleTypes: [
        { value: "sedan", label: "Sedan", icon: "fas fa-car" },
        { value: "suv", label: "SUV", icon: "fas fa-car-side" },
        { value: "van", label: "Van", icon: "fas fa-shuttle-van" },
        { value: "truck", label: "Truck", icon: "fas fa-truck" },
        { value: "bike", label: "Bike", icon: "fas fa-motorcycle" }, // Added bike as a common option in India
      ],
      packageTypes: {
        acceptDocuments: "Documents",
        acceptMedicine: "Medicine",
        acceptElectronics: "Electronics",
        acceptFragile: "Fragile Items",
        // You can add more package types here if needed:
        // acceptFood: "Food",
        // acceptLiquids: "Liquids",
        // acceptClothes: "Clothes",
      },
      // Expanded time slots for more granular control
      timeSlots: [
        "00:00", "00:30", "01:00", "01:30", "02:00", "02:30", "03:00", "03:30",
        "04:00", "04:30", "05:00", "05:30", "06:00", "06:30", "07:00", "07:30",
        "08:00", "08:30", "09:00", "09:30", "10:00", "10:30", "11:00", "11:30",
        "12:00", "12:30", "13:00", "13:30", "14:00", "14:30", "15:00", "15:30",
        "16:00", "16:30", "17:00", "17:30", "18:00", "18:30", "19:00", "19:30",
        "20:00", "20:30", "21:00", "21:30", "22:00", "22:30", "23:00", "23:30",
      ],
    };
  },
  // If you are using Vuex for user state, uncomment this and adjust 'email' in data()
  /*
  computed: {
    ...mapGetters(['getUser']),
    // You might watch getUser and update form.email if it changes
  },
  watch: {
    getUser: {
      handler(newUser) {
        if (newUser && newUser.email) {
          this.form.email = newUser.email;
        } else {
          this.form.email = ''; // Clear if no user
        }
      },
      immediate: true, // Run handler immediately on component creation
    },
  },
  */
  methods: {
    // --- Geoapify Address Autocomplete methods ---
    searchAddress(type) {
      clearTimeout(this.searchTimeout); // Clear previous timeout
      this.searchTimeout = setTimeout(async () => {
        const query = type === 'start' ? this.form.startLocation : this.form.destination;

        // Don't search for very short queries
        if (query.length < 3) {
          this[type + 'Suggestions'] = [];
          return;
        }

        try {
          const response = await fetch(
            `https://api.geoapify.com/v1/geocode/autocomplete?text=${encodeURIComponent(query)}&apiKey=${this.geoapifyApiKey}&limit=5&filter=countrycode:in`
          );
          const data = await response.json();

          if (data && data.features) {
            this[type + 'Suggestions'] = data.features.map(feature => ({
              formatted: feature.properties.formatted,
              lat: feature.properties.lat,
              lon: feature.properties.lon, // Geoapify provides longitude as 'lon'
            }));
            // Show suggestions only if there are results
            this[type === 'start' ? 'showStartSuggestions' : 'showDestinationSuggestions'] = true;
          } else {
            this[type + 'Suggestions'] = []; // Clear suggestions if no results
          }
        } catch (error) {
          console.error(`Error fetching ${type} address suggestions:`, error);
          this[type + 'Suggestions'] = []; // Clear suggestions on error
        }
      }, 300); // 300ms debounce
    },
    selectAddress(suggestion, type) {
      if (type === 'start') {
        this.form.startLocation = suggestion.formatted;
        this.form.startCoordinates = { lat: suggestion.lat, lon: suggestion.lon };
        this.showStartSuggestions = false; // Hide suggestions after selection
      } else {
        this.form.destination = suggestion.formatted;
        this.form.destinationCoordinates = { lat: suggestion.lat, lon: suggestion.lon };
        this.showDestinationSuggestions = false; // Hide suggestions after selection
      }
      // Clear validation error for this address field if it existed
      if (this.errors[type + 'Location']) {
        delete this.errors[type + 'Location'];
      }
    },
    showSuggestions(type) {
      // Show suggestions only if there are any available
      if (type === 'start') {
        this.showStartSuggestions = this.startSuggestions.length > 0;
      } else {
        this.showDestinationSuggestions = this.destinationSuggestions.length > 0;
      }
    },
    hideSuggestionsDelayed(type) {
      // Use a small delay to allow the `mousedown.prevent` on suggestion items to fire
      // before the suggestion list is hidden due to blur event on the input.
      setTimeout(() => {
        if (type === 'start') {
          this.showStartSuggestions = false;
        } else {
          this.showDestinationSuggestions = false;
        }
      }, 150);
    },

    // --- Form Validation ---
    validateForm() {
      this.errors = {}; // Clear previous errors
      const f = this.form;
      let isValid = true;

      // Location validation (ensure address is selected AND coordinates are present)
      if (!f.startLocation || !f.startCoordinates || f.startCoordinates.lat === null || f.startCoordinates.lon === null || isNaN(f.startCoordinates.lat) || isNaN(f.startCoordinates.lon)) {
          this.errors.startLocation = "Please select a valid starting location from suggestions (coordinates required).";
          isValid = false;
      }
      if (!f.destination || !f.destinationCoordinates || f.destinationCoordinates.lat === null || f.destinationCoordinates.lon === null || isNaN(f.destinationCoordinates.lat) || isNaN(f.destinationCoordinates.lon)) {
          this.errors.destination = "Please select a valid destination from suggestions (coordinates required).";
          isValid = false;
      }

      // Vehicle & Space
      if (!f.vehicleType) {
          this.errors.vehicleType = "Please select a vehicle type.";
          isValid = false;
      }
      if (!f.availableSpace) {
          this.errors.availableSpace = "Please select available space.";
          isValid = false;
      }
      // Basic validation for maxPackageSize format (e.g., "60x40x30 cm")
      const dimensionRegex = /^\d+x\d+x\d+\s*(cm|inches)?$/i; // Allows "cm" or "inches"
      if (!f.maxPackageSize || !dimensionRegex.test(f.maxPackageSize.trim())) {
          this.errors.maxPackageSize = "Please enter max package dimensions (e.g., 60x40x30 cm).";
          isValid = false;
      }
      if (f.maxPackageWeight === null || isNaN(f.maxPackageWeight) || parseFloat(f.maxPackageWeight) <= 0) {
          this.errors.maxPackageWeight = "Max package weight must be a positive number.";
          isValid = false;
      }

      // Departure Schedule
      if (!f.departureDate) {
          this.errors.departureDate = "Departure date is required.";
          isValid = false;
      } else {
          // Check if departure date is in the past
          const selectedDate = new Date(f.departureDate);
          const todayDate = new Date(this.today);
          // Set hours, minutes, seconds, milliseconds to 0 for accurate date comparison
          selectedDate.setHours(0,0,0,0);
          todayDate.setHours(0,0,0,0);

          if (selectedDate < todayDate) {
              this.errors.departureDate = "Departure date cannot be in the past.";
              isValid = false;
          }
      }

      if (!f.departureTime) {
          this.errors.departureTime = "Departure time is required.";
          isValid = false;
      }

      // Pricing
      // Ensure pricePerKg is a non-negative number
      if (f.pricePerKg === null || isNaN(f.pricePerKg) || parseFloat(f.pricePerKg) < 0) {
          this.errors.pricePerKg = "Price per kg must be a non-negative number.";
          isValid = false;
      }

      return isValid;
    },

    // --- Form Submission ---
    async submitForm() {
      if (!this.validateForm()) {
        console.error("Form validation failed:", this.errors);
        alert("Please correct the errors in the form before publishing your trip.");
        // Scroll to the first error
        this.$nextTick(() => {
          const firstInvalidField = document.querySelector('.is-invalid, .is-invalid-btn');
          if (firstInvalidField) {
            firstInvalidField.scrollIntoView({ behavior: 'smooth', block: 'center' });
          }
        });
        return;
      }

      // Generate a unique ID for the trip (e.g., "TRIP-1701234567890")
      // This ID will be stored as `transport_trip_id` in your Supabase table.
      const transportTripId = "TRIP-" + Date.now();

      // Prepare data for the backend, mapping frontend field names to backend's expected names
      const datatobackend = {
        email: this.form.email,
        start_location: this.form.startLocation, // Corrected to snake_case for backend
        start_latitude: this.form.startCoordinates?.lat, // Use optional chaining for safety
        start_longitude: this.form.startCoordinates?.lon,
        destination: this.form.destination, // Stays camelCase as per your backend log example and schema
        destination_latitude: this.form.destinationCoordinates?.lat,
        destination_longitude: this.form.destinationCoordinates?.lon,
        departure_date: this.form.departureDate,
        departure_time: this.form.departureTime,
        available_from_time: this.form.availableFromTime || null, // Send null if empty
        available_to_time: this.form.availableToTime || null,    // Send null if empty
        vehicle_type: this.form.vehicleType,
        available_space: this.form.availableSpace,
        max_package_size: this.form.maxPackageSize,
        max_package_weight: this.form.maxPackageWeight, // Already number from v-model.number
        price_per_kg: this.form.pricePerKg,             // Already number from v-model.number
        accept_documents: this.form.acceptDocuments,
        accept_medicine: this.form.acceptMedicine,
        accept_electronics: this.form.acceptElectronics,
        accept_fragile: this.form.acceptFragile,
        has_insurance: this.form.hasInsurance,
        additional_notes: this.form.additionalNotes,
      };

      console.log("Trip Data to Send (Frontend):", { transportTripId, datatobackend });

      const baseUrl = import.meta.env.VITE_API_BASE_URL; // Base URL from your .env file
      try {
        const response = await fetch(`${baseUrl}api/add-trip`, {
          method: 'POST',
          headers: {
            'Content-Type': 'application/json',
          },
          body: JSON.stringify({
            transportTripId: transportTripId, // Sent as transportTripId to match backend req.body destructuring
            datatobackend: datatobackend,
            // 'status' is omitted here as your DB schema has a default 'active' handled by backend
          }),
        });

        // Handle HTTP errors (e.g., 4xx, 5xx responses)
        if (!response.ok) {
          const errorData = await response.json(); // Attempt to read error details from server
          console.error("Server error response:", errorData);
          throw new Error(errorData.error || `Server error: ${response.status} ${response.statusText}`);
        }

        const result = await response.json();
        console.log("Server response:", result);
        alert("Your trip has been published successfully!");

        // CORRECTED: Access transportTripId from the 'result.trip' object returned by the backend
        const publishedTransportTripId = result.trip ? result.trip.transport_trip_id : transportTripId;

        // Ensure you have a route named 'view-requests' in your router/index.js
        this.$router.push({ path: "/view-requests", query: { transportTripId: publishedTransportTripId } });

      } catch (err) {
        console.error("Error submitting trip:", err);
        alert(`Failed to publish trip: ${err.message}. Please try again later.`);
      }
    },
  },
};
</script>

<style scoped>
/* Custom styles for a modern look */
.icon-circle {
  width: 72px;
  height: 72px;
  border-radius: 50%;
  background-color: var(--bs-success); /* Using Bootstrap variable */
  box-shadow: 0 0.5rem 1rem rgba(0, 0, 0, 0.15);
}

.card {
  transition: transform 0.2s ease-in-out, box-shadow 0.2s ease-in-out;
}

.card:hover {
  transform: translateY(-3px);
  box-shadow: 0 1rem 2rem rgba(0, 0, 0, 0.1);
}

.card-header {
  background-color: var(--bs-light-subtle); /* Lighter background for header */
  border-bottom: none; /* Remove default border */
}

/* Styling for address suggestion list */
.list-group {
  max-height: 200px;
  overflow-y: auto;
  border-radius: 0.5rem;
  box-shadow: 0 0.5rem 1rem rgba(0, 0, 0, 0.1);
}

.list-group-item {
  border-left: none;
  border-right: none;
  border-radius: 0;
  cursor: pointer;
  padding: 0.75rem 1.25rem;
}

.list-group-item:first-child {
  border-top-left-radius: 0.5rem;
  border-top-right-radius: 0.5rem;
}

.list-group-item:last-child {
  border-bottom-left-radius: 0.5rem;
  border-bottom-right-radius: 0.5rem;
}

.list-group-item:hover {
  background-color: #e9ecef;
}

/* Ensure suggestions appear above other content */
.z-1000 {
  z-index: 1000;
}

/* Custom class for button invalid state */
.is-invalid-btn {
  border-color: var(--bs-danger);
  box-shadow: 0 0 0 0.25rem rgba(220, 53, 69, 0.25);
}
</style>
```