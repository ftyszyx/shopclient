<template>
    <div  class="dialog-mask"  @click="close()">
            <div class="dialog"  style="width:90%;"  @click.stop>
                <div class="header">
                    <span class="title">文章详情</span>
                    <span class="close" @click="close()">x</span>
                </div>
                <div class="content">
                    <div class="tablebox">
                        <table cellspacing="0" cellpadding="0" border="0" class="table-header" style="width:100%;table-layout: fixed;word-wrap: break-word;">          
                            <!-- 表内容 -->
                            <tbody>
                                 <tr :key="field.name" v-for="(field) in showfieldList">
                                     <td>{{field.title}}</td>
                                     
                                      <common-td :field="field" :value="data[field.name]"></common-td>
                                 </tr>
                            </tbody>
                        </table>
                    </div>
                    <div v-html="data.content">
                    </div>
                </div>
            </div>
             
        </div>
</template>

<script>



import model from 'src/model/index.js'
import util from 'common/utils'
import myMixin from 'common/mixin/admin.js'
import CommonTd from 'common/components/common_td'
export default{
  name: 'postinfo',
  mixins: [myMixin],
  data() {
    return {
      fieldList: model.post.fieldList // 字段列表
    }
  },
  watch: {
  },
  components: {
     CommonTd
   },
  props: {
    data: {
      type: Object,
      required: true
    }
  },
  methods: {
    close() {
      this.$emit('close');
    }
  },

  created() {
    util.filterField(this.fieldList, this.showfieldList, true, 'content', 'type');
  }
}
</script>

<style scoped>



</style>
