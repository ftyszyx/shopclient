<template>
  <div style="background-color: rgb(245,245,245);height: 100vh;">
     <div class="headerbox">
         <mt-header title="错误">
            <router-link to="/home" slot="left">
              <div icon="back">返回</div>
            </router-link>
          </mt-header>
     </div>
    <div style="width: 150px;margin: 0 auto;">      
      <img src="~assets/img/err.png"><img>
    </div>
  </div>
</template>

<script>
  export default {
  }
</script>

<style scoped>


</style>
