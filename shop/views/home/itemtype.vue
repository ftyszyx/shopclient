<template>
  <div>
      <!-- 搜索 -->
      <div  class="header">
          <mt-search v-model="app.search.name" v-on:searchok="gotoSearch"></mt-search>
      </div>
      <item-type-filter v-on:goto="gotoItemType" style="margin-top:44px;"></item-type-filter>
  </div>
</template>

<script>
import ItemTypeFilter from 'views/itemtype/itemtypefilter'

import models from 'src/model/index.js'
import mymix from 'src/mixin'
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
.header{
  position: fixed;
  top: 0;
  left: 0;
  right: 0;
}
</style>
