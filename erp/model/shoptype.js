import { all } from 'common/api'
import util from 'common/utils'
// 数据
const data = {
  list: []
}


data.fieldList = [
  { name: 'id', title: 'id' },
  { name: 'name', title: '名称', changeable: true }
]


data.all = function() {
  all('shop_type').then(Response => {
    util.copyList(Response.list, this.list)
  })
  .catch(error => {
    console.log('error', error);
  })
}

data.initData = function(item) {
}
export default data;