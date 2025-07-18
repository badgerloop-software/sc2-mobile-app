import React, { useState, useEffect, useRef } from 'react';
import {
  View,
  Text,
  StyleSheet,
  Dimensions,
  TouchableOpacity,
  ScrollView,
  SafeAreaView,
  Alert,
  Image,
} from 'react-native';
import { PanResponder } from 'react-native';
import { useSafeAreaInsets } from 'react-native-safe-area-context';
import { LinearGradient } from 'expo-linear-gradient';
import { Ionicons } from '@expo/vector-icons';
import { BlurView } from 'expo-blur';
import Animated, {
  useSharedValue,
  useAnimatedStyle,
  withSpring,
} from 'react-native-reanimated';

import {
  telemetryCategories,
  generateMockTelemetryData,
  getSignalDisplayValue,
  getSignalStatus
} from '../data/telemetryData';
import LocationWeatherDisplay from '../components/LocationWeatherDisplay';

const { width, height } = Dimensions.get('window');

// // Solar Car Model Component
// const SolarCarModel = ({ telemetryData }) => {
//   // Check for critical alerts
//   const hasCriticalAlert = telemetryData && Object.keys(telemetryData).some(key => {
//     // Check safety systems for critical alerts
//     if (key.includes('eStop') || key.includes('crash') || key.includes('fault')) {
//       return telemetryData[key] === true;
//     }
//     return false;
//   });

//   const batteryLevel = telemetryData?.soc || 50;
//   const speed = telemetryData?.speed || 0;

//   return (
//     <View style={styles.solarCarContainer}>
//       <BlurView intensity={20} style={styles.blur}>
//         <View style={styles.content}>
//           {/* 3D Model Placeholder */}
//           <View style={styles.modelContainer}>
//           <View style={styles.carIconContainer}>
//             <LinearGradient
//               colors={hasCriticalAlert ? ['#FF4757', '#FF6B6B'] : ['#C9302C', '#FF6B6B']}
//               style={styles.carIconGradient}
//             >
//               <Ionicons name="car-sport" size={60} color="white" />
//             </LinearGradient>
//           </View>

//           {/* Critical Alert Warning */}
//           {hasCriticalAlert && (
//             <View style={styles.criticalAlertWarning}>
//               <Ionicons name="warning" size={20} color="#EF4444" />
//             </View>
//           )}

//           <Text style={styles.modelStatus}>Solar Car 3D Model Ready</Text>
//           <Text style={styles.modelSubtitle}>
//             Drop your <Text style={styles.filename}>solar-car.glb</Text> file in:
//           </Text>
//           <Text style={styles.path}>src/assets/models/</Text>
//         </View>

//         {/* 3D Ready Indicator */}
//         <View style={styles.readyIndicator}>
//           <Ionicons name="cube" size={16} color="white" />
//           <Text style={styles.readyText}>3D Ready</Text>
//         </View>
//       </View>
//       </BlurView>
//     </View>
//   );
// };

import { GLView } from 'expo-gl';
import { Renderer } from 'expo-three';
import * as THREE from 'three';
import { Asset } from 'expo-asset';
import { GLTFLoader } from 'three/examples/jsm/loaders/GLTFLoader';

