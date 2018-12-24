<template>
<div>
  <buy-in-select ref="buyinView" :canOper="true" v-on:edit="edit"  v-on:check="check" v-on:detail="detail"   v-on:add="add"  ></buy-in-select>
  <!-- 订单详情 -->
  
   <add-dialog 
        v-if="dialogShow"
        :title="dialogtitle"
        :fieldList="fieldList" 
        :dialogdata="dialogdata" 
        v-on:close="dialogShow=false" 
        :showfooter="dialogtitle!=='订单详情'"
        v-on:sure="dialogClick">
        <template  slot="edititembox" slot-scope="slotProps">
            <template  v-for="field in fieldList" v-if="field.changeable">
              <template v-if='field.name==="item_info"'>
                <template v-if="dialogtitle=='订单详情'">
                  <item-select-result :key="field.name" :showoper="false" :showTableFiled="['num','in_store_num','price','total_price']"   ref="itemlistID" :itemlist="selectItemList" ></item-select-result>
                </template>
                <template v-else>
                  <item-select-result :key="field.name" :showTableFiled="['num','price','total_price']" showCheck showAdd showDel  changePrice changeNum  ref="itemlistID" :itemlist="selectItemList" ></item-select-result>
                </template>
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

import model from 'src/model'
import util from 'common/utils'
import ItemSelectResult from 'views/erp/item/itemselectresult'
import { post } from 'common/api'
import BuyInSelect from './buyinselect';
import AddDialog from 'src/views/common/common_dialog';
import CommonDailogItem from 'src/views/common/common_dialog_item'
import myMixin from 'common/mixin/admin.js'
export default{
  mixins: [myMixin],
  data() {
    return {
      dataList: model[this.modelName].list, // 用户列表
      fieldList: model[this.modelName].fieldList, // 字段列表
      dialogShow: false,
      showItemResultPanel: false,
      dialogdata: {},
      selectItemList: [],
      dialogtitle: '',
      userList: [] // 可选 的用户列表
    }
  },
  components: {
    ItemSelectResult,
    CommonDailogItem,
    AddDialog,
    BuyInSelect
  },
  props: {
    serverModelName: {// 服务器对应的control名
      type: String,
      default: 'buy_in'
    },
    modelName: {// 本地对应的模块名
      type: String,
      default: 'buyIn'
    }
  },
  watch: {
  },
  methods: {

    // 详细
    detail(item) {
      console.log('detail', item);

      this.dialogtitle = '订单详情';
      Object.assign(this.dialogdata, item);
      // this.dialogdata.item_info = [];
      this.selectItemList.splice(0);
      if (item.item_info) {
        const itemlist = JSON.parse(item.item_info)
        itemlist.forEach(temp => {
          this.selectItemList.push({ id: temp.id, num: temp.num, price: temp.price, in_store_num: temp.inStore });
        });
      }
      console.log('detail', this.selectItemList);
      this.dialogShow = true;
    },
    editShowBefore(item) {
      console.log('edit before item', item)
      this.selectItemList.splice(0);
      const itemlist = JSON.parse(item.item_info);
      itemlist.forEach(temp => {
        this.selectItemList.push({ id: temp.id, num: temp.num, price: temp.price, inStore: temp.inStore });
      });
    },
    addShowBefore() {
      this.selectItemList.splice(0);
    },
    dialogClick(nowdata) {
      console.log('edit nowdata', nowdata);
      console.log('edit before', this.dialogdata);
      const olddata = Object.assign({}, this.dialogdata);
      let changedata = Object.assign({}, nowdata);
      const itemlist = this.$refs.itemlistID[0].dataList;
      changedata.item_info = [];
      itemlist.forEach(item => {
        if (item.num) {
          changedata.item_info.push({ id: item.id, num: item.num, price: item.price });
        }
      })
      // console.log('changedata.item_info', changedata.item_info);
      changedata.item_info = JSON.stringify(changedata.item_info)
      if (this.dialogtitle === '新增') {
        changedata.item_info = JSON.parse(changedata.item_info)
        this.sendAdd(changedata)
      } else {
        changedata = util.getChange(changedata, olddata);
        changedata.id = olddata.id
        // console.log('changedata.item_info', changedata.item_info);
        if (changedata.item_info) {
          changedata.item_info = JSON.parse(changedata.item_info)
        }

        this.sendEdit(changedata)
      }
    },
    check(item) {
      // 通过审核
      let checkarr = []
      if (item) {
        checkarr = util.getCheckdItem(this.dataList);
      } else {
        checkarr = [item.id]
      }

      post(this.serverModelName, 'checkOk', { id: checkarr })
      .then(() => {
        this.getData();
        this.$message({ message: '审核成功', type: 'success', duration: 1000 })
      })
      .catch(error => {
        console.log('error', error);
      });
    }
  },

  created() {
    this.fieldList.forEach(item => {
      if (item.name === 'check_user') {
        item.selectList = this.userList
      }
      if (item.changeable) {
        this.$set(this.dialogdata, item.name, undefined)
      }
    })
    post('user', 'allAuthUser', { moduleID: model.user.authDic.BuyIn_checkOk.id }).then(
    response => {
      util.copyList(response.list, this.userList)
    }
    ).catch(error => {
      console.log('error', error);
    });
  }
}
</script>

<style scoped>


</style>
