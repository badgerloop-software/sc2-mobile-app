import React, { useState, useEffect } from 'react';
import {
  View,
  Text,
  StyleSheet,
  Dimensions,
  TouchableOpacity,
  ScrollView,
  SafeAreaView,
  Animated,
} from 'react-native';
import { LinearGradient } from 'expo-linear-gradient';
import { Ionicons } from '@expo/vector-icons';
import { BlurView } from 'expo-blur';
import Svg, { Circle, Path, Defs, LinearGradient as SvgLinearGradient, Stop } from 'react-native-svg';

const { width, height } = Dimensions.get('window');

// Animated Battery Component
const BatteryIndicator = ({ batteryLevel, isCharging }) => {
  const animatedValue = new Animated.Value(0);
  
  useEffect(() => {
    Animated.timing(animatedValue, {
      toValue: batteryLevel,
      duration: 1000,
      useNativeDriver: false,
    }).start();
  }, [batteryLevel]);
  
  const centerX = width / 2;
  const centerY = 150;
  const radius = 100;
  const strokeWidth = 12;
  const circumference = 2 * Math.PI * radius;
  const progress = batteryLevel / 100;
  
  const getBatteryColor = () => {
    if (isCharging) return '#10B981';
    if (batteryLevel > 50) return '#10B981';
    if (batteryLevel > 20) return '#F59E0B';
    return '#EF4444';
  };
  
  return (
    <View style={styles.batteryContainer}>
      <Svg height="300" width={width} style={styles.batterySvg}>
        <Defs>
          <SvgLinearGradient id="batteryGradient" x1="0%" y1="0%" x2="100%" y2="0%">
            <Stop offset="0%" stopColor={getBatteryColor()} stopOpacity="0.3" />
            <Stop offset="100%" stopColor={getBatteryColor()} stopOpacity="1" />
          </SvgLinearGradient>
        </Defs>
        
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
          stroke="url(#batteryGradient)"
          strokeWidth={strokeWidth}
          fill="none"
          strokeDasharray={circumference}
          strokeDashoffset={circumference * (1 - progress)}
          strokeLinecap="round"
          transform={`rotate(-90 ${centerX} ${centerY})`}
        />
        
        {/* Center Icon */}
        {isCharging && (
          <Circle
            cx={centerX}
            cy={centerY}
            r={25}
            fill="#10B981"
            opacity={0.2}
          />
        )}
      </Svg>
      
      <View style={[styles.batteryCenter, { left: centerX - 60, top: centerY - 30 }]}>
        <Text style={styles.batteryValue}>{batteryLevel}%</Text>
        <Text style={styles.batteryLabel}>
          {isCharging ? 'CHARGING' : 'BATTERY'}
        </Text>
        {isCharging && (
          <Ionicons name="flash" size={16} color="#10B981" style={styles.chargingIcon} />
        )}
      </View>
    </View>
  );
};

// Charging Info Card Component
const ChargingInfoCard = ({ icon, title, value, subtitle, color = '#3B82F6' }) => {
  return (
    <View style={styles.infoCard}>
      <BlurView intensity={20} style={styles.infoCardBlur}>
        <View style={styles.infoHeader}>
          <Ionicons name={icon} size={24} color={color} />
          <Text style={styles.infoTitle}>{title}</Text>
        </View>
        <Text style={styles.infoValue}>{value}</Text>
        <Text style={styles.infoSubtitle}>{subtitle}</Text>
      </BlurView>
    </View>
  );
};

// Charging Station Component
const ChargingStation = ({ station, onPress }) => {
  return (
    <TouchableOpacity style={styles.stationCard} onPress={onPress}>
      <BlurView intensity={20} style={styles.stationBlur}>
        <View style={styles.stationHeader}>
          <View style={styles.stationInfo}>
            <Text style={styles.stationName}>{station.name}</Text>
            <Text style={styles.stationAddress}>{station.address}</Text>
          </View>
          <View style={styles.stationDistance}>
            <Text style={styles.distanceText}>{station.distance}</Text>
            <Ionicons name="location" size={16} color="#9CA3AF" />
          </View>
        </View>
        
        <View style={styles.stationDetails}>
          <View style={styles.stationDetail}>
            <Ionicons name="flash" size={16} color="#10B981" />
            <Text style={styles.detailText}>{station.power}</Text>
          </View>
          <View style={styles.stationDetail}>
            <Ionicons name="car-sport" size={16} color="#3B82F6" />
            <Text style={styles.detailText}>{station.available}/{station.total}</Text>
          </View>
          <View style={styles.stationDetail}>
            <Ionicons name="time" size={16} color="#F59E0B" />
            <Text style={styles.detailText}>{station.time}</Text>
          </View>
        </View>
      </BlurView>
    </TouchableOpacity>
  );
};

