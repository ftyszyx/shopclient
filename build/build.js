// 生成前端页面
require('./check-versions')();
const opn = require('opn')
const ora = require('ora')
const rm = require('rimraf')
const path = require('path')
const chalk = require('chalk')
const webpack = require('webpack');
const config = require('./config');



const webpackConfig = require('./webpack.prod.conf')(config.webpath);
console.log('env', process.env.NODE_ENV,path.join(config.build.assetsRoot,config.webpath))
const spinner = ora('building for ' + process.env.NODE_ENV + '...')
spinner.start()
rm(path.join(config.build.assetsRoot, config.outpath), err => {
  if (err) {
    console.log("err",err)  
    throw err
    return
  }
  webpack(webpackConfig, (err, stats) => {
    spinner.stop()
    if (err) {
      console.log("err",err)
      throw err
    }
    process.stdout.write(stats.toString({
      colors: true,
      modules: false,
      children: false,
      chunks: false,
      chunkModules: false
    }) + '\n\n')

    console.log(chalk.cyan('  Build complete.\n'))
  })
})
