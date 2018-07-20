<template>
    <div>
     <common-search :search="search" :searchFieldList="searchFieldList" v-on:search="searchClick"></common-search>
      <common-table ref="tablebox" :showfieldList="showfieldList" :dataList="dataList" v-on:clickRow="detail" v-on:sort="sort">
            <template slot="topbtn">
                 <button v-show="authDic.StoreChange_add.auth" @click="add()" class="button-common">新增</button>
                <button v-show="authDic.StoreChange_checkOk.auth" @click="check()" class="button-common">审核</button>
                <button v-show="authDic.StoreChange_del.auth" @click="del()" class="button-common">废弃</button>
            </template>
            <template slot="rowbtn" slot-scope="slotProps">
                 <a  class="button-common" v-show="authDic.StoreChange_del.auth" @click.stop="del(slotProps.value)">废弃</a>
                  <a class="button-common" v-show="authDic.StoreChange_checkOk.auth" @click.stop="check(slotProps.value)">审核</a>
                  <a class="button-common" v-show="authDic.StoreChange_edit.auth" @click.stop="edit(slotProps.value)">修改</a>
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
        <!-- 订单详情 -->
         <add-dialog 
            v-if="detailPanelShow"
            :title="dialogtitle"
            :fieldList="fieldList" 
            :dialogdata="dialogdata" 
            v-on:close="detailPanelShow=false" 
            v-on:sure="dialogClick">
            <slot name="edititembox" slot-scope="slotProps">
              <item-select-result showNum ref="itemlistID" :itemlist="dialogdata.item_info" ></item-select-result>
            </slot>
        </add-dialog>
        
        <!-- 对话框 -->
         <add-dialog 
            v-if="dialogShow"
            :title="dialogtitle"
            :fieldList="fieldList" 
            :dialogdata="dialogdata" 
            v-on:close="dialogShow=false" 
            v-on:sure="dialogClick">
            <template slot="edititembox" slot-scope="slotProps">
              <template  v-for="field in fieldList" v-if="field.changeable">
                 <template v-if='field.name==="item_info"'>
                  <item-select-result :key="field.name" :showTableFiled="['num']" showCheck showAdd showDel changeNum ref="itemlistID" :itemlist="slotProps.value[field.name]" ></item-select-result>
                </template>
                <template v-else>
                  <common-dailog-item v-on:change="slotProps.value[field.name]=arguments[0]" :key="field.name" :field="field" :value="slotProps.value[field.name]"></common-dailog-item>
                </template>
              </template>
              </template>
        </add-dialog>

    </div>
</template>

<script>
import { post } from 'common/api'
import model from 'src/model'
import util from 'common/utils'
import myMixin from 'common/mixin/admin.js'
import CommonSearch from 'common/components/common_searchbox'
import CommonTable from 'common/components/common_table'
import ItemSelectResult from 'views/erp/item/itemselectresult'
import AddDialog from 'src/views/common/common_dialog';
import CommonDailogItem from 'views/common/common_dialog_item'
export default{
  mixins: [myMixin],
  data() {
    return {
      dataList: model[this.modelName].list, // 用户列表
      fieldList: model[this.modelName].fieldList, // 字段列表
      dialogShow: false,
      dialogdata: {},
      detailPanelShow: false,
      dialogtitle: '',
      detailItemList: [],
      checkUserList: []
    }
  },
  props: {
    serverModelName: {// 服务器对应的control名
      type: String,
      default: 'store_change'
    },
    modelName: {// 本地对应的模块名
      type: String,
      default: 'storeChange'
    }
  },
  components: {
    CommonSearch,
    AddDialog,
    CommonTable,
    CommonDailogItem,
    ItemSelectResult
  },
  methods: {
    // 详细
    detail(item) {
      console.log('detail', item);
      this.dialogtitle = '订单详情';
      if (item.item_info) {
        this.detailItemList = JSON.parse(item.item_info)
      }
      this.detailPanelShow = true
    },
    editShowBefore(item) {
      if (item.item_info) {
        this.dialogdata.item_info = JSON.parse(item.item_info)
      }
    },
    dialogClick(nowdata) {
      console.log('edit nowdata', nowdata);
      console.log('edit before', this.dialogdata);
      const olddata = Object.assign({}, this.dialogdata);
      let changedata = Object.assign({}, nowdata);
      const itemlist = this.$refs.itemlistID[0].dataList;
      changedata.item_info = [];
      itemlist.forEach(item => {
        if (item.num) {
          changedata.item_info.push({ id: item.id, num: item.num });
        }
      })
      changedata.item_info = JSON.stringify(changedata.item_info)
      if (this.dialogtitle === '新增') {
        changedata.item_info = JSON.parse(changedata.item_info)
        this.sendAdd(changedata)
      } else {
        changedata = util.getChange(changedata, olddata);
        changedata.id = olddata.id
        changedata.item_info = JSON.parse(changedata.item_info)
        this.sendEdit(changedata)
      }
    },

    check(item) {
      // 通过审核
      const checkarr = util.getCheckdItem(item);
      common(this.serverModelName, 'checkOk', { id: checkarr })
      .then(() => {
        this.getData();
        this.$message({ message: '审核成功', type: 'success', duration: 1000 })
      })
      .catch(error => {
        console.log('error', error);
      });
    }
  },

  created() {
    // 初始化搜索相关数据
    util.filterField(this.fieldList, this.searchFieldList, false, 'id', 'check_status', 'close_status', 'in_store', 'out_store', 'build_user_name', 'check_user_name');

    // 初始化弹出对话框数据
    this.fieldList.forEach(item => {
      if (item.name === 'in_store') {
        item.selectList = model.store.list
      } else if (item.name === 'out_store') {
        item.selectList = model.store.list
      } else if (item.name === 'check_user') {
        item.selectList = this.checkUserList
      }
      if (item.changeable) {
        this.$set(this.dialogdata, item.name, undefined)
      }
    })
    post('user', 'allAuthUser', { moduleID: model.user.authDic.StoreChange_checkOk.id }).then(
    response => {
      util.copyList(response.list, this.checkUserList)
    }
    ).catch(error => {
      console.log('error', error);
    });


    this.search.close_status = 0;
    // 初始化表格需要显示的字段
    util.filterField(this.fieldList, this.showfieldList, false, 'id', 'check_status', 'build_time', 'info', 'close_status', 'in_store_name', 'out_store_name', 'build_user_name', 'check_user_name');
    // 获取数据
    this.getData();
  }
}
</script>

<style scoped>



</style>
