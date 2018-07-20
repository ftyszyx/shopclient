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
                <img class="pic" :src="curvalue" v-if="curvalue">
            </template>
            <template v-else-if="field.type==='pics'">
                <img src="~common/img/upload-common-select.png" v-if="!curvalue">
                <img class="pic" :src="curvalue[0]" v-if="curvalue">
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
       </div>
       
</template>

<script>
import util from 'common/utils'
import conf from 'src/config'
export default{
  name: 'CommonTd',
  data() {
    return {
      curvalue: null,
      miniurl: conf.miniurl
    }
  },
  watch: {
    value() {
      this.curvalue = this.value
    }
  },
  props: {
    field: {
      type: Object
    },
    value: null
  },
  methods: {
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
    max-height: 100px;
}
</style>
