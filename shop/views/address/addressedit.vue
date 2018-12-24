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
                <div  flex-box="1" class="inputbox" >
                    <input maxlength="20" v-on:blur="validate([{ required: true, message: '收件人姓名不能为空' }],editinfo,'phone')" class="inputvalue" placeholder="收件人姓名" type="text" v-model="editinfo.name">
                </div>
                
            </div>
             <div class="itembox" flex="dir:left main:left cross:center">
                <span  class="input-title">联系电话：</span>
                <div flex-box="1" class=" inputbox">
                    <input maxlength="20" v-on:blur="validate([{ required: true, message: '电话不能为空' }],editinfo,'phone')"  class="inputvalue" placeholder="联系电话" type="text" v-model="editinfo.phone">
                </div>
            </div>
             <div class="itembox" flex="dir:left main:left cross:center">
                <span  class="input-title">地区：</span>
                <div flex-box="1" class=" inputvalue" @click="popupVisible=true">{{editinfo.province+'  '+editinfo.city+'  '+editinfo.area}}</div>
            </div>
             <div class="itembox" flex="dir:left main:left cross:center">
                <span  class="input-title">详细地址：</span>
                <div  flex-box="1" class=" inputbox">
                    <input maxlength="100" v-on:blur="validate([{ required: true, message: '地址不能为空' }],editinfo,'detail')" class="inputvalue" placeholder="详细地址" type="text" v-model="editinfo.detail">
                </div>
            </div>
             <div class="itembox" flex="dir:left main:left cross:center">
                <span  class="input-title">是否默认：</span>
                <mt-switch flex-box="1" class=" inputvalue" :value="editinfo.check" v-on:input="editinfo.check=arguments[0]"></mt-switch>
            </div>


            <div style="width:100%;margin-top: 20px;padding:10px;" flex="dir:top main:left cross:left">
              <div class="input-title" style="font-weight: bold;font-size: 16px;">智能导入地址</div>
              <textarea  maxlength="200" class="textrow" style="height:80px;" placeholder="粘贴整段地址，自动识别姓名、电话和地址" rows="4" v-model="auto_address_text"></textarea>
              <div style="width:100%;" flex="dir:right main:left cross:center">
                <div @click="autoFill()" class="button-red autofill_btn" style="background-color: #108423;">提交</div>
                <div @click="auto_address_text=''" class="button-red autofill_btn" style="background-color:gray;">清除</div>
                
              </div>
            </div>

            <div @click="sure()" class="button-red" style="margin-top:30px;cursor: pointer;">保存地址</div>
        </div>
        <mt-popup
            v-model="popupVisible"
            position="bottom">
            <mt-picker :slots="addressSlots" @change="onAddressChange" :visible-item-count="5"></mt-picker>
             <div @click="addresscheckok()" class="button-red" style="margin-top:30px;cursor: pointer;width:100%;">确定</div>
        </mt-popup>
  </div>
</template>

<script>

