
import util from 'common/utils'
import { all } from 'common/api'
// 数据
const data = {
  list: [],
  openMenus: [],
  topTypeList: []
}


data.fieldList = [
  { name: 'id', title: 'id' },
  { name: 'name', title: '名称', changeable: true, rules: [{ required: true, message: '请输入用名称' }] },
  { name: 'code', title: '编码', changeable: true, rules: [{ required: true, message: '请输入编码' }] },
  { name: 'info', title: '信息', changeable: true },
  { name: 'level', title: '层次' },
  { name: 'parent_id', title: '父节点', selectList: [], changeable: true, rules: [{ required: true, message: '请输入父节点' }] },
  { name: 'sort_id', title: '排序号', changeable: true, type: 'number', sort: 1, width: '50px' }
]


// 获取数据
data.all = function(cb) {
  all('item_type', null, null, null).then(
    Response => {
      Response.list.forEach(data.initData);
      util.updateCascaderChild(Response.list, this.list, this.openMenus, this.topTypeList)
      if (cb) {
        cb()
      }
    }
  ).catch(error => {
    console.log('error', error);
  });
}

data.GetSelecName = function(item) {
  let name = item.name
  for (let i = 1; i < item.level; i++) {
    name = '---' + name;
  }
  return name
}

data.initData = function(item) {
}

export default data;