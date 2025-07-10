<template>
  <div class="container py-4 max-w-2xl">
    <div class="d-flex align-items-center gap-3 mb-4">
      <button class="btn btn-link p-0 text-decoration-none" @click="$router.push('/carrier-dashboard')" aria-label="Go back to dashboard">
        <i class="bi bi-arrow-left fs-4 text-muted"></i>
      </button>
      <div>
        <h3 class="mb-0 fw-bold">Confirm Delivery</h3>
        <small class="text-secondary">Complete the verification process to finalize delivery.</small>
      </div>
    </div>

    <div class="card shadow-sm rounded-4 mb-4 animate__animated animate__fadeInDown">
      <div class="card-body p-4">
        <div class="d-flex justify-content-between align-items-start mb-3">
          <h5 class="card-title fw-bold text-primary">{{ delivery.itemDescription }}</h5>
          <span class="badge bg-success-subtle text-success fs-6 px-3 py-2 rounded-pill"><i class="bi bi-check-circle-fill me-1"></i> Ready for Confirmation</span>
        </div>
        
        <div class="row g-2 mb-3">
          <div class="col-6">
            <p class="mb-0 text-muted small"><i class="bi bi-tag-fill me-2 text-info"></i><span class="fw-medium">Type:</span> {{ delivery.itemType }}</p>
          </div>
          <div class="col-6">
            <p class="mb-0 text-muted small"><i class="bi bi-truck-flatbed me-2 text-primary"></i><span class="fw-medium">Carrier:</span> {{ delivery.carrierName }} (⭐ {{ delivery.carrierRating }})</p>
          </div>
          <div class="col-12">
            <p class="mb-0 text-muted small"><i class="bi bi-geo-alt-fill me-2 text-warning"></i><span class="fw-medium">Pickup:</span> {{ delivery.pickupAddress }}</p>
          </div>
          <div class="col-12">
            <p class="mb-0 text-muted small"><i class="bi bi-geo-alt-fill me-2 text-danger"></i><span class="fw-medium">Dropoff:</span> {{ delivery.dropoffAddress }}</p>
          </div>
          <div class="col-6">
            <p class="mb-0 text-muted small"><i class="bi bi-currency-rupee me-2 text-success"></i><span class="fw-medium">Amount:</span> ₹{{ delivery.amount }}</p>
          </div>
        </div>

        <div v-if="delivery.specialInstructions" class="alert alert-info border-info-subtle bg-info-subtle text-info-emphasis mt-3 rounded-3">
          <i class="bi bi-info-circle-fill me-2"></i><strong>Instructions:</strong> {{ delivery.specialInstructions }}
        </div>
      </div>
    </div>

    <div class="card shadow-sm rounded-4 mb-4 p-3 animate__animated animate__fadeIn">
      <div class="d-flex justify-content-around align-items-center step-indicator">
        <div class="text-center step-item" :class="{ 'active': step === 'otp', 'completed': isStepCompleted('otp') }">
          <div class="step-icon">
            <i class="bi bi-patch-check-fill" v-if="isStepCompleted('otp')"></i>
            <i class="bi bi-key-fill" v-else></i>
          </div>
          <small class="step-label">OTP</small>
        </div>
        <div class="step-line" :class="{ 'completed': isStepCompleted('otp') }"></div>
        <div class="text-center step-item" :class="{ 'active': step === 'photo', 'completed': isStepCompleted('photo') }">
          <div class="step-icon">
            <i class="bi bi-patch-check-fill" v-if="isStepCompleted('photo')"></i>
            <i class="bi bi-camera-fill" v-else></i>
          </div>
          <small class="step-label">Photo</small>
        </div>
        <div class="step-line" :class="{ 'completed': isStepCompleted('photo') }"></div>
        <div class="text-center step-item" :class="{ 'active': step === 'signature', 'completed': isStepCompleted('signature') && delivery.requiresSignature }">
          <div class="step-icon">
            <i class="bi bi-patch-check-fill" v-if="isStepCompleted('signature') && delivery.requiresSignature"></i>
            <i class="bi bi-pencil-fill" v-else></i>
          </div>
          <small class="step-label">Signature</small>
        </div>
        <div class="step-line" :class="{ 'completed': isStepCompleted('signature') || !delivery.requiresSignature }"></div>
        <div class="text-center step-item" :class="{ 'active': step === 'complete', 'completed': isStepCompleted('complete') }">
          <div class="step-icon">
            <i class="bi bi-patch-check-fill" v-if="isStepCompleted('complete')"></i>
            <i class="bi bi-box-seam-fill" v-else></i>
          </div>
          <small class="step-label">Finalize</small>
        </div>
      </div>
    </div>

    <div class="card shadow-sm rounded-4">
      <div class="card-body p-4 animate__animated animate__fadeIn">
        <h4 class="mb-3 fw-bold text-secondary-emphasis">Verification Steps</h4>

        <div v-if="step === 'otp'" class="animate__animated animate__fadeIn">
          <h5 class="mb-3 fw-semibold">1. OTP Verification</h5>
          <p class="text-muted">Please ask the receiver for the 6-digit One-Time Password (OTP) sent to their registered contact number and enter it below.</p>
          <div class="input-group mb-3">
            <span class="input-group-text"><i class="bi bi-key"></i></span>
            <input v-model="otp" type="text" inputmode="numeric" class="form-control form-control-lg" maxlength="6" placeholder="Enter 6-digit OTP" />
          </div>
          <button class="btn btn-primary btn-lg w-100 rounded-pill" :disabled="otp.length !== 6" @click="verifyOTP">
            <i class="bi bi-check-circle me-2"></i> Verify OTP
          </button>
        </div>

        <div v-else-if="step === 'photo'" class="animate__animated animate__fadeIn">
          <h5 class="mb-3 fw-semibold">2. Photo Proof of Delivery</h5>
          <p class="text-muted">Capture or upload a clear photo of the delivered item at the drop-off location or with the receiver, if appropriate.</p>
          
          <div class="photo-upload-area border rounded-3 p-4 text-center d-flex flex-column justify-content-center align-items-center bg-light-subtle"
               :class="{'has-photo': photoPreviewUrl}"
               style="min-height: 200px; cursor: pointer;"
               @click="triggerFileInput">
            
            <input type="file" ref="photoInput" @change="handlePhotoUpload" accept="image/*" class="d-none" />

            <div v-if="photoPreviewUrl" class="photo-preview-wrapper animate__animated animate__zoomIn">
              <img :src="photoPreviewUrl" alt="Delivery Proof" class="img-fluid rounded-2 shadow-sm" />
              <div class="overlay">
                <i class="bi bi-check-circle-fill text-success fs-1"></i>
              </div>
            </div>
            <div v-else class="text-muted animate__animated animate__fadeIn">
              <i class="bi bi-camera fs-1 mb-2"></i>
              <p class="mb-0">Click here or 'Upload Photo' to select an image.</p>
            </div>
          </div>
          <p v-if="photoError" class="text-danger small mt-2 animate__animated animate__shakeX">{{ photoError }}</p>

          <div class="d-grid gap-2 mt-3">
            <button class="btn btn-outline-primary btn-lg rounded-pill" @click="triggerFileInput">
              <i class="bi bi-upload me-2"></i> {{ photoPreviewUrl ? 'Change Photo' : 'Upload Photo' }}
            </button>
            <button class="btn btn-danger btn-lg rounded-pill" v-if="photoPreviewUrl" @click="clearPhoto">
              <i class="bi bi-trash me-2"></i> Clear Photo
            </button>
            <button class="btn btn-primary btn-lg rounded-pill" :disabled="!photoPreviewUrl" @click="continueFromPhoto">
              <i class="bi bi-arrow-right-circle me-2"></i> Continue
            </button>
          </div>
        </div>

        <div v-else-if="step === 'signature'" class="animate__animated animate__fadeIn">
          <h5 class="mb-3 fw-semibold">3. Digital Signature</h5>
          <p class="text-muted">Request the receiver to provide their digital signature below as proof of receipt.</p>
          <div class="border rounded-3 p-4 text-center d-flex flex-column justify-content-center align-items-center bg-light-subtle" style="min-height: 180px">
            <div v-if="signatureCompleted" class="text-success animate__animated animate__zoomIn">
              <i class="bi bi-check-circle-fill fs-1 mb-2"></i>
              <p class="mb-0 fw-semibold">Signature captured successfully!</p>
            </div>
            <div v-else class="text-muted">
              <i class="bi bi-pencil-square fs-1 mb-2"></i>
              <p class="mb-0">Click 'Capture Signature' for receiver to sign.</p>
            </div>
          </div>
          <div class="d-grid gap-2 mt-3">
            <button class="btn btn-outline-primary btn-lg rounded-pill" @click="captureSignature">
              <i class="bi bi-pencil me-2"></i> Capture Signature
            </button>
            <button class="btn btn-primary btn-lg rounded-pill" v-if="signatureCompleted" @click="step = 'complete'">
              <i class="bi bi-arrow-right-circle me-2"></i> Continue to Final Confirmation
            </button>
          </div>
        </div>

        <div v-else-if="step === 'complete'" class="animate__animated animate__fadeIn">
          <h5 class="mb-3 fw-semibold">4. Final Confirmation</h5>
          <p class="text-success fw-medium"><i class="bi bi-check-circle-fill me-2"></i>All required verification steps have been successfully completed.</p>

          <div class="form-group mb-3">
            <label for="notes" class="form-label text-muted fw-medium">Delivery Notes (Optional)</label>
            <textarea id="notes" class="form-control rounded-3" rows="3" v-model="deliveryNotes" placeholder="Add any specific notes about the delivery..."></textarea>
          </div>

          <button class="btn btn-success btn-lg w-100 rounded-pill" @click="confirmDelivery" :disabled="isSubmitting">
            <span v-if="isSubmitting" class="spinner-border spinner-border-sm me-2" role="status" aria-hidden="true"></span>
            {{ isSubmitting ? 'Finalizing Delivery...' : 'Confirm Delivery Complete' }}
          </button>
        </div>
      </div>
    </div>
  </div>
