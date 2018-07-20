<template>
<div>
   <common-search :search="search" :searchFieldList="searchFieldList" v-on:search="searchClick"></common-search>
    <!-- 表格  -->
    <common-table ref="tablebox" :showoper="false" :showfieldList="showfieldList" :dataList="dataList" v-on:sort="sort">
        <template slot="topbtn">
            <button @click="exportSelctShow=true" class="button-common">导出</button>
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

    <export-select v-if="exportSelctShow" templeName="storeitem" v-on:close="exportSelctShow=false" v-on:sure="exportCSV" :filedList="exportFiledList"></export-select>
  
</div>
</template>

<script>
import model from 'src/model'
import util from 'common/utils'
import { post } from 'common/api'
import conf from 'src/config.js'
import ExportSelect from 'views/erp/sell/exportselect'
import myMixin from 'common/mixin/admin.js'
import CommonSearch from 'common/components/common_searchbox'
import CommonTable from 'common/components/common_table'
export default{
  mixins: [myMixin],
  data() {
    return {
      dataList: model[this.modelName].list, // 用户列表
      fieldList: model[this.modelName].fieldList, // 字段列表
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
      default: 'store_item'
    },
    modelName: {// 本地对应的模块名
      type: String,
      default: 'storeItem'
    }
  },
  components: {
    CommonTable,
    ExportSelect,
    CommonSearch
  },
  watch: {
  },
  methods: {
    exportCSV(selectList) {
      const search = this.getSearch(this.searchMake);
      console.log('export', search);
      const exportNameList = [];
      const exportHeadList = [];
      // util.filterField(this.fieldList, exportlist, true, 'shop_id', 'item_id', 'id');
      selectList.forEach(item => {
        exportNameList.push(item.name);
        exportHeadList.push(item.title);
      })
      post(this.serverModelName, 'exportCsv', { search, headlist: exportHeadList, namelist: exportNameList, filename: 'storeitem' })
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
    util.filterField(this.fieldList, this.searchFieldList, true, 'id', 'itemid', 'store_name', 'item_type', 'in_sale', 'in_store');

    // 初始化弹出对话框数据
    this.fieldList.forEach(item => {
      if (item.name === 'item_type_id') {
        item.selectList = model.itemType.list
      } else if (item.name === 'store_id') {
        item.selectList = model.store.list
      }
      if (item.changeable) {
        this.$set(this.dialogdata, item.name, undefined)
      }
    })
    // 初始化表格需要显示的字段
    util.filterField(this.fieldList, this.showfieldList, true, 'id', 'itemid', 'store_id', 'item_type_id');
    util.filterField(this.fieldList, this.exportFiledList, true, 'id', 'itemid', 'store_id', 'item_type_id');

    // 获取数据
    this.getData();
  }
}
</script>

<style scoped>



</style>
