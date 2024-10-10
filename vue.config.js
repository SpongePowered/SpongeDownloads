module.exports = {
  parser: '@babel/eslint-parser',
  parserOptions: {
    requireConfigFile: false, // only needed if you don’t have a Babel config file
    babelOptions: {
      presets: ['@babel/preset-env']
    }
  },
  publicPath: process.env.VUE_APP_PUBLIC_PATH || '/downloads',
  indexPath: process.env.VUE_APP_INDEX_PATH || 'index.html'
};
