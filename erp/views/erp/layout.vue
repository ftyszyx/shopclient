<template>
<div>
  <!-- 顶部菜单 -->
<div class="top">
  <div class="left-top">
    <span id="title">ERP系统</span>
  </div>
  
  <ul class="top-right">
    <template  v-for="item in showMenuList">
       <router-link :key="item.name"  :to="item.path">
        <li :class="{active:item.name===active_menu_name}" >
          {{item.name}}
        </li>
      </router-link>
    </template>
   
    <!-- 右边下拉菜单 -->
    <div class="right-menu">
      <img src='~assets/img/admin.png'>
      <ul>
        <router-link to="/admin"><li><img src='~assets/img/home_pc.png'><span> 回到首页</span></li></router-link>
        <li v-on:click="changePass"><img src='~assets/img/pass.png'><span>修改密码</span></li>
        <li v-on:click="casheUpdate"><img src='~assets/img/fresh.png'><span>刷新缓存</span></li>
        <li v-on:click="logout"><img src='~assets/img/logout.png'><span>安全退出</span></li>
      </ul>
    </div>
  </ul>
  
</div>
<!-- 左边菜单 -->
<div class="view">
  <div class="left">
      <div class="info">
        <div class="img">
          <img src="~assets/img/head_portrait_default.png">
        </div>
        <div class="text">
          <div>欢迎你:{{account}}</div>
          <div>角色:{{groupname}}</div>
        </div>
      </div>
      <div class="left-menu">
        <ul>
          <template v-for="item in showSubMenu" >
            <router-link :key="item.name" :to ='active_menu_path+"/"+item.path'>
            <li  :class="{active:item.name==active_submenu_name}">
              {{item.name}}
              </li>
            </router-link>
          </template>
        </ul>
      </div>
  </div>
  <!-- 内容 -->
  <div class="content">
    <router-view ></router-view>
    <div @click="app.loading=0" class="loading-mask" v-show="app.loading>0" style="background-color: rgba(0, 0, 0, 0.2);">
      <div class="loading-spinner">
        <i class="el-icon-loading"></i>
        <p class="loading-text">拼命加载中</p>
        </div>
    </div>
  </div>

  <!-- 表格调整列宽 -->
  <!-- <div class="el-table__column-resize-proxy" ref="resizeProxy" v-show="resizeProxyVisible"></div> -->
  <div  v-show="config.test" class="testdiv">
       当前为测试环境
  </div>
</div>
</div>
</template>

<script>
import models from 'src/model'
import { adminRoute } from 'src/router'
import { post } from 'common/api'
import config from 'src/config.js'
import util from 'common/utils'
// 框架
export default{
  data() {
    return {
      account: models.user.account, // 账号名
      userGroup: models.user.userGroup, // 用户组
      groupname: '',
      fobidModuleList: models.user.fobidModuleList, // 无权限列表
      showMenuList: [], // 显示的主菜单
      showSubMenu: [],
      active_menu_name: '',
      active_menu_path: '',
      active_submenu_name: '',
      app: models.app,
      config,
      grouplist: models.userGroup.list
    }
  },
  watch: {
    loading() {
      console.log('loading change', this.loading);
    },
    // 得到主菜单列表
    fobidModuleList() {
      this.updateMainMenu();
    },
    '$route'() {
      this.initdata();
    },
    grouplist() {
      console.log('upadte group', models.userGroup.list);
      this.groupname = util.getGroup(this.userGroup);
    }
  },

  methods: {
    // 是否是无权限的项目
    updateMainMenu() {
      // console.log('updateMainMenu');
      this.showMenuList.splice(0);
      adminRoute.forEach(route_item => {
        let auth = true;
        if (route_item.meta.auth) {
          auth = models.user.authDic[route_item.meta.auth].auth
        }
        if (auth) {
          this.showMenuList.push(route_item);
        }
      });
      // console.log('updateMainMenu', this.showMenuList);
    },
    casheUpdate() {
      post('config', 'updateCache', { list: this.dataList })
        .then(() => {
          // this.getData();
          this.$message({ message: '成功', type: 'success', duration: 1000 })
        })
        .catch(err => {
          console.log('err', err);
        })
    },
    updateSubMenu() {
      this.showSubMenu.splice(0);
      // console.log('updateSubmenu', this.active_menu_name);
      const selectitem = adminRoute.find(route_item => {
        if (route_item.name === this.active_menu_name) {
          return true;
        }
        return false;
      });
      // console.log('updateSubmenu', selectitem);
      selectitem.children.forEach(subitem => {
        let auth_right = true;
        if (subitem.meta.auth) {
          auth_right = models.user.authDic[subitem.meta.auth].auth;
        }
        // console.log('subitem', subitem, auth_right);
        if (auth_right) {
          this.showSubMenu.push(subitem);
        }
      })
      // console.log('showSubMenu', this.showSubMenu);
    },
    logout() {
      post('login', 'logout')
      .then(() => {
        // console.log('logout ok')
        models.user.account = undefined;
        this.$router.push({ path: '/login' });
      })
        .catch(error => {
          console.log('logout ok', error);
        })
    },
    // 修改密码
    changePass() {
      this.$msgbox({
        title: '提示',
        message: '请输入新密码',
        showCancelButton: true,
        showInput: true,
        callback: (action, inst) => {
          console.log('action', action);
          console.log('inst', inst, inst.inputValue);

          if (action === 'confirm') {
              // 确定
            if ((inst.inputValue.trim() || '') === '') {
              this.$message({
                message: '密码不能为空',
                type: 'error',
                duration: 1000
              })
            } else {
              post('user', 'changePassword', { newpass: inst.inputValue.trim() })
                .then(() => {
                  this.$message({
                    message: '密码修改成功',
                    type: 'success',
                    duration: 1000
                  })
                })
                .catch(error => {
                  console.log('error', error);
                })
            }
          }
        }
      })
    },

    initdata() {
      console.log('route', this.$route);
      this.active_menu_name = this.$route.matched[0].name;
      this.active_submenu_name = this.$route.matched[1].name;
      this.active_menu_path = this.$route.matched[0].path;
      this.updateMainMenu();
      this.updateSubMenu();
    }
  },
  created() {
    models.userGroup.all();
    models.module.all();
    models.itemType.all();
    models.store.all();
    models.shop.all();
    models.shopType.all();
    this.initdata();
  }


}
</script>

