

// 数据
const data = {
  list: []
}

data.fieldList = [
  { name: 'id', title: 'id' },
  { name: 'name', title: '备份名', changeable: true, width: 200 },
  { name: 'path', title: '下载' },
  { name: 'file_num', title: '数量' },
  { name: 'time', title: '时间', type: 'time', width: 150, sort: 2 }
]
data.initData = function(item) {
}
export default data;