</template>

<script>
export default {
  data() {
    return {
      step: 'otp', // Current step in the verification process
      otp: '', // Stores the entered OTP
      photoTaken: false, // Flag for photo completion
      photoFile: null, // Stores the actual photo File object
      photoPreviewUrl: null, // Stores the Data URL for image preview
      photoError: '', // Error message for photo upload
      signatureCompleted: false, // Flag for signature completion
      deliveryNotes: '', // Optional notes for delivery
      isSubmitting: false, // Loading state for final submission
      delivery: {
        id: 'del-1',
        itemDescription: 'MacBook Pro laptop',
        itemType: 'Electronics',
        senderName: 'Emily Chen',
        senderAvatar: '',
        carrierName: 'Sarah Johnson',
        carrierAvatar: '',
        carrierRating: 4.9,
        receiverName: 'John Smith',
        pickupAddress: '123 Tech Street, Boston, MA',
        dropoffAddress: '456 Innovation Ave, New York, NY',
        amount: 40, // Assuming this is USD for the placeholder
        requiresSignature: true, // Example: delivery requires signature
        requiresOTP: true, // Example: delivery requires OTP
        specialInstructions: 'Handle with care. Receiver available after 3 PM.'
      }
    };
  },
  methods: {
    /**
     * Checks if a given step has been completed.
     * Used for the step progress indicator.
     * @param {string} stepName - The name of the step (e.g., 'otp', 'photo').
     * @returns {boolean} True if the step is completed, false otherwise.
     */
    isStepCompleted(stepName) {
      if (stepName === 'otp') {
        return this.otp.length === 6;
      }
      if (stepName === 'photo') {
        return this.photoTaken && this.photoFile !== null;
      }
      if (stepName === 'signature') {
        return this.signatureCompleted || !this.delivery.requiresSignature; // Signature not required means it's "completed"
      }
      if (stepName === 'complete') {
        // All preceding steps must be completed based on their requirements
        const otpComplete = this.otp.length === 6;
        const photoComplete = this.photoTaken && this.photoFile !== null;
        const signatureComplete = this.signatureCompleted || !this.delivery.requiresSignature;
        return otpComplete && photoComplete && signatureComplete;
      }
      return false;
    },
    /**
     * Verifies the entered OTP and moves to the next step.
     */
    verifyOTP() {
      if (this.otp.length === 6) {
        // Simulate API call for OTP verification
        console.log('Verifying OTP:', this.otp);
        setTimeout(() => {
          this.step = 'photo'; // Move to photo step on successful OTP verification
        }, 800); // Shorter delay for smoother UX
      }
    },
    /**
     * Triggers the hidden file input element.
     */
    triggerFileInput() {
      this.$refs.photoInput.click();
    },
    /**
     * Handles the photo file selection and displays a preview.
     * @param {Event} event - The change event from the file input.
     */
    handlePhotoUpload(event) {
      const file = event.target.files[0];
      this.photoError = ''; // Clear previous errors

      if (file) {
        if (!file.type.startsWith('image/')) {
          this.photoError = 'Please upload an image file (e.g., JPG, PNG).';
          this.clearPhoto();
          return;
        }
        if (file.size > 5 * 1024 * 1024) { // 5MB limit
          this.photoError = 'File size exceeds 5MB. Please upload a smaller image.';
          this.clearPhoto();
          return;
        }

        this.photoFile = file;
        this.photoTaken = true;

        // Create a URL for the image preview
        const reader = new FileReader();
        reader.onload = (e) => {
          this.photoPreviewUrl = e.target.result;
        };
        reader.readAsDataURL(file);
      } else {
        this.clearPhoto();
      }
    },
    /**
     * Clears the selected photo and its preview.
     */
    clearPhoto() {
      this.photoFile = null;
      this.photoPreviewUrl = null;
      this.photoTaken = false;
      this.$refs.photoInput.value = ''; // Reset file input
      this.photoError = '';
    },
    /**
     * Continues from the photo step to either signature or final confirmation.
     */
    continueFromPhoto() {
      if (!this.photoFile) {
        this.photoError = 'Please upload a photo to proceed.';
        return;
      }
      this.photoError = ''; // Clear error if photo exists

      if (this.delivery.requiresSignature) {
        this.step = 'signature'; // Move to signature step if required
      } else {
        this.step = 'complete'; // Otherwise, move directly to complete step
      }
    },
    /**
     * Simulates capturing a digital signature.
     */
    captureSignature() {
      console.log('Simulating signature capture...');
      setTimeout(() => {
        this.signatureCompleted = true; // Mark signature as completed
      }, 800); // Simulate processing time
    },
    /**
     * Confirms the final delivery and redirects to the dashboard.
     */
    confirmDelivery() {
      this.isSubmitting = true; // Show loading spinner
      console.log('Confirming delivery...');

      // In a real application, you would send this.photoFile and other data to your backend
      // using FormData and an API call (e.g., Axios).
      // For this example, we'll just log its presence.
      if (this.photoFile) {
        console.log('Photo file to be uploaded:', this.photoFile.name, this.photoFile.size, this.photoFile.type);
      }

      // Simulate API call to confirm delivery
      setTimeout(() => {
        const confirmationData = {
          deliveryId: this.delivery.id,
          confirmedAt: new Date().toISOString(),
          otp: this.otp,
          photoUploaded: this.photoFile !== null, // Indicate if photo was uploaded
          // In a real app, you might include a reference to the uploaded photo's URL
          signatureCompleted: this.signatureCompleted,
          notes: this.deliveryNotes,
          status: 'delivered'
        };
        // Store confirmation data (e.g., in localStorage or send to backend)
        localStorage.setItem(`delivery-confirmation-${this.delivery.id}`, JSON.stringify(confirmationData));
        
        // Redirect to dashboard with a success message
        this.$router.push({
          path: '/carrier-dashboard', // Changed to carrier-dashboard for consistency
          query: {
            message: 'Delivery confirmed successfully! Payment has been processed.',
            type: 'success'
          }
        });
        this.isSubmitting = false; // Reset submitting state
      }, 2000); // Simulate network delay
    }
  }
};
</script>

