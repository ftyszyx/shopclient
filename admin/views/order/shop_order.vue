<template>
    <div>
        <common-search :search="search" :searchFieldList="searchFieldList" v-on:search="searchClick"></common-search>
        <div  class="tablebox">
          <div class="btnbox">
            <button @click="exportSelctShow=true" class="button-common">导出</button>
            <button @click="showTotalPanel()" class="button-common">显示当前订单汇总</button>
            <button @click="showUsrTotalPanel()" class="button-common">显示用户订单汇总</button>
            <button v-if="ordertype===global.OrderStatusWaitcheckValue" @click="checkAllOrder()" class="button-common">审核(勾选)</button>
          </div>
           <el-table ref="table_box"  highlight-current-row  border max-height="600" :data="dataList" @row-dblclick="detail"  @sort-change="sortChange">
            <el-table-column  v-show="showCheckBox" type="selection" width="55"></el-table-column>
            <el-table-column :prop="field.name" :sortable="field.sort!=null?'custom':false" resizable show-overflow-tooltip :fixed="field.name==='id'||field.name==='total_price'||field.name==='itemname'||field.name==='num'" :label="field.title" :key="field.name" v-for="field in showfieldList"  :width="field.width||100">
                <template slot-scope="scope">
                   <template v-if="field.selectList">
                      {{getSelectName(scope.row[field.name],field.selectList)}}
                    </template>
                    <template v-else-if="field.type==='time'">
                        {{formatTime(scope.row[field.name])}}
                    </template>
                     <template v-else-if="field.name==='shipment_num'">
                             <template v-for="(shipnum,index) in scope.row[field.name]">
                                {{shipnum}}<template v-if="index<scope.row[field.name].length-1">|</template>
                            </template>
                        </template>
                    <template v-else-if="field.type==='pic'">
                       <img src="~common/img/upload-common-select.png" v-if="!scope.row[field.name]">
                        <img @click="showpic(scope.row[field.name])" class="pic" :src="scope.row[field.name]" v-if="scope.row[field.name]">
                    </template>
                    <template v-else>
                        {{scope.row[field.name]}}
                    </template>    
                </template>
              </el-table-column>
              <el-table-column  v-if="showOper" fixed="right" label="操作"  :width="operWidth">
                  <template slot-scope="scope">
                    <div> 
                        <a class="button-table-td" v-if="scope.row.status===global.OrderStatusWaitcheckValue" @click.stop="checkOrder(scope.row)">审核发货</a>
                        <a class="button-table-td"  v-if="scope.row.status===global.OrderStatusWaitSendValue||scope.row.status===global.orderStatusSendValue" @click.stop="exportErp(scope.row)">导出ERP</a>
                        <a class="button-table-td" v-if="scope.row.status===global.orderStatusWaitPayValue"  @click.stop="closeOrder(scope.row)">关闭</a>
                        <a class="button-table-td"  v-if="scope.row.status===global.orderStatusRefundValue" @click.stop="refund(scope.row)">确认退款</a>
                        <a class="button-table-td"  v-if="scope.row.status===global.orderStatusRefundValue" @click.stop="refundCancel(scope.row)">取消退款</a>
                        <a class="button-table-td"  v-if="scope.row.status===global.orderStatusSendValue" @click.stop="confirm(scope.row)">确认收货</a>
                        <a class="button-table-td" @click.stop="edit(scope.row)">修改</a>
                    </div>
                  </template>
              </el-table-column>
          </el-table>
       </div>

        
        <!-- 分页 -->
        <el-pagination
                @size-change="handleSizeChange"
                @current-change="handleCurrentChange"
                :current-page="curpage"
                :page-sizes="[50, 100, 500]"
                :page-size="50"
                layout="total,sizes, prev, pager, next"
                :total="totalsize">
        </el-pagination>

        <add-dialog 
         v-if="showPreview"
          title="图片预览"
           v-on:close="showPreview=false" 
           :showfooter="false">
          <template slot="edititembox"  >
              <img :src="previewpic" style="max-width:180px;">
          </template>
        </add-dialog>
        
        <!-- 对话框 -->
         <add-dialog 
            v-if="dialogShow"
            :title="dialogtitle"
            :fieldList="fieldList" 
            :dialogdata="dialogdata" 
            v-on:close="dialogShow=false" 
            v-on:sure="dialogClick">
        </add-dialog>
        
         <add-dialog 
            v-if="erpExportPanel"
            title="订单导出到ERP"
            v-on:close="erpExportPanel=false" 
            :fieldList="[ { name: 'export', title: '是否使用ERP的物流单号，并变成已发货', type:'bool',changeable:true}]" 
            :dialogdata="erpExportData"
            v-on:sure="exportErpSure">
        </add-dialog>

         <add-dialog 
            v-if="showConfirmPanel"
            title="审核订单"
            v-on:close="showConfirmPanel=false" 
            :fieldList="[ { name: 'export', title: '是否使用ERP的物流单号，并变成已发货', type:'bool',changeable:true},{ name: 'check', title: '支付审核是否通过', type:'bool',changeable:true}]" 
            :dialogdata="{'export':1,'check':0}" 
            v-on:sure="checkOrderOK">
        </add-dialog>

        <add-dialog 
            v-if="showCheckInfoPanel"
            title="选择审核通过类型"
            v-on:close="showCheckInfoPanel=false" 
            :fieldList="[ { name: 'pay_check_info', title: '审核通过类型', selectList: global.orderCheckInfoType,changeable:true},{ name: 'pay_type', title: '支付方式', changeable: true, selectList: global.orderPayType }]" 
            :dialogdata="{'pay_check_info':global.DefaultorderCheckInfoType,'pay_type' :checkorderPaytype}" 
            v-on:sure="checkOrderOKSure">
        </add-dialog>

  
        <order-total v-if="ordertotalPanelShow" v-on:close="ordertotalPanelShow=false" :dataList="orderTotalDataList"></order-total>
        <user-total v-if="usrtotalPanelShow" v-on:close="usrtotalPanelShow=false" :dataList="usrTotalDataList"></user-total>

        <common-info v-if="dialogDetailShow" v-on:close="dialogDetailShow=false" :info="detailInfo" :fieldList="fieldList" title="订单详情"></common-info>
         <export-select v-if="exportSelctShow" :templeName="serverModelName" v-on:close="exportSelctShow=false" v-on:sure="exportCSV" :filedList="exportFiledList"></export-select>
    </div>
