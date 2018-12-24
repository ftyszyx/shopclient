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
                                  <th>账号名</th>
                                  <th>订单数量</th>
                                  <th>罐数</th>
                                  <th>金额</th>
                                </tr>
                                </thead>
                                <!-- 表内容 -->
                                <tbody>
                                <tr :key="value.member_account" v-for="value in totalItemList"  >
                                    <td > {{value.member_account}} </td>
                                    <td > {{value.ordernum}} </td>
                                    <td > {{value.num}} </td>
                                    <td > {{value.price}} </td>
                                </tr>
                                <tr>
                                    <td > 总数量 </td>
                                    <td colspan="3"> {{totalnum}} </td>
                                </tr>
                                <tr>
                                    <td > 总金额 </td>
                                    <td colspan="3"> {{totalPrice}} </td>
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
  name: 'usertotal',
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
        const itemname = element.itemname;
        const itemnum = parseInt(element.num);
        const price = element.total_price
        const userid = element.user_id

        // 商品汇总
        if (itemdic[userid]) {
          itemdic[userid].num = itemdic[userid].num + itemnum
          itemdic[userid].price = itemdic[userid].price + price
          itemdic[userid].ordernum = itemdic[userid].ordernum + 1
        } else {
          itemdic[userid] = {};
          itemdic[userid].name = itemname
          itemdic[userid].num = itemnum
          itemdic[userid].member_account = element.member_account
          itemdic[userid].member_name = element.member_name
          itemdic[userid].ordernum = 1
          itemdic[userid].price = price
        }
      });
      // 商品列表
      this.totalnum = 0;
      this.totalPrice = 0
      totalItemList.splice(0);
      for (const userid in itemdic) {
        if (itemdic[userid] && itemdic.hasOwnProperty(userid)) {
          this.totalnum += itemdic[userid].num;
          this.totalPrice += itemdic[userid].price;
          totalItemList.push({
            id: userid,
            member_name: itemdic[userid].member_name,
            member_account: itemdic[userid].member_account,
            num: itemdic[userid].num,
            ordernum: itemdic[userid].ordernum,
            name: itemdic[userid].name,
            price: itemdic[userid].price
          })
        }
      }
      // totalItemList.sort(util.sortItem);
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
