<template>
  <div>
    <mt-header fixed title="订单列表">
        <div @click="goback()" slot="left">
          <i class="mintui mintui-back"></i>
          <span>返回</span>
        </div>
    </mt-header>
    <mt-navbar class=" menubar" style="position" v-model="selectid">
      <mt-tab-item :key="tabitem.id" :id="tabitem.id" v-for="tabitem in selectList">{{tabitem.title}}</mt-tab-item>
    </mt-navbar>
    <div class="content">
        <template v-if="emptyflag==false">
          <ul 
               v-infinite-scroll="loadMore"
              :infinite-scroll-disabled="NoLoadingMore"
              :infinite-scroll-distance="pagesize"
              :infinite-scroll-immediate-check="false" 
              flex="dir:top main:left cross:center">
              <li class="ordetitem" :key="order.id" v-for="order in orderList" flex="dir:top main:left cross:center" >
                <div style="width: 100%;line-height: 30px;height: 30px;border-bottom: 1px solid #c8c8cd;" flex="dir:left main:justify cross:center">
                  <div>{{order.id}}</div>
                  <div>{{formatTime(order.order_time)}}</div>
                </div>
                <div style="width: 100%;height:100px;border-bottom: 1px solid #c8c8cd;" flex="dir:left main:left cross:center">
                  <!-- <div @click="checkitem(order)" style="padding:5px;" v-if="selectid===global.orderStatusWaitPayValue">
                    <i style="font-size: 25px;color: red;" v-show="!order.check" class="iconfont zyx-checkno"></i>
                    <i style="font-size: 25px;color: red;"  v-show="order.check" class="iconfont zyx-check"></i>
                </div> -->
                  <img class="orderpic" :src="order.item_info.pic">
                  <div class="flexbox1" flex="dir:top main:left cross:left" style="line-height: 20px;padding: 0 10px;"> 
                    <div>{{order.item_info.name}}</div>
                    <div>规格：{{order.item_info.specname}}</div>
                    <div>单价:<span style="color:red;">￥{{order.item_info.price}}</span></div>
                    <div>数量:<span  style="color:red;">{{order.item_info.num}}</span></div>
                  </div>
                </div>
                <div style="width: 100%;line-height: 24px;" flex="dir:left main:justify cross:center">
                    <div>{{getSelectName(order.status,global.orderStatus)}}</div>
                    <div>
                      <template v-if="order.total_price_before===order.total_price">
                        <span>价格：<span  style="color:red;">￥{{order.total_price}}</span></span>
                      </template>
                      <template v-else>
                        <span>原价：<span  style="color:red;text-decoration-line: line-through;">￥{{order.total_price_before}}</span></span>
                        <span>现价：<span  style="color:red;">￥{{order.total_price}}</span></span>
                      </template>
                      
                      
                    </div>
                </div>
                <div style="width: 100%;" flex="dir:left main:right cross:center">
                  <div class="order-button order-button-red" @click="editOrder(order)"  v-if="orderIdNumEmpty(order)">补充身份证信息</div>
                  <div class="order-button order-button-grey" @click="close(order)"  v-if="order.status===global.orderStatusWaitPayValue">关闭订单</div>
                  <div class="order-button order-button-grey" @click="del(order)" v-if="order.status===global.orderStatusCloseValue">删除订单</div>
                  <div class="order-button order-button-red" @click="pay(order)" v-if="order.status===global.orderStatusWaitPayValue">支付</div>
                  <div class="order-button order-button-grey" @click="refund(order)" v-if="order.status===global.OrderStatusWaitcheckValue||order.status===global.OrderStatusWaitSendValue||order.status===global.orderStatusSendValue">退款</div>
                </div>
              </li>
            </ul>
              <!-- <div class="order-bottom-box" style="width: 100%;" flex="dir:left main:right cross:center" v-if="selectid===global.orderStatusWaitPayValue">
                  <div @click="checkall=!checkall" style="padding:5px;">
                     <i style="font-size: 25px;color: red;" v-show="!checkall" class="iconfont zyx-checkno"></i>
                      <i style="font-size: 25px;color: red;"  v-show="checkall" class="iconfont zyx-check"></i>
                  </div>
                  <div>总价:<span  style="color:red;">￥{{checkmoney}}</span>
                  </div>
                  <div class="order-button order-button-red flexbox1" @click="payall()" >支付所选

                  </div>
              </div>  -->
        </template>
        <template v-else>
          <div style="padding: 10px 0;" flex="dir:top main:left cross:center">
             <i class="iconfont zyx-order" style="font-size:50px;padding: 10px 0;"></i>
             <div style="color: #939393;line-height:24px;font-size: 14px;">你还没有相关订单</div>
             <div  @click="gotoShop()" class="emptybtn">随便逛逛</div>
          </div>
        </template>
    </div>
    <order-edit v-if="showeditOrderPanel" v-on:close="showeditOrderPanel=false" v-on:changeok="editorderOk" :orderInfo="selectOrder"></order-edit>
  </div>
</template>

