<template>
  <div>
       <mt-header fixed title="选择收货地址">
          <div  @click="goback()" slot="left">
            <i class="mintui mintui-back"></i>
            <span>返回</span>
          </div>
        </mt-header>
        <div class="content content-box-top" flex="dir:top main:center cross:center">
            <template v-if="user.address.length===0">
              <div  flex="dir:top main:center cross:center">
                  <i class="iconfont zyx-address"></i>
                  <div >你还没有地址，新加一个吧</div>
              </div>
            </template>
            <template v-else>
              <ul style="width: 100%;padding:5px 5px;background-color:rgba(162, 161, 161, 0.28);margin-bottom:40px;" flex="dir:top main:left cross:left">
                <li @click="select(item)" style="padding:5px 5px;background-color: white;margin-bottom: 10px;" :key="index" v-for="(item,index) in user.address" flex="dir:top main:left cross:left">
                  <div class="backtop"></div>
                  <div class="iteminfo" flex="dir:left main:left cross:center">
                      <div>收货信息:</div>
                      <div flex-box="1">{{item.name+'  '+item.phone}}</div>
                      
                  </div>
                  <div class="iteminfo" >详细地址:{{item.province+'  '+item.city+'  '+item.area+' '+item.detail}}</div>
                  <div flex="dir:right main:left cross:center" style="padding: 5px 0;">   
                        <div class="textbtn" @click.stop="edit(item,index)">【修改】</div>
                        <div class="textbtn" @click.stop="delAddress(item,index)">【删除】</div>
                      </div>
                </li>
              </ul>
            </template>
            <div class="button-red" style="position: fixed;bottom: 0px;width: 100%;" @click="add()">新增收货地址</div>
        </div>

  </div>
</template>

<script>
import model from 'src/model'
import mymix from 'src/mixin'
import util from 'common/utils'
// 框架
export default{
  name: 'addressselect',
  mixins: [mymix],
  data() {
    return {

    }
  },
  watch: {

  },
  methods: {
    edit(item, index) {
      this.$router.push({ path: '/addressedit/' + index });
    },

    add() {
      this.$router.push({ path: '/addressedit/-1' });
    },
    select(item) {
      // Object.assign(this.user.selectaddress, item)// 设默认
      util.assignBySrc(this.user.selectaddress, item)
      // this.$set(this.user.selectaddress, 'name', item.name)
      this.goback();
    }
  },
  created() {
    model.user.checkLogin()
  }
}
</script>

<style scoped>
.backtop{
  background:url(/static/img/border_order_top.png);
  height: 2px;
}

.content{

}

.iteminfo{
  border-bottom: 1px solid #e2e2e2;
  line-height: 30px;
  /* height: 30px; */
  font-size: 14px;
}

.textbtn{
  cursor: pointer;

}

.textbtn:hover{
  background-color: #7fda9aba;;
}
</style>
