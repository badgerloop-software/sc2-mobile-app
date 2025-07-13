# BSR Solar Car Mobile App ☀️🚗

A Solar Car Mobile app built with React Native, Expo SDK 53, and React Native Reanimated, featuring real-time telemetry monitoring and solar car-specific visualizations.

## ✨ Features

### 🏠 Dashboard Screen
- **Live Telemetry Overview**: Real-time display of key metrics
- **Solar Car Model**: Animated car visualization with status indicators
- **Critical Alerts**: Prominent alerts for safety and system issues
- **Key Metrics Cards**: Battery SOC, speed, solar power, temperature
- **System Categories**: Health scores for all major subsystems
- **Auto-refresh**: Data updates every 2 seconds

### 🔧 Systems Screen
- **Category Navigation**: Horizontal scrollable tabs for all telemetry categories
- **Detailed Signal View**: Individual signal monitoring with real-time values
- **Status Indicators**: Color-coded status (green=normal, orange=warning, red=critical)
- **Health Scoring**: Real-time calculation of system health percentages
- **Signal Descriptions**: Clear labels and units for each telemetry signal

### � Battery Screen
- **Main Battery Status**: Large SOC display with voltage and current
- **Battery Health Cards**: Current, power, temperature, and health status
- **BPS Fault Monitoring**: Battery Protection System fault detection
- **Cell Group Voltages**: Individual voltage monitoring for all 31 cell groups
- **Additional Info**: Fan speed, capacity, resistance, and balancing status

### ☀️ Solar Array Screen
- **MPPT Performance**: Maximum Power Point Tracking monitoring
- **String Monitoring**: Individual voltage and current for 3 solar strings
- **Temperature Tracking**: Solar panel temperature monitoring
- **Power Generation**: Real-time solar power output

### ⚙️ Settings Screen
- **App Configuration**: Settings and preferences
- **System Information**: App version and device details
- **Connection Status**: Vehicle communication status
- Charging history tracking

## � Telemetry Categories

### Motor & Drive
- Accelerator position, speed, motor current/power/temperature
- Motor controller temperature, regenerative braking
- Foot brake and park brake status

### Battery System
- State of charge/health, pack voltage/current/power
- Pack temperature, amp hours, total capacity
- Fan speed, resistance, cell balancing status
- Individual cell group voltages (31 groups)

### Solar Array
- MPPT output current and power
- String voltages and currents (3 strings)
- String temperatures, MPPT mode status

### High Voltage
- Discharge/charge enable status
- HV isolation, contactors status
- DC-DC converter current and temperature

### Safety Systems
- E-stop status (driver and external)
- Crash detection, BPS faults and failsafes
- Various protection system faults

### Power Systems
- Bus voltages (5V, 12V, 24V)
- Bus currents, supplemental battery status

### Environmental
- Air, brake, road, and system temperatures
- Various sensor readings

### Vehicle Controls
- MCC state, cruise control settings
- Eco mode, telemetry switches
- Lighting controls (turn signals, brake lights, headlights)

### Navigation
- GPS coordinates (latitude, longitude)
- Elevation data

### System Status
- CAN heartbeat signals
- Telemetry system status

## 🛠️ Tech Stack

- **React Native** - Mobile app framework
- **Expo SDK 53** - Development platform and tools
- **React Native Reanimated** - Smooth animations
- **React Navigation** - Tab-based navigation
- **Expo Linear Gradient** - UI gradient effects
- **Expo Vector Icons** - Material Icons and Ionicons
- **Expo Blur** - Glass-morphism effects

## 📁 Project Structure

```
mobile-app-react/
├── src/
│   ├── screens/
│   │   ├── HomeScreen.js      # Dashboard with telemetry overview
│   │   ├── SystemsScreen.js   # Detailed system telemetry
│   │   ├── BatteryScreen.js   # Battery monitoring
│   │   ├── ClimateScreen.js   # Solar array monitoring
│   │   └── ProfileScreen.js   # Settings and configuration
│   ├── data/
│   │   └── telemetryData.js   # Telemetry categories and mock data
│   ├── components/            # Reusable components (future)
│   └── utils/                 # Utility functions (future)
├── .github/
│   └── copilot-instructions.md
├── .vscode/
│   └── tasks.json
├── App.js                     # Main app component
├── package.json
└── README.md
```

## 🚀 Getting Started

### Prerequisites
- Node.js (v16 or higher)
- npm or yarn
- Expo CLI (`npm install -g @expo/cli`)
- Expo Go app on iOS device

### Installation

1. **Clone the repository**
   ```bash
   git clone <repository-url>
   cd mobile-app-react
   ```

2. **Install dependencies**
   ```bash
   npm install
   ```

3. **Start the development server**
   ```bash
   npx expo start
   ```

4. **Run on device**
   - Open Expo Go on your iOS device
   - Scan the QR code displayed in the terminal
   - The app will load on your device

## 🎨 UI/UX Design

### Solar Car Theme
- **Color Scheme**: Gold/yellow accents representing solar energy
- **Dark Mode**: Black backgrounds optimized for sunlight visibility
- **Status Colors**: Intuitive red/orange/green color coding
- **Glass-morphism**: Modern blur effects for card elements
- **Animations**: Smooth transitions and loading states

### Features
- **Real-time Data**: Live telemetry updates every 2-3 seconds
- **Status Calculation**: Automatic critical/warning/normal status determination
- **Health Scoring**: System health percentages based on signal status
- **Alert System**: Critical alerts for safety-related issues
- **Responsive Design**: Works across different screen sizes

## 🔧 Development

### Mock Data
Currently using simulated telemetry data for development and testing. The mock data generator creates realistic values within specified ranges for each signal type.

### Data Structure
- **Categorized Signals**: All telemetry organized into logical categories
- **Type Support**: Boolean, integer, float, and discrete signal types
- **Range Validation**: Min/max ranges for each signal with status calculation

### Adding New Signals
1. Edit `src/data/telemetryData.js`
2. Add signal to appropriate category
3. Define unit, range, and description
4. Specify type if boolean or discrete

## 📱 Testing

### Current Status
- ✅ App builds and runs successfully on Expo Go
- ✅ All navigation tabs working
- ✅ Real-time data updates functioning
- ✅ Alert system operational
- ✅ Category health scoring working
- ✅ Signal status calculation accurate

### Known Issues
- Minor warning about invalid icon name "car-seat" (non-critical)
- Solar Array and Settings screens need updates for solar car specific features
- Currently using mock data - needs real telemetry integration

## 🚀 Future Enhancements

### Short Term
- [ ] Update Solar Array screen with proper MPPT visualization
- [ ] Update Settings screen with telemetry preferences
- [ ] Add data export functionality
- [ ] Implement offline data caching

### Medium Term
- [ ] Connect to real CAN bus data via WebSocket/API
- [ ] Add historical data visualization and charts
- [ ] Implement data logging and analysis tools
- [ ] Add push notifications for critical alerts

### Long Term
- [ ] Import and display 3D solar car model
- [ ] Add route optimization for solar efficiency
- [ ] Implement predictive maintenance alerts
- [ ] Add remote monitoring capabilities

## 📄 License

This project is for educational purposes. The code is generated with AI assistance and is free to use for educational and non-commercial purposes.

## 🤝 Contributing

1. Fork the repository
2. Create a feature branch
3. Make your changes
4. Test thoroughly
5. Submit a pull request

## 📞 Support

For issues or questions, please create an issue in the GitHub repository.

---

**Note**: This is a Solar Car telemetry monitoring app for educational purposes. The code is generated with AI assistance and is free to use for educational and non-commercial purposes.
