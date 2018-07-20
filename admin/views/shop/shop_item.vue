<template>
    <div>
        <common-search :search="search" :searchFieldList="searchFieldList" v-on:search="searchClick"></common-search>
        <!-- 表格  -->
        <common-table ref="tablebox" :showfieldList="showfieldList" :dataList="dataList" v-on:sort="sort">
            <template slot="topbtn">
               <button @click="add()" class="button-common">新增</button>
            </template>
             
            <template slot="rowbtn" slot-scope="slotProps">
                 <a class="button-common" @click.stop="del(slotProps.value)">删除</a>
                 <a class="button-common" @click.stop="edit(slotProps.value)">修改</a>
                 <a class="button-common" v-show="slotProps.value.is_onsale===0" @click.stop="onsale(slotProps.value)">上架</a>
                 <a class="button-common" v-show="slotProps.value.is_onsale===1" @click.stop="downsale(slotProps.value)">下架</a>
                 <a class="button-common" @click.stop="copy(slotProps.value)">复制</a>
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
            <template  slot="edititembox" slot-scope="slotProps">
              <div class="tabbox">
                  <div class="head-list">
                     <div  :key="'head'+tab.name" v-for="tab in tabList" class="headbox" :class="{'is-active':DiaActiveName===tab.name}" @click="DiaActiveName=tab.name">
                      {{tab.title}}
                    </div>
                  </div>
                  <div class="content-list">
                    <template v-for="field in fieldList" v-if="field.changeable">
                      <template v-if="field.tab==='spec'&&DiaActiveName==='spec'">
                        <div :key="field.name" class="spec-editbox">
                          <div class="titlebox">设置</div>
                          <div class="tablebox">
                            <table>
                              <tbody>
                              <tr  :key="'spec'+index" v-for="(spec,index) in slotProps.value[field.name].specList">
                                <td class="name">{{spec.name}}</td>
                                <td>
                                  <div class="tag-list">
                                    <div :key="'tag'+item_index" v-for="(item,item_index) in spec.list" class="tag-item" >
                                     <span style="display:inlineblock;position: relative;">
                                       {{item.name}}
                                    </span>
                                      <i class="el-icon-close" @click="delSpecTag(slotProps.value,item_index,index)"></i>
                                    </div>
                                    <div class="tag-item button tag-add" @click="addSpecTag(slotProps.value,index,slotProps.value,slotProps.value)">
                                      <img src="~assets/img/iconadd.png">
                                    </div>
                                  </div>
                                </td>
                                <td>
                                   <button class="button-common" @click="delspec(slotProps.value,index,slotProps.value)">删除规格</button>
                                </td>
                              </tr>
                            </tbody>  
                            </table>
                            <button class="button-common" @click="addSpec(slotProps.value)">添加规格</button>

                          </div>
                        </div>
                        <div :key="field.name+'listbox'" class="listbox">
                          <div class="titlebox">组合列表</div>
                           <div class="tablebox">
                              <table>
                                <thead  class="table-thead"><tr><th>规格</th><th>价格</th><th>库存</th><th>图片</th><th>编码</th></tr></thead>
                                <tbody>
                                  <tr :key="'detail'+index" v-for="(dataitem,index) in slotProps.value[field.name].detailList">
                                    <td>{{getSpecName(slotProps.value,dataitem.namearr)}}</td>
                                    <td><input v-model="dataitem.price"></td>
                                    <td><input v-model="dataitem.store_num"></td>
                                    <td><common-pic-input showimg :picpath="dataitem.pic" v-on:updatepic="dataitem.pic=arguments[0]"></common-pic-input></td>
                                    <td><input v-model="dataitem.code"></td>
                                  </tr>
                                </tbody>
                              </table>
                           </div>
                        </div>
                      </template>
                      <template v-else-if="field.tab===DiaActiveName">
                        <common-dailog-item v-on:change="slotProps.value[field.name]=arguments[0]" :key="field.name" :field="field" :value="slotProps.value[field.name]"></common-dailog-item>
                      </template>
                      <template v-else-if="!field.tab&&DiaActiveName==='base'">
                        <common-dailog-item v-on:change="slotProps.value[field.name]=arguments[0]" :key="field.name" :field="field" :value="slotProps.value[field.name]"></common-dailog-item>
                      </template>
                    </template>
                  </div>
              </div>
            </template>
        </add-dialog>

         <add-dialog 
            v-if="addSpecShow"
            title="新增规格"
            :fieldList="addSpecFieldList" 
            :dialogdata="addSpecData" 
            v-on:close="addSpecShow=false" 
            v-on:sure="addSpecOk">
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
import CommonPicInput from 'src/views/common/common_inputpic'

