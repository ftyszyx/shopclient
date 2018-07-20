import { all } from 'common/api'
import util from 'common/utils'

const data = {
  list: []
};


data.fieldList = [
    { name: 'id', title: 'id', changeable: false },
    { name: 'name', title: '名称', changeable: false },
    { name: 'module', title: '模块名', changeable: false },
    { name: 'controller', title: '控制器名', changeable: false },
    { name: 'method', title: '方法包', changeable: false },
    { name: 'posid', title: '位置id', changeable: false },
    { name: 'need_auth', title: '是否需要验证', changeable: false }
]


data.all = function() {
  all('module', null, null).then(
  response => {
    util.copyList(response.list, this.list)

    // let outstr = '';
    // data.list.forEach(item => {
    //   outstr += item.controller + '_' + item.method;
    //   outstr += ':{id:'
    //   outstr += item.id;
    //   outstr += ',';
    //   outstr += 'auth:';
    //   outstr += 'true}';
    //   outstr += ',//' + item.name + '\n';
    // });
    // console.log('module', outstr)
  }
  ).catch(error => {
    console.log('error', error);
  });
}
data.initData = function(item) {
}
export default data