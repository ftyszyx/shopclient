import model from 'src/model'
import conf from 'src/config.js'
import util from 'common/utils'
import global from 'src/global'

import { post } from 'common/api'
export default {
  data() {
    return {
      app: model.app,
      groupid: model.user.groupid,
      global,
      suffix: global.pic_suffix,
      user: model.user
    }
  },
  watch: {
    groupid() {
      console.log('update group ', this.$options.name)
      this.$forceUpdate();
    }
  },
  methods: {
    checkPhone(value) {
      const numberreg = /^((0\d{2,3}-\d{7,8})|(1[3456789]\d{9}))$/ // 手机号
      return numberreg.test(value)
    },
    gotoSearch(value) {
      model.app.search = { name: value }
      this.$router.push({ path: '/search' });// 跳转到登录页面
    },
    getUploadUrl(action) {
      // picupload
      return conf.baseURL + action + '?token=' + window.localStorage.getItem('token') + '&uid=' + window.localStorage.getItem('uid');
    },
    goback() {
      this.$router.back()
    },
    addnum(num, iteminfo) {
      if (!iteminfo.basenum || iteminfo.basenum === 1) {
        return num + 1
      }
      const remainnum = num % iteminfo.basenum
      if (remainnum > 0) {
        return num + iteminfo.basenum - remainnum
      }
      return num + iteminfo.basenum;
    },
    getPriceValue(price) {
      return parseFloat(price)
    },
    getGroupPrice(defaultprice, groupinfo) {
      // console.log('getGroupPrice ', this.$options.name)
      // console.log('default price:', defaultprice, 'groupinfo', groupinfo, 'groupid', this.user.groupid)
      if (groupinfo) {
        for (let i = 0; i < groupinfo.length; i++) {
          const item = groupinfo[i]
          if (item.groupid === this.user.groupid) {
            console.log('get price', item.price)
            return item.price
          }
        }
      }
      console.log('get default')
      return defaultprice
    },
    delnum(num, iteminfo) {
      // console.log('basenum', iteminfo.basenum)
      let basenum = 1;
      let minnum = 1;
      if (iteminfo.min_num) {
        minnum = iteminfo.min_num
      }
      if (iteminfo.basenum && iteminfo.basenum > 1) {
        basenum = iteminfo.basenum
      }
      if (num <= basenum || num <= minnum) {
        this.$toast('已经达到购买的最小数量')
        return num
      } else {
        let newnum = num
        const remainnum = num % basenum
        if (remainnum > 0) {
          newnum = num - remainnum
        } else {
          newnum = num - basenum
        }
        if (newnum < minnum) {
          this.$toast('已经达到购买的最小数量')
          return num
        } else {
          return newnum
        }
      }
    },
    delAddress(item, index) {
      const adresslist = this.user.address
      const this2 = this
      this.$messagebox.confirm('确定要删除？').then(action => {
        console.log(action)
        if (action === 'confirm') {
          adresslist.splice(index, 1)
          const address = JSON.stringify(adresslist)
          post('user', 'UpdateAddress', { address })
          .then(() => {
            this2.$toast('删除成功')
          }).catch(err => {
            console.log(err)
          })
        }
      }).catch(err => {
        console.log(err)
      });
    },
    input_numchange(event, iteminfo) {
      // console.log('num', event.target.value, iteminfo.basenum)
      let minnum = 1;
      if (iteminfo.min_num) {
        minnum = iteminfo.min_num
      }
      let basenum = 1;
      if (iteminfo.basenum && iteminfo.basenum > 1) {
        basenum = iteminfo.basenum
      }
      const num = event.target.value;
      if (num % basenum > 0) {
        this.$toast('购买数量需要为' + basenum + '的倍数')
      }
      if (num < minnum) {
        this.$toast('小于购买的最小数量' + minnum)
      }
    },
    getSelectName(value, selectlist) { return util.getSelectName(value, selectlist) },
    formatDate(time) { return util.formatDate(time) },
    formatTime(time) { return util.formatTime(time) },

    validate(rules, curvalue, name) {
      console.log('valide')
      util.validate(rules, curvalue, name, errormsg => {
        this.$toast(errormsg)
      });
    }
  },
  created() {
  }


};