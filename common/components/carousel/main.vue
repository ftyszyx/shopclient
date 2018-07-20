<template>
  <div class="scroll-banner" :style="{ height: height }" @mouseenter.stop="handleMouseEnter"
    @mouseleave.stop="handleMouseLeave">
    <slot></slot>
    
    <button v-show="hover" class="arrow arrow-left"  @click="go_pre">
      <img src='~assets/img/arrow-left.png'></img>
    </button>
    <button v-show="hover" class="arrow arrow-right"  @click="go_next">
      <img src='~assets/img/arrow-left.png'></img>
    </button>
    <ul class="banner_point">
    <li v-for="(item,index) in items" class="point" :class="{ 'is-active': index === activeIndex }" @mouseenter="handleIndicatorHover(index)" @click.stop="handleIndicatorClick(index)">
      <button></button>
    </li>
    </ul>
  </div>
</template>

<script>
// 轮播
export default {
  name: 'Carousel',
  props: {
    height: String,
    autoplay: {
      type: Boolean,
      default: true // 是否自动播放
    },
    interval: {
      type: Number,
      default: 3000 // 间隔时间
    }
  },

  data() {
    return {
      items: [],
      activeIndex: -1,
      containerWidth: 0,
      timer: null,
      hover: false
    };
  },

  watch: {
    activeIndex(val, oldVal) {
      this.resetItemPosition();
      this.$emit('change', val, oldVal);
    },

    autoplay(val) {
      val ? this.startTimer() : this.pauseTimer();
    }
  },

  methods: {
    handleMouseEnter() {
      console.log('handleMouseEnter');
      this.hover = true;
      this.pauseTimer();
    },

    handleMouseLeave() {
      console.log('handleMouseLeave');
      this.hover = false;
      this.startTimer();
    },

    go_next() {
      this.changeitem(this.activeIndex + 1);
    },
    go_pre() {
      this.changeitem(this.activeIndex - 1);
    },

    changeitem(num) {
      console.log('change', num);
      if (num > this.items.length - 1) {
        this.activeIndex = 0;
      } else if (num < 0) {
        this.activeIndex = this.items.length - 1;
      } else {
        this.activeIndex = num;
      }
    },

    updateItems() {
      // console.log('upateitems');
      this.items = this.$children.filter(child => child.$options.name === 'CarouselItem');
      this.changeitem(this.activeIndex);
    },

    resetItemPosition() {
      console.log('resetItemPosition', this.items.length)
      this.items.forEach((item, index) => {
        console.log('resetitem', index)
        item.translateItem(index, this.activeIndex);
      });
    },


    pauseTimer() {
      console.log('pauseTimer');
      clearInterval(this.timer);
    },

    startTimer() {
      console.log('starttimer');
      if (this.interval <= 0 || !this.autoplay) return;
      this.timer = setInterval(this.go_next, this.interval);
    },

    handleIndicatorClick(index) {
      this.activeIndex = index;
    },

    handleIndicatorHover(index) {
      if (this.trigger === 'hover' && index !== this.activeIndex) {
        this.activeIndex = index;
      }
    }
  },

  mounted() {
    this.updateItems();
    this.$nextTick(() => {
      // this.updateItems();

      this.resetItemPosition();
      this.startTimer();
    });
  }
};
</script>

<style scoped>

.scroll-banner{
  overflow-x:hidden;
  position: relative;
  text-align: center;
}

.scroll-banner .arrow{
    border: none;
    outline: none;
    padding: 0;
    margin: 0;
    width: 36px;
    height: 36px;
    cursor: pointer;
    transition: .3s;
    border-radius: 50%;
    background-color: rgba(31,45,61,.11);
    color: #fff;
    position: absolute;
    top: 50%;
    z-index: 10;
}

.scroll-banner .arrow img{
  width:12px;
  height:12px;
}

.scroll-banner .arrow-left{
  left: 0px;
}

.scroll-banner .arrow-right{
  right: 0px;
}

.scroll-banner .arrow-right img{
  transform:rotate(180deg);
}
.scroll-banner .banner_point{
    position: absolute;
    bottom: 24px;
    left: 50%;
    text-align: center;
    z-index: 3;
}

.scroll-banner .banner_point .point{
   display: inline-block;
   background-color: transparent;
   padding: 12px 4px;
   cursor: pointer;
}

.scroll-banner .banner_point .point button{
   display: block;
   width:30px;
   opacity: 0.48;
   height: 5px;
   background-color: #fff;
   border: none;
   transition: 0.3s;
}

.scroll-banner .banner_point .is-active button{
  opacity: 1;
}

</style>