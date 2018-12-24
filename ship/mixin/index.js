import model from 'src/model'
import global from 'src/global'
import conf from 'src/config.js'
export default {
  data() {
    return {
      app: model.app,
      suffix: global.pic_suffix,
      user: model.user,
      global
    }
  },
  watch: {
  },
  methods: {
    getUploadUrl(action) {
      // picupload
      return conf.baseURL + action + '?token=' + window.localStorage.getItem('token') + '&uid=' + window.localStorage.getItem('uid');
    },
    goback() {
      this.$router.back()
    }
  }

};