const SolarCarModel = ({ setScrollEnabled }) => {
  const modelRef = useRef(null);
  const lastPanX = useRef(0);
  const lastPanY = useRef(0);
  const panResponder = useRef(
    PanResponder.create({
      onStartShouldSetPanResponder: () => true,
      onMoveShouldSetPanResponder: () => true,
      onPanResponderGrant: () => {
        lastPanX.current = 0;
        lastPanY.current = 0;
        setScrollEnabled && setScrollEnabled(false);
      },
      onPanResponderMove: (evt, gestureState) => {
        if (modelRef.current) {
          // Horizontal pan controls Y rotation, vertical pan controls X rotation
          const deltaX = gestureState.dx - lastPanX.current;
          const deltaY = gestureState.dy - lastPanY.current;
          modelRef.current.rotation.y += deltaX * 0.01;
          modelRef.current.rotation.x += deltaY * 0.01;
          // Clamp X rotation to avoid flipping
          modelRef.current.rotation.x = Math.max(-Math.PI / 2, Math.min(Math.PI / 2, modelRef.current.rotation.x));
          lastPanX.current = gestureState.dx;
          lastPanY.current = gestureState.dy;
        }
      },
      onPanResponderRelease: () => {
        lastPanX.current = 0;
        lastPanY.current = 0;
        setScrollEnabled && setScrollEnabled(true);
      },
      onPanResponderTerminate: () => {
        setScrollEnabled && setScrollEnabled(true);
      },
    })
  ).current;

  const onContextCreate = async (gl) => {
    const { drawingBufferWidth: width, drawingBufferHeight: height } = gl;
    const scene = new THREE.Scene();
    const camera = new THREE.PerspectiveCamera(75, width / height, 0.1, 1000);
    camera.position.z = 8; // Zoom out further

    const renderer = new Renderer({ gl });
    renderer.setSize(width, height);

    // Lighting
    const ambientLight = new THREE.AmbientLight(0xffffff, 1);
    scene.add(ambientLight);
    const PointLight = new THREE.PointLight(0xffffff, 0.5);
    PointLight.position.set(1, 1, 1);
    scene.add(PointLight);
    const directionalLight = new THREE.DirectionalLight(0xffffff, 1);
    directionalLight.position.set(5, 10, 7.5);
    scene.add(directionalLight);

    // Load model
    const asset = Asset.fromModule(require('../assets/models/race-car.glb'));
    await asset.downloadAsync();
    const loader = new GLTFLoader();
    loader.load(
      asset.localUri || asset.uri,
      (gltf) => {
        const model = gltf.scene;
        // Color wheels black, windows and badge grey, body red
        model.traverse((child) => {
          if (child.isMesh) {
            const name = (child.name || '').toLowerCase();
            const matName = (child.material?.name || '').toLowerCase();
            if (
              name.includes('wheel') || name.includes('tire') ||
              matName.includes('wheel') || matName.includes('tire')
            ) {
              // Wheels
              child.material = new THREE.MeshStandardMaterial({ color: 0x000000 });
            } else if (
              name.includes('window') || matName.includes('window') ||
              name.includes('glass') || matName.includes('glass') ||
              name.includes('windshield') || matName.includes('windshield') ||
              name.includes('badge') || matName.includes('badge')
            ) {
              // Windows and badge
              child.material = new THREE.MeshStandardMaterial({ color: 0x888888 });
            } else {
              // Body
              child.material = new THREE.MeshStandardMaterial({ color: 0xff0000 });
            }
          }
        });
        // Set initial rotation to face forward
        model.rotation.set(0, 0, 0);
        // Move the model down a little
        model.position.y = -0.8;
        modelRef.current = model;
        scene.add(model);
      }
    );

    // Animation loop
    const render = () => {
      requestAnimationFrame(render);
      renderer.render(scene, camera);
      gl.endFrameEXP();
    };
    render();
  };

  return (
    <View style={{ flex: 1, width: '100%', height: 250, backgroundColor: 'transparent' }} {...panResponder.panHandlers}>
      <GLView
        style={{ flex: 1, width: '100%', height: 250, backgroundColor: 'transparent' }}
        onContextCreate={onContextCreate}
      />
    </View>
  );
};

