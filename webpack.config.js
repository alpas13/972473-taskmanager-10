const path = require(`path`);
const MomentLocalesPlugin = require(`moment-locales-webpack-plugin`);

module.exports = {
  mode: `development`,
  entry: `./src/main.js`,
  output: {
    filename: `bundle.js`,
    path: path.join(__dirname, `public`)
  },
  devtool: `source-map`,
  devServer: {
    contentBase: path.join(__dirname, `public`),
    compress: false,
    // Автоматическая перезагрузка страницы
    // Если не работает по стандартному URLу в браузере ‘http: //localhost:8080’,
    // то добавьте к нему ‘/webpack-dev-server/‘: ‘http: //localhost:8080/webpack-dev-server/'
    watchContentBase: true
  },
  plugins: [new MomentLocalesPlugin({localesToKeep: [`es-us`]})],
  module: {
    rules: [
      {
        test: /\.css$/i,
        use: [`style-loader`, `css-loader`],
      },
    ],
  },
};