</template>

<script>
import model from 'src/model/index.js'
import util from 'common/utils'
import myMixin from 'common/mixin/admin.js'
import AddDialog from 'src/views/common/common_dialog';
import CommonSearch from 'common/components/common_searchbox'
import CommonTable from 'common/components/common_table'
import CommonTd from 'common/components/common_td'
import ExportSelect from 'views/database/export_table'
import { post, all } from 'common/api'
import CommonInfo from 'common/components/common_info'
import OrderTotal from './ordertotal'
import UserTotal from './usrtotal'
import global from 'src/global.js'

export default{
  mixins: [myMixin],
  data() {
    return {
      ordertype: 0,
      dataList: model[this.modelName].list, // 用户列表
      fieldList: model[this.modelName].fieldList, // 字段列表
      exportFiledList: [],
      dialogShow: false,
      erpExportPanel: false,
      erpExportData: { export: 1 },
      erpExportSendFlag: true, // 是不是导出后变成已发货
      erpExportids: [],
      showPreview: false,
      previewpic: '',
      showConfirmPanel: false,
      showCheckBox: true,
      operWidth: '230px',
      detailInfo: {},
      dialogDetailShow: false,
      showOper: true,
      dialogdata: {},
      checkorderid: [],
      exportSelctShow: false,
      sendflag: true,
      // checkorder: {},
      checkorderPaytype: global.orderPayScanType,
      showCheckInfoPanel: false,
      ordertotalPanelShow: false,
      orderTotalDataList: [],
      usrtotalPanelShow: false,
      usrTotalDataList: [],
      dialogtitle: ''
    }
  },
  watch: {
    '$route'() {
      console.log('update view')
      this.initpath();
      this.getData();
      this.$forceUpdate();
    }
  },
  components: {
    AddDialog,
    OrderTotal,
    CommonTd,
    ExportSelect,
    CommonTable,
    CommonInfo,
    UserTotal,
    CommonSearch
  },
  props: {
    serverModelName: {// 服务器对应的control名
      type: String,
      default: 'ShopOrder'
    },
    modelName: {// 本地对应的模块名
      type: String,
      default: 'shoporder'
    }
  },
  methods: {

    showTotalPanel() {
      const search = this.getSearch(this.searchFilter);
      all(this.serverModelName, null, null, null, search).then(
      data => {
        util.copyList(data.list, this.orderTotalDataList, model.shoporder.initData)
      }
      ).catch(error => {
        console.log('error', error);
      });
      this.ordertotalPanelShow = true;
    },
    showUsrTotalPanel() {
      const search = this.getSearch(this.searchFilter);
      all(this.serverModelName, null, null, null, search).then(
      data => {
        util.copyList(data.list, this.usrTotalDataList, model.shoporder.initData)
      }
      ).catch(error => {
        console.log('error', error);
      });
      this.usrtotalPanelShow = true;
    },
    showpic(pic) {
      this.showPreview = true
      this.previewpic = pic;
    },
    detail(value) {
      this.detailInfo = value;
      this.dialogDetailShow = true;
    },
    sortChange(column) {
      console.log('sort change', column)
      for (let i = 0; i < this.showfieldList.length; i++) {
        if (this.showfieldList[i].name === column.prop) {
          if (column.order === 'descending') {
            this.showfieldList[i].sort = 1
            util.ChangeOrder(this.showfieldList, i)
          } else if (column.order === 'ascending') {
            this.showfieldList[i].sort = 2
            util.ChangeOrder(this.showfieldList, i)
          }
          break;
        }
      }

      if (this.getData) {
        this.getData();
      }
    },
    exportErpSure(nowdata) {
      post(this.serverModelName, 'ExportToErp', { ids: this.erpExportids, sendflag: nowdata.export })
        .then(() => {
          this.getData();
          this.$message({ message: '导出成功', type: 'success', duration: 1000 })
          this.erpExportPanel = false;
        })
        .catch(err => {
          console.log('err', err);
        })
    },
    exportErp(value) {
      this.erpExportData.export = value.is_sync_shipnum
      this.erpExportPanel = true;
      this.erpExportids = [value.id]
    },
    checkAllOrder() {
      this.checkorderid = this.gettableSelct()
      if (this.checkorderid.length === 0) {
        this.$message({ message: '请选择订单', type: 'error', duration: 2000 })
        return;
      }
      this.showConfirmPanel = true
    },
    checkOrder(value) {
      this.checkorderid = [value.id]
      this.checkorderPaytype = value.pay_type
      this.showConfirmPanel = true
    },
    gettableSelct(cb) {
      const selection = this.$refs.table_box.selection
      const checkArr = []
      selection.forEach(item => {
        checkArr.push(item.id);
        if (cb) { cb(item) }
      })
      return checkArr;
    },
    checkOrderOK(nowdata) {
      if (nowdata.check === 1) {
        // this.showConfirmPanel = false
        this.showCheckInfoPanel = true
        this.sendflag = nowdata.export
      } else {
        this.checkOrderNO()
      }
    },
    checkOrderOKSure(nowdata) {
      post(this.serverModelName, 'CheckPayOk', { ids: this.checkorderid, sendflag: this.sendflag, pay_check_info: nowdata.pay_check_info, pay_type: nowdata.pay_type })
        .then(() => {
          this.getData();
          this.$message({ message: '审核并发货成功', type: 'success', duration: 2000 })
          this.showConfirmPanel = false
          this.showCheckInfoPanel = false
        })
        .catch(err => {
          console.log('err', err);
        })
    },
    checkOrderNO() {
      post(this.serverModelName, 'CheckPayNO', { id: this.checkorderid })
        .then(() => {
          this.getData();
          this.$message({ message: '审核成功', type: 'success', duration: 1000 })

          this.showConfirmPanel = false
        })
        .catch(err => {
          console.log('err', err);
        })
    },
    closeOrder(orderinfo) {
      this.$prompt('请输关闭原因', '订单关闭', {
        confirmButtonText: '确定',
        cancelButtonText: '取消'
      }).then(({ value }) => {
        if (value === '') {
          this.$message({ message: '关闭原因不能为空', type: 'error', duration: 1000 })
          return;
        }
        post(this.serverModelName, 'Adminclose', { id: orderinfo.id, close_info: value })
      .then(() => {
        // this.dialogShow = false;
        this.getData();
        this.$message({ message: '修改成功', type: 'success', duration: 1000 })
      })
      .catch(err => {
        console.log('err', err);
      })
      }).catch(() => {
        this.$message({
          type: 'info',
          message: '取消输入'
        });
      });
    },
    confirm(orderinfo) {
      post(this.serverModelName, 'AdminConfirmOrder', { id: orderinfo.id })
      .then(() => {
        // this.dialogShow = false;
        this.getData();
        this.$message({ message: '确认成功', type: 'success', duration: 1000 })
      })
      .catch(err => {
        console.log('err', err);
      })
    },
    refund(orderinfo) {
      this.$prompt('请输退款原因', '订单退款确认', {
        confirmButtonText: '确定',
        cancelButtonText: '取消'
      }).then(({ value }) => {
        if (value === '') {
          this.$message({ message: '退款原因不能为空', type: 'error', duration: 1000 })
          return;
        }
        post(this.serverModelName, 'AdminRefundSure', { id: orderinfo.id, close_info: value })
      .then(() => {
        // this.dialogShow = false;
        this.getData();
        this.$message({ message: '确认成功', type: 'success', duration: 1000 })
      })
      .catch(err => {
        console.log('err', err);
      })
      }).catch(() => {
        this.$message({
          type: 'info',
          message: '取消输入'
        });
      });
    },
    refundCancel(orderinfo) {
      post(this.serverModelName, 'AdminCancelRefund', { id: orderinfo.id })
      .then(() => {
        this.getData();
        this.$message({ message: '取消成功', type: 'success', duration: 1000 })
      })
      .catch(err => {
        console.log('err', err);
      })
    },
    initpath() {
      const meta = this.$route.meta
      console.log('meta', meta)
      this.ordertype = meta.ordertype
      if (meta.ordertype != null) {
        this.search = { status: meta.ordertype }
        util.filterField(this.fieldList, this.searchFieldList, false, 'id', 'pay_id', 'itemname', 'member_track_admin', 'shipment_num', 'client_name', 'client_phone', 'member_name', 'member_account', 'order_time', 'pay_time');
      } else {
        this.search = { }
        util.filterField(this.fieldList, this.searchFieldList, false, 'id', 'pay_id', 'itemname', 'member_track_admin', 'shipment_num', 'status', 'client_name', 'client_phone', 'member_name', 'member_account', 'order_time', 'pay_time');
      }

      // if (meta.operWidth != null) {
      //   this.operWidth = meta.operWidth
      // } else {
      //   this.operWidth = '200px';
      // }
      if (model.user.limit_show_order) {
        this.search.member_track_admin = window.localStorage.getItem('uid')
        this.searchFieldList.forEach((item, index) => {
          if (item.name === 'member_track_admin') {
            this.searchFieldList.splice(index, 1)
          }
        })
      }
    }
  },

  created() {
    console.log('created')
    // 初始化弹出对话框数据
    this.fieldList.forEach(item => {
      if (item.changeable) {
        this.$set(this.dialogdata, item.name, undefined)
      }
      if (item.name === 'member_track_admin') {
        item.selectList = model.user.adminlist
      }
    })
    this.pagesize = 50;
    this.initpath();
     // 初始化搜索相关数据

    // 初始化表格需要显示的字段
    util.filterField(this.fieldList, this.showfieldList, true, 'itemid', 'is_sync_shipnum', 'itempic', 'idnumpic1', 'idnumpic2', 'client_close_info', 'close_info',"member_track_admin_name");
    util.filterField(this.fieldList, this.exportFiledList, true);
    // 获取数据
    this.getData();
  }
}
</script>

<style>
.idnumpic{
  max-width: 100px;
  height: auto;
  max-height: 100px;
}

.order_cancel{
   width: 150px;
   line-height: 30px;
    padding: 0 0;
    height: 30px;
    text-align: center;
      display: inline-block;
    background-color: green; 
    color: white;
}

.order_cancel:hover{
      /* width: 50%;*/
    background-color: green; 
    color: white;
}

.order_sure{
      width: 150px;
      line-height: 30px;
    padding: 0 0;
    height: 30px;
    text-align: center;
      display: inline-block;
     background-color: red; 
    color: white;
}

.order_sure:hover{
      
      background-color: red; 
    color: white;
}

.pic{
      max-width:140px;
    max-height: 50px;
}
</style>
