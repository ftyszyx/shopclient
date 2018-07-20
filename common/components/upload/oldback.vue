<template>
<div class="uploader-box">
  <el-upload
    :show-file-list="showFileList"
    :action="qiniuhost"
    :data="picform"
    name="file"
    :on-success="handleSuccess"
    :on-remove="handleRemove"
    :on-error="handleError"
    :list-type="listtype"
    :before-upload="beforeupload">
    <slot >
    </slot>
  </el-upload>
</div>
</template>

<script>
import conf from 'src/config.js'
import tools from 'common/utils/base'
import { getQiniuUploadToken, delfile } from 'api/upload.js'
export default {
  name: 'upload',

  props: {
    url: {
      type: String,
      default: ''
    },
    listtype: {
      type: String,
      default: 'picture'
    },
    showFileList: {
      type: Boolean,
      default: false
    },
    paramstr: {
      type: String,
      default: ''
    }
  },
  data() {
    return {
      qiniuhost: conf.qiniuUploadUrl,
      assethost: '',
      picform: {}
    }
  },
  methods: {
    handleRemove(file) {
      console.log('filename', file);
      delfile(file.response.key).then(respose => {
        console.log('respose', respose)
        this.$message({
          message: '删除成功',
          type: 'success',
          duration: 1000
        });
      }).catch(error => {
        this.$message({
          message: '删除失败' + error,
          type: 'err',
          duration: 1000
        });
      })
    },

    handleError(err) {
        // console.log(file, fileList);
      this.$message({
        message: '上传失败' + err,
        type: 'err',
        duration: 1000
      });
    },
      // 上传图片
    beforeupload(file) {
      console.log('beforeupload', file);
      const key = tools.getUploadfilename(file)
      return getQiniuUploadToken(key).then(response => {
        console.log('respose', response)
        this.assethost = response.data.data.path
        this.picform = {
          key,
          token: response.data.data.token
        }
      }).catch(error => {
        this.$message({
          message: '获取上传权限失败' + error,
          type: 'err',
          duration: 1000
        });
      })
    },
    // 上传成功
    handleSuccess(res) {
      console.log('res', res);
      const url = tools.getResPath(this.assethost, res.key);
      this.$emit('uploadsuccess', url, res.key, this.paramstr)
    }
  }
}
</script>

<style scoped>
.uploader-box{
  /* margin: 0,auto; */
  /* overflow: hidden; */
  display: inline-block;
}

</style>
