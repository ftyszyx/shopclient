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
                 <a class="button-common" @click.stop="info(slotProps.value)">详情</a>
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
        <post-info v-if="postinfoPanelShow===true" :data="postinfo" v-on:close="postinfoPanelShow=false"></post-info>
    </div>
</template>

<script>



import model from 'src/model/index.js'
import util from 'common/utils'
import myMixin from 'common/mixin/admin.js'
import AddDialog from 'src/views/common/common_dialog';
import CommonSearch from 'common/components/common_searchbox'
import CommonTable from 'common/components/common_table'
import PostInfo from './post_detail'
export default{
  mixins: [myMixin],
  data() {
    return {
      dataList: model[this.modelName].list, // 用户列表
      fieldList: model[this.modelName].fieldList, // 字段列表
      dialogShow: false,
      dialogdata: {},
      postinfo: {},
      postinfoPanelShow: false,
      postTypeTopList: model.posttype.topTypeList,
      typeList: model.posttype.list,
      dialogtitle: ''
    }
  },
  watch: {
  },
  components: {
    PostInfo,
    AddDialog,
    CommonTable,
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
    // 编辑
    editShowBefore() {
      this.dialogdata.type = util.getSelectArr(this.typeList, this.dialogdata.type, 'id');
    },
    dialogClick(nowdata) {
      console.log('edit dailogdata', nowdata, this.dialogdata);
      const olddata = Object.assign({}, this.dialogdata);
      let changedata = Object.assign({}, nowdata);

      changedata.type = nowdata.type[nowdata.type.length - 1]
      if (this.dialogtitle === '新增') {
        this.sendAdd(changedata)
      } else {
        olddata.type = olddata[olddata.type.length - 1]
        changedata = util.getChange(changedata, olddata);
        changedata.id = olddata.id
        this.sendEdit(changedata)
      }
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
