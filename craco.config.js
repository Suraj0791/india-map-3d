const path = require('path');

module.exports = {
  webpack: {
    alias: {
      // Alias react-map-gl to its ESM build file.
      'react-map-gl': path.resolve(__dirname, 'node_modules/react-map-gl/dist/esm/react-map-gl.js')
    }
  }
};
