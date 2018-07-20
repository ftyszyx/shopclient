<template>
  <div
    class="banner_item"
    v-show="ready"
    :style="{
      msTransform: `translateX(${ translate }px) scale(${ scale })`,
      webkitTransform: `translateX(${ translate }px) scale(${ scale })`,
      transform: `translateX(${ translate }px) scale(${ scale })`
    }">
    <slot></slot>
  </div>
</template>

<script>
  export default {
    name: 'CarouselItem',
    data() {
      return {
        translate: 0,
        scale: 1,
        ready: false
      };
    },

    methods: {
      translateItem(index, activeIndex) {
        console.log('translateItem');
        const parentWidth = this.$parent.$el.offsetWidth;
        this.translate = parentWidth * (index - activeIndex);
        this.ready = true;
      }
    },

    created() {
      this.$parent && this.$parent.updateItems();
    },

    destroyed() {
      this.$parent && this.$parent.updateItems();
    }
  };
</script>
<style scoped>
.banner_item{
  position: absolute;
  top: 0;
  left: 0;
  width:100%;
  height: 100%;
  display: inline-block;
  overflow: hidden;
  transition: .4s ease-in-out;
  /* z-index: 0; */
}
</style>