<template>
    <div>
        <!-- 搜索区 -->
         <common-search :search="search" :searchFieldList="searchFieldList" v-on:search="searchClick"></common-search>
        <!-- 表格  -->
        <common-table ref="tablebox" :showfieldList="showfieldList" :dataList="dataList" v-on:sort="sort">
            <template slot="topbtn">
               <button @click="add()" class="button-common">新增</button>
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
            <template  slot="edititembox" slot-scope="slotProps">
               <template  v-for="field in fieldList" v-if="field.changeable">
                  <template v-if="field.name=='item_id'">
                      <div :key="field.name"  class="form-itembox">
                        <span class="form-label">选择商品</span>
                        <input class="input-box"   v-model="slotProps.value.item_name" @click="showSelectItemPanel=true">
                        <i @click="selectItem(null,slotProps.value)" v-show="(slotProps.value.item_name||'')!=''" class="el-input__icon el-icon-circle-close el-input__clear"></i>
                        <shop-item-select :key="field.name+'dialog'" v-if="showSelectItemPanel" v-on:close="showSelectItemPanel=false" v-on:selectRow="selectItem(arguments[0],slotProps.value)"></shop-item-select>
                      </div>
                   </template>
                    <template v-else-if="field.name=='post_id'">
                      <div :key="field.name"  class="form-itembox">
                        <span class="form-label">选择文章</span>
                        <input class="input-box"   v-model="slotProps.value.post_title" @click="showSelectPostPanel=true">
                        <i @click="selectPost(null,slotProps.value)" v-show="(slotProps.value.post_title||'')!=''" class="el-input__icon el-icon-circle-close el-input__clear"></i>
                        <post-select :key="field.name+'dialog'" v-if="showSelectPostPanel" v-on:close="showSelectPostPanel=false" v-on:selectRow="selectPost(arguments[0],slotProps.value)"></post-select>
                      </div>
                   </template>
                   <template v-else-if="field.name=='item_name'">
                   </template>
                      <template v-else-if="field.name=='post_title'">
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
import ShopItemSelect from 'views/shop/shop_itemselect'
import PostSelect from 'views/post/post_select'
import model from 'src/model/index.js'
import util from 'common/utils'
import myMixin from 'common/mixin/admin.js'
import AddDialog from 'src/views/common/common_dialog';
import CommonSearch from 'common/components/common_searchbox'
import CommonTable from 'common/components/common_table'
import CommonDailogItem from 'views/common/common_dialog_item'
export default{
  mixins: [myMixin],
  data() {
    return {
      dataList: model[this.modelName].list, // 用户列表
      fieldList: model[this.modelName].fieldList, // 字段列表
      dialogShow: false,
      dialogdata: {},
      showSelectItemPanel: false,
      showSelectPostPanel: false,
      dialogtitle: ''
    }
  },
  watch: {
  },
  components: {
    AddDialog,
    PostSelect,
    CommonDailogItem,
    ShopItemSelect,
    CommonTable,
    CommonSearch
  },
  props: {
    serverModelName: {// 服务器对应的control名
      type: String,
      default: 'ads'
    },
    modelName: {// 本地对应的模块名
      type: String,
      default: 'ads'
    }
  },
  methods: {
    selectItem(iteminfo, changedata) {
      if (iteminfo) {
        console.log('select item', iteminfo, changedata)
        changedata.item_name = iteminfo.name
        changedata.item_id = iteminfo.id
      } else {
        changedata.item_name = ''
        changedata.item_id = ''
      }
    },
    selectPost(iteminfo, changedata) {
      if (iteminfo) {
        console.log('select item', iteminfo, changedata)
        changedata.post_title = iteminfo.title
        changedata.post_id = iteminfo.id
      } else {
        changedata.post_title = ''
        changedata.post_id = ''
      }
    },
    dialogClick(nowdata) {
      console.log('edit dailogdata', nowdata);
      const olddata = Object.assign({}, this.dialogdata);
      let changedata = Object.assign({}, nowdata);
      if (this.dialogtitle === '新增') {
        changedata.item_name = undefined
        this.sendAdd(changedata)
      } else {
        changedata = util.getChange(changedata, olddata);
        changedata.item_name = undefined
        changedata.id = olddata.id
        this.sendEdit(changedata)
      }
    }
  },

  created() {
    // 初始化弹出对话框数据
    this.fieldList.forEach(item => {
      if (item.name === 'ads_pos') {
        item.selectList = model.adspos.list
      }

      if (item.changeable) {
        this.$set(this.dialogdata, item.name, undefined)
      }
    })
    util.filterField(this.fieldList, this.searchFieldList, false, 'name', 'ads_pos');
    // 初始化表格需要显示的字段
    util.filterField(this.fieldList, this.showfieldList, true, 'id', 'ads_pos', 'order_id', 'item_id', 'post_id');
    // 获取数据
    this.getData();
  }
}
</script>

<style scoped>



</style>
