<template>
<div>
   <common-search :search="search" :searchFieldList="searchFieldList" v-on:search="searchClick"></common-search>
  <!-- 表格  -->
    <common-table ref="tablebox" :showoper="false" :showfieldList="showfieldList" :dataList="dataList" v-on:sort="sort">
            
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

    <export-select v-if="exportSelctShow" templeName="instoreLog" v-on:close="exportSelctShow=false" v-on:sure="exportCSV" :filedList="exportFiledList"></export-select>
  
</div>
</template>

<script>
import model from 'src/model'
import util from 'common/utils'
import { post } from 'common/api'
import conf from 'src/config.js'
import ExportSelect from 'views/erp/sell/exportselect'
import CommonSearch from 'common/components/common_searchbox'
import CommonTable from 'common/components/common_table'
import myMixin from 'common/mixin/admin.js'
export default{
  mixins: [myMixin],
  data() {
    return {
      dataList: model[this.modelName].list, // 用户列表
      fieldList: model[this.modelName].fieldList,
      dialogShow: false,
      dialogdata: {},
      dialogtitle: '',
      exportSelctShow: false,
      exportFiledList: []
    }
  },
  props: {
    serverModelName: {// 服务器对应的control名
      type: String,
      default: 'in_store_log'
    },
    modelName: {// 本地对应的模块名
      type: String,
      default: 'inStoreLog'
    }
  },
  components: {
    ExportSelect,
    CommonTable,
    CommonSearch
  },
  methods: {
    exportCSV(selectList) {
      const search = this.getSearch(this.searchMake);
      const exportNameList = [];
      const exportHeadList = [];
      selectList.forEach(item => {
        exportNameList.push(item.name);
        exportHeadList.push(item.title);
      })
      post(modelname, 'exportCsv', { search, headlist: exportHeadList, namelist: exportNameList, filename: 'instore' })
      .then(() => {
        window.location.href = conf.baseURL + '/sell/all';
      })
      .catch(error => {
        console.log('error', error);
      });
    },
    exportCSVTotal() {
      const search = this.getSearch(this.searchMake);
      post(modelname, 'exportCsv', { search, filename: 'instoreTotal', type: 'total' })
      .then(() => {
        window.location.href = conf.baseURL + '/sell/all';
      })
      .catch(error => {
        console.log('error', error);
      });
    },
    searchMake(value, keyname) {
      if (keyname === 'item_type') {
        return value[value.length - 1]
      } else if (keyname === 'build_time') {
        return util.getTimeSearch(value)
      }
      return false;
    }
  },

  created() {
    // 初始化搜索相关数据
    util.filterField(this.fieldList, this.searchFieldList, true, 'id', 'itemid', 'store_name', 'before_num', 'after_num', 'change_num');

    // 初始化弹出对话框数据
    this.fieldList.forEach(item => {
      if (item.name === 'store_id') {
        item.selectList = model.store.list
      }
      if (item.changeable) {
        this.$set(this.dialogdata, item.name, undefined)
      }
    })
    // 初始化表格需要显示的字段
    util.filterField(this.fieldList, this.showfieldList, true, 'itemid', 'store_id');
    util.filterField(this.fieldList, this.exportFiledList, true, 'itemid', 'store_id');

    // 获取数据
    this.getData();
  }
}
</script>

<style scoped>



</style>
