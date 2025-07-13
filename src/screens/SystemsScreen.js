import React, { useState, useEffect } from 'react';
import {
  View,
  Text,
  StyleSheet,
  ScrollView,
  SafeAreaView,
  TouchableOpacity,
  FlatList,
  TextInput,
} from 'react-native';
import { LinearGradient } from 'expo-linear-gradient';
import { Ionicons } from '@expo/vector-icons';
import { BlurView } from 'expo-blur';

import { 
  telemetryCategories, 
  generateMockTelemetryData, 
  getSignalDisplayValue,
  getSignalStatus
} from '../data/telemetryData';

// Signal Item Component
const SignalItem = ({ signalName, value, signal, category, searchQuery }) => {
  const displayValue = getSignalDisplayValue(signalName, value, category);
  const status = getSignalStatus(signalName, value, category);
  
  const getStatusColor = () => {
    switch (status) {
      case 'critical': return '#EF4444';
      case 'warning': return '#FF9F43';
      default: return '#10B981';
    }
  };
  
  const getStatusIcon = () => {
    switch (status) {
      case 'critical': return 'warning';
      case 'warning': return 'alert-circle';
      default: return 'checkmark-circle';
    }
  };
  
  // Function to highlight search terms
  const highlightSearchTerm = (text, searchTerm) => {
    if (!searchTerm) return text;
    const regex = new RegExp(`(${searchTerm})`, 'gi');
    const parts = text.split(regex);
    return parts.map((part, index) => {
      if (part.toLowerCase() === searchTerm.toLowerCase()) {
        return (
          <Text key={index} style={styles.highlightedText}>
            {part}
          </Text>
        );
      }
      return part;
    });
  };
  
  return (
    <View style={styles.signalItem}>
      <BlurView intensity={10} style={styles.signalBlur}>
        <View style={styles.signalHeader}>
          <View style={styles.signalInfo}>
            <Text style={styles.signalName}>
              {highlightSearchTerm(signal.description, searchQuery)}
            </Text>
            <Text style={styles.signalId}>
              {highlightSearchTerm(signalName, searchQuery)}
            </Text>
          </View>
          <View style={styles.signalStatus}>
            <Ionicons 
              name={getStatusIcon()} 
              size={20} 
              color={getStatusColor()} 
            />
          </View>
        </View>
        <View style={styles.signalValue}>
          <Text style={[styles.valueText, { color: getStatusColor() }]}>
            {displayValue}
          </Text>
          {signal.range && (
            <Text style={styles.rangeText}>
              Range: {signal.range[0]} - {signal.range[1]} {signal.unit}
            </Text>
          )}
        </View>
      </BlurView>
    </View>
  );
};

// Category Header Component
const CategoryHeader = ({ category, signalCount, healthScore, totalSignals, isFiltered }) => {
  const categoryData = telemetryCategories[category];
  
  return (
    <View style={styles.categoryHeader}>
      <BlurView intensity={20} style={styles.categoryHeaderBlur}>
        <View style={styles.categoryInfo}>
          <View style={styles.categoryTitle}>
            <Ionicons name={categoryData.icon} size={28} color={categoryData.color} />
            <Text style={styles.categoryName}>{category}</Text>
          </View>
          <View style={styles.categoryStats}>
            <View style={styles.statItem}>
              <Text style={styles.statValue}>{healthScore}%</Text>
              <Text style={styles.statLabel}>Health</Text>
            </View>
            <View style={styles.statItem}>
              <Text style={styles.statValue}>
                {isFiltered ? `${signalCount}/${totalSignals}` : signalCount}
              </Text>
              <Text style={styles.statLabel}>
                {isFiltered ? 'Found' : 'Signals'}
              </Text>
            </View>
          </View>
        </View>
      </BlurView>
    </View>
  );
};

