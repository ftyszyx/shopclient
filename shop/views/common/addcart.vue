<template>
    <transition name="dialog-fade">
        <div  class="dialog-box">
            <div class="dialog-mask" @click="close"></div>
            <div class="dialog-content" flex="dir:top main:center cross:left" >
                <div class="detail" flex="dir:left main:left cross:top" >
                    <img :src="itempic">
                    <div class="info" flex="dir:top main:justify cross:left" >
                        <div class="title">{{iteminfo.name}}</div>
                        <div class="price"  >{{"￥"+price}}</div>
                    </div>
                </div>
               
                 <!-- 规格 -->
                <div v-if="haveSpec"  flex="dir:top main:center cross:left" >
                    <div class="specbox" :key="sepcindex" v-for=" (specitem,sepcindex) in iteminfoCopy.spec.specList">
                        <!-- <hr class="with-margin-l"> -->
                        <h1 class="spectitle">{{specitem.name}}</h1>
                         <div class="taglist" flex="dir:left main:left cross:center">
                             <div class="tag" :key="tagid" v-for="(tagitem,tagid) in specitem.list" :class="{active:tagitem.check}" @click="checkSpec(specitem,tagid)">
                                 {{tagitem.name}}
                             </div>
                        </div>   
                    </div>
                </div>
                <div style="padding:3px;" flex="dir:left main:justify cross:center" >
                   <div flex="dir:left main:left cross:center">
                      <div class="buttnadd" @click="selectnum=selectnum-1">-</div>
                        <input  class="numinput" type="number"  v-model.number="selectnum">
                      <div class="buttnadd" @click="selectnum=selectnum+1">+</div>
                  </div>
                  <div class="pricetitle">
                      合计:<span class="price">{{"￥"+price*selectnum}}</span>
                  </div>
                </div>
                <div class="pricetitle" style="padding: 5px;">剩余<span class="price">{{storenum}}</span></div>
                <div class="bottombtn" @click="sure()">
                    {{onlyaddCart?"加入购物车":"购买"}}
                </div>
            </div>
        </div>
    </transition>
</template>

<script>
import models from 'src/model'
import { post } from 'common/api'
import mymix from 'src/mixin'
// 加购物车
export default{
  name: 'addcart',
  mixins: [mymix],
  data() {
    return {
      selectnum: 1,
      price: 0,
      storenum: 0,
      itempic: '',
      haveSpec: false,
      sepcname: '',
      iteminfoCopy: {},
      selectSpecId: 0

    }
  },
  watch: {
    selectSpecId() {
      this.updateItemInfo();
    }
  },
  props: {
    onlyaddCart: {
      type: Boolean,
      default: false
    },
    iteminfo: {
      type: Object
    }
  },

  methods: {
    checkSpec(specinfo, tagid) {
      specinfo.list.forEach((tag, index) => {
        if (index === tagid) {
          tag.check = true;
        } else {
          tag.check = false
        }
      })
      this.updatespecid()
    },
    specNameCheck(checkarr, namearr) {
      for (let i = 0; i < namearr.length; i++) {
        const res = checkarr.find(x => (x.specid === namearr[i].specid) && (x.tagid === namearr[i].tagid))
        if (res == null) {
          return false
        }
      }
      return true
    },
    // 更新选中的组合
    updatespecid() {
      const checklist = []
      const specinfo = this.iteminfoCopy.spec
      specinfo.specList.forEach((specitem, specid) => {
        specitem.list.forEach((tagitem, tagid) => {
          if (tagitem.check) {
            checklist.push({ specid, tagid })
          }
        })
      })

      const detailArr = specinfo.detailList
      for (let i = 0; i < detailArr.length; i++) {
        const detailinfo = detailArr[i]
        const namearr = detailinfo.namearr
        if (this.specNameCheck(checklist, namearr)) {
          this.selectSpecId = i;
          return;
        }
      }
      this.updateItemInfo();
    },
    updateItemInfo() {
      if (this.haveSpec) {
        const specinfo = this.iteminfoCopy.spec
        const detailinfo = specinfo.detailList[this.selectSpecId]
        this.price = detailinfo.price || this.iteminfoCopy.price
        this.storenum = detailinfo.store_num || this.iteminfoCopy.store_num
        this.itempic = detailinfo.pic || this.iteminfoCopy.icon
      } else {
        this.price = this.iteminfoCopy.price
        this.storenum = this.iteminfoCopy.store_num
        this.itempic = this.iteminfoCopy.icon
      }
    },
    close() {
      this.$emit('close')
    },
    getSpecName() {
      let specstr = '';
      const specinfo = this.iteminfoCopy.spec
      if (this.haveSpec) {
        const deatilinfo = specinfo.detailList[this.selectSpecId]
        deatilinfo.namearr.forEach(item => {
          specstr += specinfo.specList[item.specid].list[item.tagid].name;
        })
      }
      return specstr;
    },
    getsepcCode() {
      const specinfo = this.iteminfoCopy.spec
      if (this.haveSpec) {
        const deatilinfo = specinfo.detailList[this.selectSpecId]
        return deatilinfo.code
      } else {
        return this.iteminfoCopy.code
      }
    },
    sure() {
      models.user.checkLogin(() => {
        this.sepcname = this.getSpecName();
        const speccode = this.getsepcCode()
        if (this.onlyaddCart) {
        // 加购物车
          const oldcartinfo = models.user.shop_cart
          const findres = oldcartinfo.find(x => x.itemid === this.iteminfo.id && x.specid === this.selectSpecId && x.specname === this.sepcname && x.code === speccode)
          if (findres != null) {
            findres.num += this.selectnum
          } else {
            oldcartinfo.push({ itemid: this.iteminfo.id, specid: this.selectSpecId, price: this.price,
              specname: this.sepcname, num: this.selectnum, name: this.iteminfo.name, pic: this.itempic, code: speccode })
          }
          post('user', 'UpdateCart', { shop_cart: JSON.stringify(oldcartinfo) })
          .then(() => {
            this.$toast('添加成功')
            models.user.getinfo()
            this.$emit('close')
          }).catch(err => {
            console.log('err', err)
          })
        } else {
        // 直接买，跳转订单页面
          this.user.payList.splice(0)
          this.user.payList.push({ itemid: this.iteminfo.id, specid: this.selectSpecId, price: this.price,
            specname: this.sepcname, num: this.selectnum, name: this.iteminfo.name, pic: this.itempic, code: speccode })

          this.$router.push({ path: '/payorder' });
        }
      })
    }
  },
  created() {
    // this.selectnum = this.num
    this.haveSpec = this.iteminfo.spec.detailList.length > 0
    // this.selectSpecId = this.specid
    this.selectnum = 1
    this.selectSpecId = 0
    this.iteminfoCopy = JSON.parse(JSON.stringify(this.iteminfo));

    if (this.haveSpec) {
      const sepcinfo = this.iteminfoCopy.spec;
      // 选中的
      sepcinfo.specList.forEach(element => {
        element.list.forEach(item => {
          this.$set(item, 'check', false)
        })
      });

      const detailinfo = sepcinfo.detailList[this.selectSpecId]
      detailinfo.namearr.forEach(specitem => {
        sepcinfo.specList[specitem.specid].list[specitem.tagid].check = true
      })
    }

    this.updateItemInfo()
  }


}
</script>

