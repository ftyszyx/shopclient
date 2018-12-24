import { all } from 'common/api'
import util from 'common/utils'
import global from 'src/global'
// 数据
const data = {
  list: []
}


data.fieldList = [
  { name: 'id', title: 'id', changeable: false },
  { name: 'name', title: '名称', changeable: true, sort: 0, rules: [{ required: true, message: '请输入用户组名' }] },
  { name: 'expire_time', title: '登录过期时间(单位s)', changeable: true, type: 'number' },
  { name: 'group_type', title: '类型', changeable: true, selectList: global.UserGroupType },
  { name: 'limit_show_order', title: '是否限制订单显示', changeable: true, selectList: global.OrderLimitShoweStatus },
  { name: 'module_ids', title: '权限', changeable: true }


]

data.all = function() {
  all('user_group', null, null, null, null).then(data => {
    util.copyList(data.list, this.list, this.initData)
  })
  .catch(error => {
    console.log('error', error);
  })
}

data.initData = function(item) {
  // item.group_type = item.group_type
  item.expire_time = parseInt(item.expire_time)
  if (item.group_type === global.SystemGroupType) {
    item.hide = true
  } else {
    item.hide = false
  }
}
export default data;