// Critical Alerts Detection Component (Similar to BPS Faults)
const CriticalAlertsDetection = ({ telemetryData }) => {
  const [isExpanded, setIsExpanded] = React.useState(false);
  const alerts = [];

  // Check for various critical conditions
  const criticalFields = [
    { field: 'driver_eStop', description: 'Driver Emergency Stop Activated' },
    { field: 'observer_eStop', description: 'Observer Emergency Stop Activated' },
    { field: 'crash', description: 'Crash Detection System Triggered' },
    { field: 'bps_fault', description: 'Battery Protection System Fault' },
    { field: 'voltage_failsafe', description: 'Voltage Failsafe Activated' },
    { field: 'current_failsafe', description: 'Current Failsafe Activated' },
    { field: 'relay_failsafe', description: 'Relay Failsafe Activated' },
    { field: 'internal_hardware_fault', description: 'Internal Hardware Fault' },
    { field: 'internal_software_fault', description: 'Internal Software Fault' },
    { field: 'highest_cell_voltage_too_high_fault', description: 'Cell Voltage Too High' },
    { field: 'lowest_cell_voltage_too_low_fault', description: 'Cell Voltage Too Low' },
    { field: 'pack_too_hot_fault', description: 'Battery Pack Overheating' },
    { field: 'high_voltage_interlock_signal_fault', description: 'HV Interlock Fault' },
  ];

  // Check boolean fault fields
  criticalFields.forEach(({ field, description }) => {
    if (telemetryData[field] === true) {
      alerts.push({
        name: field,
        description: description,
        severity: 'critical',
        time: new Date().toLocaleTimeString()
      });
    }
  });

  // Check temperature thresholds
  if (telemetryData.pack_temp && telemetryData.pack_temp > 50) {
    alerts.push({
      name: 'pack_temp_high',
      description: `Battery Temperature High (${telemetryData.pack_temp}°C)`,
      severity: 'warning',
      time: new Date().toLocaleTimeString()
    });
  }

  if (telemetryData.motor_temp && telemetryData.motor_temp > 80) {
    alerts.push({
      name: 'motor_temp_high',
      description: `Motor Temperature High (${telemetryData.motor_temp}°C)`,
      severity: 'warning',
      time: new Date().toLocaleTimeString()
    });
  }

  // Check low battery
  if (telemetryData.soc && telemetryData.soc < 20) {
    alerts.push({
      name: 'low_battery',
      description: `Low Battery Level (${telemetryData.soc}%)`,
      severity: 'warning',
      time: new Date().toLocaleTimeString()
    });
  }

  // Check high voltage safety
  if (telemetryData.discharge_enabled === false && telemetryData.charge_enabled === false) {
    alerts.push({
      name: 'hv_system_disabled',
      description: 'High Voltage System Disabled',
      severity: 'critical',
      time: new Date().toLocaleTimeString()
    });
  }

  const hasAlerts = alerts.length > 0;

  return (
    <View style={styles.alertsContainer}>
      <View style={styles.alertsDetectionContainer}>
        <TouchableOpacity
          onPress={() => hasAlerts && setIsExpanded(!isExpanded)}
          style={[styles.alertsBlurContainer, hasAlerts && styles.alertsBlurContainerWithAlerts]}
        >
          <BlurView intensity={20} style={styles.alertsBlur}>
            <View style={styles.alertsHeader}>
              <Ionicons
                name={hasAlerts ? "warning" : "shield-checkmark"}
                size={24}
                color={hasAlerts ? "#EF4444" : "#10B981"}
              />
              <Text style={[styles.alertsTitle, { color: hasAlerts ? "#EF4444" : "#10B981" }]}>
                {hasAlerts ? "Critical Alerts" : "All Systems Normal"}
              </Text>
              {hasAlerts && (
                <View style={styles.alertsExpandIcon}>
                  <Ionicons
                    name={isExpanded ? "chevron-up" : "chevron-down"}
                    size={20}
                    color="#9CA3AF"
                  />
                </View>
              )}
            </View>

            {!hasAlerts && (
              <Text style={styles.alertsMessage}>All vehicle systems are functioning normally.</Text>
            )}

            {hasAlerts && !isExpanded && (
              <Text style={styles.alertsMessage}>
                {alerts.length} alert{alerts.length > 1 ? 's' : ''} detected. Tap to expand.
              </Text>
            )}

            {hasAlerts && isExpanded && (
              <View style={styles.alertsExpandedContent}>
                {alerts.map((alert, index) => (
                  <View key={index} style={styles.alertItem}>
                    <View style={styles.alertItemHeader}>
                      <Text style={[styles.alertName, { color: alert.severity === 'critical' ? '#EF4444' : '#FF9F43' }]}>
                        {alert.description}
                      </Text>
                      <Text style={styles.alertItemTime}>{alert.time}</Text>
                    </View>
                  </View>
                ))}
              </View>
            )}
          </BlurView>
        </TouchableOpacity>
      </View>
    </View>
  );
};

