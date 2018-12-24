import comonglobal from 'common/global'
const global = {}
Object.assign(global, comonglobal)

Object.assign(global, {
  deleteStatus: [
    { id: 0, title: '正常' },
    { id: 1, title: '已作废' }
  ],

  onsaleStatus: [
    { id: 0, title: '下架' },
    { id: 1, title: '上线' }
  ],

  OrderLimitShoweStatus: [
    { id: 0, title: '不限制' },
    { id: 1, title: '限制' }
  ],

  ItemNeedIdNum: [
    { id: 0, title: '不需要' },
    { id: 1, title: '需要' }
  ],

  ServiceStatus: [
    { id: 0, title: '有特殊服务' },
    { id: 1, title: '无特殊服务' }
  ],

  defaultStatus: [
    { id: 0, title: '非默认' },
    { id: 1, title: '默认' }
  ],

  specType: [
    { id: 1, title: '文字' },
    { id: 2, title: '颜色' },
    { id: 3, title: '图片' }
  ],

  UserGroupType: [
    { id: '1', title: '会员' },
    { id: '2', title: '管理员' },
    { id: '3', title: '系统管理员' }
  ],

  MemberGroupType: '1',
  AdminGroupType: '2',
  SystemGroupType: '3',
  // 买家下单 (待付款)  买家付款（待发货） 商家发货（已发货） 买家收货确认（已完成 交易成功） 已关闭（交易关闭） 退款中
  // 下单取消-》 已关闭（交易关闭）
  // 下单-》买家取消-》已关闭
  // 下单-》买家付款-》买家请求退款-》退款中-》卖家确认退款-> 已关闭（交易关闭）
  // 下单-》买家付款-》商家发货-》买家请求退款->退款中-》卖家确认退款-> 已关闭（交易关闭）
  orderStatus: [
    { id: '0', title: '待付款' },
    { id: '1', title: '待审核' },
    { id: '2', title: '已付款' },
    { id: '3', title: '已发货' },
    { id: '4', title: '退款中' },
    { id: '5', title: '已完成' },
    { id: '6', title: '已关闭' },
    { id: '7', title: '已删除' }
  ],
  orderStatusWaitPayValue: '0',
  OrderStatusWaitcheckValue: '1',
  OrderStatusWaitSendValue: '2',
  orderStatusSendValue: '3',
  orderStatusRefundValue: '4',
  orderStatusOverValue: '5',
  orderStatusCloseValue: '6',
  orderStatusDelValue: '7',
  orderCloseStatus: [
    { id: 0, title: '买家关闭交易' },
    { id: 1, title: '卖家关闭' },
    { id: 2, title: '退款' },
    { id: 3, title: '退款退货' }
  ],
  sellVIPType: [
    { id: 0, title: '普通用户' },
    { id: 1, title: '图片用户', tip: '5元/3罐' },
    { id: 2, title: '视频用户', tip: '10元/3罐' },
    { id: 3, title: '最近日期' }
  ],
  sellTypeNormal: 0,
  sellVIPTypeNormal: 1,
  sellVIPTypePic: 1,
  sellVIPTypevideo: 2,
  sellVIPTypedate: 3,
  orderCheckInfoType: [
    { id: '已付款审核', title: '已付款审核' },
    { id: '未付款审核', title: '未付款审核' }
  ],

  DefaultorderCheckInfoType: '已付款审核',
  // 物流
  ShipNotBeginValue: '0',
  ShiOverseaValue: '1',
  ShipOverseaOverValue: '2',
  ShipStatus: [
    { id: '0', title: '未开始' },
    { id: '1', title: '进行中' },
    { id: '2', title: '结束' }
  ]
})

export default global;