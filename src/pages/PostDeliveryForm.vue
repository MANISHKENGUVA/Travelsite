<template>
  <div class="container py-5">
    <div class="text-center mb-5">
      <div
        class="bg-primary text-white rounded-circle d-inline-flex align-items-center justify-content-center shadow-lg"
        style="width: 72px; height: 72px;"
      >
        <i class="bi bi-box-seam fs-1"></i>
      </div>
      <h2 class="mt-4 display-5 fw-bold text-dark">Request a Delivery</h2>
      <p class="text-muted mt-2 fs-5">Get your package delivered safely by trusted carriers</p>
    </div>

    <form @submit.prevent="submitForm" class="bg-white p-4 p-md-5 rounded-4 shadow-lg border border-light">
      <div class="mb-4">
        <label class="form-label fw-bold text-secondary">Item Type *</label>
        <div class="row g-3">
          <div v-for="type in itemTypes" :key="type.value" class="col-6 col-md-4">
            <button
              type="button"
              class="btn w-100 text-start border py-3 px-4 rounded-3 d-flex align-items-center item-type-btn"
              :class="{ 'btn-primary-soft text-primary shadow-sm selected-item-type': form.itemType === type.value, 'btn-outline-light text-dark': form.itemType !== type.value }"
              @click="form.itemType = type.value"
            >
              <i :class="[type.icon, 'me-3', 'fs-4', {'text-primary': form.itemType === type.value, 'text-muted': form.itemType !== type.value}]"></i>
              <span class="fw-medium">{{ type.label }}</span>
            </button>
          </div>
        </div>
        <small class="text-danger mt-2 d-block" v-if="errors.itemType">{{ errors.itemType }}</small>
      </div>

      <div class="mb-4">
        <label for="itemDescription" class="form-label fw-bold text-secondary">Description *</label>
        <textarea
          id="itemDescription"
          class="form-control rounded-3"
          :class="{'is-invalid': errors.itemDescription}"
          v-model.trim="form.itemDescription"
          rows="4"
          placeholder="e.g., A small box of books, fragile"
        ></textarea>
        <div class="invalid-feedback" v-if="errors.itemDescription">{{ errors.itemDescription }}</div>
      </div>

      <div class="mb-4">
        <label class="form-label fw-bold text-secondary">Special Requirements</label>
        <div class="row g-3">
          <div class="col-sm-6" v-for="(option, index) in checkboxes" :key="index">
            <label class="form-check d-flex align-items-center p-3 rounded-3 border border-light hover-bg-light cursor-pointer">
              <input
                class="form-check-input me-2"
                type="checkbox"
                :id="option.key"
                :value="option.label"
                v-model="form.specialRequirements"
              />
              <i :class="option.icon + ' me-2 text-primary fs-5'" />
              <span class="form-check-label text-muted">{{ option.label }}</span>
            </label>
          </div>
        </div>
      </div>

      <div class="row mb-4 g-4">
        <div class="col-md-6">
          <label class="form-label fw-bold text-secondary">Pickup Address *</label>
          <div class="position-relative">
            <input
              type="text"
              class="form-control rounded-3"
              :class="{'is-invalid': errors.pickupAddress}"
              v-model.trim="form.pickupAddress"
              @input="searchAddress('pickup')"
              @focus="showSuggestions('pickup')"
              @blur="hideSuggestionsDelayed('pickup')"
              placeholder="Full pickup address"
            />
            <div class="invalid-feedback" v-if="errors.pickupAddress">{{ errors.pickupAddress }}</div>
            <ul v-if="showPickupSuggestions && pickupSuggestions.length"  class="list-group position-absolute w-100 z-1000 mt-1 shadow-sm">
              <li
                v-for="(suggestion, index) in pickupSuggestions"
                :key="index"
                class="list-group-item list-group-item-action cursor-pointer"
                @mousedown.prevent="selectAddress(suggestion, 'pickup')"
              >
                {{ suggestion.formatted }}
              </li>
            </ul>
          </div>
        </div>
        <div class="col-md-6">
          <label class="form-label fw-bold text-secondary">Dropoff Address *</label>
          <div class="position-relative">
            <input
              type="text"
              class="form-control rounded-3"
              :class="{'is-invalid': errors.dropoffAddress}"
              v-model.trim="form.dropoffAddress"
              @input="searchAddress('dropoff')"
              @focus="showSuggestions('dropoff')"
              @blur="hideSuggestionsDelayed('dropoff')"
              placeholder="Full dropoff address"
            />
            <div class="invalid-feedback" v-if="errors.dropoffAddress">{{ errors.dropoffAddress }}</div>
            <ul v-if="showDropoffSuggestions && dropoffSuggestions.length" class="list-group position-absolute w-100 z-1000 mt-1 shadow-sm">
              <li
                v-for="(suggestion, index) in dropoffSuggestions"
                :key="index"
                class="list-group-item list-group-item-action cursor-pointer"
                @mousedown.prevent="selectAddress(suggestion, 'dropoff')"
              >
                {{ suggestion.formatted }}
              </li>
            </ul>
          </div>
        </div>
      </div>

      <div class="row mb-4 g-4">
        <div class="col-md-6">
          <label class="form-label fw-bold text-secondary">Pickup Date *</label>
          <input
            type="date"
            class="form-control rounded-3"
            :class="{'is-invalid': errors.pickupDate}"
            v-model="form.pickupDate"
            :min="today"
          />
          <div class="invalid-feedback" v-if="errors.pickupDate">{{ errors.pickupDate }}</div>
        </div>
        <div class="col-md-6">
          <label class="form-label fw-bold text-secondary">Delivery Timeframe *</label>
          <select
            class="form-select rounded-3"
            :class="{'is-invalid': errors.deliveryTimeframe}"
            v-model="form.deliveryTimeframe"
          >
            <option disabled value="">Choose...</option>
            <option v-for="time in timeframes" :value="time.value" :key="time.value">
              {{ time.label }}
            </option>
          </select>
          <div class="invalid-feedback" v-if="errors.deliveryTimeframe">{{ errors.deliveryTimeframe }}</div>
        </div>
      </div>

      <div class="mb-4">
        <label class="form-label fw-bold text-secondary">Budget *</label>
        <div class="input-group">
          <span class="input-group-text bg-light border-end-0 text-primary rounded-start-3">₹</span>
          <input
            type="number"
            class="form-control rounded-end-3"
            :class="{'is-invalid': errors.budget}"
            v-model.trim="form.budget"
            placeholder="e.g., 250"
          />
          <div class="invalid-feedback" v-if="errors.budget">{{ errors.budget }}</div>
        </div>
        <small class="text-muted d-block mt-1">Carriers may offer lower prices</small>
      </div>

      <div class="row mb-4 g-4">
        <div class="col-md-6">
          <label class="form-label fw-bold text-secondary">Receiver Name *</label>
          <input
            type="text"
            class="form-control rounded-3"
            :class="{'is-invalid': errors.receiverName}"
            v-model.trim="form.receiverName"
            placeholder="Full name of receiver"
          />
          <div class="invalid-feedback" v-if="errors.receiverName">{{ errors.receiverName }}</div>
        </div>
        <div class="col-md-6">
          <label class="form-label fw-bold text-secondary">Receiver Phone *</label>
          <input
            type="tel"
            class="form-control rounded-3"
            :class="{'is-invalid': errors.receiverPhone}"
            v-model.trim="form.receiverPhone"
            placeholder="e.g., +91 98765 43210"
          />
          <div class="invalid-feedback" v-if="errors.receiverPhone">{{ errors.receiverPhone }}</div>
        </div>
      </div>

      <div class="mb-5">
        <label class="form-label fw-bold text-secondary">Special Instructions</label>
        <textarea
          class="form-control rounded-3"
          rows="4"
          v-model.trim="form.specialInstructions"
          placeholder="Any specific instructions for the carrier (e.g., 'Leave at front door')"
        ></textarea>
      </div>

      <div class="d-flex justify-content-end">
        <button type="button" class="btn btn-outline-secondary me-3 px-4 py-2 rounded-3" @click="$router.push('/')">Cancel</button>
        <button type="submit" class="btn btn-primary px-4 py-2 rounded-3 shadow-sm">Find Carriers</button>
      </div>
    </form>
  </div>
