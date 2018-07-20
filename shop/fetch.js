import axios from 'axios'
import config from 'src/config.js'

import Vue from 'vue';
import router from './router'
axios.defaults.withCredentials = true; // 能保存session id
// 封装了客户端的http请求
const service = axios.create({
  baseURL: config.baseURL,
  timeout: 0,
  withCredentials: true
})

// 请求
service.interceptors.request.use(req => {
  console.log('req ', req.url, req)
  req.headers.token = window.localStorage.getItem('token') || ''
  req.headers.uid = window.localStorage.getItem('uid') || ''
  Vue.$indicator.open({
    text: '加载中',
    spinnerType: 'fading-circle'
  })
  return req
}, error => {
  Vue.$indicator.close();
  Promise.reject(error)
})

// 服务端回应
service.interceptors.response.use(response => {
  console.log('response', response.request.responseURL, response)
  Vue.$indicator.close();
  return new Promise((resolve, reject) => {
    console.log('code', response.data.code)
    if (response.data.code === 1) {
      resolve(response.data.data, response.data.message)
    } else if (response.data.code === 23) {
      Vue.$toast('登录成功')
      window.localStorage.setItem('token', data.token)
      window.localStorage.setItem('uid', data.uid)
      router.push({ path: '/home' });
    } else if (response.data.code === 21) {
      // 登陆失效
      // model.user.name = '';
      Vue.$toast(response.data.message)
      router.push({ path: '/login' });// 跳转到登录页面
    } else {
      Vue.$toast({
        message: response.data.message,
        duration: 1000
      })
      reject(response.data.message)
    }
  })
},
  error => {
    console.log('response err:' + error)// for debug
    // model.app.loading = false;
    Vue.$indicator.close();
    Vue.$toast({
      message: error.message,
      duration: 1000
    })
    return Promise.reject(error);
  }
)

export default service
