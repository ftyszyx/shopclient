<template>
   <div class="itembox" flex="dir:left main:left cross:center" @click="gotoitem()">
        <img class="itempic" v-if="(iteminfo.icon||'')!=''" :src="iteminfo.icon+suffix">
        <img class="itempic" v-else src="~common/img/upload-common-select.png">
        <div flex-box="1" class="iteminfo " flex="dir:top main:left cross:left">
            <div flex-box="1">{{iteminfo.name}}
              <!-- <span style="color:red" v-if="iteminfo.sell_num>0">(总销量：{{iteminfo.sell_num}}{{iteminfo.item_unit}})</span> -->
              </div>

            <div style="color:red;">￥{{getGroupPrice(iteminfo.price, iteminfo.group_price)}}</div>
            <img class="addcartbtn" src="~assets/img/cart_check.png" @click.stop="addcart(iteminfo)">
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
