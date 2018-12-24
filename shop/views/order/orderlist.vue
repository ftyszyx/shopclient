<template>
  <div>
    <mt-header fixed title="订单列表">
        <div @click="goback()" slot="left">
          <i class="mintui mintui-back"></i>
          <span>返回</span>
        </div>
        <div v-if="seachShow==false" slot="right" @click="showSearch()" style="    line-height: 40px;height: 40px;">搜索</div>
    </mt-header>
    <!-- 标签 -->
    <mt-navbar class=" menubar" style="position" v-model="selectid">
      <mt-tab-item :key="tabitem.id" :id="tabitem.id" v-for="tabitem in selectList">{{tabitem.title}}</mt-tab-item>
    </mt-navbar>
    <!-- 搜索 -->
    <div v-if="seachShow"  flex="dir:top main:left cross:left" style="position: fixed;width:100%;top:73px;background: white;    border: 1px #353030 solid;">
         <div :key="field.name" v-for="field in searchFieldList" class="textrow" flex="dir:left main:left cross:center">
           <span class="input-title" >{{field.title}}</span>
         <div flex-box="1" flex="dir:left main:left cross:center">
            <template v-if="field.name==='order_time'">
                <!-- 开始时间 -->
                <input flex-box="1" class="inputvalue" type="text" readonly v-model="dataSelectBeginString" @click.stop="openDataSelect(true)">
                <span style="padding: 0px 10px;">至</span>
                <!-- 结束时间 -->
                <input flex-box="1" class="inputvalue" type="text" readonly v-model="dataSelectEndString" @click.stop="openDataSelect(false)">
            </template>
            <template v-else>
                  <input flex-box="1" class="inputvalue" type="text" v-model="searchdata[field.name]">
            </template>
         </div>
          <span  v-show="searchdata[field.name]!==undefined" @click="clearSerach(field.name)" class="deltext">x</span>
         
        </div>
        <div class="searchbtn" @click="search()">搜索</div>
        <div class="searchbtn" style="background: #008000;" @click="exportCsv()">导出表格</div>
        <div class="hidebtn" @click="hideserach()">隐藏搜索</div>
      </div>
    <!-- 内容 -->
    <div class="content" :style="{'margin-top': contentMargin+'px'}">
        <template v-if="emptyflag==false">
          <ul 
            style="margin-bottom:50px;"
               v-infinite-scroll="loadMore"
              :infinite-scroll-disabled="NoLoadingMore"
              :infinite-scroll-distance="pagesize"
              :infinite-scroll-immediate-check="false" 
              flex="dir:top main:left cross:center">
              <li class="ordetitem" :key="order.id" v-for="order in orderList" flex="dir:top main:left cross:center">
                <div @click.stop="checkitem(order)" style="width: 100%;line-height: 30px;height: 30px;border-bottom: 1px solid #c8c8cd;" flex="dir:left main:justify cross:center">
                  <div flex="dir:left main:left cross:center">
                     <div  style="padding:5px;">
                      <i style="font-size: 20px;color: red;" v-show="!order.check" class="iconfont zyx-checkno"></i>
                        <i style="font-size: 20px;color: red;"  v-show="order.check" class="iconfont zyx-check"></i>
                      </div>
                    {{order.id}}
                  </div>
                  <div>{{formatTime(order.order_time)}}</div>
                </div>
                <div  style="width: 100%;border-bottom: 1px solid #c8c8cd;" flex="dir:left main:left cross:center">
                  <img  @click="gotoitem(order.itemid)" class="orderpic" :src="order.itempic">
                  <div flex-box="1" flex="dir:top main:left cross:left"> 
                    <div @click="gotoitem(order.itemid)">{{order.itemname}}</div>
                    <div v-if="order.specname!=''">规格：{{order.specname}}</div>
                    <div>单价:<span style="color:red;">￥{{order.unitprice}}</span></div>
                    <div>数量:<span  style="color:red;">{{order.num}}</span></div>
                    <div flex="dir:left main:left cross:left" class="flex-wrapbox">
                       <div class="order_client_info">发件人姓名:<span>{{order.send_user_name||"无"}}</span></div>
                        <div class="order_client_info">发件人手机:<span>{{order.send_user_phone||"无"}}</span></div>
                        <div class="order_client_info">收件人姓名:<span>{{order.client_name||"无"}}</span></div>
                        <div class="order_client_info">收件人手机:<span>{{order.client_phone||"无"}}</span></div>
                        <div class="order_client_info">收件人地址:<span>{{order.client_address||"无"}}</span></div>
                    </div>
                  </div>
                </div>
                <div style="width: 100%;line-height: 24px;" flex="dir:top main:left cross:left">
                    <div>
                      <template v-if="order.status===global.orderStatusSendValue" >
                        <div flex="dir:top main:left cross:left">
                          <span>物流单号(点击复制):</span>
                          <ul flex="dir:left main:left cross:center" class="flex-wrapbox">
                            <li style="margin-top: 5px;border-radius: 5px;cursor: pointer;padding: 0 5px;color:white;background-color: green;margin-left: 5px;" @click="copyorder(shipnumitem,arguments[0])" :key="shipnumitem" v-for="shipnumitem in order.shipment_num">{{shipnumitem}}</li>
                          </ul>
                        </div>
                      </template>
                      </div>
                    <div flex="dir:left main:justify cross:center" style="justify-content: flex-end;">
                      <!-- <span v-if="order.freight_price>0">商品单价：<span  style="color:red;">￥{{order.unitprice}}</span></span> -->
                      <span style="margin-left: 10px;" v-if="order.freight_price>0">运费：<span  style="color:red;">￥{{order.freight_price}}</span></span>
                      <span style="margin-left: 10px;" v-if="order.service_price>0">服务费:<span  style="color:red;">￥{{order.service_price}}</span></span>
                      <template v-if="order.total_price_before===order.total_price">
                        <span style="margin-left: 10px;">总价：<span  style="color:red;">￥{{order.total_price}}</span></span>
                      </template>
                      <template v-else>
                        <span style="margin-left: 10px;">原价：<span  style="color:red;text-decoration-line: line-through;">￥{{order.total_price_before}}</span></span>
                        <span style="margin-left: 10px;">总价：<span  style="color:red;">￥{{order.total_price}}</span></span>
                      </template>
                    </div>
                </div>
                <div style="width: 100%;" flex="dir:left main:right cross:center">
                  <div class="order-button order-button-red" @click.stop="editOrder(order)"  v-if="orderIdNumEmpty(order)">补充身份证</div>
                  <div class="order-button order-button-grey" @click.stop="close(order)"  v-if="order.status===global.orderStatusWaitPayValue">关闭订单</div>
                  <div class="order-button order-button-grey" @click.stop="del(order)" v-if="order.status===global.orderStatusCloseValue||order.status===global.orderStatusOverValue">删除订单</div>
                  <div class="order-button order-button-red" @click.stop="pay(order)" v-if="order.status===global.orderStatusWaitPayValue">支付</div>
                  <div class="order-button order-button-red" @click.stop="confirm(order)" v-if="order.status===global.orderStatusSendValue">确认收货</div>
                  <div class="order-button order-button-grey" @click.stop="refundCancel(order)" v-if="order.status===global.orderStatusRefundValue">取消退款</div>
                  <div class="order-button order-button-grey" @click.stop="refund(order)" v-if="order.status===global.OrderStatusWaitSendValue||order.status===global.orderStatusSendValue">退款</div>
                </div>
              </li>
            </ul>
              <div class="order-bottom-box" style="width: 100%;" flex="dir:left main:right cross:center" v-if="selectid===global.orderStatusWaitPayValue">
                  <div @click="checkall=!checkall" style="padding:5px;">
                     <i style="font-size: 25px;color: red;" v-show="!checkall" class="iconfont zyx-checkno"></i>
                      <i style="font-size: 25px;color: red;"  v-show="checkall" class="iconfont zyx-check"></i>
                  </div>
                  <div>总金额:<span  style="color:red;">￥{{checkmoney}}</span>
                  </div>
                  <div flex-box="1" class="order-button order-button-red" @click="payall()" >支付所选</div>
              </div> 
        </template>
        <template v-else>
          <div style="padding: 10px 0;" flex="dir:top main:left cross:center">
             <i class="iconfont zyx-order" style="font-size:50px;padding: 10px 0;"></i>
             <div style="color: #939393;line-height:24px;font-size: 14px;">你还没有相关订单</div>
             <div  @click="gotoShop()" class="emptybtn">随便逛逛</div>
          </div>
        </template>
    </div>
    <order-edit v-if="showeditOrderPanel" v-on:close="showeditOrderPanel=false" :orderInfo="selectOrder" v-on:submit="changeidinfo"></order-edit>
    <mt-datetime-picker 
            ref="picker"
            type="date"
            year-format="{value} 年"
            month-format="{value} 月"
            date-format="{value} 日"
            @confirm="handleTimeChange"
            v-model="dataselectValue">
      </mt-datetime-picker>
  </div>
