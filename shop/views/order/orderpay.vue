<template>
  <div>
     <mt-header fixed title="订单结算">
      <div @click="goback()" slot="left">
        <i class="mintui mintui-back"></i>
        <span>返回</span>
      </div>
    </mt-header>
  <div class="content content-box-top">
    <!-- 地址 -->
    <template v-if="selectaddress.name">
        <div class="firstitem" @click="slectaddr()" style="padding:5px 5px;background-color: white;margin-bottom: 10px;"   flex="dir:left main:left cross:center">
            <i style="padding:5px;" class="iconfont zyx-address"></i>
            <div class="flexbox1" flex="dir:top main:left cross:left">
                <div class="flexbox1">{{selectaddress.name+'  '+selectaddress.phone}}</div>
                <div class="addressinfo">{{selectaddress.province+'  '+selectaddress.city+'  '+selectaddress.area +' '+selectaddress.detail}}</div>
                <div class="backtop"></div>
            </div>
            <i style="text-align:right;" class="iconfont zyx-arrow-right"></i>
            
        </div>
    </template>
    <template v-else>
        <div class="firstitem" @click="addaddr()" style="border-bottom: 1px solid #e2e2e2;padding:5px 5px;background-color: white;margin-bottom: 10px;"   flex="dir:left main:left cross:center">
            <i style="padding:5px;"  class="iconfont zyx-add1"></i>
            <div>新增收货地址</div>
            <i style="text-align:right;"  class="flexbox1 iconfont zyx-arrow-right"></i>
        </div>
    </template>

    <!-- 商品信息 -->
    <template v-if="payList.length===0">
      <div class= "  flexbox1" flex="dir:top main:center cross:center">
       <img src="~assets/img/cart-empty.png">
       <div style="font-size: 15px;color: #d4d4d4;">你的购物车是空的</div>
       <router-link to="/" slot="left" class="button-orange">去逛逛</router-link>
     </div>
    
    </template>
    <template v-else>
      <ul>
        <li :key="index" v-for="(item,index) in payList">
             <div class="itembox" flex="dir:left main:left cross:center">
                <img class="itempic" v-if="item.pic" :src="item.pic">
                <img class="itempic" v-else src="~common/img/upload-common-select.png">
                <div class="iteminfo flexbox1" flex="dir:top main:left cross:left">
                    <div class="flexbox1">{{item.name}}</div>
                    <div >单价:<span>￥{{item.price}}</span></div>
                </div>
                 <div flex="dir:top main:left cross:left">
                <div style="color:red;"><span>￥{{item.price*item.num}}</span></div>
                  <div flex="dir:left main:left cross:center">
                      <div class="buttnadd" @click="item.num=item.num-1">-</div>
                          <input  class="numinput" type="number"  v-model.number="item.num">
                      <div class="buttnadd" @click="item.num=item.num+1">+</div>
                  </div>
              </div>
            </div> 
        </li>
    </ul>
     <!-- 输入信息 -->
      <div class="textrow" flex="dir:left main:left cross:center">
          <span  class="input-title">身份证号：</span>
          <div  class="flexbox1  inputbox">
              <input class="inputvalue" placeholder="身份证号" type="text" v-model="user.idnum">
          </div>
      </div>

      <pic-upload title="身份证正面：" :path="user.idpic1" v-on:update="user.idpic1=arguments[0]"></pic-upload>
      <pic-upload title="身份证反面：" :path="user.idpic2" v-on:update="user.idpic2=arguments[0]"></pic-upload>
     
      <div style="height:auto;" class="textrow" flex="dir:top main:left cross:left">
        <div style="font-weight: bold;    line-height: 30px;">选择特殊服务</div>
        <ul>
          <li  flex="dir:left main:left cross:center" :key="checkitem.id" v-for="checkitem in viptypelist" @click="checkvipvalue=checkitem.id">  
            <i style="font-size: 25px;color: red;" v-show="checkitem.id!=checkvipvalue" class="iconfont zyx-checkno"></i>
            <i style="font-size: 25px;color: red;"  v-show="checkitem.id==checkvipvalue" class="iconfont zyx-check"></i>
            <div>{{checkitem.title}}</div>
          </li>
        </ul>
      </div>
       <textarea class="textrow" style="height:80px;" placeholder="选填：订单备注" rows="4" v-model="marktext"></textarea>
    </template>
  
    </div>
    
    <div v-if="payList.length>0" class="bottombox" flex="dir:right main:right cross:center">
        <div style="margin-left: 10px;" class="button-red flexbox1" @click="pay()">提交订单</div>
        <div>共<span style="color:red;" >{{payList.length}}</span>件商品 合计:<span style="color:red;" >￥{{getprice()}}</span></div> 
      </div>
  </div>
