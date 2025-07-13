# Signal Search Functionality

## Overview
The Systems screen now includes a comprehensive search functionality that allows users to quickly find specific telemetry signals across the selected category.

## Features

### 1. Search Bar
- Located at the top of the Systems screen, below the header
- Glass-morphism design with BlurView for consistent UI
- Search icon on the left and clear icon on the right (when typing)
- Real-time search as you type

### 2. Search Capabilities
- **Signal Name Search**: Search by the internal signal name (e.g., "motor_current")
- **Description Search**: Search by the human-readable description (e.g., "Motor Current")
- **Unit Search**: Search by measurement units (e.g., "A", "V", "°C")
- **Case Insensitive**: Search works regardless of capitalization

### 3. Search Results Display
- **Dynamic Filtering**: Results update in real-time as you type
- **Search Highlighting**: Matching terms are highlighted in red with BSR brand color
- **Result Counter**: Shows "Found X/Y" format when searching vs "X Signals" when not
- **Search Icon**: Appears next to the title when actively searching

### 4. User Experience Features
- **Auto-clear on Category Switch**: Search is automatically cleared when switching categories
- **No Results State**: Shows a friendly message when no signals match the search
- **Smooth Animations**: Maintained existing animations and transitions

### 5. Search Algorithm
The search matches signals if the search term appears in:
- Signal name (internal identifier)
- Signal description (human-readable name)
- Unit of measurement

## Usage Examples

### Common Search Terms
- "temp" - Find all temperature-related signals
- "current" - Find all current measurements
- "voltage" - Find all voltage signals
- "motor" - Find motor-related telemetry
- "battery" - Find battery system signals
- "°C" - Find all temperature measurements
- "A" - Find all current measurements in Amperes

### Search Tips
- Use partial words (e.g., "temp" instead of "temperature")
- Try different variations (e.g., "volt" or "V")
- Search for units to find all signals of a specific measurement type
- Use category-specific terms (e.g., "SOC" in Battery System)

## Technical Implementation

### Components
- **Search Bar**: BlurView-based input with icons
- **Search Logic**: Real-time filtering with case-insensitive matching
- **Highlight Component**: Text highlighting with BSR brand color
- **Result Counter**: Dynamic display in CategoryHeader

### State Management
- `searchQuery`: Current search input
- `filteredSignals`: Filtered array based on search
- Auto-clear on category changes

### Styling
- Consistent with existing BSR theme
- Glass-morphism design language
- Red highlighting for search matches
- Professional telemetry dashboard appearance

## Future Enhancements
- Cross-category search (search all categories simultaneously)
- Search history and suggestions
- Advanced filtering (by status, value range, etc.)
- Search shortcuts/hotkeys
- Export filtered results