</template>

<script>
// No need for Google Maps script anymore
export default {
  name: "PostDeliveryForm",
  data() {
    return {
      today: new Date().toISOString().substr(0, 10),
      // --- START Geoapify related data ---
      geoapifyApiKey: import.meta.env.VITE_GEOAPIFY_API_KEY, // <<< IMPORTANT: Replace with your actual Geoapify API Key
      pickupSuggestions: [],
      dropoffSuggestions: [],
      showPickupSuggestions: false,
      showDropoffSuggestions: false,
      searchTimeout: null, // To debounce API calls
      // --- END Geoapify related data ---
      form: {
        email: this.$store.getters.getUser?.email || '',
        itemType: "",
        itemDescription: "",
        pickupAddress: "",
        dropoffAddress: "",
        pickupDate: "",
        deliveryTimeframe: "",
        budget: "",
        specialInstructions: "",
        specialRequirements: [],
        receiverName: "",
        receiverPhone: "",
        pickupCoordinates: null,
        dropoffCoordinates: null,
      },
      errors: {},
      itemTypes: [
        { value: "documents", label: "Documents", icon: "bi bi-file-text" },
        { value: "medicine", label: "Medicine", icon: "bi bi-capsule" },
        { value: "electronics", label: "Electronics", icon: "bi bi-laptop" },
        { value: "gifts", label: "Gifts", icon: "bi bi-bag" },
        { value: "clothing", label: "Clothing", icon: "bi bi-bag" },
        { value: "other", label: "Other", icon: "bi bi-box-seam" },
      ],
      timeframes: [
        { value: "same-day", label: "Same Day (within 8 hours)" },
        { value: "next-day", label: "Next Day" },
        { value: "2-3-days", label: "2-3 Days" },
        { value: "flexible", label: "Flexible (within a week)" },
      ],
      checkboxes: [
        { key: 'fragile', label: 'Fragile item', icon: 'bi-exclamation-triangle-fill' },
        { key: 'requiresRefrigeration', label: 'Needs refrigeration', icon: 'bi-snow' },
        { key: 'valuableItem', label: 'Valuable item', icon: 'bi-shield-lock' },
        { key: 'doorstepDelivery', label: 'Doorstep delivery preferred', icon: 'bi-house-door' },
      ],
    };
  },
  methods: {
    searchAddress(type) {
      clearTimeout(this.searchTimeout);
      this.searchTimeout = setTimeout(async () => {
        const query = type === 'pickup' ? this.form.pickupAddress : this.form.dropoffAddress;

        if (query.length < 3) { // Only search if at least 3 characters
          this[type + 'Suggestions'] = [];
          return;
        }

        try {
          const response = await fetch(
            `https://api.geoapify.com/v1/geocode/autocomplete?text=${encodeURIComponent(query)}&apiKey=${this.geoapifyApiKey}&limit=5&filter=countrycode:in` // Bias to India
          );
          const data = await response.json();

          if (data && data.features) {
            this[type + 'Suggestions'] = data.features.map(feature => ({
              formatted: feature.properties.formatted,
              lat: feature.properties.lat,
              lon: feature.properties.lon,
            }));
            this[type === 'pickup' ? 'showPickupSuggestions' : 'showDropoffSuggestions'] = true;
          } else {
            this[type + 'Suggestions'] = [];
          }
        } catch (error) {
          console.error("Error fetching address suggestions:", error);
          this[type + 'Suggestions'] = [];
        }
      }, 300); // Debounce time in ms
    },
    selectAddress(suggestion, type) {
      if (type === 'pickup') {
        this.form.pickupAddress = suggestion.formatted;
        this.form.pickupCoordinates = { lat: suggestion.lat, lng: suggestion.lon };
        this.showPickupSuggestions = false;
      } else {
        this.form.dropoffAddress = suggestion.formatted;
        this.form.dropoffCoordinates = { lat: suggestion.lat, lng: suggestion.lon };
        this.showDropoffSuggestions = false;
      }
      // Clear validation error if selection is made
      if (this.errors[type + 'Address']) {
        delete this.errors[type + 'Address'];
      }
    },
    showSuggestions(type) {
      if (type === 'pickup') {
        this.showPickupSuggestions = this.pickupSuggestions.length > 0;
      } else {
        this.showDropoffSuggestions = this.dropoffSuggestions.length > 0;
      }
    },
    hideSuggestionsDelayed(type) {
      // Use a timeout to allow click on suggestion before hiding
      setTimeout(() => {
        if (type === 'pickup') {
          this.showPickupSuggestions = false;
        } else {
          this.showDropoffSuggestions = false;
        }
      }, 150);
    },
    submitForm() {
      this.errors = {};
      const f = this.form;

      // Validation
      if (!f.itemType) this.errors.itemType = "Please select an item type";
      if (!f.itemDescription || f.itemDescription.length < 5)
        this.errors.itemDescription = "Description should be at least 5 characters";
      
      // Validate address fields, checking if coordinates are also set
      if (!f.pickupAddress || !f.pickupCoordinates) {
        this.errors.pickupAddress = "Please select a valid pickup address from the suggestions.";
      }
      if (!f.dropoffAddress || !f.dropoffCoordinates) {
        this.errors.dropoffAddress = "Please select a valid dropoff address from the suggestions.";
      }

      if (!f.pickupDate) this.errors.pickupDate = "Pickup date is required";
      if (!f.deliveryTimeframe) this.errors.deliveryTimeframe = "Please select a delivery timeframe";
      if (!f.budget || isNaN(f.budget) || parseFloat(f.budget) <= 0) 
        this.errors.budget = "Budget must be a positive number";
      if (!f.receiverName) this.errors.receiverName = "Receiver name is required";
      if (!f.receiverPhone || !/^\+?[0-9\s-()]{10,}$/.test(f.receiverPhone)) // Basic phone regex
        this.errors.receiverPhone = "Valid phone number is required (min 10 digits)";

      if (Object.keys(this.errors).length === 0) {
        console.log("Delivery Request:", f);

        const prodid = "REQ-" + Date.now(); // Unique ID for the request
        const baseUrl = import.meta.env.VITE_API_BASE_URL;

        fetch(`${baseUrl}api/deliveries`, {
          method: 'POST',
          headers: {
            'Content-Type': 'application/json',
          },
          body: JSON.stringify({
            dattosend: {
              ...f,
              pickupCoordinates: f.pickupCoordinates, // Ensure these are sent
              dropoffCoordinates: f.dropoffCoordinates, // Ensure these are sent
            },
            product_id: prodid
          }),
        })
          .then(res => {
            if (!res.ok) {
              return res.json().then(errorData => {
                throw new Error(errorData.message || 'Something went wrong on the server.');
              });
            }
            return res.json();
          })
          .then(data => {
            console.log("Server response:", data);
            alert("Delivery request submitted successfully!");
            this.$router.push({ name: "find-carriers", query: { id: prodid } });
          })
          .catch(err => {
            console.error("Fetch error:", err);
            alert(`Failed to submit the request: ${err.message}. Please try again later.`);
          });
      }
    },
  },
};
</script>

