<template>
       <div>
            <template v-if="field.selectList">
                {{getSelectName(curvalue,field.selectList)}}
            </template>
            <template v-else-if="field.type==='time'">
                {{formatTime(curvalue)}}
            </template>
            <template v-else-if="field.type==='date'">
                {{formatDate(curvalue)}}
            </template>
             <template v-else-if="field.type==='pic'">
                <img src="~common/img/upload-common-select.png" v-if="!curvalue">
                <img class="pic" :src="curvalue+suffix" v-if="curvalue" @click.stop="showpic(curvalue)" >
            </template>
            <template v-else-if="field.type==='pics'">
                <img src="~common/img/upload-common-select.png" v-if="!curvalue">
                <img class="pic" :src="curvalue[0]+suffix" v-if="curvalue">
            </template>
            <template v-else-if="field.type==='bool'">
                {{curvalue===1?"是":"否"}}
            </template>
            <template v-else-if="field.mulSelectList">
                <el-tag :key="tag" v-for="tag in curvalue" size="mini">
                    {{getSelectName(tag,field.mulSelectList)}}
                  </el-tag>
            </template>
            <template v-else>
                {{curvalue}}
            </template>
             <add-dialog 
                v-if="showPreview"
                title="图片预览"
                v-on:close="showPreview=false" 
                :showfooter="false">
                <template slot="edititembox"  >
                    <img :src="previewpic+suffix" style="max-width:180px;">
                </template>
              </add-dialog>
       </div>
       
</template>

<script>
import util from 'common/utils'
import conf from 'src/config'
import comonglobal from 'common/global'
import AddDialog from 'src/views/common/common_dialog';
export default{
  name: 'CommonTd',
  data() {
    return {
      showPreview: false,
      previewpic: '',
      suffix: comonglobal.pic_suffix,
      curvalue: null
    }
  },
  watch: {
    value() {
      this.curvalue = this.value
    }
  },
  components: {
    AddDialog
  },
  props: {
    field: {
      type: Object
    },
    value: null
  },
  methods: {
    showpic(pic) {
      this.showPreview = true
      this.previewpic = pic;
    },
      // 格式化时间
    getSelectName(value, selectlist) { return util.getSelectName(value, selectlist) },
    formatDate(time) { return util.formatDate(time) },
    formatTime(time) { return util.formatTime(time) }
  },
  created() {
    this.curvalue = this.value
  }
}
</script>

<style scoped>
.pic{
      max-width:140px;
    max-height: 50px;
}
</style>
