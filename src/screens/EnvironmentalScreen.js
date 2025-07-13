import React, { useState, useEffect } from 'react';
import {
  View,
  Text,
  StyleSheet,
  Dimensions,
  ScrollView,
  SafeAreaView,
  TouchableOpacity,
} from 'react-native';
import { LinearGradient } from 'expo-linear-gradient';
import { Ionicons } from '@expo/vector-icons';
import { BlurView } from 'expo-blur';
import Animated, {
  useSharedValue,
  useAnimatedStyle,
  withSpring,
  withTiming,
} from 'react-native-reanimated';

import { 
  telemetryCategories, 
  generateMockTelemetryData, 
  getSignalDisplayValue,
  getSignalStatus
} from '../data/telemetryData';

const { width, height } = Dimensions.get('window');

// Temperature Card Component
const TemperatureCard = ({ title, value, unit, status, icon, location, maxTemp = 100 }) => {
  const progressWidth = useSharedValue(0);
  
  const progressStyle = useAnimatedStyle(() => {
    return {
      width: `${progressWidth.value}%`,
    };
  });
  
  React.useEffect(() => {
    // Calculate progress based on temperature
    const progress = Math.min((value / maxTemp) * 100, 100);
    progressWidth.value = withTiming(progress, { duration: 1000 });
  }, [value, maxTemp]);
  
  const getStatusColor = () => {
    switch (status) {
      case 'critical': return '#EF4444';
      case 'warning': return '#FF9F43';
      default: return '#10B981';
    }
  };
  
  const getProgressColor = () => {
    if (value > maxTemp * 0.8) return '#EF4444';
    if (value > maxTemp * 0.6) return '#FF9F43';
    return '#10B981';
  };
  
  return (
    <View style={styles.tempCard}>
      <View style={styles.tempCardContent}>
        <BlurView intensity={20} style={styles.tempCardBlur}>
          <View style={styles.tempCardHeader}>
            <Ionicons name={icon} size={32} color={getStatusColor()} />
            <View style={styles.tempCardInfo}>
              <Text style={styles.tempCardTitle}>{title}</Text>
              <Text style={styles.tempCardLocation}>{location}</Text>
            </View>
          </View>
          
          <View style={styles.tempCardValue}>
            <Text style={[styles.tempValue, { color: getStatusColor() }]}>
              {value}{unit}
            </Text>
            <View style={styles.tempProgressContainer}>
              <View style={styles.tempProgressBg}>
                <Animated.View 
                  style={[
                    styles.tempProgress, 
                    { backgroundColor: getProgressColor() },
                    progressStyle
                  ]} 
                />
              </View>
              <Text style={styles.tempMaxLabel}>Max: {maxTemp}{unit}</Text>
            </View>
          </View>
        </BlurView>
      </View>
    </View>
  );
};

// Solar Array Temperature Display
const SolarArrayTemps = ({ telemetryData }) => {
  const solarTemps = [
    { name: 'String 1', value: telemetryData.string1_temp, key: 'string1_temp' },
    { name: 'String 2', value: telemetryData.string2_temp, key: 'string2_temp' },
    { name: 'String 3', value: telemetryData.string3_temp, key: 'string3_temp' },
  ];
  
  return (
    <View style={styles.solarArrayContainer}>
      <Text style={styles.sectionTitle}>Solar Array Temperatures</Text>
      <View style={styles.solarArrayGrid}>
        {solarTemps.map((temp, index) => (
          <View key={index} style={styles.solarStringCard}>
            <BlurView intensity={15} style={styles.solarStringBlur}>
              <View style={styles.solarStringHeader}>
                <Ionicons name="sunny" size={20} color="#C9302C" />
                <Text style={styles.solarStringName}>{temp.name}</Text>
              </View>
              <Text style={[
                styles.solarStringTemp,
                { color: temp.value > 45 ? '#EF4444' : temp.value > 35 ? '#FF9F43' : '#10B981' }
              ]}>
                {temp.value}°C
              </Text>
              <View style={styles.solarStringStatus}>
                <Ionicons 
                  name={temp.value > 45 ? 'warning' : temp.value > 35 ? 'alert-circle' : 'checkmark-circle'} 
                  size={16} 
                  color={temp.value > 45 ? '#EF4444' : temp.value > 35 ? '#FF9F43' : '#10B981'} 
                />
              </View>
            </BlurView>
          </View>
        ))}
      </View>
    </View>
  );
};

