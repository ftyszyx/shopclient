// import global from 'src/global'
import { all } from 'common/api'
import util from 'common/utils'
// 数据
const data = {
  list: []
}

// width: '80px', tablename: 'order.status'
data.fieldList = [
      { name: 'id', title: 'id' },
      { name: 'name', title: '名字', changeable: true },
      { name: 'tasklist', title: '进度任务', changeable: true, deepcopy: true }
]

// [{use_time:112s,info:"21312"}]
data.initData = function(item) {
  if (item.tasklist) {
    item.tasklist = JSON.parse(item.tasklist) || []
  } else {
    item.tasklist = []
  }
}


data.all = function() {
  all('LogisticsTask', null, null, null).then(Response => {
    util.copyList(Response.list, this.list, this.initData)
  })
  .catch(error => {
    console.log('error', error);
  })
}

export default data