import conf from 'src/config'
import CommonDailogItem from 'src/views/common/common_dialog_item'
export default{
  mixins: [myMixin],
  data() {
    return {
      imgMini: conf.miniurl,
      dataList: model[this.modelName].list, // 用户列表
      fieldList: model[this.modelName].fieldList, // 字段列表
      dialogShow: false,
      dialogdata: {},
      addSpecShow: false,
      // addSpecFieldList: [{ name: 'name', title: '规格名', changeable: true }, { name: 'spectype', title: '规格类型', changeable: true, selectList: global.specType }],
      addSpecFieldList: [{ name: 'name', title: '规格名', changeable: true }],
      addSpecData: { name: '', spectype: 1 },
      tabList: [{ name: 'base', title: '基础信息' }, { name: 'spec', title: '商品规格' }, { name: 'pics', title: '商品图片' }, { name: 'desc', title: '详情' }],
      DiaActiveName: 'base',
      tagList: model.shoptag.list,
      dialogtitle: '',
      specbefore: ''
    }
  },
  watch: {
  },
  components: {
    AddDialog,
    CommonPicInput,
    CommonDailogItem,
    CommonTable,
    CommonTd,
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
    delspec(iteminfo, specindex) {
      iteminfo.spec.specList.splice(specindex, 1)
      this.updataSpecId(iteminfo.spec)
      this.updateAllDetail(spec)
    },
    // 删除一个标签
    delSpecTag(iteminfo, tagindex, specindex) {
      const specinfo = iteminfo.spec.specList[specindex]
      specinfo.list.splice(tagindex, 1)
      this.updataTagId(iteminfo.spec, specindex);
      this.updateAllDetail(iteminfo)
    },
    // 增加一个标签
    addSpecTag(iteminfo, specindex) {
      // console.log('addSpecTag', spec, specindex, iteminfo)
      const specinfo = iteminfo.spec.specList[specindex]
      this.$prompt('请输入标签名', '新增标签', {
        confirmButtonText: '确定',
        cancelButtonText: '取消'
      }).then(({ value }) => {
        if (value === '') {
          this.$message({ message: '标签名不能为空', type: 'error', duration: 1000 })
          return;
        }
        specinfo.list.push({ name: value, id: 1 })
        this.updataTagId(iteminfo.spec, specindex);
        this.updateAllDetail(iteminfo)
      }).catch(() => {
        this.$message({
          type: 'info',
          message: '取消输入'
        });
      });
    },
    updataTagId(spec, specindex) {
      const specinfo = spec.specList[specindex]
      specinfo.list.forEach((item, index) => {
        item.id = index
      })
    },
    updataSpecId(spec) {
      spec.specList.forEach((item, index) => {
        item.id = index
      })
    },
    updataAllId(spec) {
      spec.specList.forEach((item, index) => {
        item.id = index
        this.updataTagId(spec, index)
      })
    },

    updateAllDetail(iteminfo) {
      const spec = iteminfo.spec
      spec.detailList.splice(0)
      const tagList = [];
      if (spec.specList.length <= 0) {
        return;
      }
      const remainarr = spec.specList.slice(1)
      const addchildTag = function(remainarr, namearr) {
        if (remainarr.length === 0) {
          tagList.push(namearr);
          return;
        }
        remainarr.forEach((spec, cur_specindex) => {
          const newremainarr = remainarr.slice(cur_specindex + 1)
          spec.list.forEach(tag => {
            const newnamearr = namearr.slice();
            newnamearr.push({ specid: spec.id, tagid: tag.id })
            return addchildTag(newremainarr, newnamearr)
          })
        })
      }

      const namearr = []
      const firstspecinfo = spec.specList[0]
      firstspecinfo.list.forEach(tag => {
        namearr.push({ specid: firstspecinfo.id, tagid: tag.id })
        addchildTag(remainarr, namearr)
      })

      console.log('tagList', tagList, this.dialogdata)
      tagList.forEach(namearr => {
        spec.detailList.push({
          namearr,
          pic: '',
          code: iteminfo.code || '',
          store_num: iteminfo.store_num || 0,
          price: iteminfo.price || 0
        })
      })
    },

    // 获取标签名字
    getSpecName(iteminfo, arr) {
      let name = '';
      const spec = iteminfo.spec
      arr.forEach(item => {
        const specindex = item.specid
        const tagindex = item.tagid
        const specinfo = spec.specList[specindex]
        name += specinfo.name + ':' + specinfo.list[tagindex].name + ';'
      })
      return name
    },
    // 增加一个规格
    addSpec(iteminfo) {
      this.addSpecData.spec = iteminfo.spec
      this.addSpecShow = true;
    },
    addSpecOk(data) {
      if (!data.name) {
        this.$message({ message: '名称不能为空', type: 'error', duration: 1000 })
        return;
      }
      this.addSpecData.spec.specList.push({
        name: data.name,
        id: this.addSpecData.spec.specList.length,
        list: []
      })
      this.addSpecShow = false;
    },
    editShowBefore() {
      this.dialogdata.item_type = util.getSelectArr(model.shopitemtype.list, this.dialogdata.item_type, 'id');
      this.specbefore = JSON.stringify(this.dialogdata.spec)
    },
    dialogClick(nowdata) {
      console.log('edit dailogdata', nowdata);
      const olddata = Object.assign({}, this.dialogdata);
      let changedata = Object.assign({}, nowdata);

      if (changedata.item_type) {
        changedata.item_type = changedata.item_type[changedata.item_type.length - 1]
      }
      if (olddata.item_type) {
        olddata.item_type = olddata.item_type[olddata.item_type.length - 1]
      }
      changedata.spec = JSON.stringify(changedata.spec);
      olddata.spec = this.specbefore;
      changedata.pics = JSON.stringify(changedata.pics);
      olddata.pics = JSON.stringify(olddata.pics);
      changedata.tag = JSON.stringify(changedata.tag);
      olddata.tag = JSON.stringify(olddata.tag);
      if (this.dialogtitle === '新增') {
        this.sendAdd(changedata)
      } else {
        changedata = util.getChange(changedata, olddata);
        changedata.id = olddata.id
        this.sendEdit(changedata)
      }
    },
    addResolve(data, key) {
      // console.log('addResolve key', key)
      if (key === 'spec') {
        data.spec = { specList: [], detailList: [] }
        return true;
      }
      return false
    },
    copy(value) {
      const adddata = Object.assign({}, value);
      adddata.spec = JSON.stringify(adddata.spec);
      adddata.pics = JSON.stringify(adddata.pics);
      adddata.tag = JSON.stringify(adddata.tag);
      adddata.name = adddata.name.replace(/_{[\d]+}/, '')
      adddata.code = adddata.code.replace(/_{[\d]+}/, '')
      // console.log('name', adddata.name)
      adddata.name = adddata.name + '_{' + (new Date()).valueOf() + '}'
      adddata.code = adddata.code + '_{' + (new Date()).valueOf() + '}'
      adddata.id = undefined;
      this.sendAdd(adddata)
    },
    onsale(value) {
      const changedata = {};
      changedata.is_onsale = 1
      changedata.id = value.id;
      this.sendEdit(changedata)
    },
    downsale(value) {
      const changedata = {};
      changedata.is_onsale = 0
      changedata.id = value.id;
      this.sendEdit(changedata)
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
      if (item.changeable) {
        this.$set(this.dialogdata, item.name, undefined)
      }
    })
     // 初始化搜索相关数据
    util.filterField(this.fieldList, this.searchFieldList, false, 'name', 'is_onsale', 'code', 'item_type', 'brand', 'tag');
    // 初始化表格需要显示的字段
    // util.filterField(this.fieldList, this.showfieldList, false, 'iteminfo', 'order_id', 'price', 'store_num', 'sell_num', 'is_onsale');
    util.filterField(this.fieldList, this.showfieldList, false, 'icon', 'name', 'code', 'item_type_name', 'brand_name', 'tag', 'price', 'store_num', 'sell_num', 'is_onsale');
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
