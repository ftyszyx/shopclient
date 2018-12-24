
import global from 'src/global.js'
// 数据
const data = {
  list: []
}


data.fieldList = [
  { name: 'id', title: 'id', sort: 0 },
  { name: 'title', title: '标题', changeable: true, sort: 0, search: 'LIKE', rules: [{ required: true, message: '请输入类型名' }] },
  { name: 'build_user', title: '创建人', sort: 0, width: '100px' },
  { name: 'build_time', title: '创建时间', sort: 0, type: 'time', width: '150px' },
  { name: 'typename', title: '类型', sort: 0, width: '150x' },
  { name: 'type', title: '类型', changeable: true, sort: 0, cascaderList: [] },
  { name: 'order_id', title: '排序id', changeable: true, type: 'number' },
  { name: 'summary', title: '摘要', changeable: true, type: 'text' },
  { name: 'pic', title: '文章展示图片', changeable: true, type: 'pic', width: '150px' },
  { name: 'is_del', title: '是否废弃', sort: 0, selectList: global.deleteStatus, width: '80px' },

  { name: 'content', title: '内容', changeable: true, type: 'post' }

]
data.initData = function(item) {
  item.is_del = parseInt(item.is_del)
  item.order_id = parseInt(item.order_id)
}

export default data;
