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

import Battery3DViewer from '../components/Battery3DViewer';

const { width, height } = Dimensions.get('window');

// Battery Status Card Component
const BatteryStatusCard = ({ title, value, unit, status, icon, color }) => {
  const getStatusColor = () => {
    switch (status) {
      case 'critical': return '#EF4444';
      case 'warning': return '#FF9F43';
      default: return color || '#10B981';
    }
  };
  
  return (
    <View style={styles.statusCard}>
      <View style={styles.statusCardContent}>
        <BlurView intensity={20} style={styles.statusCardBlur}>
          <View style={styles.statusCardHeader}>
            <Ionicons name={icon} size={24} color={getStatusColor()} />
            <Text style={styles.statusCardTitle}>{title}</Text>
          </View>
          <View style={styles.statusCardValue}>
            <Text style={[styles.valueText, { color: getStatusColor() }]}>
              {value}{unit}
            </Text>
            <View style={styles.statusIndicator}>
              <Ionicons 
                name={status === 'critical' ? 'warning' : status === 'warning' ? 'alert-circle' : 'checkmark-circle'} 
                size={16} 
                color={getStatusColor()} 
              />
            </View>
          </View>
        </BlurView>
      </View>
    </View>
  );
};

// Battery Cell Group Component
const BatteryCellGroup = ({ cells, telemetryData }) => {
  const cellGroups = [];
  
  // Group cells into rows of 4
  for (let i = 1; i <= 31; i++) {
    const cellValue = telemetryData[`cell_group${i}_voltage`];
    if (cellValue !== undefined) {
      cellGroups.push({
        id: i,
        voltage: cellValue,
        status: getSignalStatus(`cell_group${i}_voltage`, cellValue, 'Battery System')
      });
    }
  }
  
  return (
    <View style={styles.cellGroupContainer}>
      <Text style={styles.cellGroupTitle}>Cell Group Voltages</Text>
      <View style={styles.cellGrid}>
        {cellGroups.map((cell) => (
          <View key={cell.id} style={styles.cellItem}>
            <Text style={styles.cellId}>{cell.id}</Text>
            <Text style={[
              styles.cellVoltage,
              { color: cell.status === 'critical' ? '#EF4444' : cell.status === 'warning' ? '#FF9F43' : '#10B981' }
            ]}>
              {cell.voltage}V
            </Text>
          </View>
        ))}
      </View>
    </View>
  );
};

// BPS Fault Alert Component
const BPSFaultAlert = ({ telemetryData }) => {
  const [isExpanded, setIsExpanded] = useState(false);
  const faults = [];
  
  // Check for BPS faults
  const bpsFaultFields = [
    'bps_fault', 'voltage_failsafe', 'current_failsafe', 'relay_failsafe',
    'charge_interlock_failsafe', 'input_power_supply_failsafe',
    'discharge_limit_enforcement_fault', 'charger_safety_relay_fault',
    'internal_hardware_fault', 'internal_software_fault',
    'highest_cell_voltage_too_high_fault', 'lowest_cell_voltage_too_low_fault',
    'pack_too_hot_fault', 'high_voltage_interlock_signal_fault'
  ];
  
  bpsFaultFields.forEach(field => {
    if (telemetryData[field] === true) {
      faults.push({
        name: field,
        description: field.replace(/_/g, ' ').replace(/\b\w/g, l => l.toUpperCase())
      });
    }
  });
  
  const hasActiveFaults = faults.length > 0;
  
  return (
    <View style={styles.faultContainer}>
      <BlurView intensity={20} style={styles.faultBlur}>
        <TouchableOpacity 
          style={styles.faultHeader}
          onPress={() => setIsExpanded(!isExpanded)}
          activeOpacity={0.8}
        >
          <Ionicons 
            name={hasActiveFaults ? "warning" : "shield-checkmark"} 
            size={24} 
            color={hasActiveFaults ? "#EF4444" : "#10B981"} 
          />
          <Text style={[styles.faultTitle, { color: hasActiveFaults ? "#EF4444" : "#10B981" }]}>
            BPS Status: {hasActiveFaults ? `${faults.length} Fault${faults.length > 1 ? 's' : ''} Detected` : 'Normal'}
          </Text>
          <Ionicons 
            name={isExpanded ? "chevron-up" : "chevron-down"} 
            size={20} 
            color="#9CA3AF" 
          />
        </TouchableOpacity>
        
        {isExpanded && (
          <View style={styles.faultContent}>
            {hasActiveFaults ? (
              faults.map((fault, index) => (
                <View key={index} style={styles.faultItem}>
                  <Ionicons name="alert-circle" size={16} color="#EF4444" />
                  <Text style={styles.faultName}>{fault.description}</Text>
                </View>
              ))
            ) : (
              <Text style={styles.faultMessage}>All battery protection systems are functioning normally.</Text>
            )}
          </View>
        )}
      </BlurView>
    </View>
  );
};

