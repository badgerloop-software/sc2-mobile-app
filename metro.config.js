const { getDefaultConfig } = require('expo/metro-config');

const config = getDefaultConfig(__dirname);

// Add GLB and GLTF file support
config.resolver.assetExts.push('glb', 'gltf', 'obj', 'mtl', 'fbx');

// Suppress warnings from three.js package.json export issues
config.resolver.resolverMainFields = ['react-native', 'browser', 'main'];

module.exports = config;
