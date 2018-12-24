// import global from 'src/global'
// 数据
const data = {
  list: []
}

// width: '80px', tablename: 'order.status'
data.fieldList = [
      { name: 'id', title: '支付码', width: '100px', tablename: 'paycode.id' },
      { name: 'order_list', title: '销售订单号', search: 'LIKE', tablename: 'paycode.order_list' },
      { name: 'money', title: '金额', width: '80px' },
      { name: 'user_id', title: '用户id', width: '80px' },
      { name: 'user_name', title: '用户昵称', width: '80px', search: 'LIKE', tablename: 'user.user_name' },
      { name: 'user_account', title: '用户账号', width: '120px' },
      { name: 'build_time', title: '创建时间', type: 'time', width: '150px', tablename: 'paycode.build_time' }
]


data.initData = function(item) {
  if (item.order_list) {
    item.order_list = JSON.parse(item.order_list) || []
  } else {
    item.order_list = []
  }
}

export default data