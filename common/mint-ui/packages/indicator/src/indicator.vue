<template>
  <transition name="mint-indicator">
    <div class="mint-indicator" v-show="visible">
      <div class="mint-indicator-wrapper" :style="{ 'padding': text ? '20px' : '15px' }">
        <spinner class="mint-indicator-spin" :type="convertedSpinnerType" :size="32"></spinner>
        <span class="mint-indicator-text" v-show="text">{{ text }}</span>
      </div>
      <div class="mint-indicator-mask" @touchmove.stop.prevent></div>
    </div>
  </transition>
</template>

<style>

</style>

<script type="text/babel">
import 'mint-ui/css/indicator/style.css';
import 'mint-ui/css/spinner/style.css';
import Spinner from 'mint-ui/packages/spinner/index.js';


export default {
  data() {
    return {
      visible: false
    };
  },

  components: {
    Spinner
  },

  computed: {
    convertedSpinnerType() {
      switch (this.spinnerType) {
        case 'double-bounce':
          return 1;
        case 'triple-bounce':
          return 2;
        case 'fading-circle':
          return 3;
        default:
          return 0;
      }
    }
  },

  props: {
    text: String,
    spinnerType: {
      type: String,
      default: 'snake'
    }
  }
};
</script>
