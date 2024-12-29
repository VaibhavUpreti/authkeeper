const path = require('path')

module.exports = {
  entry: './lib/index.js',
  output: {
    path: path.resolve(__dirname, 'dist'),
    filename: 'auth-keeper.js',
    library: 'auth-keeper',
    libraryTarget: 'umd'
  },
  devtool: "source-map",

  module: {
    rules: [
      {
        test: /\.js$/,
        include: path.resolve(__dirname, './src'),
        use: {
          loader: 'babel-loader',
          options: {
            presets: [
              ["env", {
                  useBuiltIns: 'entry'
              }],
              "react"
            ]
          }
        }
      }

    ]
  }
}
