<template>
    <div class="loginbox">
      <!-- <div class="title"><h3 >登录</h3></div> -->
      <div class="box">
        <img src='~assets/img/username_bg.png'>
        <input v-on:blur='validate("username")' v-model="form.username">
        </div>
      <div class="box">
        <img src='~assets/img/password_bg.png'>
        <input v-on:blur='validate("password")' v-model="form.password" type="password">
        </div>
      <div id="loginbtnbox">
        <button class="button-common" @click="handlelogin">登录</button>
      </div>
    </div>
</template>

<script>
import models from 'src/model'
import util from 'common/utils'
import { post } from 'common/api'


export default {
  name: 'login',
  data() {
    return {
      form: {
        username: '',
        password: ''
      },
      rules: {
        username: [
            { required: true, message: '请输入用户名', trigger: 'blur' }
        ],
        password: [
            { required: true, message: '请输入密码', trigger: 'blur' },
            { min: 6, message: '密码长度要大于6', trigger: 'blur' }
        ]
      }
    }
  },
  methods: {
    handlelogin() {
      console.log('handle login')
      post('login', 'login', this.form)
      .then(() => {
        console.log('success')
        this.$router.push({ path: '/admin' });
      })
      .catch(err => {
        console.log('register err', err)
      })
    },
    validate(name) {
      util.validate(this.rules[name], name, this.form[name], errormsg => {
        this.$message({
          message: errormsg,
          type: 'error',
          duration: 1000
        })
      });
    }
  }
}
</script>

<style scoped>

.loginbox{
  width:262px;
  height: 300px;
  margin:100px auto;
}
.box{
  border: 1px solid #d9d9d8;
  background-color: #fff;
  border-radius: 3px;
  width: 260px;
  height: 38px;
  
}

.box input{
  line-height: 25px;
}
#loginbtnbox{
  margin-top: 10px;
}
</style>
