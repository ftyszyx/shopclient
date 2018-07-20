<template>
<div>
    <!-- 审核弹窗 -->
        <div class="dialog-mask"  @click="close()">
            <div class="dialog"  style="width:90%;"  @click.stop>
                <div class="header">
                    <span class="title">选择图片</span>
                    <span class="close" @click="close()">×</span>
                </div>

                <table style="width:100%">
                  <tr>
                    <td align="right">
                    <div class="buttonbox">
                        <button style="disply:inline-block;" class="button-common" @click="showAlbumAdd=true">创建相册</button>
                          <el-upload  class="upload-box" 
                            :action="qiniuUrl"  
                            :show-file-list="false" 
                            :before-upload="beforeUpload"
                            name="file" 
                            accept="image/*"
                            :data="picform"
                            :on-error="handleError"
                            :on-success="handleSuccess">
                            <button class="button-common">上传图片</button>
                        </el-upload>
                    </div>
                    </td>
                  </tr>
                    <tr>
                      <table width="100%">
                        <td class="leftbox" width="20%" >
                          <ul >
                            <li :class="{'select-type':(value.id==album)}" @click="changeAlbum(value)" :key="value.id" v-for="value in albumList">
                                <div  class="nameitem" >{{value.name}}</div>
                            </li>
                       </ul>
                        </td>
                        <td>
                            <div class="rightbox">
                              <ul class="albumlist">
                                <li @click="checkOne(value)" :key="value.id" v-for="value in dataList" >
                                    <div class="checkbox"><input type="checkbox" v-model="value.checked" v-on:change="disCheckOther(value)"></div>
                                    <div class="covers">
                                        <img :src="value.path"></img>
                                    </div>
                                    <div class="namebox">
                                        {{value.name}}
                                    </div>
                                </li>
                            </ul>
                            <div class="bottom">
                                <el-pagination
                                        @size-change="handleSizeChange"
                                        @current-change="handleCurrentChange"
                                        :current-page="curpage"
                                        :page-sizes="[ 20, 30, 40]"
                                        :page-size="pagesize"
                                        layout="total,sizes, prev, pager, next"
                                        :total="totalsize">
                                </el-pagination>
                            </div>
                       </div>
                        </td>
                      </table>
                  </tr>
                    <tr >

                      <td class="footer" align="center">
                        <button class="button-common" @click="sure()">确 认</button>
                    </td>
                  </tr>

                </table>
            </div>
        </div>
    <add-dialog 
    v-if="showAlbumAdd"
    title="新建相册" 
    :fieldList="albumFieldList" 
    :dialogdata="dialogdata" 
    v-on:close="showAlbumAdd=false" 
    v-on:sure="addRes">
    </add-dialog>
    </div>
       
</template>

<script>
import model from 'src/model/index.js';
import util from 'common/utils';
import myMixin from 'common/mixin/admin.js';
import { all, post } from 'common/api';
import photo from 'src/mixin/photo';
import AddDialog from 'src/views/common/common_dialog';
export default {
  mixins: [photo, myMixin],
  name: 'photoselect',
  components: {
    AddDialog
  },
  data() {
    return {
      showAlbumAdd: false,
      dialogdata: {},
      albumList: model.album.list,
      dataList: model.photo.list,
      albumFieldList: model.album.fieldList,
      fieldList: model.photo.fieldList,
      selectpic: undefined
    };
  },
  props: {
    multi: { type: Boolean, default: false }
  },
  methods: {
    checkOne(value) {
      value.checked = !value.checked

      if (this.multi === false && value.checked) {
        this.disCheckOther(value)
      }
    },
    disCheckOther(selectvalue) {
      this.dataList.forEach(item => {
        if (item.id !== selectvalue.id) {
          item.checked = false
        }
      })
    },
    close() {
      console.log('close');
      this.$emit('close');
    },
    sure() {
      const arr = []
      for (let i = 0; i < this.dataList.length; i++) {
        const item = this.dataList[i]
        if (item.checked) {
          arr.push(item.path)
          if (this.multi === false) {
            this.$emit('sure', item.path);
            this.$emit('close');
            return;
          }
        }
      }
      if (this.multi) {
        this.$emit('sure', arr);
        this.$emit('close');
        return;
      }
    },
    changeAlbum(value) {
      this.album = value.id;
      this.search.album = this.album
      this.getData();
    },
    addRes(changedata) {
      post('album', 'add', changedata)
        .then(() => {
          this.showAlbumAdd = false;
          model.album.all();
          this.$message({
            message: '新增成功',
            type: 'success',
            duration: 1000
          });
        })
        .catch(err => {
          console.log('err', err);
        });
    },
    getData() {
      const search = this.getSearch();
      all('photo', this.curpage, this.pagesize, null, search)
        .then(data => {
          util.copyList(data.list, this.dataList, item => {
            this.$set(item, 'checked', false);
          });
          this.totalsize = data.num;
        })
        .catch(error => {
          console.log('error', error);
        });
    }
  },
  created() {
    this.albumFieldList.forEach(item => {
      if (item.changeable) {
        this.$set(this.dialogdata, item.name, undefined)
      }
    })
    this.pagesize = 20;
    this.album = 0;
    this.updateAlbum();
  }
};
</script>

<style scoped>
.upload-box{
  display: inline-block;
}

.buttonbox{
  border-bottom:  1px solid #e5e5e5;
}

.leftbox{
    background: #f2f2f2;
    border: 1px solid #e5e5e5;
    vertical-align: top;
}

.leftbox ul li{
      height: 30px;
    line-height: 30px;
    padding: 5px 8px;
    cursor: pointer;
    font-size: 12px;
}

.leftbox ul li.select-type {
    background-color: white;
}

@import"./photo.css"


</style>