<script>
import OrderEdit from './orderedit'
import mymix from 'src/mixin'
// import util from 'common/utils'
import global from 'src/global'
import { allone, post } from 'common/api'
import model from 'src/model'
export default{
  mixins: [mymix],
  data() {
    return {
      global,
      pagesize: 10, // 每页的数量
      curpage: 1,
      checkall: false,
      orderList: [],
      emptyflag: false,
      selectid: '-1',
      checkmoney: 0,
      selectOrder: {},
      showeditOrderPanel: false,
      // allLoaded: true,
      getdataRun: false,
      totalsize: 0,
      NoLoadingMore: false,
      selectList: []
    }
  },
  watch: {
    checkall() {
      this.checkmoney = 0
      this.orderList.forEach(order => {
        order.check = this.checkall
        this.checkmoney += order.item_info.price * order.item_info.num
      })
    },
    selectid() {
      console.log('select id change');
      this.reset();
      this.getData()
    },
    orderList() {
      console.log('orderlist update', this.totalsize, this.orderList.length)
      this.emptyflag = this.orderList.length === 0;
    }

  },
  components: {
    OrderEdit
  },
  methods: {
    editorderOk() {
      this.reset();
      this.getData();
    },
    editOrder(order) {
      this.showeditOrderPanel = true
      Object.assign(this.selectOrder, order)
    },
    orderIdNumEmpty(order) {
      if (order.status === global.OrderStatusWaitSendValue || order.status === global.orderStatusWaitPayValue || order.status === global.OrderStatusWaitcheckValue) {
        if (((order.idnum || '') === '') || ((order.idnumpic1 || '') === '') || ((order.idnumpic2 || '') === '')) {
          return true
        }
      }
      return false
    },
    checkitem(order) {
      order.check = !order.check
      this.checkmoney = 0
      this.orderList.forEach(order => {
        if (order.check) {
          this.checkmoney += order.item_info.price * order.item_info.num
        }
      })
    },
    reset() {
      this.curpage = 1;
      this.orderList.splice(0)
      this.totalsize = 0;
    },
    pay(order) {
      // this.$toast('pay order ' + order.id)
      this.$router.push({ path: '/payview' + '/' + order.id + '/' + order.pay_id + '/' + order.total_price });
    },
    payall() {
      const payorderList = []
      let money = 0;
      this.orderList.forEach(order => {
        if (order.check) {
          payorderList.push(order)
          money += order.total_price
        }
      })
      this.$toast('pay order money:' + money)
    },
    refund(order) {
      this.$messagebox.prompt('请输入退款原因').then(({ value, action }) => {
        console.log(value, action)
        if (action === 'confirm') {
          post('ShopOrder', 'ClientRefundOrder', { id: order.id, refund_info: value })
          .then(() => {
            this.$toast('提交成功')
            this.reset();
            this.getData()
          })
          .catch(err => {
            console.log(err);
          })
        }
      }).catch(err => {
        console.log(err)
      });
    },
    del(order) {
      post('ShopOrder', 'ClientDelOrder', { id: order.id })
        .then(() => {
          this.$toast('删除成功')
          this.reset();
          this.getData()
        })
        .catch(err => {
          console.log(err);
        })
    },
    close(order) {
      post('ShopOrder', 'ClientClose', { id: order.id })
        .then(() => {
          this.$toast('关闭成功')
          this.reset();
          this.getData()
        })
        .catch(err => {
          console.log(err);
        })
    },
    gotoShop() {
      this.$router.push({ path: '/' });
    },
    loadMore() {
      console.log('loading more', this.NoLoadingMore)
      if (this.NoLoadingMore === true) {
        return;
      }
      this.getData();
    },
    getData() {
      if (this.getdataRun) {
        console.log('wait get data over');
        return;
      }
      this.NoLoadingMore = true
      const order = {}
      const search = {}
      if (this.selectid !== '-1') {
        search['order.status'] = this.selectid
      }

      this.getdataRun = true;
      allone('ShopOrder', 'GetMyOrder', this.curpage, this.pagesize, order, search).then(
      data => {
        if (data.list) {
          data.list.forEach(element => {
            model.order.initData(element)
            this.orderList.push(element)
          });
        }
        this.totalsize = data.num;
        this.NoLoadingMore = this.totalsize <= this.orderList.length
        this.getdataRun = false;
        this.curpage++;
        console.log('set loadingmore', this.NoLoadingMore)
      }
      ).catch(error => {
        console.log('error', error);
        this.getdataRun = false;
        this.NoLoadingMore = this.totalsize <= this.orderList.length
      });
    }
  },

  created() {
    this.NoLoadingMore = true
    this.selectList.push({ id: '-1', title: '全部' })
    global.orderStatus.forEach(item => {
      if (item.id !== global.orderStatusDelValue) {
        this.selectList.push(item)
      }
    })

    this.user.checkLogin(() => {
      console.log('check login ok')
      this.reset();
      const params = this.$route.params
      console.log('params', params)
      this.selectid = params.status
      this.getData();
    })
  }
}
</script>

<style scoped>
.menubar{
  position: fixed;
  height: 30px;
  top:40px;
  left: 0;
  right: 0;
}
.content{
  margin-top:73px;
  height: 100vh;
  width:100%;
  background-color: rgb(238,238,238);
}
.emptybtn{
      height: 30px;
    width: 100px;
    line-height: 30px;
    font-size: 14px;
    color: #fdfdfd;
    background-color: blue;
    /* border: 1px solid #DBDBDB; */
    /* padding: 5px 10px; */
    text-align: center;
}

.ordetitem{
  width:100%;
  font-size: 14px;
      margin: 10px 0;
    background: white;
}
.orderpic{
  min-height: 80px;
    max-height: 100%;
    width: auto;
}

.order-button{
  height: 35px;
  line-height: 35px;
  text-align: center;
  margin-left: 10px;
  width:80px;
  color: white;
  cursor: pointer;
}

.order-button-grey{
  background-color: #999999;
}

.order-button-red{
  background-color: #F93F40;
}

.order-bottom-box{
  position: fixed;
  bottom: 0;
  background-color: white;
  height: 50px;
}

.margin-bottom-box{
  margin-bottom: 50px;
}
</style>
