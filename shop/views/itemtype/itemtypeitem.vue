<template>
   <li class="typeitem-box" @click="gotoItemType(iteminfo)" flex="dir:top main:left cross:center">
        <template v-if="iteminfo.pic">
            <img :src="iteminfo.pic">
        </template>
        <template v-else>
            <img src="~common/img/upload-common-select.png">
        </template>
        <p>{{iteminfo.name}}</p>
    </li>
</template>

<script>

// 框架
export default{
  name: 'itemtypeitem',
  data() {
    return {
    }
  },
  props: {
    iteminfo: {
      type: Object
    }
  },
  methods: {
    gotoItemType(iteminfo) {
      this.$emit('gototype', iteminfo.id)
    }
  },
  created() {
  }
}
</script>

<style scoped>
.typeitem-box{
  /* width:30%; */
  padding: 5px 5px;
}

.typeitem-box img{
  min-width: 60px;
  min-height: 60px;
  max-height: 100%;
  max-width: 100%;
}

.typeitem-box p{
  overflow: hidden;
  /* white-space: nowrap; */
  font-size: 12px;
  color: #0a0a0a;
  padding: 5px 0;
  width: 100%;
  text-align: center;
}

</style>
