<template>
    <div class="tabbox">
        <div class="head-list">
            <div  :key="'head'+tab.name" v-for="(tab,index) in tabList" class="headbox" :class="{'is-active':tab.check}" @click="changeTab(index)">
                {{tab.name}}
            </div>
        </div>
        <div class="content-list">
            <div v-show="tab.check" :key="'content'+tab.name" v-for="tab in tabList" class="content" >
                <template v-if="item.tap===tab.type" v-for="item in changeList">
                    <div :key="item.name" class="config-itembox" >
                        <span class="form-label">{{item.info}}</span>
                        <template v-if="item.type=='bool'">
                            <div style="display:inline-block" @click="item.value=item.value==='1'?'0':'1'">
                              <span  class="switch" :class='{"checked":item.value==="1"}' style="width: 40px;">
                                <span class="switch__button"></span>
                              </span>
                            </div>
                        </template>
                        <template v-else-if="item.type=='pic'">
                            <common-pic-input showPreview :picpath="item.value" v-on:updatepic="item.value=arguments[0]"></common-pic-input>
                        </template>
                         <template v-else-if="item.type==='text'">
                            <textarea  style="display: block;" v-model="item.value" rows="5" cols="100"></textarea>
                        </template>
                        <template v-else-if="item.name==='logistics_default_task'">
                              <el-select  clearable v-model="item.value" size="mini" :placeholder="item.info">
                                    <el-option
                                            v-for="item in logistics_taskList"                                            
                                            :key="item.id+''"
                                            :label="item.name"
                                            :value="item.id+''">
                                    </el-option>
                                </el-select>
                        </template>
                        <template v-else-if="item.name=='home_ads_set'">
                            <div class="tablebox" style="display: inline-block;vertical-align: middle;">
                                <table>
                                    <tbody>
                                    <tr :key="index"  v-for="(adsitem,index) in item.value">
                                        <td class="name">{{adsitem.title}}</td>
                                        <td>
                                            <el-select v-model="adsitem.posid" size="mini" placeholder="选择广告位">
                                                <el-option
                                                        v-for="item in adsPosList"
                                                        :key="item.name"
                                                        :label="item.name"
                                                        :value="item.id">
                                                </el-option>
                                            </el-select>
                                        </td>
                                        <td>
                                            <div>
                                                <img style="width: 25px" src="~assets/img/icondel.png" @click="delAdsPos(item.value,index)"/>
                                                <img style="width: 25px" src="~assets/img/down.png" v-show="index<item.value.length-1" @click="downAdsPos(item.value,index)"/>
                                                <img style="width: 25px" src="~assets/img/up.png" v-show="index>0" @click="upAdsPos(item.value,index)"/>
                                            </div>
                                        </td>
                                    </tr>
                                    <tr><img src="~assets/img/iconadd.png" @click="addAdsPos(item.value)"/></tr>
                                    </tbody>
                                </table>
                            </div>
                        </template>
                        <template v-else>
                            <input  class="input-box"  v-model="item.value">
                        </template>
                    </div>
                </template>
                
            </div>
        </div>
        <div class="footer">
            <button  class="button button-blue" @click="edit()">确定修改</button>
        </div>
    </div>
</template>

<script>
import model from 'src/model/index.js'
import { post } from 'common/api'
import myMixin from 'common/mixin/admin.js'
import util from 'common/utils'
import CommonPicInput from 'src/views/common/common_inputpic'
export default{
  mixins: [myMixin],
  data() {
    return {
      dataList: model[this.modelName].list, // 用户列表
      changeList: [],
      fieldList: model[this.modelName].fieldList, // 字段列表
      logistics_taskList: model.logistics_task.list,
      curTabInfo: {},
      adsPosList: model.adspos.list,
      tabList: []
    }
  },
  watch: {
    dataList() {
      // this.changeList= JSON.parse(JSON.stringify(this.dataList))
      util.deepcopyList(this.dataList, this.changeList, item => {
        if (item.type === 'array') {
          if (item.value) {
            item.value = JSON.parse(item.value)
          } else {
            item.value = []
          }
        }
      })
    }
  },
  props: {
    serverModelName: {// 服务器对应的control名
      type: String,
      default: 'config'
    },
    modelName: {// 本地对应的模块名
      type: String,
      default: 'config'
    }
  },
  components: {
    CommonPicInput
  },
  methods: {
    addAdsPos(adslist) {
      this.$prompt('请输入楼层名', '新增楼层', {
        confirmButtonText: '确定',
        cancelButtonText: '取消'
      }).then(({ value }) => {
        if (value === '') {
          this.$message({ message: '楼层名不能为空', type: 'error', duration: 1000 })
          return;
        }
        adslist.push({ title: value, posid: '' })
      }).catch(err => {
        console.log(err)
        this.$message({
          type: 'info',
          message: '取消输入'
        });
      });
    },
    delAdsPos(adslist, index) {
      adslist.splice(index, 1)
    },
    upAdsPos(adslist, index) {
      const frontinfo = adslist[index - 1]
      const curinfo = adslist[index]
      adslist.splice(index - 1, 1, curinfo);
      adslist.splice(index, 1, frontinfo);
    },
    downAdsPos(adslist, index) {
      const afterinfo = adslist[index + 1]
      const curinfo = adslist[index]
      adslist.splice(index + 1, 1, curinfo)
      adslist.splice(index, 1, afterinfo);
    },
    initTabList() {
      this.tabList.splice(0);
      this.tabList.push({ name: '网站配置', check: false, type: 'web' });// 初始化
      // this.tabList.push({ name: '订单配置', check: false, type: 'order' });// 初始化
    },
    changeTab(index) {
      console.log('change tab', index);
      for (let i = 0; i < this.tabList.length; i++) {
        if (i === index) {
          this.curTabInfo = this.tabList[i];
          this.curTabInfo.check = true;
        } else {
          this.tabList[i].check = false;
        }
      }
    },
    // 编辑
    edit() {
      const changeList = []
      // console.log('old', this.dataList)
      // console.log('now', this.changeList)
      this.changeList.forEach((element, index) => {
        if (element.type === 'array') {
          const nowvalue = JSON.stringify(element.value)
          const oldvalue = JSON.stringify(JSON.parse(this.dataList[index].value))
          // console.log('compare', oldvalue, nowvalue)
          if (oldvalue !== nowvalue) {
            changeList.push({ id: element.id, value: nowvalue })
          }
        } else {
          // console.log('compare', this.dataList[index].value, element.value)
          if (this.dataList[index].value !== element.value) {
            changeList.push({ id: element.id, value: element.value })
          }
        }
      });

      post(this.serverModelName, 'edit', { list: changeList })
        .then(() => {
          this.getData();
          this.$message({ message: '修改成功', type: 'success', duration: 1000 })
        })
        .catch(err => {
          console.log('err', err);
        })
    },
    getData() {
      this.initTabList();
      this.changeTab(0);
      model.config.all();
    }

  },

  created() {
    // 获取数据
    this.getData();
  }
}
</script>

<style scoped>
.config-itembox{
    padding: 10px;
}

.footer{
  padding:  20px 0;
}

.addbox{
  background-color: #e8e3dd80;
  margin: 20px 0;
}

.rule-box{
  background-color: #e8e3dd80;
  margin: 20px 0;
  position: relative;
}

.rule-box .del-box{
  position: absolute;
  top: 10px;
  right: 10px;
}

</style>
