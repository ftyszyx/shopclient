<template>
  <label class="mint-switch">
    <input class="mint-switch-input" :disabled="disabled" @change="$emit('change', currentValue)" type="checkbox" v-model="currentValue">
    <span class="mint-switch-core"></span>
    <div class="mint-switch-label"><slot></slot></div>
  </label>
</template>

<script>
/**
 * mt-switch
 * @module components/switch
 * @desc 切换按钮
 * @param {boolean} [value] - 绑定值，支持双向绑定
 * @param {slot} - 显示内容
 *
 * @example
 * <mt-switch v-model="value"></mt-switch>
 */
import 'mint-ui/css/switch/style.css';
export default {
  name: 'mt-switch',

  props: {
    value: Boolean,
    disabled: {
      type: Boolean,
      default: false
    }
  },
  computed: {
    currentValue: {
      get() {
        return this.value;
      },
      set(val) {
        this.$emit('input', val);
      }
    }
  }
};
</script>

<style lang="css">
 
</style>
