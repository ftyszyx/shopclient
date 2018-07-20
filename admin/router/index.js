
 // const _import = file => () => import('@/views/' + file + '.vue')// 懒加载，只有到才加载
  // const normal_import = file => require('@/views/' + file + '.vue') // 正常加载

  import Vue from 'vue'
  import Router from 'vue-router'
  import global from 'src/global'
// 所有的页面
  const Login = () => import(/* webpackChunkName: "login" */ 'src/views/login/login.vue')
  const Err404 = () => import(/* webpackChunkName: "error" */ 'src/views/error/404.vue')
  const Home = () => import(/* webpackChunkName: "home" */ 'src/views/home.vue')
  const Layout = () => import(/* webpackChunkName: "layout" */ 'src/views/layout.vue')
  // 用户管理
  const UserGroup = () => import(/* webpackChunkName: "usergroup" */ 'src/views/user/user_group.vue')
  const UserList = () => import(/* webpackChunkName: "userlist" */ 'src/views/user/user_list.vue')

  // 日志
  const Log = () => import(/* webpackChunkName: "log" */ 'src/views/system/log.vue')
  const Config = () => import(/* webpackChunkName: "config" */ 'src/views/system/config.vue')
  const Database = () => import(/* webpackChunkName: "Database" */ 'src/views/system/database.vue')
  const ExportTask = () => import(/* webpackChunkName: "exportask" */ 'src/views/system/export_task.vue')
  // 文章
  const PostTypeList = () => import(/* webpackChunkName: "posttypelist" */ 'src/views/post/posttype.vue')
  const PostList = () => import(/* webpackChunkName: "postlist" */ 'src/views/post/post.vue')
  // 相册
  const AlbumList = () => import(/* webpackChunkName: "albumList" */ 'src/views/photo/album.vue')
  const PhotoList = () => import(/* webpackChunkName: "photoList" */ 'src/views/photo/photo.vue')

  // 商城
  const AdsList = () => import(/* webpackChunkName: "adsList" */ 'src/views/ads/ads.vue')
  const AdsPosList = () => import(/* webpackChunkName: "adsposList" */ 'src/views/ads/ads_pos.vue')

  const ShopItemType = () => import(/* webpackChunkName: "shopitemtype" */ 'src/views/shop/shop_itemtype.vue')
  const ShopBrand = () => import(/* webpackChunkName: "shopbrand" */ 'src/views/shop/shop_brand.vue')
  const ShopTag = () => import(/* webpackChunkName: "shoptag" */ 'src/views/shop/shop_tag.vue')
  // const ShopFloor = () => import(/* webpackChunkName: "shopfloor" */ 'src/views/shop/shop_floor.vue')
  const ShopItem = () => import(/* webpackChunkName: "shopitem" */ 'src/views/shop/shop_item.vue')
  const ShopNotice = () => import(/* webpackChunkName: "shopnotice" */ 'src/views/shop/shop_notice.vue')

  // 订单
  const ShopOrder = () => import(/* webpackChunkName: "shoporder" */ 'src/views/order/shop_order.vue')


  Vue.use(Router);


// 后台
  export const adminRoute = [
    {
      path: '/admin',
      component: Layout,
      name: '首页',
      icon: 'dashboard',
      redirect: '/admin/index',
      meta: { },
      children: [
      { path: 'index', component: Home, name: '待办事项', meta: { } }
      ]
    },
    {
      path: '/user',
      component: Layout,
      name: '用户管理',
      icon: 'dashboard',
      redirect: '/user/index',
      meta: { auth: 'User_all' },
      children: [
      { path: 'index', component: UserList, name: '用户列表', meta: { auth: 'User_all', grouptype: global.AdminGroupType } },
      { path: 'group', component: UserGroup, name: '用户组', meta: { auth: 'UserGroup_all' } }
      ]
    },
    {
      path: '/post',
      component: Layout,
      name: '文章管理',
      icon: 'dashboard',
      redirect: '/post/index',
      meta: { },
      children: [
      { path: 'index', component: PostList, name: '文章', meta: { } },
      { path: 'type', component: PostTypeList, name: '文章类别', meta: { } }
      ]
    },

    {
      path: '/album',
      component: Layout,
      name: '相册管理',
      icon: 'dashboard',
      redirect: '/album/index',
      meta: { },
      children: [
      { path: 'index', component: AlbumList, name: '相册', meta: { } },
      { path: 'photo', component: PhotoList, name: '图片', meta: { } }
      ]
    },
    {
      path: '/shop',
      component: Layout,
      name: '商城管理',
      icon: 'dashboard',
      redirect: '/shop/member',
      meta: { },
      children: [
        { path: 'member', component: UserList, name: '会员', meta: { grouptype: global.MemberGroupType } },
        { path: 'itemtype', component: ShopItemType, name: '商品类型', meta: { } },
        { path: 'tag', component: ShopTag, name: '商品标签', meta: { } },
        { path: 'brand', component: ShopBrand, name: '商品品牌', meta: { } },
        { path: 'item', component: ShopItem, name: '商品', meta: { } },
        { path: 'notice', component: ShopNotice, name: '公告', meta: { } },
        // { path: 'floor', component: ShopFloor, name: '楼层', meta: { } },
        { path: 'ads', component: AdsList, name: '广告', meta: { } },
        { path: 'adspos', component: AdsPosList, name: '广告位', meta: { } }
      ]
    },
    {
      path: '/order',
      component: Layout,
      name: '订单管理',
      icon: 'dashboard',
      redirect: '/order/index',
      meta: { },
      children: [
      { path: 'index', component: ShopOrder, name: '订单', meta: {} },
      { path: 'nopay', component: ShopOrder, name: '待支付', meta: { ordertype: global.orderStatusWaitPayValue } },
      { path: 'nochek', component: ShopOrder, name: '待审核', meta: { ordertype: global.OrderStatusWaitcheckValue } },
      { path: 'nosend', component: ShopOrder, name: '待发货', meta: { ordertype: global.OrderStatusWaitSendValue } },
      { path: 'send', component: ShopOrder, name: '已发货', meta: { ordertype: global.orderStatusSendValue } },
      { path: 'refund', component: ShopOrder, name: '退款中', meta: { ordertype: global.orderStatusRefundValue } }
      ]
    },
    {
      path: '/system',
      component: Layout,
      name: '系统管理',
      icon: 'dashboard',
      redirect: '/system/log',
      meta: { auth: 'Config_all' },
      children: [
      { path: 'log', component: Log, name: '日志', meta: {} },
      { path: 'database', component: Database, name: '数据库备份', meta: { } },
      { path: 'config', component: Config, name: '配置', meta: { auth: 'Config_all' } },
      { path: 'exporttask', component: ExportTask, name: '导出列表', meta: { } }
      ]
    }
  ]

// 一级主页
  export let RouterMap = [
    {
      path: '/login',
      component: Login,
      name: '登录',
      menuhide: true
    },
    {
      path: '/',
      redirect: '/login'
    },
  { path: '/404', component: Err404, menuhide: true }

  ]

  RouterMap = RouterMap.concat(adminRoute)
  RouterMap = RouterMap.concat([{ path: '*', redirect: '/404', menuhide: true }])


  export default new Router({
    mode: 'history', // 后端支持可开
    scrollBehavior: () => ({ y: 0 }), // 换路由时滚动到顶部
    routes: RouterMap
  })

