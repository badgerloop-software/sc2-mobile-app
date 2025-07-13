import React, { useState, useEffect, useRef } from 'react';
import {
  View,
  Text,
  StyleSheet,
  Modal,
  TouchableOpacity,
  Dimensions,
  Alert,
  Linking,
} from 'react-native';
import { WebView } from 'react-native-webview';
import { Ionicons } from '@expo/vector-icons';
import { BlurView } from 'expo-blur';

const { width, height } = Dimensions.get('window');

const MapView = ({ visible, onClose, latitude, longitude, locationName }) => {
  const [mapLoaded, setMapLoaded] = useState(false);
  const webViewRef = useRef(null);
  const lastPositionRef = useRef({ lat: latitude, lng: longitude });

  // Update marker position when coordinates change
  useEffect(() => {
    if (mapLoaded && webViewRef.current && latitude && longitude) {
      const lastPos = lastPositionRef.current;
      // Only update if position has actually changed
      if (lastPos.lat !== latitude || lastPos.lng !== longitude) {
        const jsCode = `
          if (typeof window.marker !== 'undefined') {
            // Smooth animation to new position
            window.marker.setLatLng([${latitude}, ${longitude}]);
            
            // Update the circle
            if (typeof window.circle !== 'undefined') {
              window.circle.setLatLng([${latitude}, ${longitude}]);
            }
            
            // Update popup content
            window.marker.setPopupContent(
              '<div style="text-align: center; font-family: Arial, sans-serif;">' +
              '<strong style="color: #C9302C;">Solar Car 2</strong><br>' +
              '<span style="font-size: 12px; color: #666;">${locationName || 'Madison, WI'}</span><br>' +
              '<span style="font-size: 10px; color: #999;">Lat: ${latitude.toFixed(6)}, Lng: ${longitude.toFixed(6)}</span>' +
              '</div>'
            );
            
            // Update info panel
            const coordsElement = document.querySelector('.coordinates');
            if (coordsElement) {
              coordsElement.textContent = 'Lat: ${latitude.toFixed(6)}, Lng: ${longitude.toFixed(6)}';
            }
            
            // Optionally pan to new position (uncomment if you want the map to follow)
            // map.panTo([${latitude}, ${longitude}]);
          }
        `;
        webViewRef.current.injectJavaScript(jsCode);
        lastPositionRef.current = { lat: latitude, lng: longitude };
      }
    }
  }, [latitude, longitude, mapLoaded, locationName]);

  // Reset map loaded state when modal visibility changes
  useEffect(() => {
    if (!visible) {
      setMapLoaded(false);
    }
  }, [visible]);

  // Generate the map HTML content
  const generateMapHTML = () => {
    return `
      <!DOCTYPE html>
      <html>
        <head>
          <meta name="viewport" content="width=device-width, initial-scale=1.0, maximum-scale=1.0, user-scalable=no" />
          <style>
            body { margin: 0; padding: 0; background: #000; font-family: Arial, sans-serif; }
            #map { height: 100vh; width: 100vw; }
            .info-panel {
              position: absolute;
              top: 10px;
              left: 50%;
              transform: translateX(-50%);
              width: 200px;
              background: rgba(0, 0, 0, 0.8);
              color: white;
              padding: 10px;
              border-radius: 8px;
              z-index: 1000;
              font-size: 12px;
            }
            .car-icon {
              color: #C9302C;
              font-size: 14px;
              margin-right: 6px;
            }
            .coordinates {
              font-size: 10px;
              color: #9CA3AF;
              margin-top: 3px;
            }
          </style>
          <link rel="stylesheet" href="https://unpkg.com/leaflet@1.7.1/dist/leaflet.css" />
          <script src="https://unpkg.com/leaflet@1.7.1/dist/leaflet.js"></script>
        </head>
        <body>
          <div class="info-panel">
            <div style="display: flex; align-items: center; justify-content: center; text-align: center;">
              <span class="car-icon">🚗</span>
              <div>
                <div style="font-weight: bold; color: #C9302C; font-size: 13px;">Solar Car 2</div>
                <div style="font-size: 11px;">${locationName || 'Unknown Location'}</div>
                <div class="coordinates">
                  ${latitude && typeof latitude === 'number' ? latitude.toFixed(4) : 'N/A'}, ${longitude && typeof longitude === 'number' ? longitude.toFixed(4) : 'N/A'}
                </div>
              </div>
            </div>
          </div>
          <div id="map"></div>
          <script>
            // Initialize the map
            const map = L.map('map').setView([${latitude || 43.0642}, ${longitude || -87.9073}], 15);
            
            // Add tile layer
            L.tileLayer('https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png', {
              attribution: '© OpenStreetMap contributors'
            }).addTo(map);
            
            // Custom car marker
            const carIcon = L.divIcon({
              html: '<div style="background: #C9302C; border-radius: 50%; width: 20px; height: 20px; display: flex; align-items: center; justify-content: center; color: white; font-size: 12px; border: 2px solid white; box-shadow: 0 2px 4px rgba(0,0,0,0.3);">🚗</div>',
              iconSize: [24, 24],
              iconAnchor: [12, 12],
              className: 'car-marker'
            });
            
            // Add marker for the car (make it global for updates)
            window.marker = L.marker([${latitude || 43.0642}, ${longitude || -87.9073}], {
              icon: carIcon
            }).addTo(map);
            
            // Add popup
            window.marker.bindPopup(
              '<div style="text-align: center; font-family: Arial, sans-serif;">' +
              '<strong style="color: #C9302C;">Solar Car 2</strong><br>' +
              '<span style="font-size: 12px; color: #666;">${locationName || 'Madison, WI'}</span><br>' +
              '<span style="font-size: 10px; color: #999;">Lat: ${latitude && typeof latitude === 'number' ? latitude.toFixed(6) : 'N/A'}, Lng: ${longitude && typeof longitude === 'number' ? longitude.toFixed(6) : 'N/A'}</span>' +
              '</div>'
            );
            
            // Add circle to show approximate area (make it global for updates)
            window.circle = L.circle([${latitude || 43.0642}, ${longitude || -87.9073}], {
              color: '#C9302C',
              fillColor: '#C9302C',
              fillOpacity: 0.1,
              radius: 100
            }).addTo(map);
            
            // Fit map to show the location nicely
            map.setView([${latitude || 43.0642}, ${longitude || -87.9073}], 15);
          </script>
        </body>
      </html>
    `;
  };

  const openInExternalMaps = () => {
    const url = `https://www.google.com/maps/search/?api=1&query=${latitude},${longitude}`;
    Linking.openURL(url).catch(() => {
      Alert.alert('Error', 'Unable to open external maps application');
    });
  };

  if (!visible) return null;

  return (
    <Modal
      visible={visible}
      animationType="slide"
      presentationStyle="pageSheet"
      onRequestClose={onClose}
    >
      <View style={styles.container}>
        {/* Header */}
        <BlurView intensity={20} style={styles.header}>
          <TouchableOpacity onPress={onClose} style={styles.closeButton}>
            <Ionicons name="close" size={24} color="white" />
          </TouchableOpacity>
          <Text style={styles.headerTitle}>Vehicle Location</Text>
          <TouchableOpacity onPress={openInExternalMaps} style={styles.externalButton}>
            <Ionicons name="open-outline" size={24} color="#C9302C" />
          </TouchableOpacity>
        </BlurView>

        {/* Map */}
        <View style={styles.mapContainer}>
          <WebView
            ref={webViewRef}
            source={{ html: generateMapHTML() }}
            style={styles.webView}
            onLoad={() => setMapLoaded(true)}
            javaScriptEnabled={true}
            domStorageEnabled={true}
            startInLoadingState={true}
            scalesPageToFit={true}
            renderLoading={() => (
              <View style={styles.loadingContainer}>
                <Ionicons name="map" size={48} color="#C9302C" />
                <Text style={styles.loadingText}>Loading Map...</Text>
              </View>
            )}
          />
        </View>

        {/* Footer Info */}
        <BlurView intensity={20} style={styles.footer}>
          <View style={styles.footerContent}>
            <View style={styles.infoRow}>
              <Ionicons name="location" size={16} color="#C9302C" />
              <Text style={styles.infoText}>
                {locationName || 'Unknown Location'}
              </Text>
            </View>
            <View style={styles.infoRow}>
              <Ionicons name="navigate" size={16} color="#9CA3AF" />
              <Text style={styles.infoText}>
                {latitude && longitude && typeof latitude === 'number' && typeof longitude === 'number' 
                  ? `${latitude.toFixed(6)}, ${longitude.toFixed(6)}`
                  : 'GPS coordinates unavailable'
                }
              </Text>
            </View>
            <TouchableOpacity onPress={openInExternalMaps} style={styles.externalMapButton}>
              <Ionicons name="map" size={16} color="white" />
              <Text style={styles.externalMapText}>Open in Maps</Text>
            </TouchableOpacity>
          </View>
        </BlurView>
      </View>
    </Modal>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#000',
  },
  header: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
    paddingHorizontal: 20,
    paddingTop: 50,
    paddingBottom: 15,
    borderBottomWidth: 1,
    borderBottomColor: '#333',
  },
  closeButton: {
    padding: 5,
  },
  headerTitle: {
    color: 'white',
    fontSize: 18,
    fontWeight: 'bold',
    flex: 1,
    textAlign: 'center',
  },
  externalButton: {
    padding: 5,
  },
  mapContainer: {
    flex: 1,
    position: 'relative',
  },
  webView: {
    flex: 1,
  },
  loadingContainer: {
    position: 'absolute',
    top: 0,
    left: 0,
    right: 0,
    bottom: 0,
    justifyContent: 'center',
    alignItems: 'center',
    backgroundColor: '#000',
  },
  loadingText: {
    color: 'white',
    fontSize: 16,
    marginTop: 10,
  },
  footer: {
    paddingHorizontal: 20,
    paddingVertical: 15,
    borderTopWidth: 1,
    borderTopColor: '#333',
  },
  footerContent: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
  },
  infoRow: {
    flexDirection: 'row',
    alignItems: 'center',
    flex: 1,
  },
  infoText: {
    color: 'white',
    fontSize: 14,
    marginLeft: 8,
  },
  externalMapButton: {
    flexDirection: 'row',
    alignItems: 'center',
    backgroundColor: '#C9302C',
    paddingHorizontal: 12,
    paddingVertical: 8,
    borderRadius: 15,
  },
  externalMapText: {
    color: 'white',
    fontSize: 12,
    fontWeight: 'bold',
    marginLeft: 6,
  },
});

export default MapView;