<style scoped>
/* Custom variables for primary color */
:root {
  --bs-primary: #0d6efd; /* Bootstrap's default primary */
  --bs-primary-rgb: 13, 110, 253; /* Corresponding RGB for shadows/focus */
  --bs-primary-soft: #e7f0fe; /* A lighter shade for backgrounds like selected item type */

  /* Dark mode variables for text and background */
  --page-bg-light: #f8f9fa;
  --page-bg-dark: #202020;
  --card-bg-light: #ffffff;
  --card-bg-dark: #2a2a2a; /* Main card/element background in dark mode */
  --text-color-light: #212529;
  --text-color-dark: #e0e0e0;
  --muted-text-color-light: #6c757d;
  --muted-text-color-dark: #b0b0b0;
  --border-color-light: #e0e0e0;
  --border-color-dark: #3a3a3a;
  --shadow-color-light: rgba(0, 0, 0, 0.1);
  --shadow-color-dark: rgba(0, 0, 0, 0.4); /* Slightly darker shadow for dark mode */

  /* Adjust Bootstrap primary for dark mode readability */
  --bs-primary-dark-mode: #6a9cff;
  --bs-primary-soft-dark: #3a3a3a; /* Softer primary for dark mode highlights */
}

/* Light Mode Defaults for general page elements */
.container.py-5 {
  background-color: var(--page-bg-light); /* Ensure container has a background */
}
.text-dark {
  color: var(--text-color-light) !important;
}
.text-muted {
  color: var(--muted-text-color-light) !important;
}
.bg-white {
  background-color: var(--card-bg-light) !important;
}
.border-light {
  border-color: var(--border-color-light) !important;
}
.shadow-lg {
  box-shadow: 0 1rem 3rem var(--shadow-color-light) !important;
}
.form-label.fw-bold.text-secondary {
  color: var(--muted-text-color-light) !important;
}
.item-type-btn {
  background-color: var(--card-bg-light);
  border-color: #e9ecef; /* Lighter border for unselected */
  color: var(--text-color-light);
}
.item-type-btn.selected-item-type {
  background-color: var(--bs-primary-soft) !important;
  border-color: var(--bs-primary) !important;
  color: var(--bs-primary) !important;
}
.item-type-btn .text-muted {
  color: var(--muted-text-color-light) !important;
}
.form-control, .form-select {
  background-color: var(--card-bg-light);
  color: var(--text-color-light);
  border-color: var(--border-color-light);
}
.input-group-text {
  background-color: var(--page-bg-light); /* Assuming this is like light background for light mode */
  border-color: var(--border-color-light);
  color: var(--bs-primary);
}


