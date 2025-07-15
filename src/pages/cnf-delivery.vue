<template>
   <div>
    <div v-if="loading" class="container py-4 max-w-2xl text-center">
      <div class="d-flex flex-column align-items-center justify-content-center" style="min-height: 300px;">
        <div class="spinner-border text-primary" role="status" style="width: 3rem; height: 3rem;">
          <span class="visually-hidden">Loading...</span>
        </div>
        <p class="mt-3 text-muted">Checking delivery status...</p>
      </div>
    </div>
  </div>

  <div v-if="!datatheree && !loading " class="container py-4 max-w-2xl">
  
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
          <p class="text-muted">Please ask the receiver for the 5-digit One-Time Password (OTP) sent to their registered contact number and enter it below.</p>
          <div class="input-group mb-3">
            <span class="input-group-text"><i class="bi bi-key"></i></span>
            <input v-model="otp" type="text" inputmode="numeric" class="form-control form-control-lg" maxlength="5" placeholder="Enter 5-digit OTP" />
          </div>
          <button class="btn btn-primary btn-lg w-100 rounded-pill" :disabled="otp.length !== 5" @click="verifyOTP">
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
              <img v-if="signatureImageBase64" :src="signatureImageBase64" alt="Captured Signature" class="img-fluid mt-2" style="max-height: 100px; border: 1px dashed #ccc; background-color: white;">
            </div>
            <div v-else class="text-muted">
              <i class="bi bi-pencil-square fs-1 mb-2"></i>
              <p class="mb-0">Click 'Capture Signature' for receiver to sign.</p>
            </div>
          </div>
          <div class="d-grid gap-2 mt-3">
            <button class="btn btn-outline-primary btn-lg rounded-pill" @click="captureSignature">
              <i class="bi bi-pencil me-2"></i> {{ signatureCompleted ? 'Recapture Signature' : 'Capture Signature' }}
            </button>
              <button class="btn btn-danger btn-lg rounded-pill" v-if="signatureCompleted" @click="clearSignature">
              <i class="bi bi-trash me-2"></i> Clear Signature
            </button>
            <button class="btn btn-primary btn-lg rounded-pill" :disabled="!signatureCompleted && delivery.requiresSignature" @click="step = 'complete'">
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

    <div class="toast-container position-fixed bottom-0 end-0 p-3">
      <div v-for="toast in toasts" :key="toast.id"
           :class="['toast', 'show', 'align-items-center', `text-bg-${toast.type === 'error' ? 'danger' : toast.type}`, 'border-0']"
           role="alert" aria-live="assertive" aria-atomic="true">
        <div class="d-flex">
          <div class="toast-body">
            {{ toast.message }}
          </div>
          <button type="button" class="btn-close btn-close-white me-2 m-auto" aria-label="Close"
                   @click="removeToast(toast.id)"></button>
        </div>
      </div>
    </div>

    <div class="modal fade" :class="{ 'show d-block': showSignaturePadModal }" tabindex="-1" aria-labelledby="signaturePadModalLabel" aria-hidden="true" v-if="showSignaturePadModal">
      <div class="modal-dialog modal-dialog-centered">
        <div class="modal-content">
          <div class="modal-header">
            <h5 class="modal-title" id="signaturePadModalLabel">Receiver's Signature</h5>
            <button type="button" class="btn-close" @click="cancelSignature" aria-label="Close"></button>
          </div>
          <div class="modal-body text-center">
            <p class="text-muted small">Please sign within the box below.</p>
            <canvas ref="signatureCanvas" class="border border-secondary rounded" width="400" height="200" style="width: 100%; height: 200px; touch-action: none;"></canvas>
            <p class="text-danger small mt-2" v-if="signatureError">{{ signatureError }}</p>
          </div>
          <div class="modal-footer d-flex justify-content-between">
            <button type="button" class="btn btn-outline-secondary rounded-pill" @click="clearSignaturePad">Clear</button>
            <div>
              <button type="button" class="btn btn-secondary rounded-pill me-2" @click="cancelSignature">Cancel</button>
              <button type="button" class="btn btn-primary rounded-pill" @click="saveSignature">Save Signature</button>
            </div>
          </div>
        </div>
      </div>
    </div>
    <div class="modal-backdrop fade" :class="{ 'show': showSignaturePadModal }" v-if="showSignaturePadModal"></div>
  </div>
  <div v-else>
    <div v-if="datatheree" class="container py-4 max-w-2xl" >
      <h3 class="text-center text-success">Delivery Already Confirmed</h3>
      <p class="text-center text-muted">This delivery has already been confirmed. Thank you!</p>
      <div class="text-center">
        <button class="btn btn-primary" @click="$router.push('/carrier-dashboard')">Go to Dashboard</button>
      </div>
    </div>
  </div>
