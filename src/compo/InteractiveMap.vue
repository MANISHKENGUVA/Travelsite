\<template>
  <div class="interactive-map-container">
    <div id="mapContainer" class="map-container"></div>
  </div>
</template>

<script>
import L from 'leaflet';
import 'leaflet/dist/leaflet.css';

// Fix for default marker icon issues with Webpack/Vite
delete L.Icon.Default.prototype._get // Delete the old _getIconUrl method
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
    // Optional prop for current user location (if passed from parent)
    userLocationCoords: {
      type: Object, // { lat: number, lng: number }
      default: null // Default to null if not provided
    }
  },
  data() {
    return {
      map: null,
      pickupMarker: null,
      deliveryMarker: null,
      userLocationMarker: null, // <--- ADD THIS: For user's current location
      routePolyline: null,
      
      // Custom icons for pickup, dropoff, and user location
      pickupIcon: L.icon({
        iconUrl: 'https://cdn-icons-png.flaticon.com/512/684/684807.png', // Example pickup icon (green)
        iconSize: [38, 38],
        iconAnchor: [19, 38],
        popupAnchor: [0, -38]
      }),
      deliveryIcon: L.icon({
        iconUrl: 'https://cdn-icons-png.flaticon.com/512/25/25694.png', // Example delivery/destination icon (red)
        iconSize: [38, 38],
        iconAnchor: [19, 38],
        popupAnchor: [0, -38]
      }),
      // <--- ADD THIS: Custom icon for user's current location
      userLocationIcon: L.icon({
        iconUrl: 'https://cdn-icons-png.flaticon.com/512/684/684807.png', // A blue dot or similar
        iconSize: [30, 30],
        iconAnchor: [15, 15],
        popupAnchor: [0, -15]
      })
    };
  },
  mounted() {
    this.initMap();
    this.$nextTick(() => {
      this.updateMapElements();
    });
  },
  watch: {
    // Watch for changes in coordinates if they are dynamic
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
    userLocationCoords: { // <--- ADD THIS: Watch for user location changes
      handler() {
        this.updateMapElements();
      },
      deep: true
    }
  },
  beforeUnmount() {
    if (this.routePolyline) {
        this.map.removeLayer(this.routePolyline);
    }
    if (this.pickupMarker) { this.map.removeLayer(this.pickupMarker); }
    if (this.deliveryMarker) { this.map.removeLayer(this.deliveryMarker); }
    if (this.userLocationMarker) { this.map.removeLayer(this.userLocationMarker); } // <--- ADD THIS
    if (this.map) {
      this.map.remove(); // Clean up map instance when component is destroyed
    }
  },
  methods: {
    initMap() {
      this.map = L.map('mapContainer', {
        zoomControl: true
      }).setView([17.40, 78.48], 11); // Initial view for Hyderabad region

      L.tileLayer('https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png', {
        attribution: '&copy; <a href="https://www.openstreetmap.org/copyright">OpenStreetMap</a> contributors'
      }).addTo(this.map);
    },
    async updateMapElements() { // Renamed from updateMarkersAndRoute for clarity
      if (!this.map) return;

      // Clear existing elements
      if (this.pickupMarker) { this.map.removeLayer(this.pickupMarker); }
      if (this.deliveryMarker) { this.map.removeLayer(this.deliveryMarker); }
      if (this.userLocationMarker) { this.map.removeLayer(this.userLocationMarker); } // <--- ADD THIS
      if (this.routePolyline) { this.map.removeLayer(this.routePolyline); }

      let pointsForBounds = []; // To hold all valid coordinates for map fitting

      // Add pickup marker
      if (this.pickupCoords && this.pickupCoords.lat && this.pickupCoords.lng) {
        const pickupLatLng = [this.pickupCoords.lat, this.pickupCoords.lng];
        this.pickupMarker = L.marker(pickupLatLng, { icon: this.pickupIcon })
          .addTo(this.map)
          .bindPopup('<b>Pickup Location</b>');
        pointsForBounds.push(pickupLatLng);
      }

      // Add delivery marker
      if (this.deliveryCoords && this.deliveryCoords.lat && this.deliveryCoords.lng) {
        const deliveryLatLng = [this.deliveryCoords.lat, this.deliveryCoords.lng];
        this.deliveryMarker = L.marker(deliveryLatLng, { icon: this.deliveryIcon })
          .addTo(this.map)
          .bindPopup('<b>Delivery Location</b>');
        pointsForBounds.push(deliveryLatLng);
      }

      // <--- ADD THIS: Add user's current location marker
      if (this.userLocationCoords && this.userLocationCoords.lat && this.userLocationCoords.lng) {
        const userLatLng = [this.userLocationCoords.lat, this.userLocationCoords.lng];
        this.userLocationMarker = L.marker(userLatLng, { icon: this.userLocationIcon })
          .addTo(this.map)
          .bindPopup('<b>Your Current Location</b>').openPopup(); // Open by default for emphasis
        pointsForBounds.push(userLatLng);
      }


      // Fetch and draw road-based route only between pickup and delivery
      if (this.pickupCoords && this.deliveryCoords && this.pickupCoords.lat && this.pickupCoords.lng && this.deliveryCoords.lat && this.deliveryCoords.lng) {
        try {
          const origin = `${this.pickupCoords.lng},${this.pickupCoords.lat}`;
          const destination = `${this.deliveryCoords.lng},${this.deliveryCoords.lat}`;
          
          const url = `https://router.project-osrm.org/route/v1/driving/${origin};${destination}?overview=full&geometries=geojson`;

          const response = await fetch(url);
          const data = await response.json();

          if (data.code === 'Ok' && data.routes && data.routes.length > 0) {
            const route = data.routes[0].geometry.coordinates;
            const latLngs = route.map(coord => [coord[1], coord[0]]);

            this.routePolyline = L.polyline(latLngs, {
              color: '#007bff',
              weight: 6,
              opacity: 0.8
            }).addTo(this.map);

            // Add route bounds to pointsForBounds to ensure entire route is visible
            pointsForBounds.push(...latLngs);

          } else {
            console.error('OSRM route not found or error:', data.message || data.code);
            this.drawSimpleLine([
              [this.pickupCoords.lat, this.pickupCoords.lng],
              [this.deliveryCoords.lat, this.deliveryCoords.lng]
            ]);
          }
        } catch (error) {
          console.error('Error fetching OSRM route:', error);
          this.drawSimpleLine([
            [this.pickupCoords.lat, this.pickupCoords.lng],
            [this.deliveryCoords.lat, this.deliveryCoords.lng]
          ]);
        }
      } else {
          // If no full route can be drawn, ensure any existing simple line is cleared
          if (this.routePolyline) {
              this.map.removeLayer(this.routePolyline);
              this.routePolyline = null;
          }
      }

      // Adjust map bounds to fit all relevant points (pickup, delivery, user location, and route)
      if (pointsForBounds.length > 0) {
        const bounds = new L.LatLngBounds(pointsForBounds);
        this.map.fitBounds(bounds.pad(0.2)); // pad adds some margin
      } else {
        // Fallback if no valid points, reset to initial view or a default
        this.map.setView([17.40, 78.48], 11);
      }
    },
    drawSimpleLine(points) {
      if (points.length === 2) {
        this.routePolyline = L.polyline(points, {
          color: '#ffc107', // Warning yellow for fallback
          weight: 5,
          opacity: 0.7,
          dashArray: '10, 10'
        }).addTo(this.map);
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
}

.map-container {
  width: 100%;
  height: 100%;
}
</style>