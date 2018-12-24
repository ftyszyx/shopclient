<template>
    <div>
        <common-search :search="search" :searchFieldList="searchFieldList" v-on:search="searchClick"></common-search>
        <!-- 表格  -->
        <common-table ref="tablebox" :showfieldList="showfieldList" :dataList="dataList"  v-on:clickRow="detail"  v-on:sort="sort" :showCheck="true">
            <template slot="topbtn">
               
                <button v-show="authDic.BuyInStore_add.auth" @click="add()" class="button-common">新增</button>
                <button v-show="authDic.BuyInStore_checkOk.auth" @click="check()" class="button-common">审核</button>
                <button v-show="authDic.BuyInStore_del.auth" @click="del()" class="button-common">废弃</button>
            </template>
            <template slot="rowbtn" slot-scope="slotProps">
                  <a class="button-common" v-show="authDic.BuyInStore_del.auth" @click.stop="del(slotProps.value)">废弃</a>
                    <a class="button-common" v-show="authDic.BuyInStore_checkOk.auth" @click.stop="check(slotProps.value)">审核</a>
                    <a class="button-common" v-show="authDic.BuyInStore_edit.auth" @click.stop="edit(slotProps.value)">修改</a>
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
        <!-- 新增和修改 -->
        <add-dialog 
            ref="adddialog"
            v-if="dialogShow"
            :title="dialogtitle"
            :fieldList="fieldList" 
            :dialogdata="dialogdata" 
            v-on:close="dialogShow=false" 
            v-on:sure="dialogClick">
            <template slot="edititembox" slot-scope="slotProps">
                <template  v-for="field in fieldList" v-if="field.changeable">
                        <!-- 选择订单号 -->
                        <template v-if="field.name==='buy_order'">
                          <div :key="field.name" class="form-itembox">
                          <span class="form-label" :class='{"require":field.rules}'>{{field.title}}</span>
                              <input  class="input-box" @click="selectOrderDialogShow=true" v-model="slotProps.value[field.name]">
                          </div>
                        </template>
                        <template v-else-if='field.name==="item_info"'>
                          <div :key="field.name" class="form-itembox">
                          <span class="form-label" :class='{"require":field.rules}'>{{field.title}}</span>
                              <item-select-result showCheck showAdd showDel   changeNum :showTableFiled="['num']" ref="itemlistID" :itemlist="detailItemList" ></item-select-result>
                          </div>
                        </template>
                        <template v-else>
                             <common-dailog-item v-on:change="slotProps.value[field.name]=arguments[0]" :key="field.name" :field="field" :value="slotProps.value[field.name]"></common-dailog-item>
                        </template>
                </template>
            </template>
        </add-dialog>
        <!-- 订单详情 -->
         <add-dialog 
            v-if="orderDetailPanel"
            title="订单详情"
            :showfooter="false"
            v-on:close="orderDetailPanel=false" >
             <template slot="edititembox"  >
              <item-select-result :showoper="false" showNum ref="itemlistInfo" :showTableFiled="['num']" :itemlist="detailItemList" ></item-select-result>
             </template>
         </add-dialog>
  <!-- 选择订单 -->
         <add-dialog 
            v-if="selectOrderDialogShow"
             :showfooter="false"
            title="选择采购订单(双击对应的行)"
            v-on:close="selectOrderDialogShow=false" >
             <template slot="edititembox"  >
              <buy-in-select v-on:detail="selectOrder" ></buy-in-select>
             </template>
         </add-dialog>
    </div>
</template>

