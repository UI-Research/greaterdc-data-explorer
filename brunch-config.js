// See http://brunch.io for documentation.
exports.files = {
  javascripts: {
    joinTo: {
      "vendor.js": /^(?!app)/,
      "app.js": /^app/,
    },
  },
  stylesheets: { joinTo: "app.css" },
};

exports.plugins = {
  babel: {
    presets: [
      [ "env", {
        targets: {
          browsers: [ "last 2 versions", "safari >= 7", "ie >= 9" ]
        },
      } ],
    ],
    plugins: [
      [ "transform-react-jsx", { pragma: "h" } ],
      [ "transform-class-properties" ],
      [ "transform-object-rest-spread" ],
    ],
  },
};

exports.npm = {
  enabled: true,
  aliases: {
    "react": "preact-compat",
    "react-dom": "preact-compat",
  },
  styles: {
    "react-select": [ "dist/react-select.css" ]
  }
}
