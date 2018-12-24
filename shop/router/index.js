
 // const _import = file => () => import('@/views/' + file + '.vue')// 懒加载，只有到才加载
  // const normal_import = file => require('@/views/' + file + '.vue') // 正常加载

  import Vue from 'vue'
  import Router from 'vue-router'
// 所有的页面
  const Login = () => import(/* webpackChunkName: "login" */ 'views/login/login.vue')
  const Err404 = () => import(/* webpackChunkName: "error" */ 'views/error/404.vue')
  const Home = () => import(/* webpackChunkName: "home" */ 'views/home/home.vue')
  const User = () => import(/* webpackChunkName: "user" */ 'views/home/user.vue')
  const ItemType = () => import(/* webpackChunkName: "home" */ 'views/home/itemtype.vue')
  const ShopCart = () => import(/* webpackChunkName: "shopcart" */ 'views/home/shopcart.vue')
  const HomeLayout = () => import(/* webpackChunkName: "layout" */ 'views/home/homelayout.vue')
  const ItemView = () => import(/* webpackChunkName: "itemview" */ 'views/common/item.vue')
  const SearchView = () => import(/* webpackChunkName: "search" */ 'views/common/search.vue')
  const OrderList = () => import(/* webpackChunkName: "orderlise" */ 'views/order/orderlist.vue')
  const UserSet = () => import(/* webpackChunkName: "userset" */ 'views/user/userset.vue')
  const ChangePhone = () => import(/* webpackChunkName: "changephone" */ 'views/user/changephone.vue')
  const ItemTypeSelect = () => import(/* webpackChunkName: "itemtypeselect" */ 'views/itemtype/itemtypeselect.vue')
  const AddressList = () => import(/* webpackChunkName: "addresslist" */ 'views/address/address.vue')
  const AddressEdit = () => import(/* webpackChunkName: "addressedit" */ 'views/address/addressedit.vue')
  const AddressSelect = () => import(/* webpackChunkName: "addressselect" */ 'views/address/addressselect.vue')
  const PayOrder = () => import(/* webpackChunkName: "payorder" */ 'views/order/orderpay.vue')
  const PayView = () => import(/* webpackChunkName: "Payview" */ 'views/order/payview.vue')

  Vue.use(Router);


  export const homeRoute = [
    {
      path: '/home',
      component: HomeLayout,
      name: '商城',
      redirect: '/home/itemtype',
      meta: { },
      children: [
        //{ path: 'index', component: Home, name: '首页', meta: { KeepAlive: true } },
        { path: 'itemtype', component: ItemType, name: '分类', meta: { KeepAlive: true } },
        { path: 'shopcart', component: ShopCart, name: '购物车', meta: { KeepAlive: true } },
        { path: 'user', component: User, name: '我的', meta: { KeepAlive: true } }
      ]
    },
    {
      path: '/item/:id',
      component: ItemView,
      meta: { KeepAlive: true }
    },
    {
      path: '/payview/:id/:pay_id/:money',
      component: PayView,
      meta: { KeepAlive: true }
    },
    {
      path: '/payviewtotal/:pay_id/:money',
      component: PayView,
      meta: { KeepAlive: true }
    },
    {
      path: '/orders/:status',
      component: OrderList,
      meta: { KeepAlive: true }
    },
    {
      path: '/search',
      component: SearchView,
      meta: { KeepAlive: true }
    },
    {
      path: '/userset',
      component: UserSet,
      meta: { KeepAlive: true }
    },
    {
      path: '/changephone',
      component: ChangePhone,
      meta: { KeepAlive: true }
    },
    {
      path: '/selecttype',
      component: ItemTypeSelect,
      meta: { KeepAlive: true }
    },
    {
      path: '/addresslist',
      component: AddressList,
      meta: { KeepAlive: true }
    },
    {
      path: '/addressselect',
      component: AddressSelect,
      meta: { KeepAlive: true }
    },
    {
      path: '/payorder',
      component: PayOrder,
      meta: { KeepAlive: true }
    },
    {
      path: '/addressedit/:index',
      component: AddressEdit,
      meta: { KeepAlive: true }
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
      redirect: '/home'
    },
  { path: '/404', component: Err404, menuhide: true }

  ]

  RouterMap = RouterMap.concat(homeRoute)
  RouterMap = RouterMap.concat([{ path: '*', redirect: '/404', menuhide: true }])


  export default new Router({
    mode: 'history', // 后端支持可开
    scrollBehavior: () => ({ y: 0 }), // 换路由时滚动到顶部
    routes: RouterMap
  })

