<template>
    <div  class="dialog-mask"  @click="close()">
            <div class="dialog"  style="width:90%;"  @click.stop>
                <div class="header">
                    <span class="title">选择文章</span>
                    <span class="close" @click="close()">x</span>
                </div>
                <div class="content">
                    <!-- 搜索区 -->
                    <common-search :search="search" :searchFieldList="searchFieldList" v-on:search="searchClick"></common-search>
                    <!-- 表格  -->
                    <common-table ref="tablebox" :showfieldList="showfieldList" :dataList="dataList"  v-on:clickRow="selectRow" v-on:sort="sort">
                        <template slot="rowbtn" slot-scope="slotProps">
                            <a class="button-common" @click.stop="info(slotProps.value)">详情</a>
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
                     <post-info v-if="postinfoPanelShow===true" :data="postinfo" v-on:close="postinfoPanelShow=false"></post-info>

                  </div>
            </div>
             
        </div>
</template>

<script>



import model from 'src/model/index.js'
import util from 'common/utils'
import myMixin from 'common/mixin/admin.js'
import PostInfo from './post_detail'
import CommonSearch from 'common/components/common_searchbox'
import CommonTable from 'common/components/common_table'

export default{
  name: 'postselect',
  mixins: [myMixin],
  data() {
    return {
      dataList: model[this.modelName].list, // 用户列表
      fieldList: model[this.modelName].fieldList, // 字段列表
      dialogShow: false,
      postinfo: {},
      postinfoPanelShow: false,
      dialogdata: {}
    }
  },
  watch: {
  },
  components: {
    CommonTable,
    PostInfo,
    CommonSearch
  },
  props: {
    serverModelName: {// 服务器对应的control名
      type: String,
      default: 'post'
    },
    modelName: {// 本地对应的模块名
      type: String,
      default: 'post'
    }
  },
  methods: {
    info(value) {
      Object.assign(this.postinfo, value)
      this.postinfoPanelShow = true
    },
    close() {
      this.$emit('close');
    },
    selectRow(info) {
      console.log('select row')
      this.$emit('selectRow', info);
      this.$emit('close');
    },

    searchFilter(value, keyname) {
      if (keyname === 'type') {
        return value[value.length - 1]
      }
      return false;
    }
  },

  created() {
    // 初始化搜索相关数据

    // 初始化弹出对话框数据
    this.fieldList.forEach(item => {
      if (item.changeable) {
        this.$set(this.dialogdata, item.name, undefined)
        if (item.name === 'type') {
          item.cascaderList = model.posttype.topTypeList
        }
      }
    })
    util.filterField(this.fieldList, this.searchFieldList, false, 'title', 'type');
    // 初始化表格需要显示的字段
    util.filterField(this.fieldList, this.showfieldList, true, 'id', 'content', 'summary', 'order_id', 'type');
    // 获取数据
    this.getData();
  }
}
</script>

<style scoped>



</style>
