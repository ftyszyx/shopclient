<template>
    <div>
        <!-- 表格  -->
          <common-table ref="tablebox" :showfieldList="showfieldList" :dataList="dataList" v-on:sort="sort">
            <template slot="topbtn">
               <button @click="add()" class="button-common">新增</button>
            </template>
             <template slot="thbox-before">
               <th></th>
            </template>
            <template slot="rowbox" slot-scope="slotProps">
                 <td v-if="slotProps.value.level===1">
                    <img style="width:24px" class="td-img" @click="toggle(slotProps.value)" v-if="slotProps.value.open" src="~src/assets/img/icondel.png">
                    <img style="width:24px" class="td-img" @click="toggle(slotProps.value)" v-else src="~src/assets/img/iconadd.png">
                  </td>
                  <td v-else>
                    <div v-bind:style="{'padding-left':(slotProps.value.level*10)+'px'}">
                          |-----
                    </div>
                  </td>
                    <td :key="field.name" v-for="field in showfieldList" >
                        <common-td :field="field" :value="slotProps.value[field.name]"></common-td>
                    </td>
            </template>
            <template slot="rowbtn" slot-scope="slotProps">
                 <a class="button-common" @click.stop="del(slotProps.value)">删除</a>
                 <a class="button-common" @click.stop="edit(slotProps.value)">修改</a>
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
import model from 'src/model/index.js'
import util from 'common/utils'
import myMixin from 'common/mixin/admin.js'
import AddDialog from 'src/views/common/common_dialog';
import CommonSearch from 'common/components/common_searchbox'
import CommonTable from 'common/components/common_table'
import CommonTd from 'common/components/common_td'
export default{
  mixins: [myMixin],
  data() {
    return {
      dataList: model[this.modelName].list, // 用户列表
      fieldList: model[this.modelName].fieldList, // 字段列表
      dialogShow: false,
      dialogdata: {},
      postTypeTopList: model[this.modelName].topTypeList,
      dialogtitle: ''
    }
  },
  components: {
    AddDialog,
    CommonSearch,
    CommonTable,
    CommonTd
  },
  watch: {
  },
  props: {
    serverModelName: {// 服务器对应的control名
      type: String,
      default: 'posttype'
    },
    modelName: {// 本地对应的模块名
      type: String,
      default: 'posttype'
    }
  },
  methods: {
    editShowBefore() {
      this.dialogdata.parent_id = util.getSelectArr(this.dataList, this.dialogdata.parent_id, 'id');
    },
    dialogClick(nowdata) {
      console.log('edit dailogdata', nowdata);
      const olddata = Object.assign({}, this.dialogdata);
      let changedata = Object.assign({}, nowdata);
      if (changedata.parent_id) {
        changedata.parent_id = changedata.parent_id[changedata.parent_id.length - 1]
      }


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
    },
    getData() {
      model[this.modelName].all()
    }
  },

  created() {
    // 初始化弹出对话框数据
    this.fieldList.forEach(item => {
      if (item.name === 'parent_id') {
        item.cascaderList = model.posttype.topTypeList
      }
      if (item.changeable) {
        console.log('set name', item.name)

        this.$set(this.dialogdata, item.name, undefined)
      }
    })
    // 初始化表格需要显示的字段
    util.filterField(this.fieldList, this.showfieldList, false, 'name');
    // 获取数据
    this.getData()
  }
}
</script>

<style scoped>



</style>
