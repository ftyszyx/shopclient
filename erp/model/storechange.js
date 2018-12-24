import global from 'src/global.js'
// 数据
const data = {
  list: []
}


data.fieldList = [
  { name: 'id', title: '调货单号' },
  { name: 'check_status', title: '审核状态', sort: 0, selectList: global.checkStatus },
  { name: 'close_status', title: '废弃状态', sort: 0, selectList: global.commonDel },
  { name: 'in_store', title: '调入仓库', changeable: true, selectList: [] },
  { name: 'in_store_name', title: '调入仓库' },
  { name: 'out_store', title: '调出仓库', changeable: true, selectList: [] },
  { name: 'out_store_name', title: '调出仓库' },
  { name: 'item_info', title: '商品详情', changeable: true },
  { name: 'build_time', title: '创建时间', sort: 0, type: 'time' },
  { name: 'build_user', title: '创建人' },
  { name: 'build_user_name', title: '创建人', search: 'LIKE', tablename: 'build_user.name' },
  { name: 'check_user', title: '审核人', changeable: true, selectList: [] },
  { name: 'check_user_name', title: '审核人', search: 'LIKE', tablename: 'check_user.name' },

  { name: 'info', title: '备注', changeable: true, sort: 0 }
]
data.initData = function(item) {
}
export default data;