import path from 'path';

// Derive __dirname using import.meta.url
const __dirname = new URL('.', import.meta.url).pathname;

export default {
  entry: './lib/index.js',
  output: {
    path: path.resolve(__dirname, 'dist'),
    filename: 'authkeeper.js',
    library: 'authkeeper',
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
};
