<template>
    <div>
        <common-search v-if="showSearch" :search="search" :searchFieldList="searchFieldList" v-on:search="searchClick"></common-search>
    
       <div  class="tablebox">
          <div class="btnbox">
             <el-upload v-if="showImport" 
             class="upload-box"
              :action="uploadUrl" 
              withCredentials 
              :show-file-list="false"
                name="file"  
                :before-upload="beoreupload"
               :on-success="handleSuccess"
               :on-error="handleErr">
                  <button class="button-common">导入</button>
                </el-upload>
                <el-upload v-if="showChangeShipnum" class="upload-box" 
                  :action="changeShipnumUrl" 
                  withCredentials 
                  :show-file-list="false" 
                  :before-upload="beoreupload"
                  name="file"  
                  :on-success="changeShipnumOk"
                  :on-error="handleErr">
                  <button class="button-common">批量修改物流</button>
                </el-upload>
                <button v-if="showCheck&&authDic.Sell_checkOk.auth" @click="check()" class="button-common">审核</button>
                <button v-if="showDel&&authDic.Sell_del.auth" @click="del()" class="button-common">废弃</button>
                <button v-if="showCheckBack&&authDic.Sell_checkNo.auth" @click="checkBack()" class="button-common">反审核</button>
                
                <a v-if="showImport" href="http://img.bqmarket.com/selldemo20180411.csv" class="button-common">导入模板下载</a>
                
                <button v-if="showExport&&authDic.Sell_exportCsv.auth" @click="exportSelctShow=true" class="button-common">导出</button>
                <button v-if="showExport&&authDic.Sell_exportCsv.auth" @click="exportTotalItemCSV()" class="button-common">导出商品明细</button>
                
                <button v-if="showSplit&&authDic.Sell_splitAllOrder.auth" @click="splitAll()" class="button-common">拆单(所有)</button>
                <button v-if="showMerge&&authDic.Sell_mergeOrder.auth" @click="merge()" class="button-common">合单(勾选2个)</button>
                <button v-if="showSyncShop" @click="syncShop()" class="button-common">同步商城(勾选项)</button>
                <button v-if="showSyncShop" @click="syncAllShop()" class="button-common">同步商城(全部)</button>
                <button v-if="showSyncLogistics" @click="syncLogistics()" class="button-common">同步物流(勾选项)</button>
                <button v-if="showSyncLogistics" @click="syncAllLogistics()" class="button-common">同步物流(全部)</button>
                <slot name="button-box"></slot>
           </div>
         <el-table ref="table_box"  highlight-current-row  border max-height="600" :data="dataList" @row-dblclick="detail"  @sort-change="sortChange">
            <el-table-column  v-show="showCheckBox" type="selection" width="55"></el-table-column>
            <el-table-column :prop="field.name" :sortable="field.sort!=null?'custom':false" resizable show-overflow-tooltip :fixed="field.name==='id'||field.name==='item_name'||field.name==='shop_sync_flag'||field.name==='user_info'||field.name==='sell_vip_type'||field.name==='num'" :label="field.title" :key="field.name" v-for="field in showfieldList"  :width="field.width||100">
                <template slot-scope="scope">
                  <template v-if="field.name==='shop_sync_flag'">
                      <i class="el-icon-success" style="color: red;" v-if='scope.row[field.name]===1'></i>
                      <i class="el-icon-error" v-if='scope.row[field.name]===0'></i>
                  </template>
                  <template v-else-if="field.selectList">
                        {{getSelectName(scope.row[field.name],field.selectList)}}
                    </template>
                    <template v-else-if="field.type==='time'">
                        {{formatTime(scope.row[field.name])}}
                    </template>
                    
                    <template v-else>
                        {{scope.row[field.name]}}
                    </template>
                </template>
              </el-table-column>
              <el-table-column  v-if="showOper" fixed="right" label="操作"  :width="operWidth">
                  <template slot-scope="scope">
                    <div> 
                        <a  class="button-table-td" v-show="showDel&&authDic.Sell_del.auth" @click.stop="del(scope.row)">废除</a>
                        <a  class="button-table-td" v-show="showEdit&&authDic.Sell_edit.auth" @click.stop="edit(scope.row)">修改</a>
                        <a  class="button-table-td" v-show="showCheck&&authDic.Sell_checkOk.auth" @click.stop="check(scope.row)">审核</a>
                        <a  class="button-table-td" v-show="showSlect" @click.stop="selectOne(scope.row)">选择</a>
                        <a  class="button-table-td" v-show="showCheckBack&&authDic.Sell_checkNo.auth" @click.stop="checkBack(scope.row)">反审核</a>
                        <a  class="button-table-td" v-if="showSyncShop" @click="syncShop(scope.row)" >同步商城</a>
                        <a  class="button-table-td" v-if="showSyncLogistics" @click="syncLogistics(scope.row)" >同步物流</a>
                        <a  class="button-table-td" v-if="showRefrshLogistics" @click="RefreshLogistics(scope.row)" >刷新物流</a>
                        <a  class="button-table-td" v-show="showSplit&&(scope.row.logistics_merge)&&authDic.Sell_splitOrder.auth" @click.stop="split(scope.row)">拆单</a>
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
                :page-sizes="[20, 50, 100,200,500]"
                :page-size="pagesize"
                layout="total,sizes, prev, pager, next"
                :total="totalsize">
        </el-pagination>
        <!-- 修改信息 -->
         <add-dialog 
            v-if="dialogShow"
            :title="dialogtitle"
            :fieldList="fieldList" 
            :dialogdata="dialogdata" 
            v-on:close="dialogShow=false" 
            v-on:sure="dialogClick">
        </add-dialog>
        <add-dialog 
            v-if="syncshopPanel"
            title="选择导出商店"
            :fieldList="[ { name: 'shop', title: '商店', selectList: shopList,changeable:true},]" 
            :dialogdata="{'shop':'6'}" 
            v-on:close="syncshopPanel=false" 
            v-on:sure="syncshopSure">
        </add-dialog>
        <!-- 选择仓库 -->
        <select-check-store :storeList="allStore" v-if="checkPanelShow" v-on:close="checkPanelShow=false" v-on:sure="checkSure">

        </select-check-store>
        <!-- 商品详情 -->
         <sell-info  v-if="dialogDetailShow" v-on:close="dialogDetailShow=false" :info="detailInfo"></sell-info>
         <export-select v-if="exportSelctShow" templeName="sell" v-on:close="exportSelctShow=false" v-on:sure="exportCSV" :filedList="exportFiledList"></export-select>
    </div>
