<template>
<div>
   <common-table ref="tablebox" :showfieldList="showfieldList" :dataList="dataList" v-on:sort="sort">
            <template slot="topbtn">
               <button @click="add()"  v-show="authDic.ShopType_add.auth"   class="button-common">新增</button>
            </template>
            <template slot="rowbtn" slot-scope="slotProps">
                 <a  v-show="authDic.ShopType_del.auth" class="button-common" @click.stop="del(slotProps.value)">删除</a>
                 <a v-show="authDic.ShopType_edit.auth" class="button-common" @click.stop="edit(slotProps.value)">修改</a>
            </template>
        </common-table>
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
import CommonTable from 'common/components/common_table'
import myMixin from 'common/mixin/admin.js'
import AddDialog from 'src/views/common/common_dialog';
export default{
  mixins: [myMixin],
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
  methods: {
    getData() {
      model[this.modelName].all()
    }
  },
  props: {
    serverModelName: {// 服务器对应的control名
      type: String,
      default: 'shop_type'
    },
    modelName: {// 本地对应的模块名
      type: String,
      default: 'shopType'
    }
  },
  components: {
    AddDialog,
    CommonTable
  },

  created() {
    // 初始化弹出对话框数据
    this.fieldList.forEach(item => {
      if (item.changeable) {
        this.$set(this.dialogdata, item.name, undefined)
      }
    })
    // 初始化表格需要显示的字段
    util.filterField(this.fieldList, this.showfieldList, true, 'id');
    // 获取数据
    this.getData();
  }
}
</script>

<style scoped>



</style>
