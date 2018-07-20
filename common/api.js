import fetch from 'src/fetch'
// 通用
export function post(modelname, method, data) {
  return fetch({
    url: '/' + modelname + '/' + method,
    method: 'post',
    data
  })
}

// 获取
export function get(modelname, method, params) {
  return fetch({
    url: modelname + '/' + method,
    method: 'get',
    params
  })
}

// 获取所有
export function all(modelname, page, rownum, order, search, and) {
  return fetch({
    url: '/' + modelname + '/all',
    method: 'post',
    data: {
      page, rownum, order, search, and
    }
  })
}

export function allone(modelname, method, page, rownum, order, search, and) {
  return fetch({
    url: modelname + '/' + method,
    method: 'post',
    data: {
      page, rownum, order, search, and
    }
  })
}


