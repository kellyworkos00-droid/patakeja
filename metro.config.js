const { getDefaultConfig } = require("expo/metro-config");
const { withNativeWind } = require("nativewind/metro");
const path = require("path");

const config = getDefaultConfig(__dirname);

config.resolver.nodeModulesPaths = [
  path.resolve(__dirname, "node_modules"),
  path.resolve(__dirname, "node_modules/@clerk/clerk-expo/node_modules"),
];

// Fix clerk.headless relative import inside nested node_modules
config.resolver.resolveRequest = (context, moduleName, platform) => {
  if (
    moduleName === "../dist/clerk.headless" &&
    context.originModulePath.includes("@clerk/clerk-js/headless")
  ) {
    return {
      filePath: path.resolve(
        __dirname,
        "node_modules/@clerk/clerk-expo/node_modules/@clerk/clerk-js/dist/clerk.headless.js"
      ),
      type: "sourceFile",
    };
  }
  return context.resolveRequest(context, moduleName, platform);
};

module.exports = withNativeWind(config, { input: "./global.css" });