<style scoped>
.dialog-fade-enter-active, .dialog-fade-leave-active{
    transition: all .2s;
}
.dialog-fade-enter, .dialog-fade-leave-to{
    transform:translateY(100%);
    opacity:.4;
}

.dialog-box {
    position: fixed;
    z-index: 3;
    top: 0;
    bottom: 0;
    width: 100%;
}

.dialog-box .dialog-mask {
    position: absolute;
    top: 0;
    bottom: 0;
    width: 100%;
    background-color: rgba(0,0,0,.6);
}

.dialog-box .dialog-content {
    position: fixed;
    bottom: 0;
    width: 100%;
    background-color: #fff;
}
    
.dialog-box .dialog-content img
{
  margin: 0 10px;
  width: 60px;
  height: 60px;
  border-radius: 50%;
}

.dialog-box .dialog-content .info
{
  margin: 0 10px;

}


.bottombtn{
  margin: 0;
  width: 100%;
  background: #F44;
  height: 50px;
  line-height: 48px;
  text-decoration: none;
  font-size: 16px;
  color: #FFF;
  text-align: center;
  cursor: pointer;
}

.specbox{
    padding: 0px 10px 3px 10px;
    font-size: 12px;
    color: #999;
    background-color: #FFFFFF;
}

.spectitle{
    font-size: 14px;
    color: #555;
    margin:2px 0;
}

.specbox  .tag {
    border: none;
    padding: 0.15rem 0.7rem;
    line-height: 25px;
    margin: 0 10px 10px 0;
    color: #333;
    background-color: #f0f0f0;
    font-size: 12px;
    text-align: center;
} 

.specbox  .tag.active{
    background-color: #F44;
    color: #fff;
}

.taglist{
  flex-wrap:wrap;
}

.title{
  line-height: 1.5;
  color: #666;
  padding: 2px;
  font-size: 14px;
}

.price{
  color: #F44; 
  font-size: 14px;
}

.pricetitle{
  color: #666;
  font-size: 14px;
}

.with-margin-l {
    margin-left: 10px;
    margin-right: 10px;
    border: 0;
    border-top: 1px solid #F0F0F0;
}
</style>
