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
            <div flex-box="1" flex="dir:top main:left cross:left">
                <div flex-box="1">{{selectaddress.name+'  '+selectaddress.phone}}</div>
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
            <i style="text-align:right;" flex-box="1" class="iconfont zyx-arrow-right"></i>
        </div>
    </template>

    <!-- 商品信息 -->
    <template v-if="payList.length===0">
      <div flex-box="1" flex="dir:top main:center cross:center">
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
                <div class="iteminfo" flex-box="1" flex="dir:top main:left cross:left">
                    <div flex-box="1">{{item.name}}</div>
                    <div >单价:<span style="color:red;">￥{{item.price}}</span></div>
                    <div flex="dir:top main:left cross:left">
                      <div >总价:<span style="color:red;">￥{{getPriceValue(item.price)*item.num+getfrightmoney(item)}}</span>
                      <span v-if="getfrightmoney(item)>0">(含运费{{getfrightmoney(item)}}元)</span>
                      </div>
                      <div flex="dir:left main:left cross:center">
                          <div class="buttnadd" @click="item.num=delnum(item.num,item)">-</div>
                              <input  class="numinput" type="number"  v-model.number="item.num" v-on:change="input_numchange(arguments[0],item)">
                          <div class="buttnadd" @click="item.num=addnum(item.num,item)">+</div>
                      </div>
                  </div>
                </div>
            </div> 
        </li>
    </ul>
     <!-- 输入信息 -->
     

      <pic-upload :picform='{side:"front"}' urlpath="uploadidnum" title="身份证正面(有身份证号那一面)：" :path="user.idpic1"  v-on:success="processIdnum"></pic-upload>
      <pic-upload :picform='{side:"back"}'  urlpath="uploadidnum" title="身份证反面(有国徽那一面)：" :path="user.idpic2" v-on:update="user.idpic2=arguments[0]" ></pic-upload>

       <div class="textrow" flex="dir:left main:left cross:center">
          <span  class="input-title">身份证号：</span>
          <div  flex-box="1" class="inputbox">
              <input  class="inputvalue" placeholder="身份证上传后，身份证号自动识别" type="text" v-model="user.idnum">
          </div>
      </div>
     
     <div class="textrow" flex="dir:left main:left cross:center">
          <span  class="input-title">发件人姓名:</span>
          <div  flex-box="1" class="inputbox">
              <input class="inputvalue"  placeholder="发件人姓名" type="text" v-model="user.send_user_name">
          </div>
      </div>
      <div class="textrow" flex="dir:left main:left cross:center">
          <span  class="input-title">发件人手机号:</span>
          <div  flex-box="1" class="inputbox">
              <input class="inputvalue" placeholder="请填写发件人手机号" type="text" v-model="user.send_user_phone">
          </div>
      </div>

      <div style="height:auto;" v-if="showService()" class="textrow" flex="dir:top main:left cross:left">
        <div style="font-weight: bold;    line-height: 30px;">选择特殊服务</div>
        <ul>
          <li  flex="dir:left main:left cross:center" :key="checkitem.id" v-for="checkitem in global.sellVIPType" @click="checkvipvalue=checkitem.id">  
            <i style="font-size: 25px;color: red;" v-show="checkitem.id!=checkvipvalue" class="iconfont zyx-checkno"></i>
            <i style="font-size: 25px;color: red;"  v-show="checkitem.id==checkvipvalue" class="iconfont zyx-check"></i>
            <div>{{checkitem.title}}<span v-if="checkitem.tip" style="color: red;">({{checkitem.tip}})</span></div>
          </li>
        </ul>
      </div>
       <textarea class="textrow" style="height:80px;" placeholder="选填：订单备注" rows="4" v-model="marktext"></textarea>
    </template>
  
    </div>
    
    <div v-if="payList.length>0" class="bottombox" flex="dir:right main:left cross:center">
        <div style="margin-left: 10px;   width: 40%;"  class="button-red" flex-box="1"  @click="pay()">提交订单</div>
        <p style="line-height: 20px;" class="flex-wrapbox" flex="dir:left main:right cross:center">共<span style="color:red;" >{{payList.length}}</span>件商品 合计:<span style="color:red;" >￥{{getprice()}}</span></p> 
    </div>
  </div>
</template>

<script>

import mymix from 'src/mixin'
import PicUpload from 'views/common/picupload'
import { post } from 'common/api'
import model from 'src/model'
import global from 'src/global'
import util from 'common/utils'

// 框架
export default{
  name: 'orderpay',
  mixins: [mymix],
  data() {
    return {
      shopcart: model.user.shopcart,
      selectaddress: model.user.selectaddress,
      address: model.user.address,
      checkvipvalue: global.sellTypeNormal,

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
    processIdnum(data) {
      console.log('res', data)
      var name=data.result["姓名"].Words
      if(name!==this.selectaddress.name){
         this.$toast("身份证姓名与收件人姓名不一致")
         return
      }
      this.user.idpic1=data.url
      this.user.idnum=data.result["公民身份号码"].Words
    },
    showService() {
      // console.log('show servcie', this.payList)
      for (let i = 0; i < this.payList.length; i++) {
        if (this.payList[i].no_service) {
          const service = parseInt(this.payList[i].no_service)
          if (service === 1) {
            return false;
          }
        }
      }
      return true
    },
    getfrightmoney(iteminfo) {
      // console.log("iteminfo",iteminfo)
      return model.order.getfrightmoney(iteminfo.num, this.selectaddress.province, iteminfo.supply_source)
    },
    getprice() {
      let totalprice = 0;
      this.user.payList.forEach(element => {
        const service_price = model.order.getservicemoney(element.num, this.checkvipvalue)
        const fright_price = model.order.getfrightmoney(element.num, this.selectaddress.province)
        totalprice += model.order.gettotalprice(element.price, element.num)
        totalprice += service_price
        totalprice += fright_price
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


      const senddata = {
        client_name: this.user.selectaddress.name,
        client_address: this.user.selectaddress.province + this.user.selectaddress.city + this.user.selectaddress.area + this.user.selectaddress.detail,
        client_phone: util.trim(this.user.selectaddress.phone),
        client_provice: this.user.selectaddress.province,
        client_city: this.user.selectaddress.city,
        client_area: this.user.selectaddress.area,
        client_info: this.marktext,
        idnumpic1: this.user.idpic1,
        idnumpic2: this.user.idpic2,
        send_user_name: this.user.send_user_name,
        send_user_phone: this.user.send_user_phone || this.user.selectaddress.phone,
        order_vip_type: this.checkvipvalue,
        item_info: this.payList,
        idnum: util.trimspace(this.user.idnum)
      }

      if (this.checkPhone(senddata.client_phone) == false) {
        this.$toast('收件人电话号不正确')
        return
      }

      {
        post('ShopOrder', 'add', senddata)
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
        margin-left: 10px;
    /* border: 0; */
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

.itempic{
  max-height: 100px;
}
@import"~views/item/item.css"
</style>
