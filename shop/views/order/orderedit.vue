<template>
    <transition name="dailog-fade">
        <div  class="dailog-box">
            <div class="dailog-mask" @click="close"></div>
            <div class="dailog-content" flex="dir:top main:center cross:left" >
               <div class="textrow" flex="dir:left main:left cross:center">
                        <span  class="input-title">身份证号：</span>
                        <div  class="flexbox1  inputbox">
                            <input class="inputvalue" placeholder="身份证号" type="text" v-model="idnum">
                        </div>
                    </div>
                <pic-upload title="身份证正面：" :path="idnumpic1" v-on:update="idnumpic1=arguments[0]"></pic-upload>
                <pic-upload title="身份证反面：" :path="idnumpic2" v-on:update="idnumpic2=arguments[0]"></pic-upload>
                <div class="button-submit" @click="submit()">确认提交</div>
            </div>
        </div>
    </transition>
</template>

<script>

import mymix from 'src/mixin'
import { post } from 'common/api'
import PicUpload from 'views/common/picupload'
export default{
  name: 'orderedit',
  mixins: [mymix],
  data() {
    return {
      idnumpic1: '',
      idnumpic2: '',
      idnum: ''
    }
  },
  props: {
    orderInfo: {
      type: Object

    }
  },
  watch: {

  },
  components: {
    PicUpload

  },
  methods: {
    close() {
      this.$emit('close')
    },
    submit() {
      post('ShopOrder', 'UpdateIdNum', { id: this.orderInfo.id, idnum: this.idnum, idnumpic1: this.idnumpic1, idnumpic2: this.idnumpic2 })
        .then(() => {
          this.$toast('修改成功')
          this.$emit('changeok')
          this.$emit('close')
        }).catch(err => {
          console.log(err)
        })
    }
  },

  created() {
    this.idnumpic1 = this.orderInfo.idpic1
    this.idnumpic2 = this.orderInfo.idpic2
    this.idnum = this.orderInfo.idnum
  }
}
</script>

<style scoped>

  .textrow{
    width:100%;
    height: 40px;
    padding: 10px;
    background: #fff;
    border-bottom: 1px solid #e2e2e2;
}

.backtop{
  background:url(/static/img/border_order_top.png);
  height: 2px;
}
.textrow .input-title{
    width: 20%;
    text-align: left;
    line-height: 30px;
    font-size: 14px;
    white-space: nowrap;
    overflow: hidden;
}

.textrow  .inputvalue{
    line-height: 30px;
    width:100%;
    height: 25px;
    border: 0;
        font-size: 14px;
}

.button-submit{
    width:100%;
    height: 40px;
    line-height: 40px;
    font-size: 16px;
    color: white;
    text-align: center;    
    background-color: #04be02;
}
</style>
