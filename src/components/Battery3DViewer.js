import React, { useState, useEffect } from 'react';
import { View, Text, StyleSheet, Dimensions, Animated } from 'react-native';
import { Ionicons } from '@expo/vector-icons';
import { BlurView } from 'expo-blur';
import { LinearGradient } from 'expo-linear-gradient';

const { width } = Dimensions.get('window');

const Battery3DViewer = ({ telemetryData }) => {
  const [modelExists, setModelExists] = useState(false);
  const rotation = new Animated.Value(0);
  const pulse = new Animated.Value(1);
  const chargingAnimation = new Animated.Value(0);

  useEffect(() => {
    // Check if 3D model exists (placeholder for now)
    setModelExists(false);
    
    // Start rotation animation
    Animated.loop(
      Animated.timing(rotation, {
        toValue: 1,
        duration: 12000,
        useNativeDriver: true,
      })
    ).start();

    // Start pulse animation based on battery level
    const batteryLevel = telemetryData?.soc || 50;
    const pulseSpeed = 1500 + (100 - batteryLevel) * 15; // Faster pulse when battery is low
    
    Animated.loop(
      Animated.sequence([
        Animated.timing(pulse, {
          toValue: 1.08,
          duration: pulseSpeed,
          useNativeDriver: true,
        }),
        Animated.timing(pulse, {
          toValue: 1,
          duration: pulseSpeed,
          useNativeDriver: true,
        }),
      ])
    ).start();

    // Charging animation
    if (telemetryData?.pack_current > 0) {
      Animated.loop(
        Animated.timing(chargingAnimation, {
          toValue: 1,
          duration: 1000,
          useNativeDriver: true,
        })
      ).start();
    }
  }, [telemetryData?.soc, telemetryData?.pack_current]);

  const batteryLevel = telemetryData?.soc || 50;
  const isCharging = telemetryData?.pack_current > 0;
  const batteryTemp = telemetryData?.pack_temp || 25;

  const rotationInterpolation = rotation.interpolate({
    inputRange: [0, 1],
    outputRange: ['0deg', '360deg'],
  });

  const chargingOpacity = chargingAnimation.interpolate({
    inputRange: [0, 0.5, 1],
    outputRange: [0.3, 1, 0.3],
  });

  const getBatteryColor = () => {
    if (batteryLevel > 70) return ['#10B981', '#34D399'];
    if (batteryLevel > 30) return ['#F59E0B', '#FCD34D'];
    return ['#EF4444', '#FF6B6B'];
  };

  const getBatteryIcon = () => {
    if (isCharging) return 'battery-charging';
    if (batteryLevel > 80) return 'battery-full';
    if (batteryLevel > 50) return 'battery-half';
    if (batteryLevel > 20) return 'battery-charging-outline'; // Using outline version instead
    return 'battery-dead';
  };

  return (
    <View style={styles.container}>
      <BlurView intensity={20} style={styles.blur}>
        <View style={styles.content}>
          {/* 3D Model Placeholder */}
          <View style={styles.modelContainer}>
            <Animated.View
              style={[
                styles.batteryIconContainer,
                {
                  transform: [
                    { rotate: rotationInterpolation },
                    { scale: pulse },
                  ],
                },
              ]}
            >
              <LinearGradient
                colors={getBatteryColor()}
                style={styles.batteryGradient}
              >
                <Ionicons name={getBatteryIcon()} size={80} color="white" />
                
                {/* Battery Level Bar */}
                <View style={styles.batteryLevelContainer}>
                  <View style={[styles.batteryLevel, { width: `${batteryLevel}%` }]} />
                </View>
                
                {/* SOC Display */}
                <Text style={styles.socDisplay}>{batteryLevel}%</Text>
              </LinearGradient>
            </Animated.View>
            
            {/* Charging Indicator */}
            {isCharging && (
              <Animated.View
                style={[
                  styles.chargingIndicator,
                  { opacity: chargingOpacity }
                ]}
              >
                <Ionicons name="flash" size={24} color="#FFD700" />
              </Animated.View>
            )}
            
            {/* Temperature Warning */}
            {batteryTemp > 40 && (
              <View style={styles.temperatureWarning}>
                <Ionicons name="thermometer" size={20} color="#EF4444" />
              </View>
            )}
            
            <Text style={styles.modelStatus}>Battery 3D Model Ready</Text>
            <Text style={styles.modelSubtitle}>
              Drop your <Text style={styles.filename}>battery-cells.glb</Text> file in:
            </Text>
            <Text style={styles.path}>src/assets/models/</Text>
          </View>

          {/* 3D Ready Indicator */}
          <View style={styles.readyIndicator}>
            <Ionicons name="cube" size={16} color="white" />
            <Text style={styles.readyText}>3D Ready</Text>
          </View>
        </View>
      </BlurView>
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#000000',
    borderRadius: 15,
    overflow: 'hidden',
  },
  blur: {
    flex: 1,
  },
  content: {
    flex: 1,
    position: 'relative',
  },
  modelContainer: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
    paddingVertical: 40,
  },
  batteryIconContainer: {
    marginBottom: 20,
    borderRadius: 20,
    overflow: 'hidden',
  },
  batteryGradient: {
    width: 160,
    height: 160,
    borderRadius: 20,
    justifyContent: 'center',
    alignItems: 'center',
    borderWidth: 2,
    borderColor: '#C9302C',
    position: 'relative',
  },
  batteryLevelContainer: {
    position: 'absolute',
    bottom: 15,
    left: 15,
    right: 15,
    height: 6,
    backgroundColor: 'rgba(255,255,255,0.3)',
    borderRadius: 3,
    overflow: 'hidden',
  },
  batteryLevel: {
    height: '100%',
    backgroundColor: 'rgba(255,255,255,0.9)',
    borderRadius: 3,
  },
  socDisplay: {
    color: 'white',
    fontSize: 14,
    fontWeight: 'bold',
    position: 'absolute',
    bottom: 25,
    textShadowColor: 'rgba(0, 0, 0, 0.5)',
    textShadowOffset: { width: 0, height: 1 },
    textShadowRadius: 2,
  },
  chargingIndicator: {
    position: 'absolute',
    top: 20,
    right: 20,
    backgroundColor: 'rgba(255, 215, 0, 0.2)',
    borderRadius: 15,
    padding: 8,
  },
  temperatureWarning: {
    position: 'absolute',
    top: 20,
    left: 20,
    backgroundColor: 'rgba(239, 68, 68, 0.2)',
    borderRadius: 15,
    padding: 8,
  },
  modelStatus: {
    color: 'white',
    fontSize: 18,
    fontWeight: 'bold',
    marginBottom: 8,
    textAlign: 'center',
  },
  modelSubtitle: {
    color: '#9CA3AF',
    fontSize: 14,
    textAlign: 'center',
    marginBottom: 4,
  },
  filename: {
    color: '#C9302C',
    fontWeight: 'bold',
  },
  path: {
    color: '#6B7280',
    fontSize: 12,
    fontFamily: 'monospace',
    textAlign: 'center',
  },
  readyIndicator: {
    position: 'absolute',
    top: 15,
    right: 15,
    flexDirection: 'row',
    alignItems: 'center',
    backgroundColor: '#C9302C',
    paddingHorizontal: 8,
    paddingVertical: 4,
    borderRadius: 12,
  },
  readyText: {
    color: 'white',
    fontSize: 12,
    fontWeight: 'bold',
    marginLeft: 4,
  },
});

export default Battery3DViewer;