// Main Battery Screen Component
export default function BatteryScreen() {
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
            <Ionicons name="battery-charging" size={48} color="#C9302C" />
            <Text style={styles.loadingText}>Loading Battery Data...</Text>
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
            <Text style={styles.title}>Battery System</Text>
            <Text style={styles.subtitle}>Last Update: {lastUpdate.toLocaleTimeString()}</Text>
          </View>
          
          {/* Main Battery Status - SOC Display */}
          <View style={styles.mainBatteryContainer}>
            <View style={styles.batteryIcon}>
              <Ionicons 
                name="battery-charging" 
                size={80} 
                color={telemetryData.soc > 20 ? '#C9302C' : '#EF4444'} 
              />
            </View>
            <View style={styles.batteryMainInfo}>
              <Text style={styles.socValue}>{telemetryData.soc}%</Text>
              <Text style={styles.socLabel}>State of Charge</Text>
              <Text style={styles.batteryVoltage}>{telemetryData.pack_voltage}V</Text>
            </View>
          </View>
          
          {/* 3D Battery Model */}
          <View style={styles.batteryModelSection}>
            <Battery3DViewer telemetryData={telemetryData} />
          </View>
          
          {/* BPS Fault Status */}
          <BPSFaultAlert telemetryData={telemetryData} />
          
          {/* Battery Status Cards */}
          <View style={styles.statusCardsContainer}>
            <View style={styles.statusCardsRow}>
              <BatteryStatusCard
                title="Current"
                value={telemetryData.pack_current}
                unit="A"
                status={getSignalStatus('pack_current', telemetryData.pack_current, 'Battery System')}
                icon="flash"
                color="#C9302C"
              />
              <BatteryStatusCard
                title="Power"
                value={telemetryData.pack_power}
                unit="W"
                status={getSignalStatus('pack_power', telemetryData.pack_power, 'Battery System')}
                icon="speedometer"
                color="#FF6B6B"
              />
            </View>
            <View style={styles.statusCardsRow}>
              <BatteryStatusCard
                title="Temperature"
                value={telemetryData.pack_temp}
                unit="°C"
                status={getSignalStatus('pack_temp', telemetryData.pack_temp, 'Battery System')}
                icon="thermometer"
                color="#FF9F43"
              />
              <BatteryStatusCard
                title="Health"
                value={telemetryData.soh}
                unit="%"
                status={getSignalStatus('soh', telemetryData.soh, 'Battery System')}
                icon="heart"
                color="#10B981"
              />
            </View>
          </View>
          
          {/* Additional Battery Info */}
          <View style={styles.additionalInfoContainer}>
            <BlurView intensity={20} style={styles.additionalInfoBlur}>
              <Text style={styles.additionalInfoTitle}>Battery Details</Text>
              <View style={styles.infoGrid}>
                <View style={styles.infoItem}>
                  <Text style={styles.infoLabel}>Fan Speed</Text>
                  <Text style={styles.infoValue}>{telemetryData.fan_speed}</Text>
                </View>
                <View style={styles.infoItem}>
                  <Text style={styles.infoLabel}>Capacity</Text>
                  <Text style={styles.infoValue}>{telemetryData.pack_amphours}Ah</Text>
                </View>
                <View style={styles.infoItem}>
                  <Text style={styles.infoLabel}>Resistance</Text>
                  <Text style={styles.infoValue}>{telemetryData.pack_resistance}mΩ</Text>
                </View>
                <View style={styles.infoItem}>
                  <Text style={styles.infoLabel}>Balancing</Text>
                  <Text style={styles.infoValue}>{telemetryData.cell_balancing_active ? 'Active' : 'Inactive'}</Text>
                </View>
              </View>
            </BlurView>
          </View>
          
          {/* Cell Group Voltages */}
          <BatteryCellGroup telemetryData={telemetryData} />
          
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
    color: '#4ECDC4',
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
    fontSize: 14,
  },
  batteryModelSection: {
    height: 300,
    marginBottom: 20,
    borderRadius: 20,
    overflow: 'hidden',
    backgroundColor: '#1a1a1a',
  },
  mainBatteryContainer: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'center',
    marginBottom: 30,
    paddingVertical: 20,
  },
  batteryIcon: {
    marginRight: 20,
  },
  batteryMainInfo: {
    alignItems: 'center',
  },
  socValue: {
    color: 'white',
    fontSize: 48,
    fontWeight: 'bold',
  },
  socLabel: {
    color: '#9CA3AF',
    fontSize: 16,
    marginBottom: 5,
  },
  batteryVoltage: {
    color: '#C9302C',
    fontSize: 18,
    fontWeight: 'bold',
  },
  statusCardsContainer: {
    marginBottom: 20,
  },
  statusCardsRow: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    marginBottom: 15,
  },
  statusCard: {
    flex: 1,
    marginHorizontal: 5,
  },
  statusCardContent: {
    borderRadius: 15,
    overflow: 'hidden',
  },
  statusCardBlur: {
    padding: 15,
  },
  statusCardHeader: {
    flexDirection: 'row',
    alignItems: 'center',
    marginBottom: 10,
  },
  statusCardTitle: {
    color: 'white',
    fontSize: 14,
    fontWeight: 'bold',
    marginLeft: 8,
  },
  statusCardValue: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
  },
  valueText: {
    fontSize: 18,
    fontWeight: 'bold',
  },
  statusIndicator: {
    marginLeft: 10,
  },
  faultContainer: {
    marginBottom: 20,
  },
  faultBlur: {
    borderRadius: 15,
    overflow: 'hidden',
  },
  faultHeader: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
    padding: 15,
  },
  faultTitle: {
    fontSize: 16,
    fontWeight: 'bold',
    flex: 1,
    marginLeft: 8,
  },
  faultContent: {
    paddingHorizontal: 15,
    paddingBottom: 15,
  },
  faultMessage: {
    color: '#9CA3AF',
    fontSize: 14,
    lineHeight: 20,
  },
  faultItem: {
    flexDirection: 'row',
    alignItems: 'center',
    marginBottom: 8,
  },
  faultName: {
    color: '#EF4444',
    fontSize: 14,
    fontWeight: '500',
    marginLeft: 8,
    flex: 1,
  },
  additionalInfoContainer: {
    marginBottom: 20,
  },
  additionalInfoBlur: {
    padding: 15,
    borderRadius: 15,
  },
  additionalInfoTitle: {
    color: 'white',
    fontSize: 18,
    fontWeight: 'bold',
    marginBottom: 15,
  },
  infoGrid: {
    flexDirection: 'row',
    flexWrap: 'wrap',
    justifyContent: 'space-between',
  },
  infoItem: {
    width: '48%',
    marginBottom: 10,
  },
  infoLabel: {
    color: '#9CA3AF',
    fontSize: 12,
    marginBottom: 5,
  },
  infoValue: {
    color: 'white',
    fontSize: 16,
    fontWeight: 'bold',
  },
  cellGroupContainer: {
    marginBottom: 20,
  },
  cellGroupTitle: {
    color: 'white',
    fontSize: 18,
    fontWeight: 'bold',
    marginBottom: 15,
  },
  cellGrid: {
    flexDirection: 'row',
    flexWrap: 'wrap',
    justifyContent: 'space-between',
  },
  cellItem: {
    width: '23%',
    backgroundColor: '#1a1a1a',
    borderRadius: 8,
    padding: 10,
    marginBottom: 10,
    alignItems: 'center',
  },
  cellId: {
    color: '#9CA3AF',
    fontSize: 12,
    marginBottom: 5,
  },
  cellVoltage: {
    fontSize: 14,
    fontWeight: 'bold',
  },
});
