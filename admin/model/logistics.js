import global from 'src/global'
// 数据
const data = {
  list: []
}

// width: '80px', tablename: 'order.status'
data.fieldList = [
      { name: 'id', title: '物流单号', changeable: true, width: '120px', search: 'LIKE', rules: [{ required: true, message: '物流单号' }] },
      { name: 'state', title: '进度状态', changeable: true, selectList: global.ShipStatus, width: '80px' },
      { name: 'build_time', title: '创建时间', sort: 2, type: 'time', width: '150px' },
      { name: 'sync_erp_flag', title: '同步状态', selectList: global.syncShopFlag, width: '70px' },
      { name: 'client_name', changeable: true, search: 'LIKE', title: '姓名', width: '70px', rules: [{ required: true, message: '收件人必须' }] },
      { name: 'client_phone', title: '电话', search: 'LIKE', changeable: true, width: '100px', rules: [{ required: true, message: '收件人电话必须' }] },
      { name: 'client_address', title: '地址', search: 'LIKE', changeable: true, width: '130px', rules: [{ required: true, message: '收件人地址必须' }] },
      { name: 'internal_ship_company_code', title: '国内快递', changeable: true, width: '100px', selectList: global.logisticsCompany },
      { name: 'internal_ship_num', search: 'LIKE', title: '国内快递号', changeable: true, width: '140px' },
      { name: 'logistics_task_starttime', title: '海外进度开始时间', changeable: true, type: 'time' },
      { name: 'idnum', changeable: true, search: 'LIKE', title: '身份证号', width: '160px' },
      { name: 'idnumpic1', changeable: true, title: '身份证正面', type: 'pic' },
      { name: 'idnumpic2', changeable: true, title: '身份证反面', type: 'pic' },
      { name: 'logistics_task', changeable: true, title: '物流进度', deepcopy: true }

]

// logistics_task
// {use_time:112s,info:"21312",check:false,time:12233}
data.initData = function(item) {
  if (item.info_oversea) {
    item.info_oversea = JSON.parse(item.info_oversea) || []
  } else {
    item.info_oversea = []
  }
  if (item.logistics_task) {
    item.logistics_task = JSON.parse(item.logistics_task) || []
  } else {
    item.logistics_task = []
  }
}

export default data