<template>
  <div style="height:100%;">
     <mt-header fixed :title="title">
            <div @click="gohome()" slot="left">
              <i class="mintui mintui-back"></i>
               <span>返回</span>
            </div>
      </mt-header>
     <div class="content content-box-top"  >
       <div class="rowitem" flex="dir:left main:left cross:center" >
         <label>手机号:</label>
         <input type="text" flex-box="1"    placeholder="输入手机号" v-model="phone">
       </div>
       <div class="rowitem" flex="dir:left main:left cross:center" >
         <label>验证码:</label>
         <input type="text" flex-box="1"  placeholder="输入验证码" v-model="captchaCode">
          <img :src="captchpath" height="48px" width="100px" @click="refresh()">
       </div>
       <div class="rowitem" flex="dir:left main:left cross:center" >
         <label>动态码:</label>
         <input type="text"  flex-box="1"   placeholder="输入动态码" v-model="code">
         <div class=" blue-color rowitem-button" @click="getCode()">获取验证码</div>
       </div>
        <div class="blue-color loginbtn"  @click="handleSubmit()">{{suretext}}</div>
     </div>
  </div>
</template>

<script>
import mymix from 'src/mixin'
import { post, get } from 'common/api'
import conf from 'src/config'
export default {
  mixins: [mymix],
  name: 'phonecheck',
  data() {
    return {
      phone: '', // 手机号
      code: '', // 手机码
      captchaCode: '', // 验证码
      captchpath: '', // 验证码图片路径
      captchid: '', // 验证码id
      freshnum: 0 // 刷新次数
    }
  },
  props: {
    title: { type: String, default: '' },
    backhome: { type: Boolean, default: false },
    suretext: { type: String, default: '' }
  },
  methods: {
    gohome() {
      if (this.backhome) {
        this.$router.push({ path: '/home' });
      } else {
        this.goback()
      }
    },
    getpicPath() {
      const baseurl = conf.baseURL + 'captcha/' + this.captchid + '.png'
      if (this.freshnum > 0) {
        return baseurl + '?reload=' + this.freshnum
      }
      return baseurl
    },
    getCode() {
      post('login', 'getphonecode', { phone: this.phone, Captcha_id: this.captchid, Captcha: this.captchaCode }).then(data => {
        this.$toast('验证码发送成功')
      }).catch(err => {
        console.log(err)
      })
    },
    refresh() {
      this.freshnum = this.freshnum + 1
      this.captchpath = this.getpicPath()
    },
    handleSubmit() {
      this.$emit('submit', this.phone, this.code)
    }
  },
  created() {
    get('login', 'getcaptcha').then(data => {
      this.captchid = data.codeid
      this.captchpath = this.getpicPath()
    }).catch(err => {
      console.log(err)
    })
  }

}
</script>

<style scoped>
.loginbtn{
      width: 70%;
    margin: 10px auto;
    height: 40px;
    line-height: 40px;
    text-align: center;
    color: white;
    font-size: 15px;
    cursor: pointer;
    border-radius: 20px;
}

.rowitem{
  line-height: 50px;
  font-size: 15px;
  border-bottom: 1px solid #0000002e;
  text-align: center;
}
.rowitem label{
  width:100px;
  /* text-align: left; */
    /* padding: 0 10px; */
}

.rowitem input{
  font-size: 15px;
  outline: 0;
  line-height: 1.6;
      border-radius: 0;
    border: 0;
}

.rowitem .rowitem-button{
  width:20%;
  height: 50px;
  color: white;
  /* background-color: blue; */
}
</style>
