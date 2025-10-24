# Web Deployment Guide

This guide explains how to deploy the BSR Solar Car 2 mobile app as a web application using Expo and GitHub Pages.

## Prerequisites

- Node.js (version 20 or higher)
- npm or yarn
- Expo CLI

## Local Development

### 1. Install Dependencies
```bash
npm install
```

### 2. Start Development Server (Web)
```bash
npm run web
```

### 3. Build for Web
```bash
npm run build:web
```

### 4. Preview Web Build Locally
```bash
npm run serve
```

## GitHub Pages Deployment

### Automatic Deployment (Recommended)

The repository is configured with GitHub Actions for automatic deployment:

1. **Enable GitHub Pages**: Go to your repository → Settings → Pages
2. **Source**: Select "GitHub Actions" as the source
3. **Deploy**: Push changes to the `main` branch to trigger automatic deployment

The GitHub Actions workflow (`.github/workflows/deploy-pages.yml`) will:
- Install dependencies
- Build the web version
- Deploy to GitHub Pages

### Manual Deployment

If you prefer manual deployment:

1. Build the web version:
   ```bash
   npm run build:web
   ```

2. Deploy the `dist/` folder contents to GitHub Pages or any static hosting service.

## Deployment Configuration

### App Configuration (`app.json`)
- **Platform Support**: Includes `"web"` in platforms array
- **Web Bundler**: Uses Metro bundler for web builds
- **Favicon**: Configured to use the app logo

### Dependencies
Required web-specific packages are installed:
- `react-dom`: React DOM renderer for web
- `react-native-web`: React Native components for web
- `@expo/metro-runtime`: Expo's Metro runtime for web

## Features Available on Web

✅ **Core Navigation**: Bottom tabs and navigation work on web
✅ **Screens**: All app screens are accessible
✅ **3D Models**: Three.js components work in browsers
✅ **Icons**: Vector icons display properly
✅ **Styling**: Native styling translates to CSS

⚠️ **Limited Features**: Some mobile-specific features may have limited functionality:
- GPS/Location services may require user permission
- Haptic feedback not available
- Native maps may fall back to web maps

## Troubleshooting

### Build Issues
- Ensure all web dependencies are installed: `npm install`
- Clear Expo cache: `npx expo start --clear`
- Check Node.js version (requires v20+)

### Deployment Issues
- Verify GitHub Pages is enabled in repository settings
- Check GitHub Actions workflow status in the Actions tab
- Ensure the workflow has proper permissions for Pages deployment

## Local Preview

After building, you can preview the web app locally:
```bash
npm run serve
```

This will start a local server (typically on http://localhost:3000) to preview your web build.

## Production URL

Once deployed to GitHub Pages, your app will be available at:
```
https://[username].github.io/[repository-name]
```

For example: `https://badgerloop-software.github.io/sc2-mobile-app`