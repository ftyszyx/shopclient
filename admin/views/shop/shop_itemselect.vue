<template>
     <div  class="dialog-mask"  @click="close()">
            <div class="dialog"  style="width:90%;"  @click.stop>
                <div class="header">
                    <span class="title">选择商品</span>
                    <span class="close" @click="close()">x</span>
                </div>
                <div class="content">
                                <common-search :search="search" :searchFieldList="searchFieldList" v-on:search="searchClick"></common-search>
                    <!-- 表格  -->
                    <common-table ref="tablebox" :showfieldList="showfieldList" :dataList="dataList" v-on:clickRow="selectrow" v-on:sort="sort">
                       
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
            </div>
             
        </div>

      
</template>

<script>
import model from 'src/model/index.js'
import util from 'common/utils'
import myMixin from 'common/mixin/admin.js'
import CommonSearch from 'common/components/common_searchbox'
import CommonTable from 'common/components/common_table'
// import ShopItemRow from './shop_itemrow'
export default{
  name: 'shopitemselect',
  mixins: [myMixin],
  data() {
    return {
      dataList: model[this.modelName].list, // 用户列表
      fieldList: model[this.modelName].fieldList // 字段列表

    }
  },
  watch: {
  },
  components: {
    CommonTable,
    CommonSearch
  },
  props: {
    serverModelName: {// 服务器对应的control名
      type: String,
      default: 'ShopItem'
    },
    modelName: {// 本地对应的模块名
      type: String,
      default: 'shopitem'
    }
  },
  methods: {
    close() {
      console.log('close');
      this.$emit('close');
    },
    selectrow(value) {
      this.$emit('selectRow', value);
      this.$emit('close');
    }
  },


  created() {
    // 初始化弹出对话框数据
    this.fieldList.forEach(item => {
      if (item.name === 'tag') {
        item.mulSelectList = model.shoptag.list
      }
      if (item.name === 'item_type') {
        item.cascaderList = model.shopitemtype.topTypeList
      }
      if (item.name === 'brand') {
        item.selectList = model.shopbrand.list
      }
    })
     // 初始化搜索相关数据
    util.filterField(this.fieldList, this.searchFieldList, false, 'name', 'is_onsale', 'code', 'item_type', 'brand', 'tag');

    util.filterField(this.fieldList, this.showfieldList, false, 'pics', 'name', 'code', 'item_type_name', 'brand_name', 'tag', 'order_id', 'price', 'store_num', 'sell_num', 'is_onsale');
    // 获取数据
    this.getData();
  }
}
</script>

<style scoped>

.titlebox{
      line-height: 30px;
    background-color: rgba(242, 246, 252, 1);
}

td.name{
  padding: 0 10px;
    background-color: rgb(251,251,251);
}
</style>
