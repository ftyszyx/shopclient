import { all } from 'common/api'
import util from 'common/utils'
// 数据
const data = {
  list: []
}


data.fieldList = [
  { name: 'id', title: 'id' },
  { name: 'name', title: '名称', changeable: true },
  { name: 'shop_type', title: '商店类型', changeable: true, selectList: [] },
  { name: 'shop_type_name', title: '商店类型名', changeable: false },
  { name: 'shop_edit_url', title: '同步商店网址', changeable: true, type: 'text' },
  { name: 'valid_expire_time', title: '有效时间', type: 'time' }
]
data.initData = function(item) {
}

data.all = function() {
  all('shop').then(Response => {
    util.copyList(Response.list, this.list)
  })
  .catch(error => {
    console.log('error', error);
  })
}
export default data;