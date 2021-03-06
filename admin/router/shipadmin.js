
  import Vue from 'vue'
  import Router from 'vue-router'
  import global from 'src/global'
// 所有的页面
  const Login = () => import(/* webpackChunkName: "login" */ 'src/views/login/login.vue')
  const Err404 = () => import(/* webpackChunkName: "error" */ 'src/views/error/404.vue')
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


  // 订单
  const ShopLogistics = () => import(/* webpackChunkName: "logistics" */ 'src/views/order/logistics.vue')
  const ShopLogisticsTask = () => import(/* webpackChunkName: "logisticstas" */ 'src/views/order/logistics_task.vue')


  Vue.use(Router);


// 后台
  export const adminRoute = [
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

    // {
    //   path: '/album',
    //   component: Layout,
    //   name: '相册管理',
    //   icon: 'dashboard',
    //   redirect: '/album/index',
    //   meta: { },
    //   children: [
    //   { path: 'index', component: AlbumList, name: '相册', meta: { } },
    //   { path: 'photo', component: PhotoList, name: '图片', meta: { } }
    //   ]
    // },
    {
      path: '/logistics',
      component: Layout,
      name: '物流管理',
      icon: 'dashboard',
      redirect: '/logistics/index',
      meta: { },
      children: [
      { path: 'index', component: ShopLogistics, name: '物流列表', meta: {} },
      { path: 'task', component: ShopLogisticsTask, name: '物流进度列表', meta: {} }
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
    {
      path: '/admin',
      redirect: '/logistics'
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

