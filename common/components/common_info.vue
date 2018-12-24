<template>
  <!-- 商品详情 -->
         <div class="dialog-mask"  @click="close()" >
            <div class="dialog infobox"  @click.stop style="width:80%;">
                <div class="header">
                    <span class="title">{{title}}</span>
                    <span class="close" @click="close()">X</span>
                </div>
                <div class="content">
                    <table cellspacing="0" cellpadding="0" border="0" class="tablebox" style="width:100%;">
                        <!-- 表头 -->
                        <thead class="table-thead">
                        <tr><th width="150px">名称</th> <th>内容</th></tr>
                        </thead>
                        <!-- 表内容 -->
                        <tbody>
                            <tr :key="field.name" v-for="field in fieldList"   >
                                <td>{{field.title}}</td>
                                <td  >
                                    <slot name="tabletd" v-bind:value="info[field.name]" v-bind:field="field">
                                        <common-td :field="field" :value="info[field.name]"></common-td>
                                    </slot>
                                </td>
                            </tr>
                        </tbody>
                    </table>
            </div>
            </div>

        </div>
</template>

<script>
// 商品详情对话框
import myMixin from 'common/mixin/admin.js'
import CommonTd from 'common/components/common_td'
import AddDialog from 'src/views/common/common_dialog';
export default{
  mixins: [myMixin],
  name: 'fieldinfo',
  data() {
    return {
    }
  },
  methods: {
    close() {
      this.$emit('close');
    }
  },
  components: {
    CommonTd,
    AddDialog
  },
  props: {
    info: {// 本地对应的模块名
      type: Object,
      default: {}
    },
    fieldList: {// 本地对应的模块名
      type: Array,
      default() {
        return [];
      }
    },
    title: {// 本地对应的模块名
      type: String,
      default: ''
    }
  },
  created() {
  }
}
</script>

<style scoped>
.infobox{
    width:50%;
    max-height:80%;
    overflow: scroll;

}
</style>