/* --- Autocomplete Suggestions List Styles (Consolidated and Fixed) --- */

.list-group {
  position: absolute; /* Essential for floating over content */
  top: 100%; /* Positions it directly below the input */
  left: 0;
  width: 100%; /* Makes it as wide as the input */
  z-index: 1000; /* Ensures it's above other elements */
  max-height: 250px; /* Limits height, adds scroll if many items */
  overflow-y: auto; /* Enables vertical scrolling */
  border-radius: 0.5rem;
  padding: 0; /* Remove default list padding */
  margin-top: 5px; /* A small gap from the input */
  list-style: none; /* Remove default list bullets */

  /* Ensure clear background, border, and shadow for LIGHT MODE */
  background-color: var(--card-bg-light); /* Solid white background */
  border: 1px solid var(--border-color-light); /* Clear border */
  box-shadow: 0 4px 12px var(--shadow-color-light); /* Pronounced shadow */
}

/* Dark mode specific styles for the dropdown container */
body.theme-dark .list-group {
  background-color: var(--card-bg-dark); /* Solid darker background */
  border: 1px solid var(--border-color-dark);
  box-shadow: 0 4px 12px var(--shadow-color-dark);
}

.list-group-item {
  cursor: pointer;
  padding: 0.75rem 1rem;
  border-bottom: 1px solid var(--border-color-light); /* Separator between items for light mode */
  color: rgb(18, 17, 17); /* Ensure text is readable in light mode */
  background-color: white; /* Explicitly set for light mode */
}

