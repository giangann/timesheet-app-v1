const { getSentryExpoConfig } = require("@sentry/react-native/metro");
const { getDefaultConfig, mergeConfig } = require("@react-native/metro-config");
const defaultConfig = getDefaultConfig(__dirname);
const config = getSentryExpoConfig(__dirname);

const svgConfig = {
  transformer: {
    babelTransformerPath: require.resolve("react-native-svg-transformer"),
  },
  resolver: {
    assetExts: defaultConfig.resolver.assetExts.filter((ext) => ext !== "svg"),
    sourceExts: [...defaultConfig.resolver.sourceExts, "svg"],
  },
};

module.exports = mergeConfig(config, svgConfig);
