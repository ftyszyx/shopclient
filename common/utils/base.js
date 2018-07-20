import AsyncValidator from 'async-validator';
const base_tool = {};
base_tool.FormatTime = function(date, fmt) { // author: meizz
  const o = {
    'M+': date.getMonth() + 1, // 月份
    'd+': date.getDate(), // 日
    'h+': date.getHours(), // 小时
    'm+': date.getMinutes(), // 分
    's+': date.getSeconds() // 秒
  };
  if (/(y+)/.test(fmt)) fmt = fmt.replace(RegExp.$1, (date.getFullYear() + '').substr(4 - RegExp.$1.length));
  for (const k in o) { if (new RegExp('(' + k + ')').test(fmt)) fmt = fmt.replace(RegExp.$1, RegExp.$1.length === 1 ? o[k] : ('00' + o[k]).substr(('' + o[k]).length)); }
  return fmt;
}

base_tool.format = function(src) {
  if (arguments.length === 0) return null
  const args = Array.prototype.slice.call(arguments, 1)
  return src.replace(/\{(\d+)\}/g, (m, i) => args[i])
}

base_tool.getUploadfilename = function(file) {
  const curdate = new Date(file.lastModified);
  const prefix = base_tool.FormatTime(curdate, 'hhmmss').toString()
    // console.log('curdate,src,prefix', file.lastModified, curdate, prefix);
  const suffix = file.name.toLowerCase()
    // const key = encodeURI(`${curr}_${prefix}_${suffix}`)
  const key = encodeURI(`${prefix}_${suffix}`)
  return key;
}


base_tool.getResPath = function(hostname, key) {
  return `${hostname}${encodeURI(key)}`
}


base_tool.getOptionName = function(titleinfo, value) {
  let getvalue = value;
  titleinfo.enumlist.forEach(item => {
    if (item.title && item.value === value) {
        // console.log('get item', item.title);
      getvalue = item.title;
    }
  })

  return getvalue;
}



base_tool.getTime = function(timestr) {
  let time = new Date();
  if (timestr) {
      // timestr = timestr.replace(/-/g, '/');// cichu用于显示ie日期乱码
    time = new Date(timestr)
  }
  return time;
}


base_tool.getTimeStr = function(timestr) {
  const time = base_tool.getTime(timestr);
  return base_tool.FormatTime(time, 'yyyy-MM-dd hh:mm:ss')
  // return time.getFullYear() + '-' + (time.getMonth() + 1) + '-' + time.getDate() + ' ' + time.getHours() + ':' + time.getMinutes() + ':' + time.getSeconds();
}


base_tool.gettimeDateStr = function(timestr) {
  const time = base_tool.getTime(timestr);
  return time.getFullYear() + '-' + (time.getMonth() + 1) + '-' + time.getDate();
}


  // 验证
base_tool.validate = function(rules, filedname, value, callback = () => {}) {
  if (!rules || rules.length === 0) {
        // 没有规则
    callback();
    return true;
  }
  const descriptor = {};
  descriptor[filedname] = rules;// 验证的规则

  const validator = new AsyncValidator(descriptor);
  const model = {};

  model[filedname] = value; // 输入的值

  validator.validate(model, { firstFields: true }, errors => {
    const validateMessage = errors ? errors[0].message : '';
    callback(validateMessage);
  });
}

base_tool.generateId = function() {
  return Math.floor(Math.random() * 10000);
};

base_tool.isDef = function(val) {
  return val !== undefined && val !== null;
}

base_tool.scrollIntoView = function(container, selected) {
  if (!selected) {
    container.scrollTop = 0;
    return;
  }

  const top = selected.offsetTop;
  const bottom = selected.offsetTop + selected.offsetHeight;
  const viewRectTop = container.scrollTop;
  const viewRectBottom = viewRectTop + container.clientHeight;

  if (top < viewRectTop) {
    container.scrollTop = top;
  } else if (bottom > viewRectBottom) {
    container.scrollTop = bottom - container.clientHeight;
  }
}


base_tool.DelExt = function(str) {
  const reg = /\.\w+$/;
  return str.replace(reg, '');
}



module.exports = base_tool;