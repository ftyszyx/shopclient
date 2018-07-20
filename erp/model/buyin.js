import global from 'src/global.js'
// 数据
const data = {
  list: []
}

data.fieldList = [
  { name: 'id', title: '采购单号', width: '200px', tablename: 'buyin.id' },
  { name: 'check_status', title: '审核状态', sort: 0, selectList: global.checkStatus, width: '80px', tablename: 'buyin.check_status' },
  { name: 'in_store_status', title: '入库状态', sort: 0, selectList: global.inStoreStatus, width: '80px', tablename: 'buyin.in_store_status' },
  { name: 'close_status', title: '废弃状态', sort: 0, selectList: global.deleteStatus, width: '80px', tablename: 'buyin.close_status' },
  { name: 'supplier', title: '供应商名', changeable: true, search: 'LIKE', tablename: 'buyin.supplier', rules: [{ required: true, message: '请输入供应商名' }], width: '80px' },
  { name: 'store_id', title: '仓库', changeable: true, selectList: [], width: '80px', tablename: 'buyin.store_id' },
  { name: 'store_name', title: '仓库名', width: '100px', tablename: 'store.store_name' },
  { name: 'build_time', title: '创建时间', sort: 2, type: 'time', width: '150px', tablename: 'buyin.build_time' },
  { name: 'build_user', title: '创建人', width: '80px', tablename: 'buyin.build_user' },
  { name: 'build_user_name', title: '创建人', search: 'LIKE', width: '80px', tablename: 'build_user.build_user_name' },
  { name: 'check_user', title: '审核人', changeable: true, width: '80px', selectList: [], tablename: 'buyin.name' },
  { name: 'item_info', title: '商品详情', changeable: true, tablename: 'buyin.item_info' },
  { name: 'check_user_name', title: '审核人', search: 'LIKE', width: '80px', tablename: 'check_user.name' },
  { name: 'info', title: '备注', changeable: true, width: '150px', tablename: 'buyin.info' }
]
data.initData = function(item) {
}
export default data;