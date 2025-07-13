import React, { useState } from 'react';
import {
  View,
  Text,
  StyleSheet,
  ScrollView,
  TouchableOpacity,
  Image,
  Switch,
  Alert,
} from 'react-native';
import { LinearGradient } from 'expo-linear-gradient';
import { MaterialIcons, Ionicons } from '@expo/vector-icons';

const ProfileScreen = () => {
  const [darkMode, setDarkMode] = useState(true);
  const [notifications, setNotifications] = useState(true);
  const [autoLock, setAutoLock] = useState(true);
  const [biometricAuth, setBiometricAuth] = useState(false);

  const profileData = {
    name: 'John Pork',
    email: 'john.pork@email.com',
    phone: '+1 (555) 123-4567',
    memberSince: '2023',
    totalMiles: '15,248',
    co2Saved: '2,847 lbs',
    profileImage: null, // Would be actual image URI
  };

  const menuItems = [
    {
      id: 'account',
      title: 'Account Settings',
      icon: 'person-outline',
      onPress: () => Alert.alert('Account Settings', 'Account settings would open here'),
    },
    {
      id: 'vehicle',
      title: 'Vehicle Settings',
      icon: 'car-outline',
      onPress: () => Alert.alert('Vehicle Settings', 'Vehicle settings would open here'),
    },
    {
      id: 'charging',
      title: 'Charging Preferences',
      icon: 'battery-charging-outline',
      onPress: () => Alert.alert('Charging Preferences', 'Charging preferences would open here'),
    },
    {
      id: 'security',
      title: 'Security & Privacy',
      icon: 'shield-outline',
      onPress: () => Alert.alert('Security & Privacy', 'Security settings would open here'),
    },
    {
      id: 'support',
      title: 'Help & Support',
      icon: 'help-circle-outline',
      onPress: () => Alert.alert('Help & Support', 'Support center would open here'),
    },
    {
      id: 'about',
      title: 'About Tesla',
      icon: 'information-circle-outline',
      onPress: () => Alert.alert('About Tesla', 'About Tesla information would open here'),
    },
  ];

  const renderProfileHeader = () => (
    <LinearGradient
      colors={['#1a1a1a', '#2d2d2d']}
      style={styles.profileHeader}
    >
      <View style={styles.profileImageContainer}>
        {profileData.profileImage ? (
          <Image source={{ uri: profileData.profileImage }} style={styles.profileImage} />
        ) : (
          <View style={styles.profileImagePlaceholder}>
            <MaterialIcons name="person" size={60} color="#666" />
          </View>
        )}
        <TouchableOpacity style={styles.editImageButton}>
          <MaterialIcons name="camera-alt" size={20} color="#fff" />
        </TouchableOpacity>
      </View>
      
      <Text style={styles.profileName}>{profileData.name}</Text>
      <Text style={styles.profileEmail}>{profileData.email}</Text>
      <Text style={styles.memberSince}>Tesla Owner since {profileData.memberSince}</Text>
      
      <View style={styles.statsContainer}>
        <View style={styles.statItem}>
          <Text style={styles.statValue}>{profileData.totalMiles}</Text>
          <Text style={styles.statLabel}>Total Miles</Text>
        </View>
        <View style={styles.statDivider} />
        <View style={styles.statItem}>
          <Text style={styles.statValue}>{profileData.co2Saved}</Text>
          <Text style={styles.statLabel}>CO₂ Saved</Text>
        </View>
      </View>
    </LinearGradient>
  );

  const renderSettingsSection = (title, items) => (
    <View style={styles.section}>
      <Text style={styles.sectionTitle}>{title}</Text>
      {items.map((item, index) => (
        <TouchableOpacity
          key={item.id}
          style={[
            styles.menuItem,
            index === items.length - 1 && styles.lastMenuItem
          ]}
          onPress={item.onPress}
        >
          <View style={styles.menuItemLeft}>
            <Ionicons name={item.icon} size={24} color="#fff" />
            <Text style={styles.menuItemText}>{item.title}</Text>
          </View>
          <MaterialIcons name="chevron-right" size={24} color="#666" />
        </TouchableOpacity>
      ))}
    </View>
  );

  const renderPreferencesSection = () => (
    <View style={styles.section}>
      <Text style={styles.sectionTitle}>Preferences</Text>
      
      <View style={styles.preferenceItem}>
        <View style={styles.menuItemLeft}>
          <Ionicons name="moon-outline" size={24} color="#fff" />
          <Text style={styles.menuItemText}>Dark Mode</Text>
        </View>
        <Switch
          value={darkMode}
          onValueChange={setDarkMode}
          trackColor={{ false: '#3e3e3e', true: '#007AFF' }}
          thumbColor={darkMode ? '#fff' : '#f4f3f4'}
        />
      </View>
      
      <View style={styles.preferenceItem}>
        <View style={styles.menuItemLeft}>
          <Ionicons name="notifications-outline" size={24} color="#fff" />
          <Text style={styles.menuItemText}>Push Notifications</Text>
        </View>
        <Switch
          value={notifications}
          onValueChange={setNotifications}
          trackColor={{ false: '#3e3e3e', true: '#007AFF' }}
          thumbColor={notifications ? '#fff' : '#f4f3f4'}
        />
      </View>
      
      <View style={styles.preferenceItem}>
        <View style={styles.menuItemLeft}>
          <Ionicons name="lock-closed-outline" size={24} color="#fff" />
          <Text style={styles.menuItemText}>Auto Lock</Text>
        </View>
        <Switch
          value={autoLock}
          onValueChange={setAutoLock}
          trackColor={{ false: '#3e3e3e', true: '#007AFF' }}
          thumbColor={autoLock ? '#fff' : '#f4f3f4'}
        />
      </View>
      
      <View style={[styles.preferenceItem, styles.lastMenuItem]}>
        <View style={styles.menuItemLeft}>
          <Ionicons name="finger-print-outline" size={24} color="#fff" />
          <Text style={styles.menuItemText}>Biometric Authentication</Text>
        </View>
        <Switch
          value={biometricAuth}
          onValueChange={setBiometricAuth}
          trackColor={{ false: '#3e3e3e', true: '#007AFF' }}
          thumbColor={biometricAuth ? '#fff' : '#f4f3f4'}
        />
      </View>
    </View>
  );

  const renderSignOutButton = () => (
    <TouchableOpacity
      style={styles.signOutButton}
      onPress={() => Alert.alert('Sign Out', 'Are you sure you want to sign out?', [
        { text: 'Cancel', style: 'cancel' },
        { text: 'Sign Out', style: 'destructive', onPress: () => {} },
      ])}
    >
      <Text style={styles.signOutText}>Sign Out</Text>
    </TouchableOpacity>
  );

  return (
    <View style={styles.container}>
      <ScrollView style={styles.scrollView} showsVerticalScrollIndicator={false}>
        {renderProfileHeader()}
        
        {renderSettingsSection('Account', menuItems.slice(0, 2))}
        {renderSettingsSection('Vehicle', menuItems.slice(2, 4))}
        {renderSettingsSection('Support', menuItems.slice(4, 6))}
        {renderPreferencesSection()}
        
        <View style={styles.appVersion}>
          <Text style={styles.appVersionText}>Tesla Mobile App v4.28.0</Text>
        </View>
        
        {renderSignOutButton()}
      </ScrollView>
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#000',
  },
  scrollView: {
    flex: 1,
  },
  profileHeader: {
    alignItems: 'center',
    paddingVertical: 30,
    paddingTop: 60, // Increased top padding to avoid iPhone 13 notch
    paddingHorizontal: 20,
    marginBottom: 20,
  },
  profileImageContainer: {
    position: 'relative',
    marginBottom: 15,
  },
  profileImage: {
    width: 100,
    height: 100,
    borderRadius: 50,
  },
  profileImagePlaceholder: {
    width: 100,
    height: 100,
    borderRadius: 50,
    backgroundColor: '#2d2d2d',
    justifyContent: 'center',
    alignItems: 'center',
    borderWidth: 2,
    borderColor: '#444',
  },
  editImageButton: {
    position: 'absolute',
    bottom: 0,
    right: 0,
    backgroundColor: '#007AFF',
    borderRadius: 15,
    width: 30,
    height: 30,
    justifyContent: 'center',
    alignItems: 'center',
    borderWidth: 2,
    borderColor: '#000',
  },
  profileName: {
    fontSize: 24,
    fontWeight: 'bold',
    color: '#fff',
    marginBottom: 5,
  },
  profileEmail: {
    fontSize: 16,
    color: '#999',
    marginBottom: 5,
  },
  memberSince: {
    fontSize: 14,
    color: '#666',
    marginBottom: 20,
  },
  statsContainer: {
    flexDirection: 'row',
    alignItems: 'center',
    backgroundColor: 'rgba(255, 255, 255, 0.1)',
    paddingVertical: 15,
    paddingHorizontal: 20,
    borderRadius: 15,
    marginTop: 10,
  },
  statItem: {
    alignItems: 'center',
    flex: 1,
  },
  statValue: {
    fontSize: 20,
    fontWeight: 'bold',
    color: '#fff',
    marginBottom: 5,
  },
  statLabel: {
    fontSize: 12,
    color: '#999',
    textAlign: 'center',
  },
  statDivider: {
    width: 1,
    height: 30,
    backgroundColor: '#444',
    marginHorizontal: 20,
  },
  section: {
    marginBottom: 20,
    paddingHorizontal: 20,
  },
  sectionTitle: {
    fontSize: 18,
    fontWeight: '600',
    color: '#fff',
    marginBottom: 15,
  },
  menuItem: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
    backgroundColor: '#1a1a1a',
    paddingVertical: 15,
    paddingHorizontal: 20,
    borderBottomWidth: 1,
    borderBottomColor: '#2d2d2d',
  },
  lastMenuItem: {
    borderBottomWidth: 0,
    borderBottomLeftRadius: 15,
    borderBottomRightRadius: 15,
  },
  menuItemLeft: {
    flexDirection: 'row',
    alignItems: 'center',
  },
  menuItemText: {
    fontSize: 16,
    color: '#fff',
    marginLeft: 15,
  },
  preferenceItem: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
    backgroundColor: '#1a1a1a',
    paddingVertical: 15,
    paddingHorizontal: 20,
    borderBottomWidth: 1,
    borderBottomColor: '#2d2d2d',
  },
  appVersion: {
    alignItems: 'center',
    paddingVertical: 20,
  },
  appVersionText: {
    fontSize: 12,
    color: '#666',
  },
  signOutButton: {
    backgroundColor: '#ff3b30',
    marginHorizontal: 20,
    paddingVertical: 15,
    borderRadius: 15,
    alignItems: 'center',
    marginBottom: 30,
  },
  signOutText: {
    fontSize: 16,
    fontWeight: '600',
    color: '#fff',
  },
});

export default ProfileScreen;
