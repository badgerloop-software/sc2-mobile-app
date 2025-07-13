# 3D Models for BSR Solar Car App

This directory contains 3D model files for the BSR solar car telemetry app.

## Model Files

### Solar Car Model
- **File**: `solar-car.glb`
- **Status**: Placeholder (ready for your model)
- **Component**: `SolarCar3DViewer.js`
- **Usage**: Main solar car visualization on HomeScreen

### Battery Cells Model
- **File**: `battery-cells.glb`
- **Status**: Placeholder (ready for your model)
- **Component**: `Battery3DViewer.js`
- **Usage**: Battery pack visualization on BatteryScreen

## Adding Your Models

1. **Export as GLB**: Use Blender, 3ds Max, or any 3D software to export as GLB
2. **Name correctly**: Use exact filenames above
3. **Replace placeholder**: Simply replace the `.placeholder` files with your `.glb` files
4. **Test**: The app will automatically detect and load your models

## Model Specifications

### Solar Car Model (`solar-car.glb`)
- Should represent the actual BSR solar car
- Include body, wheels, solar panels
- Optimize for mobile (low poly count)
- Consider showing telemetry-reactive elements

### Battery Cells Model (`battery-cells.glb`)
- Should show battery pack structure
- Individual cells or cell groups (31 groups)
- Consider thermal visualization
- Include BPS safety components

## Performance Tips

- Keep polygon count under 10,000 for mobile performance
- Use compressed textures when possible
- Consider LOD (Level of Detail) for distance viewing
- Test on actual devices, not just simulators

## Current Status

Both models are currently showing animated placeholders with real telemetry data integration. The infrastructure is complete and ready for GLB files.
