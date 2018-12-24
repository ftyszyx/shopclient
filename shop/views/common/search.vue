<template>
<div>
    <mt-header fixed title="搜索">
      <div @click="goback()" slot="left">
        <i class="mintui mintui-back"></i>
        <span>返回</span>
      </div>
    </mt-header>
     <mt-search class="searchbox" v-model="app.search.name" v-on:searchok="seachClick">
     </mt-search>
    <div class="filter" flex="dir:left main:left cross:center">
        <div class="filter-item" :key="orderitem.name" v-for="(orderitem,index) in fieldList" flex="dir:left main:center cross:center" @click="sort(index)">
          <div>{{orderitem.title}}</div>
          <span v-show="orderitem.sort!=undefined" class="sortitem" flex="dir:top main:justify cross:center" >
            <i  class="sort-caret ascending" :class="{'sort-active':orderitem.sort===1}"></i>
            <i  class="sort-caret descending" :class="{'sort-active':orderitem.sort===2}"></i>
          </span>
        </div>
        <div class="filter-item" @click="selecttype()" flex="dir:left main:center cross:center">
          <div>筛选</div>
          <img style="width: 20px;" src="~assets/img/filter.png">
          </div>
    </div>
    <ul class="content"  
      v-infinite-scroll="loadMore"
      :infinite-scroll-disabled="Noloadingmore"
      :infinite-scroll-distance="pagesize">
        <template v-if="itemlist.length===0">
          <div flex="dir:top main:center cross:center" style="width:100%;height:100%;" >
            <img src="~assets/img/wap_nodata.png">
            <p>没有找到你搜索的商品</p>
          </div>
        </template>
        <template v-else>
          <item :iteminfo="item" :key="item.id" v-for="item in itemlist" v-on:addcart="addcart" ></item>
        </template>
      </ul>

     <add-cart v-on:close="showAddCartPanel=false" :onlyaddCart="onlyaddCart" :iteminfo="iteminfo" v-if="showAddCartPanel"></add-cart>
</div>
</template>

<script>
import mymix from 'src/mixin'
import ItemTypeFilter from 'views/itemtype/itemtypefilter'
import models from 'src/model'
import AddCart from './addcart'
import util from 'common/utils'
import Item from 'views/item/item'
import { all } from 'common/api'
// 框架
export default{
  name: 'commonsearch',
  mixins: [mymix],
  data() {
    return {
      pagesize: 10, // 每页的数量
      page: 1,
      showAddCartPanel: false,
      fieldList: [
          { name: 'order_id', title: '综合', sort: 1 },
          { name: 'sell_num', title: '销量', sort: 0 },
          { name: 'price', title: '价格', sort: 0 }
      ],
      onlyaddCart: true,
      iteminfo: {},
      Noloadingmore: false,
      getdataRun: false,
      totalsize: 0,
      itemlist: []
    }
  },
  watch: {

  },
  components: {
    ItemTypeFilter,
    AddCart,
    Item
  },

  methods: {
    seachClick() {
      this.reset()
      this.app.search = { name: this.app.search.name }
      this.reset();
      this.getData();
    },
    selecttype() {
      this.$router.push({ path: '/home/itemtype' });
    },
    addcart(item) {
      this.iteminfo = item
      this.showAddCartPanel = true;
    },
    loadMore() {
      console.log('load more', this.Noloadingmore)
      if (this.Noloadingmore) {
        return
      }
      this.getData();
    },
    reset() {
      this.itemlist.splice(0)
      this.page = 1;
    },
    sort(index) {
      util.ChangeOrder(this.fieldList, index)
      this.reset()
      this.getData();
    },
    getData() {
      console.log('getdata', models.app);
      if (this.getdataRun) {
        return;
      }
      this.Noloadingmore = true
      this.getdataRun = true
      const order = util.getOrder(this.fieldList);
      const search = {};
      const appsearch = models.app.search
      if (appsearch.name) {
        search['item.name'] = ['like', '%' + appsearch.name + '%']
      }

      if (appsearch.item_type) {
        search['item.item_type'] = appsearch.item_type
      }
      search['item.is_onsale'] = 1
      search['item.store_num'] = ['>', 0]
      all('ShopItem', this.page, this.pagesize, order, search).then(
      data => {
        if (data.list) {
          data.list.forEach(element => {
            models.item.initData(element)
            this.itemlist.push(element)
          });
        }

        this.totalsize = data.num;
        this.getdataRun = false
        this.Noloadingmore = this.totalsize <= this.itemlist.length
        this.page++;
      }
      ).catch(error => {
        console.log('error', error);
        this.getdataRun = false
        this.Noloadingmore = this.totalsize <= this.itemlist.length
      });
    }
  },
  created() {
    this.reset();
    this.getData();
  }
}
</script>

<style scoped>
.searchbox{
  position: fixed;
  top: 40px;
  left: 0;
  right: 0;
    z-index: 2;
}

.filter{
  position: fixed;
  top:84px;
  left: 0;
  right: 0;
  line-height: 30px;
  z-index: 2;
  background-color: #f5f7fa;
  height: 30px;
  border-bottom: 1px solid #80808040;
}

.filter-item{
  cursor: pointer;
  text-align: center;
  width:25%;
  border-right: 1px solid #80808040;
}

.content{
  margin-top:114px;
  background-color: rbg(247,247,247);
  padding-top:10px;
}


</style>
