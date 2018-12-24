<template>
<div>
  <common-search :search="search" :searchFieldList="searchFieldList" v-on:search="searchClick"></common-search>

   <!-- 表格  -->
    <common-table ref="tablebox" :showfieldList="showfieldList" :dataList="dataList" v-on:sort="sort" operwidth="250px">
            <template slot="topbtn">
                <button @click="add()" class="button-common">新增</button>
            </template>
            <template slot="rowbox" slot-scope="slotProps">
                 <td :key="field.name" v-for="field in showfieldList" >
                  <template v-if="field.name=='is_del'">
                    <span  @click="changeValid(slotProps.value)" class="switch" :class='{"checked":slotProps.value[field.name]===0}' style="width: 40px;">
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
                 <a class="button-common" @click.stop="resetPass(slotProps.value)">重置密码</a>
                 <a class="button-common" @click.stop="refreshToken(slotProps.value)">刷新token</a>
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
import CommonTable from 'common/components/common_table'
import CommonTd from 'common/components/common_td'
import AddDialog from 'src/views/common/common_dialog'
import CommonSearch from 'common/components/common_searchbox'
import { post } from 'common/api'
import myMixin from 'common/mixin/admin.js'

export default{
  mixins: [myMixin],
  data() {
    return {
      dataList: model[this.modelName].list, // 用户列表
      fieldList: model[this.modelName].fieldList,
      dialogShow: false,
      dialogdata: {},
      dialogtitle: ''
    }
  },
  watch: {
    '$route'() {
      this.initpath();
      this.getData();
      this.$forceUpdate();
    }
  },
  components: {
    CommonTd,
    CommonSearch,
    AddDialog,
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
      if (item.is_del === 1) {
        item.is_del = 0;
      } else {
        item.is_del = 1;
      }
      post(this.serverModelName, 'ChangeValid', { id: item.id, is_del: item.is_del })
      .then(() => {
        this.getData();
        this.$message({ message: '修改成功', type: 'success', duration: 1000 })
      })
      .catch(error => {
        console.log('err', error)
      })
    },
    initpath() {
      const meta = this.$route.meta
      this.search = { user_group_type: meta.grouptype, is_del: 0 }
    },
    refreshToken(userinfo) {
      post(this.serverModelName, 'RefreshToken', { id: userinfo.id })
      .then(data => {
        this.$alert('用户id:' + userinfo.id + '  token:' + data.user_token + '  过期时间:' + this.formatTime(data.token_expire), '刷新成功', {
          confirmButtonText: '确定',
          callback: action => {

          }
        });
        // this.$message({ message: '刷新成功：用户id:' + userinfo.id + '  token:' + data.user_token + '  过期时间:' + this.formatTime(data.token_expire), type: 'success', duration: 4000 })
      })
      .catch(err => {
        console.log('err', err)
      })
    },
    resetPass(userinfo) {
      post(this.serverModelName, 'rsetpass', { id: userinfo.id })
      .then(data => {
        this.$alert('新密码:' + data.newpass, '密码重置成功', {
          confirmButtonText: '确定',
          callback: action => {

          }
        });
      })
      .catch(err => {
        console.log('err', err)
      })
    }
  },
  created() {
    this.fieldList.forEach(item => {
      if (item.name === 'user_group') {
        item.selectList = model.userGroup.list
      }
      if (item.name === 'track_admin') {
        item.selectList = model.user.adminlist
      }
      if (item.changeable) {
        this.$set(this.dialogdata, item.name, undefined)
      }
    })


    // console.log('meta', this.$route.meta)

    this.initpath();
    util.filterField(this.fieldList, this.searchFieldList, false, 'name', 'account', 'phone', 'user_group', 'reg_time', 'last_login_time', 'is_del', 'wchat_appid');
    util.filterField(this.fieldList, this.showfieldList, true, 'id', 'shop_cart', 'user_group', 'user_group_type');
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
