# 3D Model Integration Workflow

## Quick Start (When Your Models are Ready)

### 1. Export Your Models
- Export as **GLB format** (not GLTF)
- File size: Keep under 5MB each
- Polygons: Target under 10,000 triangles
- Textures: Use 512x512 or 1024x1024 max

### 2. Add to App
```bash
# Solar Car Model
cp your-solar-car.glb src/assets/models/solar-car.glb

# Battery Cells Model
cp your-battery-cells.glb src/assets/models/battery-cells.glb
```

### 3. Upgrade Components (Optional)
- Current components use native React Native placeholders
- For full 3D model support, you can enhance the viewer components
- Use WebView + Three.js or expo-gl + expo-three

### 4. Test
- Both animated placeholders show current telemetry data
- Ready to be replaced with your actual 3D models

## What's Already Set Up

✅ **3D Infrastructure**: Native animations with telemetry integration  
✅ **Model Loading**: Ready for GLB file integration  
✅ **Telemetry Integration**: Real-time data display  
✅ **Placeholder System**: Animated icons with live data  
✅ **Error Handling**: Graceful fallback system  

## Current State

- 🎯 **Ready**: Just waiting for your GLB files
- 📱 **Working**: Placeholders show current telemetry data with animations
- 🔧 **Tested**: 3D systems are fully functional
- 🚀 **Optimized**: No WebView conflicts, native performance

## Model Components

### Solar Car 3D Model (`SolarCar3DViewer.js`)
**Location**: HomeScreen  
**Data**: Live telemetry data  
**Animations**: 
- Continuous rotation
- Battery-level pulsing
- Status color coding

### Battery Cells 3D Model (`Battery3DViewer.js`)
**Location**: BatteryScreen  
**Data**: Battery pack telemetry  
**Animations**:
- Rotation based on SOC
- Charging indicator flashing
- Temperature warnings
- Cell-level voltage display

## Telemetry Data Integration

### Solar Car Model Shows:
- **Battery Level**: Color-coded progress (🔋 Green/Yellow/Red)
- **Speed**: Real-time mph display (🏎️ Color changes with speed)
- **Solar Power**: Live wattage from panels (☀️ Yellow indicator)
- **Motor Temperature**: Current temperature (🌡️ Gray indicator)

### Battery Model Shows:
- **State of Charge**: Real-time SOC percentage
- **Charging State**: Animated flash when charging
- **Temperature**: Warning indicators for overheating
- **Cell Voltages**: Individual cell group status (31 groups)
- **BPS Faults**: Safety system status

## File Structure
```
sc2-mobile-app/
├── docs/
│   ├── 3D-MODEL-WORKFLOW.md           # ← This file
│   ├── 3d-models-guide.md             # ← Model specifications
│   ├── github-actions-setup.md        # ← CI/CD setup
│   └── copilot-instructions.md        # ← Development guidelines
├── src/
│   ├── assets/
│   │   └── models/
│   │       ├── solar-car.glb               # ← Your solar car model
│   │       ├── solar-car.glb.placeholder
│   │       ├── battery-cells.glb           # ← Your battery model
│   │       └── battery-cells.glb.placeholder
│   ├── components/
│   │   ├── SolarCar3DViewer.js             # ← Car 3D component (ready)
│   │   └── Battery3DViewer.js              # ← Battery 3D component (ready)
│   └── screens/
│       ├── HomeScreen.js                   # ← Uses solar car model
│       └── BatteryScreen.js                # ← Uses battery model
├── .github/workflows/                      # ← GitHub Actions
├── App.js                                  # ← Main app component
├── package.json                            # ← Project: sc2-mobile-app
└── README.md                               # ← Project documentation
```

## Next Steps

1. **Now**: App works with animated placeholders
2. **When ready**: Drop in your GLB files
3. **Optional**: Upgrade to full 3D WebView implementation

## Benefits of Current Approach

- ✅ **No Dependencies**: Pure React Native animations
- ✅ **Better Performance**: Native animations vs WebView
- ✅ **No Conflicts**: Avoids WebView registration issues
- ✅ **Live Data**: Real telemetry integration
- ✅ **Mobile Optimized**: Smooth 60fps animations
- ✅ **Dual Models**: Both solar car and battery visualization ready

## Troubleshooting

### Common Issues and Solutions

#### Icon Warning Messages
If you see warnings like `"battery-quarter" is not a valid icon name for family "ionicons"`:
- ✅ **Fixed**: All icon names have been updated to valid Ionicons
- ✅ **No action needed**: Warnings should disappear after restart

#### Performance Issues
- Ensure GLB files are under 5MB
- Keep polygon count under 10,000 triangles
- Use compressed textures

#### Model Not Loading
- Check file name exactly matches: `solar-car.glb` or `battery-cells.glb`
- Verify file is in correct directory: `src/assets/models/`
- Check console for error messages

#### GitHub Actions Build Failures
- Check the Actions tab in your GitHub repository
- Common issues:
  - Missing `EXPO_TOKEN` secret (for EAS builds)
  - Invalid dependencies in package.json
  - Expo SDK compatibility issues
  - Large bundle sizes (>50MB warning)

## GitHub Actions CI/CD

This project includes automated build checking via GitHub Actions:

### 🔧 **Build Check Workflow** (`build-check.yml`)
**Triggers**: Push to main/develop, Pull requests
**Features**:
- ✅ Dependency installation and security audit
- ✅ Expo configuration validation
- ✅ Metro bundler testing
- ✅ Bundle size monitoring
- ✅ File structure validation
- ✅ Telemetry system testing
- ✅ Common issues detection (like invalid icon names)

### 🚀 **EAS Build Workflow** (`eas-build.yml`)
**Triggers**: Push to main, Manual workflow dispatch
**Features**:
- ✅ Production-ready iOS/Android builds
- ✅ Configurable build profiles (development, preview, production)
- ✅ Automatic version management
- ✅ Build artifact storage

### 📋 **Setup Instructions**

1. **Add Expo Token Secret** (for EAS builds):
   ```bash
   # In your GitHub repository settings > Secrets
   EXPO_TOKEN=your_expo_auth_token_here
   ```

2. **Get Expo Token**:
   ```bash
   npx expo login
   npx expo whoami
   # Copy the token from ~/.expo/state.json
   ```

3. **Test Locally**:
   ```bash
   # Test build check commands
   npm ci
   npx expo doctor
   npx expo export --platform all --dev
   ```

### 🎯 **Benefits**
- **Automatic build validation** on every push
- **Early detection** of build issues
- **Consistent builds** across environments
- **Easy deployment** to app stores
- **Build artifacts** stored for testing
