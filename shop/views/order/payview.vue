<template>
<div>
  <mt-header fixed title="支付">
        <div @click="goback()" slot="left">
          <i class="mintui mintui-back"></i>
          <span>返回</span>
        </div>
    </mt-header>
  <div class="content-box-top" flex="dir:top main:left cross:center">
     <img  class="paypic" :src="app.site_pay_code">
     <div class="rowitem" >订单金额:<span style="  padding: 0 20px;  color: red;">￥{{money}}</span></div>
     <div class="rowitem">支付时，请复制订单码，填写到支付页面的备注中（不填写备注支付无效）:
          <!-- <input type="text" id="payidcode"   readonly style="color: red;" v-model="pay_id"> -->
          <span id="payidcode" style="  padding: 0 20px;  color: red;">{{pay_id}}</span>
          <div class="copytext-btn"   @click.stop="copytext(pay_id)">复制订单码</div>
     </div>
     <div class="buttonrow" @click="paycheck()">确认已付款</div>
     <!-- <div>请点击上面'复制付款码'，谢谢</div> -->
  </div>

  <mt-popup
        v-model="popupVisible"
        position="bottom">
        <!-- <mt-picker :slots="addressSlots" @change="onAddressChange" :visible-item-count="5"></mt-picker> -->
        <div style="height:auto;" class="textrow" flex="dir:top main:left cross:left">
            <div style="font-weight: bold;    line-height: 30px;">选择支付类型</div>
            <ul>
              <li  flex="dir:left main:left cross:center" :key="checkitem.id" v-for="checkitem in global.orderPayType" @click="checkPayType=checkitem.id">  
                <i style="font-size: 25px;color: red;" v-show="checkitem.id!=checkPayType" class="iconfont zyx-checkno"></i>
                <i style="font-size: 25px;color: red;"  v-show="checkitem.id==checkPayType" class="iconfont zyx-check"></i>
                <div>{{checkitem.title}}<span v-if="checkitem.tip" style="color: red;">({{checkitem.tip}})</span></div>
              </li>
            </ul>
            <div class="buttonrow" @click="payok()">确认</div>
          </div>
    </mt-popup>
</div>
</template>

<script>

import mymix from 'src/mixin'
import { post } from 'common/api'
import util from 'common/utils'
import global from 'src/global'
export default{
  name: 'payview',
  mixins: [mymix],
  data() {
    return {
      popupVisible: false,
      checkPayType: global.orderPayScanType,
      pay_id: '',
      order_id: '',
      copyclick: false,
      money: ''
    }
  },
  watch: {

  },
  components: {

  },
  methods: {
    paycheck() {
      if (this.copyclick === false) {
        this.$toast('请点击上面"复制付款码"，并在扫码支付时备注')
        return
      }
      this.popupVisible = true
    },
    payok() {
      this.popupVisible = false

      const senddata = { pay_type: this.checkPayType, pay_id: this.pay_id, money: this.money }
      if (this.order_id) {
        senddata.order_id = this.order_id
      }
      post('ShopOrder', 'SetPayOk', senddata)
      .then(() => {
        this.$toast('确认成功')
        // this.copyclick = false
        this.goback()
        console.log('this.app.lastpath', this.app.lastpath)
        // this.$router.push({ path: this.app.lastpath });
        this.app.payokEvent = true;
      })
      .catch(err => {
        this.app.payokEvent = false;
        console.log(err)
      })
    },
    copytext(value) {
      const node = document.getElementById('payidcode')
      if (util.copytext(value, node)) {
        this.$toast('复制成功');
      } else {
        this.$toast('复制失败，请手动复制');
      }
      this.copyclick = true
    }


  },

  created() {
    this.copyclick = false
    // this.$set(this.app, 'payokEvent', false)
    this.app.payokEvent = false;
    this.user.checkLogin();
    const params = this.$route.params
    console.log(params)
    this.pay_id = params.pay_id
    this.order_id = params.id
    this.money = params.money
    // if (((this.pay_id || '') === '') || ((this.order_id || '') === '')) {
    //   this.$router.push({ path: '/' });
    // }
    if ((this.pay_id || '') === '') {
      this.$router.push({ path: '/' });
    }
  }
}
</script>

<style scoped>
.paypic{
  max-width: 100%;
}
.buttonrow{
    width:100%;
    height: 40px;
    line-height: 40px;
    font-size: 16px;
    color: white;
    text-align: center;    
    background-color: blue;
}
.copytext-btn{
  cursor: pointer;
  padding: 0 20px;
  height: 30px;
  line-height: 30px;
  background: red;
  color: white;
  text-align: center;
  display: inline-block;
}
.rowitem{
   width:100%;
    height: 100%;
    font-weight: bold;
     line-height: 40px;
     font-size: 16px;
}
</style>