<script>
import model from 'src/model';
import util from 'common/utils';
import { post } from 'common/api';
import BuyInSelect from './buyinselect';
import ItemSelectResult from 'views/erp/item/itemselectresult';
import myMixin from 'common/mixin/admin.js';
import CommonSearch from 'common/components/common_searchbox'
import CommonDailogItem from 'src/views/common/common_dialog_item'
import AddDialog from 'src/views/common/common_dialog';
import CommonTable from 'common/components/common_table'
export default {
  name: 'BuyInStore',
  mixins: [myMixin],
  data() {
    return {
      dataList: model[this.modelName].list, // 用户列表
      fieldList: model[this.modelName].fieldList, // 字段列表
      dialogShow: false,
      dialogdata: {},
      detailItemList: [],
      dialogtitle: '',
      orderDetailPanel: false,


      selectOrderDialogShow: false, // 选择采购订单页面
      userList: []
    };
  },
  watch: {
  },
  props: {
    serverModelName: {// 服务器对应的control名
      type: String,
      default: 'buy_in_store'
    },
    modelName: {// 本地对应的模块名
      type: String,
      default: 'buyInStore'
    }
  },
  components: {
    BuyInSelect,
    ItemSelectResult,
    AddDialog,
    CommonDailogItem,
    CommonTable,
    CommonSearch
  },
  methods: {

    editShowBefore(item) {
      console.log('edit before item', item)
      this.detailItemList.splice(0);
      const itemlist = JSON.parse(item.item_info);
      itemlist.forEach(temp => {
        this.detailItemList.push({ id: temp.id, num: temp.num });
      });
    },
    addShowBefore() {
      this.detailItemList.splice(0);
    },

    check(item) {
      const arr = util.getCheckdItem(item);
      console.log('check item', arr);
      post(this.serverModelName, 'checkOk', { id: arr })
        .then(() => {
          this.$message({ message: '审核成功', type: 'success', duration: 1000 })
          this.getData();
        })
        .catch(err => {
          console.log('err', err);
        });
    },
    // 选择一行
    detail(item) {
      console.log('detail', item);
      this.detailItemList.splice(0)
      this.orderDetailPanel = true;
      if (item.item_info) {
        const itemlist = JSON.parse(item.item_info);
        itemlist.forEach(temp => {
          this.detailItemList.push({ id: temp.id, num: temp.num });
        });
      }
      this.orderDetailPanel = true;
    },
    // 选择一个订单
    selectOrder(orderinfo) {
      console.log('select order', orderinfo);
      this.selectOrderDialogShow = false;
      this.$set(this.$refs.adddialog.changedata, 'store_id', orderinfo.store_id)
      this.$set(this.$refs.adddialog.changedata, 'buy_order', orderinfo.id)
      this.detailItemList.splice(0);
        // const itemlist = JSON.parse(item.item_info)
      if (orderinfo.item_info) {
        const itemlist = JSON.parse(orderinfo.item_info);
        itemlist.forEach(item => {
          if (item.inStore === undefined) {
            item.inStore = 0;
          }
          if (this.serverModelName === 'buy_in_store') {
            if (item.num > item.inStore) {
              item.num = item.num - item.inStore; // 在途数
              this.detailItemList.push(item);
            }
          } else {
            if (item.inStore > 0) {
              item.num = item.inStore; // 在途数
              this.detailItemList.push(item);
            }
          }
        });
      }
      console.log('this.detailItemList', this.detailItemList)
      // this.$refs.itemlistID[0].getData();
    },
    dialogClick(nowdata) {
      console.log('edit nowdata', nowdata);
      console.log('edit before', this.dialogdata);
      const olddata = Object.assign({}, this.dialogdata);
      const changedata = Object.assign({}, nowdata);
      const itemlist = this.$refs.itemlistID[0].dataList;
      changedata.item_info = [];
      itemlist.forEach(item => {
        if (item.num) {
          changedata.item_info.push({ id: item.id, num: item.num });
        }
      })
      changedata.item_info = JSON.stringify(changedata.item_info)
      if (typeof olddata.item_info != 'string') {
        olddata.item_info = JSON.stringify(olddata.item_info)
      }

      if (this.dialogtitle === '新增') {
        changedata.item_info = JSON.parse(changedata.item_info)
        this.sendAdd(changedata)
      } else {
        console.log('edit nowdata', changedata);
        console.log('edit before', olddata);
        const senddata = util.getChange(changedata, olddata);

        senddata.id = olddata.id
        console.log('changedata', senddata)
        if (senddata.item_info) {
          senddata.item_info = JSON.parse(changedata.item_info)
        }
        this.sendEdit(senddata)
      }
    }

  },

  created() {
    // 初始化搜索相关数据
    console.log('searchfillist', this.searchFieldList);
    
    // 初始化弹出对话框数据
    this.fieldList.forEach(item => {
      if (item.name === 'check_user') {
        item.selectList = this.userList
      }
       if (item.name === 'store_id') {
        item.selectList = model.store.list
      }
      
      if (item.changeable) {
        this.$set(this.dialogdata, item.name, undefined);
      }
    });


    util.filterField(this.fieldList, this.searchFieldList, true, 'id', 'info', 'item_info', 'check_user', 'build_user', 'build_time', 'store_name');

    post('user', 'allAuthUser', { moduleID: model.user.authDic.BuyInStore_checkOk.id })
        .then(response => {
          util.copyList(response.list, this.userList);
        })
        .catch(error => {
          console.log('error', error);
        });
    // 初始化表格需要显示的字段
    util.filterField(this.fieldList, this.showfieldList, true, 'item_info', 'check_user', 'build_user', 'store_id');
    this.search = { close_status: 0 };
    // 获取数据
    this.getData();
  }
};
</script>

<style scoped>

</style>