// Main Environmental Screen Component
export default function EnvironmentalScreen() {
  const [telemetryData, setTelemetryData] = useState(null);
  const [lastUpdate, setLastUpdate] = useState(new Date());
  
  useEffect(() => {
    const updateTelemetry = () => {
      const newData = generateMockTelemetryData();
      setTelemetryData(newData);
      setLastUpdate(new Date());
    };
    
    updateTelemetry();
    const interval = setInterval(updateTelemetry, 2000);
    
    return () => clearInterval(interval);
  }, []);
  
  if (!telemetryData) {
    return (
      <SafeAreaView style={styles.container}>
        <LinearGradient colors={['#000000', '#1a1a1a', '#000000']} style={styles.gradient}>
          <View style={styles.loadingContainer}>
            <Ionicons name="thermometer" size={48} color="#C9302C" />
            <Text style={styles.loadingText}>Loading Environmental Data...</Text>
          </View>
        </LinearGradient>
      </SafeAreaView>
    );
  }
  
  return (
    <SafeAreaView style={styles.container}>
      <LinearGradient colors={['#000000', '#1a1a1a', '#000000']} style={styles.gradient}>
        <ScrollView contentContainerStyle={styles.scrollContent}>
          
          {/* Header */}
          <View style={styles.header}>
            <Text style={styles.title}>Environmental Monitoring</Text>
            <Text style={styles.subtitle}>Temperature & Sensor Data</Text>
            <Text style={styles.lastUpdate}>Last Update: {lastUpdate.toLocaleTimeString()}</Text>
          </View>
          
          {/* Main Temperature Cards */}
          <View style={styles.tempCardsContainer}>
            <TemperatureCard
              title="Motor Temperature"
              value={telemetryData.motor_temp}
              unit="°C"
              status={getSignalStatus('motor_temp', telemetryData.motor_temp, 'Motor & Drive')}
              icon="flash"
              location="Motor Assembly"
              maxTemp={100}
            />
            
            <TemperatureCard
              title="Battery Temperature"
              value={telemetryData.pack_temp}
              unit="°C"
              status={getSignalStatus('pack_temp', telemetryData.pack_temp, 'Battery System')}
              icon="battery-charging"
              location="Battery Pack"
              maxTemp={55}
            />
            
            <TemperatureCard
              title="Motor Controller"
              value={telemetryData.motor_controller_temp}
              unit="°C"
              status={getSignalStatus('motor_controller_temp', telemetryData.motor_controller_temp, 'Motor & Drive')}
              icon="hardware-chip"
              location="MC Assembly"
              maxTemp={100}
            />
            
            <TemperatureCard
              title="DC-DC Converter"
              value={telemetryData.dcdc_temp}
              unit="°C"
              status={getSignalStatus('dcdc_temp', telemetryData.dcdc_temp, 'High Voltage')}
              icon="power"
              location="Power System"
              maxTemp={100}
            />
          </View>
          
          {/* Solar Array Temperatures */}
          <SolarArrayTemps telemetryData={telemetryData} />
          
          {/* Environmental Conditions */}
          <View style={styles.envConditionsContainer}>
            <Text style={styles.sectionTitle}>Environmental Conditions</Text>
            <View style={styles.envConditionsGrid}>
              <View style={styles.envConditionCard}>
                <BlurView intensity={15} style={styles.envConditionBlur}>
                  <Ionicons name="thermometer" size={24} color="#C9302C" />
                  <Text style={styles.envConditionValue}>{telemetryData.air_temp}°C</Text>
                  <Text style={styles.envConditionLabel}>Air Temperature</Text>
                </BlurView>
              </View>
              
              <View style={styles.envConditionCard}>
                <BlurView intensity={15} style={styles.envConditionBlur}>
                  <Ionicons name="car-sport" size={24} color="#C9302C" />
                  <Text style={styles.envConditionValue}>{telemetryData.brake_temp}°C</Text>
                  <Text style={styles.envConditionLabel}>Brake Temperature</Text>
                </BlurView>
              </View>
              
              <View style={styles.envConditionCard}>
                <BlurView intensity={15} style={styles.envConditionBlur}>
                  <Ionicons name="trail-sign" size={24} color="#C9302C" />
                  <Text style={styles.envConditionValue}>{telemetryData.road_temp}°C</Text>
                  <Text style={styles.envConditionLabel}>Road Temperature</Text>
                </BlurView>
              </View>
              
              <View style={styles.envConditionCard}>
                <BlurView intensity={15} style={styles.envConditionBlur}>
                  <Ionicons name="hardware-chip" size={24} color="#C9302C" />
                  <Text style={styles.envConditionValue}>{telemetryData.mainIO_temp}°C</Text>
                  <Text style={styles.envConditionLabel}>Main IO Temperature</Text>
                </BlurView>
              </View>
            </View>
          </View>
          
        </ScrollView>
      </LinearGradient>
    </SafeAreaView>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#000',
  },
  gradient: {
    flex: 1,
  },
  scrollContent: {
    paddingHorizontal: 20,
    paddingBottom: 20,
  },
  loadingContainer: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
  },
  loadingText: {
    color: '#C9302C',
    fontSize: 18,
    marginTop: 10,
    fontWeight: 'bold',
  },
  header: {
    paddingTop: 20,
    marginBottom: 20,
  },
  title: {
    color: 'white',
    fontSize: 24,
    fontWeight: 'bold',
    marginBottom: 5,
  },
  subtitle: {
    color: '#9CA3AF',
    fontSize: 16,
    marginBottom: 5,
  },
  lastUpdate: {
    color: '#9CA3AF',
    fontSize: 14,
  },
  tempCardsContainer: {
    marginBottom: 20,
  },
  tempCard: {
    marginBottom: 15,
  },
  tempCardContent: {
    borderRadius: 15,
    overflow: 'hidden',
  },
  tempCardBlur: {
    padding: 20,
  },
  tempCardHeader: {
    flexDirection: 'row',
    alignItems: 'center',
    marginBottom: 15,
  },
  tempCardInfo: {
    marginLeft: 15,
    flex: 1,
  },
  tempCardTitle: {
    color: 'white',
    fontSize: 18,
    fontWeight: 'bold',
  },
  tempCardLocation: {
    color: '#9CA3AF',
    fontSize: 14,
  },
  tempCardValue: {
    alignItems: 'center',
  },
  tempValue: {
    fontSize: 32,
    fontWeight: 'bold',
    marginBottom: 10,
  },
  tempProgressContainer: {
    width: '100%',
    alignItems: 'center',
  },
  tempProgressBg: {
    width: '80%',
    height: 8,
    backgroundColor: '#1a1a1a',
    borderRadius: 4,
    overflow: 'hidden',
  },
  tempProgress: {
    height: '100%',
    borderRadius: 4,
  },
  tempMaxLabel: {
    color: '#9CA3AF',
    fontSize: 12,
    marginTop: 5,
  },
  sectionTitle: {
    color: 'white',
    fontSize: 20,
    fontWeight: 'bold',
    marginBottom: 15,
  },
  solarArrayContainer: {
    marginBottom: 20,
  },
  solarArrayGrid: {
    flexDirection: 'row',
    justifyContent: 'space-between',
  },
  solarStringCard: {
    flex: 1,
    marginHorizontal: 5,
  },
  solarStringBlur: {
    padding: 15,
    borderRadius: 12,
    alignItems: 'center',
  },
  solarStringHeader: {
    flexDirection: 'row',
    alignItems: 'center',
    marginBottom: 10,
  },
  solarStringName: {
    color: 'white',
    fontSize: 14,
    fontWeight: 'bold',
    marginLeft: 5,
  },
  solarStringTemp: {
    fontSize: 20,
    fontWeight: 'bold',
    marginBottom: 5,
  },
  solarStringStatus: {
    alignItems: 'center',
  },
  envConditionsContainer: {
    marginBottom: 20,
  },
  envConditionsGrid: {
    flexDirection: 'row',
    flexWrap: 'wrap',
    justifyContent: 'space-between',
  },
  envConditionCard: {
    width: '48%',
    marginBottom: 15,
  },
  envConditionBlur: {
    padding: 15,
    borderRadius: 12,
    alignItems: 'center',
  },
  envConditionValue: {
    color: 'white',
    fontSize: 18,
    fontWeight: 'bold',
    marginTop: 10,
    marginBottom: 5,
  },
  envConditionLabel: {
    color: '#9CA3AF',
    fontSize: 12,
    textAlign: 'center',
  },
});
