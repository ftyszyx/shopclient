<template>
  <div>
    <!-- 表格  -->
    <common-table ref="tablebox" :showfieldList="showfieldList" :dataList="dataList" v-on:sort="sort">
            <template slot="topbtn">
               <button v-show="authDic.UserGroup_add.auth" @click="add" class="button-common">新增</button>
            </template>
            <template slot="rowbtn" slot-scope="slotProps">
                <a class="button-common" v-show="authDic.UserGroup_del.auth" @click="del(slotProps.value)">删除</a>
                <a class="button-common"  @click="copy(slotProps.value)">复制</a>
                <a class="button-common" v-show="authDic.UserGroup_edit.auth" @click="edit(slotProps.value)">修改</a>
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
        <template slot="edititembox"  slot-scope="slotProps">
            <template  v-for="field in fieldList" v-if="field.changeable">
                 <template v-if='field.name=="module_ids"'>
                   <div  :key="field.name" class="form-itembox">
                  <span class="form-label require" style="line-height:35px;">{{field.title}}</span>
                  <div @click="selectAll()" class="all-module" style="line-height:35px;">
                    <input type="checkbox" v-model="allModuleChecked"></input>
                    <span>平台</span>
                  </div>
                  <!-- 模块列表 -->
                  <div class="modulebox">
                    <table class="module-table">
                      <colgroup>
                        <col>
                        <col>
                      </colgroup>
                      <tbody>
                        <template v-for="modleitem in moduleNameList">
                          <tr :key="modleitem.name" class="table-tr">
                            <!-- 主模块名 -->
                            <td>
                              <div @click="selectRow(modleitem)" class="main-module-cell">
                                <input type="checkbox" v-model="modleitem.list[0].checked"></input>
                                <span>{{modleitem.list[0].name}}</span>
                              </div>
                            </td>
                            <!-- 子模块名 -->
                            <td>
                              <ul>
                                <template v-for="methoditem in modleitem.list">
                                  <template v-if="methoditem.posid!==0">
                                    <li :key="methoditem.name" @click="selectOne(methoditem)" class="module-cell">
                                      <input type="checkbox" v-model="methoditem.checked">
                                      <span>{{getMethodName(methoditem.name)}}</span>
                                    </li>
                                  </template>
                                </template>
                              </ul>
                            </td>
                          </tr>
                        </template>
                      </tbody>
                    </table>
                  </div>
                  </div>
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
import model from 'src/model/index.js'
import util from 'common/utils'
import CommonTable from 'common/components/common_table'
import myMixin from 'common/mixin/admin.js'
import CommonTd from 'common/components/common_td'
import AddDialog from 'src/views/common/common_dialog'
import CommonDailogItem from 'src/views/common/common_dialog_item'
export default{
  mixins: [myMixin],
  data() {
    return {
      dataList: model[this.modelName].list, // 用户列表
      fieldList: model[this.modelName].fieldList, // 字段列表
      moduelList: model.module.list, // 模块列表
      dialogShow: false,
      dialogdata: {},
      dialogtitle: '',
      allModuleChecked: false,
      moduleNameList: []
    }
  },
  components: {
    CommonTd,
    AddDialog,
    CommonDailogItem,
    CommonTable
  },
  watch: {
    moduelList() {
      this.initNameList();
    }
  },
  props: {
    serverModelName: {// 服务器对应的control名
      type: String,
      default: 'user_group'
    },
    modelName: {// 本地对应的模块名
      type: String,
      default: 'userGroup'
    }
  },
  methods: {
    initNameList() {
      const namedic = {}
      // console.log('modulelist', this.moduelList);
      this.moduelList.forEach(item => {
        const modulename = item.controller;
        if (!namedic[modulename]) {
          namedic[modulename] = {}
        }
        namedic[modulename].list = namedic[modulename].list || [];
        if (item.posid === 0) {
          namedic[modulename].name = item.name;
          namedic[modulename].need_auth = item.need_auth;
          namedic[modulename].list.push(item);
        } else {
          if (item.need_auth === 1) {
            namedic[modulename].list.push(item);
          }
        }
      })

      console.log('namedic', namedic);
      this.moduleNameList.splice(0);
      for (const keyname in namedic) {
        const moduleinfo = namedic[keyname];
        // if (moduleinfo.need_auth === 1)
        {
          moduleinfo.list.sort((modulea, moduleb) => modulea.posid - moduleb.posid)

          this.moduleNameList.push(moduleinfo);
        }
      }
    },
    getMethodName(name) {
      const namearr = name.split('-');
      if (namearr.length > 1) {
        return namearr[1];
      }
      return name;
    },
    updateCheckList() {
      this.moduelList.forEach(item => {
        if (item.need_auth === 1) {
          this.$set(item, 'checked', this.isHaveAccess(item.id))
        } else {
          this.$set(item, 'checked', true)
        }
      });
    },
    isHaveAccess(id) {
      if (this.dialogdata.module_ids) {
        const ids = JSON.parse(this.dialogdata.module_ids);
        // console.log('ids', ids, id, ids.includes(id))
        return ids.includes(id);
      }
      return false;
    },
    selectAll() {
      console.log('select all');
      this.allModuleChecked = !this.allModuleChecked;
      this.moduelList.forEach(item => {
        if (item.need_auth === 1) {
          item.checked = this.allModuleChecked;
        } else {
          item.checked = true
        }
      });
    },
    selectRow(info) {
      console.log('select row', info);
      const checkflag = !info.list[0].checked;
      info.list.forEach(item => {
        // if (item.need_auth === 1)
        {
          item.checked = checkflag;
        }
      });
    },
    selectOne(info) {
      console.log('select one', info);
      info.checked = !info.checked;
    },

    editShowBefore() {
      this.updateCheckList();
    },
    copy(value) {
      const changedata = Object.assign({}, value);
      changedata.module_ids = value.module_ids
      this.sendAdd(changedata)
    },
    dialogClick(nowdata) {
      const olddata = Object.assign({}, this.dialogdata);
      let changedata = Object.assign({}, nowdata);

      const ids = [];
      this.moduelList.forEach(item => {
        if (item.need_auth === 1 && item.checked) {
          ids.push(item.id);
        }
      });
      console.log('edit nowdata', nowdata);
      console.log('edit before', this.dialogdata);
      changedata.module_ids = JSON.stringify(ids);
      if (this.dialogtitle === '新增') {
        this.sendAdd(changedata)
      } else {
        changedata = util.getChange(changedata, olddata);
        changedata.id = olddata.id
        this.sendEdit(changedata)
      }
    }

  },
  created() {
    this.initNameList();
    this.fieldList.forEach(item => {
      if (item.changeable) {
        this.$set(this.dialogdata, item.name, undefined)
      }
    })
    this.search = { is_sys: 0 }
    util.filterField(this.fieldList, this.showfieldList, true, 'id', 'is_sys', 'module_ids');
    this.getData();
  }
}
</script>

<style scoped>
.all-module{
  height: 50px;
}

.modulebox{
  /* background-color: gray; */
}

.module-table{
  width: 100%;
}

.module-cell{
  display: inline-block;
  padding: 10px;
  
}

.main-module-cell{
  display: inline-block;
}

.table-tr{
  border-bottom: 1px solid #ebeef5;
  height: 40px;
}

.table-tr:hover{
  background-color: rgb(245, 245, 245)
}
</style>
