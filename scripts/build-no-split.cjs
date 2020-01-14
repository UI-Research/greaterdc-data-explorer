
const rewire = require('rewire');
const defaults = rewire('react-scripts/scripts/build.js');
const config = defaults.__get__('config');

// Use external version of React
config.externals = {
  "react": "React",
  "react-dom": "ReactDOM"
};

// Consolidate chunk files instead
config.optimization.splitChunks = {
  cacheGroups: {
    default: false,
  },
};
// Move runtime into bundle instead of separate file
config.optimization.runtimeChunk = false;

// JS
config.output.filename = 'static/js/[name].js';
// CSS. "5" is MiniCssPlugin
// Force rename un-chunked file.
config.plugins[5].options.moduleFilename = () => 'static/css/main.css';

// I may need this again.
// config.plugins[5].options.filename = 'static/css/main.css';