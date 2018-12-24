<template>
    <div>
        <common-search :search="search" :searchFieldList="searchFieldList" v-on:search="searchClick"></common-search>
        <!-- 表格  -->
        <div>
            <div class="albumtop">
                <el-upload  class="upload-box" 
                :action="getUrl()"
                :show-file-list="false" 
                :before-upload="beforeUpload"
                 name="upfile" 
                 accept="image/*"
                 :data="picform"
                 :on-error="handleError"
                  :on-success="handleSuccess">
                  <button class="button-common">上传图片</button>
                </el-upload>
                <button @click="checkAll=!checkAll" class="button-common">全选</button>
                <button @click="del()" class="button-common">删除</button>
                <button @click="changeAblum()" class="button-common">转移相册</button>
            </div>
            <ul class="albumlist">
                <li @click="value.checked=!value.checked" :key="value.id" v-for="value in dataList" >
                    <div class="checkbox"><input type="checkbox" v-model="value.checked" ></div>
                    <div class="covers">
                        <img :src="value.path">
                    </div>
                    <div class="namebox">
                        {{value.name}}
                    </div>
                    <div class="buttonbox">
                        <a class="button-common" @click.stop="del(value)">删除</a>
                        <a class="button-common" @click.stop="edit(value)">修改</a>
                        <a class="button-common" @click.stop="setcover(value)">设为封面</a>
                        <a class="button-common" @click.stop="copyurl(value)">复制地址</a>
                    </div>
                </li>
            </ul>
        </div>
        <!-- 分页 -->
        <el-pagination
                @size-change="handleSizeChange"
                @current-change="handleCurrentChange"
                :current-page="curpage"
                :page-sizes="[10, 20, 30, 40]"
                :page-size="pagesize"
                layout="total,sizes, prev, pager, next"
                :total="totalsize">
        </el-pagination>
        <common-select v-if="showSelectAlbum" title="选择目的相册" :dataList="albumList" v-on:close="showSelectAlbum=false" v-on:sure="selectAlbum"></common-select>
        <!-- 对话框 -->
        <add-dialog 
            v-if="dialogShow"
            :title="dialogtitle"
            :fieldList="fieldList" 
            :dialogdata="dialogdata" 
            v-on:close="dialogShow=false" 
            v-on:sure="dialogClick">
        </add-dialog>
    </div>
</template>

<script>
import model from 'src/model/index.js'
import util from 'common/utils'
import CommonSelect from 'common/components/common_select'
import CommonSearch from 'common/components/common_searchbox'
import myMixin from 'common/mixin/admin.js'
import photo from 'src/mixin/photo'
import { post } from 'common/api'
import AddDialog from 'src/views/common/common_dialog';
export default{
  mixins: [myMixin, photo],
  data() {
    return {
      dataList: model[this.modelName].list, // 用户列表
      fieldList: model[this.modelName].fieldList, // 字段列表
      dialogShow: false,
      dialogdata: {},
      albumList: model.album.list,
      showSelectAlbum: false,
      dialogtitle: ''
    }
  },
  watch: {
    albumList() {
      this.updateAlbum()
    }
  },
  components: {
    CommonSelect,
    CommonSearch,
    AddDialog
  },
  props: {
    serverModelName: {// 服务器对应的control名
      type: String,
      default: 'photo'
    },
    modelName: {// 本地对应的模块名
      type: String,
      default: 'photo'
    }
  },
  methods: {
    beforeUpload(file) {
       const size = file.size / 1024 / 1024
       if (file.type.indexOf('image') === -1){
        this.$toast('只接受png和jpeg格式')
         return false
      }
      if (size > 2) {
        this.$toast('上传文件太大，超出限制')
        return false
      }
        if (this.search.album) {
          this.album = this.search.album
        } 
      model.app.loading = true;
    },
    changeAblum() {
      const arr = util.getCheckdItem(this.dataList);
      if (arr.length === 0) {
        this.$message({ message: '没有勾选图片', type: 'error', duration: 1000 })
      }
      this.showSelectAlbum = true
    },
    selectAlbum(checkalbumid) {
      const arr = util.getCheckdItem(this.dataList);
      post(this.serverModelName, 'movemulti', { id: arr, album: checkalbumid })
      .then(() => {
        this.getData();
        this.$message({ message: '移动成功', type: 'success', duration: 1000 })
      })
      .catch(error => {
        console.log('err', error)
      })
    },
    // 删除
    del(item) {
      const keys = []
      const arr = []
      if (!item) {
        util.getCheckdItem(this.dataList, item => {
          keys.push(item.key)
          arr.push(item.id)
        });
      } else {
        keys.push(item.key)
        arr.push(item.id)
      }
      this.sendDel({ id: arr, keys }, '所选')
    },

    setcover(item) {
        // 设为封面
      post('album', 'changecover', { cover_pic: item.id, id: item.album })
      .then(() => {
        // this.getData();
        this.$message({ message: '设置成功', type: 'success', duration: 1000 })
      })
      .catch(error => {
        console.log('err', error)
      })
    },
    copyurl(value) {
        // 设为封面
      const input = document.createElement('input');
      document.body.appendChild(input);
      input.setAttribute('value', value.path);
      input.select();
      if (document.execCommand('copy')) {
        document.execCommand('copy');
        this.$message({ message: '复制成功', type: 'success', duration: 1000 })
      }
      document.body.removeChild(input);
    },
    dialogClick(nowdata) {
      console.log('edit dailogdata', nowdata);
      const olddata = Object.assign({}, this.dialogdata);
      const changedata = Object.assign({}, nowdata);
      changedata.id = olddata.id
      console.log('dialogdata', changedata);
      this.sendEdit(changedata)
    }

  },

  created() {
    // 初始化弹出对话框数据
    this.fieldList.forEach(item => {
      if (item.name === 'album') {
        item.selectList = model.album.list
      }
      if (item.changeable) {
        this.$set(this.dialogdata, item.name, undefined)
      }
    })
    util.filterField(this.fieldList, this.searchFieldList, false, 'name', 'album');

   const params = this.$route.params
    console.log(params)
    if(params){
       this.album = params.albumid
       this.search.album=params.albumid
    }else{
       this.album = 0
    }
   
    this.updateAlbum()
  }
}
</script>

<style scoped>

.upload-box{
  display: inline-block;
}

@import"./photo.css"
</style>