</template>

<script>
import model from 'src/model'
import util from 'common/utils'
import { post } from 'common/api'
import myMixin from 'common/mixin/admin.js'
import conf from 'src/config.js'
import SellInfo from 'views/erp/sell/sellinfo'
import ExportSelect from 'views/erp/sell/exportselect'
import SelectCheckStore from 'views/erp/sell/selectcheckstore'
import AddDialog from 'src/views/common/common_dialog';
import CommonSearch from 'common/components/common_searchbox'
import CommonTable from 'common/components/common_table'
import CommonTd from 'common/components/common_td'

export default{
  name: 'sell',
  mixins: [myMixin],
  data() {
    return {
      dataList: model[this.modelName].list, // 用户列表
      fieldList: model[this.modelName].fieldList, // 字段列表
      dialogShow: false,
      dialogDetailShow: false,
      exportSelctShow: false,
      exportFiledList: [],
      shopList: model.shop.list,
      sellOutShow: false, // 显示配货页面
      detailInfo: {},
      dialogdata: {},
      syncshopPanel: false,
      pagesize: 50,
      checkUserList: [],
      uploadUrl: conf.baseURL + '/sell/importData',
      changeShipnumUrl: conf.baseURL + '/sell/importChangeShipnum',
      dialogtitle: '',
      checkPanelShow: false,
      allStore: model.store.list,
      syncAll: false,
      checkItem: null//

    }
  },
  components: {
    SellInfo,
    ExportSelect,
    AddDialog,
    CommonTd,
    CommonTable,
    CommonSearch,
    SelectCheckStore
  },
  props: {
    serverModelName: {// 服务器对应的control名
      type: String,
      default: 'sell'
    },
    useetable: { type: Boolean, default: false }, // 用etable
    modelName: { type: String, default: 'sell' },
    showExport: { type: Boolean, default: false }, // 是否显示导出按键
    showImport: { type: Boolean, default: false }, // 是否显示导入按键
    showChangeShipnum: { type: Boolean, default: false }, // 是否显示导入按键
    showCheck: { type: Boolean, default: false }, // 是否显示审核按键
    showDel: { type: Boolean, default: false }, // 是否显示删除按键
    showEdit: { type: Boolean, default: false }, // 是否显示编辑按键
    showSplit: { type: Boolean, default: false }, // 是否显示拆单按键
    showSyncShop: { type: Boolean, default: false }, // 是否显示同步到商城
    showSyncLogistics: { type: Boolean, default: false }, // 是否显示同步到商城
    showRefrshLogistics: { type: Boolean, default: false }, // 是否显示刷新物流
    showMerge: { type: Boolean, default: false }, // 是否显示合单按键
    showCheckBack: { type: Boolean, default: false }, // 是否显示反审核按键
    searchConditon: { type: Object, default: null },

    operWidth: { type: String, default: '250' },
    showSearchFiled: { // 显示的搜索字段
      type: Array,
      default() {
        return ['id', 'shop_order', 'item_name', 'store_id', 'item_short_name', 'status', 'num', 'supply_source',
          'customer_account', 'shop_id', 'assign_order', 'customer_name', 'user_phone', 'logistics', 'track_man', 'pay_time', 'order_time'];
      }
    },
    showTableFiled: { // 显示的表格字段
      type: Array,
      default() {
        // return ['item_detail', 'status', 'order_info', 'address_info', 'track_man', 'user_info'];
        return ['id', 'item_name',
          'num', 'status', 'shop_name', 'customer_account', 'unit_price', 'pay_money', 'order_time', 'pay_time',
          'send_user_name', 'send_user_phone', 'customer_addr',
          'customer_name', 'track_man', 'shop_order', 'pay_id', 'supply_source',
          'user_info', 'sell_vip_type']
      }
    },
    showSearch: { type: Boolean, default: true }, // 是否显示搜索按键
    showSlect: { type: Boolean, default: false }, // 是否显示选择按键
    showCheckBox: { type: Boolean, default: false }, // 是否显示单选框
    initgetdata: { type: Boolean, default: true }, // 是否开始就获取数据
    showOper: { type: Boolean, default: false }// 是否显示操作栏
  },
  watch: {
    searchConditon() {
      console.log('search change');
      // this.getData();
    }
  },
  methods: {

    beoreupload() {
      model.app.loading ++;
    },
    split(item) {
      post(this.serverModelName, 'splitOrder', { id: item.id })
      .then(() => {
        this.$message({ message: '拆单成功', type: 'success', duration: 1000 })
        this.getData();
      })
      .catch(error => {
        console.log('error', error);
      });
    },
    splitAll() {
      post(this.serverModelName, 'splitAllOrder')
      .then(() => {
        this.$message({ message: '拆单成功', type: 'success', duration: 1000 })
        this.getData();
      })
      .catch(error => {
        console.log('error', error);
      });
    },
    gettableSelct(cb) {
// /console.log('selection', this.$refs.table_box);
      const selection = this.$refs.table_box.selection
      // console.log('selection', selection);
      const checkArr = []
      selection.forEach(item => {
        checkArr.push(item.id);
        if (cb) { cb(item) }
      })
      return checkArr;
    },
    merge() {
      const merglist = this.gettableSelct()
      if (merglist.length !== 2) {
        this.$message({ message: '一次只能合并两个单', type: 'error', duration: 1000 })
        return;
      }
      post(this.serverModelName, 'mergeOrder', { id: merglist })
      .then(() => {
        this.$message({ message: '合单成功', type: 'success', duration: 1000 })
        this.getData();
      })
      .catch(error => {
        console.log('error', error);
      });
    },
    // 审核
    check(item) {
      this.checkItem = item;
      this.checkPanelShow = true;
    },
    checkSure(checkStoreId) {
      let checkarr = []
      if (this.checkItem) {
        checkarr.push(this.checkItem.id);
      } else {
        checkarr = this.gettableSelct();
      }
      if (!checkStoreId) {
        this.$message({ message: '请选择仓库', type: 'error', duration: 1000 })
        return;
      }
      post(this.serverModelName, 'checkOk', { id: checkarr, store_id: checkStoreId })
      .then(() => {
        this.$message({ message: '审核成功', type: 'success', duration: 1000 })
        this.checkPanelShow = false;
        this.getData();
      })
      .catch(error => {
        console.log('error', error);
      });
    },
    selectOne(value) {
      this.$emit('select', value);
    },
    detail(value) {
      this.detailInfo = value;
      this.dialogDetailShow = true;
    },
    del(item) {
      let checkarr = []
      if (item) {
        checkarr = [item.id];
      } else {
        checkarr = this.gettableSelct();
      }

      this.$prompt('请输入废弃原因', '废弃', {
        confirmButtonText: '确定',
        cancelButtonText: '取消'
      }).then(({ value }) => {
        if (value === '') {
          this.$message({ message: '废弃原因不能为空', type: 'error', duration: 1000 })
          return;
        }
        post(this.serverModelName, 'del', { id: checkarr, del_info: value })
        .then(() => {
          this.$message({ message: '废除成功', type: 'success', duration: 1000 })
          this.getData();
        })
        .catch(error => {
          console.log('error', error);
        });
      })
    },
    exportCSV(selectList) {
      const search = this.getSearch();
      console.log('export', search);
      const exportNameList = [];
      const exportHeadList = [];
      selectList.forEach(item => {
        exportNameList.push(item.name);
        exportHeadList.push(item.title);
      })
      post(this.serverModelName, 'exportCsv', { search, headlist: exportHeadList, namelist: exportNameList, filename: 'sell' })
      .then(() => {
        // this.$message({ message: '废除成功', type: 'success', duration: 1000 })
        window.location.href = conf.baseURL + '/sell/all';
      })
      .catch(error => {
        console.log('error', error);
      });
    },
    exportTotalItemCSV() {
      const search = this.getSearch();
      console.log('export', search);
      post(this.serverModelName, 'exportCsv', { search, filename: 'sellitemTotal', type: 'item_total' })
      .then(() => {
        window.location.href = conf.baseURL + '/sell/all';
      })
      .catch(error => {
        console.log('error', error);
      });
    },
    changeShipnumOk(resp) {
      model.app.loading --;
      if (resp.code === '1') {
        this.$message({ message: '批量修改成功', type: 'success', duration: 1000 })
        this.getData();
      } else {
        this.$message({ message: '导入失败:' + resp.message, type: 'success', duration: 1000 })
      }
    },
    handleSuccess(resp) {
      console.log('get resp', resp)
      model.app.loading --;
      if (resp.code === '1') {
        this.$message({ message: '导入成功', type: 'success', duration: 1000 })
        this.getData();
      } else {
        this.$message({ message: '导入失败:' + resp.message, type: 'success', duration: 1000 })
      }
    },
    handleErr(err) {
      model.app.loading --;
      console.log('handleErr', err)
      this.$message({ message: '导入失败', type: 'error', duration: 1000 });
    },
    dialogClick(nowdata) {
      console.log('edit nowdata', nowdata);
      console.log('edit before', this.dialogdata);
      const olddata = Object.assign({}, this.dialogdata);
      let changedata = Object.assign({}, nowdata);
      changedata.order_time = changedata.order_time.valueOf() / 1000
      changedata.pay_time = changedata.pay_time.valueOf() / 1000
      changedata = util.getChange(changedata, olddata);
      changedata.id = olddata.id
      this.sendEdit(changedata)
    },
    assign() {
      this.sellOutShow = true;
      this.dialogtitle = '配货';
    },
    // 反审核
    checkBack(item) {
      let checkarr = []
      if (!item) {
        checkarr = this.gettableSelct();
      } else {
        checkarr = [item.id];
      }
      post(this.serverModelName, 'checkNo', { id: checkarr })
      .then(() => {
        this.$message({ message: '反审核成功', type: 'success', duration: 1000 });
        this.getData();
      })
      .catch(error => {
        console.log('error', error);
      });
    },

    sortChange(column) {
      console.log('sortChange', column);
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
    syncShop(item) {
      this.syncshopPanel = true
      this.checkItem = item;
      this.syncAll = false;
    },
    syncAllShop(item) {
      this.syncshopPanel = true
      this.checkItem = item;
      this.syncAll = true;
    },
    syncLogistics(item) {
      this.syncAll = false;
      this.syncLogisticsSend(item)
    },
    syncAllLogistics() {
      this.syncAll = true;
      this.syncLogisticsSend()
    },
    syncLogisticsSend(checkItem) {
      let checkarr = {}
      if (!checkItem) {
        checkarr = this.gettableSelct();
      } else {
        checkarr = [checkItem.id];
      }
      let search = this.getSearch(this.searchFilter);
      if (this.syncAll) {
        checkarr = undefined;
      } else {
        search = undefined;
      }

      post(this.serverModelName, 'syncOrderShipNum', { id: checkarr, search })
      .then(data => {
        console.log('data', data)
        this.$message({
          message: '成功',
          type: 'success', duration: 2000 });
        this.getData();
      })
      .catch(error => {
        console.log('error', error);
      });
    },
    RefreshLogistics(item) {
      post(this.serverModelName, 'RefreshLogistics', { id: item.id })
      .then(data => {
        console.log('data', data)
        this.$message({
          message: '成功',
          type: 'success', duration: 2000 });
        this.getData();
      })
      .catch(error => {
        console.log('error', error);
      });
    },
    syncshopSure(changedata) {
      let search = this.getSearch(this.searchFilter);
      let checkarr = {}
      if (!this.checkItem) {
        checkarr = this.gettableSelct();
      } else {
        checkarr = [this.checkItem.id];
      }
      if (this.syncAll) {
        checkarr = undefined;
      } else {
        search = undefined;
      }
      post(this.serverModelName, 'syncOrderShipNum', { shop_id: changedata.shop, id: checkarr, search })
      .then(data => {
        console.log('data', data)
        this.$message({
          // dangerouslyUseHTMLString: true,
          // message: '<p style="word-break: break-all;">以下物流号同步成功:<br/>' + showhtml + '</p>',
          message: '成功',
          type: 'success', duration: 2000 });
        this.syncshopPanel = false
        this.getData();
      })
      .catch(error => {
        console.log('error', error);
      });
    }

  },


  created() {
    // 初始化搜索相关数据
    util.filterField(this.fieldList, this.searchFieldList, false, this.showSearchFiled);

    // 初始化表格需要显示的字段
    util.filterField(this.fieldList, this.showfieldList, false, this.showTableFiled);

    // 所有可以导出的字段
    util.filterField(this.fieldList, this.exportFiledList, true, 'shop_id', 'store_id', 'build_user', 'check_user', 'item_id', 'item_detail', 'address_info', 'order_info');



    // 初始化弹出对话框数据
    this.fieldList.forEach(item => {
      if (item.name === 'store_id') {
        item.selectList = model.store.list;
      } else if (item.name === 'shop_id') {
        item.selectList = model.shop.list;
      }
      if (item.changeable) {
        if (item.name === 'track_man') {
          if (model.user.authDic.Sell_updateTrackMan.auth === false) {
            // 没权限
            this.$set(item, 'changeable', false)
            return;
          }
        }
        this.$set(this.dialogdata, item.name, undefined)
      }
    })
    if (this.searchConditon) {
      Object.assign(this.search, this.searchConditon);
    }
    // 获取数据
    if (this.initgetdata) {
      this.getData();
    }
  }
}
</script>

<style scoped>

.upload-box{
  display: inline-block;
}

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

.redtext{
  color: #0072d2;;
}



</style>