// Telemetry Category Card Component
const TelemetryCategoryCard = ({ category, data, onPress }) => {
  const scale = useSharedValue(1);
  const categoryData = telemetryCategories[category];

  const animatedStyle = useAnimatedStyle(() => {
    return {
      transform: [{ scale: scale.value }],
    };
  });

  const handlePress = () => {
    scale.value = withSpring(0.95, { duration: 100 }, () => {
      scale.value = withSpring(1);
    });
    onPress?.(category);
  };

  // Calculate category health score
  const signals = Object.keys(categoryData.signals);
  const criticalCount = signals.filter(signal => {
    const value = data[signal];
    if (value !== undefined) {
      return getSignalStatus(signal, value, category) === 'critical';
    }
    return false;
  }).length;

  const warningCount = signals.filter(signal => {
    const value = data[signal];
    if (value !== undefined) {
      return getSignalStatus(signal, value, category) === 'warning';
    }
    return false;
  }).length;

  const healthScore = ((signals.length - criticalCount - warningCount) / signals.length * 100).toFixed(0);
  const statusColor = criticalCount > 0 ? '#EF4444' : warningCount > 0 ? '#FF9F43' : '#10B981';

  return (
    <TouchableOpacity onPress={handlePress} style={styles.categoryCard}>
      <Animated.View style={[styles.categoryContent, animatedStyle]}>
        <BlurView intensity={20} style={styles.categoryBlur}>
          <View style={styles.categoryHeader}>
            <Ionicons name={categoryData.icon} size={24} color={categoryData.color} />
            <Text style={styles.categoryTitle}>{category}</Text>
          </View>
          <View style={styles.categoryStats}>
            <View style={styles.statItem}>
              <Text style={[styles.statValue, { color: statusColor }]}>{healthScore}%</Text>
              <Text style={styles.statLabel}>Health</Text>
            </View>
            <View style={styles.statItem}>
              <Text style={styles.statValue}>{signals.length}</Text>
              <Text style={styles.statLabel}>Signals</Text>
            </View>
            <View style={styles.statItem}>
              <Text style={[styles.statValue, { color: criticalCount > 0 ? '#EF4444' : '#9CA3AF' }]}>{criticalCount}</Text>
              <Text style={styles.statLabel}>Critical</Text>
            </View>
          </View>
        </BlurView>
      </Animated.View>
    </TouchableOpacity>
  );
};

