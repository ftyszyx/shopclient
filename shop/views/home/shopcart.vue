<template>
<div>
   <div class="header-box" flex="dir:left main:left cross:center">
         <div @click="goback()" slot="left" style=" color: #fff;">
            <i class="mintui mintui-back"></i>
            <span>返回</span>
          </div>
          <div flex-box="1" class="header-title ">购物车</div>
          <div v-show="editmode==false"  @click="editmode=true">编辑</div>
          <div v-show="editmode" @click="editmode=false">完成</div>
     </div>
     <div flex-box="1" class= "content-box-top emptybox " v-if="shop_cart.length===0" flex="dir:top main:center cross:center">
       <img src="~assets/img/cart-empty.png">
       <div style="font-size: 15px;color: #d4d4d4;">你的购物车是空的</div>
       <router-link to="/" slot="left" class="button-orange">去逛逛</router-link>
     </div>
     <ul v-if="shop_cart.length>0" flex-box="1" class="content-box-top " flex="dir:top main:left cross:left">
        <li class="bootom-split" style="width:100%;height:60px;" flex="dir:left main:left cross:center" :key="'good'+index" v-for="(item,index) in shop_cart" @click="gotoitem(item.itemid)" >
          
          <div @click.stop="checkitem(item)" style="padding:5px;">
            <i style="font-size: 25px;color: red;" v-show="!item.check" class="iconfont zyx-checkno"></i>
            <i style="font-size: 25px;color: red;"  v-show="item.check" class="iconfont zyx-check"></i>
          </div>
          
          <img :src="item.pic+suffix" style="max-width:40px;">
          <div flex-box="1" class="info " flex="dir:top main:left cross:left">
            <div>{{item.name}}</div>
            <div v-if="item.specname!==''">规格:{{item.specname}}</div>
          </div>
           <div flex="dir:top main:left cross:left">
              <div style="color:red;">￥{{getPriceValue(item.price)*item.num}}</div>
              <div flex="dir:left main:left cross:center">
                  <div class="buttnadd" @click.stop="item.num=delnum(item.num,item);getTotalPrice()">-</div>
                    <input @click.stop class="numinput" type="number"  v-model.number="item.num" v-on:change="input_numchange(arguments[0],item);getTotalPrice()">
                  <div class="buttnadd" @click.stop="item.num=addnum(item.num,item);getTotalPrice()">+</div>
              </div>
           </div>
        </li>
     </ul>
     <div  v-if="shop_cart.length>0"  class="bottom" flex="dir:left main:justify cross:center">
      
          <div @click="checkall=!checkall" style="padding:5px;">
            <i style="font-size: 25px;color: red;" v-show="!checkall" class="iconfont zyx-checkno"></i>
            <i style="font-size: 25px;color: red;"  v-show="checkall" class="iconfont zyx-check"></i>
            全选
          </div>
        <div flex-box="1" class=" bottom-text" v-show="editmode===false">合计<span style="color:red;">￥{{totalprice}}</span></div>
        <div class="bottom-button" v-show="editmode===false" @click="pay()"> 结算</div>
        <div  class="bottom-button" v-show="editmode" @click="del()"> 删除所选</div>
     </div>
     
</div>
</template>

<script>
import models from 'src/model/index.js'
import { post } from 'common/api'
import mymix from 'src/mixin'
// 框架
export default{
  name: 'shopcart',
  mixins: [mymix],
  data() {
    return {
      editmode: false,
      checkall: true,
      totalprice: 0,
      shop_cart: models.user.shop_cart
    }
  },
  watch: {
    editmode() {
      this.checkall = false
      this.checkallFun();
    },
    shop_cart() {
      this.getTotalPrice()
    },
    checkall() {
      this.checkallFun()
      this.getTotalPrice();
    }
  },

  methods: {
    gotoitem(itemid) {
      this.$router.push({ path: '/item/' + itemid });
    },
    checkitem(item) {
      item.check = !item.check
      this.getTotalPrice();
    },
    checkallClick() {
      this.checkall = !this.checkall;
      this.checkallFun()
    },
    checkallFun() {
      this.shop_cart.forEach(item => {
        item.check = this.checkall
      });
    },
    getTotalPrice() {
      this.totalprice = 0;
      this.shop_cart.forEach(item => {
        if (item.check) {
          this.totalprice += item.price * item.num
        }
      });
    },
    del() {
      const new_cart = []
      this.shop_cart.forEach(item => {
        if (item.check === false) {
          // this.shop_cart.splice(index, 1)
          new_cart.push(item)
        }
      });
      post('user', 'UpdateCart', { shop_cart: JSON.stringify(new_cart) })
      .then(() => {
        this.$toast('删除成功')
        models.user.getinfo()
      }).catch(err => {
        console.log('err', err)
      })
    },
    pay() {
      this.user.payList.splice(0)
      this.user.shop_cart.forEach(item => {
        if (item.check) {
          const payitem = {}
          Object.assign(payitem, item)
          this.user.payList.push(payitem)
        }
      })
      if (this.user.payList.length === 0) {
        this.$toast('请选择要结算商品');
        return;
      }
      this.$router.push({ path: '/payorder' });
    }
  },
  created() {
    this.getTotalPrice();
    models.user.checkLogin()
  }
}
</script>

<style scoped>
.checkbox{
  cursor: pointer;
  width: 20px;
  height: 20px;
}

.bottom{
  position: fixed;
  bottom: 55px;
  width: 100%;
  height: 50px;
  background-color: #fff;
  border-top: 1px solid #ddd;
}
.info{
  padding: 5px;
  height:100%;
}

.bottom-text{
      height: 50px;
    text-align: center;
    line-height: 50px;
    font-size: 15px;
}

.bottom-button{
    width: 40%;
    border: 0;
    margin: 0;
    cursor: pointer;
    height: 50px;
    line-height: 50px;
    font-size: 14px;
    text-align: center;
    color: #fff;
    background-color: #e8380d;
}
</style>