// Charging Control Button Component
const ChargingControlButton = ({ icon, title, active, onPress, color = '#3B82F6' }) => {
  return (
    <TouchableOpacity onPress={onPress} style={styles.controlButton}>
      <BlurView intensity={20} style={[styles.controlButtonBlur, active && styles.activeControlButton]}>
        <Ionicons name={icon} size={24} color={active ? color : '#9CA3AF'} />
        <Text style={[styles.controlButtonText, active && { color }]}>{title}</Text>
      </BlurView>
    </TouchableOpacity>
  );
};

// Main ChargingScreen Component
export default function ChargingScreen() {
  const [batteryLevel, setBatteryLevel] = useState(85);
  const [isCharging, setIsCharging] = useState(false);
  const [chargeLimit, setChargeLimit] = useState(90);
  const [scheduledCharging, setScheduledCharging] = useState(false);
  const [preconditioning, setPreconditioning] = useState(false);
  
  const chargingInfo = [
    {
      icon: 'speedometer',
      title: 'Range',
      value: '295 mi',
      subtitle: 'Estimated range',
      color: '#8B5CF6',
    },
    {
      icon: 'time',
      title: 'Time to Full',
      value: isCharging ? '2h 30m' : '--',
      subtitle: 'At current rate',
      color: '#3B82F6',
    },
    {
      icon: 'flash',
      title: 'Charge Rate',
      value: isCharging ? '48 kW' : '0 kW',
      subtitle: 'Current power',
      color: '#10B981',
    },
    {
      icon: 'battery-charging',
      title: 'Charge Limit',
      value: `${chargeLimit}%`,
      subtitle: 'Daily limit',
      color: '#F59E0B',
    },
  ];
  
  const nearbyStations = [
    {
      name: 'Supercharger Station',
      address: '123 Main St, City',
      distance: '2.1 mi',
      power: '250 kW',
      available: 4,
      total: 8,
      time: '15 min',
    },
    {
      name: 'Tesla Destination',
      address: '456 Oak Ave, City',
      distance: '3.5 mi',
      power: '72 kW',
      available: 2,
      total: 4,
      time: '45 min',
    },
    {
      name: 'ChargePoint Network',
      address: '789 Pine Rd, City',
      distance: '5.2 mi',
      power: '50 kW',
      available: 1,
      total: 2,
      time: '1h 20m',
    },
  ];
  
  const controlButtons = [
    {
      icon: 'play',
      title: 'Start Charging',
      active: isCharging,
      onPress: () => setIsCharging(!isCharging),
      color: '#10B981',
    },
    {
      icon: 'calendar',
      title: 'Scheduled',
      active: scheduledCharging,
      onPress: () => setScheduledCharging(!scheduledCharging),
      color: '#3B82F6',
    },
    {
      icon: 'thermometer',
      title: 'Precondition',
      active: preconditioning,
      onPress: () => setPreconditioning(!preconditioning),
      color: '#F59E0B',
    },
  ];
  
  useEffect(() => {
    let interval;
    if (isCharging && batteryLevel < chargeLimit) {
      interval = setInterval(() => {
        setBatteryLevel(prev => {
          const newLevel = prev + 0.1;
          if (newLevel >= chargeLimit) {
            setIsCharging(false);
            return chargeLimit;
          }
          return newLevel;
        });
      }, 1000);
    }
    
    return () => clearInterval(interval);
  }, [isCharging, batteryLevel, chargeLimit]);
  
  return (
    <SafeAreaView style={styles.container}>
      <LinearGradient
        colors={['#000000', '#1a1a1a', '#000000']}
        style={styles.gradient}
      >
        <ScrollView contentContainerStyle={styles.scrollContent}>
          {/* Header */}
          <View style={styles.header}>
            <Text style={styles.title}>Charging</Text>
            <Text style={styles.subtitle}>
              {isCharging ? 'Currently Charging' : 'Not Connected'}
            </Text>
          </View>
          
          {/* Battery Indicator */}
          <BatteryIndicator batteryLevel={batteryLevel} isCharging={isCharging} />
          
          {/* Charging Info Cards */}
          <View style={styles.infoContainer}>
            <View style={styles.infoRow}>
              {chargingInfo.map((info, index) => (
                <ChargingInfoCard
                  key={index}
                  icon={info.icon}
                  title={info.title}
                  value={info.value}
                  subtitle={info.subtitle}
                  color={info.color}
                />
              ))}
            </View>
          </View>
          
          {/* Charging Controls */}
          <View style={styles.controlsContainer}>
            <Text style={styles.sectionTitle}>Charging Controls</Text>
            <View style={styles.controlsRow}>
              {controlButtons.map((button, index) => (
                <ChargingControlButton
                  key={index}
                  icon={button.icon}
                  title={button.title}
                  active={button.active}
                  onPress={button.onPress}
                  color={button.color}
                />
              ))}
            </View>
          </View>
          
          {/* Charge Limit Slider */}
          <View style={styles.chargeLimitContainer}>
            <Text style={styles.sectionTitle}>Charge Limit</Text>
            <BlurView intensity={20} style={styles.sliderContainer}>
              <View style={styles.sliderHeader}>
                <Text style={styles.sliderLabel}>Daily Limit</Text>
                <Text style={styles.sliderValue}>{chargeLimit}%</Text>
              </View>
              <View style={styles.slider}>
                <View style={[styles.sliderTrack, { width: `${chargeLimit}%` }]} />
                <TouchableOpacity style={[styles.sliderThumb, { left: `${chargeLimit - 5}%` }]} />
              </View>
              <View style={styles.sliderLabels}>
                <Text style={styles.sliderLabelText}>50%</Text>
                <Text style={styles.sliderLabelText}>100%</Text>
              </View>
            </BlurView>
          </View>
          
          {/* Nearby Charging Stations */}
          <View style={styles.stationsContainer}>
            <Text style={styles.sectionTitle}>Nearby Charging Stations</Text>
            {nearbyStations.map((station, index) => (
              <ChargingStation
                key={index}
                station={station}
                onPress={() => {}}
              />
            ))}
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
    flexGrow: 1,
    paddingHorizontal: 20,
  },
  header: {
    marginTop: 20,
    marginBottom: 20,
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
  batteryContainer: {
    height: 300,
    marginBottom: 30,
    alignItems: 'center',
    position: 'relative',
  },
  batterySvg: {
    position: 'absolute',
  },
  batteryCenter: {
    position: 'absolute',
    width: 120,
    height: 60,
    alignItems: 'center',
    justifyContent: 'center',
  },
  batteryValue: {
    color: 'white',
    fontSize: 32,
    fontWeight: 'bold',
  },
  batteryLabel: {
    color: '#9CA3AF',
    fontSize: 12,
    marginTop: 2,
  },
  chargingIcon: {
    marginTop: 4,
  },
  infoContainer: {
    marginBottom: 30,
  },
  infoRow: {
    flexDirection: 'row',
    flexWrap: 'wrap',
    justifyContent: 'space-between',
  },
  infoCard: {
    width: '48%',
    marginBottom: 15,
  },
  infoCardBlur: {
    borderRadius: 15,
    padding: 15,
  },
  infoHeader: {
    flexDirection: 'row',
    alignItems: 'center',
    marginBottom: 10,
  },
  infoTitle: {
    color: 'white',
    fontSize: 14,
    marginLeft: 8,
  },
  infoValue: {
    color: 'white',
    fontSize: 18,
    fontWeight: 'bold',
    marginBottom: 5,
  },
  infoSubtitle: {
    color: '#9CA3AF',
    fontSize: 12,
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
  controlsRow: {
    flexDirection: 'row',
    justifyContent: 'space-between',
  },
  controlButton: {
    width: '30%',
  },
  controlButtonBlur: {
    borderRadius: 15,
    padding: 15,
    alignItems: 'center',
  },
  activeControlButton: {
    backgroundColor: 'rgba(59, 130, 246, 0.1)',
  },
  controlButtonText: {
    color: '#9CA3AF',
    fontSize: 12,
    marginTop: 5,
    textAlign: 'center',
  },
  chargeLimitContainer: {
    marginBottom: 30,
  },
  sliderContainer: {
    borderRadius: 15,
    padding: 20,
  },
  sliderHeader: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    marginBottom: 15,
  },
  sliderLabel: {
    color: 'white',
    fontSize: 16,
  },
  sliderValue: {
    color: '#3B82F6',
    fontSize: 18,
    fontWeight: 'bold',
  },
  slider: {
    height: 8,
    backgroundColor: '#333',
    borderRadius: 4,
    marginBottom: 10,
    position: 'relative',
  },
  sliderTrack: {
    height: 8,
    backgroundColor: '#3B82F6',
    borderRadius: 4,
  },
  sliderThumb: {
    position: 'absolute',
    top: -8,
    width: 24,
    height: 24,
    borderRadius: 12,
    backgroundColor: '#3B82F6',
  },
  sliderLabels: {
    flexDirection: 'row',
    justifyContent: 'space-between',
  },
  sliderLabelText: {
    color: '#9CA3AF',
    fontSize: 12,
  },
  stationsContainer: {
    marginBottom: 30,
  },
  stationCard: {
    marginBottom: 15,
  },
  stationBlur: {
    borderRadius: 15,
    padding: 15,
  },
  stationHeader: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'flex-start',
    marginBottom: 10,
  },
  stationInfo: {
    flex: 1,
  },
  stationName: {
    color: 'white',
    fontSize: 16,
    fontWeight: 'bold',
    marginBottom: 2,
  },
  stationAddress: {
    color: '#9CA3AF',
    fontSize: 14,
  },
  stationDistance: {
    flexDirection: 'row',
    alignItems: 'center',
  },
  distanceText: {
    color: '#9CA3AF',
    fontSize: 14,
    marginRight: 5,
  },
  stationDetails: {
    flexDirection: 'row',
    justifyContent: 'space-between',
  },
  stationDetail: {
    flexDirection: 'row',
    alignItems: 'center',
  },
  detailText: {
    color: 'white',
    fontSize: 12,
    marginLeft: 5,
  },
});
