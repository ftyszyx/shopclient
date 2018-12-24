const path = require('path');
const utils = require('./utils');
const config = require('./config');
const vueLoaderConfig = require('./vue-loader.conf');

function resolve(dir) {
  return path.join(__dirname, '..', dir)
}

module.exports =  function(pagename){
  return {
  output: {
    path: config.build.assetsRoot,
    filename: '[name].js',
    publicPath: process.env.NODE_ENV !== 'development' ? config.build.assetsPublicPath : config.dev.assetsPublicPath
  },
  resolve: {
    extensions: ['.js', '.vue', '.json'],
        // 包含路径
    alias: {
      "src/config.js":path.resolve(__dirname, '../'+config.webpath+"/"+config.configfile),
      "src/router":path.resolve(__dirname, '../'+config.webpath+"/router/"+config.routerfile),
      vue$: 'vue/dist/vue.esm.js',
      '@': resolve('src'),
      src: path.resolve(__dirname, '../'+config.webpath),
      assets: path.resolve(__dirname, '../'+config.webpath+'/assets'),
      admin: path.resolve(__dirname, '../admin'),
      shop: path.resolve(__dirname, '../shop'),
      erp: path.resolve(__dirname, '../erp'),      
      views: path.resolve(__dirname, '../'+config.webpath+'/views'),
      'element-ui': path.resolve(__dirname, '../common/element'),
      'mint-ui': path.resolve(__dirname, '../common/mint-ui'),
      components: path.resolve(__dirname, '../common/components'),
      common: path.resolve(__dirname, '../common'),
      commoncss: path.resolve(__dirname, '../common/styles'),
      compcss: path.resolve(__dirname, '../common/components/css'),
      utils: path.resolve(__dirname, '../common/utils'),
      static: path.resolve(__dirname, '../static')
    }
  },
    // 不用打包的模块
  externals: {
    jquery: 'jQuery'
  },
  module: {
    rules: [
      { test: /\.vue$/,
        loader: 'vue-loader',
        options: vueLoaderConfig
      },
      {
        test: /\.html$/,
        include: [path.resolve(__dirname, '../'+pagename), path.resolve(__dirname, '../common')],
        loader: 'html-loader',
        query: {
          minimize: true
                    // attrs: [':data-src']
        }
      },
      {
        test: /\.js$/,
        loader: 'babel-loader?cacheDirectory',
        include: [path.resolve(__dirname, '../shop'), path.resolve(__dirname, '../admin'),
         path.resolve(__dirname, '../ship'),
         path.resolve(__dirname, '../erp'),
         path.resolve(__dirname, '../common')]
      },
      {
        test: /\.(png|jpg|jpeg|gif|svg)(\?.*)?$/,
        loader: 'url-loader',
        query: {
          limit: 10000,
          name: utils.assetsPath('img/[name].[hash:7].[ext]')
        }
      },
      {
        test: /\.(woff2?|eot|ttf|otf)(\?.*)?$/,
        loader: 'url-loader',
        query: {
          limit: 10000,
          name: utils.assetsPath('fonts/[name].[hash:7].[ext]')
        }
      }
    ]
  }
}
}
