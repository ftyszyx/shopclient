<template>
    <div>
        <common-search :search="search" :searchFieldList="searchFieldList" v-on:search="searchClick"></common-search>
        <!-- 表格  -->
        <common-table :showoper="false" ref="tablebox" :showfieldList="showfieldList" :dataList="dataList" v-on:sort="sort">
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
    
    </div>
</template>

<script>
import model from 'src/model/index.js'
import util from 'common/utils'
import myMixin from 'common/mixin/admin.js'
import CommonSearch from 'common/components/common_searchbox'
import CommonTable from 'common/components/common_table'
export default{
  mixins: [myMixin],
  data() {
    return {
      dataList: model[this.modelName].list, // 用户列表
      fieldList: model[this.modelName].fieldList // 字段列表
    //   dialogShow: false,
    //   dialogdata: {},
    //   dialogtitle: ''
    }
  },
  watch: {
  },
  components: {
    CommonTable,
    CommonSearch
  },
  props: {
    serverModelName: {// 服务器对应的control名
      type: String,
      default: 'paycode'
    },
    modelName: {// 本地对应的模块名
      type: String,
      default: 'paycode'
    }
  },
  methods: {
  },

  created() {
    // 初始化弹出对话框数据
    this.fieldList.forEach(item => {
      // if (item.name === 'user_group') {
      //   item.selectList = model.userGroup.list
      // }
      if (item.changeable) {
        this.$set(this.dialogdata, item.name, undefined)
      }
    })
    this.pagesize = 50;
     // 初始化搜索相关数据
    util.filterField(this.fieldList, this.searchFieldList, false, 'id', 'build_time', 'order_list');
    // 初始化表格需要显示的字段
    util.filterField(this.fieldList, this.showfieldList, true, 'user_id');
    // 获取数据
    this.getData();
  }
}
</script>

<style scoped>



</style>
