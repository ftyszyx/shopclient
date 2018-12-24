<template>
    <div>
        <!-- 表格  -->
        <common-table ref="tablebox" :showfieldList="showfieldList" :dataList="dataList" v-on:sort="sort">
            <template slot="topbtn">
                <button @click="add()" class="button-common">新增</button>
            </template>
            <template slot="rowbox" slot-scope="rowinfo">
                      <td :key="field.name" v-for="field in showfieldList" >
                        <template v-if="field.name==='tasklist'">
                             <template v-for="(taskitem,index) in rowinfo.value[field.name]">
                              <!-- <div :key="'taskitem'+index" flex="dir:left main:justify cross:center">      -->
                                <div :key="'taskitem'+index">{{taskitem.info}}<span style="color:red;">(耗时{{taskitem.use_time}}小时)</span></div>
                              <!-- </div> -->
                            </template>
                        </template>
                        <template v-else>
                          <common-td :field="field" :value="rowinfo.value[field.name]"></common-td>
                        </template>
                      </td>
              </template>
            <template slot="rowbtn" slot-scope="slotProps">
                 <a class="button-common" @click.stop="del(slotProps.value)">删除</a>
                 <a class="button-common" @click.stop="edit(slotProps.value)">修改</a>
            </template>
        </common-table>
        <!-- 分页 -->
        <el-pagination
                @size-change="handleSizeChange"
                @current-change="handleCurrentChange"
                :current-page="curpage"
                :page-sizes="[50, 100, 200]"
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
             <template  slot="edititembox" slot-scope="slotProps">
                  <template v-for="field in fieldList" v-if="field.changeable">
                      <template v-if="field.name==='tasklist'">
                          <div :key="field.name+'listbox'" class="listbox">
                              <div class="titlebox">进度设置</div>
                              <common-table ref="settask" :showfieldList="taskField" :dataList="slotProps.value[field.name]">
                                  <template slot="topbtn">
                                    <button @click="addOneTask(slotProps.value[field.name])" class="button-common">新增</button>
                                  </template>
                                  <template slot="rowbtn" slot-scope="rowinfo">
                                      <a class="button-table-td" @click.stop="delOneTask(rowinfo.rowindex,slotProps.value[field.name])">删除</a>
                                      <a class="button-table-td" @click.stop="editOneTask(rowinfo.rowindex,slotProps.value[field.name])">修改</a>
                                  </template>
                              </common-table>
                            </div>
                      </template>
                        <template v-else>
                            <common-dailog-item v-on:change="slotProps.value[field.name]=arguments[0]" :key="field.name" :field="field" :value="slotProps.value[field.name]"></common-dailog-item>
                        </template>
                  </template>
             </template>
        </add-dialog>

        <add-dialog 
            v-if="addtaskPanel"
            :title="addtaskpanelTitle"
            :fieldList="taskField" 
            :dialogdata="addtaskData" 
            v-on:close="addtaskPanel=false" 
            v-on:sure="addTaskSure">
        </add-dialog>
        
    </div>
    
</template>

<script>
import model from 'src/model/index.js'
import CommonTd from 'common/components/common_td'
import util from 'common/utils'

import myMixin from 'common/mixin/admin.js'
import logisticsMixin from './logisticsmix.js'
import AddDialog from 'src/views/common/common_dialog';
import CommonTable from 'common/components/common_table'
import CommonDailogItem from 'src/views/common/common_dialog_item'
export default{
  mixins: [myMixin, logisticsMixin],
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
    CommonTd,

    CommonDailogItem

  },
  props: {
    serverModelName: {// 服务器对应的control名
      type: String,
      default: 'LogisticsTask'
    },
    modelName: {// 本地对应的模块名
      type: String,
      default: 'logistics_task'
    }
  },
  methods: {

    addResolve(data, key) {
      // console.log('addResolve key', key)
      if (key === 'tasklist') {
        data.tasklist = []
        return true;
      }
      return false
    },
    dialogClick(nowdata) {
      const olddata = Object.assign({}, this.dialogdata);
      let changedata = Object.assign({}, nowdata);
      changedata.tasklist = JSON.stringify(changedata.tasklist);
      olddata.tasklist = JSON.stringify(olddata.tasklist);
      if (this.dialogtitle === '新增') {
        this.sendAdd(changedata)
      } else {
        console.log('olddata', olddata, 'changedata', changedata)
        changedata = util.getChange(changedata, olddata);
        changedata.id = olddata.id
        this.sendEdit(changedata)
      }
    }
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
    // 初始化表格需要显示的字段
    util.filterField(this.fieldList, this.showfieldList, true, 'id');
    // 获取数据
    this.getData();
  }
}
</script>

<style scoped>



</style>
