<template>
    <div>
      <sell-total v-show="totalDialogShow==true"  v-on:close="totalDialogShow=false"  ref="total_box" :dataList="dataList"></sell-total>
      
      <sell showOper ref="sell_box" operWidth="250px" v-on:onDataChange="dataChange" showSyncShop showSplit showMerge showCheckBox showImport showCheck showEdit showDel :searchConditon="SearchCondition" :showSearchFiled="SearchFiled" >
        <button slot="button-box" v-show="authDic.Sell_mergeAllOrder.auth" @click="mergePanelShow=true" class="button-common">批量合单</button>
        <button slot="button-box" v-show="authDic.Sell_checkOk.auth" @click="selectStorePanel=true" class="button-common">自动审核</button>
        <button  slot="button-box" @click="totalPanelShow()" class="button-common">显示汇总</button>
      </sell>

      <!-- 合单页面 -->
       <div class="dialog-mask" v-if="mergePanelShow">
            <div class="dialog"  style="width:80%;">
                <div class="header">
                    <span class="title">批量合单</span>
                    <span class="close" @click="mergePanelShow=false">X</span>
                </div>
                <div class="content">
                     <table cellspacing="0" cellpadding="0" border="0" class="tablebox" style="width:100%;">
                        <!-- 表头 -->
                        <thead class="table-thead">
                        <tr> 
                          <th ><input type="checkbox" v-model="checkAll"></th>
                          <th>订单组合名</th>
                           <th>可合并的订单数</th>
                           <th>需要合并的订单数</th>
                          </tr>
                        </thead>
                        <!-- 表内容 -->
                        <tbody>
                            <tr :key="order.name" v-for="order in mergeOrderList"   >
                               <td>
                                  <input type="checkbox" v-model="order.checked" @click.stop>
                                </td>
                                <td >{{order.name}}</td>
                                <td >{{order.matches.length*2}}</td>
                                <input type="number" v-model="order.neednum" >
                            </tr>
                        </tbody>
                    </table>
                </div>
                <div class="footer">
                    <button class="button button-blue" @click="mergeOrder()">确 定</button>
                </div>
            </div>
        </div>

        <!-- 自动审核分12和34段 -->
        <div class="dialog-mask" v-if="autoCheckPanel&&peroidCheck"  @click="autoCheckPanel=false">
            <div class="dialog"  style="width:80%;" @click.stop>
                <div class="header">
                   
                    <span class="title">{{curStoreInfo.name}}</span>
                    <span class="text-warn" v-show="curStoreInfo.sell_num_limit>0">{{"(仅限"+curStoreInfo.sell_num_limit+"罐一单)"}}</span>
                    <span class="title" v-show="curStoreInfo.sell_num_limit<=0">(订单产品数量无限制)</span>
                    <span class="title">自动审核</span>
                    <span class="close" @click="autoCheckPanel=false">X</span>
                </div>
                <div class="content">
                   <div class="tag-list">
                        <table cellspacing="0" cellpadding="0" border="0" style="width:100%;"><tbody>
                          <tr :key="group.name" v-for="group in groupList" >
                            <td >
                              <div class="tag-item button"  >
                             <input type="checkbox" v-model="group.checked" @click="checkUpdate()" @click.stop>
                             
                              {{group.name}}
                              <div class="ordernum">
                               {{' 总单数:'+group.items.length}}
                              </div>
                              <div class="orderbox">
                              <span class="orderlabel">排序id</span>
                              <input  class="check-value" type="number"  @change="simulteCheck()" v-model.number="group.group_orderid">
                             </div>
                          </div>
                            </td>
                          </tr>
                          
                          </tbody>
                        </table>
                    </div>

                     <table cellspacing="0" cellpadding="0" border="0" class="tablebox" style="width:100%;">
              
                        <!-- 表内容 -->
                        <tbody>
                            <tr><td >1/2段可审核订单数</td><td >{{peroidNum1}}</td><td >3/4段可审核订单数</td><td >{{peroidNum2}}</td></tr>
                            <tr><td >1/2段目标订单数</td>
                            <td ><input  class="check-value" type="number"  v-model.number="targetPeroidNum1"></td>
                             <td >3/4段目标订单数</td>
                            <td > <input  class="check-value" type="number"  v-model.number="targetPeroidNum2"></td></tr>
                             <tr><td >1/2段目标罐数</td><td >{{targetItemNum1}}</td>
                             <td >3/4段目标罐数</td><td >{{targetItemNum2}}</td></tr>
                             <tr><td >目标总数</td><td >{{targetItemNum1+targetItemNum2}}</td>
                             <td >目标1/2段和3/4段比例</td><td >{{targetItemNum1+"/"+targetItemNum2}}</td></tr>
                        </tbody>
                    </table>
                </div>
                <div class="footer">
                    <button class="button button-blue" @click="checkSure()">确 定</button>
                </div>
            </div>
        </div>
        <!-- 选择仓库 -->
        <select-check-store :storeList="allStore" v-if="selectStorePanel" v-on:close="selectStorePanel=false" v-on:sure="selectStoreSure">
        </select-check-store>

        <!-- 自动审核，简单页面 -->
        <div class="dialog-mask" v-if="autoCheckPanel&&peroidCheck==false" @click="autoCheckPanel=false">
            <div class="dialog " style="width:80%;" @click.stop >
                <div class="header">
                    
                    <span class="title">{{curStoreInfo.name}}</span>
                    <span class="text-warn"  v-show="curStoreInfo.sell_num_limit>0">{{"(仅限"+curStoreInfo.sell_num_limit+"罐一单)"}}</span>
                    <span class="title" v-show="curStoreInfo.sell_num_limit<=0">(订单产品数量无限制)</span>
                    <span class="title">自动审核</span>
                    <span class="close" @click="autoCheckPanel=false">X</span>
                </div>
                <div class="content"  >
                    <table cellspacing="0" cellpadding="0" border="0" class="tablebox" style="width:100%;">
                        <!-- 表头 -->
                        <thead class="table-thead">
                        <tr>
                          <th >
                              <input type="checkbox" v-model="checkAll">
                          </th>
                          <th>订单组合名</th>
                          <th>总单数</th>
                           <th>可审核订单数</th>
                           <th>目标审核订单数</th>
                           <th>排序id</th>
                           </tr>
                        </thead>
                        <!-- 表内容 -->
                        <tbody>
                            <tr :key="group.name" v-for="group in groupList"   >
                                <td>
                                  <input type="checkbox" v-model="group.checked" @change="checkUpdate()" @click.stop>
                                </td>
                                <td >{{group.name}}</td>
                                <td >{{group.items.length}}</td>
                                <td >{{group.canCheck}}</td>
                                <td><input  class="input-box" type="number" @change="simulteCheck()" v-model.number="group.targetNum"></td>
                                <td><input  class="check-value" type="number"  @change="simulteCheck()" v-model.number="group.group_orderid"></td>
                            </tr>
                            <tr>
                              <td >商品总数量</td>
                              <td colspan="3">{{totalItemNum}}</td>
                            </tr>
                        </tbody>
                    </table>
            </div>
               <div class="footer">
                    <button class="button button-blue" @click="checkSure()">确 定</button>
                </div>
            </div>
        </div>

    </div>