<style scoped>


.top{
  width: 100%;
  height: 50px;
  position: relative;
}

.left-top{
  position: fixed;
  width: 180px;
  background: #393939;
  height: 50px;
   text-align: center;
   line-height: 50px;
   font-size: 0px;
}

.left-top #title{
  color: azure;
  font-size: 20px;
}

.top-right{
  position: absolute;
  left: 180px;
  right: 0px;
  background: #0072D2;
  height: 50px;
  line-height: 50px;
  font-size: 0px;
  z-index: 1;
  /* overflow:hidden; */
}

.top-right li{
  display: inline-block;
  width:100px;
  height: 50px;
  text-align: center;
  line-height: 50px;
}

.top-right li:hover{
  background: #1C8FEF;
}

.top-right li{
   color: #ffffff;
   font-size: 14px;
}

.top-right li.active{
  background: #1C8FEF;
}

.right-menu{
  float: right;
  height: 50px;
  margin-right: 20px;
  position: relative;
}

.right-menu img{
  vertical-align: middle;
}

.right-menu:hover ul{
  display: block;
}

.right-menu ul{
  display: none;
}

.right-menu ul{
  position: absolute;
  background: #ffffff;
  width:220px;
  right: -20px;

  box-shadow: 0px 0px 10px #999;
}
.right-menu ul li{
  display: block;
  padding: 10px;
  line-height: 20px;
  width:auto;
  border-bottom: 1px solid #e1e1e1;
}

.right-menu ul li img{
  vertical-align: middle;
}

.right-menu ul li span{
  font-size: 14px;
  color: #0072D2;
  margin-left: 10px;
}


.view::after{
  content: "";
  display: block;
  clear: both;
  position: relative;
}

.view .left{
  height: 100%;
  border-right: 1px solid  #e5e5e5;
  width:180px;
  
  background-color: #ffffff;
  float: left;
  position: fixed;
}

.view .left .info{
  display: inline-block;
  font-size: 0px;
  width: 100%;
  border-bottom: 1px solid #e5e5e5;
  height: 80px;
}

.view .left .info .img{
  display: inline-block;
  padding: 10px;
}

.view .left .info .text{
  display: inline-block;
  font-size: 13px;
  line-height: 30px;
  vertical-align: top;
  padding: 10px 0px;
  overflow: hidden;
  width:95px;
}

.view .content{
   /* float: left; */
   /* max-width: 80%; */
   margin-left: 180px;
  background-color: rgb(246, 246, 246);
  position: relative;
  /* float: right; */
}

.view .left .left-menu ul{
  margin-top: 10px;
}
.view .left .left-menu ul li:hover{
  background: #e4f3ff;
  color: #0072d2;
  border-left:5px solid #0072d2;
}

.view .left .left-menu ul li.active{
  background: #e4f3ff;
  color: #0072d2;
  border-left:5px solid #0072d2;
}

.view .left .left-menu ul li{
  height: 40px;
  line-height:40px;
  border-left: 5px solid transparent;
  cursor: pointer;
  overflow: hidden;
  color: #333333;
  text-indent: 30px;
  font-size: 14px;
  border-bottom: 1px solid #e5e5e5;
}

.testdiv{
  position: fixed;
  bottom: 20px;
  font-size: 30px;
 left: 50%;
 
  color: red;
}
</style>

