import user from './user.js'
import module from './module.js'
import userGroup from './usergroup.js'
import item from './item.js'
import itemType from './itemtype.js'
import store from './store.js'
import storeItem from './storeitem.js'
import shop from './shop.js'
import buyIn from './buyin.js'
import buyOut from './buyout.js'
import buyInStore from './buyinstore.js'
import shopType from './shoptype.js'
import sell from './sell.js'
import sellAssign from './sellassign.js'
import storeChange from './storechange.js'
import config from './config.js'
import exportConf from './exportconf.js'
import log from './log.js'
import app from './app.js'
import database from './database.js'
import inStoreLog from './instorelog.js'

// 所有模块的数据
const models = {
  user,
  module,
  userGroup,
  inStoreLog,
  item,
  itemType,
  store,
  storeItem,
  shop,
  buyIn,
  buyOut,
  buyInStore,
  shopType,
  sell,
  sellAssign,
  storeChange,
  config,
  exportConf,
  log,
  database,
  app
}

export default models;