import React, { useState } from 'react';
import {
  View,
  Text,
  StyleSheet,
  TouchableOpacity,
} from 'react-native';
import { Ionicons } from '@expo/vector-icons';
import { BlurView } from 'expo-blur';
import MapView from './MapView';

const LocationDisplay = ({ telemetryData, locationName }) => {
  const [showMap, setShowMap] = useState(false);

  const latitude = telemetryData?.lat;
  const longitude = telemetryData?.lon;

  const handlePress = () => {
    if (latitude && longitude && typeof latitude === 'number' && typeof longitude === 'number') {
      setShowMap(true);
    }
  };

  return (
    <>
      <TouchableOpacity style={styles.container} onPress={handlePress}>
        <BlurView intensity={20} style={styles.blur}>
          <View style={styles.content}>
            <View style={styles.header}>
              <Ionicons name="location" size={24} color="#C9302C" />
              <Text style={styles.title}>Vehicle Location</Text>
              <Ionicons name="chevron-forward" size={20} color="#9CA3AF" />
            </View>
            
            <View style={styles.info}>
              <Text style={styles.locationName}>
                {locationName || 'Unknown Location'}
              </Text>
              <Text style={styles.coordinates}>
                {latitude && longitude && typeof latitude === 'number' && typeof longitude === 'number'
                  ? `${latitude.toFixed(6)}, ${longitude.toFixed(6)}`
                  : 'GPS coordinates unavailable'
                }
              </Text>
            </View>
            
            <View style={styles.footer}>
              <View style={styles.statusIndicator}>
                <View style={[
                  styles.statusDot, 
                  { backgroundColor: (latitude && longitude && typeof latitude === 'number' && typeof longitude === 'number') ? '#10B981' : '#EF4444' }
                ]} />
                <Text style={styles.statusText}>
                  {(latitude && longitude && typeof latitude === 'number' && typeof longitude === 'number') ? 'GPS Connected' : 'GPS Disconnected'}
                </Text>
              </View>
              <Text style={styles.tapText}>Tap to view map</Text>
            </View>
          </View>
        </BlurView>
      </TouchableOpacity>

      <MapView
        visible={showMap}
        onClose={() => setShowMap(false)}
        latitude={latitude}
        longitude={longitude}
        locationName={locationName}
      />
    </>
  );
};

const styles = StyleSheet.create({
  container: {
    marginBottom: 20,
  },
  blur: {
    borderRadius: 15,
    overflow: 'hidden',
  },
  content: {
    padding: 15,
  },
  header: {
    flexDirection: 'row',
    alignItems: 'center',
    marginBottom: 12,
  },
  title: {
    color: 'white',
    fontSize: 16,
    fontWeight: 'bold',
    marginLeft: 8,
    flex: 1,
  },
  info: {
    marginBottom: 12,
  },
  locationName: {
    color: 'white',
    fontSize: 18,
    fontWeight: 'bold',
    marginBottom: 4,
  },
  coordinates: {
    color: '#9CA3AF',
    fontSize: 14,
    fontFamily: 'monospace',
  },
  footer: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
  },
  statusIndicator: {
    flexDirection: 'row',
    alignItems: 'center',
  },
  statusDot: {
    width: 8,
    height: 8,
    borderRadius: 4,
    marginRight: 6,
  },
  statusText: {
    color: '#9CA3AF',
    fontSize: 12,
  },
  tapText: {
    color: '#C9302C',
    fontSize: 12,
    fontWeight: 'bold',
  },
});

export default LocationDisplay;
