<template>
  <div id="app">
    <router-view></router-view>
  </div>
</template>

<script>
export default {
  name: 'app',
  data() {
    return {

    }
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
  background-color: rgb(204, 232, 207);
  font-family: Arial, "Microsoft YaHei", 黑体, 宋体, sans-serif;
}


h1,h2,h3,h4{
  margin:0;
}


.svg-icon {
  width: 1em;
  height: 1em;
  vertical-align: -0.15em;
  fill: currentColor;
  overflow: hidden;
}


</style>
