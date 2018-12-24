import conf from 'src/config.js'
import { post } from 'common/api'
import model from 'src/model'
import base from 'common/utils/base'
import global from 'src/global.js'
export default{
  data() {
    return {
      qiniuUrl: conf.qiniuURL,
      suffix: global.pic_suffix,
      urlpath: '',
      album: 0,
      picform: {}
    }
  },

  methods: {
    beforeUpload(file) {
      console.log('file', file)
      console.log('file siz', file.size / 1024 / 1024)
      console.log('file type', file.type)
      model.app.loading = true;
    },
    getUrl() {
      return conf.qiniuURL + '?token=' + window.localStorage.getItem('token') + '&uid=' + window.localStorage.getItem('uid');
    },
    handleError(err, file) {
      console.log('err', err, file)
      model.app.loading = false;
      this.$message({ message: '上传失败', type: 'error', duration: 1000 });
    },
    handleSuccess(data, file) {
      console.log('resp', data, file)
      model.app.loading = false;
      const key = data.data.filename
      const name = base.DelExt(data.data.filetitle)
      const path = data.data.url
      console.log('this.album', this.album)

      if (this.album === 0) {
        this.InitDefaultAlbum()
      }
      post('photo', 'add', { key, name, path, album: this.album })
        .then(() => {
          this.getData(path);
          this.$message({ message: '上传成功', type: 'success', duration: 1000 })
        })
        .catch(err => {
          console.log('err', err);
        })
    },
    InitDefaultAlbum() {
      if (this.$route.params.album) {
        this.album = this.$route.params.album
      } else {
        if (model.album.list.length > 0) {
          const defaultalbum = model.album.list.find(x => x.default === 1)
          if (defaultalbum) {
            this.album = defaultalbum.id
          } else {
            console.log('first album', model.album.list[0])
            this.album = model.album.list[0].id
          }
        }
      }
    },
    updateAlbum() {
      if (this.album === 0) {
        this.InitDefaultAlbum()
        if (this.album !== 0) {
          this.search = { album: this.album }
        }
        this.getData();
      } else {
        this.getData();
      }
    }
  }


};