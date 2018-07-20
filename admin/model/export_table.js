
// 数据
const data = {
  list: []
}

data.fieldList = [
    { name: 'id', title: 'id' },
    { name: 'user_id', title: '用户' },
    { name: 'user_name', title: '用户', search: 'LIKE', tablename: 'user.name' },
    { name: 'build_time', title: '时间', type: 'time', sort: 2 },
    { name: 'path', title: '路径' },
    { name: 'name', title: '名' }
]




export default data;