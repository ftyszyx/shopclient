<template>
<div>
  <item-select ref="itemlist" canOper v-on:edit="edit" v-on:add="add" v-on:del="del"></item-select>
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
import AddDialog from 'src/views/common/common_dialog';
import ItemSelect from './itemselect.vue'
import myMixin from 'common/mixin/admin.js'
export default{
  name: 'item',
  mixins: [myMixin],
  data() {
    return {
      totalsize: 0, // 总数量
      dataList: model[this.modelName].list, // 用户列表
      fieldList: model[this.modelName].fieldList, // 字段列表
      showfieldList: [],
      dialogShow: false,
      dialogdata: {},
      dialogtitle: ''
    }
  },
  components: {
    ItemSelect,
    AddDialog
  },
  methods: {
    getData() {
      this.$refs.itemlist.updateData();
    }
  },
  props: {
    serverModelName: {// 服务器对应的control名
      type: String,
      default: 'item'
    },
    modelName: {// 本地对应的模块名
      type: String,
      default: 'item'
    }
  },
  created() {
    this.fieldList.forEach(item => {
      if (item.name === 'type') {
        item.selectList = model.itemType.list
      }
      if (item.changeable) {
        this.$set(this.dialogdata, item.name, undefined)
      }
    })
  }
}
</script>

<style scoped>



</style>
