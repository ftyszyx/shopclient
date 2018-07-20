
import { get } from 'common/api'
import router from 'src/router'
import util from 'common/utils'
// import Vue from 'vue'
// import global from 'src/global'
// 数据
const data = {
  name: '',
  account: '',
  mail: '',
  phone: '',
  orders: [], // 订单
  shop_cart: [],
  order_waitpay: 0,
  order_pay: 0,
  order_send: 0,
  order_refund: 0,
  address: [],
  selectaddress: {},
  idnum: '',
  idpic1: '',
  wchat_openid: '',
  idpic2: '',
  payList: [], // 要支付的商品  {itemid:122,num:2,price:"234",specname:"dfsdf",name:"dsfdf",pic:"sdfff"}
  head: ''
};

// 初始化用户信息
data.initUser = function(response) {
  this.name = response.name || ''
  this.wchat_openid = response.wchat_openid || ''
  this.account = response.account
  this.mail = response.mail
  this.phone = response.phone
  if (response.shop_cart) {
    const shop_cart = JSON.parse(response.shop_cart)
    util.copyList(shop_cart, this.shop_cart, item => {
      item.check = true
    })
  }
   // {itemid:1222,num:2,specid:3,name:鞋 specname:黄色;44;大,pic:""}
  if (response.address) {
    const address = JSON.parse(response.address)
    util.copyList(address, this.address, (item, index) => {
      // console.log('select address index ', index)
      if (index === 0) {
        // console.log('select address index 0')
        util.assignBySrc(this.selectaddress, item)// 设默认
        // Vue.set(this.selectaddress, 'name', item.name)
      } else {
        if (item.check) {
          util.assignBySrc(this.selectaddress, item)// 设默认
          // Vue.set(this.selectaddress, 'name', item.name)
        }
      }
    })
    console.log('select address', this.selectaddress)
  }
  // 结构{name:"收件人",phone:"1866464098",province:"广东省",city:"广州市",area:"天河区",detail:"科韵品12号",check:false}
  // 订单相关
  if (response.order_waitpay) {
    this.order_waitpay = parseInt(response.order_waitpay)
  }
  if (response.order_pay) {
    this.order_pay = parseInt(response.order_pay)
  }
  if (response.order_send) {
    this.order_send = parseInt(response.order_send)
  }
  if (response.order_refund) {
    this.order_refund = parseInt(response.order_refund)
  }

  this.head = response.head
}


data.getinfo = function(successCb, data) {
  get('user', 'getshopuserinfo', data).then(response => {
    this.initUser(response)
    if (successCb) {
      successCb(true)
    }
  }).catch(err => {
    console.log(err)
    if ((this.name || '').trim() === '') {
      router.push({ path: '/login' });// 跳转到登录页面
    }
  })
}


data.checkLogin = function(cb) {
  if ((this.name || '').trim() === '') {
    console.log('no login')
    this.getinfo(cb, { update: 'true' })
  } else {
    if (cb) {
      cb(false)
    }
  }
}

export default data
