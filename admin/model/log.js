
// 数据
const data = {
  list: []
}


data.fieldList = [
  { name: 'user_name', title: '操作人', sort: 0, tablename: 'user.name', width: 40, search: 'LIKE' },
  { name: 'module_name', title: '功能', sort: 0, tablename: 'module.name', width: 60 },
  { name: 'time', title: '时间', sort: 2, tablename: 'log.time', type: 'time', width: 40 },
  { name: 'module_id', title: '功能', tablename: 'module.id', selectList: [], width: 60 },
  { name: 'link', title: '链接', tablename: 'log.link', width: 40 },
  { name: 'info', title: '详细', tablename: 'log.info', width: 320, search: 'LIKE' }

]
data.initData = function(item) {
}

export default data;