import global from 'src/global.js'
// 数据
const data = {
  list: []
}


data.fieldList = [
  { name: 'id', title: '配货单号', tablename: 'sell_assign.id', width: '200px' },
  { name: 'close_status', title: '废弃状态', sort: 0, selectList: global.commonDel, width: '80px' },
  { name: 'order_info', title: '订单详情', search: 'LIKE', tablename: 'sell_assign.order_info', width: '150px' },
  { name: 'build_time', title: '创建时间', sort: 2, type: 'time', width: '150px' },
  { name: 'build_user', title: '创建人', width: '80px' },
  { name: 'build_user_name', title: '创建人', width: '80px' },
  { name: 'total_num', title: '总罐数', width: '80px' },
  { name: 'store_id', title: '仓库', tablename: 'sell_assign.store_id', width: '80px', selectList: [] },
  { name: 'store_name', title: '仓库', search: 'LIKE', tablename: 'store.store_id', width: '80px' },
  { name: 'info', title: '备注', width: '200px', search: 'LIKE', changeable: true, type: 'text' },
  { name: 'del_info', title: '废弃原因', width: '200px', search: 'LIKE' }
]
data.initData = function(item) {
}
export default data;