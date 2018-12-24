import global from 'src/global.js'
// 数据
const data = {
  list: []
}


data.fieldList = [
  { name: 'id', title: '销售单号', sort: 2, tablename: 'sell.id', width: '200' },
  { name: 'status', title: '状态', sort: 0, selectList: global.sellStatus },
  { name: 'refund_status', title: '退款状态', sort: 0, selectList: global.refundStatus },
  { name: 'pay_status', title: '支付状态', sort: 0, selectList: global.payStatus },

  { name: 'shop_id', title: '商店', selectList: [], tablename: 'sell.shop_id' },
  { name: 'shop_name', title: '平台名称', search: 'LIKE', tablename: 'shop.name' },
  { name: 'shop_order', title: '平台订单号', tablename: 'sell.shop_order', width: '120' },

  { name: 'customer_name', title: '收件人姓名', changeable: true, search: 'LIKE', tablename: 'sell.customer_name' },
  { name: 'customer_addr', title: '收件人地址', changeable: true, width: 200, search: 'LIKE', tablename: 'sell.customer_addr' },
  { name: 'customer_account', title: '买家账号', search: 'LIKE', tablename: 'sell.customer_account' },
  { name: 'user_info', title: '买家备注', search: 'LIKE', tablename: 'sell.user_info', changeable: true },
  { name: 'pay_time', title: '支付时间', sort: 0, type: 'time', changeable: true, width: '120', tablename: 'sell.pay_time' },
  { name: 'discount', title: '折扣', width: '60' },
  { name: 'user_phone', title: '收件人电话', search: 'LIKE', changeable: true, width: '100' },
  { name: 'pay_money', title: '支付金额' },

  { name: 'store_id', title: '仓库', changeable: false, tablename: 'sell.store_id', selectList: [] },
  { name: 'store_name', title: '仓库名', tablename: 'store.name' },


  { name: 'build_time', title: '创建时间', sort: 0, type: 'time' },
  { name: 'build_user', title: '创建人' },
  { name: 'build_user_name', title: '创建人', search: 'LIKE', tablename: 'build_user.name' },
  { name: 'check_user', title: '审核人', changeable: false },
  { name: 'check_time', title: '审核时间', type: 'time' },
  { name: 'check_user_name', title: '审核人', search: 'LIKE', tablename: 'check_user.name' },

  { name: 'item_id', title: '商品' },
  { name: 'item_name', title: '商品名', search: 'LIKE', sort: 0, tablename: 'item.name', width: '200' },
  { name: 'item_short_name', title: '商品简称', search: 'LIKE', tablename: 'item.short_name' },
  { name: 'num', title: '数量' },

  { name: 'del_info', title: '废弃原因' },
  { name: 'info', title: '备注', changeable: true },
  { name: 'in_store_num', title: '在库数量' },
  { name: 'idnumpic1', title: '身份证正面', type: 'pic', changeable: true },
  { name: 'idnumpic2', title: '身份证反面', type: 'pic', changeable: true },
  { name: 'sell_type', title: '报关标识', changeable: false, selectList: global.sellType },
  { name: 'logistics', title: '物流单号', search: 'LIKE', changeable: true },
  { name: 'track_man', title: '跟单员标识', changeable: true, search: 'LIKE', tablename: 'sell.track_man' },
  { name: 'sell_vip_type', title: '特殊要求', selectList: global.sellVIPType },
  { name: 'sell_vip_info', title: '特殊要求信息', changeable: true },
  { name: 'item_milk_period', title: '段数', changeable: false },
  { name: 'logistics_merge', title: '合单单号', width: '200' },
  { name: 'order_time', title: '下单时间', type: 'time', changeable: true, width: '120', tablename: 'sell.order_time' },
  { name: 'item_sort_id', title: '商品排序', type: 'number', tablename: 'item.sort_id' }, //
  { name: 'item_type_sort_id', title: '商品类型排序', type: 'number', tablename: 'item_type.sort_id' },
  { name: 'customer_province', title: '省', tablename: 'sell.customer_province' },
  { name: 'customer_city', title: '市', tablename: 'sell.customer_city' },
  { name: 'customer_area', title: '区', tablename: 'sell.customer_area' },
  { name: 'send_user_name', title: '发件人姓名', tablename: 'sell.send_user_name' },
  { name: 'send_user_phone', title: '发件人手机', tablename: 'sell.send_user_phone' },
  { name: 'unit_price', title: '商品单价', tablename: 'sell.unit_price' },
  { name: 'freight_price', title: '运费', tablename: 'sell.freight_price' },
  { name: 'service_price', title: '服务费', tablename: 'sell.service_price' },
  { name: 'freight_unit_price', title: '运费单价', tablename: 'sell.freight_unit_price' },
  { name: 'service_unit_price', title: '服务费单价', tablename: 'sell.service_unit_price' },
  { name: 'assign_order', title: '配货单单号', tablename: 'sell.assign_order' },

  { name: 'customer_username', title: '平台账号昵称', tablename: 'sell.customer_username' },
  { name: 'pay_id', title: '支付审核单号', tablename: 'sell.pay_id' },
  { name: 'supply_source', title: '发货方式', selectList: global.supply_source_type, tablename: 'sell.supply_source' },
  { name: 'shop_sync_flag', title: '同步状态', tablename: 'sell.shop_sync_flag', selectList: global.syncShopFlag },
  { name: 'customer_userid', title: '平台账号id', tablename: 'sell.customer_userid' },
  { name: 'pay_type', title: '支付方式', width: '130px', changeable: true, tablename: 'sell.pay_type', selectList: global.orderPayType },
  { name: 'pay_check_info', title: '支付审核备注', width: '130px', tablename: 'sell.pay_check_info' },

  { name: 'user_id_number', title: '买家身份证号', changeable: true }




]
data.initData = function(item) {
}
export default data;