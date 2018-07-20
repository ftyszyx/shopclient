<template>
<div>
      <mt-header fixed title="类型筛选">
          <div  @click="goback()" slot="left">
            <i class="mintui mintui-back"></i>
            <span>返回</span>
          </div>
        </mt-header>
        <div style="margin-top:40px;">
          <item-type-filter  v-on:goto="gotoItemType" style="width=100%;height:100vh;"></item-type-filter>
        </div>
</div>
 
</template>

<script>
import ItemTypeFilter from 'views/itemtype/itemtypefilter'
import mymix from 'src/mixin'
import models from 'src/model/index.js'

// 框架
export default{
  mixins: [mymix],
  data() {
    return {
    }
  },
  watch: {

  },
  components: {
    ItemTypeFilter
  },

  methods: {
    gotoItemType(item_type) {
      models.app.search.item_type = item_type
      this.$router.push({ path: '/search' });// 跳转到登录页面
    }
  },
  created() {
  }
}
</script>

<style scoped>
</style>
