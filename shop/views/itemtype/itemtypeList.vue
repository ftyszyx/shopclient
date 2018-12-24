<template>
  <div style="width: 100%;"  flex="dir:top main:left cross:left">
     <div class="titletext">{{title}}</div>
    <div  style="padding: 5px 0px;" class="item-wrap-parent">
      <div :key="childitem.id" v-for="childitem in itemlist"  class="wrapitembox">
        <item-type-item :iteminfo="childitem" v-on:gototype="gotoItemType"></item-type-item>
      </div>
    </div>
  </div>
</template>

<script>
import ItemTypeItem from './itemtypeitem'
// 框架
export default{
  name: 'itemtypelist',
  data() {
    return {
    }
  },
  components: {
    ItemTypeItem
  },
  props: {
    title: '',
    itemlist: {
      type: Array,
      default() {
        return [];
      }
    }
  },
  methods: {
    gotoItemType(itemtypeid) {
      console.log("go to",itemtypeid)
      this.$emit('gototype', itemtypeid)
    }
  },
  created() {
  }
}
</script>

<style scoped>
.titletext{
  font-size: 15px;
  font-weight: bold;
  overflow: hidden;
  white-space: nowrap;
}


.item-wrap-parent{

}

.wrapitembox{
  cursor: pointer;
  width:30%;
  display: inline-block;
}
</style>
