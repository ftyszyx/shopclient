

  import Vue from 'vue'
  import Router from 'vue-router'
// 所有的页面
  const Err404 = () => import(/* webpackChunkName: "error" */ 'views/error/404.vue')
  const Home = () => import(/* webpackChunkName: "home" */ 'views/home/home.vue')
  const HomeLayout = () => import(/* webpackChunkName: "layout" */ 'views/home/homelayout.vue')
  const Login = () => import(/* webpackChunkName: "login" */ 'shop/views/login/login.vue')
  Vue.use(Router);


  export const homeRoute = [
    {
      path: '/home',
      component: HomeLayout,
      name: '商城',
      redirect: '/home/index',
      meta: { },
      children: [
        { path: 'index', component: Home, name: '首页', meta: { KeepAlive: true } }

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
      redirect: '/home'
    },
  { path: '/404', component: Err404, menuhide: true }

  ]

  RouterMap = RouterMap.concat(homeRoute)
  RouterMap = RouterMap.concat([{ path: '*', redirect: '/404', menuhide: true }])


  export default new Router({
    mode: 'hash', // 后端支持可开
    scrollBehavior: () => ({ y: 0 }), // 换路由时滚动到顶部
    routes: RouterMap
  })

