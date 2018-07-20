const utils = require('./utils')
const config = require('./config')
const isProduction = process.env.NODE_ENV === 'production'

module.exports = {
  loaders: utils.cssLoaders({
    sourceMap: isProduction
            ? config.build.productionSourceMap
            : config.dev.cssSourceMap,
    extract: isProduction
  }),
  autoprefixer: {
    browsers: ['Android >= 2.3', 'ChromeAndroid > 1%', 'iOS >= 7'],
    cascade: false  // 不美化输出 css
  }
}
