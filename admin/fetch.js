import axios from 'axios'
import config from 'src/config.js'
import model from 'src/model'
import Vue from 'vue';
import router from 'src/router'
import Message from 'element-ui/packages/message/index.js';
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
  model.app.loading = true;
  return req
}, error => {
  model.app.loading = false;
  Promise.reject(error)
})

// 服务端回应
service.interceptors.response.use(response => {
  console.log('response', response.request.responseURL, response)
  model.app.loading = false;
  return new Promise((resolve, reject) => {
    console.log('code', response.data.code)
    if (response.data.code === 1) {
      resolve(response.data.data, response.data.message)
    } else {
      if (response.data.code === 21) {
        // 登陆失效
        model.user.name = null;
        // router.push({ path: '/login' });// 跳转到登录页面
      }
      Message({
        showClose: true,
        message: response.data.message,
        type: 'error',
        duration: 1000
      })
      reject(response.data.message)
    }
  })
},
  error => {
    console.log('response err:' + error)// for debug
    model.app.loading = false;
    Message({
      showClose: true,
      message: error.message,
      type: 'error',
      duration: 1000
    })
    return Promise.reject(error);
  }
)

export default service
