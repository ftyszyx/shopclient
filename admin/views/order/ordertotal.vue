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
                        <table cellspacing="0" cellpadding="0" class="tablebox" border="0" style="width:100%;table-layout: fixed;word-wrap: break-word;">
                                <!-- 表头 -->
                                <thead class="table-thead">
                                <tr>
                                  <th width="300px">名称</th>
                                  <th>数量</th>
                                  <th>金额</th>
                                </tr>
                                </thead>
                                <!-- 表内容 -->
                                <tbody>
                                <tr :key="value.name" v-for="value in totalItemList"  >
                                    <td > {{value.name}} </td>
                                    <td > {{value.num}} </td>
                                    <td > {{value.price}} </td>
                                </tr>
                                <tr>
                                    <td > 总数量 </td>
                                    <td colspan="2"> {{totalnum}} </td>
                                </tr>
                                <tr>
                                    <td > 总金额 </td>
                                    <td colspan="2"> {{totalPrice}} </td>
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
export default{
  name: 'ordertotal',
  data() {
    return {
      totalnum: 0,  // 商品总数
      totalPrice: 0,
      totalItemList: []  // 每类商品
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
      this.initList(this.dataList, this.totalItemList)
    },
    initList(dataList, totalItemList) {
      const itemdic = {};
      dataList.forEach(element => {
        const itemid = element.itemid;
        const itemname = element.itemname;
        const itemnum = parseInt(element.num);
        const price = element.total_price

        // 商品汇总
        if (itemdic[itemid]) {
          itemdic[itemid].num = itemdic[itemid].num + itemnum
          itemdic[itemid].price = itemdic[itemid].price + price
        } else {
          itemdic[itemid] = {};
          itemdic[itemid].name = itemname
          itemdic[itemid].num = itemnum
          itemdic[itemid].price = price
        }
      });
      // 商品列表
      this.totalnum = 0;
      this.totalPrice = 0
      totalItemList.splice(0);
      for (const itemid in itemdic) {
        if (itemdic[itemid] && itemdic.hasOwnProperty(itemid)) {
          this.totalnum += itemdic[itemid].num;
          this.totalPrice += itemdic[itemid].price;
          totalItemList.push({
            id: itemid,
            num: itemdic[itemid].num,
            name: itemdic[itemid].name,
            price: itemdic[itemid].price
          })
        }
      }
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
