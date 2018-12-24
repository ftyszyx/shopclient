// The Vue build version to load with the `import` command
// (runtime-only or standalone) has been set in webpack.base.conf with an alias.

import Vue from 'vue'
import App from './app'
import router from 'src/router'
import 'commoncss/reset.css'
import 'commoncss/common.css'
import 'commoncss/flex.css'
import 'assets/css/common.css'
import 'shop/assets/css/dialog.css'
import 'assets/css/iconfont.css'
import Navigation from 'common/navigation'
Vue.use(Navigation, { router });
import './profill.js'

// mintui
import Mint from 'mint-ui/src/shipindex.js';
Vue.use(Mint);
import model from 'src/model'

router.beforeEach((to, from, next) => {
  console.log('path from:', from.path, 'path to:', to.path)
  model.app.lastpath = from.path;
  model.app.topath = to.path;
  next();
})

router.afterEach(() => {
  // console.log('after each', route)
})

new Vue({
  router,
  render: h => h(App)
}).$mount('#app')
