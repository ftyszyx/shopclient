<template>
    <div>
       <common-search :search="search" :searchFieldList="searchFieldList" v-on:search="searchClick"></common-search>

        <!-- 表格  -->
         <common-table ref="tablebox" :showfieldList="showfieldList" :dataList="dataList" v-on:sort="sort">
            <template slot="topbtn">
                <button v-show="authDic.Database_save.auth" @click="add()" class="button-common">新增</button>
            </template>
            <template slot="rowbox" slot-scope="slotProps">
                <td :key="field.name" v-for="field in showfieldList" >
                  <template v-if="field.name==='path'&&slotProps.value[field.name]">
                          <a :href='geturl(slotProps.value[field.name])' style="display: inline-block;margin-right: 10px;">点此下载</a>
                  </template>
                  <template v-else>
                        <common-td :field="field" :value="slotProps.value[field.name]"></common-td>
                  </template>
                </td>
            </template>
            <template slot="rowbtn" slot-scope="slotProps">
                 <a   class="button-common" v-show="authDic.Database_del.auth"  @click="del(slotProps.value)">删除</a>
                      <a  class="button-common" v-show="authDic.Database_edit.auth"  @click="edit(slotProps.value)">修改</a>
                      <!-- <a   class="button-common" v-show="authDic.Database_restore.auth"  @click="restore(slotProps.value)">恢复</a> -->
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
           <add-dialog 
            v-if="dialogShow"
            :title="dialogtitle"
            :fieldList="fieldList" 
            :dialogdata="dialogdata" 
            v-on:close="dialogShow=false" 
            v-on:sure="dialogClick">
        </add-dialog>
    </div>
</template>

<script>
import AddDialog from 'src/views/common/common_dialog';
import model from 'src/model'
import util from 'common/utils'
import { post } from 'common/api'
import myMixin from 'common/mixin/admin.js'
import CommonTd from 'common/components/common_td'
import CommonTable from 'common/components/common_table'
import CommonSearch from 'common/components/common_searchbox'
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
  components: {
    AddDialog,
    CommonTable,
    CommonTd,
    CommonSearch
  },
  watch: {
  },
  props: {
    serverModelName: {// 服务器对应的control名
      type: String,
      default: 'database'
    },
    modelName: {// 本地对应的模块名
      type: String,
      default: 'database'
    }
  },
  methods: {
    restore(value) {
      post(this.serverModelName, 'restore', { id: value.id })
      .then(() => {
        this.getData();
        this.$message({ message: '恢复成功', type: 'success', duration: 1000 })
      })
      .catch(error => {
        console.log('error', error);
      });
    }
  },

  created() {
    // 初始化搜索相关数据
    util.filterField(this.fieldList, this.searchFieldList, true, 'id', 'path', 'file_num');

    // 初始化表格需要显示的字段
    util.filterField(this.fieldList, this.showfieldList, true, 'id', 'file_num');
    // 获取数据
    this.getData();
  }
}
</script>

<style scoped>


</style>
