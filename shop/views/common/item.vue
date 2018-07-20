<template>
    <div>
         <div class="header-box" flex="dir:left main:left cross:center">
                <div @click="goback()" slot="left" style=" color: #fff;">
                    <i class="mintui mintui-back"></i>
                    <span>返回</span>
                </div>
                <div class="header-title flexbox1">商品详情</div>
            </div>
        <!-- 标题 -->
        <div class="content-box-bottom content-box-top">
            <!-- 图片 -->
            <mt-swipe :auto="4000" style="height:250px;">
                    <mt-swipe-item  :key="index" v-for="(pic,index) in iteminfo.pics"><img :src="pic"></mt-swipe-item>
            </mt-swipe>
            <div class="info">
                <h1 class="price">{{"￥"+iteminfo.price}}</h1>
                <h1 class="name">{{iteminfo.name}}</h1>
            </div>
            <div style="box-shadow: 0 3px 3px rgba(0, 0, 0, .03);background: #fff;">
                <hr style="border: 1px solid #F0F0F0;">
                <div class="sellinfo">
                    <span>销量：{{iteminfo.sell_num}}笔</span>
                </div>
            </div>
            <div class="detailtitle">商品详情</div>
            <hr class="with-margin-l">
            <div v-html="iteminfo.desc" class="detailinfo"></div>
        </div>
        
        <div class="bottombox" flex="dir:left main:left cross:center">
            <div @click="gotoCart()" style="line-height: 15px;font-size: 14px;" >
                <div style="position:relative;margin: 0 10px;">
                    <img  :src='"~assets/img/cart_check.png"'>
                    <div v-show="user.shop_cart.length>0" class="tips">{{user.shop_cart.length}}</div>
                </div>
                <!-- <span style="font-size:14px;">购物车</span> -->
            </div>
            <div class="btnitem-card flexbox1" @click="addtoCart()">加入购物车</div>
            <div class="btnitem-buy flexbox1" @click="buy()">立即购买</div>
        </div>

        <add-cart v-on:close="showAddCartPanel=false" :onlyaddCart="onlyaddCart" :iteminfo="iteminfo" v-if="showAddCartPanel"></add-cart>
    </div>
</template>

<script>
import { all } from 'common/api'
import AddCart from './addcart'
import shopitemModel from 'admin/model/shop_item'
import mymix from 'src/mixin'
export default{
  mixins: [mymix],
  data() {
    return {
      iteminfo: {},
      showAddCartPanel: false,
      onlyaddCart: false

    }
  },
  watch: {
  },
  components: {
    AddCart
  },

  methods: {
    gotoCart() {
      console.log('go to cart')
      this.$router.push({ path: '/home/shopcart' });
    },
      // 加购物车
    addtoCart() {
      this.onlyaddCart = true
      this.showAddCartPanel = true
    },
      // 购买
    buy() {
      this.onlyaddCart = false
      this.showAddCartPanel = true
    }
  },
  created() {
    const params = this.$route.params
    shopitemModel.fieldList.forEach(item => {
      this.$set(this.iteminfo, item.name, undefined)
    })
    all('ShopItem', null, null, null, { 'item.id': params.id })
    .then(response => {
      const info = response.list[0]
      shopitemModel.initData(info)
      this.iteminfo = info
      this.$forceUpdate();
    })
    .catch(err => {
      console.log('err', err);
    })
  }


}
</script>

<style scoped>
.info{
    padding: 10px;

}

.info .price{
    color: #F44;
    font-size: 20px;
    display: inline-block;
    font-weight: normal;

}

.info .name{
    color: #333333;
    padding: 0 10px;
    font-weight: normal;
}

.sellinfo{
    color: #999;
    padding: 0 10px;
    font-size: 14px;
    height: 40px;
    line-height: 40px;
}

.detailtitle{
    background: #FFF;
    font-weight: 400;
    height: 34px;
    line-height: 34px;
    position: relative;
    padding: 6px 0 0 12px;
    font-size: 14px;
    color: #666;
}

.with-margin-l {
    margin-left: 10px;
    margin-right: 10px;
    border: 0;
    border-top: 1px solid #F0F0F0;
}

.detailinfo{
    position: relative;
    overflow: hidden;
    padding: 10px;
    background: #fff;
}

.bottombox{
        background-color: #fdfdfd;
    position: fixed;
    bottom: 0;
    left: 0;
    right: 0;
    width: 100%;
    height: 50px;
    line-height: 50px;
    font-size: 14px;
    text-align: center;
    color: #fff;
    box-shadow: 0 -1px 10px 1px #ddd;
}

.btnitem-card{
    /* float: left; */
    /* width: 40%; */
    background-color: #1296db;
}

.btnitem-buy{
   /* float: right; */
    /* width: 40%; */
    background-color: #e8380d;
}


.detailinfo{
    width:100%;
}


    
</style>
