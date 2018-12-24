
 // const _import = file => () => import('@/views/' + file + '.vue')// 懒加载，只有到才加载
  // const normal_import = file => require('@/views/' + file + '.vue') // 正常加载

  import Vue from 'vue'
  import Router from 'vue-router'
// 所有的页面
  const Login = () => import(/* webpackChunkName: "login" */ 'views/login/login.vue')
  const Err404 = () => import(/* webpackChunkName: "error" */ 'views/error/404.vue')
  const Home = () => import(/* webpackChunkName: "home" */ 'views/erp/home.vue')
  const Layout = () => import(/* webpackChunkName: "layout" */ 'views/erp/layout.vue')
  // 用户管理
  const UserGroup = () => import(/* webpackChunkName: "usergroup" */ 'views/erp/user/usergroup.vue')
  const UserList = () => import(/* webpackChunkName: "userlist" */ 'views/erp/user/userlist.vue')
  // 商品
  const Item = () => import(/* webpackChunkName: "item" */ 'views/erp/item/item.vue')
  const ItemType = () => import(/* webpackChunkName: "itemtype" */ 'views/erp/item/itemtype.vue')
  // 商店
  const Shop = () => import(/* webpackChunkName: "shop" */ 'views/erp/shop/shop.vue')
  const ShopType = () => import(/* webpackChunkName: "shoptype" */ 'views/erp/shop/shoptype.vue')
  // 仓库
  const Store = () => import(/* webpackChunkName: "store" */ 'views/erp/store/store.vue')
  const StoreItem = () => import(/* webpackChunkName: "storeitem" */ 'views/erp/store/storeitem.vue')
  const StoreTotal = () => import(/* webpackChunkName: "storetotal" */ 'views/erp/store/storetotal.vue')
  const StoreChange = () => import(/* webpackChunkName: "storeChange" */ 'views/erp/store/storechange.vue')
  // 日志
  const Log = () => import(/* webpackChunkName: "log" */ 'views/erp/system/log.vue')
  const Config = () => import(/* webpackChunkName: "config" */ 'views/erp/system/config.vue')
  const Database = () => import(/* webpackChunkName: "Database" */ 'views/erp/system/database.vue')
  // 采购
  const BuyIn = () => import(/* webpackChunkName: "buyin" */ 'views/erp/buyin/buyin.vue')
  const BuyInStore = () => import(/* webpackChunkName: "buyinstore" */ 'views/erp/buyin/buyinstore.vue')
  const BuyOut = () => import(/* webpackChunkName: "buyout" */ 'views/erp/buyin/buyout.vue')

  // 销售
  const SellList = () => import(/* webpackChunkName: "selllist" */ 'views/erp/sell/selllist.vue')
  const SellCheck = () => import(/* webpackChunkName: "sellcheck" */ 'views/erp/sell/sellcheck.vue')
  const SellDel = () => import(/* webpackChunkName: "selldel" */ 'views/erp/sell/selldel.vue')
  const SellAssign = () => import(/* webpackChunkName: "sellassign" */ 'views/erp/sell/sellassign.vue')
  const SellAssignList = () => import(/* webpackChunkName: "sellassignlist" */ 'views/erp/sell/sellassignlist.vue')
  const SellAssignOK = () => import(/* webpackChunkName: "sellassignok" */ 'views/erp/sell/sellassign_ok.vue')


  Vue.use(Router);


// 后台
  export const adminRoute = [
    // {
    //   path: '/admin',
    //   component: Layout,
    //   name: '首页',
    //   icon: 'dashboard',
    //   redirect: '/admin/index',
    //   meta: { },
    //   children: [
    //   { path: 'index', component: Home, name: '待办事项', meta: { } }
    //   ]
    // },
    {
      path: '/user',
      component: Layout,
      name: '用户管理',
      icon: 'dashboard',
      redirect: '/user/index',
      meta: { auth: 'User_all' },
      children: [
      { path: 'index', component: UserList, name: '用户列表', meta: { auth: 'User_all' } },
      { path: 'group', component: UserGroup, name: '用户组', meta: { auth: 'UserGroup_all' } }
      ]
    },
    {
      path: '/shop',
      component: Layout,
      name: '商店管理',
      icon: 'dashboard',
      redirect: '/shop/index',
      meta: { auth: 'Shop_all' },
      children: [
      { path: 'index', component: Shop, name: '商店列表', meta: { auth: 'Shop_all' } },
      { path: 'type', component: ShopType, name: '商店类型', meta: { auth: 'ShopType_all' } }
      ]
    },
    {
      path: '/item',
      component: Layout,
      name: '商品管理',
      icon: 'dashboard',
      redirect: '/item/index',
      meta: { auth: 'Item_all' },
      children: [
      { path: 'index', component: Item, name: '商品列表', meta: { auth: 'Item_all' } },
      { path: 'type', component: ItemType, name: '商品类型', meta: { auth: 'ItemType_all' } }
      ]
    },
    {
      path: '/store',
      component: Layout,
      name: '仓库管理',
      icon: 'dashboard',
      redirect: '/store/index',
      meta: { auth: 'Store_all' },
      children: [
      { path: 'index', component: Store, name: '仓库列表', meta: { auth: 'Store_all' } },
      { path: 'item', component: StoreItem, name: '仓库商品', meta: {} },
      { path: 'total', component: StoreTotal, name: '仓库商品明细', meta: { auth: 'InStoreLog_all' } },
      { path: 'storechange', component: StoreChange, name: '调货单', meta: { auth: 'StoreChange_all' } }
      ]
    },
    {
      path: '/buyin',
      component: Layout,
      name: '采购管理',
      icon: 'dashboard',
      redirect: '/buyin/index',
      meta: { auth: 'BuyIn_all' },
      children: [
      { path: 'index', component: BuyIn, name: '采购单', meta: { auth: 'BuyIn_all' } },
      { path: 'instore', component: BuyInStore, name: '入库单', meta: { auth: 'BuyInStore_all' } },
      { path: 'out', component: BuyOut, name: '退货单', meta: { auth: 'BuyOut_all' } }
      ]
    },
    {
      path: '/sell',
      component: Layout,
      name: '销售管理',
      icon: 'dashboard',
      redirect: '/sell/index',
      meta: { auth: 'Sell_all' },
      children: [
      { path: 'index', component: SellList, name: '销售单', meta: { auth: 'Sell_all' } },
      { path: 'check', component: SellCheck, name: '待审核', meta: { auth: 'Sell_all' } },
      { path: 'assign', component: SellAssign, name: '配货', meta: { auth: 'Sell_all' } },
      { path: 'assignlist', component: SellAssignList, name: '配货单', meta: { auth: 'SellAssign_all' } },
      { path: 'assignok', component: SellAssignOK, name: '已配货', meta: { auth: 'Sell_all' } },
      { path: 'del', component: SellDel, name: '废弃单', meta: { auth: 'Sell_all' } }
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
      { path: 'database', component: Database, name: '数据库备份', meta: { auth: 'Database_all' } },
      { path: 'config', component: Config, name: '配置', meta: { auth: 'Config_all' } }
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
    {
      path: '/admin',
      redirect: '/sell'
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

