<template>
  <div class="tablebox">
            <div class="btnbox">
                <slot name="topbtn"></slot>
            </div>
            <table cellspacing="0" cellpadding="0" border="0" class="table-header" style="width:100%;table-layout: fixed;word-wrap: break-word;">          
                <!-- 表头 -->
                <thead class="table-thead">
                <tr >
                    <th v-show="showCheck" width="30px">
                        <input type="checkbox" v-model="checkAll"></input>
                    </th>
                    <slot name="thbox-before">
                      
                    </slot>
                    <th :key="field.name" v-for="(field,index) in showfieldList" :width="field.width" >
                        <div>{{field.title}}
                            <span v-show="field.sort!=undefined" class="caret-wrapper" @click="sort(index)">
                              <i class="sort-caret zyx-ascending" :class="{'sort-active':field.sort===1}"></i>
                              <i class="sort-caret zyx-descending" :class="{'sort-active':field.sort===2}"></i>
                            </span>
                        </div>
                    </th>
                    <th :width="operwidth" v-show="showoper">
                        <div>操作</div>
                    </th>
                </tr>
                </thead>
                <!-- 表内容 -->
                <tbody>
                  <template   v-for="value in curDataList" v-if="!(value.canshow===false)" >
                    <slot v-bind:value="value">
                        <tr :key="value.id" @dblclick="clickRow(value)"  @click="selectrow(value)">                 
                              <td v-show="showCheck">
                                  <input type="checkbox" v-model="value.checked"></input>
                              </td>
                              <slot name="rowbox" v-bind:value="value">
                                  <td :key="field.name" v-for="field in showfieldList" >
                                      <common-td :field="field" :value="value[field.name]"></common-td>
                                  </td>
                              </slot>
                              <td v-show="showoper" >
                                  <div>
                                      <slot name="rowbtn" v-bind:value="value"></slot>
                                  </div>
                              </td>
                          </tr>
                      </slot>
                  </template>
                
                </tbody>
            </table>
        </div>
       
</template>

<script>
import CommonTd from 'common/components/common_td'
import util from 'common/utils'
export default{
  name: 'CommonTableBox',
  data() {
    return {
      checkAll: false, // 选择所有
      curDataList: []
    }
  },
  components: {
    CommonTd
  },
  watch: {
    checkAll() {
      this.curDataList.forEach(item => {
        item.checked = this.checkAll;
      })
    },
    dataList() {
      util.copyList(this.dataList, this.curDataList)
    }
  },
  props: {
    operwidth: { type: String, default: '150px' },
    showCheck: { type: Boolean, default: false },
    showoper: { type: Boolean, default: true },
    showfieldList: {
      type: Array,
      default() {
        return [];
      }
    },
    dataList: {
      type: Array,
      default() {
        return [];
      }
    }
  },
  methods: {
    sort(index) {
      this.$emit('sort', index)
    },
    getCheckdItem(selectItem, cb) {
      if (selectItem) {
        return utils.getCheckdItem(this.curDataList, cb)
      } else {
        cb(selectItem)
      }
    },
    selectrow(value) {
      value.checked = !value.checked
      this.$emit('selectRow', value)
    },
    clickRow(value) {
      this.$emit('clickRow', value)
    }
  },
  created() {
  }
}
</script>

<style scoped>
</style>
