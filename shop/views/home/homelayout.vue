<template>
    <div flex="dir:top main:left cross:left" style="height:100%;">
        <div class="flexbox1 content-box-bottom">
            <router-view ></router-view>
        </div>
        <ul class="bottombar" flex="dir:left main:justify cross:center">
          <li @click="goto('/home/index')" flex="dir:top main:left cross:center">
              <img slot="icon" v-show="selectpath==='/home/index'" src="~assets/img/home_check.png">
              <img slot="icon" v-show="selectpath!=='/home/index'" :src='"~assets/img/home_uncheck.png"'> 
              <span>首页</span>
          </li>
          <li @click="goto('/home/itemtype')" flex="dir:top main:left cross:center">
              <img slot="icon" v-show="selectpath==='/home/itemtype'"  :src='"~assets/img/itemtype_check.png"'>
              <img slot="icon"  v-show="selectpath!=='/home/itemtype'" :src='"~assets/img/itemtype_uncheck.png"'>
             <span>分类</span>
          </li>
          <li @click="goto('/home/shopcart')"  flex="dir:top main:left cross:center">
              <div  style="position:relative;">
                <img slot="icon" v-show="selectpath==='/home/shopcart'" :src='"~assets/img/cart_check.png"'>
                <img slot="icon"  v-show="selectpath!=='/home/shopcart'" :src='"~assets/img/cart_uncheck.png"'>
                <div v-show="cartnum>0" class="tips">{{cartnum}}</div>
              </div>
               <span>购物车</span>
          </li>
          <li @click="goto('/home/user')" flex="dir:top main:left cross:center">
              <img slot="icon" v-show="selectpath==='/home/user'" :src='"~assets/img/user_check.png"'>
              <img slot="icon"  v-show="selectpath!=='/home/user'" :src='"~assets/img/user_uncheck.png"'>
              <span>我的</span>
          </li>
      </ul>
    </div>

</template>

<script>
import mymix from 'src/mixin'
import models from 'src/model/index.js'
import config from 'src/config.js'

// 框架
export default{
  mixins: [mymix],
  data() {
    return {
      cartnum: 0,
      cartlist: models.user.shop_cart,
      selectpath: '',
      config
    }
  },
  watch: {
    '$route'() {
      this.initdata();
    },
    cartlist() {
      this.cartnum = this.cartlist.length;
    },
    selectpath() {
      this.$router.push({ path: this.selectpath });
    }
  },

  methods: {
    goto(path) {
      this.selectpath = path;
      this.$router.push(path)
    },
    initdata() {
      console.log('route', this.$route);
      const rootpath = this.$route.matched[0].path
      if (rootpath === '/home') {
        this.selectpath = this.$route.matched[1].path;
      }
    }
  },
  created() {
    this.initdata();
  }


}
</script>

<style scoped>

.bottombar{
    right: 0;
    bottom: 0;
    left: 0;
    position: fixed;
    z-index: 1;
    height: 55px;
    background-color: #eaeaea;
    color: #26a2ff;
}

.bottombar li{
  width:25%;
  color: #333;
  font-size: 12px;
  padding: 2px 0 0;


}

.bottombar li span{
  padding: 4px 0;
    line-height: 15px;
}

.bottombar li img{
  width:25px;

}
</style>


