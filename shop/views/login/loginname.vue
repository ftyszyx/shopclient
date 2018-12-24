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
         <label>账号名:</label>
         <input type="text" flex-box="1"    placeholder="输入账号名" v-model="phone">
       </div>
       <div class="rowitem" flex="dir:left main:left cross:center" >
         <label>密码:</label>
         <input v-if="showpass==false" type="password"  flex-box="1"   placeholder="密码" v-model="passsword">
         <input v-if="showpass" flex-box="1"   placeholder="密码" v-model="passsword">
         <i @click="showpass=!showpass" style="    font-size: 50px;" class="iconfont zyx-kejian "></i>
       </div>
        <div class="blue-color loginbtn"  @click="handleSubmit()">{{suretext}}</div>
     </div>
  </div>
</template>

<script>
import mymix from 'src/mixin'
export default {
  mixins: [mymix],
  name: 'namelogin',
  data() {
    return {
      phone: '', // 手机号
      passsword: '',
      showpass: false,
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

    handleSubmit() {
      this.$emit('submit', this.phone, this.passsword)
    }
  },
  created() {

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
