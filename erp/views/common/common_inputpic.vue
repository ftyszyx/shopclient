<template>
         <!-- 审核弹窗 -->
         <div class="pic-inputbox">
           
            <template v-if="picpathEmpty">
              <img  v-show="showimg" src="~common/img/upload-common-select.png">
            </template>
            <template v-else>
              <img   v-show="showimg" :src="picpath" style="max-width:40px;">
            </template>
            <input v-on:change="picchange" v-show="showimg==false" style="width:250px;" class="input-box"  v-model="picpath">
        
              <el-popover v-show="showPreview"
                  placement="top-start"
                  title="图片预览"
                  width="200"
                  trigger="hover">
                  <img :src="picpath" style="max-width:180px;">
                  <img src="~common/img/upload-common-select.png" slot="reference">
                </el-popover>
                
         </div>
         
</template>

<script>
export default{
  name: 'common_inputpic',
  data() {
    return {
      picpathEmpty: false,
      selectphotoShow: false

    }
  },
  watch: {
    picpath() {
      // console.log('watch', this.picpath, this.picpathEmpty);
      this.picpathEmpty = (this.picpath || '') === '';
    }
  },
  components: {
  },
  props: {
    picpath: null,
    showimg: { type: Boolean, default: false },
    showPreview: { type: Boolean, default: false }
  },
  methods: {
    picchange(path) {
      console.log('path', path, this.picpath)
      this.$emit('updatepic', this.picpath);
    }
  },
  created() {
    this.picpathEmpty = (this.picpath || '') === '';
  }
}
</script>

<style scoped>
.upload-box{
  display: inline-block;
}
.pic-inputbox{
  display: inline-block;
}
</style>
