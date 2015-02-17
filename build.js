var webpack = require('webpack');

var module = {
  loaders: [
    {
      test: /\.jsx?$/,
      exclude: /node_modules/,
      loader: '6to5-loader?experimental&playground&sourceMap'
    },
    {
      test: /\js-csp(.*).js$/,
      loader: '6to5-loader?experimental&playground&sourceMap=inline'
    }
  ]
};

var config = {
  entry: './src/demo/main.jsx',
  output: {
    filename: './demo/main.js'
  },
  module: module
};

webpack(config).watch(200, function(err, stats){
  if (stats.hasErrors()){
    console.log('ERROR: ', err, stats.toJson().errors);
    return;
  }

  var seconds = (stats.endTime - stats.startTime) / 1000;
  console.log('Dev build done: ' + seconds + 's, at ' + new Date());
});