</template>

<script>

import { decryptUserData } from '../cry.js'; // Adjust the import path as necessary

export default {
  data() {
    return {
      datatheree: null,
      loading: true,
      decryptedData: null,
      step: 'otp',
      otp: '',
      photoTaken: false,
      photoFile: null, // Stores the File object (not sent to backend directly)
      photoPreviewUrl: null, // Stores the data URL for preview (and for `finallastphoto`)
      photoError: '',
      signatureCompleted: false,
      deliveryNotes: '',
      isSubmitting: false,
      toasts: [],
      toastIdCounter: 0,

      // These will now directly hold the Base64 data URL strings
      finallastphoto: null,
      finalsignaturebase64: null,

      // Signature Pad properties
      showSignaturePadModal: false,
      signatureCanvas: null,
      signaturePadInstance: null,
      signatureImageBase64: null, // To store the actual Base64 image data URL
      signatureError: '',

      // Dummy delivery data (will be populated/verified by decryptedData)
      delivery: {
        id: 'del-1', // This should likely come from decryptedData's product ID or similar
        itemDescription: 'MacBook Pro laptop',
        itemType: 'Electronics',
        senderName: 'Emily Chen',
        carrierName: 'Sarah Johnson',
        carrierRating: 4.9,
        receiverName: 'John Smith',
        pickupAddress: '123 Tech Street, Boston, MA',
        dropoffAddress: '456 Innovation Ave, New York, NY',
        amount: 40,
        requiresSignature: true, // Set to false if signature is not always required
        requiresOTP: true,
        specialInstructions: 'Handle with care. Receiver available after 3 PM.',
        otp: '' // This will be set by decryptedData
      }
    };
  },
  watch: {
    showSignaturePadModal(newValue) {
      if (newValue) {
        this.$nextTick(() => {
          this.initializeSignaturePad();
        });
      } else {
        if (this.signaturePadInstance) {
          this.signaturePadInstance.off();
          this.signaturePadInstance = null;
        }
      }
    },
    step(newStep, oldStep) {
      // When moving from photo to signature/complete, ensure photo Base64 is stored
      if (oldStep === 'photo' && (newStep === 'signature' || newStep === 'complete') && this.photoPreviewUrl) {
          this.finallastphoto = this.photoPreviewUrl;
          console.log('Photo Base64 for submission stored.');
      }
      // When moving from signature to complete, ensure signature Base64 is stored
      if (oldStep === 'signature' && newStep === 'complete') {
          if (this.delivery.requiresSignature && this.signatureImageBase64) {
              this.finalsignaturebase64 = this.signatureImageBase64;
              console.log('Signature Base64 for submission stored.');
          } else if (!this.delivery.requiresSignature) {
              this.finalsignaturebase64 = null; // Ensure null if signature not required
          }
      }
    },
  },
  created() {
    try {
      const encryptedId = this.$route.params.id;
      if (!encryptedId) {
        throw new Error('Encrypted data ID is missing from route parameters.');
      }

      this.decryptedData = decryptUserData(encryptedId); // Use your actual decryption logic

      if (!this.decryptedData || !this.decryptedData.productId || !this.decryptedData.confirmationBySender ||
         !this.decryptedData.email || !this.decryptedData.otp || !this.decryptedData.transportTripId) {
        throw new Error('Decrypted data is incomplete or invalid.');
      }

      console.log('Decrypted data:', this.decryptedData);
      this.checkConfirmationStatus(this.decryptedData.productId, this.decryptedData.confirmationBySender);
      this.delivery.otp = this.decryptedData.otp; // Set the OTP for verification
      // You might want to populate other `delivery` details from `decryptedData` here if available
      // e.g., this.delivery.id = this.decryptedData.productId;

    } catch (error) {
      console.error('Failed to load delivery details (decryption error):', error);
      this.fireToast({
        type: 'error',
        message: 'Failed to load delivery details. Please try again. (Decryption Error)',
        duration: 5000
      });
      // Optionally redirect to an error page or dashboard
      // this.$router.replace('/error');
    }
  },
  methods: {
    async checkConfirmationStatus(product_id, confirmation_by_sender) {
  const baseUrl = import.meta.env.VITE_API_BASE_URL;
 const endpoint = `${baseUrl}api/check-last-confirmed`; // Your backend endpoint



 try {

const response = await fetch(endpoint, {

method: 'POST', // We're sending data, so it's a POST request

headers: {

'Content-Type': 'application/json', // Tell the server we're sending JSON

},

body: JSON.stringify({ // Convert your JavaScript object to a JSON string

product_id: product_id,

 confirmation_by_sender: confirmation_by_sender,

}),
 });



const result = await response.json(); // Parse the JSON response from the server



if (response.ok) { // Check if the HTTP status code is 2xx (success)
if(result.message=="Matching record found and all required confirmation columns are filled."){
  this.loading = false;
  this.datatheree = true; // Store the data for use in the component

}
console.log('Success:', result.message);

// You can do more here, e.g., update UI, show a success message
 return { success: true, data: result.data, message: result.message };

} else {

 // Handle HTTP errors (4xx or 5xx status codes)

 console.error('Error:', result.message);



return { success: false, message: result.message, status: response.status };

 }

 } catch (error) {


console.error('Network or unexpected error:', error);

return { success: false, message: 'Could not connect to the server. Please try again.', error: error };

 }

},
    isStepCompleted(stepName) {
      if (stepName === 'otp') {
        return this.otp.length === 5 && this.decryptedData && this.decryptedData.otp == this.otp;
      }
      if (stepName === 'photo') {
        return this.photoTaken && this.photoPreviewUrl !== null;
      }
      if (stepName === 'signature') {
        return this.signatureCompleted || !this.delivery.requiresSignature;
      }
      if (stepName === 'complete') {
        const otpComplete = this.otp.length === 5 && this.decryptedData && this.decryptedData.otp == this.otp;
        const photoComplete = this.photoTaken && this.photoPreviewUrl !== null;
        const signatureComplete = this.signatureCompleted || !this.delivery.requiresSignature;
        return otpComplete && photoComplete && signatureComplete;
      }
      return false;
    },

    verifyOTP() {
      if (this.otp.length === 5 && this.decryptedData && this.decryptedData.otp == this.otp) {
        console.log('OTP Verified.');
        this.fireToast({
          type: 'success',
          message: 'OTP verified successfully!',
          duration: 2000
        });
        setTimeout(() => {
          this.step = 'photo';
        }, 800);
      } else {
        this.fireToast({
          type: 'error',
          message: 'Invalid OTP. Please try again.',
          duration: 3000
        });
      }
    },

    fireToast({ type, message, duration = 3000 }) {
      const id = this.toastIdCounter++;
      this.toasts.push({ id, message, type });

      setTimeout(() => {
        this.removeToast(id);
      }, duration);
    },

    removeToast(id) {
      this.toasts = this.toasts.filter(toast => toast.id !== id);
    },

    triggerFileInput() {
      this.$refs.photoInput.click();
    },

    handlePhotoUpload(event) {
      const file = event.target.files[0];
      this.photoError = '';

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

        this.photoFile = file; // Storing the File object
        this.photoTaken = true;

        const reader = new FileReader();
        reader.onload = (e) => {
          this.photoPreviewUrl = e.target.result; // This is the Base64 data URL
        };
        reader.readAsDataURL(file);
      } else {
        this.clearPhoto();
      }
    },

    clearPhoto() {
      this.photoFile = null;
      this.photoPreviewUrl = null;
      this.photoTaken = false;
      this.$refs.photoInput.value = ''; // Clear file input
      this.photoError = '';
      this.finallastphoto = null; // Also clear the data for submission
    },

    continueFromPhoto() {
      if (!this.photoPreviewUrl) {
        this.photoError = 'Please upload a photo to proceed.';
        return;
      }
      this.photoError = '';

      if (this.delivery.requiresSignature) {
        this.step = 'signature';
      } else {
        this.step = 'complete';
      }
    },

    // --- Signature Pad Methods ---
    captureSignature() {
      this.signatureError = '';
      this.showSignaturePadModal = true;
      this.fireToast({
        type: 'info',
        message: 'Please sign on the pad and click Save.',
        duration: 3000
      });
    },

    initializeSignaturePad() {
      this.signatureCanvas = this.$refs.signatureCanvas;
      if (!this.signatureCanvas) {
        console.error('Signature canvas element not found!');
        this.fireToast({
          type: 'error',
          message: 'Signature pad failed to load.',
          duration: 3000
        });
        return;
      }

      // Important: Set canvas width/height attributes explicitly for SignaturePad
      const computedStyle = getComputedStyle(this.signatureCanvas);
      this.signatureCanvas.width = parseInt(computedStyle.width);
      this.signatureCanvas.height = parseInt(computedStyle.height);

      this.signaturePadInstance = new SignaturePad(this.signatureCanvas, {
        backgroundColor: 'rgb(255, 255, 255)',
        penColor: 'rgb(0, 0, 0)'
      });
       // If a signature was already captured, load it for editing/viewing
      if (this.signatureImageBase64) {
          this.signaturePadInstance.fromDataURL(this.signatureImageBase64);
      }
    },

    saveSignature() {
      if (this.signaturePadInstance.isEmpty()) {
        this.signatureError = 'Please provide a signature to save.';
        this.fireToast({
          type: 'warning',
          message: 'Signature pad is empty. Please sign.',
          duration: 3000
        });
        return;
      }

      // Get signature as a Base64 encoded PNG image data URL
      this.signatureImageBase64 = this.signaturePadInstance.toDataURL('image/png');

      this.signatureCompleted = true;
      this.showSignaturePadModal = false;
      this.signatureError = '';

      console.log('Signature Base64 data URL captured (first 50 chars):', this.signatureImageBase64.substring(0, 50) + '...');
    },

    clearSignaturePad() {
      if (this.signaturePadInstance) {
        this.signaturePadInstance.clear();
        this.signatureError = '';
        this.fireToast({
          type: 'info',
          message: 'Signature pad cleared.',
          duration: 1000
        });
      }
    },

    clearSignature() {
        this.signatureCompleted = false;
        this.signatureImageBase64 = null; // Clear the Base64 data URL
        this.finalsignaturebase64 = null; // Clear the data for submission as well
        if (this.signaturePadInstance) {
              this.signaturePadInstance.clear();
        }
        this.fireToast({
          type: 'info',
          message: 'Signature cleared from delivery.',
          duration: 1500
        });
    },

    cancelSignature() {
      this.showSignaturePadModal = false;
      this.signatureError = '';
      if (this.signaturePadInstance) {
        this.signaturePadInstance.clear();
      }
      this.fireToast({
          type: 'info',
          message: 'Signature capture cancelled.',
          duration: 2000
      });
    },
    // --- End Signature Pad Methods ---

    async confirmDelivery() {
      this.isSubmitting = true;
      console.log('Confirming delivery...');

      // Ensure that finallastphoto and finalsignaturebase64 are updated right before submission
      // This is primarily for safety, as the `watch` handlers should usually take care of it.
      if (this.photoPreviewUrl) {
          this.finallastphoto = this.photoPreviewUrl;
      }
      if (this.delivery.requiresSignature && this.signatureImageBase64) {
          this.finalsignaturebase64 = this.signatureImageBase64;
      } else if (!this.delivery.requiresSignature) {
          this.finalsignaturebase64 = null; // Explicitly null if not required
      }

      const confirmationData = {
        // Ensure these IDs come from the decrypted data
        productId: this.decryptedData.productId,
        transportTripId: this.decryptedData.transportTripId,
        // The frontend logic already sets decryptedData.confirmationBySender for `confirmation_by_sender`
        // Make sure `confirmationBySender` is indeed the value for `transportTripId` or if it's a separate field.
        // Based on your original code's `.eq('confirmation_by_sender', transportTripId)`, it seems `transportTripId`
        // is what maps to `confirmation_by_sender` in the DB.
        confirmationBySender: this.decryptedData.confirmationBySender, 
        
        confirmedAt: new Date().toISOString(),
        finallastphoto: this.finallastphoto, // Base64 data URL string
        finalsignaturebase64 : this.finalsignaturebase64, // Base64 data URL string
        notes: this.deliveryNotes,
        status: 'delivered', // Set a status for the delivery record
        email: this.decryptedData.email
      };

      console.log('Final Confirmation Data for API:', confirmationData);
      const baseUrl = import.meta.env.VITE_API_BASE_URL ; // Fallback for VITE_API_BASE_URL

      try {
        const response = await fetch(`${baseUrl}cnf-deliverypart2`, {
          method: 'POST',
          headers: {
            'Content-Type': 'application/json'
          },
          body: JSON.stringify(confirmationData)
        });

        const resData = await response.json();

        if (!response.ok) {
          throw new Error(resData.message || 'Failed to confirm delivery.');
        }

        this.fireToast({
          type: 'success',
          message: resData.message || 'Delivery confirmed!',
          duration: 3000
        });

        // Simulate success and redirect
        setTimeout(() => {
          this.$router.push({
            path: '/carrier-dashboard',
            query: {
              message: 'Delivery confirmed successfully! Payment has been processed.',
              type: 'success'
            }
          });
          this.isSubmitting = false;
        }, 2000);

      } catch (error) {
        console.error('Error confirming delivery:', error);
        this.fireToast({
          type: 'error',
          message: error.message || 'Something went wrong during confirmation!',
          duration: 5000
        });
        this.isSubmitting = false;
      }
    }
  }
};
</script>

