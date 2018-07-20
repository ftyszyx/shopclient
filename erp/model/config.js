// import conf from 'src/config.js'

import { all } from 'common/api'
import util from 'common/utils'

// 数据
const data = {
  list: []
}

data.fieldList = [
  { name: 'id', title: '采购单号' },
  { name: 'name', title: '字段名' },
  { name: 'info', title: '名称' },
  { name: 'type', title: '类型' },
  { name: 'int_value', title: '整数' },
  { name: 'value', title: '值' }
]


data.all = function() {
  all('config').then(Response => {
    util.copyList(Response.list, this.list, item => {
      if (item.name === 'default_store' || item.name === 'sell_check_default_user') {
        item.value = parseInt(item.value);
      }
    })
  })
  .catch(error => {
    console.log('error', error);
  })
}
data.initData = function(item) {
}
export default data;