/* Remove border from the last item */
.list-group-item:last-child {
  border-bottom: none;
}

/* Light mode specific list item hover */
.list-group-item-action:hover, .list-group-item-action:focus {
  background-color: white !important; /* Use !important to override Bootstrap defaults */
  color: var(--bs-primary) !important;
}

/* Dark mode specific list item styles */
body.theme-dark .list-group-item {
  background-color: var(--card-bg-dark); /* Solid background for dark mode */
  color: var(--text-color-dark); /* Ensure text is readable in dark mode */
  border-color: var(--border-color-dark); /* Separator for dark mode */
}

/* Dark mode specific list item hover */
body.theme-dark .list-group-item-action:hover, body.theme-dark .list-group-item-action:focus {
  background-color: var(--bs-primary-soft-dark) !important; /* Darker soft for hover */
  color: var(--bs-primary-dark-mode) !important;
}

/* --- END Autocomplete Suggestions List Styles --- */


/* Dark Mode Overrides for general page elements */
body.theme-dark {
  background-color: var(--page-bg-dark);
  color: var(--text-color-dark);
}

body.theme-dark .text-dark {
  color: var(--text-color-dark) !important;
}

body.theme-dark .text-muted {
  color: var(--muted-text-color-dark) !important;
}

body.theme-dark .bg-white {
  background-color: var(--card-bg-dark) !important;
}

