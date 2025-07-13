# BSR Solar Car Mobile App - Copilot Instructions

## Project Overview
This is a Solar Car Mobile app frontend built with React Native, Expo (SDK 53), and Expo Go. The app is designed to visualize and monitor live telemetry data from the BSR solar car's subsystems, providing real-time status monitoring and system diagnostics. The app targets iOS devices and is designed to run in Expo Go for development and testing.

## Key Technologies & Libraries
- **React Native**: Core mobile framework
- **Expo SDK 53**: Development platform and tools
- **React Navigation**: Tab-based navigation system
- **Expo Linear Gradient**: UI gradient effects
- **Expo Vector Icons**: Material Icons and Ionicons
- **React Native Reanimated**: Smooth animations
- **Expo Blur**: Glass-morphism effects

## Project Structure
```
src/
├── screens/           # Main app screens
│   ├── HomeScreen.js     # Dashboard with telemetry overview
│   ├── SystemsScreen.js  # Detailed system telemetry
│   ├── ChargingScreen.js # Battery and charging status
│   ├── ClimateScreen.js  # Solar array monitoring
│   └── ProfileScreen.js  # Settings and configuration
├── data/             # Data structures and mock data
│   └── telemetryData.js  # Telemetry categories and mock data
├── components/        # Reusable UI components (future)
└── utils/            # Utility functions (future)
```

## Core Features Implemented

### 1. Dashboard Screen (HomeScreen.js)
- **Solar Car Model**: Animated car visualization with status indicators
- **Critical Alerts**: Real-time safety and system alerts
- **Key Metrics**: Battery SOC, speed, solar power, temperature
- **Category Overview**: System health scores and signal counts
- **Real-time Updates**: Live telemetry data simulation

### 2. Systems Screen (SystemsScreen.js)
- **Category Navigation**: Horizontal scrollable category selector
- **Detailed Signals**: Individual signal monitoring with status
- **Health Scoring**: Real-time system health calculations
- **Signal Status**: Critical, warning, and normal status indicators
- **Live Updates**: Continuous telemetry data refresh

### 3. Battery Screen (ChargingScreen.js)
- **Battery Status**: State of charge and health monitoring
- **Charging Information**: Current, voltage, and power data
- **Temperature Monitoring**: Battery pack temperature tracking
- **Safety Systems**: BPS fault detection and alerts

### 4. Solar Array Screen (ClimateScreen.js)
- **MPPT Monitoring**: Maximum Power Point Tracking status
- **Solar Strings**: Individual string voltage and current
- **Power Generation**: Real-time solar power output
- **Array Temperature**: Solar panel temperature monitoring

### 5. Settings Screen (ProfileScreen.js)
- **Configuration**: App settings and preferences
- **Telemetry Settings**: Data refresh rates and alert thresholds
- **System Information**: App version and device details
- **Connection Status**: Vehicle communication status

## Telemetry Data Structure

### Categories
- **Motor & Drive**: Motor current, power, temperature, speed control
- **Battery System**: SOC, SOH, voltage, current, temperature
- **Solar Array**: MPPT output, string voltages/currents, temperatures
- **High Voltage**: Discharge/charge enabled, isolation, contactors
- **Safety Systems**: E-stops, crash detection, BPS faults
- **Power Systems**: Bus voltages (5V, 12V, 24V), DC-DC converter
- **Environmental**: Air, brake, road, and system temperatures
- **Vehicle Controls**: MCC state, cruise control, lighting
- **Navigation**: GPS coordinates and elevation
- **System Status**: CAN heartbeats, telemetry status

### Signal Types
- **Analog**: Voltage, current, temperature, speed (with ranges)
- **Boolean**: Status flags, enable/disable states
- **Discrete**: Mode selections, state indicators

## UI/UX Design Philosophy
- **Solar Car Theme**: Yellow/gold accents representing solar energy
- **Dark Mode**: Black backgrounds for better visibility in sunlight
- **Status Colors**: Red (critical), orange (warning), green (normal)
- **Glass-morphism**: Blur effects for modern, clean appearance
- **Real-time Updates**: Live data visualization with animations
- **Card-based Layout**: Organized information in rounded cards

## Development Guidelines

### Code Style
- Use functional components with React hooks
- Implement proper error handling for data updates
- Follow React Native best practices for performance
- Use StyleSheet for consistent styling
- Handle loading and error states appropriately

### Data Management
- Use mock data generator for testing
- Implement proper signal status calculation
- Handle real-time updates efficiently
- Consider state management for complex data flow

### Animation and UI
- Use React Native Reanimated for smooth animations
- Implement proper loading states
- Use consistent color schemes across screens
- Handle different device screen sizes

### Testing & Validation
- Test on Expo Go iOS app
- Validate telemetry data display accuracy
- Test real-time update performance
- Verify proper navigation flow
- Test all interactive elements

## Solar Car Specific Features
- **Safety First**: Prominent display of safety system status
- **Energy Monitoring**: Battery and solar power visualization
- **Efficiency Tracking**: Power consumption and generation balance
- **Temperature Management**: Critical temperature monitoring
- **System Health**: Overall vehicle system diagnostics

## Future Enhancements
- Real solar car CAN bus integration
- Data logging and historical analysis
- Remote monitoring capabilities
- Predictive maintenance alerts
- Route optimization for solar efficiency
- Offline data caching
- Export telemetry data functionality

## Build & Deploy Instructions
1. Install dependencies: `npm install`
2. Start Expo development server: `npx expo start`
3. Scan QR code with Expo Go on iOS device
4. Test all screens and telemetry functionality
5. Build for production: `npx expo build:ios`

## Troubleshooting
- For navigation issues, verify React Navigation setup
- For animation performance, check React Native Reanimated
- For data display issues, verify telemetryData.js structure
- For dependency conflicts, use `npm install --force`

## Contributing
- Follow existing code structure and naming conventions
- Add proper error handling for new features
- Test telemetry data accuracy
- Maintain solar car UI consistency
- Document any new telemetry signals or categories
