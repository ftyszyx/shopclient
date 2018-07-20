<template>
    <div>
       
        <!-- 表格  -->
        <common-table ref="tablebox" :showfieldList="showfieldList" :dataList="dataList" v-on:sort="sort">
            <template slot="topbtn">
               <button @click="add()" class="button-common">新增</button>
            </template>
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
            <template slot="rowbtn" slot-scope="slotProps">
                 <a class="button-common" @click.stop="del(slotProps.value)">删除</a>
                 <a class="button-common" @click.stop="edit(slotProps.value)">修改</a>
                 <a class="button-common" @click.stop="restore(slotProps.value)">恢复</a>
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
import model from 'src/model/index.js'
import util from 'common/utils'
import myMixin from 'common/mixin/admin.js'
import CommonTd from 'common/components/common_td'
import CommonTable from 'common/components/common_table'
import AddDialog from 'src/views/common/common_dialog';
import { post } from 'common/api'
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
    AddDialog,
    CommonTable,
    CommonTd
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
        this.$message({ message: '恢复成功', type: 'success', duration: 1000 })
      })
      .catch(err => {
        console.log(err)
      })
    }
  },

  created() {
    this.fieldList.forEach(item => {
      if (item.changeable) {
        this.$set(this.dialogdata, item.name, undefined)
      }
    })
    // 初始化表格需要显示的字段
    util.filterField(this.fieldList, this.showfieldList, true, 'id');
    // 获取数据
    this.getData();
  }
}
</script>

<style scoped>



</style>
