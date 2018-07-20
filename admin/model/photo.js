
// 数据
const data = {
  list: []
}


data.fieldList = [
    { name: 'id', title: 'id', changeable: false },
    { name: 'name', title: '名称', changeable: true, search: 'LIKE', rules: [{ required: true, message: '请输入类型名' }] },
    { name: 'path', title: '路径' },
    { name: 'key', title: 'key' },
    { name: 'upload_time', title: '上传时间', type: 'time' },
    { name: 'album_name', title: '相册名' },
    { name: 'upload_user_name', title: '上传管理员名' },
    { name: 'upload_user', title: '上传管理员' },
    { name: 'width', title: '宽' },
    { name: 'height', title: '高' },
    { name: 'album', title: '相册', changeable: true, selectList: [] },
    { name: 'order_id', title: '排序id', changeable: true, type: 'number' }
]

data.initData = function(item) {
  // item.is_del = parseInt(item.is_del)
  item.order_id = parseInt(item.order_id)
}

export default data;
