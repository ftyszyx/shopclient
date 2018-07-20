import global from 'src/global'
// 数据
const data = {
  list: []
}

data.fieldList = [
        { name: 'id', title: '订单号', sort: 0 },
        { name: 'shipment_num', title: '物流单号', changeable: false },
        { name: 'item_info', title: '商品详情', width: 200 },
        { name: 'pay_time', title: '支付时间', type: 'time' },
        { name: 'order_time', title: '下单时间', type: 'time' },
        { name: 'close_time', title: '关闭或结束时间', type: 'time' },
        { name: 'status', title: '状态', selectList: global.orderStatus, width: 60 },
        { name: 'client_name', title: '收件人姓名', search: 'LIKE', changeable: true },
        { name: 'client_address', title: '收件人地址', search: 'LIKE', changeable: true },
        { name: 'user_id', title: '会员id' },
        { name: 'member_name', title: '会员名', search: 'LIKE' },
        { name: 'idnum', title: '收件人身份证号', search: 'LIKE', changeable: true },
        { name: 'idnumpic1', title: '身份证号正面', type: 'pic', changeable: true },
        { name: 'idnumpic2', title: '身份证号反面', type: 'pic', changeable: true },

        { name: 'client_phone', title: '收件人手机号', search: 'LIKE', changeable: true },
        { name: 'close_info', title: '交易关闭卖家备注' },
        { name: 'close_type', title: '交易关闭类型', selectList: global.orderCloseStatus },
        { name: 'client_close_info', title: '交易关闭买家备注' },
        { name: 'sell_info', title: '卖家备注' },
        { name: 'pay_id', title: '支付id' },
        { name: 'client_info', title: '买家备注' },
        { name: 'total_price', title: '总金额', width: 60, changeable: true },
        { name: 'total_price_before', title: '原金额', width: 60 },
        { name: 'client_provice', title: '省', changeable: true },
        { name: 'order_vip_type', title: 'vip类型', selectList: global.sellVIPType, changeable: true },
        { name: 'client_city', title: '市', changeable: true },
        { name: 'client_area', title: '区', changeable: true },


        // 显示用的
        { name: 'order_info', title: '订单信息', width: 200 },
        { name: 'client_col', title: '收件人信息', width: 200 },
        { name: 'note_col', title: '备注', width: 150 }


]

data.initData = function(item) {
  // item.status = parseInt(item.status)
  item.pay_time = parseInt(item.pay_time)
  item.item_info = JSON.parse(item.item_info)
  item.check = false
  const price = parseFloat(item.item_info.price)
  const num = parseFloat(item.item_info.num)
  item.total_price_before = price * num
  item.total_price = parseFloat(item.total_price)
  item.order_time = parseInt(item.order_time)
  item.order_vip_type = parseInt(item.order_vip_type)
  item.close_time = parseInt(item.close_time)
}

export default data;
