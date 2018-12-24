<template>
    <div>
        <common-search :search="search" :searchFieldList="searchFieldList" v-on:search="searchClick"></common-search>
        <!-- 表格  -->
        <common-table ref="tablebox" showCheck :showfieldList="showfieldList" :dataList="dataList" v-on:sort="sort" v-on:clickRow="showDetail" operwidth="180px">
            <template slot="topbtn">
              <button @click="add()" class="button-common">新增</button>
              <el-upload 
                class="upload-box"
                  :action="getUploadUrl('/Logistics/UploadeLogistics')" 
                  withCredentials 
                  :show-file-list="false"
                    name="upfile"  
                    :before-upload="beoreupload"
                  :on-success="handleSuccess"
                  :on-error="handleErr">
                  <button class="button-common">批量导入</button>
                </el-upload>
                <button @click="exportSelctShow=true" class="button-common">导出</button>
                <button @click="syncToErp()" class="button-common">同步到erp(所选)</button>
                <button @click="updateAllLogic()" class="button-common">更新全部物流进度</button>
            </template>
             <template slot="rowbox" slot-scope="rowinfo">
                      <td :key="field.name" v-for="field in showfieldList" >
                        <template v-if="field.name==='logistics_task'">
                             <template v-for="(taskitem,index) in rowinfo.value[field.name]">
                                <div :key="'taskitem'+index">{{taskitem.info}}({{formatTime(taskitem.time)}})<i v-if="taskitem.check" class="iconfont icon-wancheng" style="padding: 0 10px;color: red;font-size: 20px;"></i></div>
                            </template>
                        </template>
                         <template v-else-if="field.name==='sync_erp_flag'">
                            <i class="el-icon-success" style="color: red;" v-if='rowinfo.value[field.name]==="1"'></i>
                            <i class="el-icon-error" v-if='rowinfo.value[field.name]==="0"'></i>
                        </template>
                        <template v-else>
                          <common-td :field="field" :value="rowinfo.value[field.name]"></common-td>
                        </template>
                      </td>
              </template>

            <template slot="rowbtn" slot-scope="slotProps">
                 <a class="button-common" @click.stop="del(slotProps.value)">删除</a>
                 <a class="button-common" @click.stop="edit(slotProps.value)">修改</a>
                 <a class="button-common" @click.stop="updateItemLogic(slotProps.value)">更新进度</a>
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
                      <template v-if="field.name==='logistics_task'">
                          <div :key="field.name+'listbox'" class="listbox">
                              <div class="titlebox">进度设置</div>
                              <common-table ref="settask" :showfieldList="taskField" :dataList="slotProps.value[field.name]">
                                  <template slot="topbtn">
                                    <button @click.stop="addOneTask(slotProps.value[field.name])" class="button-common">新增</button>
                                    <button @click.stop="selectTaskShow(slotProps.value[field.name],slotProps.value)" class="button-common">从进度库中导入</button>
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
        <export-select v-if="exportSelctShow" :templeName="serverModelName" v-on:close="exportSelctShow=false" v-on:sure="exportCSV" :filedList="exportFiledList"></export-select>

        <add-dialog 
            v-if="selectTaskPanel"
            title="选择进度库"
            :fieldList="[ { name: 'tasklist', title: '进度库', selectList: logistics_tasklist ,changeable:true}]"
            :dialogdata="selectTaskData" 
            v-on:close="selectTaskPanel=false" 
            v-on:sure="selectTaskSure">
        </add-dialog>

        <add-dialog 
            v-if="addtaskPanel"
            :title="addtaskpanelTitle"
            :fieldList="taskField" 
            :dialogdata="addtaskData" 
            v-on:close="addtaskPanel=false" 
            v-on:sure="addTaskSure">
        </add-dialog>

        <common-info v-if="dialogDetailShow" v-on:close="dialogDetailShow=false" :info="detailInfo" :fieldList="fieldList" title="物流详情">
          <template slot="tabletd" slot-scope="slotProps">
                 <template v-if="slotProps.field.name==='logistics_task'">
                      <template v-for="(taskitem,index) in slotProps.value">
                        <div :key="'taskitem'+index">{{taskitem.info}}<span style="color:red;">({{formatTime(taskitem.time)}})</span><i v-if="taskitem.check" class="iconfont icon-wancheng" style="padding: 0 10px;color: red;font-size: 20px;"></i></div>
                    </template>
                </template>
                <template  v-else>
                  <common-td :field="slotProps.field" :value="slotProps.value"></common-td>
                </template>
          </template>
        </common-info>
    </div>
    
</template>

