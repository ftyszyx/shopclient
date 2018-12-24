// The Vue build version to load with the `import` command
// (runtime-only or standalone) has been set in webpack.base.conf with an alias.

import Vue from 'vue'
import models from 'src/model/index.js'
import App from './app'
import router from 'src/router'

// 公共样式
import 'commoncss/reset.css'
import 'commoncss/common.css'
import 'commoncss/button.css'
import 'commoncss/dailog.css'
import 'commoncss/form.css'
import 'commoncss/table.css'
import 'commoncss/tabs.css'
import 'commoncss/tag.css'
import 'commoncss/loading.css'
import 'commoncss/iconfont.css'
import 'assets/css/iconfont.css'
import 'commoncss/flex.css'

import { post } from 'common/api'

import ElementUI from 'element-ui/src/index.js'
Vue.use(ElementUI)


// 有token且有用户信息
function loginOKNext(to, next) {
  console.log('login success')
  if (to.path === '/login') {
    next('/admin')
    return;
  }
  next()
}

// 跳转到登录
function gotoLogin(to, next) {
  console.log('go to login')
  if (to.path === '/login') {
    next();
  } else {
    next('/login')
  }
}

router.beforeEach((to, from, next) => {
  console.log('path to', to.path)
  const usermodel = models.user;
  console.log('account', usermodel.name)
  if (!usermodel.name) {
    // 没有取用户信息
    console.log('get user info')
    post('user', 'getUserInfo').then(data => {
      console.log('get user info success')
      usermodel.initUser(data);
      loginOKNext(to, next)
    })
    .catch(error => {
      console.log('get info error', error);
      gotoLogin(to, next)
    })
  } else {
  // 有用户信息
    console.log('have userinfo');
    loginOKNext(to, next)
  }
})

router.afterEach(() => {
  // console.log('after each', route)
})

new Vue({
  router,
  render: h => h(App)
}).$mount('#app')
