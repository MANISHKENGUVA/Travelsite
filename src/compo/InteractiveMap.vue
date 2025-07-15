You're right\! My apologies. When you said "like the blue line," I should have inferred that you meant the *curved, road-based* route that the OSRM service provides, not just a solid straight line.

The reason your red line was appearing as a straight, dashed line, even after I fixed the `fetch(url)` typo, is because **I did not provide the full corrected code.** The previous response only showed the *snippet* where I fixed the `fetch` call, but the issue with the `userToPickupUrl` not being used for the `fetch` in the "user to pickup" section still remained.

My apologies for that oversight. Let's fix this properly.

The core issue was that I had copied `fetch(url)` into both sections, but the first section (user to pickup) needed `fetch(userToPickupUrl)`.

Here's the corrected `updateMapElements` method with the correct variable being used in the `fetch` call for the user-to-pickup route, ensuring it attempts to get a curved, road-based route:

```javascript
<template>
  <div class="interactive-map-container">
    <div id="mapContainer" class="map-container"></div>
    <div v-if="!userLiveLocation && !geolocationError" class="loading-overlay">
      Getting your live location...
    </div>
    <div v-if="geolocationError" class="error-message">
      {{ geolocationError }}
    </div>
  </div>
</template>

<script>
import L from 'leaflet';
import 'leaflet/dist/leaflet.css';

// Fix for default marker icon issues with Webpack/Vite
delete L.Icon.Default.prototype._getIconUrl;
L.Icon.Default.mergeOptions({
  iconRetinaUrl: 'https://unpkg.com/leaflet@1.9.4/dist/images/marker-icon-2x.png',
  iconUrl: 'https://unpkg.com/leaflet@1.9.4/dist/images/marker-icon.png',
  shadowUrl: 'https://unpkg.com/leaflet@1.9.4/dist/images/marker-shadow.png',
});

export default {
  name: 'InteractiveMap',
  props: {
    pickupCoords: {
      type: Object, // { lat: number, lng: number }
      required: true
    },
    deliveryCoords: {
      type: Object, // { lat: number, lng: number }
      required: true
    },
    // This prop can still be used if you want to provide a static initial user location,
    // but userLiveLocation will take precedence if geolocation is successful.
    userLocationCoords: {
      type: Object, // { lat: number, lng: number }
      default: null
    },
    autoOpenUserPopup: {
      type: Boolean,
      default: true // Changed default to true for live location scenario
    }
  },
  data() {
    return {
      map: null,
      pickupMarker: null,
      deliveryMarker: null,
      userLocationMarker: null,
      routePolyline: null, // Polyline for pickup to delivery (blue route)
      routeToPickupPolyline: null, // Polyline for user location to pickup (red route)

      userLiveLocation: null, // NEW: To store live user coordinates {lat, lng}
      geolocationWatchId: null, // NEW: To store the watch ID for clearing
      geolocationError: null, // NEW: To store geolocation errors

      pickupIcon: L.icon({
        iconUrl: 'https://cdn-icons-png.flaticon.com/512/684/684807.png',
        iconSize: [38, 38],
        iconAnchor: [19, 38],
        popupAnchor: [0, -38]
      }),
      deliveryIcon: L.icon({
        iconUrl: 'https://cdn-icons-png.flaticon.com/512/25/25694.png',
        iconSize: [38, 38],
        iconAnchor: [19, 38],
        popupAnchor: [0, -38]
      }),
      userLocationIcon: L.icon({
        // A more dynamic icon for live location, maybe a dot or a person
        iconUrl: 'https://cdn-icons-png.flaticon.com/512/456/456283.png',
        iconSize: [35, 35],
        iconAnchor: [17, 35],
        popupAnchor: [0, -40]
      })
    };
  },
  mounted() {
    this.initMap();
    this.startWatchingUserLocation(); // Start watching location on mount
    this.$nextTick(() => {
      // Initial update, will include pickup/delivery if available
      this.updateMapElements();
    });
  },
  watch: {
    // Only watch pickup/delivery. userLiveLocation will trigger its own updates
    pickupCoords: {
      handler() {
        this.updateMapElements();
      },
      deep: true
    },
    deliveryCoords: {
      handler() {
        this.updateMapElements();
      },
      deep: true
    },
    // NEW: Watch for changes in live user location
    userLiveLocation: {
      handler(newCoords, oldCoords) {
        // Only update if coords actually changed to avoid unnecessary redraws
        if (newCoords && (!oldCoords || newCoords.lat !== oldCoords.lat || newCoords.lng !== oldCoords.lng)) {
          console.log('Live user location updated:', newCoords);
          this.updateMapElements();
        }
      },
      deep: true
    }
  },
  beforeUnmount() {
    this.stopWatchingUserLocation(); // Stop watching location on unmount
    if (this.routePolyline) { this.map.removeLayer(this.routePolyline); }
    if (this.routeToPickupPolyline) { this.map.removeLayer(this.routeToPickupPolyline); }
    if (this.pickupMarker) { this.map.removeLayer(this.pickupMarker); }
    if (this.deliveryMarker) { this.map.removeLayer(this.deliveryMarker); }
    if (this.userLocationMarker) { this.map.removeLayer(this.userLocationMarker); }
    if (this.map) {
      this.map.remove();
    }
  },
  methods: {
    initMap() {
      if (this.map) return; // Prevent re-initialization

      this.map = L.map('mapContainer', {
        zoomControl: true
      }).setView([17.40, 78.48], 11); // Default view for Hyderabad

      L.tileLayer('https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png', {
        attribution: '&copy; <a href="https://www.openstreetmap.org/copyright">OpenStreetMap</a> contributors'
      }).addTo(this.map);
    },

    startWatchingUserLocation() {
      if (!('geolocation' in navigator)) {
        this.geolocationError = 'Geolocation is not supported by your browser.';
        console.error(this.geolocationError);
        return;
      }

      console.log('Attempting to get live user location...');
      this.geolocationWatchId = navigator.geolocation.watchPosition(
        (position) => {
          this.geolocationError = null; // Clear any previous errors
          this.userLiveLocation = {
            lat: position.coords.latitude,
            lng: position.coords.longitude
          };
          console.log('Geolocation success:', this.userLiveLocation);
        },
        (error) => {
          let errorMessage;
          switch (error.code) {
            case error.PERMISSION_DENIED:
              errorMessage = "User denied the request for Geolocation. Please enable location services for this site.";
              break;
            case error.POSITION_UNAVAILABLE:
              errorMessage = "Location information is unavailable.";
              break;
            case error.TIMEOUT:
              errorMessage = "The request to get user location timed out. Please check your internet connection or location settings.";
              break;
            default:
              errorMessage = "An unknown error occurred while getting your location.";
              break;
          }
          this.geolocationError = errorMessage;
          console.error('Geolocation Error:', errorMessage, error);
        },
        {
          enableHighAccuracy: true,
          timeout: 15000, // Increased from 5000 to 15000 (15 seconds)
          maximumAge: 0
        }
      );
    },

    stopWatchingUserLocation() {
      if (this.geolocationWatchId !== null) {
        navigator.geolocation.clearWatch(this.geolocationWatchId);
        this.geolocationWatchId = null;
        console.log('Stopped watching user location.');
      }
    },

    async updateMapElements() {
      if (!this.map) return;

      // Clear existing elements
      if (this.pickupMarker) { this.map.removeLayer(this.pickupMarker); }
      if (this.deliveryMarker) { this.map.removeLayer(this.deliveryMarker); }
      if (this.userLocationMarker) { this.map.removeLayer(this.userLocationMarker); }
      if (this.routePolyline) { this.map.removeLayer(this.routePolyline); }
      if (this.routeToPickupPolyline) { this.map.removeLayer(this.routeToPickupPolyline); }

      let pointsForBounds = [];
      let currentUserLocation = null;

      // Determine the current user location to use (live takes precedence)
      if (this.userLiveLocation && typeof this.userLiveLocation.lat === 'number' && isFinite(this.userLiveLocation.lat) && typeof this.userLiveLocation.lng === 'number' && isFinite(this.userLiveLocation.lng)) {
        currentUserLocation = this.userLiveLocation;
      } else if (this.userLocationCoords && typeof this.userLocationCoords.lat === 'number' && isFinite(this.userLocationCoords.lat) && typeof this.userLocationCoords.lng === 'number' && isFinite(this.userLocationCoords.lng)) {
        currentUserLocation = this.userLocationCoords; // Fallback to prop if live not available
      }

      // Add user's current location marker
      if (currentUserLocation) {
        const userLatLng = [currentUserLocation.lat, currentUserLocation.lng];
        this.userLocationMarker = L.marker(userLatLng, { icon: this.userLocationIcon })
          .addTo(this.map)
          .bindPopup('<b>Your Current Location</b>');
        if (this.autoOpenUserPopup) {
          this.userLocationMarker.openPopup();
        }
        pointsForBounds.push(userLatLng);
        console.log('User location marker added/updated.');
      } else {
        console.log('No valid user location to display marker.');
      }

      // Add pickup marker
      if (this.pickupCoords && typeof this.pickupCoords.lat === 'number' && isFinite(this.pickupCoords.lat) && typeof this.pickupCoords.lng === 'number' && isFinite(this.pickupCoords.lng)) {
        const pickupLatLng = [this.pickupCoords.lat, this.pickupCoords.lng];
        this.pickupMarker = L.marker(pickupLatLng, { icon: this.pickupIcon })
          .addTo(this.map)
          .bindPopup('<b>Pickup Location</b>');
        pointsForBounds.push(pickupLatLng);
      } else {
        console.warn('Pickup coordinates are invalid or missing:', this.pickupCoords);
      }

      // Add delivery marker
      if (this.deliveryCoords && typeof this.deliveryCoords.lat === 'number' && isFinite(this.deliveryCoords.lat) && typeof this.deliveryCoords.lng === 'number' && isFinite(this.deliveryCoords.lng)) {
        const deliveryLatLng = [this.deliveryCoords.lat, this.deliveryCoords.lng];
        this.deliveryMarker = L.marker(deliveryLatLng, { icon: this.deliveryIcon })
          .addTo(this.map)
          .bindPopup('<b>Delivery Location</b>');
        pointsForBounds.push(deliveryLatLng);
      } else {
        console.warn('Delivery coordinates are invalid or missing:', this.deliveryCoords);
      }

      // Fetch and draw road-based route from user location to pickup point (red solid line)
      if (currentUserLocation && this.pickupCoords && typeof this.pickupCoords.lat === 'number' && isFinite(this.pickupCoords.lat) && typeof this.pickupCoords.lng === 'number' && isFinite(this.pickupCoords.lng)) {
        try {
          const userOrigin = `${currentUserLocation.lng},${currentUserLocation.lat}`;
          const pickupDest = `${this.pickupCoords.lng},${this.pickupCoords.lat}`;
          const userToPickupUrl = `https://router.project-osrm.org/route/v1/driving/${userOrigin};${pickupDest}?overview=full&geometries=geojson`;

          console.log('Fetching user-to-pickup route:', userToPickupUrl);
          const response = await fetch(userToPickupUrl); // THIS IS THE CORRECTED LINE
          const data = await response.json();

          if (data.code === 'Ok' && data.routes && data.routes.length > 0) {
            const route = data.routes[0].geometry.coordinates;
            const latLngs = route.map(coord => [coord[1], coord[0]]);

            this.routeToPickupPolyline = L.polyline(latLngs, {
              color: '#dc3545', // Red for user to pickup route
              weight: 6,
              opacity: 0.8,
            }).addTo(this.map);
            console.log('User-to-pickup route drawn successfully (solid red).');

            pointsForBounds.push(...latLngs);
          } else {
            console.error('OSRM route (user-to-pickup) not found or error:', data.message || data.code);
            this.drawSimpleLine(
              [currentUserLocation.lat, currentUserLocation.lng],
              [this.pickupCoords.lat, this.pickupCoords.lng],
              '#dc3545', // Red color for fallback
              'user-to-pickup'
            );
          }
        } catch (error) {
          console.error('Error fetching OSRM route (user-to-pickup):', error);
          this.drawSimpleLine(
            [currentUserLocation.lat, currentUserLocation.lng],
            [this.pickupCoords.lat, this.pickupCoords.lng],
            '#dc3545', // Red color for fallback
            'user-to-pickup'
          );
        }
      } else {
        console.log('User location or pickup coordinates are incomplete or invalid, skipping user-to-pickup route drawing.');
        if (this.routeToPickupPolyline) {
          this.map.removeLayer(this.routeToPickupPolyline);
          this.routeToPickupPolyline = null;
        }
      }

      // Fetch and draw road-based route between pickup and delivery (blue line)
      if (this.pickupCoords && this.deliveryCoords && typeof this.pickupCoords.lat === 'number' && isFinite(this.pickupCoords.lat) && typeof this.pickupCoords.lng === 'number' && isFinite(this.pickupCoords.lng) && typeof this.deliveryCoords.lat === 'number' && isFinite(this.deliveryCoords.lat) && typeof this.deliveryCoords.lng === 'number' && isFinite(this.deliveryCoords.lng)) {
        try {
          const origin = `${this.pickupCoords.lng},${this.pickupCoords.lat}`;
          const destination = `${this.deliveryCoords.lng},${this.deliveryCoords.lat}`;
          const url = `https://router.project-osrm.org/route/v1/driving/${origin};${destination}?overview=full&geometries=geojson`;

          console.log('Fetching pickup-delivery route:', url);
          const response = await fetch(url);
          const data = await response.json();

          if (data.code === 'Ok' && data.routes && data.routes.length > 0) {
            const route = data.routes[0].geometry.coordinates;
            const latLngs = route.map(coord => [coord[1], coord[0]]);

            this.routePolyline = L.polyline(latLngs, {
              color: '#007bff', // Blue for pickup-delivery route
              weight: 6,
              opacity: 0.8
            }).addTo(this.map);
            console.log('Pickup-delivery route drawn successfully (solid blue).');

            pointsForBounds.push(...latLngs);
          } else {
            console.error('OSRM route (pickup-delivery) not found or error:', data.message || data.code);
            this.drawSimpleLine(
              [this.pickupCoords.lat, this.pickupCoords.lng],
              [this.deliveryCoords.lat, this.deliveryCoords.lng],
              '#ffc107',
              'pickup-delivery'
            );
          }
        } catch (error) {
          console.error('Error fetching OSRM route (pickup-delivery):', error);
          this.drawSimpleLine(
            [this.pickupCoords.lat, this.pickupCoords.lng],
            [this.deliveryCoords.lat, this.deliveryCoords.lng],
            '#ffc107',
            'pickup-delivery'
          );
        }
      } else {
        if (this.routePolyline) {
          this.map.removeLayer(this.routePolyline);
          this.routePolyline = null;
        }
      }

      // Adjust map bounds to fit all relevant points
      if (pointsForBounds.length > 0) {
        const bounds = new L.LatLngBounds(pointsForBounds);
        if (bounds.isValid()) {
            this.map.fitBounds(bounds.pad(0.2));
            console.log('Map adjusted to fit all elements.');
        } else {
            console.warn('Calculated bounds are invalid, falling back to default view.');
            this.map.setView([17.40, 78.48], 11);
        }
      } else {
        console.log('No valid points for bounds, setting map to default view.');
        this.map.setView([17.40, 78.48], 11);
      }
    },

    drawSimpleLine(startPoint, endPoint, color, type) {
      if (startPoint && endPoint) {
        const line = L.polyline([startPoint, endPoint], {
          color: color,
          weight: 5,
          opacity: 0.7,
          dashArray: '10, 10'
        }).addTo(this.map);

        if (type === 'pickup-delivery') {
          this.routePolyline = line;
          console.log(`Fallback (dashed ${color}) pickup-delivery route drawn.`);
        } else if (type === 'user-to-pickup') {
          this.routeToPickupPolyline = line;
          console.log(`Fallback (dashed ${color}) user-to-pickup route drawn.`);
        }
      }
    }
  }
};
</script>

<style scoped>
.interactive-map-container {
  width: 100%;
  height: 350px;
  border-radius: 8px;
  overflow: hidden;
  box-shadow: 0 2px 8px rgba(0, 0, 0, 0.1);
  position: relative; /* Needed for positioning overlays */
}

.map-container {
  width: 100%;
  height: 100%;
}

.loading-overlay, .error-message {
  position: absolute;
  top: 0;
  left: 0;
  width: 100%;
  height: 100%;
  background-color: rgba(255, 255, 255, 0.8);
  display: flex;
  justify-content: center;
  align-items: center;
  font-size: 1.2em;
  font-weight: bold;
  color: #333;
  z-index: 1000; /* Above the map */
  border-radius: 8px;
}

.error-message {
  background-color: rgba(255, 99, 71, 0.8); /* Tomato color for errors */
  color: white;
}
</style>
```