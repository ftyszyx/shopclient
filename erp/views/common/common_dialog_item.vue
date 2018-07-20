<template>
    <div :key="field.name" class="form-itembox">
    <span class="form-label" :class='{"require":field.rules}'>{{field.title}}</span>
      <template v-if='field.selectList'>
          <el-select  v-on:change="change()" v-model="curvalue" size="mini" :placeholder="field.title">
              <el-option
                      v-for="item in field.selectList"
                      v-if="!item.hide"
                      :key="item.id"
                      :label="item.select_name||item.name||item.title"
                      :value="item.id">
              </el-option>
          </el-select>
      </template>
      <template v-else-if='field.mulSelectList'>
          <el-select v-on:change="change()"  v-model="curvalue" multiple size="mini" :placeholder="field.title">
              <el-option
                      v-for="item in field.mulSelectList"
                      v-if="!item.hide"
                      :key="item.id"
                      :label="item.select_name||item.name||item.title"
                      :value="item.id">
              </el-option>
          </el-select>
      </template>
      <template v-else-if="field.type==='time'||field.type==='date'">
          <el-date-picker
              v-on:change="change()" 
              v-model="curvalue"
              type="datetime"
              placeholder="选择日期时间">
        </el-date-picker>
      </template>
        <template v-else-if="field.type=='bool'">
          <div style="display:inline-block" @click="change(curvalue===1?0:1)">
              <span  class="switch" :class='{"checked":curvalue===1}' style="width: 40px;">
                <span class="switch__button"></span>
              </span>
          </div>
      </template>

      <template v-else-if="field.type==='text'">
          <textarea v-on:change="change()"  style="display: block;" v-model="curvalue" rows="5" cols="100"></textarea>
      </template>

      <template v-else-if="field.cascaderList">
            <el-cascader
                v-on:change=change()
                expand-trigger="hover"
                :options="field.cascaderList"
                size="small"
                v-model="curvalue">
            </el-cascader>
      </template>
      <template v-else-if="field.type==='number'">
        <input  class="input-box" type='number' v-on:change="change()"  v-on:blur='validate(field)' v-model.number="curvalue">
      </template>
      <template v-else>
          <input  class="input-box" v-on:change="change()" v-on:blur='validate(field)' v-model="curvalue">
      </template>
  </div>
</template>

<script>
import util from 'common/utils'
import Message from 'element-ui/packages/message/index.js';
export default{
  mixins: [],
  name: 'Commondailogitem',
  data() {
    return {
      curvalue: null
    }
  },
  watch: {
    value() {
      this.curvalue = this.value
    }
  },
  components: {
  },
  props: {
    field: {
      type: Object
    },
    value: null
  },
  methods: {
    change(newvalue) {
      if (newvalue !== undefined) {
        // 有值时才赋值
        this.curvalue = newvalue
      }
      this.$emit('change', this.curvalue)
    },
    validate(field) {
      // console.log('valid field', field)
      if (field.rules) {
        util.validate(field.rules, this.curvalue, field.name, errormsg => {
          Message({
            message: errormsg,
            type: 'error',
            duration: 1000
          })
        });
      }
    }
  },
  created() {
    this.curvalue = this.value
  }
}
</script>
