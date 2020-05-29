<template>
  <div class="app" id="app">
  </div>
</template>

<script>
export default {
  name: 'App',
  data () {
    return {
      islogined: undefined
    }
  },
  mounted () {
    this.$ii_message('error', '错误信息')
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