<script>
import model from 'src/model/index.js'
import util from 'common/utils'
import { post } from 'common/api'
import myMixin from 'common/mixin/admin.js'
import AddDialog from 'src/views/common/common_dialog';
import CommonSearch from 'common/components/common_searchbox'
import CommonTable from 'common/components/common_table'
import ExportSelect from 'views/database/export_table'
import CommonDailogItem from 'src/views/common/common_dialog_item'
import CommonTd from 'common/components/common_td'
import CommonInfo from 'common/components/common_info'
import logisticsMixin from './logisticsmix.js'
import conf from 'src/config.js'
export default{
  mixins: [myMixin, logisticsMixin],
  data() {
    return {
      dataList: model[this.modelName].list, // 用户列表
      fieldList: model[this.modelName].fieldList, // 字段列表
      dialogShow: false,
      exportFiledList: [],
      logistics_tasklist: model.logistics_task.list,
      exportSelctShow: false,

      dialogdata: {},
      dialogtitle: '',
      dialogDetailShow: false,
      detailInfo: {},
      tempdata: {},

      // 修改进度对话框
      taskField: [
        { name: 'use_time', title: '耗时(单位h)', changeable: true, type: 'number' },
        { name: 'time', title: '开始时间', changeable: true, type: 'time' },
        { name: 'info', title: '描述', changeable: true },
        { name: 'check', title: '是否完成', changeable: true, type: 'bool' }],

      // 选择进度库对话框
      selectTaskPanel: false,
      selectTaskData: {}
    }
  },
  watch: {
  },
  components: {
    AddDialog,
    CommonInfo,
    CommonTable,
    ExportSelect,
    CommonDailogItem,
    CommonTd,
    CommonSearch
  },
  props: {
    serverModelName: {// 服务器对应的control名
      type: String,
      default: 'Logistics'
    },
    modelName: {// 本地对应的模块名
      type: String,
      default: 'logistics'
    }
  },
  methods: {
    syncToErp(item) {
      let idlist = []
      if (!item) {
        const checkarr = util.getCheckdItem(this.dataList);
        idlist = checkarr
      } else {
        idlist = [item.id]
      }
      post(this.serverModelName, 'SyncErpData', { id: idlist })
        .then(() => {
          this.getData();
          this.$message({ message: '同步成功', type: 'success', duration: 1000 })
        })
        .catch(error => {
          console.log('err', error)
        })
    },
    beoreupload() {
      model.app.loading = true;
    },
    handleSuccess(data) {
      model.app.loading = false;
      console.log('resp', data)
      if (data.code === 1) {
        this.$message({ message: '导入成功', type: 'success', duration: 1000 });
        this.getData();
      } else {
        this.$message({ message: data.message, type: 'error', duration: 1000 });
      }
    },
    handleErr(err) {
      model.app.loading = false;
      console.log('handleErr', err)
      this.$message({ message: '导入失败', type: 'error', duration: 1000 });
    },

    showDetail(value) {
      this.detailInfo = value
      this.dialogDetailShow = true
    },
    selectTaskShow(datalist, changedata) {
      this.tempdata = changedata
      this.tasklist = datalist
      this.selectTaskPanel = true
    },
    selectTaskSure(nowdata) {
      // console.log('nowdata', nowdata)
      const selectlist = this.logistics_tasklist.find(x => x.id === nowdata.tasklist).tasklist
      util.copyList(selectlist, this.tasklist)
      // const starttime = parseInt(this.tempdata.logistics_task_starttime)
      const starttime = this.tempdata.logistics_task_starttime.valueOf() / 1000
      let nowtime = starttime
      this.tasklist.forEach(item => {
        nowtime = nowtime + parseInt(item.use_time) * 3600
        item.time = nowtime
      })
      console.log('tasklist', this.tasklist, starttime)

      this.selectTaskPanel = false
    },
    addResolve(data, key) {
      if (key === 'logistics_task') {
        data.logistics_task = []
        return true;
      }
      return false
    },
    updateAllLogic() {
      post(this.serverModelName, 'UpdateAllTask')
        .then(res => {
          this.getData();
          let liststr = ''
          if (res.oklist) {
            res.oklist.forEach(item => {
              liststr += item
              liststr += '|'
              //liststr += '<br/>'
            })
           
          }
          if(liststr==""){
            this.$message({ 
            message: '没有可更新的项目',
            type: 'error',
            duration: 1000 })
          }else{
             this.$message({ dangerouslyUseHTMLString: true,
            message: '更新成功了:<br/>' + liststr,
            type: 'success',
            duration: 1000 })
           }
          
        })
        .catch(err => {
          console.log('err', err);
        })
    },
    updateItemLogic(value) {
      post(this.serverModelName, 'UpdateTask', { ids: [value.id] })
        .then(() => {
          this.getData();
          this.$message({ message: '更新成功', type: 'success', duration: 1000 })
        })
        .catch(err => {
          console.log('err', err);
        })
    },
    dialogClick(nowdata) {
      const olddata = Object.assign({}, this.dialogdata);
      let changedata = Object.assign({}, nowdata);
      console.log('before', this.dialogdata)
      console.log('now', nowdata)
      changedata.logistics_task_starttime = (changedata.logistics_task_starttime.valueOf() / 1000) + ''
      olddata.logistics_task_starttime = parseInt(olddata.logistics_task_starttime) + ''
      changedata.logistics_task = JSON.stringify(changedata.logistics_task || []);
      olddata.logistics_task = JSON.stringify(olddata.logistics_task);
      if (this.dialogtitle === '新增') {
        this.sendAdd(changedata)
      } else {
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
    // this.search = { is_del: 0 }
    util.filterField(this.fieldList, this.exportFiledList, true);
    this.pagesize = 50;
     // 初始化搜索相关数据
    util.filterField(this.fieldList, this.searchFieldList, false, 'id', 'sync_erp_flag', 'internal_ship_company_code', 'internal_ship_num', 'idnum', 'client_name','client_phone',"logistics_task_starttime","state");
    // 初始化表格需要显示的字段
    util.filterField(this.fieldList, this.showfieldList, true, 'logistics_task', 'logistics_task_starttime', 'idnumpic1', 'idnumpic2');
    // 获取数据
    this.getData();
  }
}
</script>

<style scoped>


.upload-box{
  display: inline-block;
}
</style>
