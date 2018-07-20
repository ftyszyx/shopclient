
//
import basetool from './base.js'
import models from 'src/model'
import Vue from 'vue'
const utils = {};

// 获取需要显示的字段列表
utils.filterField = function(src, dest, except, fieldList) {
  if (!(fieldList instanceof Array)) {
    fieldList = Array.prototype.slice.call(arguments, 3);
  }
  dest.splice(0);

  if (except === false) {
    fieldList.forEach(field => {
      const fieldinfo = src.find(x => x.name === field);
      if (fieldinfo) {
        dest.push(fieldinfo);
      }
    })
  } else {
    src.forEach(element => {
      if (fieldList.indexOf(element.name) <= -1) {
        dest.push(element);
      }
    });
  }
}

// 拷贝列表，要保持表列表引用不变
utils.copyList = function(src, dest, cb = null) {
  dest.splice(0);
  if (src) {
    src.forEach((element, index) => {
      if (cb) {
        cb(element, index);
      }
      dest.push(element);
    });
  }
}

utils.deepcopyList = function(src, dest, cb = null) {
  dest.splice(0);
  if (src) {
    src.forEach(element => {
      const itemcopy = JSON.parse(JSON.stringify(element))
      dest.push(itemcopy)
      if (cb) {
        cb(itemcopy);
      }
    });
  }
}

// 修改排序
utils.ChangeOrder = function(list, index) {
  // console.log('list', list, 'index', index);

  for (let i = 0; i < list.length; i++) {
    if (i !== index && list[i].sort != null) {
      list[i].sort = 0;
    }
  }
  const newvalue = list[index];
  if (!newvalue.sort) {
    newvalue.sort = 1;
  } else if (newvalue.sort === 1) {
    newvalue.sort = 2;
  } else if (newvalue.sort === 2) {
    newvalue.sort = 1;
  }
  list.splice(index, 1, newvalue);
}

// 获取最后排序
utils.getOrder = function(list) {
  const orderinfo = {};
  list.forEach(item => {
    if (item.sort) {
      let fieldname = item.name;
      if (item.tablename) {
        fieldname = item.tablename
      }
      if (item.sort === 1) {
        orderinfo[fieldname] = 'asc';
      } else {
        orderinfo[fieldname] = 'desc';
      }
    }
  })
  return orderinfo;
}


utils.validate = function(rule, value, name, cb) {
  basetool.validate(rule, name, value, errormsg => {
    if (errormsg) {
      cb(errormsg)
    }
  });
}

// 复位数据
utils.resetData = function(fieldList, data, cb) {
  fieldList.forEach(item => {
    const key = item.name
    // console.log(key, data.hasOwnProperty(key), data[key])
    if (data.hasOwnProperty(key)) {
      let flag = false
      if (cb) {
        flag = cb(data, item.name)
      }
      if (data[key] !== null && data[key] !== undefined) {
        if (flag === false) {
          data[item.name] = ''
        }
      }
    }
  })
}


// 获取用户组名
utils.getGroup = function(groupid) {
  if (groupid) {
    const groupinfo = models.userGroup.list.find(item => {
      if (item.id === groupid) {
        return true;
      }
      return false;
    })
    if (groupinfo) { return groupinfo.name }
  }
  return '无组';
}

utils.getTimeBrif = function() {
  return {
    shortcuts: [{
      text: '最近一周',
      onClick(picker) {
        const end = new Date();
        const start = new Date();
        start.setTime(start.getTime() - 3600 * 1000 * 24 * 7);
        picker.$emit('pick', [start, end]);
      }
    }, {
      text: '最近一个月',
      onClick(picker) {
        const end = new Date();
        const start = new Date();
        start.setTime(start.getTime() - 3600 * 1000 * 24 * 30);
        picker.$emit('pick', [start, end]);
      }
    }, {
      text: '最近三个月',
      onClick(picker) {
        const end = new Date();
        const start = new Date();
        start.setTime(start.getTime() - 3600 * 1000 * 24 * 90);
        picker.$emit('pick', [start, end]);
      }
    }]
  }
}


utils.getTimeSearch = function(time) {
  const timearr = [];
  timearr.push(['>', basetool.getTime(time[0]).valueOf() / 1000])
  timearr.push(['<', basetool.getTime(time[1]).valueOf() / 1000])
  timearr.push('and');
  return timearr;
}

utils.getmultiSearch = function(selectarr) {
  const timearr = [];
  selectarr.forEach(item => {
    timearr.push(['=', item])
  })
  timearr.push('or');
  return timearr;
}


utils.getSelectArr = function(data, value, key) {
  let res = []
  for (let index = 0; index < data.length; index++) {
    let iteminfo = data[index]
    if (iteminfo[key] === value) {
      res.push(iteminfo[key])
      // console.log('find res', iteminfo.parent, res);
      let count = 1;
      while (iteminfo.parent) {
        iteminfo = iteminfo.parent;
        res.push(iteminfo[key])
        // console.log('push res', res);
        count++;
        if (count > 100) {
          break;
        }
      }
      res = res.reverse();
    }
  }
  console.log('res', res);
  return res;
}

