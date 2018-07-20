<template>
<div>
   <!-- 表格  -->
   <common-table ref="tablebox" :showfieldList="showfieldList" :dataList="dataList" v-on:sort="sort">
            <template slot="topbtn">
               <button v-show="authDic.ItemType_add.auth"  @click="add()" class="button-common">新增</button>
            </template>
             <template slot="thbox-before">
               <th></th>
            </template>
            <template slot-scope="slotProps" >
               <tr :key="slotProps.value.id"  v-if="slotProps.value.show">       
                  <td v-if="slotProps.value.level===1">
                      <img style="width:24px" class="td-img" @click="toggle(slotProps.value)" v-if="slotProps.value.open" src="~src/assets/img/icondel.png">
                      <img style="width:24px" class="td-img" @click="toggle(slotProps.value)" v-else src="~src/assets/img/iconadd.png">
                    </td>
                    <td v-else>
                      <div v-bind:style="{'padding-left':(slotProps.value.level*10)+'px'}">
                            |-----
                      </div>
                    </td>
                    <td :key="field.name" v-for="field in showfieldList"  >
                        <common-td :field="field"  :value="slotProps.value[field.name]"></common-td>
                    </td>
                    <td>
                      <a v-show="authDic.ItemType_del.auth" class="button-common" @click.stop="del(slotProps.value)">删除</a>
                        <a v-show="authDic.ItemType_edit.auth" class="button-common" @click.stop="edit(slotProps.value)">修改</a>
                    </td>
               </tr>
            </template>
        </common-table>
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
import myMixin from 'common/mixin/admin.js'
import AddDialog from 'src/views/common/common_dialog';
import model from 'src/model'
import CommonTable from 'common/components/common_table'
import CommonTd from 'common/components/common_td'
import util from 'common/utils'
const dataModel = model.itemType;
export default{
  mixins: [myMixin],
  data() {
    return {
      totalsize: 0, // 总数量
      dataList: model[this.modelName].list, // 用户列表
      fieldList: model[this.modelName].fieldList, // 字段列表
      showfieldList: [],
      dialogShow: false,
      dialogdata: {},
      dialogtitle: '',
      openMenus: dataModel.openMenus// 显示的

    }
  },
  components: {
    AddDialog,
    CommonTd,
    CommonTable
  },
  watch: {

  },
  props: {
    serverModelName: {// 服务器对应的control名
      type: String,
      default: 'item_type'
    },
    modelName: {// 本地对应的模块名
      type: String,
      default: 'itemType'
    }
  },
  methods: {
    getData() {
      model[this.modelName].all()
    },
    dialogClick(nowdata) {
      console.log('edit dailogdata', nowdata);
      const olddata = Object.assign({}, this.dialogdata);
      let changedata = Object.assign({}, nowdata);
      if (this.dialogtitle === '新增') {
        changedata.level = util.GetLevel(changedata.parent_id, this.dataList)
        this.sendAdd(changedata)
      } else {
        changedata = util.getChange(changedata, olddata);
        changedata.id = olddata.id
        if (changedata.parent_id) {
          changedata.level = util.GetLevel(changedata.parent_id, this.dataList)
        }
        this.sendEdit(changedata)
      }
    }

  },
  created() {
    dataModel.openMenus.splice(0)
    this.fieldList.forEach(item => {
      if (item.name === 'parent_id') {
        item.selectList = model.itemType.list
      }
      if (item.changeable) {
        this.$set(this.dialogdata, item.name, undefined)
      }
    })
    util.filterField(this.fieldList, this.showfieldList, false, 'name', 'code');
    this.getData();
  }
}
</script>

<style scoped>
.td-img{
  height: 20px;
  width: 20px;
}

</style>
