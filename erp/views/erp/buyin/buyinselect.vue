<template>
<!-- 选择采购单 -->
<div>
  <common-search :search="search" :searchFieldList="searchFieldList" v-on:search="searchClick"></common-search>
  <common-table ref="tablebox" :showfieldList="showfieldList" :dataList="dataList" v-on:clickRow="detail" v-on:sort="sort"  :showCheck="canOper">
        <template slot="topbtn">
            <button v-show="canOper&&authDic.BuyIn_add.auth" @click="add()" class="button-common">新增</button>
            <button  v-show="canOper&&authDic.BuyIn_checkOk.auth" @click="check()" class="button-common">审核</button>
            <button  v-show="canOper&&authDic.BuyIn_del.auth" @click="del()" class="button-common">废弃</button>
        </template>
        <template slot="rowbtn" slot-scope="slotProps">
                <a class="button-common"  v-show="canOper&&authDic.BuyIn_del.auth" @click.stop="del(slotProps.value)">废弃</a>
                <a class="button-common"  v-show="canOper&&authDic.BuyIn_checkOk.auth" @click.stop="check(slotProps.value)">审核</a>
                <a class="button-common"  v-show="canOper&&authDic.BuyIn_edit.auth" @click.stop="edit(slotProps.value)">修改</a>
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
</div>
</template>

<script>

import model from 'src/model'
import util from 'common/utils'
import myMixin from 'common/mixin/admin.js'
import CommonSearch from 'common/components/common_searchbox'
import AddDialog from 'src/views/common/common_dialog';
import CommonTable from 'common/components/common_table'
export default{
  name: 'BuyinSelect',
  mixins: [myMixin],
  data() {
    return {
      dataList: model[this.modelName].list, // 用户列表
      fieldList: model[this.modelName].fieldList, // 字段列表
      userList: [] // 可选 的用户列表
    }
  },
  watch: {
  },
  components: {
    AddDialog,
    CommonTable,
    CommonSearch
  },
  props: {
    canOper: {// 是否是可以操作
      type: Boolean,
      default: false
    },
    serverModelName: {// 服务器对应的control名
      type: String,
      default: 'buy_in'
    },
    modelName: {// 本地对应的模块名
      type: String,
      default: 'buyIn'
    }
  },

  methods: {
    check(info) {
      this.$emit('check', info);
    },
    add() {
      this.$emit('add');
    },
    detail(info) {
      this.$emit('detail', info);
    }, edit(info) {
      this.$emit('edit', info);
    }
  },

  created() {
    // 初始化搜索相关数据
    this.fieldList.forEach(item => {
      if (item.name === 'store_id') {
        item.selectList = model.store.list
      }
    })
    util.filterField(this.fieldList, this.searchFieldList, true, 'build_user', 'check_user', 'store_name', 'info', 'item_info', 'build_time');

    // 初始化表格需要显示的字段
    util.filterField(this.fieldList, this.showfieldList, true, 'build_user', 'check_user', 'store_id', 'item_info');
    // 获取数据
    this.search = { close_status: 0 };
    this.getData();
  }
}
</script>

<style scoped>


</style>
