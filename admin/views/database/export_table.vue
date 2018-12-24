<template>
<div class="dialog-mask"  @click="close()">
    <div class="dialog" style="width:80%"  @click.stop>
      <div class="header">
            <span class="title">选择需要导出的字段</span>
            <span class="close" @click="close()">X</span>
        </div>

        <div class="content">
          <div class="select-box temple-select-box">
              <span class="form-label">选择模板</span>
              <el-select v-model="selectTempleIndex" size="mini" placeholder="选择模板">
                  <el-option
                          v-for="(item,index) in templeList"
                          :key="item.name"
                          :label="item.name"
                          :value="index">
                  </el-option>
              </el-select>
              <button v-show="selectTempleIndex>0" @click="delTemple()" class="button-common">删除选中模板</button>
          </div>
          <div class="export-box">

            <table cellspacing="0" cellpadding="0" border="0" class="table-header" style="width:100%;">
                <!-- 表头 -->
                <thead class="table-thead">
                <tr><th>可选字段 </th><th></th><th>导出字段 </th></tr>
                </thead>
                <!-- 表内容 -->
                <tbody>
                <tr  >
                  <td width="48%">
                    <div class="items-box">
                    <table  class="tablebox" cellspacing="0" cellpadding="0" border="0" style="width:100%;">
                      <tbody>
                        <tr :key="field.name" v-for="field in leftList" @click="add(field)">
                          <td>
                             {{field.title}}
                          </td>
                        </tr>
                      </tbody>
                    </table>
                    </div>
                  </td>
            <td width="4%">

            <div class="middle-box">
              =>
            </div>
              </td>

              <td width="48%" >
                <div class="items-box">
                 <table class="tablebox" cellspacing="0" cellpadding="0" border="0" style="width:100%;">
                      <tbody>
                        <tr :key="field.name" v-for="field in rightList" @click="add(field)">
                          <td>
                            {{field.title}}
                              <div class="btn-box-right">
                              <img src='~assets/img/del.png' @click.stop="del(field)">
                              <img src='~assets/img/up.png' @click.stop="up(field)">
                              <img src='~assets/img/down.png' @click.stop="down(field)">
                              </div>
                          </td>
                        </tr>
                      </tbody>
                    </table>
                </div>
              </td>
                </tr>
                </tbody>
            </table>
          </div>
            


           
        </div>
        <div class="footer">
          <button  @click="sure()" class="button-common">使用此配置导出</button>
          <button  @click="saveTemple()" class="button-common">保存模板</button>
        </div>
    </div>
 </div>
</template>

<script>
import model from 'src/model'
import util from 'common/utils'
import { all, post } from 'common/api'

