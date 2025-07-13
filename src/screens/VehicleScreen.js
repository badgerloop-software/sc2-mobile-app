import React, { useState, useRef } from 'react';
import {
  View,
  Text,
  StyleSheet,
  Dimensions,
  TouchableOpacity,
  ScrollView,
  SafeAreaView,
  Alert,
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
import * as Haptics from 'expo-haptics';

const { width, height } = Dimensions.get('window');

// Interactive 2D Tesla Model (replaces 3D for stability)
const InteractiveTeslaModel = ({ onPartPress }) => {
  const rotation = useSharedValue(0);
  
  const animatedStyle = useAnimatedStyle(() => {
    return {
      transform: [{ rotateY: `${rotation.value}deg` }],
    };
  });
  
  React.useEffect(() => {
    const interval = setInterval(() => {
      rotation.value = withSpring(rotation.value + 10);
    }, 3000);
    return () => clearInterval(interval);
  }, []);
  
  return (
    <View style={styles.interactiveTeslaContainer}>
      <Animated.View style={[styles.teslaModel, animatedStyle]}>
        <LinearGradient
          colors={['#1a1a1a', '#2d2d2d', '#1a1a1a']}
          style={styles.carBody}
        >
          {/* Car Parts - Interactive Areas */}
          <View style={styles.carParts}>
            {/* Front */}
            <TouchableOpacity 
              style={[styles.carPart, styles.frontPart]}
              onPress={() => onPartPress('frunk')}
            >
              <Ionicons name="car-sport" size={20} color="#007AFF" />
            </TouchableOpacity>
            
            {/* Doors */}
            <TouchableOpacity 
              style={[styles.carPart, styles.leftDoor]}
              onPress={() => onPartPress('door-left')}
            >
              <Ionicons name="enter" size={16} color="#10B981" />
            </TouchableOpacity>
            
            <TouchableOpacity 
              style={[styles.carPart, styles.rightDoor]}
              onPress={() => onPartPress('door-right')}
            >
              <Ionicons name="exit" size={16} color="#10B981" />
            </TouchableOpacity>
            
            {/* Trunk */}
            <TouchableOpacity 
              style={[styles.carPart, styles.trunkPart]}
              onPress={() => onPartPress('trunk')}
            >
              <Ionicons name="briefcase" size={16} color="#8B5CF6" />
            </TouchableOpacity>
          </View>
          
          {/* Tesla Logo */}
          <Text style={styles.teslaLogo}>TESLA</Text>
          
          {/* Status Indicators */}
          <View style={styles.statusIndicators}>
            <View style={[styles.statusDot, { backgroundColor: '#10B981' }]} />
            <View style={[styles.statusDot, { backgroundColor: '#007AFF' }]} />
            <View style={[styles.statusDot, { backgroundColor: '#8B5CF6' }]} />
          </View>
        </LinearGradient>
      </Animated.View>
    </View>
  );
};

// Vehicle Control Card Component
const VehicleControlCard = ({ icon, title, subtitle, status, onPress, color = '#3B82F6' }) => {
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
    Haptics.impactAsync(Haptics.ImpactFeedbackStyle.Light);
    onPress?.();
  };
  
  return (
    <TouchableOpacity onPress={handlePress} style={styles.controlCard}>
      <Animated.View style={[styles.controlCardContent, animatedStyle]}>
        <BlurView intensity={20} style={styles.cardBlur}>
          <View style={styles.cardHeader}>
            <Ionicons name={icon} size={28} color={color} />
            <View style={styles.cardInfo}>
              <Text style={styles.cardTitle}>{title}</Text>
              <Text style={styles.cardSubtitle}>{subtitle}</Text>
            </View>
          </View>
          <View style={styles.cardStatus}>
            <Text style={[styles.statusText, { color }]}>{status}</Text>
          </View>
        </BlurView>
      </Animated.View>
    </TouchableOpacity>
  );
};

// Quick Access Button Component
const QuickAccessButton = ({ icon, title, onPress, color = '#3B82F6' }) => {
  const scale = useSharedValue(1);
  
  const animatedStyle = useAnimatedStyle(() => {
    return {
      transform: [{ scale: scale.value }],
    };
  });
  
  const handlePress = () => {
    scale.value = withSpring(0.9, { duration: 100 }, () => {
      scale.value = withSpring(1);
    });
    Haptics.impactAsync(Haptics.ImpactFeedbackStyle.Medium);
    onPress?.();
  };
  
  return (
    <TouchableOpacity onPress={handlePress} style={styles.quickButton}>
      <Animated.View style={[styles.quickButtonContent, animatedStyle]}>
        <BlurView intensity={20} style={styles.quickButtonBlur}>
          <Ionicons name={icon} size={24} color={color} />
          <Text style={styles.quickButtonText}>{title}</Text>
        </BlurView>
      </Animated.View>
    </TouchableOpacity>
  );
};

