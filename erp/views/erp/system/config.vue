<template>
    <div>
        <div class="tabbox">
          <div class="head-list">
              <div  :key="'head'+tab.name" v-for="(tab,index) in tabList" class="headbox" :class="{'is-active':tab.check}" @click="changeTab(index)">
                {{tab.name}}
              </div>
          </div>
          <div class="content-list">
            <div v-show="tab.check" :key="'content'+tab.name" v-for="tab in tabList" class="content" >
                <!-- 基本设置 -->
                <template v-if="tab.type==='base'">
                  <template v-for="item in dataList">
                    <div :key="item.name" class="config-itembox" >
                        <span class="form-label">{{item.info}}</span>
                        <template  v-if='item.name==="sell_check_default_user"'>
                            <!-- 审核人选择 -->
                            <el-select v-model="item.value" size="mini" placeholder="请选择审核人">
                                <el-option
                                v-for="item in checkUserList"
                                :key="item.id"
                                :label="item.name"
                                :value="item.id">
                                </el-option>
                            </el-select>
                        </template>
                        <template v-else-if="item.type=='int'">
                            <input  class="input-box"  type="number" v-model.number="item.int_value">
                        </template>
                        <template v-else>
                            <input  class="input-box"  v-model="item.value">
                        </template>
                    </div>
                </template>
                <div class="footer">
                      <button v-show="authDic.Config_edit.auth" class="button button-blue" @click="edit()">确定修改</button>
                      <!-- <button class="button button-blue" @click="casheUpdate()">更新系统缓存</button> -->
                    </div>
              </template>
              <!-- 仓库设置 -->
              <template v-else-if="tab.type==='store'">
                  <template v-if="tab.info.sell_num_limit>0">
                    <!-- <div>同样的组合，下面的会覆盖上面的</div> -->
                    <div v-for="(ruleitem,index) in storeCheckRuleList" :key="ruleitem.type" class="rule-box" >
                       <img class="del-box" src='~assets/img/icondel.png' @click="delRule(index)">
                      <div class="config-itembox">
                          <span class="form-label">订单组合</span>
                          <div class="tag-list">
                            <div :key="order.itemid+order.num" v-for="(order,order_index) in ruleitem.orders" class="tag-item" >
                              {{order.name+"*"+order.num}}
                              <i class="el-icon-close" @click="delRuleOrder(index,order_index)"></i>
                            </div>
                            <div class="tag-item button tag-add" @click="addRuleOrder(index)">
                              +增加
                            </div>
                          </div>
                      </div>
                     
                      <div class="config-itembox">
                          <span class="form-label">限制数量</span>
                          <input  class="input-box"  type="number" v-model.number="ruleitem.num">
                      </div>
                    </div>
                    <div class="addbox">
                    <img src='~assets/img/iconadd.png' @click="addrule()">
                    </div>

                     <div class="config-itembox">
                          <span class="form-label">冲突字段</span>
                          <div class="tag-list">
                            <div :key="field.name" v-for="(field,field_index) in fieldRule" class="tag-item" >
                              {{field.title}}
                              <i class="el-icon-close" @click="delRuleField(index,field_index)"></i>
                            </div>
                            <div class="tag-item button tag-add" @click="addRuleField()">
                              +增加
                            </div>
                          </div>
                      </div>
                    <div class="footer">
                      <button v-show="authDic.Store_updateCheckRule.auth" class="button button-blue" @click="editStoreCheckRule()">确定修改</button>
                      
                    </div>
                  </template>
                  
              </template>
            </div>
          </div>
        </div>

         
          <!-- 选择商品页面 -->
         <div class="dialog-mask" v-if="itemSelectPanel">
            <div class="dialog"  style="width:80%;margin-top:10px;">
              <div class="header">
                <span class="title">选择商品</span>
                <span class="close" @click="itemSelectPanel=false">X</span>
              </div>
              <div class="content">
                  <item-select :searchConditon="{check_limit:1}" showCheck ref="itemDailog"></item-select>
              </div>
              <div class="footer">
                  <button class="button button-blue" @click="selectitemOK">确 定</button>
              </div>
            </div>
          </div>

          <!-- 字段选择 -->
           <div class="dialog-mask" v-if="fieldSelectPanel" >
            <div class="dialog infobox"  >
                <div class="header">
                    <span class="title">选择字段</span>
                    <span class="close" @click="fieldSelectPanel=false">X</span>
                </div>
                <div class="content">
                  <div class="tag-list">
                          <div :key="field.name" v-for="field in sellFieldList" class="tag-item button" @click="selectField(field)">
                              {{field.title}}
                          </div>
                    </div>
                </div>
            </div>
        </div>

    </div>
</template>

