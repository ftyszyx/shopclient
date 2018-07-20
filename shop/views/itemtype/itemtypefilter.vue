<template>
    <div class="content" flex="dir:left main:left cross:left">
        <ul class="content-left" flex="dir:top main:left cross:center" style="border-right: 1px solid #00000045;">
          <li :key="item.id" v-if="item.level===1" v-for="item in datalist" class="leftitem" :class="{select:(selectid===item.id)}" @click="selectParent(item)">
            {{item.name}}
          </li>
        </ul>
        <ul class="content-right flexbox1" flex="dir:top main:left cross:center" style="padding: 5px 5px;">
          <!-- 有子类的 -->
          <item-type-list v-on:gototype="gotoItemType" :title="selectname" :itemlist="noChildList"></item-type-list>
          <template v-for="selectitem in selectList" >
              <item-type-list v-on:gototype="gotoItemType" :key="selectitem.id" :title="selectitem.name" :itemlist="selectitem.children"></item-type-list>
          </template>
        </ul>
      </div>
</template>

<script>
 import models from 'src/model'
 import ItemTypeList from './itemtypeList'
// 框架
export default{
   name: 'itemtypefilter',
   data() {
     return {
       selectList: [], // 没有子节点的类
       noChildList: [], // 有子节点的类
       selectid: 0,
       selectname: '',
       datalist: models.itemtype.list
     }
   },
   components: {
     ItemTypeList
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
       if (iteminfo.children && iteminfo.children.length > 0) {
         this.copyItemList(iteminfo.children)
         this.selectid = iteminfo.id
         this.selectname = iteminfo.name
       } else {
         this.gotoItemType(iteminfo.id)
       }
     },
     initSelectItem() {
       if (this.datalist.length > 0) {
         for (let i = 0; i < this.datalist.length; i++) {
           const iteminfo = this.datalist[i]
           if (iteminfo.level === 1) {
             this.selectid = iteminfo.id
             this.selectname = iteminfo.name
             this.copyItemList(iteminfo.children)
             return;
           }
         }
       }
     }

   },
   created() {
     if (this.datalist.length === 0) {
       models.itemtype.all(() => {
         this.initSelectItem();
       })
     } else {
       this.initSelectItem();
     }
   }
}
</script>

<style scoped>
.content-left{
  width:30%;
}

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

</style>
