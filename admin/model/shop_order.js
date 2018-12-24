import global from 'src/global'
// 数据
const data = {
  list: []
}

data.fieldList = [
        { name: 'id', title: '订单号', width: '140px', sort: 0, tablename: 'order.id' },
        { name: 'shipment_num', title: '物流单号', changeable: false, search: 'LIKE', tablename: 'order.shipment_num' },
        { name: 'itemid', title: '商品id', tablename: 'order.itemid' },
        { name: 'pay_type', title: '支付方式', width: '130px', changeable: true, tablename: 'order.pay_type', selectList: global.orderPayType },
        { name: 'pay_check_info', title: '支付审核备注', width: '130px', tablename: 'order.pay_check_info', selectList: global.orderCheckInfoType },
        { name: 'unitprice', title: '单价' },
        { name: 'num', title: '数量' },
        { name: 'itemcode', title: '商品编码', tablename: 'order.itemcode' },
        { name: 'itemname', title: '商品名', search: 'LIKE', tablename: 'item.name' },
        { name: 'itempic', title: '图片', type: 'pic' },

        { name: 'specname', title: '规格名' },

        { name: 'pay_time', title: '支付时间', sort: 0, type: 'time', tablename: 'order.pay_time' },
        { name: 'order_time', title: '下单时间', sort: 2, type: 'time', tablename: 'order.order_time' },
        { name: 'close_time', title: '关闭时间', sort: 0, type: 'time', tablename: 'order.close_time' },
        { name: 'status', title: '状态', selectList: global.orderStatus, width: '80px', tablename: 'order.status' },
        { name: 'client_name', title: '收件人姓名', search: 'LIKE', width: '120px', changeable: true, tablename: 'order.client_name' },
        { name: 'client_address', title: '收件人地址', search: 'LIKE', width: '120px', changeable: true, tablename: 'order.client_address' },
        { name: 'user_id', title: '会员id', tablename: 'order.user_id' },
        { name: 'member_name', title: '会员昵称', search: 'LIKE', tablename: 'member.name' },
        { name: 'member_account', title: '会员账号', search: 'LIKE', tablename: 'member.account' },
        { name: 'idnum', title: '身份证', search: 'LIKE', changeable: true, tablename: 'order.idnum' },
        { name: 'idnumpic1', title: '身份证正面', type: 'pic', changeable: true },
        { name: 'idnumpic2', title: '身份证反面', type: 'pic', changeable: true },
        { name: 'client_phone', title: '收件人手机', width: '120px', search: 'LIKE', changeable: true, tablename: 'order.client_phone' },
        { name: 'close_info', title: '卖家关闭备注' },
        { name: 'refund_info', title: '退款备注' },
        { name: 'close_type', title: '关闭类型', selectList: global.orderCloseStatus },
        { name: 'client_close_info', title: '买家关闭备注' },
        { name: 'sell_info', title: '卖家备注' },
        { name: 'pay_id', title: '支付id', tablename: 'order.pay_id' },
        { name: 'client_info', title: '买家备注', changeable: true },
        { name: 'total_price', title: '总金额', width: '100px', changeable: true },
        { name: 'total_price_before', title: '原金额', width: '100px' },
        { name: 'client_provice', title: '省', changeable: true, search: 'LIKE', tablename: 'order.client_provice' },
        { name: 'order_vip_type', title: 'vip类型', selectList: global.sellVIPType, changeable: true, tablename: 'order.order_vip_type' },
        { name: 'service_price', title: '服务费' },
        { name: 'freight_price', title: '运费' },
        { name: 'client_city', title: '市', changeable: true, search: 'LIKE', tablename: 'order.client_city' },
        { name: 'client_area', title: '区', changeable: true, search: 'LIKE', tablename: 'order.client_area' },
        { name: 'is_sync_shipnum', title: '是否同步物流' },
        { name: 'paycode_money', title: '支付码金额', width: 120, tablename: 'paycode.money' },
        { name: 'supply_source', title: '发货方式', width: 100, changeable: true, selectList: global.supply_source_type, tablename: 'order.supply_source' },
        { name: 'member_track_admin', title: '跟单员', selectList: [], tablename: 'member.track_admin' },
        { name: 'member_track_admin_name', title: '跟单员名',tablename: 'track_admin_member.name' },
        { name: 'send_user_name', title: '发件人', changeable: true, width: '120px', tablename: 'order.send_user_name' },
        { name: 'send_user_phone', title: '发件人手机', changeable: true, width: '130px', tablename: 'order.send_user_phone' }


]

data.gettotalprice = function(price, num) {
  price = parseFloat(price)
  num = parseInt(num)
  const totalprice = price * num
  return totalprice
}


data.getservicemoney = function(num, viptype) {
  const numint = parseInt(num)
  const viptype_int = parseInt(viptype)

  if (viptype_int === global.sellVIPTypePic) {
    return Math.ceil(numint / 3) * 5;
  } else if (viptype_int === global.sellVIPTypevideo) {
    return Math.ceil(numint / 3) * 10;
  }
  return 0
}

data.getfrightmoney = function(num, provice, supply) {
  if (!provice) {
    return 0
  }
  if (supply && ((supply + '') === global.supply_source_type_baoshui)) {
    if ((provice + '') !== '') {
      if ((provice.indexOf('青海') >= 0) || (provice.indexOf('西藏') >= 0) || (provice.indexOf('新疆') >= 0) ||
      (provice.indexOf('宁夏') >= 0 || (provice.indexOf('甘肃') >= 0) || (provice.indexOf('内蒙古') >= 0))) {
        return num * 10;
      }
    }
  } else {
    if ((provice + '') !== '') {
      if ((provice.indexOf('青海') >= 0) || (provice.indexOf('西藏') >= 0) || (provice.indexOf('新疆') >= 0)) {
        return Math.ceil(num / 3) * 50;
      }
    }
  }


  return 0
}

data.initData = function(item) {
  // item.status = parseInt(item.status)
  item.pay_time = parseInt(item.pay_time)
  item.is_sync_shipnum = parseInt(item.is_sync_shipnum)
  // item.item_info = JSON.parse(item.item_info)
  item.check = false
  if (item.shipment_num) {
    item.shipment_num = JSON.parse(item.shipment_num) || []
  } else {
    item.shipment_num = []
  }

  // const price = parseFloat(item.item_info.price)
  // const num = parseInt(item.item_info.num)
  item.unitprice = parseFloat(item.unitprice)
  item.service_price = parseFloat(item.service_price)
  item.freight_price = parseFloat(item.freight_price)
  item.total_price_before = data.gettotalprice(item.unitprice, item.num) + item.service_price + item.freight_price
  item.total_price = parseFloat(item.total_price)
  item.order_time = parseInt(item.order_time)
  item.order_vip_type = parseInt(item.order_vip_type)
  item.close_time = parseInt(item.close_time)
  // item.order_vip_moeny = this.getvipmoney(item.num, item.order_vip_type)
}

export default data;