// Main SystemsScreen Component
export default function SystemsScreen() {
  const [telemetryData, setTelemetryData] = useState(null);
  const [selectedCategory, setSelectedCategory] = useState('Motor & Drive');
  const [lastUpdate, setLastUpdate] = useState(new Date());
  const [searchQuery, setSearchQuery] = useState('');
  
  useEffect(() => {
    const updateTelemetry = () => {
      const newData = generateMockTelemetryData();
      setTelemetryData(newData);
      setLastUpdate(new Date());
    };
    
    updateTelemetry();
    const interval = setInterval(updateTelemetry, 3000);
    
    return () => clearInterval(interval);
  }, []);
  
  if (!telemetryData) {
    return (
      <SafeAreaView style={styles.container}>
        <LinearGradient colors={['#000000', '#1a1a1a', '#000000']} style={styles.gradient}>
          <View style={styles.loadingContainer}>
            <Ionicons name="sync" size={48} color="#C9302C" />
            <Text style={styles.loadingText}>Loading Systems Data...</Text>
          </View>
        </LinearGradient>
      </SafeAreaView>
    );
  }
  
  const categories = Object.keys(telemetryCategories);
  const selectedCategoryData = telemetryCategories[selectedCategory];
  const signals = selectedCategoryData.signals;
  
  // Calculate health score
  const signalNames = Object.keys(signals);
  const criticalCount = signalNames.filter(name => {
    const value = telemetryData[name];
    return value !== undefined && getSignalStatus(name, value, selectedCategory) === 'critical';
  }).length;
  
  const warningCount = signalNames.filter(name => {
    const value = telemetryData[name];
    return value !== undefined && getSignalStatus(name, value, selectedCategory) === 'warning';
  }).length;
  
  const healthScore = ((signalNames.length - criticalCount - warningCount) / signalNames.length * 100).toFixed(0);
  
  // Filter signals based on search query
  const filteredSignals = signalNames.filter(signalName => {
    const signal = signals[signalName];
    const searchTerm = searchQuery.toLowerCase();
    return (
      signalName.toLowerCase().includes(searchTerm) ||
      signal.description.toLowerCase().includes(searchTerm) ||
      signal.unit?.toLowerCase().includes(searchTerm)
    );
  });
  
  const clearSearch = () => {
    setSearchQuery('');
  };
  
  // Handle category change - clear search when switching categories
  const handleCategoryChange = (category) => {
    setSelectedCategory(category);
    setSearchQuery('');
  };
  
  return (
    <SafeAreaView style={styles.container}>
      <LinearGradient colors={['#000000', '#1a1a1a', '#000000']} style={styles.gradient}>
        
        {/* Header */}
        <View style={styles.header}>
          <View style={styles.titleContainer}>
            <Text style={styles.title}>System Telemetry</Text>
            {searchQuery.length > 0 && (
              <Ionicons name="search" size={20} color="#C9302C" style={styles.searchIcon} />
            )}
          </View>
          <Text style={styles.subtitle}>Last Update: {lastUpdate.toLocaleTimeString()}</Text>
        </View>
        
        {/* Search Bar */}
        <View style={styles.searchContainer}>
          <BlurView intensity={10} style={styles.searchBlur}>
            <View style={styles.searchBar}>
              <Ionicons name="search" size={20} color="#9CA3AF" />
              <TextInput
                style={styles.searchInput}
                placeholder="Search signals..."
                placeholderTextColor="#9CA3AF"
                value={searchQuery}
                onChangeText={setSearchQuery}
              />
              {searchQuery.length > 0 && (
                <TouchableOpacity onPress={clearSearch}>
                  <Ionicons name="close" size={20} color="#9CA3AF" />
                </TouchableOpacity>
              )}
            </View>
          </BlurView>
        </View>
        
        {/* Category Selector */}
        <View style={styles.categorySelector}>
          <ScrollView horizontal showsHorizontalScrollIndicator={false}>
            {categories.map((category) => (
              <TouchableOpacity
                key={category}
                style={[
                  styles.categoryButton,
                  selectedCategory === category && styles.selectedCategoryButton
                ]}
                onPress={() => handleCategoryChange(category)}
              >
                <Ionicons 
                  name={telemetryCategories[category].icon} 
                  size={20} 
                  color={selectedCategory === category ? '#000' : telemetryCategories[category].color} 
                />
                <Text style={[
                  styles.categoryButtonText,
                  selectedCategory === category && styles.selectedCategoryButtonText
                ]}>
                  {category}
                </Text>
              </TouchableOpacity>
            ))}
          </ScrollView>
        </View>
        
        {/* Selected Category Details */}
        <CategoryHeader 
          category={selectedCategory} 
          signalCount={filteredSignals.length}
          healthScore={healthScore}
          totalSignals={signalNames.length}
          isFiltered={searchQuery.length > 0}
        />
        
        {/* Signals List */}
        <FlatList
          data={filteredSignals}
          renderItem={({ item }) => (
            <SignalItem
              signalName={item}
              value={telemetryData[item]}
              signal={signals[item]}
              category={selectedCategory}
              searchQuery={searchQuery}
            />
          )}
          keyExtractor={(item) => item}
          contentContainerStyle={styles.signalsList}
          showsVerticalScrollIndicator={false}
          ListEmptyComponent={
            searchQuery.length > 0 ? (
              <View style={styles.noResultsContainer}>
                <Ionicons name="search" size={48} color="#9CA3AF" />
                <Text style={styles.noResultsText}>No signals found</Text>
                <Text style={styles.noResultsSubtext}>
                  Try adjusting your search query
                </Text>
              </View>
            ) : null
          }
        />
        
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
    paddingHorizontal: 20,
    paddingTop: 20,
    marginBottom: 20,
  },
  titleContainer: {
    flexDirection: 'row',
    alignItems: 'center',
    marginBottom: 5,
  },
  title: {
    color: 'white',
    fontSize: 24,
    fontWeight: 'bold',
  },
  searchIcon: {
    marginLeft: 10,
  },
  subtitle: {
    color: '#9CA3AF',
    fontSize: 14,
  },
  searchContainer: {
    paddingHorizontal: 20,
    marginBottom: 20,
  },
  searchBlur: {
    borderRadius: 12,
    overflow: 'hidden',
  },
  searchBar: {
    flexDirection: 'row',
    alignItems: 'center',
    padding: 12,
    paddingHorizontal: 16,
  },
  searchInput: {
    flex: 1,
    color: 'white',
    fontSize: 16,
    marginLeft: 10,
  },
  categorySelector: {
    marginBottom: 20,
  },
  categoryButton: {
    flexDirection: 'row',
    alignItems: 'center',
    paddingHorizontal: 15,
    paddingVertical: 8,
    borderRadius: 20,
    marginHorizontal: 5,
    backgroundColor: '#1a1a1a',
    borderWidth: 1,
    borderColor: '#333',
    marginLeft: 20,
  },
  selectedCategoryButton: {
    backgroundColor: '#C9302C',
    borderColor: '#C9302C',
  },
  categoryButtonText: {
    color: 'white',
    fontSize: 12,
    marginLeft: 5,
    fontWeight: '500',
  },
  selectedCategoryButtonText: {
    color: '#000',
  },
  categoryHeader: {
    paddingHorizontal: 20,
    marginBottom: 20,
  },
  categoryHeaderBlur: {
    padding: 20,
    borderRadius: 15,
  },
  categoryInfo: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
  },
  categoryTitle: {
    flexDirection: 'row',
    alignItems: 'center',
    flex: 1,
  },
  categoryName: {
    color: 'white',
    fontSize: 18,
    fontWeight: 'bold',
    marginLeft: 10,
  },
  categoryStats: {
    flexDirection: 'row',
  },
  statItem: {
    alignItems: 'center',
    marginLeft: 20,
  },
  statValue: {
    color: 'white',
    fontSize: 18,
    fontWeight: 'bold',
  },
  statLabel: {
    color: '#9CA3AF',
    fontSize: 12,
  },
  signalsList: {
    paddingHorizontal: 20,
    paddingBottom: 20,
  },
  signalItem: {
    marginBottom: 12,
  },
  signalBlur: {
    padding: 15,
    borderRadius: 12,
  },
  signalHeader: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'flex-start',
    marginBottom: 10,
  },
  signalInfo: {
    flex: 1,
  },
  signalName: {
    color: 'white',
    fontSize: 16,
    fontWeight: 'bold',
    marginBottom: 2,
  },
  highlightedText: {
    backgroundColor: '#C9302C',
    color: 'white',
    fontWeight: 'bold',
  },
  signalId: {
    color: '#9CA3AF',
    fontSize: 12,
  },
  signalStatus: {
    marginLeft: 10,
  },
  signalValue: {
    alignItems: 'flex-start',
  },
  valueText: {
    fontSize: 18,
    fontWeight: 'bold',
    marginBottom: 5,
  },
  rangeText: {
    color: '#9CA3AF',
    fontSize: 12,
  },
  noResultsContainer: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
    paddingTop: 60,
  },
  noResultsText: {
    color: 'white',
    fontSize: 18,
    fontWeight: 'bold',
    marginTop: 16,
  },
  noResultsSubtext: {
    color: '#9CA3AF',
    fontSize: 14,
    marginTop: 4,
  },
});
