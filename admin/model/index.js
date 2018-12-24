import user from './user.js'
import userGroup from './user_group.js'
import module from './module.js'
import config from './config.js'
import exportConf from './export_conf.js'
import log from './log.js'
import app from './app.js'
import database from './database.js'
import post from './post.js'
import posttype from './posttype.js'
import album from './album.js'
import photo from './photo.js'
import ads from './ads.js'
import adspos from './ads_pos'
import shopbrand from './shop_brand'
import shopitemtype from './shop_itemtype'
import shoptag from './shop_tag'
import shopitem from './shop_item'
import shopnotice from './shop_notice'
import shoporder from './shop_order'
import exportTable from './export_table'
import logistics from './logistics'
import paycode from './paycode'
import logistics_task from './logistics_task'

// 所有模块的数据
const models = {
  user,
  paycode,
  module,
  userGroup,
  config,
  exportConf,
  log,
  database,
  post,
  posttype,
  album,
  ads,
  adspos,
  photo,
  shopbrand,
  shopnotice,
  shopitemtype,
  shopitem,
  shoporder,
  shoptag,
  exportTable,
  logistics,
  logistics_task,
  app
}

export default models;