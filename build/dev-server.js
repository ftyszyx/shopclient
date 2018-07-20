require('./check-versions')(); // 检查 Node 和 npm 版本
const config = require('./config');
if (!process.env.NODE_ENV) {
  process.env.NODE_ENV = JSON.parse(config.dev.env.NODE_ENV)
}

const path = require('path');
const express = require('express');
const webpack = require('webpack');
// const proxyMiddleware = require('http-proxy-middleware');


const webpackConfig = require('./webpack.dev.conf')();

let port =config.listenport;

const app = express();
const compiler = webpack(webpackConfig);

const devMiddleware = require('webpack-dev-middleware')(compiler, {
  publicPath: webpackConfig.output.publicPath,
  quiet: true
});

const hotMiddleware = require('webpack-hot-middleware')(compiler, {
  log: console.log
});

// force page reload when html-webpack-plugin template changes
compiler.plugin('compilation', compilation => {
  compilation.plugin('html-webpack-plugin-after-emit', (data, cb) => {
    hotMiddleware.publish({ action: 'reload' });
    cb()
  })
});


// handle fallback for HTML5 history API
app.use(require('connect-history-api-fallback')());

// serve webpack bundle output
app.use(devMiddleware);

// enable hot-reload and state-preserving
// compilation error display
app.use(hotMiddleware);

// serve pure static assets
const staticPath = path.posix.join(config.dev.assetsPublicPath, config.dev.assetsSubDirectory);
console.log('staticpath', staticPath, path.join(__dirname, '../'+config.webpath+'/static'));
app.use(staticPath, express.static(path.join(__dirname, '../'+config.webpath+'/static')));



const uri = 'http://localhost:' + port

devMiddleware.waitUntilValid(() => {
  console.log('> Listening at ' + uri + '\n')
});

module.exports = app.listen(port, err => {
  if (err) {
    console.log(err);
    return
  }
});
