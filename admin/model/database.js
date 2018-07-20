

// 数据
const data = {
  list: []
}

data.fieldList = [
  { name: 'id', title: 'id' },
  { name: 'name', title: '备份名', width: 200, changeable: true },
  { name: 'build_time', title: '时间', type: 'time', width: 150, sort: 2 },
  { name: 'path', title: '下载' }
]

data.initData = function(item) {
}

export default data;
