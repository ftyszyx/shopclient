import { all } from 'common/api'
import util from 'common/utils'
import global from 'src/global.js'
// 数据
const data = {
  list: []
}


data.fieldList = [
  { name: 'id', title: 'id' },
  { name: 'name', title: '名称', changeable: true, rules: [{ required: true, message: '请输入名称' }] },
  { name: 'admin_name', title: '管理员名', changeable: true, width: '80px' },
  { name: 'phone', title: '手机', changeable: true, width: '80px' },
  { name: 'address', title: '地址', changeable: true, width: '80px' },
  { name: 'sell_num_limit', title: '审核数量限制', changeable: true, width: '100px' },
  { name: 'check_rule', title: '审核规则' },
  { name: 'same_store', title: '关联仓库', changeable: true, tablename: 'store.same_store', selectList: [] },
  { name: 'same_store_name', title: '关联仓库', tablename: 'same_store.name' },
  { name: 'is_del', title: '状态', selectList: global.deleteStatus },
  { name: 'period_rule', title: '是否区分段数审核', changeable: true, type: 'bool' }
]



// 获取所有的商品
data.all = function() {
  all('store').then(Response => {
    util.copyList(Response.list, this.list)
  })
  .catch(error => {
    console.log('error', error);
  })
}

data.initData = function(item) {
}
export default data;