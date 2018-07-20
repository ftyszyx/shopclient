<template>
  <div style="width:100%;height:100%;">
     <navigation>
    <router-view></router-view>
     </navigation>
  </div>
</template>

<script>
import models from 'src/model'
export default {
  name: 'app',
  data() {
    return {

    }
  },
  created() {
    models.app.getAll()
  }
}
</script>


<style>
/*全局样式*/
html {
  box-sizing: border-box;
}

body{
  margin:0;
  /* background-color: rgb(204, 232, 207); */
  font-family: Avenir,Helvetica,Arial, "Microsoft YaHei", 黑体, 宋体, sans-serif,sans-serif;
}


h1,h2,h3,h4{
  margin:0;
}


.detailinfo img{
    max-width: 100%;
    height: auto;
}

</style>
