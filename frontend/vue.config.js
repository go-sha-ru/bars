module.exports = {
  devServer: {
    watchOptions: {
    ignored: /node_modules/,
    aggregateTimeout: 300,
    poll: 1000,
  },
    public: 'local.bars.ru:8080',
    disableHostCheck: true
  },
};