<template>
         <!-- 审核弹窗 -->
        <div class="dialog-mask"  @click="close()">
            <div class="dialog"  style="width:50%;"  @click.stop>
                <div class="header">
                    <span class="title">{{title}}</span>
                    <span class="close" @click="close()">X</span>
                </div>
                <div class="content">
                   <div class="form-itembox">
                            <span class="form-label" >{{title}}</span>
                            <el-select v-model="checkid" size="mini" :placeholder="title">
                                <el-option 
                                        v-for="item in dataList"
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
  name: 'CommonSelect',
  data() {
    return {

      checkid: undefined
    }
  },
  props: {
    dataList: {
      type: Array,
      default() {
        return [];
      }
    },
    title: {
      type: String,
      required: true
    }
  },
  methods: {
    close() {
      console.log('close');
      this.$emit('close');
    },
    sure() {
      this.$emit('sure', this.checkid);
    }
  },
  created() {
  }
}
</script>

<style scoped>
</style>
