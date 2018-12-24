<template>
  <div flex="dir:top main:justify cross:left" style="height:100vh;">
    <!-- <phone-check backhome title="登录页" suretext="登录" v-on:submit="handlelogin"></phone-check>  -->
    <name-login backhome title="登录页" suretext="登录" v-on:submit="handleloginByName"></name-login>
   
    <div  flex="dir:top main:left cross:center" style="margin-bottom: 10%;">
      <i @click="handleWchatLogin()"  class="iconfont zyx-wechat" style="font-size:40px;color:#1f9a27;"></i>
      <div @click="handleWchatLogin()"  style="font-size:16px;">微信登录</div>
    </div>
  </div>
   
</template>

<script>
import { post } from 'common/api'
import model from 'src/model'
import PhoneCheck from 'shop/views/user/phonecheck'
import NameLogin from 'shop/views/login/loginname'
export default {
  name: 'login',
  data() {
    return {
    }
  },
  components: {
    PhoneCheck,
    NameLogin
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
    handleloginByName(username, password) {
      post('login', 'login', { username, password })
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
    } else {
      // this.handleWchatLogin();
    }
  }

}
</script>

<style scoped>

</style>
