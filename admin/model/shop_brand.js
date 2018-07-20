import global from 'src/global'
import { all } from 'common/api'
import util from 'common/utils'
// 数据
const data = {
  list: []
}

data.fieldList = [
      { name: 'id', title: 'id' },
      { name: 'name', title: '名称', changeable: true, sort: 0, rules: [{ required: true, message: '请输入名称' }] },
      { name: 'order_id', title: '排序id', changeable: true, type: 'number' },
      { name: 'is_del', title: '是否废弃', selectList: global.deleteStatus },
      { name: 'pic', title: '图片', changeable: true, type: 'pic' }

]


data.all = function() {
  all('ShopBrand', null, null, null, { is_del: 0 }).then(Response => {
    util.copyList(Response.list, this.list, data.initData)
  })
  .catch(error => {
    console.log('error', error);
  })
}
data.initData = function(item) {
  item.is_del = parseInt(item.is_del)
  item.order_id = parseInt(item.order_id)
}
export default data;
