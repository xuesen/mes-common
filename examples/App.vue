<template>
  <div class="app" id="app">
    <router-view v-if="islogined"/>
    <span v-else>no authority</span>
  </div>
</template>

<script>
export default {
  name: 'App',
  data () {
    return {
      islogined: true
    }
  }
}
</script>

<style rel="stylesheet/scss" lang="scss">
.app {
  font-family: Source Han Sans CN,Helvetica Neue,Helvetica,PingFang SC,Hiragino Sans GB,Microsoft YaHei,Arial,"sans-serif";
  box-sizing: border-box;
  height: 100%;
}
</style>
