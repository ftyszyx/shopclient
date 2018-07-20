import { all } from 'common/api'
import util from 'common/utils'
// 数据
const data = {
  list: []
}


data.fieldList = [
  { name: 'id', title: 'id',  },
  { name: 'name', title: '名称', changeable: true, rules: [{ required: true, message: '请输入用户组名' }] },
  { name: 'module_ids',  changeable: true, title: '权限'},
  { name: 'is_sys', title: '系统用户组'}
]

data.all = function() {
  all('user_group', null, null, null, { is_sys: 0 }).then(Response => {
    util.copyList(Response.list, this.list)
  })
  .catch(error => {
    console.log('error', error);
  })
}

data.initData = function(item) {
}
export default data;
