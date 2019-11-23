const path = require(`path`);

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
    publicPath: 'http://localhost:8080/',
    compress: false,
    // Автоматическая перезагрузка страницы
    // Если не работает по стандартному URLу в браузере ‘http: //localhost:8080’,
    // то добавьте к нему ‘/webpack-dev-server/‘: ‘http: //localhost:8080/webpack-dev-server/'
    watchContentBase: true
  }
};
