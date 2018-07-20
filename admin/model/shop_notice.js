import global from 'src/global'
// 数据
const data = {
  list: []
}

data.fieldList = [
      { name: 'id', title: 'id' },
      { name: 'title', title: '标题', changeable: true, search: 'LIKE', sort: 0, rules: [{ required: true, message: '请输入名称' }] },

      { name: 'order_id', title: '排序id', changeable: true, sort: 2, type: 'number' },
      { name: 'build_time', title: '创建时间', sort: 2, type: 'date' },
      { name: 'is_del', title: '是否上线', changeable: true, selectList: global.onsaleStatus, sort: 0 },
      { name: 'content', title: '内容', changeable: true, type: 'post' }

]

data.initData = function(item) {
  item.is_del = parseInt(item.is_del)
  item.build_time = parseInt(item.build_time)
  item.order_id = parseInt(item.order_id)
}
export default data;
