<template>
         <!-- 审核弹窗 -->
         <div class="pic-inputbox">
           
            <template v-if="picpathEmpty">
              <img  v-show="showimg" src="~common/img/upload-common-select.png">
            </template>
            <template v-else>
              <img   v-show="showimg" :src="picpath+suffix" style="max-width:40px;">
            </template>
           
           
            <input v-show="showimg==false" style="width:250px;" class="input-box"  v-model="picpath">
            <el-upload  class="upload-box" 
                :action="getUrl()"
                :show-file-list="false" 
                :before-upload="beforeUpload"
                name="upfile" 
                :data="picform"
                accept="image/*"
                :on-error="handleError"
                :on-success="handleSuccess">
                <button class="button-common">上传</button>
              </el-upload>
               <button   @click="selectphotoShow=true" class="button-common">从相册选择</button>
              <el-popover v-show="showPreview"
                  placement="top-start"
                  title="图片预览"
                  width="200"
                  trigger="hover">
                  <img :src="picpath+suffix" style="max-width:180px;">
                  <img src="~common/img/upload-common-select.png" slot="reference">
                </el-popover>
                <photo-select v-if="selectphotoShow" v-on:close="selectphotoShow=false" v-on:sure="getData" ></photo-select>
         </div>
         
</template>

<script>
import photoMix from 'src/mixin/photo'
import config from 'src/config'
import PhotoSelect from 'src/views/photo/photo_select'
export default{
  mixins: [photoMix],
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
    PhotoSelect
  },
  props: {
    picpath: null,
    showimg: { type: Boolean, default: false },
    showPreview: { type: Boolean, default: false }
  },
  methods: {
    getData(path) {
      this.$emit('updatepic', path);
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
