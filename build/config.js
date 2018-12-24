// see http://vuejs-templates.github.io/webpack for documentation.
const path = require('path')

const program = require('commander');
program
.version('0.1.0')
.option('--web [value]', 'set webname')
.option('--port [value]', 'set port')
.option('--out [value]', 'set outfile')
.option('--config [value]', 'set configfile')
.option('--router [value]', 'set routerfile')
.option('--html [value]', 'set html name')
.parse(process.argv);
if(!program.out){
  program.out=program.web
}
if(!program.config){
  program.config="config.js"
}

if(!program.router){
  program.router="index.js"
}

if(!program.html){
  program.html=program.web
}


console.log('html', program.html)
console.log('webname', program.web)
console.log('out', program.out)
console.log('port', program.port)
console.log('config', program.config)
console.log('router', program.router)

module.exports = {
  webpath:program.web,
  outpath:program.out,
  listenport:program.port,
  configfile:program.config,
  routerfile:program.router,
  html:program.html,
  build: {
    prodEnv: 'development',
    index: path.resolve(__dirname, '../dist'),
    assetsRoot: path.resolve(__dirname, '../dist'), // 输出目录
    assetsSubDirectory: 'static',
    assetsPublicPath: '/', // 生产环境assetsPublicPath: '/'  等于根目录
    staticPath: '/static/', // 生产环境 staticPath:''
    productionSourceMap: true,
    productionGzip: false,
    productionGzipExtensions: ['js', 'css'],
    bundleAnalyzerReport: process.env.report
  },
  dev: {
    env: 'production',
    port: 8100,
    autoOpenBrowser: false,
    assetsSubDirectory: 'static',
    assetsPublicPath: '/',
    staticPath: '/static/',
    cssSourceMap: false
  }
}
