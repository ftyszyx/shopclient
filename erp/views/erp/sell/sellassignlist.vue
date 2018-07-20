<template>
    <div>
       <common-search :search="search" :searchFieldList="searchFieldList" v-on:search="searchClick"></common-search>
        <!-- 表格  -->
        <common-table  operwidth="300px"  v-on:clickRow="detail"   ref="tablebox" :showfieldList="showfieldList" :dataList="dataList" v-on:sort="sort">
          
            <template slot="rowbtn" slot-scope="slotProps">
                 <a class="button-common" v-show="authDic.SellAssign_del.auth" @click.stop="del(slotProps.value)">反配货</a>
                            <a class="button-common" @click.stop="exportClick(slotProps.value)">导出</a>
                            <a class="button-common" @click.stop="exportTotalCSV(slotProps.value)">商品汇总</a>
                            <a class="button-common" v-show="authDic.SellAssign_edit.auth" @click.stop="edit(slotProps.value)">修改</a>
            </template>
        </common-table>
        
        <!-- 分页 -->
        <el-pagination
                @size-change="handleSizeChange"
                @current-change="handleCurrentChange"
                :current-page="curpage"
                :page-sizes="[50,100]"
                :page-size="pagesize"
                layout="total,sizes, prev, pager, next"
                :total="totalsize">
        </el-pagination>
        <!-- 编辑页面 -->
        <!-- <sell-out-edit v-if="dialogShow"  :info="dialogdata" v-on:sure="dialogClick" v-on:close="dialogShow=false"> -->

        <!-- </sell-out-edit> -->
        <add-dialog 
          :showfooter="false"
            v-if="detailShow"
            title="订单详情"
            v-on:close="detailShow=false" >
             <template slot="edititembox"  >
               <sell :searchConditon="searchCondition" :showSearch="false" :showOper="false"></sell>
             </template>
         </add-dialog>

           <add-dialog 
            v-if="dialogShow"
            :title="dialogtitle"
            :fieldList="fieldList" 
            :dialogdata="dialogdata" 
            v-on:close="dialogShow=false" 
            v-on:sure="dialogClick">
        </add-dialog>
        <!-- 导出选择 -->
        <export-select v-if="exportSelctShow" templeName="assign"  v-on:close="exportSelctShow=false" v-on:sure="exportCSV" :filedList="exportFiledList"></export-select>

       
    </div>
</template>

<script>
import model from 'src/model'
import util from 'common/utils'
import { post } from 'common/api'
import myMixin from 'common/mixin/admin.js'
import SellInfo from 'views/erp/sell/sellinfo'
import SellOutEdit from 'views/erp/sell/selloutedit'
import Sell from 'views/erp/sell/sell'
import conf from 'src/config.js'
import ExportSelect from 'views/erp/sell/exportselect'
import CommonSearch from 'common/components/common_searchbox'
import CommonTable from 'common/components/common_table'
import AddDialog from 'src/views/common/common_dialog';
export default{
  mixins: [myMixin],
  data() {
    return {
      dataList: model[this.modelName].list, // 用户列表
      fieldList: model[this.modelName].fieldList, // 字段列表
      dialogShow: false,
      dialogdata: {},
      dialogtitle: '',
      pagesize: 50,
      detailShow: false,
      selectOrderList: [],
      searchCondition: {},
      exportFiledList: [],
      curExportInfo: {},
      exportSelctShow: false
    }
  },
  watch: {
    selectOrderList() {
      this.searchCondition.id = ['in', this.selectOrderList];
    }
  },
  components: {
    SellInfo,
    ExportSelect,
    AddDialog,
    SellOutEdit,
    CommonTable,
    CommonSearch,
    Sell
  },
  props: {
    serverModelName: {// 服务器对应的control名
      type: String,
      default: 'sell_assign'
    },
    modelName: {// 本地对应的模块名
      type: String,
      default: 'sellAssign'
    }
  },
  methods: {
    exportClick(value) {
      this.exportSelctShow = true;
      this.curExportInfo = value;
    },
    exportCSV(selectList) {
      const exportNameList = [];
      const exportHeadList = [];
      selectList.forEach(item => {
        exportNameList.push(item.name);
        exportHeadList.push(item.title);
      })
      post(this.serverModelName, 'exportCsv', { search: { 'sell.id': ['in', JSON.parse(this.curExportInfo.order_info)] }, headlist: exportHeadList, namelist: exportNameList, filename: 'sellassign' })
      .then(() => {
        window.location.href = conf.baseURL + '/sell/all';
      })
      .catch(error => {
        console.log('error', error);
      });
    },
    exportTotalCSV(value) {
      post('sell', 'exportCsv', { search: { 'sell.id': ['in', JSON.parse(value.order_info)] }, type: 'item_total', filename: 'sellassignTotal' })
      .then(() => {
        window.location.href = conf.baseURL + '/sell/all';
      })
      .catch(error => {
        console.log('error', error);
      });
    },
    // 废除
    del(item) {
      this.$prompt('请输入废弃原因', '废弃', {
        confirmButtonText: '确定',
        cancelButtonText: '取消'
      }).then(({ value }) => {
        if (value === '') {
          this.$message({ message: '废弃原因不能为空', type: 'error', duration: 1000 })
          return;
        }
        post(this.serverModelName, 'del', { id: item.id, del_info: value })
        .then(() => {
          this.getData();
          this.$message({ message: '废除成功', type: 'success', duration: 1000 })
        })
        .catch(error => {
          console.log('err', error)
        })
      })
    },
    // 详情
    detail(item) {
      this.selectOrderList = JSON.parse(item.order_info);
      this.detailShow = true;
    }
  },

  created() {
    // 初始化搜索相关数据
    util.filterField(this.fieldList, this.searchFieldList, false, 'id', 'close_status', 'order_info', 'store_id');

    // 初始化弹出对话框数据
    this.fieldList.forEach(item => {
      if (item.name === 'store_id') {
        item.selectList = model.store.list;
      }
      if (item.changeable) {
        this.$set(this.dialogdata, item.name, undefined)
      }
    })
    // 初始化表格需要显示的字段
    util.filterField(this.fieldList, this.showfieldList, true, 'order_info', 'close_status', 'build_user', 'store_id');
    // 所有可以导出的字段
    util.filterField(model.sell.fieldList, this.exportFiledList, true, 'shop_id', 'store_id', 'build_user', 'check_user', 'item_id');
    this.search.close_status = 0;
    // 获取数据
    this.getData();
  }
}
</script>

<style scoped>



</style>

