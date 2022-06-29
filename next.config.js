const withImages = require("next-images");
const withFonts = require("next-fonts");

module.exports = withImages(
  withFonts({
    webpack(config, options) {
      return config;
    },
    env: {
      API_URL: process.env.API_URL + "/api",
    },
    eslint: {
      // Warning: This allows production builds to successfully complete even if
      // your project has ESLint errors.
      ignoreDuringBuilds: true,
    },
    typescript: {
      // !! WARN !!
      // Dangerously allow production builds to successfully complete even if
      // your project has type errors.
      // !! WARN !!
      ignoreBuildErrors: true,
    },
  })
);