<style scoped>
/* Base styling for dark theme compatibility */
body.theme-dark .container {
  background-color: #1a1a1a;
  color: #e0e0e0;
}

body.theme-dark .card {
  background-color: #2a2a2a;
  border-color: #3a3a3a;
  color: #e0e0e0;
}

body.theme-dark .card-header {
  background-color: #333;
  border-bottom-color: #3a3a3a;
  color: #fff;
}

body.theme-dark .text-muted,
body.theme-dark .text-secondary {
  color: #b0b0b0 !important;
}

body.theme-dark .form-control,
body.theme-dark .form-control:focus {
  background-color: #3a3a3a;
  border-color: #555;
  color: #e0e0e0;
}

body.theme-dark .form-control::placeholder {
  color: #999;
}

body.theme-dark .btn-link {
  color: #b0b0b0;
}

body.theme-dark .btn-link:hover {
  color: #fff;
}

body.theme-dark .alert-info {
  background-color: #2c3a4a;
  border-color: #4a6788;
  color: #a0c0e0;
}

body.theme-dark .bg-light-subtle {
  background-color: #3a3a3a !important;
}

/* General component styling */
.max-w-2xl {
  max-width: 720px; /* Equivalent to Bootstrap's .mw-md */
  margin-left: auto;
  margin-right: auto;
}

