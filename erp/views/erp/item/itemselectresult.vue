<!-- 选择多个商品 -->
<template>
<div class="itemlist-box">
   <!-- 表格  -->
   <common-table :showoper="showoper" ref="tablebox" :showfieldList="showfieldList" :dataList="dataList" :showCheck="showCheck" v-on:sort="sort">
      <template slot="topbtn">
        <button v-show="showAdd" @click="itemSelectPanel=true" class="button-common">新增</button>
        <button v-show="showDel" @click="del()" class="button-common">删除</button>
      </template>
      <template slot="rowbox" slot-scope="slotProps">
            <td :key="field.name" v-for="field in showfieldList" >
            <template v-if="field.name=='num'">
              <template v-if="changeNum">
                <span class="btn-del" @click="delone(slotProps.value)">-</span>
                  <input v-model.number="slotProps.value.num" class="input-box" style="width:90px;">
                <span class="btn-add" @click="slotProps.value.num=slotProps.value.num+1">+</span>
              </template>
              <template v-else>
                  {{slotProps.value.num}}
              </template>
            </template>
            <template v-else-if="field.name=='price'">
              <template v-if="changePrice">
                <input v-model.number="slotProps.value.price" class="input-box" style="width:100px;">
              </template>
              <template v-else>
                  {{slotProps.value.price}}
              </template>
            </template>
            <template v-else-if="field.name=='total_price'">
                {{(slotProps.value.price*slotProps.value.num).toFixed(2)}}
            </template>
            <template v-else>
                  <common-td :field="field" :value="slotProps.value[field.name]"></common-td>
            </template>
          </td>
      </template>
      <template slot="rowbtn" slot-scope="slotProps">
            <a v-show="showDel" class="button-common" @click.stop="del(slotProps.value)">删除</a>
      </template>
  </common-table>
    <!-- 商品列表 -->
  <div class="dialog-mask" v-if="itemSelectPanel">
    <div class="dialog"  style="width:80%;margin-top:10px;">
      <div class="header">
        <span class="title">选择商品</span>
        <span class="close" @click="itemSelectPanel=false">X</span>
      </div>
      <div class="content">
          <item-select  showCheck ref="itemDailog"></item-select>
      </div>
       <div class="footer">
          <button class="button button-blue" @click="selectitemOK">确 定</button>
      </div>
    </div>
  </div>
</div>
</template>

<script>
import model from 'src/model'
import util from 'common/utils'
import ItemSelect from 'views/erp/item/itemselect.vue'
// import AddDialog from 'src/views/common/common_dialog';
import CommonTable from 'common/components/common_table'
import CommonTd from 'common/components/common_td'
import { all } from 'common/api'
import myMixin from 'common/mixin/admin.js'

const dataModel = model.item;
export default{
  name: 'itemSelectResult',
  data() {
    return {
      totalsize: 0, // 总数量
      fieldList: dataModel.fieldList, // 字段列表
      showfieldList: [],
      checkAll: false,
      dataList: [],
      itemSelectPanel: false
    }
  },
  mixins: [myMixin],
  components: {
    // AddDialog,
    CommonTd,
    CommonTable,
    ItemSelect
  },
  props: {
    showTableFiled: { // 显示的表格字段
      type: Array,
      default() {
        return [];
      }
    },
    showoper: { type: Boolean, default: true },
    itemlist: {
      type: Array,
      default() {
        return [];
      }
    },
    showCheck: {
      type: Boolean,
      default: false
    },
    showDel: {
      type: Boolean,
      default: false
    },
    showAdd: {
      type: Boolean,
      default: false
    },
    changePrice: {
      type: Boolean,
      default: false
    },

    changeNum: {
      type: Boolean,
      default: false
    }
  },
  watch: {
    itemlist() {
      console.log('itemlist update', this.itemlist);
      this.getData();
    }
  },
  methods: {
    delone(item) {
      console.log('del one');
      item.num = item.num > 0 ? item.num - 1 : 0;
    },
    del(iteminfo) {
      console.log('del ', iteminfo);
      if (iteminfo) {
        iteminfo.checked = true;
      }
      this.dataList.forEach((item, index) => {
        if (item.checked) {
          this.dataList.splice(index, 1);
        }
      })
    },
    selectitemOK() {
      console.log('select item ok');
      const itemlist = this.$refs.itemDailog.dataList;
      this.itemSelectPanel = false;
      itemlist.forEach(item => {
        if (item.checked) {
          const findindex = this.dataList.findIndex(haveitem => item.id === haveitem.id)
          if (findindex < 0) {
            this.$set(item, 'num', 0);
            this.$set(item, 'price', 0);
            this.dataList.push(item);
          }
        }
      })
    },
    getData() {
      // 初始化商品信息
      const haveitem = []
      this.dataList.splice(0);
      this.itemlist.forEach(item => {
        this.dataList.push(item);
        haveitem.push(item.id);
      })
      if (haveitem.length > 0) {
        const search = {};
        search.id = ['in', haveitem];
        all('item', null, null, null, search).then(
        response => {
          util.copyList(response.list, this.dataList, item => {
            // model.item.initData(item)
            const iteminfo = this.itemlist.find(x => x.id === item.id)
            item.num = iteminfo.num
            item.in_store_num = iteminfo.in_store_num
            item.price = iteminfo.price
          })
        }
        ).catch(error => {
          console.log('error', error);
        });
      }
    }
  },
  created() {
    const defaultarr = ['name', 'barcode', 'code', 'sell_base_num', 'milk_period']
    this.showTableFiled.forEach(item => {
      defaultarr.push(item)
    })
    util.filterField(this.fieldList, this.showfieldList, false, defaultarr);
    this.getData();
  }
}
</script>

<style scoped>


.itemlist-box{
  background-color: #fff;
  border: 1px solid #dcdfe6;
  color: #606266;
  border-radius: 3px;
  padding: 9px 15px;
}

</style>
