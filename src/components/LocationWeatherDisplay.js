import React, { useState, useEffect } from 'react';
import {
  View,
  Text,
  StyleSheet,
  TouchableOpacity,
} from 'react-native';
import { Ionicons } from '@expo/vector-icons';
import { BlurView } from 'expo-blur';
import MapView from './MapView';

const LocationWeatherDisplay = ({ telemetryData, useImperialUnits, setUseImperialUnits, setLocationName }) => {
  const [showMap, setShowMap] = useState(false);
  const [weatherData, setWeatherData] = useState(null);
  const [localLocationName, setLocalLocationName] = useState('');
  const [isInitialLoad, setIsInitialLoad] = useState(true);

  const latitude = telemetryData?.lat;
  const longitude = telemetryData?.lon;

  // Convert temperature from Celsius to Fahrenheit
  const convertTemperature = (celsius) => {
    return useImperialUnits ? Math.round(celsius * 9/5 + 32) : Math.round(celsius);
  };

  // Convert wind speed from km/h to mph
  const convertWindSpeed = (kmh) => {
    return useImperialUnits ? Math.round(kmh * 0.621371) : Math.round(kmh);
  };

  // Get temperature unit label
  const getTempUnit = () => useImperialUnits ? '°F' : '°C';

  // Get wind speed unit label
  const getWindUnit = () => useImperialUnits ? 'mph' : 'km/h';

  // Get weather icon based on weather code
  const getWeatherIcon = (weatherCode) => {
    const iconMap = {
      0: 'sunny', // Clear sky
      1: 'partly-sunny', // Mainly clear
      2: 'partly-sunny', // Partly cloudy
      3: 'cloudy', // Overcast
      45: 'cloudy', // Fog
      48: 'cloudy', // Depositing rime fog
      51: 'rainy', // Light drizzle
      53: 'rainy', // Moderate drizzle
      55: 'rainy', // Dense drizzle
      61: 'rainy', // Slight rain
      63: 'rainy', // Moderate rain
      65: 'rainy', // Heavy rain
      71: 'snow', // Slight snow
      73: 'snow', // Moderate snow
      75: 'snow', // Heavy snow
      95: 'thunderstorm', // Thunderstorm
    };
    return iconMap[weatherCode] || 'cloudy';
  };

  // Fetch weather data based on GPS coordinates
  const fetchWeather = async (latitude, longitude) => {
    try {
      // Get weather data from OpenMeteo (free, no API key required)
      const weatherResponse = await fetch(
        `https://api.open-meteo.com/v1/forecast?latitude=${latitude}&longitude=${longitude}&current_weather=true&hourly=temperature_2m,relative_humidity_2m,wind_speed_10m&timezone=auto`
      );
      const weather = await weatherResponse.json();

      // Get location name using reverse geocoding (OpenStreetMap Nominatim - free)
      const locationResponse = await fetch(
        `https://nominatim.openstreetmap.org/reverse?format=json&lat=${latitude}&lon=${longitude}&zoom=10`
      );
      const location = await locationResponse.json();

      setWeatherData(weather);
      const locationDisplayName = location.display_name?.split(',')[0] || 'Unknown Location';
      setLocalLocationName(locationDisplayName);
      setLocationName(locationDisplayName); // Update parent state
      setIsInitialLoad(false); // Mark initial load as complete
    } catch (error) {
      console.error('Weather fetch error:', error);
      setIsInitialLoad(false); // Mark initial load as complete even on error
    }
  };

  // Update weather when GPS coordinates change
  useEffect(() => {
    if (telemetryData?.lat && telemetryData?.lon) {
      fetchWeather(telemetryData.lat, telemetryData.lon);
    }
  }, [telemetryData?.lat, telemetryData?.lon]);

  const handleLocationPress = () => {
    if (latitude && longitude && typeof latitude === 'number' && typeof longitude === 'number') {
      setShowMap(true);
    }
  };

  const handleUnitToggle = (isImperial) => {
    setUseImperialUnits(isImperial);
  };

  // Show previous data during updates, loading state only on initial load
  const displayLocationName = localLocationName || 'Madison, WI';
  const hasGPS = latitude && longitude && typeof latitude === 'number' && typeof longitude === 'number';
  const hasWeatherData = weatherData?.current_weather;

  return (
    <>
      <TouchableOpacity style={styles.container} onPress={handleLocationPress}>
        <BlurView intensity={20} style={styles.blur}>
          <View style={styles.content}>
            {/* Header with unit toggle */}
            <View style={styles.header}>
              <View style={styles.headerLeft}>
                <Text style={styles.title}>Vehicle Location & Weather</Text>
              </View>
              <View style={styles.unitToggle}>
                <TouchableOpacity 
                  style={[styles.unitOption, useImperialUnits && styles.unitOptionActive]}
                  onPress={() => handleUnitToggle(true)}
                >
                  <Text style={[styles.unitText, useImperialUnits && styles.unitTextActive]}>°F</Text>
                </TouchableOpacity>
                <TouchableOpacity 
                  style={[styles.unitOption, !useImperialUnits && styles.unitOptionActive]}
                  onPress={() => handleUnitToggle(false)}
                >
                  <Text style={[styles.unitText, !useImperialUnits && styles.unitTextActive]}>°C</Text>
                </TouchableOpacity>
              </View>
            </View>
            
            {/* Location and weather content */}
            <View style={styles.mainContent}>
              {/* Left side - Location info */}
              <View style={styles.locationSection}>
                <View style={styles.locationHeader}>
                  <Ionicons name="location" size={20} color="#C9302C" />
                  <Text style={styles.locationName}>
                    {displayLocationName}
                  </Text>
                </View>
                <Text style={styles.coordinates}>
                  {hasGPS
                    ? `${latitude.toFixed(6)}, ${longitude.toFixed(6)}`
                    : 'GPS coordinates unavailable'
                  }
                </Text>
                <View style={styles.gpsStatus}>
                  <View style={[
                    styles.statusDot, 
                    { backgroundColor: hasGPS ? '#10B981' : '#EF4444' }
                  ]} />
                  <Text style={styles.statusText}>
                    {hasGPS ? 'GPS Connected' : 'GPS Disconnected'}
                  </Text>
                </View>
              </View>

              {/* Right side - Weather info */}
              <View style={styles.weatherSection}>
                {hasWeatherData ? (
                  <>
                    <View style={styles.weatherMain}>
                      <Ionicons 
                        name={getWeatherIcon(weatherData.current_weather.weathercode)} 
                        size={32} 
                        color="white" 
                      />
                      <Text style={styles.temperature}>
                        {convertTemperature(weatherData.current_weather.temperature)}{getTempUnit()}
                      </Text>
                    </View>
                    <Text style={styles.weatherDesc}>
                      Wind: {convertWindSpeed(weatherData.current_weather.windspeed)} {getWindUnit()}
                    </Text>
                    {weatherData.hourly?.relative_humidity_2m?.[0] && (
                      <Text style={styles.weatherDesc}>
                        Humidity: {weatherData.hourly.relative_humidity_2m[0]}%
                      </Text>
                    )}
                  </>
                ) : (
                  <>
                    <View style={styles.weatherMain}>
                      <Ionicons name="cloudy" size={32} color="#9CA3AF" />
                      <Text style={styles.temperature}>
                        --{getTempUnit()}
                      </Text>
                    </View>
                    <Text style={styles.weatherDesc}>
                      {isInitialLoad ? 'Loading...' : 'Weather unavailable'}
                    </Text>
                    <Text style={styles.weatherDesc}>
                      Wind: -- {getWindUnit()}
                    </Text>
                  </>
                )}
              </View>
            </View>

            {/* Footer */}
            <View style={styles.footer}>
              <Ionicons name="map" size={16} color="#C9302C" />
              <Text style={styles.tapText}>Tap to view map</Text>
              <Ionicons name="chevron-forward" size={16} color="#9CA3AF" />
            </View>
          </View>
        </BlurView>
      </TouchableOpacity>

      <MapView
        visible={showMap}
        onClose={() => setShowMap(false)}
        latitude={latitude}
        longitude={longitude}
        locationName={displayLocationName}
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
    justifyContent: 'flex-end',
    alignItems: 'center',
    marginBottom: 15,
  },
  headerLeft: {
    flexDirection: 'row',
    alignItems: 'center',
    flex: 1,
  },
  title: {
    display: 'none', // Hide the title
  },
  unitToggle: {
    flexDirection: 'row',
    backgroundColor: '#333333',
    borderRadius: 12,
    padding: 2,
  },
  unitOption: {
    paddingHorizontal: 12,
    paddingVertical: 6,
    borderRadius: 10,
    minWidth: 30,
    alignItems: 'center',
  },
  unitOptionActive: {
    backgroundColor: '#C9302C',
  },
  unitText: {
    color: '#9CA3AF',
    fontSize: 12,
    fontWeight: 'bold',
  },
  unitTextActive: {
    color: 'white',
  },
  mainContent: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    marginBottom: 15,
  },
  locationSection: {
    flex: 1,
    marginRight: 15,
  },
  locationHeader: {
    flexDirection: 'row',
    alignItems: 'center',
    marginBottom: 6,
  },
  locationName: {
    color: 'white',
    fontSize: 18,
    fontWeight: 'bold',
    marginLeft: 8,
  },
  coordinates: {
    color: '#9CA3AF',
    fontSize: 12,
    fontFamily: 'monospace',
    marginBottom: 8,
  },
  gpsStatus: {
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
  weatherSection: {
    alignItems: 'flex-end',
  },
  weatherMain: {
    flexDirection: 'row',
    alignItems: 'center',
    marginBottom: 6,
  },
  temperature: {
    color: 'white',
    fontSize: 20,
    fontWeight: 'bold',
    marginLeft: 8,
  },
  weatherDesc: {
    color: '#9CA3AF',
    fontSize: 12,
    textAlign: 'right',
    marginBottom: 2,
  },
  footer: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'center',
  },
  tapText: {
    color: '#C9302C',
    fontSize: 12,
    fontWeight: 'bold',
    marginHorizontal: 6,
  },
});

export default LocationWeatherDisplay;
