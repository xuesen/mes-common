/* eslint-disable @typescript-eslint/no-var-requires */
<template>
  <codemirror
    ref="my_cm"
    :value="code_computed"
    :options="{
      mode:'text/x-vue',//模式
      theme:'darcula', //主题
      indentUnit:2,
      smartIndent:true,
      autoRefresh:true,
      tabSize:4,
      readOnly:true, //只读
      showCursorWhenSelecting:true,
      lineNumbers:false, //是否显示行数
      firstLineNumber:1
    }"
    class="code"
  ></codemirror>
</template>

<style lang="scss" scoped>
</style>
<script>
import { codemirror } from 'vue-codemirror'
import 'codemirror/mode/vue/vue.js'
import 'codemirror/addon/display/autorefresh.js'
import 'codemirror/lib/codemirror.css'
import 'codemirror/theme/darcula.css'
import { Base64 } from 'js-base64'
export default {
  name: 'IiCodeView',
  components: {
    codemirror
  },
  props: {
    code: {
      type: [String],
      default: ''
    }
  },
  data () {
    return {
    }
  },
  computed: {
    code_computed () {
      return this.code ? Base64.decode(this.code.replace('data:;base64,', '')) : ''
    }
  },
  mounted () {
  },
  methods: {
  },
  watch: {
  }
}
</script>
