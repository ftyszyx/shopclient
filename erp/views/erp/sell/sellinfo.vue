<template>
  <!-- 商品详情 -->
         <div class="dialog-mask"  @click="close()" >
            <div class="dialog infobox"  @click.stop style="width:50%;">
                <div class="header">
                    <span class="title">销售单详情</span>
                    <span class="close" @click="close()">X</span>
                </div>
                <div class="content">
                    <table cellspacing="0" cellpadding="0" border="0" class="tablebox" style="width:100%;">
                        <!-- 表头 -->
                        <thead class="table-thead">
                        <tr><th>名称</th> <th>内容</th></tr>
                        </thead>
                        <!-- 表内容 -->
                        <tbody>
                            <tr :key="field.name" v-for="field in detailFieldList"   >
                                <td >{{field.title}}</td>
                                <td  >
                                      <common-td :field="field" :value="info[field.name]"></common-td>
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
import model from 'src/model'
import util from 'common/utils'
import myMixin from 'common/mixin/admin.js'
import CommonTd from 'common/components/common_td'
export default{
  mixins: [myMixin],
  name: 'sellinfo',
  data() {
    return {
      fieldList: model.sell.fieldList, // 字段列表
      detailFieldList: [] // 详细页面显示的字段
    }
  },
  methods: {
    close() {
      this.$emit('close');
    }
  },
  components: {
    CommonTd
  },
  props: {
    info: {// 本地对应的模块名
      type: Object,
      default: {}
    }
  },
  created() {
    model.store.all();
    // 初始化搜索相关数据
    util.filterField(this.fieldList, this.detailFieldList, true, 'shop_id',
    'store_id', 'build_user', 'check_user', 'item_id');
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
