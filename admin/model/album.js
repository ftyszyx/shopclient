import { all } from 'common/api'
import util from 'common/utils'
// 数据
const data = {
  list: []
}

data.fieldList = [
    { name: 'id', title: 'id', changeable: false },
    { name: 'name', title: '名称', changeable: true, search: 'LIKE', rules: [{ required: true, message: '请输入类型名' }] },
    { name: 'default', title: '是否默认', selectList: global.defaultStatus },
    { name: 'cover_pic', title: '封面图片' },
    { name: 'cover_pic_path', title: '封面图片' },
    { name: 'is_del', title: '是否废弃', selectList: global.deleteStatus },
    { name: 'order_id', title: '排序id', changeable: true, type: 'number' }
]


data.all = function() {
  all('album', null, null, null, { is_del: 0 }).then(Response => {
    util.copyList(Response.list, this.list, data.initData)
  })
    .catch(error => {
      console.log('error', error);
    })
}
data.initData = function(item) {
  item.is_del = parseInt(item.is_del)
  item.default = parseInt(item.default)
  item.order_id = parseInt(item.order_id)
}



export default data;