<template>
    <div flex="dir:top main:left cross:left" style="height:100%;">
        <div flex-box="1" class="content-box-bottom">
            <router-view ></router-view>
        </div>
        <!-- <ul class="bottombar" flex="dir:left main:justify cross:center">
          <li @click="goto('/home/index')" flex="dir:top main:left cross:center">
              <i :class="{redicon:selectpath==='/home/index'}" class="zyx-search iconfont"></i>
              <span>查询</span>
          </li>
      </ul> -->
    </div>

</template>

<script>
import mymix from 'src/mixin'
import config from 'src/config.js'

// 框架
export default{
  name: 'homelayout',
  mixins: [mymix],
  data() {
    return {
      cartnum: 0,
      selectpath: '',
      config
    }
  },
  watch: {
    '$route'() {
      this.initdata();
    },
    selectpath() {
      this.$router.push({ path: this.selectpath });
    }
  },

  methods: {
    goto(path) {
      this.selectpath = path;
      this.$router.push(path)
    },
    initdata() {
      console.log('route', this.$route);
      const rootpath = this.$route.matched[0].path
      if (rootpath === '/home') {
        this.selectpath = this.$route.matched[1].path;
      }
    }
  },
  created() {
    console.log('homelayput create')
    this.initdata();
  }


}
</script>

<style scoped>
.redicon{
  color: red;
}
.bottombar{
    right: 0;
    bottom: 0;
    left: 0;
    position: fixed;
    z-index: 1;
    height: 55px;
    background-color: #eaeaea;
    color: #26a2ff;
}

.bottombar li{
  width:25%;
  color: #333;
  font-size: 12px;
  padding: 2px 0 0;


}

.bottombar li span{
  padding: 4px 0;
    line-height: 15px;
}

.bottombar li img{
  width:25px;

}
</style>