body.theme-dark .border-light {
  border-color: var(--border-color-dark) !important;
}

body.theme-dark .shadow-lg {
  box-shadow: 0 1rem 3rem var(--shadow-color-dark) !important;
}

body.theme-dark .form-label.fw-bold.text-secondary {
  color: var(--muted-text-color-dark) !important;
}

body.theme-dark .item-type-btn {
  background-color: var(--card-bg-dark);
  border-color: var(--border-color-dark);
  color: var(--text-color-dark);
}
body.theme-dark .item-type-btn .text-muted {
  color: var(--muted-text-color-dark) !important;
}
body.theme-dark .item-type-btn:hover {
  background-color: #3a3a3a; /* Darker soft */
  border-color: var(--bs-primary-dark-mode);
  color: var(--bs-primary-dark-mode);
}

body.theme-dark .item-type-btn.selected-item-type {
  background-color: #3a3a3a !important; /* Darker soft */
  border-color: var(--bs-primary-dark-mode) !important;
  color: var(--bs-primary-dark-mode) !important;
}

body.theme-dark .form-control,
body.theme-dark .form-select {
  background-color: #343a40; /* Darker input background */
  color: var(--text-color-dark);
  border-color: var(--border-color-dark);
}
body.theme-dark .form-control::placeholder {
  color: var(--muted-text-color-dark);
  opacity: 0.7;
}

body.theme-dark .input-group-text {
  background-color: #343a40; /* Darker input group background */
  border-color: var(--border-color-dark);
  color: var(--bs-primary-dark-mode);
}
body.theme-dark .btn-primary {
  background-color: var(--bs-primary-dark-mode) !important;
  border-color: var(--bs-primary-dark-mode) !important;
  color: var(--card-bg-dark) !important; /* Darker text on button */
}
body.theme-dark .btn-primary:hover {
  background-color: #5a8be0 !important; /* Slightly darker primary on hover for dark mode */
  border-color: #5a8be0 !important;
}
body.theme-dark .btn-outline-secondary {
  border-color: var(--muted-text-color-dark);
  color: var(--muted-text-color-dark);
}
body.theme-dark .btn-outline-secondary:hover {
  background-color: var(--muted-text-color-dark);
  color: var(--card-bg-dark);
}

/* Base Styles (rest of your existing CSS - ensure no conflicting overrides) */
.display-5 {
  font-size: 2.5rem;
}

.rounded-4 {
  border-radius: 1.25rem !important;
}

.form-label.fw-bold {
  font-size: 0.9rem;
  margin-bottom: 0.75rem;
}

.form-control,
.form-select,
.form-check-input {
  border-radius: 0.75rem !important;
  padding: 0.75rem 1rem;
  transition: border-color 0.2s ease-in-out, box-shadow 0.2s ease-in-out;
}

.form-control:focus,
.form-select:focus,
.form-check-input:focus {
  border-color: var(--bs-primary);
  box-shadow: 0 0 0 0.25rem rgba(var(--bs-primary-rgb), 0.25);
}

.form-check-input {
  min-width: 1.25em;
  min-height: 1.25em;
  margin-top: 0.25em;
}

.hover-bg-light:hover {
  background-color: #f8f9fa !important; /* Bootstrap's gray-100 */
}
body.theme-dark .hover-bg-light:hover {
  background-color: #343a40 !important; /* Darker hover for checkboxes */
}

.cursor-pointer {
  cursor: pointer;
}

.btn {
  padding: 0.75rem 1.5rem;
  font-weight: 600;
  border-radius: 0.75rem !important;
  transition: all 0.2s ease-in-out;
}

.text-danger {
  color: var(--bs-danger) !important;
}
</style>