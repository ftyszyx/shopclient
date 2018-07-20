<template>
  <div>
    <phone-check backhome title="登录页" suretext="登录" v-on:submit="handlelogin"></phone-check> 
    <div @click="handleWchatLogin()" class="thirdlogin" flex="dir:top main:left cross:center" >
      <i class="iconfont zyx-wechat" style="font-size:40px;color:#1f9a27;"></i>
      <div style="font-size:16px;">微信登录</div>
    </div>
  </div>
   
</template>

<script>
import { post } from 'common/api'
import model from 'src/model'
import PhoneCheck from 'views/user/phonecheck'
export default {
  data() {
    return {
    }
  },
  components: {
    PhoneCheck
  },
  methods: {
    handlelogin(phone, code) {
      post('login', 'loginwithphone', { phone, code })
      .then(data => {
        this.$toast('登录成功')
        window.localStorage.setItem('token', data.token)
        window.localStorage.setItem('uid', data.uid)
        this.$router.push({ path: '/home' });
      })
      .catch(err => {
        console.log(err)
      })
    },
    handleWchatLogin() {
      post('login', 'LoginWithWchat', {})
      .then(data => {
        console.log('data', data)
        window.location.href = data.url;
      })
      .catch(err => {
        console.log(err)
      })
    }
  },
  created() {
    // http://shop.bqmarket.com/login?uid=7&token=3cdf121333077f420f24ef1ff5955f04
    console.log('create');
    console.log('route.quer', this.$route.query)
    window.localStorage.setItem('lasturl', model.app.lastpath)
    if (this.$route.query.uid) {
      window.localStorage.setItem('token', this.$route.query.token)
      window.localStorage.setItem('uid', this.$route.query.uid)
      const lastpath = window.localStorage.getItem('lasturl')
      console.log('lastpath', lastpath)
      this.$toast('登录成功')
      if (lastpath && lastpath !== '/login') {
        this.$router.push({ path: '/home' });
      } else {
        this.$router.push({ path: lastpath });
      }
    }
  }

}
</script>

<style scoped>
.thirdlogin{
  position: fixed;
  bottom: 30px;
  left: 0;
  right: 0;

}
</style>
