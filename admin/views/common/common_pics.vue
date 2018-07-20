<template>
         <!-- 审核弹窗 -->
         <div class="pics-box">
             <ul>
                 <li :key="picitem" v-for="picitem in pics">
                     <img :src="picitem">
                      <span class="close-button" @click="delitem(picitem)">×</span>
                 </li>
             </ul>
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
                <photo-select multi v-if="selectphotoShow" v-on:close="selectphotoShow=false" v-on:sure="getSelectData" ></photo-select>
         </div>
         
</template>

<script>
import photoMix from 'src/mixin/photo'
import util from 'common/utils'
import PhotoSelect from 'src/views/photo/photo_select'
export default{
  mixins: [photoMix],
  name: 'common_pics',
  data() {
    return {
      pics: [],
      selectphotoShow: false
    }
  },
  components: {
    PhotoSelect
  },
  watch: {

  },
  props: {
    picspath: {
      type: Array,
      default() {
        return [];
      }
    }
  },
  methods: {
    getData(path) {
      if (!this.pics.find(x => x === path)) {
        this.pics.push(path)
        this.$emit('updatepic', this.pics);
      }
    },

    getSelectData(paths) {
      paths.forEach(item => {
        if (!this.pics.find(x => x === item)) {
          this.pics.push(item)
        }
      })
      this.$emit('updatepic', this.pics);
    },
    delitem(item) {
      util.remove(this.pics, item);
      this.$emit('updatepic', this.pics);
    }
  },
  created() {
    this.pics.splice(0)
    this.picspath.forEach(element => {
      this.pics.push(element)
    });
  }
}
</script>

<style scoped>
.pics-box ul li{
  display: inline-block;
  width: 190px;
  position: relative;
    /* height:200px; */
    padding: 5px 5px;
    vertical-align: top;
    cursor: pointer;
    border:1px solid #130303;
}
.pics-box ul li:hover{
   background-color: rgb(230, 230, 230);
}
.pics-box ul li  img{
  max-width: 160px;
    max-height:120px;
}
.pics-box ul li .close-button{
    display: none;
}

.pics-box ul li:hover .close-button{
    display: inline-block;
}

.upload-box{
    display: inline-block;
}

.pics-box .button-common{
    display: inline-block;
}

</style>