<style scoped>
/* Your existing CSS styles go here */
/* Dark Theme Adjustments */
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


/* General Styling */
.max-w-2xl {
  max-width: 720px;
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
  z-index: 1;
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

.border.rounded-3 {
  border-width: 2px !important;
  border-style: dashed !important;
  border-color: var(--bs-border-color-translucent) !important;
}

.bg-light-subtle {
  background-color: var(--bs-body-bg) !important;
}

/* Photo Upload Area */
.photo-upload-area {
  position: relative;
  overflow: hidden;
  border-color: var(--bs-border-color) !important;
}

.photo-upload-area:hover {
  border-color: var(--bs-primary) !important;
}

.photo-upload-area.has-photo {
  border-style: solid !important;
  border-color: var(--bs-success) !important;
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
  object-fit: contain;
}

.photo-preview-wrapper .overlay {
  position: absolute;
  top: 0;
  left: 0;
  right: 0;
  bottom: 0;
  background-color: rgba(0, 0, 0, 0.3);
  display: flex;
  align-items: center;
  justify-content: center;
  opacity: 0;
  transition: opacity 0.3s ease;
}

.photo-preview-wrapper:hover .overlay {
  opacity: 1;
}

/* Animations */
.animate__animated {
  --animate-duration: 0.6s;
}

/* Toast Container (NEW STYLING FOR NATIVE BOOTSTRAP TOASTS) */
.toast-container {
  z-index: 1080; /* Ensures toasts are above most other elements */
}

/* Modal styles (basic) */
.modal-backdrop.show {
  opacity: 0.5; /* Bootstrap's default backdrop opacity */
}
</style>