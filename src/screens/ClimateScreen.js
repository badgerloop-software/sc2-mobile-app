import React, { useState, useRef } from 'react';
import {
  View,
  Text,
  StyleSheet,
  Dimensions,
  TouchableOpacity,
  SafeAreaView,
  PanResponder,
} from 'react-native';
import { LinearGradient } from 'expo-linear-gradient';
import { Ionicons } from '@expo/vector-icons';
import { BlurView } from 'expo-blur';
import Animated, {
  useSharedValue,
  useAnimatedStyle,
  withSpring,
  interpolate,
} from 'react-native-reanimated';
import Svg, { Circle, Path } from 'react-native-svg';

const { width, height } = Dimensions.get('window');

// Circular Temperature Control Component
const TemperatureControl = ({ temperature, onTemperatureChange, isOn }) => {
  const centerX = width / 2;
  const centerY = 200;
  const radius = 120;
  const strokeWidth = 8;
  
  const panResponder = PanResponder.create({
    onMoveShouldSetPanResponder: () => true,
    onPanResponderMove: (evt) => {
      const { locationX, locationY } = evt.nativeEvent;
      const dx = locationX - centerX;
      const dy = locationY - centerY;
      const angle = Math.atan2(dy, dx);
      const normalizedAngle = (angle + Math.PI * 2) % (Math.PI * 2);
      const temp = Math.round(60 + (normalizedAngle / (Math.PI * 2)) * 30);
      onTemperatureChange(Math.max(60, Math.min(90, temp)));
    },
  });
  
  const temperatureAngle = ((temperature - 60) / 30) * Math.PI * 2 - Math.PI / 2;
  const circumference = 2 * Math.PI * radius;
  const progress = (temperature - 60) / 30;
  
  return (
    <View style={styles.temperatureContainer}>
      <Svg height="400" width={width} style={styles.temperatureSvg}>
        {/* Background Circle */}
        <Circle
          cx={centerX}
          cy={centerY}
          r={radius}
          stroke="#333"
          strokeWidth={strokeWidth}
          fill="none"
        />
        
        {/* Progress Circle */}
        <Circle
          cx={centerX}
          cy={centerY}
          r={radius}
          stroke="#3B82F6"
          strokeWidth={strokeWidth}
          fill="none"
          strokeDasharray={circumference}
          strokeDashoffset={circumference * (1 - progress)}
          strokeLinecap="round"
          transform={`rotate(-90 ${centerX} ${centerY})`}
        />
      </Svg>
      
      <View style={[styles.temperatureCenter, { left: centerX - 80, top: centerY - 40 }]}>
        <Text style={styles.temperatureValue}>{temperature}°</Text>
        <Text style={styles.temperatureLabel}>TEMP</Text>
      </View>
      
      <TouchableOpacity
        style={[
          styles.temperatureHandle,
          {
            left: centerX + Math.cos(temperatureAngle) * radius - 15,
            top: centerY + Math.sin(temperatureAngle) * radius - 15,
          },
        ]}
        {...panResponder.panHandlers}
      >
        <View style={styles.handle} />
      </TouchableOpacity>
    </View>
  );
};

// Climate Control Button Component
const ClimateButton = ({ icon, title, active, onPress, color = '#3B82F6' }) => {
  const scale = useSharedValue(1);
  
  const animatedStyle = useAnimatedStyle(() => {
    return {
      transform: [{ scale: scale.value }],
    };
  });
  
  const handlePress = () => {
    scale.value = withSpring(0.95, { duration: 100 }, () => {
      scale.value = withSpring(1);
    });
    onPress?.();
  };
  
  return (
    <TouchableOpacity onPress={handlePress} style={styles.climateButton}>
      <Animated.View style={[styles.climateButtonContent, animatedStyle]}>
        <BlurView intensity={20} style={[styles.buttonBlur, active && styles.activeButton]}>
          <Ionicons name={icon} size={24} color={active ? color : '#9CA3AF'} />
          <Text style={[styles.buttonText, active && { color }]}>{title}</Text>
        </BlurView>
      </Animated.View>
    </TouchableOpacity>
  );
};

