<template>
  <div class="picbox" flex="dir:top main:left cross:left">
    <span >{{title}}</span>
    <el-upload  
    :action="getUploadUrl(urlpath)"
    :show-file-list="false" 
    :before-upload="beforeupload"
    :before-upload-process="uploadprocess"
    name="upfile" 
    accept="image/*"
    :data="picform"
    :on-error="onerror"
    :on-success="handleSuccess">
         <button style="border-width:0px;">
             <template v-if="curpath">
              <div>
                <img :style="{'max-width':width,'max-height':height}" class="headpic" :src="curpath+suffix">
              </div>
            </template>
            <template v-else>
              <div :style="{'width':width,'height':height}" class="inputbutton">
                <i :style="{'font-size':height,'line-height':height}" class="iconfont zyx-add"></i>
              </div>
            </template>
          </button>
          
    </el-upload>
    <div v-if="curpath" class="viewbtn" @click="showeditPicviewPanel=true">查看</div>
     <pic-view v-if="showeditPicviewPanel" v-on:close="showeditPicviewPanel=false" :picpath="curpath"></pic-view>
  </div>
</template>

<script>
import ElUpload from 'common/components/upload'
import PicView from './picview'
import Vue from 'vue'
import util from 'common/utils'
Vue.component(ElUpload.name, ElUpload);
import mymix from 'src/mixin'
// 框架
export default{
  name: 'picupload',
  mixins: [mymix],
  data() {
    return {
      curpath: '',
      showeditPicviewPanel: false
      // picform: {}

    }
  },
  components: {
    PicView
  },
  props: {
    picform: {
      type: Object,
      // 对象或数组默认值必须从一个工厂函数获取
      default() {
        return { }
      }
    },
    title: {
      type: String
    },
    path: {
      type: String
    },
    urlpath: {
      type: String,
      default: 'picupload'
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
    uploadprocess(file, cb) {
      console.log('begin uploadprocess')
      const size = file.size / 1024 / 1024
      if (size > 1) {
        console.log('begin compress')
        util.processImage(file, 1, bob => {
          console.log('bob', bob)
          cb(bob)
        })
      } else {
        cb(file)
      }
    },
    beforeupload(file) {
      console.log('file', file)
      const size = file.size / 1024 / 1024
      console.log('file siz', size)
      console.log('file type', file.type)
      if (file.type.indexOf('image') === -1) {
        this.$toast('只接受png和jpeg格式')
        return false
      }
      if (size > 2) {
        this.$toast('上传文件太大，超出限制')
        return false
      }
      this.$indicator.open({
        text: '图片上传中',
        spinnerType: 'fading-circle'
      })
      return true
    },

    onerror(err) {
      this.$indicator.close()
      console.log('uploaderr', err)
      this.$toast('上传失败')
    },
    handleSuccess(data, file) {
      console.log('handleSuccess', data, file)
      try{
        if (data.code === 1) {
          this.$toast('上传成功')
          this.$emit('update', data.data.url)
          this.$emit('success', data.data)
        } else {
          this.$toast(data.message)
        }
      }catch(err){
        console.log(err)
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

.viewbtn{
    height: 30px;
    width: 100px;
    color: white;
    background-color: #04be02;
    line-height: 30px;
    vertical-align: middle;
    cursor: pointer;
    text-align: center;
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
