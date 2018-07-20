<template>
  <div>
      <mt-header fixed :title="title">
          <div  @click="goback()" slot="left">
            <i class="mintui mintui-back"></i>
            <span>返回</span>
          </div>
        </mt-header>
        <div class="contentcontent content-box-top"  flex="dir:top main:left cross:center">
            <div class="itembox"  flex="dir:left main:left cross:center">
                <span class="input-title">收件人：</span>
                <div  class="flexbox1 inputbox">
                    <input v-on:blur="validate([{ required: true, message: '收件人姓名不能为空' }],editinfo,'phone')" class="inputvalue" placeholder="收件人姓名" type="text" v-model="editinfo.name">
                </div>
                
            </div>
             <div class="itembox" flex="dir:left main:left cross:center">
                <span  class="input-title">联系电话：</span>
                <div  class="flexbox1  inputbox">
                    <input v-on:blur="validate([{ required: true, message: '电话不能为空' }],editinfo,'phone')"  class="inputvalue" placeholder="联系电话" type="text" v-model="editinfo.phone">
                </div>
            </div>
             <div class="itembox" flex="dir:left main:left cross:center">
                <span  class="input-title">地区：</span>
                <div class="flexbox1 inputvalue" @click="popupVisible=true">{{editinfo.province+'  '+editinfo.city+'  '+editinfo.area}}</div>
            </div>
             <div class="itembox" flex="dir:left main:left cross:center">
                <span  class="input-title">详细地址：</span>
                <div  class="flexbox1  inputbox">
                    <input v-on:blur="validate([{ required: true, message: '地址不能为空' }],editinfo,'detail')" class="inputvalue" placeholder="详细地址" type="text" v-model="editinfo.detail">
                </div>
            </div>
             <div class="itembox" flex="dir:left main:left cross:center">
                <span  class="input-title">是否默认：</span>
                <mt-switch class="flexbox1 inputvalue" :value="editinfo.check" v-on:input="editinfo.check=arguments[0]"></mt-switch>
            </div>
            <div @click="sure()" class="button-red" style="margin-top:30px;">保存</div>
        </div>
        <mt-popup
            v-model="popupVisible"
            position="bottom">
            <mt-picker :slots="addressSlots" @change="onAddressChange" :visible-item-count="5"></mt-picker>
        </mt-popup>
  </div>
</template>

<script>

import mymix from 'src/mixin'
import addressdata from './address'
import { post } from 'common/api'
// 框架
export default{
  mixins: [mymix],
  data() {
    return {
      changeflag: false,
      popupVisible: false,
      title: '',
      address: {},
      editinfo: {},

      addressSlots: [
        {
          flex: 1,
          values: [],
          className: 'slotvalue',
          defaultIndex: 0,
          textAlign: 'center'
        }, {
          divider: true,
          content: '-',
          className: 'slotvalue'
        }, {
          flex: 1,
          values: [],
          className: 'slotvalue',
          defaultIndex: 0,
          textAlign: 'center'
        }, {
          divider: true,
          content: '-',
          className: 'slotvalue'
        }, {
          flex: 1,
          values: [],
          className: 'slotvalue',
          defaultIndex: 0,
          textAlign: 'center'
        }
      ]
    }
  },
  watch: {

  },

  methods: {
    onAddressChange(picker, values) {
      // console.log('picker', picker, values)
      this.editinfo.province = values[0];
      this.editinfo.city = values[1];
      this.editinfo.area = values[2];
      const cityarr = []
      const areaarr = []
      this.address[this.editinfo.province].children.forEach(cityitem => {
        cityarr.push(cityitem.text);
        picker.setSlotValues(1, cityarr);
        if (cityitem.text === this.editinfo.city) {
          cityitem.children.forEach(areaitem => {
            areaarr.push(areaitem.text);
            picker.setSlotValues(2, areaarr);
          })
        }
      })
      // console.log('city', cityarr, areaarr)
    },
    checkaddress() {
      if (!this.editinfo.name) {
        this.$toast('收件人不能为空')
        return false
      }
      if (!this.editinfo.phone) {
        this.$toast('电话不能为空')
        return false
      }
      if (!this.editinfo.province) {
        this.$toast('省不能为空')
        return false
      }
      if (!this.editinfo.city) {
        this.$toast('城市不能为空')
        return false
      }
      if (!this.editinfo.area) {
        this.$toast('地址不能为空')
        return false
      }
      if (!this.editinfo.detail) {
        this.$toast('地址不能为空')
        return false
      }
      return true
    },
    sure() {
      if (this.checkaddress() === false) {
        return;
      }
      const params = this.$route.params
      if (this.changeflag) {
        this.user.address.splice(params.index, 1, this.editinfo)
        // this.user.address[params.index] = this.editinfo
        if (this.editinfo.check) {
          this.user.address.forEach((item, index) => {
            if (index !== params.index) {
              item.check = false
            }
          })
          console.log('edit select:', this.editinfo)
          Object.assign(this.user.selectaddress, this.editinfo)// 设默认
        }
      } else {
        if (this.editinfo.check) {
          this.user.address.forEach(item => {
            item.check = false
          })
        }
        console.log('add address:', this.editinfo)
        Object.assign(this.user.selectaddress, this.editinfo)// 设默认
        this.user.address.push(this.editinfo)
      }
      console.log('info', this.changeflag, this.user.address)
      const address = JSON.stringify(this.user.address)
      post('user', 'UpdateAddress', { address })
      .then(() => {
        this.$toast('修改成功')
        this.goback();
      }).catch(err => {
        console.log(err)
      })
    }

  },
  created() {
    addressdata.forEach((item, index) => {
      this.address[item.text] = item
      this.addressSlots[0].values.push(item.text)
      if (index === 0) {
        item.children.forEach((cityitem, cityindex) => {
          this.addressSlots[2].values.push(cityitem.text)
          if (cityindex === 0) {
            cityitem.children.forEach(areaitem => {
              this.addressSlots[4].values.push(areaitem.text)
            })
          }
        })
      }
    })
    // console.log('this.address', this.address)
    const params = this.$route.params
    console.log('params', params)
    this.changeflag = params.index >= 0 && params.index < this.user.address.length
    if (this.changeflag) {
      Object.assign(this.editinfo, this.user.address[params.index])
      this.title = '编辑地址'
    } else {
      this.editinfo = { name: '', phone: '', province: '', city: '', area: '', detail: '', check: false }
      this.title = '新增地址'
    }
  }
}
</script>

<style scoped>
.content{
    width:100%;
    height: 100%;
}
.itembox{
    width:100%;
    height: 30px;
    padding: 10px;
    background: #fff;
    border-bottom: 1px solid #e2e2e2;
}

.itembox .input-title{
    width: 20%;
    text-align: left;
    line-height: 30px;
    font-size: 12px;
    white-space: nowrap;
    overflow: hidden;
}

.itembox  .inputvalue{
    line-height: 30px;
    width:100%;
    height: 25px;
    border: 0;
}

.itembox .inputbox{
    /*border-bottom: 1px solid #e2e2e2;*/
}

.slotvalue{

}
</style>
