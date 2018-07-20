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
     <div class="rowitem">请支付时填写备注(不填写备注支付无效):<span style="  padding: 0 20px;  color: red;">{{pay_id}}</span>
          <div class="copytext-btn"  @click="copytext(pay_id)">复制订单码</div>
     </div>
     <div class="buttonrow" @click="payok()">确认已付款</div>
  </div>
</div>
</template>

<script>

import mymix from 'src/mixin'
import { post } from 'common/api'
import util from 'common/utils'
export default{
  mixins: [mymix],
  data() {
    return {
      pay_id: '',
      order_id: '',
      money: ''
    }
  },
  watch: {

  },
  components: {

  },
  methods: {
    payok() {
      post('ShopOrder', 'SetPayOk', { id: this.order_id })
      .then(() => {
        this.$toast('确认成功')
        this.goback()
      })
      .catch(err => {
        console.log(err)
      })
    },
    copytext(value) {
      if (util.copytext(value)) {
        this.$toast('复制成功');
      } else {
        this.$toast('复制失败');
      }
    }

  },

  created() {
    this.user.checkLogin();
    const params = this.$route.params
    console.log(params)
    this.pay_id = params.pay_id
    this.order_id = params.id
    this.money = params.money
    if (((this.pay_id || '') === '') || ((this.order_id || '') === '')) {
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
