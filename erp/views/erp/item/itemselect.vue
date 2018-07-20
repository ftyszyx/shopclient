<!-- 选择物品 -->
<template>
<div>
  <!-- 搜索区 -->
  <common-search :search="search" :searchFieldList="searchFieldList" v-on:search="searchClick"></common-search>
  <!-- 表格  -->
  <common-table ref="tablebox" :showCheck="showCheck" :showfieldList="showfieldList" :dataList="dataList" :showoper="canOper" v-on:sort="sort">
      <template slot="topbtn">
          <button  @click="add()" v-show="canOper&&authDic.Item_add.auth"  class="button-common">新增</button>
      </template>
      <template slot="rowbtn" slot-scope="slotProps">
            <a class="button-common" v-show="canOper&&authDic.Item_del.auth"   @click.stop="del(slotProps.value)">作废</a>
            <a class="button-common" v-show="canOper&&authDic.Item_edit.auth" @click.stop="edit(slotProps.value)">修改</a>
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
</div>
</template>

<script>
import model from 'src/model'
import util from 'common/utils'
import myMixin from 'common/mixin/admin.js'
import CommonSearch from 'common/components/common_searchbox'
import CommonTable from 'common/components/common_table'
export default{
  mixins: [myMixin],
  name: 'itemSelect',
  data() {
    return {
      dataList: model[this.modelName].list, // 用户列表
      fieldList: model[this.modelName].fieldList // 字段列表
    }
  },
  components: {
    CommonTable,
    CommonSearch
  },
  props: {
    serverModelName: {// 服务器对应的control名
      type: String,
      default: 'item'
    },
    modelName: {// 本地对应的模块名
      type: String,
      default: 'item'
    },
    canOper: {// 是否是可以操作
      type: Boolean,
      default: false
    },
    showCheck: {// 是否显示选择
      type: Boolean,
      default: false
    },
    searchConditon: { type: Object, default: null },
    showSearchFiled: { // 显示的搜索字段
      type: Array,
      default() {
        return ['name', 'barcode', 'code', 'type', 'short_name', 'is_del'];
      }
    },
    showTableFiled: { // 显示的表格字段
      type: Array,
      default() {
        return ['name', 'barcode', 'code', 'type', 'short_name', 'build_time', 'check_limit', 'sell_base_num', 'is_del'];
      }
    }
  },
  methods: {

    del(info) {
      this.$alert('是否确认作废' + info.name, '提示', {
        confirmButtonText: '确定',
        closeOnClickModal: true,
        callback: action => {
          if (action !== 'confirm') {
            return;
          }
          this.$emit('del', info);
        }
      });
    },
    add(info) {
      this.$emit('add', info);
    },
    edit(info) {
      this.$emit('edit', info);
    }

  },

  created() {
    this.fieldList.forEach(item => {
      if (item.name === 'type') {
        item.selectList = model.itemType.list
      }
    })
      // 初始化搜索相关数据
    util.filterField(this.fieldList, this.searchFieldList, false, this.showSearchFiled);

    // 初始化表格需要显示的字段
    util.filterField(this.fieldList, this.showfieldList, false, this.showTableFiled);

    if (this.searchConditon) {
      Object.assign(this.search, this.searchConditon);
    }
    this.getData();
  }
}
</script>

<style scoped>



</style>
