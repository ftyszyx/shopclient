<template>
  <div style="width: 100%;"  flex="dir:top main:left cross:left">
     <div class="titletext">{{title}}</div>
    <div flex="dir:left main:left cross:center" style="padding: 5px 0px;" class="itemlist">
        <item-type-item :iteminfo="childitem" :key="childitem.id" v-for="childitem in itemlist" v-on:gototype="gotoItemType"></item-type-item>
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

.itemlist{
  flex-wrap:wrap;
}
</style>
