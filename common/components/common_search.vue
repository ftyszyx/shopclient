<template>
       <div style="display: inline-block;">
            <template v-if='field.selectList'>
                <el-select  v-on:change="change()" clearable  v-model="curvalue" size="mini" :placeholder="field.title">
                    <el-option
                            v-for="item in field.selectList"
                            :key="item.id"
                            :label="item.name||item.title"
                            :value="item.id">
                    </el-option>
                </el-select>
            </template>
            <template v-else-if='field.mulSelectList'>
                <el-select  v-on:change="change()" multiple  clearable  v-model="curvalue" size="mini" :placeholder="field.title">
                    <el-option
                            v-for="item in field.mulSelectList"
                            :key="item.id"
                            :label="item.name||item.title"
                            :value="item.id">
                    </el-option>
                </el-select>
            </template>
            <template v-else-if="field.cascaderList">
                  <el-cascader
                      expand-trigger="hover"
                      :options="field.cascaderList"
                      size="small"
                       v-on:change="change()"
                      v-model="curvalue">
                  </el-cascader>
            </template>
            <template v-else-if="field.type==='time'">
                    <el-date-picker
                        v-on:change="change()"
                        v-model="curvalue"
                        type="datetimerange"
                        align="right"
                        unlink-panels
                        range-separator="至"
                        start-placeholder="开始日期"
                        end-placeholder="结束日期"
                        size="small"
                        clearable
                        :picker-options="pickerOptions2">
                    </el-date-picker>
            </template>
             
             <template v-else-if="field.type==='date'">
                    <el-date-picker
                        v-on:change="change()"
                        v-model="curvalue"
                        type='daterange'
                        align="right"
                        unlink-panels
                        range-separator="至"
                        start-placeholder="开始日期"
                        end-placeholder="结束日期"
                        size="small"
                        clearable
                        :picker-options="pickerOptions2">
                    </el-date-picker>
            </template>
            <template v-else>
                    <input v-on:change="change()"  class="input-box"  v-model="curvalue" :placeholder="getPlaceHold(field)">
                    <i @click="clearSearch()" v-show="(curvalue||'')!=''" class="el-input__icon el-icon-circle-close el-input__clear"></i>
            </template>
       </div>
       
</template>

<script>
import util from 'common/utils'
export default{
  name: 'CommonSearch',
  data() {
    return {
      curvalue: null,
      pickerOptions2: util.getTimeBrif()
    }
  },
  watch: {
    value() {
      console.log('watch change', this.value);
      this.curvalue = this.value;
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
    getPlaceHold(field) {
      if (field.search && field.search.toLowerCase().trim() === 'like') {
        return '%关键字%,模糊搜索'
      }
      return '';
    },
    clearSearch() {
      this.curvalue = undefined;
      this.$emit('change', this.curvalue);
    },
    change() {
      console.log('change');
      this.$emit('change', this.curvalue);
    }
  },
  created() {
    // console.log('created change', this.value);
    this.curvalue = this.value;
  }
}
</script>

<style scoped>
</style>
