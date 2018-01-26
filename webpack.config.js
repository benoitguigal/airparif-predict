const path = require('path');

module.exports = {
  entry: [
    './src/index.js',
    'babel-polyfill'
  ],
  output: {
    filename: 'bundle.js',
    path: path.resolve(__dirname, 'app', 'static', 'js')
  },
  module: {
    loaders: [
      {
        loader: "babel-loader",

        // Skip any files outside of your project's `src` directory
        include: [
          path.resolve(__dirname, "src"),
        ],

        // Only run `.js` and `.jsx` files through Babel
        test: /\.jsx?$/,

        // Options to configure babel with
        query: {
          presets: ['es2015', 'es2016']
        }
      }
    ],
    rules: [
      {
        test: /\.css$/,
        use: [
          'style-loader',
          'css-loader'
        ]
      }
    ]
  },
};