</template>

<script>
import OrderEdit from './orderedit'
import mymix from 'src/mixin'
import util from 'common/utils'
import global from 'src/global'
import { allone, post } from 'common/api'
import model from 'src/model'
export default{
  name: 'orderlist',
  mixins: [mymix],
  data() {
    return {
      global,
      // showDataSelect: false,
      dataselectValue: '',
      // dataSelectString: '',
      EditTimeStart: false,
      dataSelectBeginString: '',
      dataSelectEndString: '',
      contentMargin: '73',
      seachShow: false,
      pagesize: 10, // 每页的数量
      curpage: 1,
      checkall: false,
      orderList: [],
      emptyflag: false,
      selectid: '-1',
      checkmoney: 0,
      selectOrder: {},
      searchFieldList: [],
      searchdata: {},
      showeditOrderPanel: false,
      // allLoaded: true,
      getdataRun: false,
      totalsize: 0,
      // payokevent: model.app.payokEvent,
      NoLoadingMore: false,
      selectList: []
    }
  },
  watch: {
    'app.payokEvent': {
      handler(newName, oldName) {
        // console.log('payokevent change');
        if (this.app.payokEvent === true) {
          console.log('payokevent');
          this.reset();
          // const params = this.$route.params
          // this.selectid = params.status
          console.log('payokevent', this.selectid);
          this.getData()
        }
      },
      immediate: true
    },
    checkall() {
      this.checkmoney = 0
      this.orderList.forEach(order => {
        order.check = this.checkall
        this.checkmoney += order.total_price
      })
    },
    selectid() {
      console.log('select id change',this.selectid);
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
    changeidinfo(data) {
      post('ShopOrder', 'UpdateIdNum', data)
        .then(() => {
          this.$toast('修改成功')
          this.showeditOrderPanel = false
        }).catch(err => {
          console.log(err)
        })
    },
    clearSerach(fieldname) {
      this.searchdata[fieldname] = undefined
      if (fieldname === 'order_time') {
        this.dataSelectString = ''
      }
    },
    search() {
      this.reset();
      this.getData();
    },
    handleTimeChange(value) {
      if (this.EditTimeStart) {
        this.searchdata.order_time_begin = value.valueOf() / 1000
        this.dataSelectBeginString = util.formatDate(this.searchdata.order_time_begin)
      } else {
        this.searchdata.order_time_end = value.valueOf() / 1000
        this.dataSelectEndString = util.formatDate(this.searchdata.order_time_end)
      }
    },
    showSearch() {
      this.searchFieldList.forEach(item => {
        this.$set(this.searchdata, item.name, undefined)
      })
      this.seachShow = true;
      this.contentMargin = 270;
      // this.showDataSelect = false;
    },
    hideserach() {
      this.seachShow = false;
      this.contentMargin = 73;
      // this.showDataSelect = false;
    },
    openDataSelect(timetype) {
      this.EditTimeStart = timetype
      this.$refs.picker.open();
    },
    copyorder(value, env) {
      console.log(env)
      if (util.copytext(value, env.target)) {
        this.$toast('单号复制成功');
      } else {
        this.$toast('复制失败');
      }
    },
    gotoitem(itemid) {
      this.$router.push({ path: '/item/' + itemid });
    },
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
      // order.checktime = new Date().getTime()
      this.checkmoney = 0
      this.orderList.forEach(order => {
        if (order.check) {
          this.checkmoney += order.total_price
        }
      })
    },
    reset() {
      this.curpage = 1;
      this.orderList.splice(0)
      this.totalsize = 0;
      this.checkall = false
      this.checkmoney = 0
    },
    pay(order) {
      // this.$toast('pay order ' + order.id)
      this.$router.push({ path: '/payview/' + order.id + '/' + order.pay_id + '/' + order.total_price });
    },
    payall() {
      const payorderList = []
      let money = 0;
      // this.orderList.sort((a, b) => a.checktime - b.checktime))
      this.orderList.forEach(order => {
        if (order.check) {
          payorderList.push(order.id)
          money += order.total_price
        }
      })
      if(payorderList.length===0){
        this.$toast('请选择要支付的订单')
        return;
      }
      post('ShopOrder', 'GetTotalPayId', { orderlist: payorderList })
        .then(data => {
          this.$toast('生成支付码成功')
          this.$router.push({ path: '/payviewtotal/' + data.payid + '/' + money });
        })
        .catch(err => {
          console.log(err);
        })
      // this.$toast('pay order money:' + money)
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
    refundCancel(order) {
      this.$messagebox.confirm('确定要取消？').then(action => {
        console.log(action)
        if (action === 'confirm') {
          post('ShopOrder', 'ClientCancelRefund', { id: order.id })
          .then(() => {
            this.$toast('取消成功')
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
      this.$messagebox.confirm('确定要删除？').then(action => {
        console.log(action)
        if (action === 'confirm') {
          post('ShopOrder', 'ClientDelOrder', { id: order.id })
        .then(() => {
          this.$toast('删除成功')
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
    confirm(order) {
      post('ShopOrder', 'ClientConfirmOrder', { id: order.id })
        .then(() => {
          this.$toast('确认成功')
          this.reset();
          this.getData()
        })
        .catch(err => {
          console.log(err);
        })
    },
    close(order) {
      this.$messagebox.confirm('确定要关闭？').then(action => {
        console.log(action)
        if (action === 'confirm') {
          post('ShopOrder', 'ClientClose', { id: order.id })
        .then(() => {
          this.$toast('关闭成功')
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
    getsearch() {
      const search = {}
      if (this.selectid !== '-1') {
        search['order.status'] = this.selectid
      } else {
        search['order.status'] = ['<>', global.orderStatusDelValue]
      }

      if (this.searchdata.order_time_begin) {
        const timearr = [];
        timearr.push(['>', this.searchdata.order_time_begin + ''])
        if (this.searchdata.order_time_end) {
          timearr.push(['<', this.searchdata.order_time_end + ''])
        } else {
          timearr.push(['<', (this.searchdata.order_time + 86400) + ''])
        }
        timearr.push('and');
        search['order.order_time'] = timearr
      }

      if (this.searchdata.client_name) {
        search['order.client_name'] = ['LIKE', '%' + this.searchdata.client_name + '%']
      }

      if (this.searchdata.itemname) {
        search['item.name'] = ['LIKE', '%' + this.searchdata.itemname + '%']
      }
      return search
    },
    exportCsv() {
      const search = this.getsearch();
      const exportNameList = [];
      const exportHeadList = [];
      const showfield = [];
      util.filterField(model.order.fieldList, showfield, false, 'id', 'order_time', 'member_account',
      'shipment_num', 'itemcode', 'itemname', 'num', 'unitprice', 'total_price', 'itempic', 'specname', 'send_user_name',
      'send_user_phone', 'client_name', 'client_phone', 'client_address');
      showfield.forEach(item => {
        exportNameList.push(item.name);
        exportHeadList.push(item.title);
      })
      post('ShopOrder', 'ExportMyCsv', { search, headlist: exportHeadList, namelist: exportNameList, filename: 'orderlist' })
        .then(data => {
          console.log(data.path)
          window.location.href = data.path;
        })
        .catch(error => {
          console.log('error', error);
        });
    },
    getData() {
      if (this.getdataRun) {
        console.log('wait get data over');
        return;
      }
      this.NoLoadingMore = true
      const order = { 'order.order_time': 'desc' }
      const search = this.getsearch()
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
    util.filterField(model.order.fieldList, this.searchFieldList, false, 'itemname', 'client_name', 'order_time');
    this.searchFieldList.forEach(item => {
      this.$set(this.searchdata, item.name, undefined)
    })
    this.NoLoadingMore = true
    this.selectList.push({ id: '-1', title: '全部' })
    global.orderStatus.forEach(item => {
      if (item.id !== global.orderStatusDelValue && item.id !== global.orderStatusOverValue && item.id !== global.orderStatusCloseValue) {
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
  /* margin-top:73px; */
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
  min-height: 50px;
    max-height: 70px;
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

.order_client_info{
  /* margin-right: 10px; */
}
.order_client_info span{
  color: red;
}

.textrow{
    width:100%;
    height: 30px;
    /* padding: 10px; */
    background: #fff;
    border-bottom: 1px solid #e2e2e2;
}

.textrow .input-title{
    width: 20%;
    text-align: left;
    line-height: 30px;
    font-size: 14px;
    white-space: nowrap;
    overflow: hidden;
}

.textrow  .inputvalue{
    line-height: 30px;
    width:100%;
    height: 25px;
    /* border: 0; */
        font-size: 14px;
}

.searchbtn{
  line-height: 30px;
  height: 30px;
  margin-top: 3px;
  background: #e40a0a;
  color: white;
  width: 100%;
  text-align: center;
}



.hidebtn{
  line-height: 30px;
  height: 30px;
  margin-top: 3px;
  background: #6185d8;
  color: white;
  width: 100%;
  text-align: center;
}

.deltext{
    background-color: gray;
    color: white;
    border-radius: 12px;
    line-height: 20px;
    text-align: center;
    height: 20px;
    width: 20px;
    font-size: 16px;
    cursor: pointer;
}
</style>
