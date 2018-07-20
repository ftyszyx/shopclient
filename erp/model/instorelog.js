import global from 'src/global.js'
// 数据
const data = {
  list: []
}


data.fieldList = [
  { name: 'id', title: 'id', sort: 2, width: '70px' },
  { name: 'order', title: '订单号', search: 'LIKE', tablename: 'instore_log.order', width: '200px' },
  { name: 'user_name', title: '用户', search: 'LIKE', tablename: 'user.name', width: '70px' },
  { name: 'type', title: '类型', selectList: global.inStoreType, tablename: 'instore_log.type', width: '80px' },
  { name: 'time', title: '时间', sort: 2, type: 'time', width: '150px' },
  { name: 'itemid', title: '商品id' },
  { name: 'item_name', title: '商品名', search: 'LIKE', tablename: 'item.name' },
  { name: 'item_code', title: '商品代码', search: 'LIKE', tablename: 'item.code', width: '80px' },
  { name: 'store_id', title: '仓库', selectList: [], tablename: 'instore_log.store_id' },
  { name: 'store_name', title: '仓库名', search: 'LIKE', tablename: 'store.name' },
  { name: 'before_num', title: '期初数量', width: '80px' },
  { name: 'after_num', title: '期末数量', width: '80px' },
  { name: 'change_num', title: '变化数量', width: '80px' }
]
data.initData = function(item) {
}
export default data;