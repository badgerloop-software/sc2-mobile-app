# Location and Map Features

## Overview
The BSR Solar Car Telemetry app now includes location tracking and map visualization features that allow users to see where the solar car is currently located and view its position on an interactive map.

## Features

### 1. Location Display Card
- **GPS Coordinates**: Shows precise latitude and longitude
- **Location Name**: Displays the city/area name based on coordinates
- **GPS Status**: Visual indicator showing connection status
- **Tap to View Map**: Interactive element to open full map view

### 2. Interactive Map Modal
- **Full-Screen Map**: Opens in a modal with detailed map view
- **Car Marker**: Custom red marker showing the solar car's position
- **Location Info**: Displays car name, location, and coordinates
- **External Maps**: Button to open in device's default maps app
- **Zoom Controls**: Interactive map with zoom and pan capabilities

### 3. Map Technology
- **OpenStreetMap**: Uses free OpenStreetMap tiles
- **Leaflet**: JavaScript map library for interactive features
- **WebView**: Displays map content in a web view component
- **Reverse Geocoding**: Uses OpenStreetMap Nominatim for location names

## User Interface

### Location Display Card
- **Location Icon**: Red BSR-branded location pin
- **Title**: "Vehicle Location"
- **Address**: Current city/area name
- **Coordinates**: Precise GPS coordinates in decimal format
- **Status Indicator**: Green dot for GPS connected, red for disconnected
- **Call to Action**: "Tap to view map" prompt

### Map Modal
- **Header**: Close button, title, and external maps button
- **Map Area**: Interactive map with car marker and location circle
- **Footer**: Location details and "Open in Maps" button
- **Custom Marker**: Red car icon with BSR branding
- **Info Panel**: Overlay with car details and coordinates

## Technical Implementation

### Components
- **LocationDisplay**: Home screen location card component
- **MapView**: Full-screen map modal component
- **HTML Map**: Generated HTML with Leaflet map library

### Data Sources
- **Telemetry GPS**: Uses lat/lon from telemetry data
- **OpenStreetMap**: Free map tiles and geocoding
- **Nominatim**: Free reverse geocoding API

### Features
- **Real-time Updates**: Location updates with telemetry data
- **Offline Fallback**: Shows last known location if GPS unavailable
- **External Integration**: Opens in Google Maps or Apple Maps
- **Responsive Design**: Works on different screen sizes

## Usage

### Viewing Location
1. Check the "Vehicle Location" card on the home screen
2. See current city/area name and GPS coordinates
3. Verify GPS connection status (green = connected)

### Opening Map
1. Tap the location card on the home screen
2. View the interactive map with car marker
3. Pan and zoom to explore the area
4. Tap the info popup for more details

### External Maps
1. Open the map modal from the home screen
2. Tap "Open in Maps" button in header or footer
3. Choose your preferred maps application
4. Navigate using external GPS navigation

## GPS Data
The location features use GPS coordinates from the telemetry data:
- **Latitude**: `telemetryData.lat`
- **Longitude**: `telemetryData.lon`
- **Default Location**: Madison, WI (43.0642, -87.9073)
- **Update Frequency**: Updates with telemetry refresh (every 2 seconds)

## Privacy and Security
- **Local Processing**: All location data stays on the device
- **Free APIs**: Uses only free, public mapping services
- **No Tracking**: No location data is stored or transmitted
- **Open Source**: Uses open-source mapping solutions

## Future Enhancements
- Route history and path tracking
- Geofencing alerts for race boundaries
- Offline map caching
- Turn-by-turn navigation integration
- Location-based telemetry analysis
- Race checkpoint tracking
- Team member location sharing
- Weather overlay on map
- Elevation profile display
- Speed and efficiency by location
