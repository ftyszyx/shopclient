import global from 'src/global.js'
// 数据
const data = {
  list: []
}


data.fieldList = [
  { name: 'id', title: '入库单号', width: '200px', tablename: 'buyinstore.id' },
  { name: 'check_status', title: '审核状态', sort: 0, selectList: global.checkStatus, width: '80px', tablename: 'buyinstore.check_status' },
  { name: 'close_status', title: '废弃状态', sort: 0, selectList: global.deleteStatus, width: '80px', tablename: 'buyinstore.close_status' },
  { name: 'store_id', title: '仓库', selectList: [], width: '80px', tablename: 'buyinstore.store_id' },
  { name: 'store_name', title: '仓库名', width: '80px', tablename: 'store.name' },
  { name: 'buy_order', title: '采购订单号', changeable: true, width: '200px', tablename: 'buyinstore.buy_order' },
  { name: 'item_info', title: '商品详情', changeable: true, tablename: 'buyinstore.item_info' },
  { name: 'build_time', title: '创建时间', sort: 2, type: 'time', width: '150px', tablename: 'buyinstore.build_time' },
  { name: 'build_user', title: '创建人', width: '80px', tablename: 'buyinstore.build_user' },
  { name: 'build_user_name', title: '创建人', search: 'LIKE', tablename: 'build_user.name', width: '80px' },
  { name: 'check_user', title: '审核人', changeable: true, width: '80px', selectList: [], tablename: 'buyinstore.check_user' },
  { name: 'check_user_name', title: '审核人', search: 'LIKE', tablename: 'check_user.name', width: '80px' },

  { name: 'info', title: '备注', changeable: true, width: '150px' }
]

data.initData = function(item) {
}

export default data;