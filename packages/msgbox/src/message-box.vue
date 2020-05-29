<template>
  <ii-dialog
    top="0vh"
    class="ii-message-box"
    :title="gettitle()"
    :show-close="false"
    :modal = "false"
    :append-to-body="true"
    :visible.sync="centerDialogVisible"
    :close-on-click-modal = "false"
    :close-on-press-escape = "false"
    :custom-class ="getclass()"
    center>
    <input style="width: 0px;height: 0px;border: none;" ref="definput"/>
    <div v-cloak v-html="tip"></div>
    <span slot="footer" class="dialog-footer">
      <ii-button v-if="type === 'confirm'" @click="handleAction('no')">取 消</ii-button>
      <ii-button @click="handleAction('yes')">确 定</ii-button>
    </span>
  </ii-dialog>
</template>

<style lang="scss" scoped>
</style>
<script>
export default {
  name: 'IiMessageBox',
  props: {
    type: {
      type: [String],
      default: 'error'
    }
  },
  data () {
    return {
      centerDialogVisible: false,
      promiseStatus: null,
      tip: ''
    }
  },
  methods: {
    handleAction (action) {
      this.centerDialogVisible = false
      if (action === 'yes') {
        this.promiseStatus && this.promiseStatus.resolve()
      } else {
        this.promiseStatus && this.promiseStatus.reject()
      }
    },
    getclass () {
      if (this.type === 'confirm') return 'confirm'
      if (this.type === 'warn') return 'warn'
      return 'error'
    },
    gettitle () {
      if (this.type === 'confirm') return 'Confirm!'
      if (this.type === 'warn') return 'Reminding!'
      return 'Error!'
    },
    open (tip = '未输出错误信息!') {
      let _this = this
      this.tip = tip
      this.centerDialogVisible = true
      if (this.type !== 'confirm') {
        this.$nextTick(o => {
          this.$refs.definput.focus()
        })
      }
      return new Promise(function (resolve, reject) {
        _this.promiseStatus = {resolve, reject}
      })
    }
  },
  watch: {
  }
}
</script>
