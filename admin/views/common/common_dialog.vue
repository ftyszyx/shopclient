<template>
        <div  class="dialog-mask"  @click="close()">
            <div class="dialog"  style="width:90%;"  @click.stop>
                <div class="header">
                    <span class="title">{{title}}</span>
                    <span class="close" @click="close()">x</span>
                </div>
                <div class="content">
                  <slot name="edititembox"  v-bind:value="changedata">
                    <template  v-for="field in fieldList" v-if="field.changeable">
                        <common-dailog-item v-on:change="changedata[field.name]=arguments[0]" :key="field.name" :field="field" :value="changedata[field.name]"></common-dailog-item>
                    </template>
                    </slot>
                </div>
                <div class="footer">
                  <slot name="footer">
                    <button v-if="showfooter" class="button button-blue" @click="sure()">确 定</button>
                  </slot>
                </div>
            </div>
             
        </div>
</template>

<script>

import CommonDailogItem from './common_dialog_item'
export default{
  mixins: [],
  name: 'Commondailog',
  data() {
    return {
      changedata: {},
      editorOption: {

      }
    }
  },
  components: {
    CommonDailogItem
  },
  props: {
    dialogdata: {
      type: Object
    },
    showfooter: {
      type: Boolean,
      default: true
    },
    fieldList: {
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
    clickOutside(eve) {
      console.log('eve', eve)
    },
    close() {
      console.log('close');
      this.$emit('close');
    },
    sure() {
      this.$emit('sure', this.changedata);
    }
  },

  mounted() {
  },
  created() {
    console.log('dialog created')
    this.fieldList.forEach(item => {
      if (item.changeable) {
        if (item.deepcopy) {
          this.$set(this.changedata, item.name, JSON.parse(JSON.stringify(this.dialogdata[item.name])))
        } else {
          if (item.type === 'date' || item.type === 'time') {
            this.$set(this.changedata, item.name, new Date(this.dialogdata[item.name] * 1000))
          } 
          else if (item.type === 'bool') {
            this.$set(this.changedata, item.name, 0)
          } 
          else if(item.cascaderList){
            var selectdata=this.dialogdata[item.name];
            if((selectdata||'')===''){
              this.$set(this.changedata, item.name, [])
            }else{
               this.$set(this.changedata, item.name, selectdata)
            }
          }
          else {
            
            this.$set(this.changedata, item.name, this.dialogdata[item.name])
          }
        }
      }
    })
    console.log('changedata', this.changedata)
  }
}
</script>

<style scoped>
</style>
