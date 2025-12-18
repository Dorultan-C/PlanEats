// metro.config.js
const { getDefaultConfig } = require("expo/metro-config");
const { withNativeWind } = require('nativewind/metro');

const config = getDefaultConfig(__dirname);

// 1. FIX FOR FIREBASE: Tell Metro to look for .cjs files
config.resolver.sourceExts.push("cjs");

// 2. EXPORT WITH NATIVEWIND
module.exports = withNativeWind(config, { input: './global.css' });