export default{
  name: 'exportSelect',
  data() {
    return {
      templeList: model[this.modelName].list,
      // fieldList: model[this.modelName].fieldList,
      leftList: [],
      authDic: model.user.authDic,
      selectTempleIndex: 0,
      rightList: []


    }
  },
  watch: {
    selectTempleIndex() {
      console.log('select temp index');
      this.rightList.splice(0);
      this.leftList.splice(0);
      this.templeList[this.selectTempleIndex].value.forEach(item => {
        this.rightList.push(item);
      })
      this.filedList.forEach(element => {
        const info = this.rightList.find(x => x.name === element.name);
        if (!info) {
          this.leftList.push(element);
        }
      });
    }
  },
  props: {
    serverModelName: {// 服务器对应的control名
      type: String,
      default: 'Export'
    },
    modelName: { type: String, default: 'exportConf' },
    templeName: {
      type: String,
      required: true
    },
    filedList: { // 显示的表格字段
      type: Array,
      default() {
        return [];
      }
    }
  },
  methods: {
    del(item) {
      for (let index = 0; index < this.rightList.length; index++) {
        if (item.name === this.rightList[index].name) {
          this.rightList.splice(index, 1);
          this.leftList.push(item);
          return;
        }
      }
    },
    add(item) {
      // console.log('add item', item);
      for (let index = 0; index < this.leftList.length; index++) {
        if (item.name === this.leftList[index].name) {
          // console.log('left remove item', index);
          // console.log('right add item', item);
          this.leftList.splice(index, 1);
          this.rightList.push(item);
          return;
        }
      }
    },
    up(item) {
      // console.log('up item', item);
      for (let index = 0; index < this.rightList.length; index++) {
        if (item.name === this.rightList[index].name) {
          if (index > 0) {
            const frontitem = this.rightList[index - 1]
            console.log('frontitem', frontitem);
            this.rightList.splice(index - 1, 1, item);
            this.rightList.splice(index, 1, frontitem);
          }
          return;
        }
      }
    },
    down(item) {
      for (let index = 0; index < this.rightList.length; index++) {
        if (item.name === this.rightList[index].name) {
          if (index + 1 < this.rightList.length) {
            const afteritem = this.rightList[index + 1]
            this.rightList.splice(index + 1, 1, item);
            this.rightList.splice(index, 1, afteritem);
          }
          return;
        }
      }
    },
    close() {
      this.$emit('close');
    },
    sure() {
      const templist = this.getheadList(this.rightList)
      this.$emit('sure', templist);
    },

    getData() {
      all(this.serverModelName, null, null, null, { model: this.templeName }).then(
      data => {
        util.copyList(data.list, this.templeList, item => {
          item.value = JSON.parse(item.value);
        })
        this.templeList.splice(0, 0, { name: '新建', value: [], model: this.templeName });
        // 初始化新建
        this.selectTempleIndex = 0;
        this.rightList.splice(0);
        this.leftList.splice(0);
        this.filedList.forEach(element => {
          this.leftList.push(element);
        });
      }
      ).catch(error => {
        console.log('error', error);
      });
    },
    getheadList(headlist) {
      const templist = [];
      headlist.forEach(item => {
        templist.push({ name: item.name, title: item.title })
      })
      return templist
    },
    // 保存
    saveTemple() {
      if (this.selectTempleIndex === 0) {
        this.$prompt('请输入新模板的名字', '新建模板', {
          confirmButtonText: '确定',
          cancelButtonText: '取消'
        }).then(({ value }) => {
          if (value === '') {
            this.$message({ message: '模板的名字不能为空', type: 'error', duration: 1000 })
            return;
          }
          console.log('rightlist', this.rightList)
          const templist = this.getheadList(this.rightList)
          post(this.serverModelName, 'add', { name: value, value: JSON.stringify(templist), model: this.templeName })
          .then(() => {
            this.$message({ message: '新增成功', type: 'success', duration: 1000 })
            this.getData();
          })
          .catch(error => {
            console.log('error', error);
          });
        })
      } else {
        const id = this.templeList[this.selectTempleIndex].id;
        const templist = this.getheadList(this.rightList)
        post(this.serverModelName, 'edit', { id, value: JSON.stringify(templist) }).then(
        () => {
          this.$message({ message: '修改成功', type: 'success', duration: 1000 })
          this.getData();
        }
        ).catch(error => {
          console.log('error', error);
        });
      }
    },
    // 删除
    delTemple() {
      const id = this.templeList[this.selectTempleIndex].id;
      post(this.serverModelName, 'del', { id }).then(
        () => {
          this.$message({ message: '修改成功', type: 'success', duration: 1000 })
          this.getData();
        }
        ).catch(error => {
          console.log('error', error);
        });
    }
  },
  created() {
    this.getData();
  }

}
</script>

<style scoped>

.arrow-box{
  width:30px;
  height:30px;
}

.arrow-right{
  width:0;
  height: 0;
  border-top: 30px solid transparent; 
  border-bottom: 30px solid transparent; 
  border-left: 30px solid  #c0c4cc; 
  border-right:30px  solid  transparent; 
  font-size: 0px;
}




.items-box{
      border: 1px solid gray;
  width: 100%;
   height: 300px;
  overflow: scroll;
  line-height: 30px;
  display: inline-block;
}
.items-box .tablebox td{
  padding: 5px;
}
.row:hover{
  background-color: rgb(245,245,245);
  cursor: pointer;
}
.temple-select-box{
      background-color: #dcdfe6;
    margin-bottom: 10px;
    padding: 20px;
}

.export-box th{
  line-height: 30px;
  border-bottom: 1px solid #ebeef5;
}

.btn-box-right{
  
      display: inline-block;
    position: absolute;
    right: 40px;
}

.middle-box{
  font-size: 30px;

}
</style>
