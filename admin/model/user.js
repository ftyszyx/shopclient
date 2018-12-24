
import global from 'src/global'
import { all } from 'common/api'
import util from 'common/utils'
// 数据
const data = {
  name: '',
  groupname: '',
  limit_show_order: false,
  head: '',
  list: [],
  adminlist: [], // 管理员列表
  authDic: {
    upload_PicUpload: { id: 1, auth: true }, // 编辑器图片上传
    ShopTag_all: { id: 2, auth: true }, // 标签
    ShopTag_del: { id: 3, auth: true }, // 标签-删除
    ShopTag_add: { id: 4, auth: true }, // 标签-新增
    ShopTag_edit: { id: 5, auth: true }, // 标签-修改
    Export_all: { id: 6, auth: true }, // 表格导出模板
    Export_del: { id: 7, auth: true }, // 表格导出模板-删除
    Export_add: { id: 8, auth: true }, // 表格导出模板-新增
    Export_edit: { id: 9, auth: true }, // 表格导出模板-修改
    ExportTask_all: { id: 10, auth: true }, // 导表任务
    ShopOrder_all: { id: 11, auth: true }, // 订单
    ShopOrder_ExportCsv: { id: 12, auth: true }, // 订单-导出订单
    ShopOrder_ExportToErp: { id: 13, auth: true }, // 订单-导出订单到ERP
    ShopOrder_GetMyOrder: { id: 14, auth: true }, // 订单-获取我的订单
    ShopOrder_orderuploade: { id: 15, auth: true }, // 订单-批量导入
    ShopOrder_CheckPayOk: { id: 16, auth: true }, // 订单-审核订单支付成功
    ShopOrder_CheckPayNO: { id: 17, auth: true }, // 订单-审核订单支付失败
    ShopOrder_add: { id: 18, auth: true }, // 订单-新增
    ShopOrder_edit: { id: 19, auth: true }, // 订单-修改
    ShopOrder_UpdateIdNum: { id: 20, auth: true }, // 订单-用户更新附加信息
    ShopOrder_ClientClose: { id: 21, auth: true }, // 订单-用户关闭订单
    ShopOrder_ClientRefundOrder: { id: 22, auth: true }, // 订单-用户请求退款
    ShopOrder_ClientDelOrder: { id: 23, auth: true }, // 订单-用户删除订单
    ShopOrder_SetPayOk: { id: 24, auth: true }, // 订单-用户支付订单
    ShopNotice_all: { id: 25, auth: true }, // 公告
    ShopNotice_del: { id: 26, auth: true }, // 公告-删除
    ShopNotice_add: { id: 27, auth: true }, // 公告-新增
    ShopNotice_edit: { id: 28, auth: true }, // 公告-修改
    ads_all: { id: 29, auth: true }, // 广告
    ads_del: { id: 30, auth: true }, // 广告-删除
    ads_add: { id: 31, auth: true }, // 广告-新增
    ads_edit: { id: 32, auth: true }, // 广告-修改
    adspos_all: { id: 33, auth: true }, // 广告位
    adspos_del: { id: 34, auth: true }, // 广告位-删除
    adspos_add: { id: 35, auth: true }, // 广告位-新增
    adspos_edit: { id: 36, auth: true }, // 广告位-修改
    module_all: { id: 37, auth: true }, // 模块
    shopbrand_all: { id: 38, auth: true }, // 品牌
    shopbrand_del: { id: 39, auth: true }, // 品牌-删除
    shopbrand_add: { id: 40, auth: true }, // 品牌-新增
    shopbrand_edit: { id: 41, auth: true }, // 品牌-修改
    log_all: { id: 42, auth: true }, // 日志
    ShopItem_all: { id: 43, auth: true }, // 商品
    ShopItem_del: { id: 44, auth: true }, // 商品-删除
    ShopItem_add: { id: 45, auth: true }, // 商品-新加
    ShopItem_edit: { id: 46, auth: true }, // 商品-修改
    ShopItemType_all: { id: 47, auth: true }, // 商品类别
    ShopItemType_del: { id: 48, auth: true }, // 商品类别-删除
    ShopItemType_add: { id: 49, auth: true }, // 商品类别-新增
    ShopItemType_edit: { id: 50, auth: true }, // 商品类别-修改
    Database_all: { id: 51, auth: true }, // 数据库备份
    Database_restore: { id: 52, auth: true }, // 数据库备份-恢复
    Database_del: { id: 53, auth: true }, // 数据库备份-删除
    Database_add: { id: 54, auth: true }, // 数据库备份-新增
    Database_edit: { id: 55, auth: true }, // 数据库备份-修改
    system_refresh: { id: 56, auth: true }, // 刷新缓存
    photo_all: { id: 57, auth: true }, // 图片
    photo_getuploadtoken: { id: 58, auth: true }, // 图片-获取上传token
    photo_movemulti: { id: 59, auth: true }, // 图片-切换相册
    photo_del: { id: 60, auth: true }, // 图片-删除
    photo_add: { id: 61, auth: true }, // 图片-新增
    photo_edit: { id: 62, auth: true }, // 图片-修改
    Post_all: { id: 63, auth: true }, // 文章
    Post_abandon: { id: 64, auth: true }, // 文章-废弃
    Post_del: { id: 65, auth: true }, // 文章-删除
    Post_edit: { id: 66, auth: true }, // 文章-修改
    Post_add: { id: 67, auth: true }, // 文章-增加
    Posttype_all: { id: 68, auth: true }, // 文章类型
    Posttype_abandon: { id: 69, auth: true }, // 文章类型-废弃
    Posttype_del: { id: 70, auth: true }, // 文章类型-删除
    Posttype_add: { id: 71, auth: true }, // 文章类型-新增
    Posttype_edit: { id: 72, auth: true }, // 文章类型-修改
    Config_all: { id: 73, auth: true }, // 系统配置
    Config_edit: { id: 74, auth: true }, // 系统配置-修改
    album_all: { id: 75, auth: true }, // 相册
    album_del: { id: 76, auth: true }, // 相册-删除
    album_changedefault: { id: 77, auth: true }, // 相册-设置默认相册
    album_add: { id: 78, auth: true }, // 相册-新增
    album_edit: { id: 79, auth: true }, // 相册-修改
    album_changecover: { id: 80, auth: true }, // 相册-修改封面
    User_all: { id: 81, auth: true }, // 用户
    User_GetUserInfo: { id: 82, auth: true }, // 用户-获取信息
    User_GetShopUserInfo: { id: 83, auth: true }, // 用户-获取用户商城信息
    User_UpdateCart: { id: 84, auth: true }, // 用户-加购物车
    User_del: { id: 85, auth: true }, // 用户-删除
    User_add: { id: 86, auth: true }, // 用户-新增
    User_edit: { id: 87, auth: true }, // 用户-修改
    User_UpdateAddress: { id: 88, auth: true }, // 用户-修改收货地址
    User_UpdatePhone: { id: 89, auth: true }, // 用户-修改手机
    User_UpdateHead: { id: 90, auth: true }, // 用户-修改头像
    User_UpdateName: { id: 91, auth: true }, // 用户-修改姓名
    User_changePassword: { id: 92, auth: true }, // 用户-修改用户密码
    User_changeValid: { id: 93, auth: true }, // 用户-修改用户有效
    UserGroup_all: { id: 94, auth: true }, // 用户组
    UserGroup_del: { id: 95, auth: true }, // 用户组-删除
    UserGroup_add: { id: 96, auth: true }, // 用户组-新增
    UserGroup_edit: { id: 97, auth: true }, // 用户组-修改
    ShopOrder_UpdateOrderShipNum: { id: 98, auth: true }, // 用户组-修改
    User_RefreshToken: { id: 99, auth: true } // 用户组-修改
  }
};
// 所有字段名 sort:0 没排序  1 正序  2 逆序
data.fieldList = [
  { name: 'id', title: 'id', tablename: 'user.id' },
  { name: 'account', title: '账号名', changeable: true, search: 'LIKE', rules: [{ required: true, message: '请输账号名' }], tablename: 'user.account' },
  { name: 'name', title: '昵称', changeable: true, search: 'LIKE', rules: [{ required: true, message: '请输入姓名' }], tablename: 'user.name' },
  { name: 'mail', title: '邮箱', changeable: true, rules: [{ required: true, message: '请输邮箱' }], tablename: 'user.mail' },
  { name: 'reg_time', title: '创建时间', sort: 0, type: 'time', tablename: 'user.reg_time' },
  { name: 'last_login_time', title: '上次登录时间', sort: 0, type: 'time', tablename: 'user.last_login_time' },
  { name: 'phone', title: '手机号', changeable: true, search: 'LIKE', sort: 0, rules: [{ required: true, message: '请输手机号' }], tablename: 'user.phone' },
  { name: 'is_del', title: '状态', selectList: global.deleteStatus, tablename: 'user.is_del' },
  { name: 'wchat_openid', title: '微信', search: 'LIKE', tablename: 'user.wchat_openid' },

  { name: 'shop_cart', title: '购物车' },
  { name: 'user_group', title: '用户组', changeable: true, selectList: [], tablename: 'user.user_group' },
  { name: 'user_group_type', title: '用户组类型', selectList: global.UserGroupType, tablename: 'group.group_type' },
  { name: 'head', title: '头像', changeable: true, type: 'pic', width: '150px' },
  { name: 'token_expire', title: 'token过期时间', type: 'time', width: '150px' },
  { name: 'track_admin', title: '跟单员id', changeable: true, selectList: [], width: '70px' },
  // { name: 'track_admin_name', title: '跟单员名' },

  { name: 'user_group_name', title: '用户组', tablename: 'group.name' }
];

// 初始化用户信息
data.initUser = function(data) {
  this.name = data.name || '';
  if (data.groupinfo) {
    this.groupname = data.groupinfo.name || '';
    this.head = data.head || '';
    this.limit_show_order = data.limit_show_order === '1'
    if (data.groupinfo.group_type === global.AdminGroupType) {
      const authList = data.groupinfo.module_ids.split(',');
      if (data.modules) {
        data.modules.forEach(item => {
          if (authList.contain(item.id) === false) {
            this.authDic[item.controller + '-' + item.method].auth = false;
          }
        })
      }
    }
  }
}

data.initData = function(item) {
  item.is_del = parseInt(item.is_del)
  item.reg_time = parseInt(item.reg_time)
  item.last_login_time = parseInt(item.last_login_time)
  item.user_group_type = parseInt(item.user_group_type)
}

data.allAdmin = function() {
  all('user', null, null, null, { 'group.group_type': global.AdminGroupType, 'user.is_del': 0 }).then(data => {
    util.copyList(data.list, this.adminlist, this.initData)
  })
  .catch(error => {
    console.log('error', error);
  })
}

export default data
