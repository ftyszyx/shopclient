<template>
<div>
   <!-- 表格  -->
   <common-table ref="tablebox" :showfieldList="showfieldList" :dataList="dataList" v-on:sort="sort">
            <template slot="topbtn">
                <button @click="add()" class="button-common">新增</button>
            </template>
            <template slot="rowbox" slot-scope="slotProps">
                 <td :key="field.name" v-for="field in showfieldList" >
                  <template v-if="field.name=='is_valid'">
                    <span  @click="changeValid(slotProps.value)" class="switch" :class='{"checked":slotProps.value[field.name]===1}' style="width: 40px;">
                      <span class="switch__button"></span>
                    </span>
                  </template>
                  <template v-else>
                        <common-td :field="field" :value="slotProps.value[field.name]"></common-td>
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
import model from 'src/model'
import util from 'common/utils'
import { post } from 'common/api'
import myMixin from 'common/mixin/admin.js'
import AddDialog from 'src/views/common/common_dialog'
import CommonTable from 'common/components/common_table'
import CommonTd from 'common/components/common_td'
export default{
  mixins: [myMixin],
  data() {
    return {
      dataList: model.user.list, // 用户列表
      fieldList: model.user.fieldList,
      dialogShow: false,
      dialogdata: {},
      dialogtitle: ''
    }
  },
  components: {
    AddDialog,
    CommonTd,
    CommonTable
  },
  props: {
    serverModelName: {// 服务器对应的control名
      type: String,
      default: 'user'
    },
    modelName: {// 本地对应的模块名
      type: String,
      default: 'user'
    }
  },
  methods: {
    // 修改是否有效
    changeValid(item) {
      if (this.authDic.User_changeValid.auth === false) {
        return;
      }
      if (item.is_valid === 1) {
        item.is_valid = 0;
      } else {
        item.is_valid = 1;
      }
      post(this.serverModelName, 'ChangeValid', { uid: item.id, is_valid: item.is_valid })
      .then(() => {
        this.getData();
        this.$message({ message: '修改成功', type: 'success', duration: 1000 })
      })
      .catch(error => {
        console.log('err', error)
      })
    }

  },
  created() {
    this.fieldList.forEach(item => {
      if (item.name === 'user_group') {
        item.selectList = model.userGroup.list
      }
      if (item.changeable) {
        this.$set(this.dialogdata, item.name, undefined)
      }
    })
    this.search = { is_system: 0 }
    util.filterField(this.fieldList, this.showfieldList, true, 'id', 'is_system');
    this.getData();
  }
}
</script>

<style scoped>
.content .form-label{
  display: inline-block;
  width:100px;
  text-align: right;
  margin-right: 10px;
}
.footer button{
  margin-right: 10px;
  margin-bottom: 10px;
}

.footer{
  width:200px;
  margin: 50px auto;
}
</style>
