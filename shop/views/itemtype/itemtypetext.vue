<template>
    <transition name="dialog-fade">
        <div  class="dialog-box">
            <div class="dialog-mask" @click="close"></div>
            <div class="dialog-content" flex="dir:top main:center cross:left" >
                <div v-html="iteminfo.intro_text" class="detailinfo"></div>
            </div>
        </div>
    </transition>
</template>

<script>
import mymix from 'src/mixin'
// 加购物车
export default{
  name: 'addcart',
  mixins: [mymix],
  data() {
    return {

    }
  },
  watch: {
  },
  props: {
    iteminfo: {
      type: Object
    }
  },

  methods: {
   
    close() {
      this.$emit('close')
    },
    
    },
  created() {
    
  }


}
</script>

<style scoped>
.dialog-fade-enter-active, .dialog-fade-leave-active{
    transition: all .2s;
}
.dialog-fade-enter, .dialog-fade-leave-to{
    transform:translateY(100%);
    opacity:.4;
}

.dialog-box {
    position: fixed;
    z-index: 3;
    top: 0;
    bottom: 0;
    width: 100%;
}

.dialog-box .dialog-mask {
    position: absolute;
    top: 0;
    bottom: 0;
    width: 100%;
    background-color: rgba(0,0,0,.6);
}

.dialog-box .dialog-content {
    position: absolute;
    bottom: 0;
    width: 100%;
    max-height: 60vh;
    
    background-color: #fff;
}
    .detailinfo{
    position: relative;
    /* overflow: hidden; */
    padding: 10px;
    /* overflow: scroll; */
    background: #fff;
}

</style>