// Main HomeScreen Component
export default function HomeScreen({ navigation }) {
  const insets = useSafeAreaInsets();
  const [telemetryData, setTelemetryData] = useState(null);
  const [lastUpdate, setLastUpdate] = useState(new Date());
  const [useImperialUnits, setUseImperialUnits] = useState(true); // Global unit preference
  const [locationName, setLocationName] = useState('Madison, WI'); // Default location name
  const [scrollEnabled, setScrollEnabled] = useState(true);

  // Convert temperature from Celsius to Fahrenheit
  const convertTemperature = (celsius) => {
    return useImperialUnits ? Math.round(celsius * 9/5 + 32) : Math.round(celsius);
  };

  // Get temperature unit label
  const getTempUnit = () => useImperialUnits ? '°F' : '°C';

  // Simulate real-time telemetry data updates
  useEffect(() => {
    const updateTelemetry = () => {
      const newData = generateMockTelemetryData();
      setTelemetryData(newData);
      setLastUpdate(new Date());
    };

    // Initial load
    updateTelemetry();

    // Update every 3 seconds for smoother, more visible movement
    const interval = setInterval(updateTelemetry, 3000);

    return () => clearInterval(interval);
  }, []);

  const handleCategoryPress = (category) => {
    // Navigate to detailed view (could be implemented later)
    Alert.alert(
      category,
      `View detailed telemetry for ${category}`,
      [
        { text: 'Cancel', style: 'cancel' },
        { text: 'View Details', onPress: () => console.log(`Navigate to ${category}`) }
      ]
    );
  };

  if (!telemetryData) {
    return (
      <SafeAreaView style={styles.container}>
        <LinearGradient colors={['#000000', '#1a1a1a', '#000000']} style={styles.gradient}>
          <View style={styles.loadingContainer}>
            <Ionicons name="sync" size={48} color="#C9302C" />
            <Text style={styles.loadingText}>Connecting to Vehicle...</Text>
          </View>
        </LinearGradient>
      </SafeAreaView>
    );
  }

  return (
    <SafeAreaView style={styles.container}>
      <LinearGradient
        colors={['#000000', '#1a1a1a', '#000000']}
        style={styles.gradient}
      >
        <ScrollView 
          contentContainerStyle={[styles.scrollContent, { paddingBottom: Math.max(insets.bottom, 20) }]}
          contentInsetAdjustmentBehavior="automatic"
          showsVerticalScrollIndicator={false}
          scrollEnabled={scrollEnabled}
        >
          {/* Header */}
          <View style={styles.header}>
            <View style={styles.headerTop}>
              <View style={styles.headerText}>
                <View style={styles.brandContainer}>
                  <Text style={styles.greeting}>Badger Solar Racing</Text>
                </View>
                <Text style={styles.vehicleName}>Solar Car 2</Text>
                <Text style={styles.lastUpdate}>
                  Last Update: {lastUpdate.toLocaleTimeString()}
                </Text>
              </View>
            </View>
          </View>

          {/* Critical Alerts Detection */}
          <CriticalAlertsDetection telemetryData={telemetryData} />

          {/* Solar Car Visualization */}
          <View style={styles.carContainer}>
            <SolarCarModel telemetryData={telemetryData} setScrollEnabled={setScrollEnabled} />
          </View>

          {/* Combined Location & Weather Display */}
          <LocationWeatherDisplay 
            telemetryData={telemetryData} 
            useImperialUnits={useImperialUnits} 
            setUseImperialUnits={setUseImperialUnits} 
            setLocationName={setLocationName} 
          />

          {/* Key Metrics */}
          <View style={styles.keyMetricsContainer}>
            <BlurView intensity={20} style={styles.metricsBlur}>
              <View style={styles.metricsGrid}>
                <View style={styles.metricItem}>
                  <Ionicons name="battery-charging" size={24} color="#4ECDC4" />
                  <Text style={styles.metricValue}>{telemetryData.soc}%</Text>
                  <Text style={styles.metricLabel}>Battery SOC</Text>
                </View>
                <View style={styles.metricItem}>
                  <Ionicons name="speedometer" size={24} color="#FF6B6B" />
                  <Text style={styles.metricValue}>{telemetryData.speed}</Text>
                  <Text style={styles.metricLabel}>Speed (mph)</Text>
                </View>
                <View style={styles.metricItem}>
                  <Ionicons name="sunny" size={24} color="#C9302C" />
                  <Text style={styles.metricValue}>{telemetryData.mppt_power_out}W</Text>
                  <Text style={styles.metricLabel}>Solar Power</Text>
                </View>
                <View style={styles.metricItem}>
                  <Ionicons name="thermometer" size={24} color="#6C5CE7" />
                  <Text style={styles.metricValue}>
                    {convertTemperature(telemetryData.pack_temp)}{getTempUnit()}
                  </Text>
                  <Text style={styles.metricLabel}>Battery Temp</Text>
                </View>
              </View>
            </BlurView>
          </View>

          {/* Telemetry Categories */}
          <View style={styles.categoriesContainer}>
            <Text style={styles.sectionTitle}>System Categories</Text>
            <View style={styles.categoriesGrid}>
              {Object.keys(telemetryCategories).map((category) => (
                <TelemetryCategoryCard
                  key={category}
                  category={category}
                  data={telemetryData}
                  onPress={handleCategoryPress}
                />
              ))}
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
    flexGrow: 1,
    paddingHorizontal: 20,
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
    marginTop: 20,
    marginBottom: 20,
    alignItems: 'center',
  },
  headerTop: {
    width: '100%',
    alignItems: 'center',
  },
  headerText: {
    alignItems: 'center',
    flex: 1,
  },
  brandContainer: {
    flexDirection: 'row',
    alignItems: 'center',
    marginBottom: 5,
  },
  brandLogo: {
    width: 40,
    height: 40,
    marginRight: 10,
    tintColor: '#C9302C', // Apply brand color to logo
  },
  globalUnitToggleText: {
    color: 'white',
    fontSize: 12,
    fontWeight: 'bold',
  },
  globalUnitToggleSubtext: {
    color: 'white',
    fontSize: 10,
    marginTop: 2,
    opacity: 0.8,
  },
  greeting: {
    color: '#C9302C',
    fontSize: 24,
    fontWeight: 'bold',
    marginBottom: 5,
  },
  vehicleName: {
    color: 'white',
    fontSize: 21,
    fontWeight: 'bold',
    marginBottom: 5,
  },
  lastUpdate: {
    color: '#9CA3AF',
    fontSize: 14,
  },
  sectionTitle: {
    color: 'white',
    fontSize: 20,
    fontWeight: 'bold',
    marginBottom: 15,
  },
  alertsContainer: {
    marginBottom: 20,
  },
  alertsDetectionContainer: {
    marginBottom: 10,
  },
  alertsBlurContainer: {
    borderRadius: 15,
    overflow: 'hidden',
  },
  alertsBlurContainerWithAlerts: {
    borderWidth: 1,
    borderColor: '#EF4444',
  },
  alertsBlur: {
    padding: 15,
  },
  alertsHeader: {
    flexDirection: 'row',
    alignItems: 'center',
    marginBottom: 10,
  },
  alertsTitle: {
    fontSize: 16,
    fontWeight: 'bold',
    marginLeft: 8,
    flex: 1,
  },
  alertsExpandIcon: {
    marginLeft: 10,
  },
  alertsMessage: {
    color: '#9CA3AF',
    fontSize: 14,
  },
  alertsExpandedContent: {
    marginTop: 10,
  },
  alertItem: {
    marginTop: 5,
  },
  alertItemHeader: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
  },
  alertName: {
    fontSize: 14,
    fontWeight: '500',
    flex: 1,
  },
  alertItemTime: {
    color: '#9CA3AF',
    fontSize: 12,
    marginLeft: 10,
  },
  carContainer: {
    height: 250,
    marginBottom: 20,
    borderRadius: 20,
    overflow: 'hidden',
    backgroundColor: 'rgba(0,0,0,0.15)', // Even more transparent for blending
  },
  solarCarContainer: {
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
  carIconContainer: {
    marginBottom: 20,
    borderRadius: 20,
    overflow: 'hidden',
  },
  carIconGradient: {
    width: 120,
    height: 120,
    borderRadius: 60,
    justifyContent: 'center',
    alignItems: 'center',
    borderWidth: 2,
    borderColor: '#C9302C',
  },
  criticalAlertWarning: {
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
  keyMetricsContainer: {
    marginBottom: 20,
  },
  metricsBlur: {
    borderRadius: 20,
    overflow: 'hidden',
    padding: 20,
  },
  metricsGrid: {
    flexDirection: 'row',
    justifyContent: 'space-around',
    flexWrap: 'wrap',
  },
  metricItem: {
    alignItems: 'center',
    minWidth: '22%',
    marginBottom: 10,
  },
  metricValue: {
    color: 'white',
    fontSize: 18,
    fontWeight: 'bold',
    marginTop: 5,
  },
  metricLabel: {
    color: '#9CA3AF',
    fontSize: 12,
    marginTop: 2,
    textAlign: 'center',
  },
  categoriesContainer: {
    marginBottom: 30,
  },
  categoriesGrid: {
    flexDirection: 'row',
    flexWrap: 'wrap',
    justifyContent: 'space-between',
  },
  categoryCard: {
    width: '48%',
    marginBottom: 15,
  },
  categoryContent: {
    borderRadius: 15,
    overflow: 'hidden',
  },
  categoryBlur: {
    padding: 15,
  },
  categoryHeader: {
    flexDirection: 'row',
    alignItems: 'center',
    marginBottom: 15,
  },
  categoryTitle: {
    color: 'white',
    fontSize: 14,
    fontWeight: 'bold',
    marginLeft: 8,
    flex: 1,
  },
  categoryStats: {
    flexDirection: 'row',
    justifyContent: 'space-between',
  },
  statItem: {
    alignItems: 'center',
    flex: 1,
  },
  statValue: {
    color: 'white',
    fontSize: 16,
    fontWeight: 'bold',
  },
  statLabel: {
    color: '#9CA3AF',
    fontSize: 10,
    marginTop: 2,
  },
});
