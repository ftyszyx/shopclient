const utils = require('./utils')
const path = require('path')
const webpack = require('webpack')
const config = require('./config')
const merge = require('webpack-merge')

const HtmlWebpackPlugin = require('html-webpack-plugin')
const FriendlyErrorsPlugin = require('friendly-errors-webpack-plugin')


function resolveApp(relativePath) {
  return path.resolve(relativePath);
}

module.exports = function(pagename) {
  const baseWebpackConfig = require('./webpack.base.conf')(config.webpath)
  const htmlname = config.html + '.ejs';
  const webpackconf = merge(baseWebpackConfig, {
    entry: {
      app: path.join(__dirname,  '../'+config.webpath+"/", 'main.js')
    },
    module: {
      rules: utils.styleLoaders({ sourceMap: config.dev.cssSourceMap })
    },
        // cheap-source-map is faster for development
    devtool: '#cheap-source-map',
    cache: true,
    plugins: [
      new webpack.DefinePlugin({
        'process.env': {
          NODE_ENV: '"development"'
        }
      }),
      new webpack.ProvidePlugin({
        $: 'jquery',
        jQuery: 'jquery'
      }),
            // https://github.com/glenjamin/webpack-hot-middleware#installation--usage
      new webpack.HotModuleReplacementPlugin(),
      new webpack.NoEmitOnErrorsPlugin(),
            // https://github.com/ampedandwired/html-webpack-plugin
      new HtmlWebpackPlugin({
        filename: 'index.html', // 输出文件路径
        template: path.resolve(__dirname, '../' + htmlname), // 源文件路径
        favicon: path.join(__dirname, '../', 'favicon.ico'),
        inject: true,
        path: config.dev.staticPath
      }),

      new FriendlyErrorsPlugin()
    ]
  })
  return webpackconf;
}