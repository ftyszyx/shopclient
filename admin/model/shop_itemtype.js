import global from 'src/global'
import { all } from 'common/api'
import util from 'common/utils'
// 数据
const data = {
  list: [],
  topTypeList: [],
  dic: {},
  openMenus: []
}

data.fieldList = [
      { name: 'id', title: 'id' },
      { name: 'name', title: '名称', changeable: true, sort: 0, rules: [{ required: true, message: '请输入名称' }] },
      { name: 'pic', title: '图片', changeable: true, type: 'pic', info: '推荐图片大小250*250' },
      { name: 'order_id', title: '排序id', changeable: true, type: 'number' },
      { name: 'is_del', title: '是否上架', changeable: true, selectList: global.deleteStatus },
      { name: 'code', title: '编码', changeable: true, rules: [{ required: true, message: '请输入编码' }] },
      { name: 'info', title: '信息', changeable: true },
      { name: 'level', title: '层级' },
      { name: 'select_name', title: '用于筛选' },

      { name: 'parent_id', title: '父节点', changeable: true, selectList: [] },
      { name: 'intro_text', title: '详细信息(用于跳转到信息页面)', changeable: true, type: 'post' }
]


data.all = function(cb) {
  this.list.splice(0)// 清空
  this.allCommon(cb)
}

data.allCommon = function(cb, search) {
  all('ShopItemType', null, null, null, search).then(Response => {
    if (Response.list) {
      Response.list.forEach(data.initData);
      util.updateCascaderChild(Response.list, this.list, this.openMenus, this.topTypeList, this.dic)
    }
    if (cb) {
      cb()
    }
  })
  .catch(error => {
    console.log('ShopItemType error', error);
  })
}


data.GetSelecName = function(item) {
  let name = item.name
  for (let i = 1; i < item.level; i++) {
    name = '---' + name;
  }
  return name
}

data.initData = function(item) {
  item.level = parseInt(item.level)
  item.is_del = parseInt(item.is_del)
  item.order_id = parseInt(item.order_id)
  item.select_name = data.GetSelecName(item)
}

export default data;