// Main VehicleScreen Component
export default function VehicleScreen() {
  const [isLocked, setIsLocked] = useState(true);
  const [doorsOpen, setDoorsOpen] = useState({
    frontLeft: false,
    frontRight: false,
    rearLeft: false,
    rearRight: false,
  });
  const [trunkOpen, setTrunkOpen] = useState(false);
  const [frunkOpen, setFrunkOpen] = useState(false);
  const [lightsOn, setLightsOn] = useState(false);
  const [hornActive, setHornActive] = useState(false);
  const [sentryMode, setSentryMode] = useState(false);
  
  const handlePartPress = (part) => {
    switch (part) {
      case 'door-left':
        Alert.alert('Door Control', 'Open left door?', [
          { text: 'Cancel', style: 'cancel' },
          { text: 'Open', onPress: () => setDoorsOpen(prev => ({ ...prev, frontLeft: !prev.frontLeft })) },
        ]);
        break;
      case 'door-right':
        Alert.alert('Door Control', 'Open right door?', [
          { text: 'Cancel', style: 'cancel' },
          { text: 'Open', onPress: () => setDoorsOpen(prev => ({ ...prev, frontRight: !prev.frontRight })) },
        ]);
        break;
      case 'trunk':
        setTrunkOpen(!trunkOpen);
        break;
      case 'frunk':
        setFrunkOpen(!frunkOpen);
        break;
      case 'headlight':
        setLightsOn(!lightsOn);
        break;
      default:
        break;
    }
  };
  
  const controlCards = [
    {
      icon: isLocked ? 'lock-closed' : 'lock-open',
      title: 'Vehicle Security',
      subtitle: 'Doors and windows',
      status: isLocked ? 'Locked' : 'Unlocked',
      onPress: () => setIsLocked(!isLocked),
      color: isLocked ? '#EF4444' : '#10B981',
    },
    {
      icon: 'car-sport',
      title: 'Doors',
      subtitle: 'All doors closed',
      status: Object.values(doorsOpen).some(door => door) ? 'Open' : 'Closed',
      onPress: () => {},
      color: '#3B82F6',
    },
    {
      icon: 'archive',
      title: 'Trunk',
      subtitle: 'Rear storage',
      status: trunkOpen ? 'Open' : 'Closed',
      onPress: () => setTrunkOpen(!trunkOpen),
      color: '#8B5CF6',
    },
    {
      icon: 'briefcase',
      title: 'Frunk',
      subtitle: 'Front storage',
      status: frunkOpen ? 'Open' : 'Closed',
      onPress: () => setFrunkOpen(!frunkOpen),
      color: '#F59E0B',
    },
    {
      icon: lightsOn ? 'bulb' : 'bulb-outline',
      title: 'Lights',
      subtitle: 'Headlights & taillights',
      status: lightsOn ? 'On' : 'Off',
      onPress: () => setLightsOn(!lightsOn),
      color: lightsOn ? '#FBBF24' : '#6B7280',
    },
    {
      icon: 'shield-checkmark',
      title: 'Sentry Mode',
      subtitle: 'Security monitoring',
      status: sentryMode ? 'Active' : 'Inactive',
      onPress: () => setSentryMode(!sentryMode),
      color: sentryMode ? '#EF4444' : '#6B7280',
    },
  ];
  
  const quickActions = [
    { icon: 'flash', title: 'Flash Lights', onPress: () => {}, color: '#FBBF24' },
    { icon: 'volume-high', title: 'Honk Horn', onPress: () => {}, color: '#EF4444' },
    { icon: 'car-sport', title: 'Start Vehicle', onPress: () => {}, color: '#10B981' },
    { icon: 'location', title: 'Find Vehicle', onPress: () => {}, color: '#3B82F6' },
  ];
  
  return (
    <SafeAreaView style={styles.container}>
      <LinearGradient
        colors={['#000000', '#1a1a1a', '#000000']}
        style={styles.gradient}
      >
        <ScrollView contentContainerStyle={styles.scrollContent}>
          {/* Header */}
          <View style={styles.header}>
            <Text style={styles.title}>Vehicle Control</Text>
            <Text style={styles.subtitle}>Model S • P85D</Text>
          </View>
          
          {/* Interactive Car Visualization */}
          <View style={styles.carContainer}>
            <InteractiveTeslaModel onPartPress={handlePartPress} />
          </View>
          
          {/* Quick Actions */}
          <View style={styles.quickActionsContainer}>
            <Text style={styles.sectionTitle}>Quick Actions</Text>
            <View style={styles.quickActionsRow}>
              {quickActions.map((action, index) => (
                <QuickAccessButton
                  key={index}
                  icon={action.icon}
                  title={action.title}
                  onPress={action.onPress}
                  color={action.color}
                />
              ))}
            </View>
          </View>
          
          {/* Vehicle Controls */}
          <View style={styles.controlsContainer}>
            <Text style={styles.sectionTitle}>Vehicle Controls</Text>
            {controlCards.map((card, index) => (
              <VehicleControlCard
                key={index}
                icon={card.icon}
                title={card.title}
                subtitle={card.subtitle}
                status={card.status}
                onPress={card.onPress}
                color={card.color}
              />
            ))}
          </View>
          
          {/* Emergency Actions */}
          <View style={styles.emergencyContainer}>
            <Text style={styles.sectionTitle}>Emergency</Text>
            <TouchableOpacity style={styles.emergencyButton}>
              <BlurView intensity={20} style={styles.emergencyBlur}>
                <Ionicons name="warning" size={24} color="#EF4444" />
                <Text style={styles.emergencyText}>Emergency Service</Text>
              </BlurView>
            </TouchableOpacity>
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
  carContainer: {
    height: 250,
    marginBottom: 30,
    borderRadius: 20,
    overflow: 'hidden',
    backgroundColor: '#1a1a1a',
  },
  canvas: {
    flex: 1,
  },
  quickActionsContainer: {
    marginBottom: 30,
  },
  sectionTitle: {
    color: 'white',
    fontSize: 20,
    fontWeight: 'bold',
    marginBottom: 15,
  },
  quickActionsRow: {
    flexDirection: 'row',
    justifyContent: 'space-between',
  },
  quickButton: {
    width: '23%',
  },
  quickButtonContent: {
    borderRadius: 15,
    overflow: 'hidden',
  },
  quickButtonBlur: {
    padding: 12,
    alignItems: 'center',
  },
  quickButtonText: {
    color: 'white',
    fontSize: 10,
    marginTop: 5,
    textAlign: 'center',
  },
  controlsContainer: {
    marginBottom: 30,
  },
  controlCard: {
    marginBottom: 15,
  },
  controlCardContent: {
    borderRadius: 15,
    overflow: 'hidden',
  },
  cardBlur: {
    padding: 20,
  },
  cardHeader: {
    flexDirection: 'row',
    alignItems: 'center',
    marginBottom: 10,
  },
  cardInfo: {
    flex: 1,
    marginLeft: 15,
  },
  cardTitle: {
    color: 'white',
    fontSize: 16,
    fontWeight: 'bold',
  },
  cardSubtitle: {
    color: '#9CA3AF',
    fontSize: 14,
    marginTop: 2,
  },
  cardStatus: {
    alignItems: 'flex-end',
  },
  statusText: {
    fontSize: 14,
    fontWeight: 'bold',
  },
  emergencyContainer: {
    marginBottom: 30,
  },
  emergencyButton: {
    borderRadius: 15,
    overflow: 'hidden',
  },
  emergencyBlur: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'center',
    padding: 15,
  },
  emergencyText: {
    color: '#EF4444',
    fontSize: 16,
    fontWeight: 'bold',
    marginLeft: 10,
  },
  // Interactive Tesla Model Styles
  interactiveTeslaContainer: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
    minHeight: 250,
  },
  teslaModel: {
    width: 200,
    height: 200,
    borderRadius: 100,
    justifyContent: 'center',
    alignItems: 'center',
  },
  carBody: {
    width: '100%',
    height: '100%',
    borderRadius: 100,
    justifyContent: 'center',
    alignItems: 'center',
    borderWidth: 2,
    borderColor: '#007AFF',
  },
  carParts: {
    position: 'absolute',
    width: '100%',
    height: '100%',
  },
  carPart: {
    position: 'absolute',
    backgroundColor: 'rgba(0, 0, 0, 0.5)',
    borderRadius: 15,
    padding: 8,
    justifyContent: 'center',
    alignItems: 'center',
  },
  frontPart: {
    top: 20,
    left: '45%',
  },
  leftDoor: {
    left: 10,
    top: '40%',
  },
  rightDoor: {
    right: 10,
    top: '40%',
  },
  trunkPart: {
    bottom: 20,
    left: '45%',
  },
  teslaLogo: {
    color: '#007AFF',
    fontSize: 12,
    fontWeight: 'bold',
    marginTop: 5,
  },
  statusIndicators: {
    flexDirection: 'row',
    marginTop: 10,
  },
  statusDot: {
    width: 8,
    height: 8,
    borderRadius: 4,
    marginHorizontal: 2,
  },
});