</template>

<script>
import model from 'src/model'
import util from 'common/utils'
import Sell from 'views/erp/sell/sell'
import { all, post } from 'common/api'
import SellTotal from 'views/erp/sell/selltotal'
import SelectCheckStore from 'views/erp/sell/selectcheckstore'
import global from 'src/global'
export default{
  data() {
    return {
      SearchFiled: ['shop_order', 'item_name', 'store_id', 'item_short_name', 'num','supply_source',
        'customer_account', 'shop_id', 'assign_order', 'customer_name', 'user_phone', 'logistics', 'track_man', 'pay_time', 'order_time'],

      SearchCondition: { status: global.sellStatus_checkno },
      dataList: model.sell.list,
      // 订单合并
      mergePanelShow: false,
      mergeOrderList: [], //
      checkAll: true, // 选择所有
      // 自动审核
      autoCheckPanel: false, //
      allStore: model.store.list,
      selectStorePanel: false,
      authDic: model.user.authDic,
      checkedDataList: [], // 已经审核的列表

      // canCheckOrderList: [], // 可以审核的订单列表
      groupList: [], // 可以审核的组合
      peroidNum1: 0, // 1 2段订单数量
      peroidNum2: 0, // 3 4段订单数量
      targetPeroidNum1: 0, // 目标1 2段订单数量
      targetPeroidNum2: 0, // 目标3 4段订单数量
      targetItemNum1: 0, // 目标1 2段商品数量
      targetItemNum2: 0, // 目标3 4段商品数量
      curStoreInfo: {}, // 当前仓库
      totalItemNum: 0,
      totalDialogShow: false, // 汇总
      peroidCheck: false // 是否要分段
    }
  },
  components: {
    SelectCheckStore,
    Sell,
    SellTotal
  },
  watch: {

    checkAll() {
      console.log('check all');
      if (this.mergePanelShow) {
        this.mergeOrderList.forEach(order => {
          order.checked = this.checkAll;
        })
      } else {
        this.groupList.forEach(group => {
          group.checked = this.checkAll;
        })
        this.simulteCheck();
      }
    },
    targetPeroidNum1() {
      this.simulteCheck();
    },
    targetPeroidNum2() {
      this.simulteCheck();
    },
    curStoreInfo() {
      if (this.curStoreInfo.sell_num_limit) {
        this.peroidCheck = this.curStoreInfo.sell_num_limit === 3;
      } else {
        this.peroidCheck = false;
      }
    },
    mergePanelShow() {
      this.mergeInit();
    },
    autoCheckPanel() {
      this.autoCheckInit();
    }
  },
  props: {
    serverModelName: {// 服务器对应的control名
      type: String,
      default: 'sell'
    }
  },
  methods: {
    totalPanelShow() {
      this.$refs.sell_box.getData(true);
      this.totalDialogShow = true;
    },
    checkUpdate() {
      console.log('check update');
      this.$nextTick(() => {
        this.simulteCheck();
      })
    },
    // 获取订单商品数量
    getOrderItemnum(orderList) {
      let num = 0;
      orderList.forEach(order => {
        num += order.num;
      })
      return num;
    },
    // 获取要求订单列表
    getTargetOrders(orderList, targetOrderNum) {
      const okList = [];
      if (targetOrderNum > 0) {
        for (let i = 0; i < orderList.length; i++) {
          if (this.checkRule([orderList[i]]).length > 0) {
          // 说明可以加
            okList.push(orderList[i]);
          }
          if (okList.length >= targetOrderNum) {
            break;
          }
        }
      }
      return okList;
    },
    // 分别获取12和34段
    getPeroidOrder(orderList, orderPeroidList1, orderPeroidList2) {
      orderPeroidList1.splice(0);
      orderPeroidList2.splice(0);
      orderList.forEach(order => {
        if (order.item_milk_period === 1 || order.item_milk_period === 2) {
          orderPeroidList1.push(order);
        } else if (order.item_milk_period === 3 || order.item_milk_period === 4) {
          orderPeroidList2.push(order);
        }
      })
    },
    // 自动审核
    checkSure() {
        // 获取所有的订单
      const allSellList = this.simulteCheck();
      const checkIds = []
      allSellList.forEach(order => {
        checkIds.push(order.id);
      })
      if (checkIds.length === 0) {
        this.$message({ message: '可审核订单不能为空', type: 'error', duration: 1000 })
        return;
      }
      post(this.serverModelName, 'checkOk', { id: checkIds, store_id: this.curStoreInfo.id })
        .then(() => {
          this.$message({ message: '审核成功', type: 'success', duration: 1000 })
          this.autoCheckPanel = false;
          this.getData();
        })
        .catch(error => {
          console.log('error', error);
        });
    },
    // 选择仓库
    selectStoreSure(checkStoreId) {
      console.log('check', checkStoreId)
      if (!checkStoreId) {
        this.$message({ message: '请选择仓库', type: 'error', duration: 1000 })
        return;
      }
      this.$refs.sell_box.getData(true); // 获取还未审核的
      // 获取仓库已经审核的
      all('sell', null, null, null, { 'sell.store_id': checkStoreId, status: 1 }).then(
      response => {
        util.copyList(response.list, this.checkedDataList);
        this.curStoreInfo = this.allStore.find(x => x.id === checkStoreId);
        if (typeof this.curStoreInfo.check_rule === 'string') {
          if (this.curStoreInfo.check_rule === '') {
            this.curStoreInfo.check_rule = null;
          } else {
            this.curStoreInfo.check_rule = JSON.parse(this.curStoreInfo.check_rule);
          }
        }
        this.selectStorePanel = false;
        this.autoCheckPanel = true;// 打开自动审核页面
      }
      ).catch(error => {
        console.log('error', error);
      });
    },
    // 销售单数据变化
    dataChange() {
      // util.copyList(list, this.dataList)
      // this.$refs.total_box.updateTotal();
      if (this.mergePanelShow) {
        this.mergeInit();
      }
      if (this.autoCheckPanel) {
        this.autoCheckInit();
      }
    },

    // 自动审核数据初始化
    autoCheckInit() {
      // 所有可以审核的订单
      const groupList = this.$refs.total_box.orderList;
      this.groupList.splice(0);
      groupList.forEach(group => {
        if (this.curStoreInfo.sell_num_limit > 0) {
          if (this.curStoreInfo.sell_num_limit === group.itemnum) {
            this.groupList.push(group);
          }
        } else {
          this.groupList.push(group);
        }
      })
      this.groupList.forEach(group => {
        group.checked = true;
        group.group_orderid = 1000;// 排序
        group.targetNum = 0;
        group.canCheck = 0;// 可以审核的数量
        group.items.forEach(order => {
          order.group_orderid = 1000;
        })
      })
      this.simulteCheck();
    },
    mergeArr(dest, src) {
      src.forEach(item => {
        dest.push(item);
      })
    },
    // 模仿审核
    simulteCheck(update = true) {
      console.log('simulteCheck')
      // 得到所有选中的
      const targetOrders = [];// 要求的订单
      const checkedOrders = []; // 选中的订单
      this.sortOrderList(this.groupList)
      this.groupList.forEach(group => {
        group.canCheck = 0;
        group.items.forEach(order => {
          order.group_orderid = group.group_orderid;
        })
        if (group.checked) {
          this.mergeArr(checkedOrders, group.items)
          if (this.peroidCheck === false) {
            // 简单审核
            this.sortOrderList(group.items);
            this.mergeArr(targetOrders, this.getTargetOrders(group.items, group.targetNum));
          }
        }
      })
      console.log('target order', targetOrders);
      console.log('checked order', checkedOrders);
      // 段数审核要单独 处理一次 得到用户要求的订单数
      const orderPeroidList1 = [];
      const orderPeroidList2 = [];
      if (this.peroidCheck) {
        this.getPeroidOrder(checkedOrders, orderPeroidList1, orderPeroidList2);
        this.sortOrderList(orderPeroidList1);
        this.sortOrderList(orderPeroidList2);
        this.mergeArr(targetOrders, this.getTargetOrders(orderPeroidList1, this.targetPeroidNum1));
        this.mergeArr(targetOrders, this.getTargetOrders(orderPeroidList2, this.targetPeroidNum2));
      }
      // 根据用户限制，获取真实订单数
      // console.log('可审核检查');
      const checkOkList = this.checkRule(checkedOrders); // 可审核数量
      // console.log('目标检查', targetOrders);
      const targetCheckOkList = this.checkRule(targetOrders); // 目标可审核数量

      // 获取对应能审核的数量
      if (this.peroidCheck) {
        this.getPeroidOrder(targetCheckOkList, orderPeroidList1, orderPeroidList2);
        this.targetItemNum1 = this.getOrderItemnum(orderPeroidList1)
        this.targetItemNum2 = this.getOrderItemnum(orderPeroidList2)
        this.getPeroidOrder(checkOkList, orderPeroidList1, orderPeroidList2);
        this.peroidNum1 = orderPeroidList1.length;
        this.peroidNum2 = orderPeroidList2.length;
      } else {
        this.totalItemNum = this.getOrderItemnum(targetCheckOkList)
        // 计算可审核数量
        // console.log('checkOkList', checkOkList);
        checkOkList.forEach(order => {
          const groupinfo = this.groupList.find(x => x.itemid === order.item_id && x.itemnum === order.num);
          groupinfo.canCheck++;
        })
        // console.log('groupList', this.groupList);
      }
      if (update) {
        this.$forceUpdate();
      }
      return targetCheckOkList;
    },

    checkRule(allOrder) {
      this.sortOrderList(allOrder);
      console.log('allOrder sorted', allOrder);
      const checkOkList = [];
      allOrder.forEach(order => {
        console.log('check item ', order.item_name, order.num, order.customer_name, order.user_id_number)
        // 此人的所有订单
        if (this.curStoreInfo.check_rule) {
          const haveOrders = this.getSamePeopleOrder(order, this.curStoreInfo.check_rule, checkOkList);
          const afterHaveOrders = haveOrders.concat([order]);// 添加完这个后所有的订单
          console.log('after order', afterHaveOrders)
          let limit_num = 0;
          const rules = this.curStoreInfo.check_rule.rules;
          for (let i = 0; i < afterHaveOrders.length; i++) {
            const ruleinfo = this.getFieldRule(rules, afterHaveOrders[i].item_id, afterHaveOrders[i].num);
            if (ruleinfo) {
              if (limit_num === 0 || ruleinfo.num < limit_num) {
              // console.log('limit num set', ruleinfo.num);
                limit_num = ruleinfo.num;
              }
            }
          }
          if (afterHaveOrders.length > limit_num) {
            console.log('不合规则：havenum', afterHaveOrders.length, 'max num', limit_num);
          } else {
            console.log('增加：havenum', afterHaveOrders.length, 'max num', limit_num);
            checkOkList.push(order);
          }
        } else {
          console.log('增加无限制');
          checkOkList.push(order);
        }
      })
      return checkOkList;
    },
    // 获取同一用户的有规则限制的所有订单
    getSamePeopleOrder(addorder, checkRule, orderList) {
      const orders = [];
      const isInRule = order => {
        for (let i = 0; i < checkRule.rules.length; i++) {
          const rule = checkRule.rules[i];
          for (let j = 0; j < rule.orders.length; j++) {
            const ordertemp = rule.orders[j];
            if (ordertemp.itemid === order.item_id && ordertemp.num === order.num) {
              return true;
            }
          }
        }
        return false;
      }
      const isSamePeople = order => {
        for (let i = 0; i < checkRule.fields.length; i++) {
          const field = checkRule.fields[i];
          if (addorder[field.name] === order[field.name]) {
            return true;
          }
        }
        return false;
      }
      orderList.forEach(order => {
        if (isSamePeople(order)) {
          // 同一个人
          if (isInRule(order)) {
            // 在规则中的订单
            orders.push(order);
          }
        }
      })

      this.checkedDataList.forEach(order => {
        if (isSamePeople(order)) {
          // 同一个人
          if (isInRule(order)) {
            // 在规则中的订单
            orders.push(order);
          }
        }
      })
      return orders;
    },

    // 组排序
    // 订单组合排序
    sortOrderList(orderList) {
      orderList.forEach(orderItem => {
        if (this.curStoreInfo.sell_num_limit === 3) {
                // 34 21顺序
          if (orderItem.item_milk_period === 3) {
            orderItem.peroid_order = 1;
          } else if (orderItem.item_milk_period === 4) {
            orderItem.peroid_order = 2;
          } else if (orderItem.item_milk_period === 2) {
            orderItem.peroid_order = 3;
          } else {
            orderItem.peroid_order = 4;
          }
        } else if (this.curStoreInfo.sell_num_limit === 6) {
          orderItem.peroid_order = orderItem.item_milk_period; // 1234顺序
        } else {
          orderItem.peroid_order = 0;
        }
      })
      // 排序
      orderList.sort((a, b) => {
        if (a.group_orderid === b.group_orderid) {
          if (a.peroid_order === b.peroid_order) {
            if (a.order_time === b.order_time) {
              return util.sortItem(a, b);
            } else {
              return a.order_time - b.order_time;
            }
          } else {
            return a.peroid_order - b.peroid_order;
          }
        } else {
          return a.group_orderid - b.group_orderid;
        }
      })
    },
    // 获取对应的字段规则
    getFieldRule(storeRule, itemid, num) {
      let findres = null;
      if (storeRule) {
        for (let i = 0; i < storeRule.length; i++) {
          const ruleinfo = storeRule[i];
          for (let index = 0; index < ruleinfo.orders.length; index++) {
            const orderinfo = ruleinfo.orders[index];
            if (itemid === orderinfo.itemid && num === orderinfo.num) {
              findres = ruleinfo;
              return findres;
            }
          }
        }
      }
      return findres;
    },

    initMatchs(itemList, matches) {
      // console.log(' initMatchs itemlist', itemList);
      for (let index = 0; index < itemList.length; index++) {
        const firstinfo = itemList[index];
        if (firstinfo.num !== 3) {
          continue;
        }
        for (let later = index + 1; later < itemList.length; later++) {
          const laterinfo = itemList[later];
          if (laterinfo.num !== 3 || (laterinfo.shop_order !== firstinfo.shop_order)) {
            continue;
          }
          matches.push([firstinfo, laterinfo]);
          itemList.splice(index, 1);
          itemList.splice(later - 1, 1);
          // console.log(' after itemlist', itemList, firstinfo.id, laterinfo.id);
          return this.initMatchs(itemList, matches);
        }
      }
    },

     // 合并订单数据初始化
    mergeInit() {
      const orderList = this.$refs.total_box.orderList;
      this.mergeOrderList.splice(0);
      orderList.forEach(element => {
        if (element.itemnum === 3) {
          this.mergeOrderList.push(element);
          element.checked = true;
          element.matches = [];
          element.items.sort((a, b) => a.build_time - b.build_time)
          const itemTempList = [];
          util.copyList(element.items, itemTempList)
          this.initMatchs(itemTempList, element.matches);
          element.neednum = element.matches.length * 2;
        }
      });
    },

    mergeOrder() {
      console.log('mergeorder');
      const mergeids = [];
      for (let i = 0; i < this.mergeOrderList.length; i++) {
        const item = this.mergeOrderList[i];
        // console.log('item ', item.checked, item.neednum, item.neednum % 2);
        if (item.checked && item.neednum > 0) {
          if (item.neednum % 2 > 0) {
            this.$message({ message: '合单目标数要填偶数', type: 'error', duration: 1000 });
            return;
          }
          const matchnum = item.neednum / 2;
          for (let index = 0; index < matchnum; index++) {
            mergeids.push([item.matches[index][0].id, item.matches[index][1].id]);
          }
        }
      }
      if (mergeids.length <= 0) {
        this.$message({ message: '合单数不能为空', type: 'error', duration: 1000 });
        return;
      }
      post(this.serverModelName, 'mergeAllOrder', { id: mergeids })
      .then(() => {
        this.mergePanelShow = false;
        this.$message({ message: '合单成功', type: 'success', duration: 1000 })
        this.$refs.sell_box.getData();
      })
      .catch(error => {
        console.log('error', error);
      });
    },
    getData() {
      this.$refs.sell_box.getData();
    }

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

.text-warn{
   line-height: 24px;
  font-size: 18px;
  color: red;
}
.orderbox{
  margin-left: 20px;
  display: inline-block;
}
.orderbox .orderlabel{
  color: red;
}
.orderbox .check-value{
  width:60px;
}
.ordernum{
  display: inline;
  margin: 0 10px;
  color: black;
}
</style>
