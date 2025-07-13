# GitHub Actions CI/CD Setup

This directory contains GitHub Actions workflows for automated building and testing of the BSR Solar Car 2 mobile app.

## Workflows

### 1. Build Check (`build-check.yml`)
**Purpose**: Validates code and ensures app builds correctly
**Triggers**: 
- Push to `main` or `develop` branches
- Pull requests to `main`

**What it checks**:
- ✅ npm dependencies install successfully
- ✅ No high-severity security vulnerabilities
- ✅ Expo configuration is valid
- ✅ Metro bundler can create bundles
- ✅ Bundle size is reasonable (<50MB)
- ✅ Essential files exist (screens, components, data, documentation)
- ✅ No invalid icon names or common issues
- ✅ Telemetry system works correctly

**No secrets required** - runs on all pushes and PRs

### 2. EAS Build (`eas-build.yml`)
**Purpose**: Creates production-ready app builds
**Triggers**:
- Push to `main` branch
- Manual workflow dispatch (Actions tab)
- Git tags starting with 'v' (e.g., v1.0.0)

**Build options**:
- **Platform**: iOS, Android, or both
- **Profile**: development, preview, or production
- **Auto-versioning**: Uses git tags for version numbers
- **Bundle ID**: `com.badgersolar.sc2telemetry`

**Requires**: `EXPO_TOKEN` secret in repository settings

### 3. CI/CD Pipeline (`ci.yml`)
**Purpose**: Comprehensive testing and quality checks
**Features**:
- Multiple Node.js versions (18.x, 20.x)
- Security scanning
- Code quality checks
- Dependency validation
- File structure verification

## Setup Instructions

### Step 1: Repository Settings
1. Go to your GitHub repository
2. Navigate to Settings > Secrets and variables > Actions
3. Add repository secrets:

```
EXPO_TOKEN=your_expo_auth_token_here
```

### Step 2: Get Expo Token
```bash
# Login to Expo
npx expo login

# Get your token
npx expo whoami

# Token is stored in ~/.expo/state.json
# Copy the "sessionSecret" value
```

### Step 3: Test Locally
```bash
# Test the same commands that run in CI
npm ci
npx expo-doctor
npx expo export --platform all --dev
```

## Status Badges

Add these to your README.md to show build status:

```markdown
[![Build Check](https://github.com/BadgerSolarRacing/sc2-mobile-app/workflows/SC2%20Mobile%20App%20-%20Build%20Check/badge.svg)](https://github.com/BadgerSolarRacing/sc2-mobile-app/actions)

[![EAS Build](https://github.com/BadgerSolarRacing/sc2-mobile-app/workflows/SC2%20Mobile%20App%20-%20EAS%20Build/badge.svg)](https://github.com/BadgerSolarRacing/sc2-mobile-app/actions)
```

## Manual Build Triggers

### Run Build Check Manually
```bash
# Push to main or develop branch
git push origin main
```

### Run EAS Build Manually
1. Go to Actions tab in GitHub
2. Select "EAS Build" workflow
3. Click "Run workflow"
4. Choose platform and profile
5. Click "Run workflow"

## Troubleshooting

### Common Issues

**Build Check Fails**:
- Check if all dependencies are in package.json
- Ensure no invalid icon names in code
- Verify essential files exist
- Check bundle size isn't too large

**EAS Build Fails**:
- Ensure EXPO_TOKEN secret is set
- Check Expo account has necessary permissions
- Verify app.json has required fields
- Check for Expo SDK compatibility

**Security Audit Fails**:
- Run `npm audit fix` locally
- Update vulnerable dependencies
- Use `npm audit --audit-level=high` for critical issues only

### Getting Help

1. Check workflow logs in Actions tab
2. Look for specific error messages
3. Test commands locally first
4. Verify secrets are set correctly
5. Check Expo documentation for build issues

## Benefits

- **Automated Quality Assurance**: Catches issues before deployment
- **Consistent Builds**: Same environment every time
- **Early Detection**: Find problems immediately after push
- **Team Collaboration**: Everyone sees build status
- **Deployment Ready**: EAS builds ready for app stores
