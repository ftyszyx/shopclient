import axios from 'axios'
import config from 'src/config.js'
import model from 'src/model'
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
  model.app.loading ++;
  return req
}, error => {
  if (model.app.loading > 0) {
    model.app.loading --;
  }
  Promise.reject(error)
})

// 服务端回应
service.interceptors.response.use(response => {
  console.log('response', response.request.responseURL, response)
  if (model.app.loading > 0) {
    model.app.loading --;
  }
  // $('body').text(response.data);
  if ((response.data.code || '') === '') {
    document.getElementById('errortext').innerHTML = response.data;
  } else {
    // document.getElementById('errortext').innerHTML = '';
  }
  return new Promise((resolve, reject) => {
    if (response.data.code === '1') {
      resolve(response.data.data)
    } else {
      if (response.data.code === '21') {
        // 登陆失效
        model.user.account = null;
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
    // model.app.loading = false;
    if (model.app.loading > 0) {
      model.app.loading --;
    }
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