/* Header arrow button */
.btn-link {
  font-size: 1.5rem;
  color: var(--bs-secondary);
  transition: color 0.2s ease;
}

.btn-link:hover {
  color: var(--bs-primary);
}

/* Card Styling */
.card {
  border-radius: 1rem;
  overflow: hidden;
  box-shadow: 0 0.5rem 1.5rem rgba(0, 0, 0, 0.05);
}

.card-header {
  font-size: 1.1rem;
  font-weight: 600;
  background-color: var(--bs-light);
  border-bottom: 1px solid var(--bs-border-color-translucent);
}

/* Delivery Info Card specific */
.badge.bg-success-subtle {
  background-color: var(--bs-success-bg-subtle);
  color: var(--bs-success-text-emphasis);
  font-weight: 600;
}

/* Step Indicator */
.step-indicator {
  position: relative;
  display: flex;
  justify-content: space-between;
  align-items: center;
  padding: 1rem 0;
}

.step-item {
  display: flex;
  flex-direction: column;
  align-items: center;
  position: relative;
  z-index: 1; /* Ensures icon is above line */
  transition: all 0.3s ease;
  color: var(--bs-secondary-text-emphasis);
}

.step-item .step-icon {
  width: 48px;
  height: 48px;
  background-color: var(--bs-light);
  border-radius: 50%;
  display: flex;
  align-items: center;
  justify-content: center;
  font-size: 1.5rem;
  margin-bottom: 0.5rem;
  border: 2px solid var(--bs-border-color);
  transition: all 0.3s ease;
}

