import { all } from 'common/api'
import util from 'common/utils'
import global from 'src/global.js'
// 数据
const data = {
  list: [],
  openMenus: [],
  topTypeList: []
}


data.fieldList = [
  { name: 'id', title: 'id', changeable: false },
  { name: 'name', title: '名称', changeable: true, search: 'LIKE', rules: [{ required: true, message: '请输入类型名' }] },
  { name: 'is_del', title: '是否废弃', changeable: false, selectList: global.deleteStatus },
  { name: 'order_id', title: '排序id', changeable: true, type: 'number' },
  { name: 'level', title: '层级' },
  { name: 'parent_id', title: '父类型', changeable: true }
]

data.all = function() {
  all('posttype', null, null, null, { is_del: 0 }).then(Response => {
    Response.list.forEach(this.initData);
    util.updateCascaderChild(Response.list, this.list, this.openMenus, this.topTypeList)
  })
  .catch(error => {
    console.log('error', error);
  })
}

data.initData = function(item) {
  item.level = parseInt(item.level)
  item.is_del = parseInt(item.is_del)
  item.order_id = parseInt(item.order_id)
}

export default data;
