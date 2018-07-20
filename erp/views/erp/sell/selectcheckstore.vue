<template>
         <!-- 审核弹窗 -->
        <div class="dialog-mask"  @click="close()">
            <div class="dialog"  style="width:50%;"  @click.stop>
                <div class="header">
                    <span class="title">选择目标仓库</span>
                    <span class="close" @click="close()">X</span>
                </div>
                <div class="content">
                   <div class="form-itembox">
                            <span class="form-label" >选择仓库</span>
                            <el-select v-model="checkStoreId" size="mini" placeholder="选择仓库">
                                <el-option v-if="item.is_del!==1"
                                        v-for="item in storeList"
                                        :key="item.name"
                                        :label="item.name"
                                        :value="item.id">
                                </el-option>
                            </el-select>
                        </div>
                </div>
                <div class="footer">
                    <button class="button button-blue" @click="sure()">确 定</button>
                </div>
            </div>
        </div>
</template>

<script>
export default{
  name: 'SelectCheckStore',
  data() {
    return {

      checkStoreId: undefined
    }
  },
  props: {
    storeList: {
      type: Array,
      default() {
        return [];
      }
    }
  },
  methods: {
    close() {
      console.log('close');
      this.$emit('close');
    },
    sure() {
      this.$emit('sure', this.checkStoreId);
    }
  },
  created() {
  }
}
</script>

<style scoped>
</style>
