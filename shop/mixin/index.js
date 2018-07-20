import model from 'src/model'
import conf from 'src/config.js'
import util from 'common/utils'
export default {
  data() {
    return {
      app: model.app,
      user: model.user
    }
  },
  watch: {
  },
  methods: {
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