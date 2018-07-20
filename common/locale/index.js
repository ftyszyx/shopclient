import defaultLang from 'common/locale/lang/zh-CN';
import Format from './format';

const format = Format();
let lang = defaultLang;

export const t = function(path, options) {
  const array = path.split('.');
  let current = lang;

  for (let i = 0, j = array.length; i < j; i++) {
    const property = array[i];
    // console.log('current', current, property);
    const value = current[property];
    if (i === j - 1) return format(value, options);
    if (!value) return '';
    current = value;
  }
  return '';
};

export const use = function(l) {
  lang = l || lang;
};

export default { use, t };
