<template>
  <div style="heigt:100%;">
      <!-- 轮播 -->
      <mt-swipe :auto="4000" style="height:250px;">
        <mt-swipe-item  :key="item.name" v-for="item in swipelist"><img style="max-height:250px;"  :src="item.pic"></mt-swipe-item>
      </mt-swipe>
      <!-- 搜索 -->
      <mt-search v-model="app.search.name" v-on:searchok="gotoSearch"></mt-search>
      <!-- 公告 -->
      
      <div style="overflow: hidden;line-height: 30px;width=100%;border-bottom: 1px solid #eee;border-top: 1px solid #eee;height:30px;">
        <div  style="float:left;">
          <!-- <img src="~assets/img/notice.png" style="max-height:30px;"> -->
          <i class="iconfont zyx-notice" style="padding: 0 10px;color: red;font-size: 20px;"></i>
        </div>
        <mt-swipe :showIndicators="false" :auto="6000" style="height:30px;">
          <mt-swipe-item  :key="item.id" v-for="item in notice"><span v-html="item.content"></span></mt-swipe-item>
        </mt-swipe>
      </div>
      <!-- 商品 -->
      <div class="goodsbox clearfix" >
         <div class="goodsitems" v-for="adsitem in homeads" :key="adsitem.id">
           <template v-if="adsitem.adspos.title_pic||''!==''">
              <img :src="adsitem.adspos.title_pic">
           </template>
           <template v-else>
             <h4>{{adsitem.adspos.title}}</h4>
           </template>
           <ul class="clearfix">
             <li :key="gooditem.id" v-for="gooditem in adsitem.ads" @click="gotoItem(gooditem.item_id)">
               <img v-if="gooditem.pic||''!==''" v-lazy="gooditem.pic">
               <img v-else v-lazy="gooditem.iteminfo.icon">
               <span class="price">{{"¥"+gooditem.iteminfo.price}}</span>
               <span class="name">{{gooditem.iteminfo.name}}</span>
             </li>
           </ul>
         </div>
      </div>
  </div>
  
</template>

<script>
 import models from 'src/model/index.js'
 import mymix from 'src/mixin'
// 框架
export default{
   mixins: [mymix],
   data() {
     return {
       swipelist: models.app.homeSwipeList,
       homeads: models.app.homeads,
       notice: models.app.notice

     }
   },
   watch: {
   },
   components: {
   },

   methods: {
     gotoItem(itemid) {
       console.log('push item', itemid)
       this.$router.push({ path: '/item/' + itemid });
     }
   },
   created() {
   }


}
</script>

<style scoped>
.goodsbox{
      background-color: #f6f6f6;
}

.goodsbox .goodsitems h4{
    padding: 0 10px;
    line-height: 36px;
    font-size: 14px;
    background-color: #fff;
}

.goodsbox .goodsitems h4::before{
  content: "";
    display: inline-block;
    margin-right: 6px;
    width: 4px;
    height: 12px;
    background-color: #e8380d;
}


.goodsbox .goodsitems ul{
  border-top: 1px solid #ddd;
    border-bottom: 1px solid #ddd;
}

.goodsbox .goodsitems ul li{
    position: relative;
    float: left;
    padding: 6px 0;
    display: -ms-flexbox;
    display: flex;
    -ms-flex-direction: column;
    flex-direction: column;
    width: 50%;
}

.goodsbox .goodsitems ul li:not(:last-child){
  border-right: 1px solid #ddd;
}

.goodsbox .goodsitems ul li img{
    margin: 10px 0;
    width: 100%;
    height: auto;
}

.goodsbox .goodsitems ul li .price{
    padding-left: 10px;
    font-size: 14px;
    color: #e8380d;
}

.goodsbox .goodsitems ul li .name{
    padding-left: 10px;
}


</style>