utils.sortItem = function(a, b) {
  if (a.item_type_sort_id === b.item_type_sort_id) {
    return a.item_sort_id - b.item_sort_id
  }
  return a.item_type_sort_id - b.item_type_sort_id
}

// src dest都有这个字段才赋值
utils.assign = function(dest, src) {
  for (const key in dest) {
    if (dest.hasOwnProperty(key)) {
      if (src.hasOwnProperty(key) && src[key] != null) {
        dest[key] = src[key];
      }
    }
  }
}

utils.assignBySrc = function(dest, src) {
  for (const key in src) {
    if (src.hasOwnProperty(key) && src[key] != null) {
      // dest[key] = src[key];
      Vue.set(dest, key, src[key])
    }
  }
}

utils.getChange = function(dest, src) {
  const change = {};
  for (const key in dest) {
    if (dest.hasOwnProperty(key) && src.hasOwnProperty(key)) {
      if (dest[key] !== src[key]) {
        change[key] = dest[key];
      }
    }
  }
  return change;
}


utils.showAllChild = function(item, showflag) {
  if (item.children.length > 0) {
    item.children.forEach(childitem => {
      childitem.show = showflag;
      if (childitem.children && childitem.children.length > 0) {
        utils.showAllChild(childitem, showflag);
      }
    })
  }
}

// 把节点按照树的顺序排列
utils.initChild = function(dest, item) {
  if (item.children && item.children.length > 0) {
    item.children.forEach(childitem => {
      dest.push(childitem);
      if (childitem.children && childitem.children.length > 0) {
        utils.initChild(dest, childitem);
      }
    })
  }
}

// 生成用于cascader的结构
utils.updateCascaderChild = function(src_list, dest_list, openMenus, topTypeList) {
  utils.copyList(src_list, dest_list, item => {
    Vue.set(item, 'open', false);// 是否折叠或展开
    Vue.set(item, 'value', item.id)
    Vue.set(item, 'label', item.name)

    if (item.level === 1) {
      Vue.set(item, 'show', true);// 是否显示
    } else {
      Vue.set(item, 'show', false);
    }
  })

  // 生成树结构
  dest_list.forEach(item => {
    dest_list.forEach(children => {
      if (children.parent_id === item.id) {
        item.children = item.children || [];
        item.children.push(children);
        children.parent = item;
      }
    })
  })

  // 树结构进行排序
  const treelist = [];
  dest_list.forEach(item => {
    if (item.level === 1) {
      treelist.push(item)
      utils.initChild(treelist, item);
    }
  });
  utils.copyList(treelist, dest_list);

  dest_list.forEach(item => {
    const openflag = openMenus.includes(item.id);
    if (item.children && item.children.length > 0) {
      item.open = openflag;
      if (item.level === 1) {
        utils.showAllChild(item, openflag);
      }
    } else {
      item.open = true;
    }
  })

  // 只有第一层
  topTypeList.splice(0);
  dest_list.forEach(item => {
    if (item.level === 1) {
      topTypeList.push(item);
    }
  })
}

utils.GetLevel = function(parentid, datalist) {
  if (!parentid) {
    return 1
  } else {
    const parentinfo = datalist.find(item => item.id === parentid)
    return parentinfo.level + 1
  }
}

utils.getCheckdItem = function(dataList, cb) {
  const checkArr = []
  dataList.forEach(item => {
    if (item.checked) {
      checkArr.push(item.id);
      if (cb) { cb(item) }
    }
  })
  return checkArr;
}

utils.formatDate = function(time) {
  if (time) {
    return basetool.gettimeDateStr(time * 1000);
  } else {
    return '';
  }
}

utils.formatTime = function(time) {
  if (time) {
    return basetool.getTimeStr(time * 1000);
  } else {
    return '';
  }
}

utils.getSelectName = function(value, selectlist) {
  // console.log(value, selectlist)
  const res = selectlist.find(item => {
    if (item.id === value) {
      return true;
    } else if (item.id + '' === value) {
      return true;
    }
  })
  if (res) {
    if (res.name) {
      return res.name
    } else {
      return res.title;
    }
  }
  return ''
}

utils.remove = function(arr, val) {
  const index = arr.indexOf(val);
  if (index > -1) {
    arr.splice(index, 1);
  }
};


utils.copytext = function(text) {
  const input = document.createElement('input');
  document.body.appendChild(input);
  input.setAttribute('value', text);
  input.select();
  if (document.execCommand('copy')) {
    document.execCommand('copy');
  } else {
    return false
  }
  document.body.removeChild(input);
  return true;
}



export default utils;