<script>
import model from 'src/model'
import util from 'common/utils'
import { post } from 'common/api'
import ItemSelect from 'views/erp/item/itemselect.vue'
import myMixin from 'common/mixin/admin.js'
export default{
  mixins: [myMixin],
  data() {
    return {
      dataList: model[this.modelName].list, // 用户列表
      fieldList: model[this.modelName].fieldList, // 字段列表
      allStore: model.store.list, // 所有的仓库
      sellFieldList: model.sell.fieldList, // 订单所有字段
      checkUserList: [], // 可以审核的用户列表
      storeCheckRuleList: [], // 仓库的审核规则列表
      fieldRule: [], // 字段规则
      itemSelectPanel: false, // 商品选择页面
      fieldSelectPanel: false, // 选择字段
      selectRuleIndex: 0, // 当前选中的第几个规则
      curTabInfo: {}, // 当前的配制页
      tabList: []// 标签页
    }
  },
  watch: {
    allStore() {
      this.initTabList();
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
    ItemSelect
  },
  methods: {
    delRuleOrder(index, order_index) {
      this.storeCheckRuleList[index].orders.splice(order_index, 1);
    },
    delRuleField(index, field_index) {
      this.fieldRule[index].splice(field_index, 1);
    },
    addRuleOrder(index) {
      this.selectRuleIndex = index;
      this.itemSelectPanel = true;
    },
    addRuleField() {
      this.fieldSelectPanel = true;
    },
    selectField(fieldInfo) {
      this.fieldSelectPanel = false;
      const findindex = this.fieldRule.findIndex(haveitem => fieldInfo.name === haveitem.name)
      if (findindex < 0) {
        this.fieldRule.push({ name: fieldInfo.name, title: fieldInfo.title })
        this.$message({ message: fieldInfo.title + '增加成功', type: 'success', duration: 1000 })
      } else {
        this.$message({ message: '字段重复', type: 'error', duration: 1000 })
      }
    },
    haveOrder(itemid) {
      let orderList = [];
      this.storeCheckRuleList.forEach(item => {
        orderList = orderList.concat(item.orders);
      })
      const findindex = orderList.findIndex(haveitem => itemid === haveitem.itemid)
      if (findindex < 0) { return false; }
      return true;
    },
    selectitemOK() {
      this.itemSelectPanel = false;
      const orderList = this.storeCheckRuleList[this.selectRuleIndex].orders
      // console.log('select item ok', this.selectRuleIndex, orderList);
      const itemlist = this.$refs.itemDailog.dataList;
      this.itemSelect = false;
      itemlist.forEach(item => {
        if (item.checked) {
          if (haveOrder(item.id) === false) {
            orderList.push({ itemid: item.id, num: this.curTabInfo.info.sell_num_limit, name: item.name })
          } else {
            this.$message({ message: item.name + '重复订单组合已被过滤', type: 'error', duration: 1000 })
          }
        }
      })
    },

    // 更新分页
    initTabList() {
      this.tabList.splice(0);
      const baseTab = { name: '基本配置', check: true, type: 'base' };
      this.tabList.push(baseTab);// 初始化
      this.allStore.forEach(element => {
        if (element.is_del !== 1) {
          this.tabList.push({ name: element.name, check: false, type: 'store', info: element });
        }
      });
    },
    // 切换标签页
    changeTab(index) {
      console.log('change tab', index);
      for (let i = 0; i < this.tabList.length; i++) {
        if (i === index) {
          this.curTabInfo = this.tabList[i];
          this.curTabInfo.check = true;
          if (this.curTabInfo.type === 'store') {
            this.storeCheckRuleList.splice(0);
            this.fieldRule.splice(0);
            if (this.curTabInfo.info.check_rule) {
              const checkrule = JSON.parse(this.curTabInfo.info.check_rule);
              // 校正订单组合数量
              checkrule.rules.forEach(item => {
                item.orders.forEach(order => {
                  order.num = this.curTabInfo.info.sell_num_limit;
                })
              })
              util.copyList(checkrule.rules, this.storeCheckRuleList);
              util.copyList(checkrule.fields, this.fieldRule);
            }
          }
        } else {
          this.tabList[i].check = false;
        }
      }
    },
    // 编辑
    edit() {
      post(this.serverModelName, 'edit', { list: this.dataList })
        .then(() => {
          this.getData();
          this.$message({ message: '修改成功', type: 'success', duration: 1000 })
        })
        .catch(err => {
          console.log('err', err);
        })
    },

    editStoreCheckRule() {
      post('store', 'updateCheckRule', { check_rule: { rules: this.storeCheckRuleList, fields: this.fieldRule }, id: this.curTabInfo.info.id })
        .then(() => {
          this.getData();
          this.$message({ message: '修改成功', type: 'success', duration: 1000 })
        })
        .catch(err => {
          console.log('err', err);
        })
    },
    getData() {
      model[this.modelName].all();
      model.store.all();
    },
    // 增加一条规则
    addrule() {
      this.storeCheckRuleList.push({ orders: [], fields: [], num: this.curTabInfo.info.sell_num_limit })
    },
    // 删除一条规则
    delRule(index) {
      this.storeCheckRuleList.splice(index, 1);
    }
  },

  created() {
    this.initTabList();
    this.changeTab(0);
    post('user', 'allAuthUser', { moduleID: model.user.authDic.Sell_checkOk.id }).then(
    response => {
      util.copyList(response.list, this.checkUserList)
    }
    ).catch(error => {
      console.log('error', error);
    });
    // 初始化表格需要显示的字段
    util.filterField(this.fieldList, this.showfieldList, false, 'info', 'value');
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
