<template>
  <div style="heigt:100%;" flex="dir:top main:left cross:center">
       <div class="textrow" flex="dir:left main:left cross:center">
          <span  class="input-title">物流号：</span>
          <div  flex-box="1" class="inputbox">
              <input class="inputvalue" placeholder="输入物流号" type="text" v-model="logistics">
          </div>
           <div style="text-align: center;" @click="saoma()"><i style="font-size: 30px;padding: 0 10px;" class="zyx-saoma iconfont" ></i></div>
          <div class="button-serach" @click="searchPostid()">搜索</div>
      </div>
      
       <div flex="dir:top main:left cross:left" style="margin-bottom:10px;">
          <div v-if="resstr!==''" class="errtext">{{resstr}}</div>
          <div style="width:100%;    border-bottom: 1px solid #80808078;" :key="index" v-for="(postitem,index) in postlist" flex="dir:left main:left cross:stretch">
              <div  style="width:20%;padding: 10px 0;">{{postitem.time}}</div>
              <div   style=" width:80%;padding: 10px 0;  border-left: 1px solid #80808078;">{{postitem.context}}</div>
          </div>
      </div>
      <div @click="showChangeinfo()" v-if="showUploadDataBtn&&(idnum==''||idnumpic1==''||idnumpic2=='')" class="idinfobtn">
        补充身份证信息
      </div>
      <order-edit v-if="showeditOrderPanel" v-on:close="showeditOrderPanel=false" :orderInfo="selectOrder" v-on:submit="changeidinfo"></order-edit>
  </div>
</template>

<script>
 import models from 'src/model'
 import mymix from 'src/mixin'
 import { post } from 'common/api'
 import dateformat from 'common/utils/date_format.js';
 import util from 'common/utils'
 import conf from 'src/config.js'
 import OrderEdit from 'shop/views/order/orderedit'
// 框架
 export default{
   name: 'home',
   mixins: [mymix],
   data() {
     return {
       logistics: '',
       resstr: '',
       idnumpic1: '',
       idnumpic2: '',
       idnum: '',
       showeditOrderPanel: false,
       selectOrder: {},
       showUploadDataBtn: false,
       postlist: []
     }
   },
   watch: {

   },
   components: {
     OrderEdit
   },

   methods: {
 
     saoma() {
       const tempthis = this
       wx.scanQRCode({
         needResult: 1, // 默认为0，扫描结果由微信处理，1则直接返回扫描结果，
         scanType: ['qrCode', 'barCode'], // 可以指定扫二维码还是一维码，默认二者都有
         success(res) {
           const result = res.resultStr; // 当needResult 为 1 时，扫码返回的结果
           console.log('result', result)
           tempthis.logistics = result
         }
       });
     },
     showChangeinfo() {
       models.user.checkLogin(() => {
         this.selectOrder = { idnum: this.idnum, idnumpic1: this.idnumpic1, idnumpic2: this.idnumpic2, id: this.logistics }
         this.showeditOrderPanel = true
       })
     },
     changeidinfo(data) {
       post('Logistics', 'ClientChangeInfo', data)
        .then(() => {
          this.$toast('上传成功')
          this.idnum = data.idnum || ''
          this.idnumpic1 = data.idnumpic1 || ''
          this.idnumpic2 = data.idnumpic2 || ''
          this.showeditOrderPanel = false
        }).catch(err => {
          console.log(err)
        })
     },
     // AB62104258AU
     searchPostid() {
       this.resstr = ''
       if (this.logistics) {
         post('Logistics', 'GetLogicsInfo', { id: util.trim(this.logistics) })
        .then(data => {
          this.showUploadDataBtn = true
          if (!data.data || data.data.length === 0) {
            this.resstr = '该单号暂无物流进展'
            return;
          }
          this.idnum = data.idinfo.idnum || ''
          this.idnumpic1 = data.idinfo.idnumpic1 || ''
          this.idnumpic2 = data.idinfo.idnumpic2 || ''
          util.copyList(data.data, this.postlist, item => {
            const date = dateformat.parse(item.time, 'yyyy-MM-dd HH:mm:ss');
            item.time = dateformat.format(date, 'yyyy-MM-dd');
          })
        }).catch(err => {
          this.showUploadDataBtn = false
          console.log('err', err)
        })
       } else {
         this.$toast('单号不能为空')
       }
     }
   },
   created() {
     this.resstr = ''
  // conf.baseURL + this.$route.fullPath.replace(/^\//, '')
     const agent = navigator.userAgent.toLowerCase();
     // const android = agent.indexOf('android');
    //  const iphone = agent.indexOf('iphone');
    //  const ipad = agent.indexOf('ipad');
 
     console.log('agent', agent)
     const url = window.location.href.split('#')[0]
  //   if (iphone !== -1 || ipad !== -1)
    //  {
    //    url = url.replace(/\/.*/, '')
    //  }
     post('user', 'GetWchatJsConf', { url })
    .then(data => {
      window.wx.config({
        debug: false, // 开启调试模式,调用的所有api的返回值会在客户端alert出来，若要查看传入的参数，可以在pc端打开，参数信息会通过log打出，仅在pc端时才会打印。
        appId: data.app_id, // 必填，公众号的唯一标识
        timestamp: data.timestamp, // 必填，生成签名的时间戳
        nonceStr: data.nonce_str, // 必填，生成签名的随机串
        signature: data.signature, // 必填，签名
        jsApiList: ['scanQRCode'] // 必填，需要使用的JS接口列表
      });
    }).catch(err => {
      console.log(err)
    })
   }


 }
</script>

<style scoped>
.errtext{
      margin-top: 10vh;
    color: red;
    font-weight: bold;
    font-size: 20px;
}
  .button-serach{
    background-color: red;
    /* padding: 5px 5px; */
    color: white;
    cursor: pointer;
    width: 20%;
    line-height: 30px;
    height: 30px;
    text-align: center;
  }
  .textrow{
    width:100%;
    height:  40px;
    padding: 10px;
    background: #fff;
    border-bottom: 1px solid #e2e2e2;
}

.textrow .input-title{
    width: 20%;
    text-align: left;
    line-height: 40px;
    font-size: 16px;
    white-space: nowrap;
    overflow: hidden;
}

.textrow  .inputvalue{
    line-height: 40px;
    width:100%;
    height: 35px;
    border: 0;
    font-size: 16px;
}

.idinfobtn{
  cursor: pointer;
  width:100%;
  height: 40px;
  line-height: 40px;
  font-size: 16px;
  color: white;
  position: fixed;
  bottom: 0px;
  text-align: center;    
  background-color: #04be02;
}

</style>
