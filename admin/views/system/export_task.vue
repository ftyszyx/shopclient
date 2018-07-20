<template>
    <div>
        <!-- <common-search :search="search" :searchFieldList="searchFieldList" v-on:search="searchClick"></common-search> -->
        <!-- 表格  -->
        <common-table ref="tablebox" :showfieldList="showfieldList" :dataList="dataList" v-on:sort="sort">
            <template slot="rowbox" slot-scope="slotProps">
                 <template v-for="field in showfieldList" >
                     <td :key="field.name">
                        <template v-if="field.name==='path'">
                            <a style="color: #2d2f33;text-decoration: underline;cursor: pointer;" :href="slotProps.value[field.name]">点此下载</a>
                        </template>
                            <template v-else>
                                <common-td   :field="field" :value="slotProps.value[field.name]"></common-td>
                        </template>
                    </td>
                 </template>
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
import model from 'src/model/index.js'
import util from 'common/utils'
import myMixin from 'common/mixin/admin.js'
import CommonTd from 'common/components/common_td'
// import CommonSearch from 'common/components/common_searchbox'
import CommonTable from 'common/components/common_table'
export default{
  mixins: [myMixin],
  data() {
    return {
      dataList: model[this.modelName].list, // 用户列表
      fieldList: model[this.modelName].fieldList, // 字段列表
      dialogShow: false,
      dialogdata: {},
      dialogtitle: ''
    }
  },
  watch: {
  },
  components: {
    CommonTable,
    CommonTd
    // CommonSearch
  },
  props: {
    serverModelName: {// 服务器对应的control名
      type: String,
      default: 'ExportTask'
    },
    modelName: {// 本地对应的模块名
      type: String,
      default: 'exportTable'
    }
  },
  methods: {
  },

  created() {
     // 初始化搜索相关数据
    // util.filterField(this.fieldList, this.searchFieldList, true, 'id','user_id','path');
    // 初始化表格需要显示的字段
    const uid = window.localStorage.getItem('uid') || ''
    this.search = { user_id: uid }
    util.filterField(this.fieldList, this.showfieldList, true, 'id', 'user_id', 'name');
    // 获取数据
    this.getData();
  }
}
</script>

<style scoped>



</style>