import mymix from 'src/mixin'
import addressdata from './address'
import { post } from 'common/api'
import util from 'common/utils'
// 框架
export default{
  name: 'addressedit',
  mixins: [mymix],
  data() {
    return {
      changeflag: false,
      popupVisible: false,
      auto_address_text: '',
      title: '',
      address: {},
      editinfo: {},
      addressMap: {},
      addressfind: {},
      addresstemp: {},
      addressPreTree: { child: {}, isword: false },
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
      this.addresstemp.province = values[0];
      this.addresstemp.city = values[1];
      this.addresstemp.area = values[2];

      const cityarr = []
      const areaarr = []
      if (this.address[this.addresstemp.province].children) {
        this.address[this.addresstemp.province].children.forEach(cityitem => {
          cityarr.push(cityitem.name);
          if (cityitem.name === this.addresstemp.city) {
            if (cityitem.children) {
              cityitem.children.forEach(areaitem => {
                areaarr.push(areaitem.name);
              })
            }
          }
        })
      }
      picker.setSlotValues(1, cityarr);
      picker.setSlotValues(2, areaarr);
    },
    addresscheckok() {
      this.editinfo.province = this.addresstemp.province
      this.editinfo.city = this.addresstemp.city
      this.editinfo.area = this.addresstemp.area
      this.popupVisible = false;
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
      if (this.checkPhone(this.editinfo.phone) == false) {
        this.$toast('不是正确的电话号')
        return false
      }
      if (!this.editinfo.province) {
        this.$toast('地区不能为空')
        return false
      }
      if (!this.editinfo.city) {
        this.$toast('地区不能为空')
        return false
      }
      if (!this.editinfo.area) {
        this.$toast('地区不能为空')
        return false
      }
      if (!this.editinfo.detail) {
        this.$toast('地址不能为空')
        return false
      }
      return true
    },
    remaintrim(text) {
      return text.replace(/(^[ \t\n\r,，。|;]+)|([ \t\n\r,，。|;]+$)/g, '');
    },
    trimreturn(text) {
      return text.replace(/(^[\t\n\r]+)|([ \t\n\r]+$)/g, '');
    },
    autoFill() {
      const trimtext = util.trim(this.auto_address_text)
      this.addressfind = {}
      if ((trimtext || '') === '') {
        this.$toast('内容不能为空')
        return
      }
      // 清空
      this.editinfo.phone = ''
      this.editinfo.province = ''
      this.editinfo.city = ''
      this.editinfo.area = ''
      this.editinfo.detail = ''
      // 获取手机号
      const numberreg = /((0\d{2,3}-\d{7,8})|(1[3456789]\d{9}))/g // 手机号
      const matchres = trimtext.match(numberreg)
      let findflag = false;
      const docthis = this
      const findtext = function(text) {
        const findres = docthis.findAddress(text)
        if (findres) {
          docthis.initUserName(findres.remain)
          return true
        }
        return false
      }
      if (matchres) {
        this.editinfo.phone = matchres[0];
        const rearr = trimtext.split(this.editinfo.phone, 2)
        if (rearr.length === 2) {
          rearr[0] = util.trim(rearr[0])
          rearr[1] = util.trim(rearr[1])
          if (rearr[0] !== '' && (rearr[1] !== '')) {
            for (let i = 0; i < 2; i++) {
              const findres = this.findAddress(rearr[i])
              if (findres) {
                findflag = true
                this.editinfo.detail = this.trimreturn(findres.remain)
                this.editinfo.name = this.trimreturn(rearr[1 - i])
                break;
              }
            }
          } else if (rearr[0] !== '') {
            findflag = findtext(rearr[0])
          } else if (rearr[1] !== '') {
            findflag = findtext(rearr[1])
          }
        } else {
          const alltext = rearr[0]
          if (util.trim(alltext) !== '') {
            findflag = findtext(alltext)
          }
        }
        if (findflag === false) {
          this.$toast('自动获取失败')
          return;
        }
      } else {
        const findres = this.findAddress(trimtext)
        if (findres) {
          this.initUserName(findres.remain)
        } else {
          this.$toast('自动获取失败')
          return;
        }
      }
      this.$toast('自动解析成功，请检查解析结果是否正确')
      this.initSlotValue()
    },
    initUserName(text) {
      const res = text.split(/[ \t\n\r,，。|;]+/, 2)
      if (res.length === 2) {
        if (res[0].length > res[1].length) {
          this.editinfo.detail = this.trimreturn(res[0])
          this.editinfo.name = this.trimreturn(res[1])
        } else {
          this.editinfo.name = this.trimreturn(res[0])
          this.editinfo.detail = this.trimreturn(res[1])
        }
      } else {
        this.editinfo.detail = this.trimreturn(res[0])
      }
    },
    addWordToTree(word) {
      let cur_root = this.addressPreTree
      if (word == null) { return; }
      for (let i = 0; i < word.length; i++) {
        const char = word[i]
        if (cur_root.child[char] == null) {
          cur_root.child[char] = { child: {}, isword: false }
        }
        cur_root = cur_root.child[char]
        if (i === word.length - 1) {
          cur_root.isword = true
        }
      }
    },
    initaddressDic() {
      const start = new Date().getTime()
      console.log('begin init address dic')
      let totalnum = 0;
      addressdata.forEach(item => {
        totalnum++;
        if (this.addressMap[item.name]) {
          console.log('cityitem.name duplicate', item.name)
          this.addressMap[item.name].push(item)
        } else {
          this.addressMap[item.name] = [item];
        }

        item.level = 1;
        this.addWordToTree(item.name)
        if (item.children) {
        // 市
          item.children.forEach(cityitem => {
            cityitem.level = 2;
            cityitem.parent = item
            this.addWordToTree(cityitem.name)
            if (this.addressMap[cityitem.name]) {
            // console.log('cityitem.name duplicate',cityitem.name)
              this.addressMap[cityitem.name].push(cityitem)
            } else {
              totalnum++;
              this.addressMap[cityitem.name] = [cityitem];
            }

            if (cityitem.children) {
            // 区
              cityitem.children.forEach(areaitem => {
                areaitem.level = 3;
                areaitem.parent = cityitem
                this.addWordToTree(areaitem.name)
                if (this.addressMap[areaitem.name]) {
                  // console.log('cityitem.name duplicate',areaitem.name)
                  this.addressMap[areaitem.name].push(areaitem)
                } else {
                  totalnum++;
                  this.addressMap[areaitem.name] = [areaitem];
                }
              })
            }
          })
        }
      })
      const end = new Date().getTime()
      console.log('totalnum', totalnum, 'usetime', end - start)
    },
  // 找地址
    findAddress(text) {
      const addressOkMap = {}
      const texttrim = util.trim(text)
      const addressfind = this.addressfind
      const editorinfo = this.editinfo
        // 找所有的地址信息
      let beginindex = 0;
      let limittime = 0;
      while (true) {
        const searchres = this.searchTree(texttrim, beginindex)
        if (searchres) {
          if (!addressOkMap[searchres.wordtext]) {
            addressOkMap[searchres.wordtext] = searchres
          }
          beginindex = searchres.end + 1
        } else {
          break;
        }
        limittime++;
        if (limittime > 2000) { break; }
      }

      const compareaddress = function(fatherone, childone) {
        let findnum = childone.level - fatherone.level
        let father = childone
        while (findnum-- > 0) {
          father = father.parent
        }
        return father.code === fatherone.code
      }
        //
      const isMatchAddress = function(addressa, addressb) {
        if (addressa.level === addressb.level) {
          return false
        } else if (addressa.level < addressb.level) {
          return compareaddress(addressa, addressb)
        } else {
          return compareaddress(addressb, addressa)
        }
      }

      const addAddress = function(addressinfo) {
        if (addressinfo.level === 1) {
          if (!addressfind.province) {
            addressfind.province = addressinfo
            return true
          }
        } else if (addressinfo.level === 2) {
          if (addressfind.city == null) {
            addressfind.city = addressinfo
            return true
          }
        } else if (addressinfo.level === 3) {
          if (!addressfind.area) {
            addressfind.area = addressinfo
            return true
          }
        }
        return false// 表明这个地址无效
      }

      const fulladdress = function() {
        if (addressfind.area) {
          editorinfo.province = addressfind.area.parent.parent.name
          editorinfo.city = addressfind.area.parent.name
          editorinfo.area = addressfind.area.name
          return true
        } else if (addressfind.city) {
          editorinfo.province = addressfind.city.parent.name
          editorinfo.city = addressfind.city.name
        } else if (addressfind.province) {
          editorinfo.province = addressfind.province.name
        }
        return false
      }

      let addresslist = []
      const addresssmap = this.addressMap
      for (const key in addressOkMap) {
        if (addressOkMap.hasOwnProperty(key) && addressOkMap[key] != null) {
          const addressinfo = addresssmap[key]
          addresslist = addresslist.concat(addressinfo)
          addressinfo.forEach(item => {
            item.start = addressOkMap[key].start
            item.end = addressOkMap[key].end
          })
        }
      }

      if (addresslist.length > 0) {
        console.log('get addresslist', addresslist)
            // 填地址信息
            // 生成评分
        const varlidelist = []
        if (addresslist.length === 1) {
          if (addAddress(addresslist[0])) {
            varlidelist.push(addresslist[0])
          }
        } else {
            // 初始化评分
          for (let i = 0; i < addresslist.length; i++) {
            const addresssinfo = addresslist[i]
            let score = 0;
            for (let targetindex = 0; targetindex < addresslist.length; targetindex++) {
              if (targetindex !== i) {
                if (isMatchAddress(addresssinfo, addresslist[targetindex])) {
                  score++;
                }
              }
            }
            addresssinfo.score = score;
          }
            // 排序 低层的在前
          addresslist.sort((a, b) => {
            if (b.score === a.score) {
              return b.level - a.level
            } else {
              return b.score - a.score
            }
          })

          // 添加地址
          addresslist.forEach(item => {
            if (addAddress(item)) {
              // 说明有效
              varlidelist.push(item)
            }
          })
        }
        if (fulladdress()) {
            // 地址填完全了
            // 有效地址清理一下
          varlidelist.splice(0)
          varlidelist.push(addressfind.area)
          addresslist.forEach(item => {
            if (isMatchAddress(item, addressfind.area)) {
              // 说明有效
              varlidelist.push(item)
            }
          })
          console.log('find full address', varlidelist)
        }

        let remaintext = ''
        for (let i = 0; i < texttrim.length; i++) {
          let delflag = false
          for (let validindex = 0; validindex < varlidelist.length; validindex++) {
            if (varlidelist[validindex].start <= i && i <= varlidelist[validindex].end) {
              delflag = true
            }
          }
          if (delflag === false) {
            remaintext += texttrim[i]
          }
        }
            // 找到了
        console.log('remina text', this.remaintrim(remaintext))
        return { remain: this.remaintrim(remaintext) }  // 去掉地址后的文本
      } else {
        return null
      }
    },

    // 查找
    searchTree(text, begin) {
      const texttrim = util.trim(text)
      if (texttrim == null || texttrim.length === 0) { return null }

      let cur_root = this.addressPreTree
      let startindex = begin;
      for (let end = startindex; end < texttrim.length - 1;) {
        // 开头位置
        const child = cur_root.child[texttrim[end]]
        if (child) {
          cur_root = child;
          if (child.isword) {
            // const remain = texttrim.slice(0, startindex) + ' ' + texttrim.slice(end + 1)
            const wordtext = texttrim.substring(startindex, end + 1)
            return { wordtext, start: startindex, end }
          } else {
            end++
          }
        } else {
          // 从头来
          startindex++;
          end = startindex
          cur_root = this.addressPreTree
        }
      }
      return null
    },
    // 做词典
    sure() {
      if (this.checkaddress() === false) {
        return;
      }
      const params = this.$route.params
      if (this.changeflag) {
        // 修改
        // console.log('edit', this.editinfo.check, params.index)
        this.user.address.splice(params.index, 1, this.editinfo)
        if (this.editinfo.check) {
          this.user.address.forEach((item, index) => {
            if ((index + '') !== params.index) {
              // console.log('set false:', index, params.index)
              item.check = false
            }
          })
          console.log('edit select:', this.editinfo)
          Object.assign(this.user.selectaddress, this.editinfo)// 设默认
        }
      } else {
        // 新增
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
      if (this.user.address.length > 200) {
        this.$toast('保存的地址数量过大，请删除后再试')
        return;
      }
      const address = util.trimspace(JSON.stringify(this.user.address, (key, value) => {
        if (key === 'check') {
          // console.log('value', value)
          if (!value) {
            // console.log('return null')
            return undefined
          }
        }
        return value
      }))
      post('user', 'UpdateAddress', { address })
      .then(() => {
        this.$toast('修改成功')
        this.goback();
      }).catch(err => {
        console.log(err)
      })
    },
  // 初始化选槽的地址
    initSlotValue() {
      this.addressSlots[0].values.splice(0)
      this.addressSlots[2].values.splice(0)
      this.addressSlots[4].values.splice(0)
      this.addressSlots[0].defaultIndex = 0;
      this.addressSlots[2].defaultIndex = 0;
      this.addressSlots[4].defaultIndex = 0;
      const addresslist = this.address
      const editinfo = this.editinfo
      const addressSlots = this.addressSlots
      addressdata.forEach((item, index) => {
        addresslist[item.name] = item
        addressSlots[0].values.push(item.name)
        if (item.name === editinfo.province) {
          addressSlots[0].defaultIndex = index
          item.children.forEach((cityitem, cityindex) => {
            addressSlots[2].values.push(cityitem.name)
            if (cityitem.name === editinfo.city) {
              addressSlots[2].defaultIndex = cityindex
              cityitem.children.forEach((areaitem, areaindex) => {
                addressSlots[4].values.push(areaitem.name)
                if (areaitem.name !== '' && areaitem.name === editinfo.area) {
                  addressSlots[4].defaultIndex = areaindex
                }
              })
            }
          })
        }
      })
    }

  },

  created() {
    const params = this.$route.params
    console.log('params', params)
    this.changeflag = params.index >= 0 && params.index < this.user.address.length
    if (this.changeflag) {
      // Object.assign(this.editinfo, this.user.address[params.index])
      util.assignBySrc(this.editinfo, this.user.address[params.index])// 设默认
      this.title = '编辑地址'
    } else {
      // this.editinfo = { name: '', phone: '', province: '', city: '', area: '', detail: '', check: false }
      this.$set(this.editinfo, 'phone', '')
      this.$set(this.editinfo, 'province', '')
      this.$set(this.editinfo, 'city', '')
      this.$set(this.editinfo, 'area', '')
      this.$set(this.editinfo, 'detail', '')
      this.$set(this.editinfo, 'name', '')
      this.$set(this.editinfo, 'check', false)
      this.title = '新增地址'
    }



    this.initSlotValue()

    this.initaddressDic()


    // console.log('this.address', this.address)
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


.autofill_btn{
  width: 20%;
    cursor: pointer;
    margin: 10px 10px;
    background-color: gray;
    height: 30px;
    line-height: 30px;
}
</style>
