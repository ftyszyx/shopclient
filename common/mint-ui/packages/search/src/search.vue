<template>
  <div class="mint-search">
    <div class="mint-searchbar">
      <div  flex="dir:left main:left cross:center" flex-box="1"  class="mint-searchbar-inner">
        <i class="mintui mintui-search"></i>
        <input
        ref="input"
        @click="visible = true"
        @keyup.enter="searchClick"
        type="search"
        v-model="currentValue"
        :placeholder="placeholder"
        class="mint-searchbar-core">
        <span  v-show="visible" @click="visible = false, currentValue = ''" class="deltext">x</span>
      </div>
      <div
        class="mint-searchbar-cancel"
        @click="searchClick()"
        v-show="visible">
        搜索
      </div>
    </div>
    <div class="mint-search-list" v-show="show || currentValue">
      <div class="mint-search-list-warp">
        <slot>
          <x-cell v-for="(item, index) in result" :key="index" :title="item"></x-cell>
        </slot>
      </div>
    </div>
  </div>
</template>

<script>
import 'mint-ui/css/search/style.css';
import XCell from 'mint-ui/packages/cell/index.js';
if (process.env.NODE_ENV === 'component') {
  require('mint-ui/css/cell/style.css');
}

/**
 * mt-search
 * @module components/search
 * @desc 搜索框
 * @param {string} value - 绑定值
 * @param {string} [cancel-text=取消] - 取消按钮文字
 * @param {string} [placeholder=取消] - 搜索框占位内容
 * @param {boolean} [autofocus=false] - 自动 focus
 * @param {boolean} [show=false] - 始终显示列表
 * @param {string[]} [result] - 结果列表
 * @param {slot} 结果列表
 *
 * @example
 * <mt-search :value.sync="value" :result.sync="result"></mt-search>
 * <mt-search :value.sync="value">
 *   <mt-cell v-for="item in result" :title="item"></mt-cell>
 * </mt-search>
 */
export default {
  name: 'mt-search',

  data() {
    return {
      visible: false,
      currentValue: this.value
    };
  },

  components: { XCell },

  watch: {
    currentValue(val) {
      this.$emit('input', val);
    },

    value(val) {
      this.currentValue = val;
    }
  },
  methods: {
    searchClick() {
      this.$emit('searchok', this.currentValue);
    }
  },

  props: {
    value: String,
    autofocus: Boolean,
    show: Boolean,
    cancelText: {
      default: '取消'
    },
    placeholder: {
      default: '搜索'
    },
    result: Array
  },

  mounted() {
    this.autofocus && this.$refs.input.focus();
  }
};
</script>

<style lang="css">
 
</style>
