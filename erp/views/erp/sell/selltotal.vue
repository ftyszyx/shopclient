<template>
 <!-- 已经过审商品列表 -->
 <div class="dialog-mask"  @click="close()" >
            <div class="dialog infobox"  @click.stop style="width:80%;">
                <div class="header">
                    <span class="title">汇总</span>
                    <span class="close" @click="close()">X</span>
                </div>
                <div class="content">
                    <div class="info-box clearfix-after">
                        <div class="info-box-left">
                          <h1  style="font-size:16px;">商品汇总如下:</h1>
                        <table cellspacing="0" cellpadding="0" class="tablebox" border="0" style="width:100%;">
                                <!-- 表头 -->
                                <thead class="table-thead">
                                <tr>
                                  <th>名称</th>
                                  <th>数量</th>
                                  <th>库存数量</th>
                                </tr>
                                </thead>
                                <!-- 表内容 -->
                                <tbody>
                                <tr :key="value.name" v-for="value in totalItemList"  >
                                    <td > {{value.name}} </td>
                                    <td > {{value.num}} </td>
                                    <td > {{value.instore}} </td>
                                </tr>
                                <tr>
                                    <td > 总数量 </td>
                                    <td colspan="2"> {{totalnum}} </td>
                                </tr>
                                </tbody>
                            </table>
                        </div>

                        <div class="info-box-right">
                          <h1  style="font-size:16px;">订单汇总如下:</h1>
                        <table cellspacing="0" cellpadding="0" class="tablebox" border="0" style="width:100%;">
                                <!-- 表头 -->
                                <thead class="table-thead">
                                <tr>
                                  <th>名称</th>
                                  <th>数量</th>
                                  <th>商品数量</th>
                                </tr>
                                </thead>
                                <!-- 表内容 -->
                                <tbody>
                                <tr :key="value.name" v-for="value in orderList"  >
                                    <td > {{value.name}} </td>
                                    <td > {{value.num}} </td>
                                    <td > {{value.num*value.itemnum}} </td>
                                </tr>
                                </tbody>
                            </table>
                        </div>
                        </div>
                </div>
            </div>
 </div>
        
</template>

<script>
import util from 'common/utils'
export default{
  name: 'selltotal',
  data() {
    return {
      totalnum: 0,  // 商品总数
      totalItemList: [],  // 每类商品
      orderList: []// 订单总数
    }
  },
  props: {
    dataList: {
      type: Array,
      default() {
        return [];
      }
    }
  },
  watch: {
    dataList() {
      this.updateTotal();
    }
  },
  methods: {
    close() {
      this.$emit('close');
    },
    updateTotal() {
      console.log('update total');
      this.initList(this.dataList, this.totalItemList, this.orderList)
    },
    initList(dataList, totalItemList, orderList) {
      const itemdic = {};
      const orderdic = {};
      dataList.forEach(element => {
        const itemid = element.item_id;
        const itemname = element.item_name;
        const itemnum = element.num;
        const item_milk_period = element.item_milk_period;
        const item_sort_id = element.item_sort_id;
        const item_type_sort_id = element.item_type_sort_id;

        // 商品汇总
        if (itemdic[itemid]) {
          itemdic[itemid].num = itemdic[itemid].num + itemnum
        } else {
          itemdic[itemid] = {};
          itemdic[itemid].name = itemname
          itemdic[itemid].num = itemnum
          itemdic[itemid].item_sort_id = item_sort_id
          itemdic[itemid].item_type_sort_id = item_type_sort_id
          itemdic[itemid].instore = element.in_store_num;
        }
        // 订单汇总
        const orderkey = itemname + '*' + itemnum;
        if (orderdic[orderkey]) {
          orderdic[orderkey].num = orderdic[orderkey].num + 1
          orderdic[orderkey].items.push(element)
        } else {
          orderdic[orderkey] = {};
          orderdic[orderkey].name = orderkey
          orderdic[orderkey].num = 1
          orderdic[orderkey].itemid = itemid
          orderdic[orderkey].itemnum = itemnum
          orderdic[orderkey].instore = element.in_store_num
          orderdic[orderkey].item_milk_period = item_milk_period
          orderdic[orderkey].item_sort_id = item_sort_id
          orderdic[orderkey].item_type_sort_id = item_type_sort_id
          orderdic[orderkey].items = [];
          orderdic[orderkey].items.push(element)
        }
      });
      // 商品列表
      this.totalnum = 0;

      totalItemList.splice(0);
      for (const itemid in itemdic) {
        if (itemdic[itemid] && itemdic.hasOwnProperty(itemid)) {
          this.totalnum += itemdic[itemid].num;
          totalItemList.push({
            id: itemid,
            num: itemdic[itemid].num,
            name: itemdic[itemid].name,
            item_sort_id: itemdic[itemid].item_sort_id,
            item_type_sort_id: itemdic[itemid].item_type_sort_id,
            instore: itemdic[itemid].instore
          })
        }
      }
      totalItemList.sort(util.sortItem);
      // 订单列表
      orderList.splice(0);
      for (const orderkey in orderdic) {
        if (orderdic[orderkey] && orderdic.hasOwnProperty(orderkey)) {
          orderList.push({
            num: orderdic[orderkey].num,
            name: orderdic[orderkey].name,
            itemnum: orderdic[orderkey].itemnum,
            item_milk_period: orderdic[orderkey].item_milk_period,
            items: orderdic[orderkey].items,
            instore: orderdic[orderkey].instore,
            item_sort_id: orderdic[orderkey].item_sort_id,
            item_type_sort_id: orderdic[orderkey].item_type_sort_id,
            itemid: orderdic[orderkey].itemid
          })
        }
      }
      orderList.sort((a, b) => {
        if (a.itemnum === b.itemnum) {
          return util.sortItem(a, b);
        }

        return a.itemnum - b.itemnum;
      });
    }
  },
  created() {
    this.updateTotal();
  }
}
</script>

<style scoped>
.info-box{
  padding: 10px;
  
}

.info-box-left{
  width:50%;
  float: left;
}

.info-box-right{
  width:45%;
  float: right;
}
</style>
