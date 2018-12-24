<template>
    <transition name="dailog-fade">
        <div  class="dailog-box">
            <div class="dailog-mask" @click.stop="close"></div>
            <div class="dailog-content" style="height: 100%;"  flex="dir:top main:center cross:center" >
                <i @click.stop="close" class="iconfont zyx-close closebtn" ></i>
                <img  class="picviewbox" :src="picpath+suffix">
            </div>
        </div>
    </transition>
</template>

<script>

import mymix from 'src/mixin'
export default{
  name: 'picview',
  mixins: [mymix],
  data() {
    return {
    }
  },
  props: {
    picpath: {
      type: String

    }
  },
  watch: {

  },
  components: {


  },
  methods: {
    close() {
      this.$emit('close')
    }

  },

  created() {
  }
}
</script>

<style scoped>
.closebtn{
    position: fixed;
    right:0;
    cursor: pointer;
    top:0;
        color: #151414;
    font-size:50px;

}
.picviewbox{
    max-width: 100%;
    max-height: 100%;
}
</style>
