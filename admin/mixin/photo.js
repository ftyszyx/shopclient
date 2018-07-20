import conf from 'src/config.js'
import { post } from 'common/api'
import model from 'src/model'
import base from 'common/utils/base'
export default{
  data() {
    return {
      qiniuMini: conf.miniurl,
      qiniuUrl: conf.qiniuURL,
      urlpath: '',
      album: 0,
      picform: {}
    }
  },

  methods: {
    beforeUpload() {
      // this.qiniuURL = conf.qiniuURL + '?' + 'token=' + Cookies.get('token') + 'uid=' + Cookies.get('uid')
    },
    getUrl() {
      return conf.qiniuURL + '?token=' + window.localStorage.getItem('token') + '&uid=' + window.localStorage.getItem('uid');
    },
    handleError(err, file) {
      console.log('err', err, file)
      this.$message({ message: '上传失败', type: 'error', duration: 1000 });
    },
    handleSuccess(data, file) {
      console.log('resp', data, file)
      const key = data.data.filename
      const name = base.DelExt(data.data.filetitle)
      const path = data.data.url
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
      }
    }
  }


};