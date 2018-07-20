<template>
    <div>
      
        <!-- 显示  -->
        <div>
            <div class="albumtop">
                <button @click="add()" class="button-common">新增相册</button>
            </div>
            <ul class="albumlist">
                <li :key="value.id" v-for="value in dataList" @dblclick="gotoDetail(value)">
                    <img v-if="value.default==1" src="~src/assets/img/check.png">
                    <div class="covers">
                        <img v-if="value.cover_pic_path" :src="value.cover_pic_path"></img>
                        <img v-else  src="~src/assets/img/album_cover_default.png"></img>
                    </div>
                    <div class="name">
                        {{value.name}}
                    </div>
                    <div class="buttonbox">
                        <a class="button-common" @click.stop="del(value)">删除</a>
                        <a class="button-common" @click.stop="setdefault(value)">设为默认</a>
                        <a class="button-common" @click.stop="edit(value)">修改</a>
                    </div>
                                
                </li>
            </ul>
        </div>
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
import { post } from 'common/api'
import photo from 'src/mixin/photo'
import myMixin from 'common/mixin/admin.js'
import AddDialog from 'src/views/common/common_dialog';
export default{
  mixins: [myMixin, photo],
  data() {
    return {
      dataList: model[this.modelName].list, // 用户列表
      fieldList: model[this.modelName].fieldList, // 字段列表
      dialogShow: false,
      dialogdata: {},
      dialogtitle: ''
    }
  },
  components: {
    AddDialog
  },
  watch: {
  },
  props: {
    serverModelName: {// 服务器对应的control名
      type: String,
      default: 'album'
    },
    modelName: {// 本地对应的模块名
      type: String,
      default: 'album'
    }
  },
  methods: {
    gotoDetail(info) {
      console.log('this', this)
      this.$router.push({ path: '/album/photo', params: { album: info.id } })
    },

    setdefault(item) {
      post(this.serverModelName, 'changedefault', { id: item.id })
      .then(() => {
        this.getData();
        this.$message({ message: '设置成功', type: 'success', duration: 1000 })
      })
      .catch(error => {
        console.log('err', error)
      })
    },

    getData() {
      model[this.modelName].all()
    }
  },

  created() {
    this.fieldList.forEach(item => {
      if (item.changeable) {
        this.$set(this.dialogdata, item.name, undefined)
      }
    })
    // 获取数据
    this.getData();
  }
}
</script>

<style scoped>

@import"./photo.css"

</style>
