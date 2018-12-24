<template>
    <div>
       <common-search-box :search="search" :searchFieldList="searchFieldList" v-on:search="searchClick"></common-search-box>
        <!-- 表格  -->
        <common-table :showoper="false" ref="tablebox" :showfieldList="showfieldList" :dataList="dataList" v-on:sort="sort">
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
import model from 'src/model/index.js'
import util from 'common/utils'
import CommonTable from 'common/components/common_table'
import CommonSearchBox from 'common/components/common_searchbox'
import myMixin from 'common/mixin/admin.js'
export default{
  mixins: [myMixin],
  data() {
    return {
      dataList: model[this.modelName].list, // 用户列表
      fieldList: model[this.modelName].fieldList, // 字段列表
      moduleList: model.module.list
    }
  },
  watch: {
  },
  components: {
    CommonTable,
    CommonSearchBox
  },
  props: {
    serverModelName: {// 服务器对应的control名
      type: String,
      default: 'log'
    },
    modelName: {// 本地对应的模块名
      type: String,
      default: 'log'
    }
  },
  methods: {
  },

  created() {
    // 初始化搜索相关数据
    util.filterField(this.fieldList, this.searchFieldList, true, 'id', 'link', 'module_name');
    // 初始化弹出对话框数据
    this.fieldList.forEach(item => {
      if (item.changeable) {
        this.$set(this.dialogdata, item.name, undefined)
      }
      if (item.name === 'module_id') {
        item.selectList = model.module.list
      }
    })
    // 初始化表格需要显示的字段
    util.filterField(this.fieldList, this.showfieldList, true, 'id', 'module_id');
    // 获取数据
    this.getData();
  }
}
</script>

<style scoped>

.redrow{
  color: red;
}

.redrow a{
   color: red;
}


.redrow a:hover{
  color: #4a1515;;
}

</style>
