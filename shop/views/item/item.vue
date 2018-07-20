<template>
   <div class="itembox" flex="dir:left main:left cross:center" @click="gotoitem()">
        <img class="itempic" v-if="(iteminfo.icon||'')!=''" :src="iteminfo.icon">
        <img class="itempic" v-else src="~common/img/upload-common-select.png">
        <div class="iteminfo flexbox1" flex="dir:top main:left cross:left">
            <div class="flexbox1">{{iteminfo.name}}</div>
            <div style="color:red;">￥{{iteminfo.price}}</div>
            <img class="addcartbtn" src="~assets/img/cart_check.png" @click="addcart(iteminfo)">
        </div>
    </div> 
</template>

<script>

import mymix from 'src/mixin'
// 框架
export default{
  name: 'item',
  mixins: [mymix],
  data() {
    return {

    }
  },
  props: {
    iteminfo: {
      type: Object
    }
  },
  watch: {

  },

  methods: {
    gotoitem() {
      this.$router.push({ path: '/item/' + this.iteminfo.id });
    },
    addcart(iteminfo) {
      this.$emit('addcart', iteminfo)
    }

  },
  created() {
  }
}
</script>

<style scoped>

.addcartbtn{
  position: absolute;
  right: 10px;
  bottom: 10px;
  width: 20px;
}
@import"./item.css"
</style>
