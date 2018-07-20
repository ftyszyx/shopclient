<template>
  <div>
      <div class="headbox" flex="dir:top main:center cross:center">
        <template v-if="user.head">
          <img class="headpic" :src="user.head">
        </template>
        <template v-else>
            <!-- <img class="headpic" src="~assets/img/head.png"> -->
            <i class="iconfont zyx-custom-my" style="font-size:60px;color: white;"></i>
        </template>
        <div class="headtext">{{user.name}}</div>
        <div flex="dir:left main:left cross:center" class="rightpos" @click="gotoMyset()">
          <div style="font-size:13px;" class="headtext">账号管理</div>
          <!-- <img src="~assets/img/right.png"> -->
          <i style="font-size: 15px;color: white;"  class="iconfont zyx-arrow-right"></i>
        </div>
      </div>
     
       <div>
         <div class="rowitem" flex="dir:left main:justify cross:center" style="width：100%;height:30px;">
            <span>我的订单</span>
            <div @click="gotoOrders()"  flex="dir:left main:left cross:center">
                <span>查看全部订单</span>
                <i class="iconfont zyx-arrow-right"></i>
            </div>
          </div>
          <ul class="orderbtn" flex="dir:left main:left cross:center" >
             <li @click="gotoOrders(global.orderStatusWaitPayValue)" flex="dir:top main:center cross:center">
                <div style="position: relative;">
                  <!-- <img src="~assets/img/pay.png"> -->
                  <i class="iconfont zyx-nopay"></i>
                  <div v-show="user.order_waitpay>0" class="tips">{{user.order_waitpay}}</div>
                </div>
                <span>待付款</span>
             </li>
             <li @click="gotoOrders(global.OrderStatusWaitcheckValue)"  flex="dir:top main:center cross:center">
               
               <div style="position: relative;">
                  <!-- <img src="~assets/img/send.png"> -->
                  <i class="iconfont zyx-needsend"></i>
                  <div v-show="user.order_pay>0" class="tips">{{user.order_pay}}</div>
                </div>
               
               <span>待发货</span>
               
               </li>
             <li @click="gotoOrders(global.orderStatusSendValue)"  flex="dir:top main:center cross:center">
               <div style="position: relative;">
                  <!-- <img src="~assets/img/recieve.png"> -->
                  <i class="iconfont zyx-send"></i>
                  <div v-show="user.order_send>0" class="tips">{{user.order_send}}</div>
                </div>
             <span>待收货</span>
             </li>
             <li @click="gotoOrders(global.orderStatusRefundValue)"  flex="dir:top main:center cross:center">
                <div style="position: relative;">
                  <!-- <img src="~assets/img/reback.png"> -->
                  <i class="iconfont zyx-refund"></i>
                  <div v-show="user.order_refund>0" class="tips">{{user.order_refund}}</div>
                </div>
               <span>退款中</span>
               </li>
           </ul>

            <div class="rowitem" flex="dir:left main:justify cross:center" style="width：100%;height:30px;">
            <span>我的购物车</span>
            <div @click="gotoCart()"  flex="dir:left main:left cross:center">
                <span class="Cartnum">{{user.shop_cart.length}}</span>
                <i class="iconfont zyx-arrow-right"></i>
            </div>
          </div>

        <div class="functionbox" flex="dir:left main:left cross:center" style="width:100%;">
            <div class="functionitem" flex="dir:top main:center cross:center" @click="gotoMyset()">
            
            <i class="iconfont zyx-head" style="color:red;"></i>
            <span>个人资料</span>
            </div>
          <div class="functionitem" flex="dir:top main:center cross:center" @click="gotoAddress()">
            <i class="iconfont zyx-address" style="color:green;"></i>
            <span>收货地址</span>
          </div>
          <a class="functionitem" flex="dir:top main:center cross:center" href="http://img.bqmarket.com/selldemo20180626.csv" >
            
            <i class="iconfont zyx-moban" style="color:green;"></i>
            <span>模板下载</span>
          </a>
          <el-upload   flex="dir:top main:center cross:center"
            style="width:25%;"
            :action="getUploadUrl('ShopOrder/orderuploade')"
            :show-file-list="false" 
            name="upfile" 
            :data="orderform"
            :on-success="handleOrderSuccess">
              <button  flex="dir:top main:center cross:center" class="functionitem" style="width:100%;background-color:white; border-width:0px;">
                <i class="iconfont zyx-import" style="color:green;"></i>
                  <span>导入订单</span>
              </button>
          </el-upload>
        </div>
       </div>
  </div>
</template>

<script>

// 框架
import mymix from 'src/mixin'
import model from 'src/model'
import global from 'src/global'
import ElUpload from 'common/components/upload'
import Vue from 'vue'
Vue.component(ElUpload.name, ElUpload);
export default{
  mixins: [mymix],
  data() {
    return {
      global,
      orderform: {}

    }
  },
  watch: {

  },

  methods: {
    handleOrderSuccess(data, file) {
      console.log('resp', data, file)
      if (data.code === 1) {
        this.$toast('导入成功')
      } else {
        this.$toast(data.message)
      }
    },
    gotoMyset() {
      this.$router.push({ path: '/userset' });
    },
    gotoAddress() {
      this.$router.push({ path: '/addresslist' });
    },
    gotoCart() {
      this.$router.push({ path: '/home/shopcart' });
    },
    gotoOrders(status) {
      if (status) {
        this.$router.push({ path: '/orders/' + status });
      } else {
        this.$router.push({ path: '/orders/-1' });
      }
    }

  },
  created() {
    if (model.user.name === '') {
      model.user.getinfo(null, { order: 'true', update: 'true' })
    } else {
      model.user.getinfo(null, { order: 'true' })
    }
  }
}
</script>

<style scoped>
.headbox{
  background-color: rgb(257,78,0);
  width: 100%;
  position: relative;
  height: 100px;
}

.headpic{
  background: #FFFFFF;
    border: 2px solid #FFFFFF;
    
    height: 60px;
    border-radius: 50%;
    width: 60px;
}

.headtext{
    text-align: center;
    line-height: 20px;
    color: white;
    font-size: 15px;
}

.rightpos{
  position: absolute;
  top: 20px;
  right: 10px;
  cursor: pointer;
}

.rowitem{
  line-height: 30px;
  font-size: 13px;
  color: black;
  text-align: center;
  border-bottom: 1px solid #0000002e;
}

.orderbtn{
  width:100%;
  height:60px;
   border-bottom: 1px solid #0000002e;
}
.orderbtn li{
  width:25%;
  height: 100%;
  padding: 5px;
  cursor: pointer;
  
}
.orderbtn li i{
  font-size: 25px;
}
.orderbtn li span{
  padding: 5px 0;
}

.Cartnum{
    width: 16px;
    height: 16px;
    background: #1b1919ad;
    border: 1px solid #1b1919ad;
    border-radius: 50%;
    font-size: 12px;
    line-height: 16px;
    text-align: center;
    color: #fff;
}

.functionbox{
  width:100%;
  padding: 5px;
  flex-wrap:wrap;
}

.functionitem{
  width:25%;
  cursor: pointer;
  height: 50px;
}

.functionitem i{
  font-size:25px;
}
.functionitem span{
  padding: 5px 0;
}
</style>
