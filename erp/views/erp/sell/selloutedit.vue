<template>
        <div class="dialog-mask">
            <div class="dialog"  style="width:50%;">
                <div class="header">
                    <span class="title">配货</span>
                    <span class="close" @click="close()">X</span>
                </div>
                <div class="content">
                  <h1>配货单信息</h1>
                    <textarea class="assign-text" v-model="infotext"></textarea>
                </div>
                <div class="footer">
                    <button class="button" @click="close()">取消</button>
                    <button class="button button-blue" @click="sure()">确 定</button>
                </div>
            </div>
        </div>
</template>

<script>
// 配货单编辑
import myMixin from 'common/mixin/admin.js'
export default{
  mixins: [myMixin],
  name: 'SellOutInfo',
  data() {
    return {
      infotext: ''
    }
  },
  methods: {
    close() {
      this.$emit('close');
    },
    sure() {
      this.$emit('sure', this.infotext);
    }
  },
  props: {
    info: {// 本地对应的模块名
      type: Object,
      default: {}
    }
  },
  created() {
    this.infotext = this.info.info;
  }
}
</script>

<style scoped>
.assign-text{
  width: 100%;
  height: 100px;
}
</style>
