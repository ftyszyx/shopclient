<template>
    <div>
        <common-search :search="search" :searchFieldList="searchFieldList" v-on:search="searchClick"></common-search>
        <!-- 表格  -->
        <common-table ref="tablebox" :showfieldList="showfieldList" :dataList="dataList" v-on:sort="sort">
            <template slot="topbtn">
               <button @click="exportSelctShow=true" class="button-common">导出</button>
            </template>
           <template slot="rowbox" slot-scope="slotProps">
                 <td :key="field.name" v-for="field in showfieldList" >
                   <template v-if="field.name=='order_info'">
                    <div>订单号：{{slotProps.value.id}}</div>
                    <div>下单时间：{{formatTime(slotProps.value.order_time)}}</div>
                    <div v-if="slotProps.value.pay_time>0">支付时间：{{formatTime(slotProps.value.pay_time)}}</div>
                    <div v-if="slotProps.value.close_time>0">关闭时间：{{formatTime(slotProps.value.close_time)}}</div>
                  </template>
                  <template v-if="field.name=='item_info'">
                    <div >
                      <img style=" max-width: 150px;max-height: 50px;" :src="slotProps.value.item_info.pic"><img>
                      <div style="display: inline-block;">
                      <div>{{slotProps.value.item_info.name}}</div>
                      <div>规格：{{slotProps.value.item_info.specname}}</div>
                      <div>数量：{{slotProps.value.item_info.num}}</div>
                      </div>
                    </div>
                  </template>
                  <template v-else-if="field.name==='client_col'">
                    <div>
                      <div>会员名:{{slotProps.value.member_name}}</div>
                      <div>收件人手机:{{slotProps.value.client_phone}}</div>
                      <div>收件人姓名:{{slotProps.value.client_name}}</div>
                      <div>收件人地址:{{slotProps.value.client_address}}</div>
                      <div>收件人证件照:</div>
                      <div v-if="slotProps.value.idnumpic1||slotProps.value.idnumpic2">
                        <img class="idnumpic" :src="slotProps.value.idnumpic1">
                        <img class="idnumpic" :src="slotProps.value.idnumpic2">
                      </div>
                      <div>身份证号:{{slotProps.value.idnum}}</div>
                      <div>物流单号:{{slotProps.value.shipment_num}}</div>
                    </div>
                  </template>
                    
                  <template v-else-if="field.name==='note_col'">
                    <div>
                      <div>买家备注:{{slotProps.value.client_info}}</div>
                      <div>卖家备注:{{slotProps.value.client_info}}</div>
                       <template  v-if="slotProps.value.status==global.orderStatusCloseValue">
                          <div>关闭类型:{{getSelectName(slotProps.value.close_type,global.orderCloseStatus)}}</div>
                          <div>卖家关闭备注:{{slotProps.value.close_info}}</div>
                       </template>
                    </div>
                  </template>
                  <template v-else>
                         <common-td :field="field" :value="slotProps.value[field.name]"></common-td>
                  </template>
                </td>
            </template>
            <template slot="rowbtn" slot-scope="slotProps">
                <a class="button-common" v-if="slotProps.value.status===global.OrderStatusWaitcheckValue" @click.stop="checkOrder(slotProps.value)">支付审核</a>
                <a class="button-common"  v-if="slotProps.value.status===global.OrderStatusWaitSendValue" @click.stop="exportErp(slotProps.value)">导出到ERP</a>
                 <a class="button-common" @click.stop="closeOrder(slotProps.value)">关闭订单</a>
                 <a class="button-common"  v-if="slotProps.value.status===global.orderStatusRefundValue" @click.stop="refund(slotProps.value)">确认退款</a>
                 <a class="button-common" @click.stop="edit(slotProps.value)">修改</a>
            </template>
        </common-table>
        <!-- 分页 -->
        <el-pagination
                @size-change="handleSizeChange"
                @current-change="handleCurrentChange"
                :current-page="curpage"
                :page-sizes="[10, 20, 30, 40]"
                :page-size="pagesize"
                layout="total,sizes, prev, pager, next"
                :total="totalsize">
        </el-pagination>
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
            :dialogdata="{'export':1}" 
            v-on:sure="exportErpSure">
        </add-dialog>
          <div v-if="showConfirmPanel===true" class="dialog-mask"  @click="showConfirmPanel=false">
            <div class="dialog"  style="width:400px;"  @click.stop>
                <div class="header">
                    <span class="title">审核订单</span>
                    <span class="close" @click="showConfirmPanel=false">x</span>
                </div>
                <div class="content">
                   <a class="button-common order_sure" @click.stop="checkOrderOK()">支付审核通过</a>
                   <a class="button-common order_cancel" @click.stop="checkOrderNO()">未支付</a>
                </div>
            </div>
        </div>
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
import { post } from 'common/api'

export default{
  mixins: [myMixin],
  data() {
    return {
      dataList: model[this.modelName].list, // 用户列表
      fieldList: model[this.modelName].fieldList, // 字段列表
      exportFiledList: [],
      dialogShow: false,
      erpExportPanel: false,
      erpExportSendFlag: true, // 是不是导出后变成已发货
      erpExportids: [],
      showConfirmPanel: false,
      dialogdata: {},
      checkorderid: '',
      exportSelctShow: false,
      dialogtitle: ''
    }
  },
  watch: {
    '$route'() {
      this.initpath();
      this.getData();
      this.$forceUpdate();
    }
  },
  components: {
    AddDialog,
    CommonTd,
    ExportSelect,
    CommonTable,
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
      this.erpExportPanel = true;
      this.erpExportids = [value.id]
    },
    checkOrder(value) {
      this.checkorderid = value.id
      this.showConfirmPanel = true
    },
    checkOrderOK() {
      post(this.serverModelName, 'CheckPayOk', { id: this.checkorderid })
        .then(() => {
          this.getData();
          this.$message({ message: '审核成功', type: 'success', duration: 1000 })

          this.showConfirmPanel = false
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
    closeOrder(value) {
      post(this.serverModelName, 'edit', changedata)
      .then(() => {
        this.dialogShow = false;
        this.getData();
        this.$message({ message: '修改成功', type: 'success', duration: 1000 })
      })
      .catch(err => {
        console.log('err', err);
      })
    },
    refund(value) {
      post(this.serverModelName, 'edit', changedata)
      .then(() => {
        this.dialogShow = false;
        this.getData();
        this.$message({ message: '修改成功', type: 'success', duration: 1000 })
      })
      .catch(err => {
        console.log('err', err);
      })
    },
    initpath() {
      const meta = this.$route.meta
      console.log('meta', meta)
      if (meta.ordertype != null) {
        this.search = { status: meta.ordertype }
        util.filterField(this.fieldList, this.searchFieldList, false, 'id', 'shipment_num');
      } else {
        util.filterField(this.fieldList, this.searchFieldList, false, 'id', 'shipment_num', 'status');
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
    })

    this.initpath();
     // 初始化搜索相关数据

    // 初始化表格需要显示的字段
    util.filterField(this.fieldList, this.showfieldList, false, 'order_info', 'item_info', 'price', 'client_col', 'status', 'note_col');
    util.filterField(this.fieldList, this.exportFiledList, true, 'item_info', 'user_id', 'client_info', 'price', 'client_col', 'note_col', 'sell_info', 'close_info', 'client_close_info');
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
</style>
