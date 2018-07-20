const path = require('path')
const utils = require('./utils')
const webpack = require('webpack')
const config = require('./config')
const merge = require('webpack-merge')

const CopyWebpackPlugin = require('copy-webpack-plugin')
const HtmlWebpackPlugin = require('html-webpack-plugin')
const ExtractTextPlugin = require('extract-text-webpack-plugin')
const OptimizeCSSPlugin = require('optimize-css-assets-webpack-plugin')
const UglifyJSPlugin = require('uglifyjs-webpack-plugin');
// var BundleAnalyzerPlugin = require('webpack-bundle-analyzer').BundleAnalyzerPlugin;


function resolveApp(relativePath) {
  return path.resolve(relativePath);
}



const getconf = function(pagename) {
  const baseWebpackConfig = require('./webpack.base.conf')(config.webpath)
  const htmlname = config.webpath + '.ejs';
  const outpath = path.join(config.build.assetsRoot, config.outpath);
  const indexpath = path.join(config.build.index, config.outpath);
  const webpackConfig = merge(baseWebpackConfig, {
        // 解析文件的
    entry: {
      app: path.join(__dirname, '../'+config.webpath+"/", 'main.js')
    },
    module: {
      rules: utils.styleLoaders({
        sourceMap: config.build.productionSourceMap,
        extract: true
      })
    },
    // devtool: '#cheap-source-map',
    devtool: false,
    output: {
      path: outpath,
      filename: utils.assetsPath('js/[name].[chunkhash].js'),
      chunkFilename: utils.assetsPath('js/[name].[chunkhash].js')
    },
    plugins: [

            // http://vuejs.github.io/vue-loader/en/workflow/production.html
      new webpack.DefinePlugin({
        'process.env': {
          NODE_ENV: '"production"'
        }
      }),
      // new webpack.DefinePlugin({
      //    'process.env.NODE_ENV': JSON.stringify('production')
      // }),
      new UglifyJSPlugin(),

       // 把文件单独导出到一个文件中，css
        // extract css into its own file
      new ExtractTextPlugin({
        filename: utils.assetsPath('css/[name].[contenthash].css')
      }),
      
      // css 压缩
      new OptimizeCSSPlugin(),
            // generate dist index.html with correct asset hash for caching.
            // you can customize output by editing /index.html
            // see https://github.com/ampedandwired/html-webpack-plugin
            // 导html文件的
      new HtmlWebpackPlugin({
        filename: path.join(indexpath, 'index.html'),
        template: path.resolve(__dirname, '../' + htmlname),
        inject: true,
        favicon: path.join(__dirname, '../', 'favicon.ico'),
        minify: {
          removeComments: true,
          collapseWhitespace: true,
          removeRedundantAttributes: true,
          useShortDoctype: true,
          removeEmptyAttributes: true,
          removeStyleLinkTypeAttributes: true,
          keepClosingSlash: true,
          minifyJS: true,
          minifyCSS: true,
          minifyURLs: true
        },
        path: config.build.staticPath,
                // necessary to consistently work with multiple chunks via CommonsChunkPlugin
        chunksSortMode: 'dependency'
      }),

      new webpack.ProvidePlugin({
        $: 'jquery',
        jQuery: 'jquery'
      })
    ]
  })

 // 把异步加载的共用模块放到used-twice中
 const commonchuck = new webpack.optimize.CommonsChunkPlugin({
  async: 'used-twice',
  minChunks: (module, count) =>
            count >= 2

});
webpackConfig.plugins.push(commonchuck);

  const vendorchuck = new webpack.optimize.CommonsChunkPlugin({
    name: 'vendor',
    minChunks(module, count) {
      return (
                  module.resource &&
                  /\.js$/.test(module.resource) &&
                  module.resource.indexOf(
                      path.join(__dirname, '../node_modules')
                  ) === 0
      )
    }
  });
  webpackConfig.plugins.push(vendorchuck);

  const copymodel = new CopyWebpackPlugin([
    {
      from: path.resolve(__dirname, '../'+pagename+'/static'),
      to: config.build.assetsSubDirectory,
      ignore: ['.*']
    }
  ]);
  webpackConfig.plugins.push(copymodel);
  // const BundleAnalyzerPlugin = require('webpack-bundle-analyzer').BundleAnalyzerPlugin
  // webpackConfig.plugins.push(new BundleAnalyzerPlugin())
  return webpackConfig;
}



module.exports = getconf

