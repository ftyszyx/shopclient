
import global from 'src/global.js'
import { all } from 'common/api'
import util from 'common/utils'
// 数据
const data = {
  list: []
}


data.fieldList = [
  { name: 'id', title: 'id', sort: 0 },
  { name: 'name', title: '名称', changeable: true, sort: 0, rules: [{ required: true, message: '请输入名称' }] },
  { name: 'is_del', title: '是否废弃', sort: 0, selectList: global.deleteStatus },
  { name: 'title', title: '标题', changeable: true },
  { name: 'title_pic', title: '标题图片', changeable: true, type: 'pic' }
]

data.all = function() {
  all('adspos', null, null, null, { is_del: 0 }).then(res => {
    util.copyList(res.list, this.list, item => {
      item.showtype = parseInt(item.showtype)
    })
  })
  .catch(error => {
    console.log('error', error);
  })
}

data.initData = function(item) {
  item.order_id = parseInt(item.order_id)
  item.showtype = parseInt(item.showtype)
}
export default data;