</template>

<script>

import mymix from 'src/mixin'
import PicUpload from 'views/common/picupload'
import { post } from 'common/api'
import model from 'src/model'
import global from 'src/global'
// 框架
export default{
  mixins: [mymix],
  data() {
    return {
      shopcart: model.user.shopcart,
      selectaddress: model.user.selectaddress,
      address: model.user.address,
      checkvipvalue: global.sellVIPTypeNormal,
      viptypelist: global.sellVIPType,
      payList: model.user.payList,


      marktext: ''
    }
  },
  watch: {
    payList() {
      console.log('update paylist')
    },
    address() {
      console.log('address update')
      this.$forceUpdate()
    },
    selectaddress() {
      console.log('select address update')
      // this.$forceUpdate()
    }
  },
  components: {
    PicUpload
  },


  methods: {
    getprice() {
      let totalprice = 0;
      this.user.payList.forEach(element => {
        totalprice += element.price * element.num
      });
      return totalprice
    },
    addaddr() {
      this.$router.push({ path: '/addressedit/-1' });
    },
    slectaddr() {
      this.$router.push({ path: '/addressselect' });
    },
    pay() {
      if (!this.user.selectaddress.name) {
        this.$toast('请先添加收货地址')
        return;
      }
      post('ShopOrder', 'add', {
        client_name: this.user.selectaddress.name,
        client_address: this.user.selectaddress.detail,
        client_phone: this.user.selectaddress.phone,
        client_provice: this.user.selectaddress.province,
        client_city: this.user.selectaddress.city,
        client_area: this.user.selectaddress.area,
        client_info: this.marktext,
        idnumpic1: this.user.idpic1,
        idnumpic2: this.user.idpic2,
        order_vip_type: this.checkvipvalue,
        item_info: this.payList,
        idnum: this.user.idnum
      })
      .then(res => {
        console.log(res);
        this.$toast('订单提交成功')
        // 清除购物车
        console.log('this.user.shopcart', this.user.shop_cart)
        this.payList.forEach(payitem => {
          this.user.shop_cart.forEach((cartitem, index) => {
            if (cartitem.itemid === payitem.itemid && cartitem.specname === payitem.specname && cartitem.code === payitem.code) {
              this.user.shop_cart.splice(index, 1)
            }
          })
        });
        post('user', 'UpdateCart', { shop_cart: JSON.stringify(this.user.shop_cart) })
        .then(() => {
          model.user.getinfo()
        }).catch(err => {
          console.log('err', err)
        })
        this.$router.push({ path: '/orders/' + global.orderStatusWaitPayValue });
      })
      .catch(err => {
        console.log(err)
      })
    }

  },
  created() {
    this.user.checkLogin()
  }
}
</script>

<style scoped>
.firstitem{
  /* line-height: 50px; */
  height: 50px;
  font-size: 14px;
  /* border-bottom: 1px solid #e2e2e2; */
}


  .textrow{
    width:100%;
    height: 30px;
    padding: 10px;
    background: #fff;
    border-bottom: 1px solid #e2e2e2;
}

.backtop{
  background:url(/static/img/border_order_top.png);
  height: 2px;
}
.textrow .input-title{
    width: 20%;
    text-align: left;
    line-height: 30px;
    font-size: 14px;
    white-space: nowrap;
    overflow: hidden;
}

.textrow  .inputvalue{
    line-height: 30px;
    width:100%;
    height: 25px;
    border: 0;
        font-size: 14px;
}

.bottombox{
      background-color: #fdfdfd;
  line-height: 50px;
  height: 50px;
  font-size: 14px;
  text-align: center;
  position: fixed;
  bottom: 0px;
  left:0;
  right:0;
}

.content{
  margin-bottom: 50px;
}

.addressinfo{
  font-size: 14px;
  
}
@import"~views/item/item.css"
</style>