// Fan Speed Control Component
const FanSpeedControl = ({ speed, onSpeedChange }) => {
  const bars = Array.from({ length: 5 }, (_, i) => i + 1);
  
  return (
    <View style={styles.fanSpeedContainer}>
      <Text style={styles.fanSpeedLabel}>Fan Speed</Text>
      <View style={styles.fanSpeedBars}>
        {bars.map((bar) => (
          <TouchableOpacity
            key={bar}
            style={[
              styles.fanSpeedBar,
              { height: 20 + bar * 8 },
              bar <= speed && styles.activeFanBar,
            ]}
            onPress={() => onSpeedChange(bar)}
          />
        ))}
      </View>
    </View>
  );
};

// Main ClimateScreen Component
export default function ClimateScreen() {
  const [isOn, setIsOn] = useState(false);
  const [temperature, setTemperature] = useState(72);
  const [fanSpeed, setFanSpeed] = useState(3);
  const [autoMode, setAutoMode] = useState(true);
  const [heatedSeats, setHeatedSeats] = useState(false);
  const [defrost, setDefrost] = useState(false);
  const [recirculate, setRecirculate] = useState(false);
  
  const climateButtons = [
    {
      icon: 'power',
      title: 'Climate',
      active: isOn,
      onPress: () => setIsOn(!isOn),
      color: '#10B981',
    },
    {
      icon: 'refresh',
      title: 'Auto',
      active: autoMode,
      onPress: () => setAutoMode(!autoMode),
      color: '#3B82F6',
    },
    {
      icon: 'car-seat',
      title: 'Heated Seats',
      active: heatedSeats,
      onPress: () => setHeatedSeats(!heatedSeats),
      color: '#EF4444',
    },
    {
      icon: 'snow',
      title: 'Defrost',
      active: defrost,
      onPress: () => setDefrost(!defrost),
      color: '#06B6D4',
    },
    {
      icon: 'repeat',
      title: 'Recirculate',
      active: recirculate,
      onPress: () => setRecirculate(!recirculate),
      color: '#8B5CF6',
    },
  ];
  
  return (
    <SafeAreaView style={styles.container}>
      <LinearGradient
        colors={['#000000', '#1a1a1a', '#000000']}
        style={styles.gradient}
      >
        {/* Header */}
        <View style={styles.header}>
          <Text style={styles.title}>Climate Control</Text>
          <Text style={styles.subtitle}>
            {isOn ? 'Climate is ON' : 'Climate is OFF'}
          </Text>
        </View>
        
        {/* Temperature Control */}
        <TemperatureControl
          temperature={temperature}
          onTemperatureChange={setTemperature}
          isOn={isOn}
        />
        
        {/* Fan Speed Control */}
        <FanSpeedControl speed={fanSpeed} onSpeedChange={setFanSpeed} />
        
        {/* Climate Controls */}
        <View style={styles.controlsContainer}>
          <Text style={styles.sectionTitle}>Controls</Text>
          <View style={styles.controlsGrid}>
            {climateButtons.map((button, index) => (
              <View key={index} style={styles.controlItem}>
                <ClimateButton
                  icon={button.icon}
                  title={button.title}
                  active={button.active}
                  onPress={button.onPress}
                  color={button.color}
                />
              </View>
            ))}
          </View>
        </View>
        
        {/* Current Status */}
        <View style={styles.statusContainer}>
          <BlurView intensity={20} style={styles.statusBlur}>
            <View style={styles.statusRow}>
              <View style={styles.statusItem}>
                <Ionicons name="thermometer" size={20} color="#3B82F6" />
                <Text style={styles.statusValue}>{temperature}°F</Text>
                <Text style={styles.statusLabel}>Interior</Text>
              </View>
              <View style={styles.statusItem}>
                <Ionicons name="cloud" size={20} color="#9CA3AF" />
                <Text style={styles.statusValue}>68°F</Text>
                <Text style={styles.statusLabel}>Exterior</Text>
              </View>
              <View style={styles.statusItem}>
                <Ionicons name="time" size={20} color="#10B981" />
                <Text style={styles.statusValue}>15 min</Text>
                <Text style={styles.statusLabel}>Runtime</Text>
              </View>
            </View>
          </BlurView>
        </View>
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
    paddingHorizontal: 20,
  },
  header: {
    marginTop: 20,
    marginBottom: 30,
    alignItems: 'center',
  },
  title: {
    color: 'white',
    fontSize: 28,
    fontWeight: 'bold',
    marginBottom: 5,
  },
  subtitle: {
    color: '#9CA3AF',
    fontSize: 16,
  },
  temperatureContainer: {
    height: 400,
    marginBottom: 30,
    alignItems: 'center',
    position: 'relative',
  },
  temperatureSvg: {
    position: 'absolute',
  },
  temperatureCenter: {
    position: 'absolute',
    width: 160,
    height: 80,
    alignItems: 'center',
    justifyContent: 'center',
  },
  temperatureValue: {
    color: 'white',
    fontSize: 48,
    fontWeight: 'bold',
  },
  temperatureLabel: {
    color: '#9CA3AF',
    fontSize: 14,
    marginTop: 5,
  },
  temperatureHandle: {
    position: 'absolute',
    width: 30,
    height: 30,
    borderRadius: 15,
    backgroundColor: '#3B82F6',
    alignItems: 'center',
    justifyContent: 'center',
    shadowColor: '#3B82F6',
    shadowOffset: { width: 0, height: 0 },
    shadowOpacity: 0.5,
    shadowRadius: 10,
    elevation: 5,
  },
  handle: {
    width: 16,
    height: 16,
    borderRadius: 8,
    backgroundColor: 'white',
  },
  fanSpeedContainer: {
    alignItems: 'center',
    marginBottom: 30,
  },
  fanSpeedLabel: {
    color: 'white',
    fontSize: 18,
    fontWeight: 'bold',
    marginBottom: 15,
  },
  fanSpeedBars: {
    flexDirection: 'row',
    alignItems: 'flex-end',
    justifyContent: 'center',
  },
  fanSpeedBar: {
    width: 20,
    backgroundColor: '#333',
    marginHorizontal: 5,
    borderRadius: 4,
  },
  activeFanBar: {
    backgroundColor: '#3B82F6',
  },
  controlsContainer: {
    marginBottom: 30,
  },
  sectionTitle: {
    color: 'white',
    fontSize: 20,
    fontWeight: 'bold',
    marginBottom: 15,
  },
  controlsGrid: {
    flexDirection: 'row',
    flexWrap: 'wrap',
    justifyContent: 'space-between',
  },
  controlItem: {
    width: '48%',
    marginBottom: 15,
  },
  climateButton: {
    width: '100%',
  },
  climateButtonContent: {
    borderRadius: 15,
    overflow: 'hidden',
  },
  buttonBlur: {
    padding: 15,
    alignItems: 'center',
  },
  activeButton: {
    backgroundColor: 'rgba(59, 130, 246, 0.1)',
  },
  buttonText: {
    color: '#9CA3AF',
    fontSize: 12,
    marginTop: 5,
    textAlign: 'center',
  },
  statusContainer: {
    marginBottom: 20,
  },
  statusBlur: {
    borderRadius: 20,
    overflow: 'hidden',
    padding: 20,
  },
  statusRow: {
    flexDirection: 'row',
    justifyContent: 'space-around',
  },
  statusItem: {
    alignItems: 'center',
  },
  statusValue: {
    color: 'white',
    fontSize: 16,
    fontWeight: 'bold',
    marginTop: 5,
  },
  statusLabel: {
    color: '#9CA3AF',
    fontSize: 12,
    marginTop: 2,
  },
});
