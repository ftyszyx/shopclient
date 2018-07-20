<template>
  <div class="picbox" flex="dir:top main:left cross:left">
    <span >{{title}}</span>
     <template v-if="curpath">
       <div>
        <img :style="{'max-width':width,'max-height':height}" class="headpic" :src="curpath">
       </div>
    </template>
    <el-upload  
    :action="getUploadUrl('picupload')"
    :show-file-list="false" 
    :before-upload="beforeupload"
    name="upfile" 
    accept="image/*"
    :data="picform"
    :on-error="onerror"
    :on-success="handleSuccess">
        <template v-if="(curpath||'')===''">
        <button :style="{'width':width,'height':height}" class="inputbutton">
          
            <i :style="{'font-size':height,'line-height':height}" class="iconfont zyx-add"></i>
          
        </button>
        </template>
    </el-upload>
  </div>
</template>

<script>
import ElUpload from 'common/components/upload'
import Vue from 'vue'
Vue.component(ElUpload.name, ElUpload);
import mymix from 'src/mixin'
// 框架
export default{
  name: 'picupload',
  mixins: [mymix],
  data() {
    return {
      curpath: '',
      picform: {}

    }
  },
  props: {
    title: {
      type: String
    },
    path: {
      type: String
    },
    width: {
      type: String,
      default: '100px'
    },
    height: {
      type: String,
      default: '100px'
    },
    iconheight: {
      type: String,
      default: '50px'
    }

  },
  watch: {
    path() {
      this.curpath = this.path;
    }
  },

  methods: {
    beforeupload() {
      this.$indicator.open({
        text: '图片上传中',
        spinnerType: 'fading-circle'
      })
    },
    onerror(err) {
      this.$indicator.close()
      console.log('err', err)
      this.$toast('上传失败')
    },
    handleSuccess(data, file) {
      console.log('resp', data, file)
      if (data.code === 1) {
        this.$toast('上传成功')
        this.$emit('update', data.data.url)
      } else {
        this.$toast(data.data.message)
      }
      this.$indicator.close()
    }
  },
  created() {
    this.curpath = this.path
  }
}
</script>

<style scoped>
.picbox{
  /* height:50px; */
  padding: 10px;
  width:100%;
  line-height: 50px;
  font-size: 14px;
  background: #fff;
    border-bottom: 1px solid #e2e2e2;
}


.headpic{
  /* max-width: ; */
  }

  .inputbutton{
    background-color: #fbfdff;
    border: 1px dashed #c0ccda;
    border-radius: 6px;
    box-sizing: border-box;
    width: 148px;
    height: 148px;
    cursor: pointer;
    line-height: 146px;
    vertical-align: top;
  }
</style>
