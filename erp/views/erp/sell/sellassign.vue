<template>
    <div>
         <div class="tabbox">
            <div class="head-list">
                <div  :key="'head'+tab.name" v-for="(tab,index) in tabList" class="headbox" :class="{'is-active':tab.check}" @click="changeTab(index)">
                  {{tab.name}}
                </div>
            </div>
            <div class="content-list">
                <!-- 已经过审商品列表 -->
                <sell-total ref="total_box" v-show="totalDialogShow==true"  v-on:close="totalDialogShow=false"  :dataList="dataList"></sell-total>

                <sell :initgetdata="false" ref="sellList" showOper v-on:onDataChange="dataChange"  showCheckBox showSyncShop showCheckBack :showSearchFiled="SearchFiled"  :searchConditon="SearchCondition" >
                    <button v-show="authDic.SellAssign_assignItem.auth" slot="button-box" @click="assign()" class="button-common">全部配货</button>
                    <button  slot="button-box" @click="showTotalPanel()" class="button-common">显示汇总</button>
                </sell>
                <!-- 配货页面-->
                <sell-out-edit v-if="dialogShow"  :info="dialogdata" v-on:sure="dialogClick" v-on:close="dialogShow=false">

                </sell-out-edit>
          </div>
         </div>
    </div>
</template>

<script>
import model from 'src/model'
import { all, post } from 'common/api'
import myMixin from 'common/mixin/admin.js'
import Sell from 'views/erp/sell/sell'
// import util from 'common/utils'
import SellOutEdit from 'views/erp/sell/selloutedit'
import SellTotal from 'views/erp/sell/selltotal'
import global from 'src/global'
export default{
  mixins: [myMixin],
  data() {
    return {
      SearchFiled: ['id', 'num', 'pay_status', 'shop_order', 'item_name', 'item_short_name','supply_source',
        'customer_account', 'shop_name', 'customer_name', 'user_phone', 'logistics', 'track_man', 'pay_time', 'order_time'],
      TableFiled: ['id', 'item_name','supply_source',
        'num', 'status', 'shop_name', 'customer_account', 'unit_price', 'pay_money',
        'send_user_name', 'send_user_phone',
        'customer_name', 'track_man', 'shop_order',
        'user_info', 'sell_vip_type'],
      SearchCondition: { status: global.sellStatus_checkok },
      dataList: model.sell.list, // 用户列表
      alldataList: [],
      tabList: [], // 标签页
      dialogShow: false,
      allStore: model.store.list,
      curTabInfo: {},
      dialogdata: {},
      totalnum: 0,  // 商品总数
      totalDialogShow: false,
//      totalItemList: [],  // 每类商品
      orderList: []// 订单总数
    }
  },
  components: {
    SellOutEdit,
    Sell,
    SellTotal
  },
  watch: {
    allStore() {
      console.log('storeage change');
      this.initTabList();
      this.changeTab(0)
    }
  },
  methods: {
    showTotalPanel() {
      this.$refs.sellList.getData(true);
      this.totalDialogShow = true;
    },
    initTabList() {
      this.tabList.splice(0);
      this.allStore.forEach(element => {
        if (element.is_del !== 1) {
          this.tabList.push({ name: element.name, check: false, type: 'store', info: element });
        }
      });
    },
    changeTab(index) {
      console.log('change tab', index);
      for (let i = 0; i < this.tabList.length; i++) {
        if (i === index) {
          this.curTabInfo = this.tabList[i];
          this.curTabInfo.check = true;
          this.$refs.sellList.search.store_id = this.curTabInfo.info.id
          this.$set(this.SearchCondition, 'store_id', this.curTabInfo.info.id);
        } else {
          this.tabList[i].check = false;
        }
      }
      this.getData();
    },
    dataChange() {
      console.log('data change', this.dataList);
      // this.$refs.total_box.updateTotal();
    },
    assign() {
      const orderList = []
      const totalItemList = []

      // 配货

      all('sell', null, null, null, { 'sell.status': global.sellStatus_checkok, 'sell.store_id': this.curTabInfo.info.id }).then(
      data => {
        this.alldataList = data.list;
        this.$refs.total_box.initList(data.list, totalItemList, orderList)
        let haveFlag = true;
        let need_itemInfo = null;
        for (let index = 0; index < totalItemList.length; index++) {
          const iteminfo = totalItemList[index];
          if (iteminfo.instore < iteminfo.num) {
            haveFlag = false;
            need_itemInfo = iteminfo;
            break;
          }
        }
        if (haveFlag) {
          this.dialogShow = true
        } else {
          this.$alert(need_itemInfo.name + '仓库商品数量不足', '提示', {
            confirmButtonText: '强制配货',
            closeOnClickModal: true,
            callback: action => {
              if (action !== 'confirm') {
                return;
              }
              this.dialogShow = true
            }
          });
        }
      }
      ).catch(error => {
        console.log('error', error);
      });
    },
    dialogClick(info) {
      const changedata = {};
      changedata.id = []
      this.alldataList.forEach(item => {
        changedata.id.push(item.id);
      })
      changedata.info = info;

      console.log('dialogdata', changedata);
      post('sell_assign', 'assignItem', changedata).then(() => {
        this.dialogShow = false;
        this.getData();
        this.$message({ message: '配货成功', type: 'success', duration: 1000 });
      })
        .catch(err => {
          console.log('err', err);
        })
    },
    getData() {
      // console.trace('get data');
      this.$refs.sellList.getData();
       // Object.assign(this.search, this.searchConditon);
    }
  },
  created() {
    this.initTabList();
    // this.changeTab(0)
    this.$nextTick(() => {
      this.changeTab(0)
    })
  }


}
</script>

<style scoped>
.assign-text{
  color: #606266;
  display: inline-block;
  width: 80%;
  height: 300px;
}


</style>
