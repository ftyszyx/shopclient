import { all } from 'common/api'
import util from 'common/utils'
import global from 'src/global.js'
// 数据
const data = {
  list: [],
  allList: {}
}


data.fieldList = [
  { name: 'id', title: 'id' },
  { name: 'name', title: '名称', changeable: true, search: 'LIKE', sort: 0, rules: [{ required: true, message: '请输入名称' }] },
  { name: 'barcode', title: '条码', changeable: true, search: 'LIKE', sort: 0, rules: [{ required: true, message: '请输入条码' }], width: '120px' },
  { name: 'code', title: '编码', changeable: true, search: 'LIKE', sort: 0, rules: [{ required: true, message: '请输入编码' }], width: '100px' },
  { name: 'build_time', title: '创建时间', type: 'time', sort: 0, width: '150x' },
  { name: 'short_name', title: '简称', changeable: true, search: 'LIKE', sort: 0, width: '100px' },
  { name: 'type', title: '类型', changeable: true, sort: 0, selectList: [] },
  { name: 'weight', title: '重量', changeable: true, type: 'number' },
  { name: 'sell_base_num', title: '拆单最小约数', changeable: true, type: 'number', width: '100px' },
  { name: 'milk_period', title: '牛奶段数', changeable: true, type: 'number', width: '80px' },
  { name: 'sort_id', title: '排序号', changeable: true, sort: 1, type: 'number', width: '100px' },
  { name: 'is_del', title: '状态', sort: 1, selectList: global.deleteStatus, width: '80px' },
  { name: 'check_limit', title: '审核限制', changeable: true, type: 'bool', width: '80px' },

  // 一些非数据表字段
  { name: 'num', title: '数量' },
  { name: 'in_store_num', title: '入库数量' },
  { name: 'price', title: '单价' },
  { name: 'total_price', title: '总价' }
]

// 获取所有的商品
data.all = function() {
  all('item').then(Response => {
    util.copyList(Response.list, this.allList)
  })
  .catch(error => {
    console.log('error', error);
  })
}
data.initData = function(item) {
  item.num = 0;
  item.price = 0;
  item.type = item.type+""
  item.in_store_num = 0;
  item.total_price = 0;
}
export default data;