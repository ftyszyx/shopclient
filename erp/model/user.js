import { get } from 'common/api'

// 数据
const data = {
  account: undefined,
  userGroup: '',
  list: [],
  fobidModuleList: [],
  authDic: {
    User_all: { id: 20, auth: true }, // 用户
    User_del: { id: 21, auth: true }, // 用户-删除
    User_edit: { id: 22, auth: true }, // 用户-修改
    User_updateGroup: { id: 23, auth: true }, // 用户-修改用户组
    User_changeValid: { id: 24, auth: true }, // 用户-修改用户有效
    User_changePassword: { id: 25, auth: true }, // 用户-修改用户密码
    User_add: { id: 27, auth: true }, // 用户-新增
    UserGroup_all: { id: 30, auth: true }, // 用户组
    UserGroup_add: { id: 31, auth: true }, // 用户组-新增
    UserGroup_edit: { id: 32, auth: true }, // 用户组-修改
    UserGroup_del: { id: 33, auth: true }, // 用户组-删除
    BuyIn_all: { id: 50, auth: true }, // 仓库采购单
    BuyIn_add: { id: 51, auth: true }, // 采购单-新建
    BuyIn_del: { id: 52, auth: true }, // 采购单-删除
    BuyIn_checkOk: { id: 53, auth: true }, // 采购单-审核
    BuyIn_edit: { id: 54, auth: true }, // 采购单-修改
    BuyInStore_all: { id: 60, auth: true }, // 仓库入库单
    BuyInStore_add: { id: 61, auth: true }, // 入库单-新建
    BuyInStore_del: { id: 62, auth: true }, // 入库单-废弃
    BuyInStore_checkOk: { id: 63, auth: true }, // 入库单-审核
    BuyInStore_edit: { id: 64, auth: true }, // 入库单-修改
    BuyOut_all: { id: 70, auth: true }, // 仓库出库单
    BuyOut_add: { id: 71, auth: true }, // 出库单-新建
    BuyOut_del: { id: 72, auth: true }, // 出库单-废弃
    BuyOut_checkOk: { id: 73, auth: true }, // 出库单-审核
    BuyOut_edit: { id: 74, auth: true }, // 出库单-修改
    Shop_all: { id: 150, auth: true }, // 商店
    Shop_add: { id: 151, auth: true }, // 商店-新建
    Shop_del: { id: 152, auth: true }, // 商店-删除
    Shop_edit: { id: 153, auth: true }, // 商店-修改
    ShopType_all: { id: 160, auth: true }, // 商店类型
    ShopType_add: { id: 161, auth: true }, // 商店类型-新建
    ShopType_del: { id: 162, auth: true }, // 商店类型-删除
    ShopType_edit: { id: 163, auth: true }, // 商店类型-修改
    Store_all: { id: 170, auth: true }, // 仓库
    Store_add: { id: 171, auth: true }, // 仓库-新建
    Store_del: { id: 172, auth: true }, // 仓库-删除
    Store_edit: { id: 173, auth: true }, // 仓库-修改
    Store_updateCheckRule: { id: 174, auth: true }, // 仓库-修改审核规则
    StoreChange_all: { id: 180, auth: true }, // 调货单
    StoreChange_add: { id: 181, auth: true }, // 调货单-新建
    StoreChange_del: { id: 182, auth: true }, // 调货单-删除
    StoreChange_edit: { id: 183, auth: true }, // 调货单-修改
    StoreChange_checkOk: { id: 184, auth: true }, // 调货单-审核
    StoreItem_all: { id: 190, auth: true }, // 仓库商品
    StoreItem_exportCsv: { id: 191, auth: true }, // 仓库商品-导出
    Config_all: { id: 200, auth: true }, // 系统配置
    Config_edit: { id: 201, auth: true }, // 系统配置-修改
    Item_all: { id: 320, auth: true }, // 商品
    Item_add: { id: 321, auth: true }, // 商品-新加
    Item_del: { id: 322, auth: true }, // 商品-删除
    Item_edit: { id: 323, auth: true }, // 商品-修改
    Item_updateSellValue: { id: 324, auth: true }, // 商品-修改最小约数
    Item_updateCheckLimit: { id: 325, auth: true }, // 商品-修改审核约束开关
    ItemType_all: { id: 330, auth: true }, // 商品类别
    ItemType_add: { id: 331, auth: true }, // 商品类别-新增
    ItemType_del: { id: 332, auth: true }, // 商品类别-删除
    ItemType_edit: { id: 333, auth: true }, // 商品类别-修改
    SellAssign_all: { id: 400, auth: true }, // 配货单
    SellAssign_assignItem: { id: 401, auth: true }, // 配货单-配货
    SellAssign_del: { id: 402, auth: true }, // 配货单-废除
    SellAssign_edit: { id: 403, auth: true }, // 配货单-修改
    SellAssign_exportCsv: { id: 404, auth: true }, // 配货单-导出
    Sell_all: { id: 500, auth: true }, // 销售单
    Sell_checkOk: { id: 501, auth: true }, // 销售单-审核
    Sell_del: { id: 502, auth: true }, // 销售单-废弃
    Sell_importData: { id: 503, auth: true }, // 销售单-导入
    Sell_checkNo: { id: 504, auth: true }, // 销售单-反审核
    Sell_edit: { id: 505, auth: true }, // 销售单-修改
    Sell_exportCsv: { id: 506, auth: true }, // 销售单-导出
    Sell_updateTrackMan: { id: 508, auth: true }, // 销售单-修改跟单员
    Sell_mergeOrder: { id: 509, auth: true }, // 销售单-合单
    Sell_mergeAllOrder: { id: 510, auth: true }, // 销售单-批量合单
    Sell_splitOrder: { id: 511, auth: true }, // 销售单-拆单
    Sell_splitAllOrder: { id: 512, auth: true }, // 销售单-批量拆单
    Sell_importChangeShipnum: { id: 514, auth: true }, // 销售单-批量拆单
    Export_all: { id: 600, auth: true }, // 表格导出配置
    Export_add: { id: 601, auth: true }, // 表格导出配置-新增
    Export_edit: { id: 602, auth: true }, // 表格导出配置-修改
    Export_del: { id: 603, auth: true }, // 表格导出配置-删除
    Database_all: { id: 700, auth: true }, // 数据库备份-所有
    Database_save: { id: 701, auth: true }, // 数据库备份-保存
    Database_del: { id: 702, auth: true }, // 数据库备份-删除
    Database_edit: { id: 703, auth: true }, // 数据库备份-修改
    Database_restore: { id: 704, auth: true }, // 数据库备份-恢复
    InStoreLog_all: { id: 750, auth: true }, // 入库明细
    InStoreLog_exportCsv: { id: 751, auth: true } // 入库明细-导出
  }
};
// 所有字段名 sort:0 没排序  1 正序  2 逆序
data.fieldList = [
  { name: 'id', title: 'id', changeable: false },
  { name: 'account', title: '账号名', changeable: true, sort: 0, rules: [{ required: true, message: '请输账号名' }] },
  { name: 'name', title: '姓名', changeable: true, sort: 0, rules: [{ required: true, message: '请输入姓名' }] },
  { name: 'mail', title: '邮箱', changeable: true, rules: [{ required: true, message: '请输邮箱' }] },
  { name: 'reg_time', title: '创建时间', changeable: false, sort: 0, type: 'time', width: '150px' },
  { name: 'phone', title: '手机号', changeable: true, sort: 0, rules: [{ required: true, message: '请输手机号' }] },
  { name: 'is_valid', title: '有效', changeable: false, type: 'boolean' },
  { name: 'is_system', title: '系统用户', changeable: false, sort: 0, type: 'boolean' },
  { name: 'user_group', title: '用户组', changeable: true, selectList: [] }
];



data.getinfo = function(cb) {
  get('login', 'getUserInfo')
  .then(response => {
    console.log('GetInfo response')
    this.account = response.account || '';
    this.userGroup = response.user_group || '';
    this.fobidModuleList.splice(0);
    if ((response.forbid_module_list || '') !== '') {
      response.forbid_module_list.forEach(element => {
        this.authDic[element.controller + '_' + element.method].auth = false;
        this.fobidModuleList.push(element);
      });
    }
    if (cb) {
      cb()
    }
  })
  .catch(error => {
    if (cb) {
      cb(error)
    }
  })
}



data.initData = function(item) {
}

export default data
