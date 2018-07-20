const global = {

  // 一些状态配置
  checkStatus: [
    { id: 0, title: '未审核' },
    { id: 1, title: '已审核' }
  ],
  assignStatus: [
    { id: 0, title: '未配货' },
    { id: 1, title: '已配货' }
  ],
  deleteStatus: [
    { id: 0, title: '正常' },
    { id: 1, title: '已作废' }
  ],
  payStatus: [
    { id: 0, title: '未支付' },
    { id: 1, title: '已支付' }
  ],
  refundStatus: [
    { id: 0, title: '正常' },
    { id: 1, title: '已退款' },
    { id: 1, title: '退款中' }
  ],
  inStoreStatus: [
    { id: 0, title: '未入库' },
    { id: 1, title: '已入库' },
    { id: 2, title: '部分入库' }
  ],
  sellStatus: [
    { id: 0, title: '待审核' },
    { id: 1, title: '待配货' },
    { id: 2, title: '已配货' },
    { id: 3, title: '废弃' }
  ],
  sellStatus_checkno: 0,
  sellStatus_checkok: 1,
  sellStatus_assign: 2,
  sellStatus_delete: 3,
  sellType: [
    { id: 0, title: 'CC' },
    { id: 1, title: 'NS' },
    { id: 2, title: 'BC' },
    { id: 3, title: 'NO' }
  ],
  inStoreType: [
    { id: 1, title: '入库单' },
    { id: 2, title: '入库单废弃' },
    { id: 3, title: '入库单修改' },
    { id: 4, title: '出库单' },
    { id: 5, title: '出库单废弃' },
    { id: 6, title: '出库单修改' },
    { id: 7, title: '调货单' },
    { id: 8, title: '调货单废弃' },
    { id: 9, title: '调货单修改' },
    { id: 10, title: '销售配货' },
    { id: 11, title: '销售配货废弃' },
    { id: 12, title: '销售已配货直接废弃' }
  ],
  sellVIPType: [
    { id: 0, title: '普通用户' },
    { id: 1, title: '图片用户' },
    { id: 2, title: '视频用户' },
    { id: 3, title: '最近日期' }
  ],

  commonDel: [
    { id: 0, title: '正常' },
    { id: 1, title: '已作废' }
  ]

}

export default global;