.step-item.active .step-icon {
  background-color: var(--bs-primary);
  color: white;
  border-color: var(--bs-primary);
  box-shadow: 0 0 0 0.25rem rgba(var(--bs-primary-rgb), 0.25);
}

.step-item.completed .step-icon {
  background-color: var(--bs-success);
  color: white;
  border-color: var(--bs-success);
}

.step-item.active .step-label {
  font-weight: 600;
  color: var(--bs-primary);
}

.step-item.completed .step-label {
  color: var(--bs-success);
}

.step-line {
  position: absolute;
  top: calc(50% - 1px);
  left: 0;
  right: 0;
  height: 2px;
  background-color: var(--bs-border-color);
  z-index: 0;
  transition: background-color 0.3s ease;
}

.step-line.completed {
  background-color: var(--bs-success);
}

/* Input and Button Styling */
.form-control-lg {
  padding: 0.75rem 1.25rem;
  font-size: 1.1rem;
}

.input-group-text {
  background-color: var(--bs-light);
  border-right: 0;
  border-color: var(--bs-border-color);
}

.btn-lg {
  padding: 0.75rem 1.5rem;
  font-size: 1.1rem;
  font-weight: 600;
}

.rounded-pill {
  border-radius: 50rem !important;
}

.btn-primary, .btn-success {
  box-shadow: 0 0.25rem 0.75rem rgba(0, 0, 0, 0.1);
  transition: all 0.2s ease;
}

.btn-primary:hover, .btn-success:hover {
  transform: translateY(-2px);
  box-shadow: 0 0.5rem 1rem rgba(0, 0, 0, 0.15);
}

.btn-outline-primary, .btn-outline-secondary {
  transition: all 0.2s ease;
}

.btn-outline-primary:hover, .btn-outline-secondary:hover {
  transform: translateY(-2px);
}

/* Proof Sections (Photo/Signature) */
.border.rounded-3 {
  border-width: 2px !important;
  border-style: dashed !important;
  border-color: var(--bs-border-color-translucent) !important;
}

.bg-light-subtle {
  background-color: var(--bs-body-bg) !important; /* Adjust for better contrast */
}

/* Photo Upload Area Specific Styles */
.photo-upload-area {
  position: relative;
  overflow: hidden;
  border-color: var(--bs-border-color) !important;
}

.photo-upload-area:hover {
  border-color: var(--bs-primary) !important;
}

.photo-upload-area.has-photo {
  border-style: solid !important; /* Solid border once photo is uploaded */
  border-color: var(--bs-success) !important; /* Green border to indicate success */
}

.photo-preview-wrapper {
  position: relative;
  width: 100%;
  height: 100%;
  display: flex;
  align-items: center;
  justify-content: center;
  overflow: hidden;
}

.photo-preview-wrapper img {
  max-width: 100%;
  max-height: 100%;
  object-fit: contain; /* Ensures the whole image is visible */
}

.photo-preview-wrapper .overlay {
  position: absolute;
  top: 0;
  left: 0;
  right: 0;
  bottom: 0;
  background-color: rgba(0, 0, 0, 0.3); /* Darker overlay for icon visibility */
  display: flex;
  align-items: center;
  justify-content: center;
  opacity: 0;
  transition: opacity 0.3s ease;
}

.photo-preview-wrapper:hover .overlay {
  opacity: 1; /* Show overlay on hover */
}

/* Animate.css integration (ensure you have Animate.css imported in your main project) */
.animate__animated {
  --animate-duration: 0.6s; /* Slightly slower for a smoother feel */
}
</style>