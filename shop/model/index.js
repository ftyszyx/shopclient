import user from './user.js'
import app from './app.js'
import itemtype from 'admin/model/shop_itemtype.js'
import item from 'admin/model/shop_item.js'
import order from 'admin/model/shop_order.js'
// 所有模块的数据
const models = {
  user,
  itemtype,
  item,
  order,
  app
}

export default models;