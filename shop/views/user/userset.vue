<template>
  <div style="width:100%;height:100%;">
      <mt-header fixed title="个人资料">
          <div @click="goback()" slot="left">
            <i class="mintui mintui-back"></i>
              <span>返回</span>
          </div>
        </mt-header>
      <div class="content content-box-top" flex="dir:top main:left cross:center" >
         <div class="rowitem" flex="dir:left main:justify cross:center" >
            <span>头像</span>
              <el-upload  class="upload-box" 
                :action="getUploadUrl('picupload')"
                :show-file-list="false" 
                name="upfile" 
                accept="image/*"
                :data="picform"
                :on-success="handleSuccess">
                 <button  flex="dir:left main:left cross:center">
                    <template v-if="user.head">
                      <img class="headpic" :src="user.head">
                    </template>
                    <template v-else>
                        <!-- <img class="headpic" src="~assets/img/head.png"> -->
                        <i class="iconfont zyx-custom-my" style="font-size:30px;color: #dc0d0d;"></i>
                    </template>
                    <i class="iconfont zyx-arrow-right"></i>
                </button>
              </el-upload>
          </div>

          <div class="rowitem" flex="dir:left main:justify cross:center" >
            <span>账号</span>
            <div  flex="dir:left main:left cross:center">
                <span>{{user.account}}</span>
            </div>
          </div>

           <div class="rowitem" flex="dir:left main:justify cross:center" >
            <span>姓名</span>
            <div @click="changeName()" flex="dir:left main:left cross:center">
                <span>{{user.name}}</span>
                <i class="iconfont zyx-arrow-right"></i>
            </div>
          </div>

           <div class="rowitem" flex="dir:left main:justify cross:center" >
            <span>手机</span>
            <div @click="changePhone()" flex="dir:left main:left cross:center">
                <span v-if="user.phone">{{user.phone}}(修改手机号)</span>
                <span v-else>绑定手机号</span>
                <i class="iconfont zyx-arrow-right"></i>
            </div>
          </div>

          <div class="rowitem" flex="dir:left main:justify cross:center" >
            <span>微信</span>
            <div @click="linkwchat()" flex="dir:left main:left cross:center">
                <span  v-if="user.wchat_openid===''">(绑定微信)</span>
                <span v-else>已绑定</span>
                <i class="iconfont zyx-arrow-right"></i>
            </div>
          </div>

          <div @click="logout()" class="logoutbtn">退出登录</div>

      </div>
     
  </div>
</template>

<script>

// 框架

import mymix from 'src/mixin'
import { post, get } from 'common/api'
import Vue from 'vue'
import ElUpload from 'common/components/upload'
import model from 'src/model'
Vue.component(ElUpload.name, ElUpload);

export default{

  mixins: [mymix],
  data() {
    return {
      picform: {}

    }
  },
  components: {
    ElUpload
  },
  watch: {

  },

  methods: {
    handleSuccess(data, file) {
      console.log('resp', data, file)
      const path = data.data.url
      post('user', 'UpdateHead', { head: path })
      .then(() => {
        this.$toast('修改成功')
        this.user.head = path
        // this.$forceUpdate();
      }).catch(err => {
        console.log(err)
      })
    },
    changeName() {
      this.$messagebox.prompt('请输入姓名').then(({ value, action }) => {
        console.log(value, action)
        if (action === 'confirm') {
          if (value === '') {
            this.$toast('不能为空')
          } else {
            post('user', 'UpdateName', { name: value })
            .then(() => {
              this.$toast('修改成功')
              this.user.name = value
            }).catch(err => {
              console.log(err)
            })
          }
        }
      }).catch(err => {
        console.log(err)
      });
    },
    changePhone() {
      this.$router.push({ path: '/changephone' });
    },
    logout() {
      get('login', 'logout')
      .then(() => {
        this.$toast('登出成功')
        this.user.name = ''
        window.localStorage.setItem('token', '')
        window.localStorage.setItem('uid', '')
        this.$router.push({ path: '/' });
      }).catch(err => {
        console.log(err)
      })
    },
    linkwchat() {
      if (this.user.wchat_openid === '') {
        // 去绑定
        post('login', 'LoginWithWchat', {})
        .then(data => {
          console.log('data', data)
          window.location.href = data.url;
        })
        .catch(err => {
          console.log(err)
        })
      }
    }

  },
  created() {
    console.log('user', model.user)
    this.user.checkLogin(hasupdate => {
      if (hasupdate) {
        this.$forceUpdate();
      }
    });
  }
}
</script>

<style scoped>
.headpic{
  background: #FFFFFF;
    border: 2px solid #FFFFFF;
    height: 30px;
    border-radius: 50%;
    width: 30px;
}
.rowitem{
  padding: 0 5px;
  width: 100%;
  height: 50px;
  line-height: 50px;
  font-size: 14px;
  color: black;
  text-align: center;
  border-bottom: 1px solid #0000002e;
}

.logoutbtn{
  width:100%;
  height: 40px;
  line-height: 40px;
  font-size: 16px;
  color: white;
  position: fixed;
  text-align: center;
  bottom:10px;
  background-color: red;
}

.content{
  width:100%;
}
</style>
