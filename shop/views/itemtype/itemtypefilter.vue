<template>
    <div class="content" flex="dir:left main:left cross:left">
        <ul  flex="dir:top main:left cross:center" style="border-right: 1px solid #00000045;width:30%;">
          <li :key="item.id" v-if="item.level===1" v-for="item in datalist" class="leftitem" :class="{select:(selectid===item.id)}" @click="selectParent(item)">
            {{item.name}}
          </li>
        </ul>
        <ul   flex="dir:top main:left cross:center" style="padding: 5px 5px;width:70%;" v-if="showitemtypetextPanel===false">
          <!-- 有子类的 -->
          <item-type-list v-on:gototype="gotoItemType" :title="selectname" :itemlist="noChildList"></item-type-list>
          <template v-for="selectitem in selectList" >
              <item-type-list v-on:gototype="gotoItemType" :key="selectitem.id" :title="selectitem.name" :itemlist="selectitem.children"></item-type-list>
          </template>
        </ul>
        <!-- <item-type-text v-on:close="showitemtypetextPanel=false"  :iteminfo="selectiteminfo" v-if="showitemtypetextPanel"></item-type-text> -->
        <div v-html="selectiteminfo.intro_text" class="detailinfo" v-if="showitemtypetextPanel"></div>
      </div>
</template>

<script>
 import models from 'src/model'
//  import ItemTypeText from './itemtypetext'
 import ItemTypeList from './itemtypeList'
// 框架
export default{
   name: 'itemtypefilter',
   data() {
     return {
       selectList: [], // 有子节点的类,带个标题
       noChildList: [], // 没有子节点的类 
       selectid: 0,
       showitemtypetextPanel: false,
       selectiteminfo: {},
       selectname: '',
       datalist: models.itemtype.list
     }
   },
   components: {
     ItemTypeList,
    //  ItemTypeText
   },
   methods: {
     gotoItemType(item_type) {
       this.$emit('goto', item_type)
     },
     copyItemList(selectList) {
       this.noChildList.splice(0)
       this.selectList.splice(0)
       if (selectList) {
         selectList.forEach(element => {
           if (element.children && element.children.length > 0) {
             this.selectList.push(element)
           } else {
             this.noChildList.push(element)
           }
         });
       }
     },
     selectParent(iteminfo) {
      //  console.log("select ",iteminfo,iteminfo.intro_text+'')
       if(iteminfo.intro_text) {
         this.selectiteminfo = iteminfo;
         this.showitemtypetextPanel = true;
         this.copyItemList([])
         this.selectid = iteminfo.id
         this.selectname = iteminfo.name
        //  console.log("showitemtypetextPanel ",this.showitemtypetextPanel)
         return;
       }else{
         this.showitemtypetextPanel = false;
          models.itemtype.allCommon(() => {
//            this.initSelectItem();
  
             if (iteminfo.children && iteminfo.children.length > 0) {
                this.copyItemList(iteminfo.children)
                this.selectid = iteminfo.id
                this.selectname = iteminfo.name
              } else {
                this.gotoItemType(iteminfo.id)
              }
          }, { is_del: 0,parent_id:iteminfo.id })
       }
     },
     initSelectItem() {
       if (this.datalist.length > 0) {
         for (let i = 0; i < this.datalist.length; i++) {
           const iteminfo = this.datalist[i]
           if (iteminfo.level === 1) {
             this.selectid = iteminfo.id
             this.selectname = iteminfo.name
             this.selectParent(iteminfo)
             this.copyItemList(iteminfo.children)
             return;
           }
         }
       }
     }

   },
   created() {
     if (this.datalist.length === 0) {
       models.itemtype.allCommon(() => {
         console.log('init itemlist')
         this.initSelectItem();
       }, { is_del: 0,level:1 })
     } else {
       this.initSelectItem();
     }
   }
}
</script>

<style scoped>


.select{
  border-left:4px solid #FF4E00;
  color: #FF4E00;
}

.leftitem{
    border-bottom: 1px solid #00000045;
    font-size: 14px;
    line-height: 40px;
    width: 100%;
    overflow: hidden;
    cursor: pointer;
    white-space: nowrap;
    text-align: center;
}
.titletext{
  font-size: 15px;
  font-weight: bold;
  overflow: hidden;
  white-space: nowrap;
}

  .detailinfo{
    /* position: relative; */
    overflow: hidden;
    padding: 10px;
    overflow: scroll;
    height: 100vh;
    background: #fff;
}
</style>
