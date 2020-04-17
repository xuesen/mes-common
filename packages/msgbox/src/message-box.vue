<template>
<transition name="fade">
  <el-dialog
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
    <el-button v-if="type === 'confirm'" @click="handleAction('no')">取 消</el-button>
    <el-button @click="handleAction('yes')">确 定</el-button>
  </span>
</el-dialog>
</transition>
</template>

<style lang="scss" scoped>
.fade{opacity: 0;-webkit-transition: opacity .15s linear;-o-transition: opacity .15s linear;transition: opacity .15s linear;}
.fade.in{opacity: 1;}
/deep/ .el-dialog {
  ::-webkit-scrollbar { width: 0 !important }
  width:800px;
  box-shadow:0px 8px 12px rgba(0,0,0,0.3);
  opacity:1;
  border: none;
  .el-dialog__header {
    background: transparent;
    padding-top: 90px;
    border: none;
    .el-dialog__title{
      background: transparent;
      font-size: 45px;
      font-weight: 700;
      line-height: 56px;
      color: #fff;
      opacity: 1;
    }
  }
  .el-dialog__body {
    background: transparent;
    height: 160px;
    text-align: center;
    overflow-y:auto;
    word-wrap: break-word;
    word-break: break-all;
    font-size: 16px;
    font-weight: 500;
    line-height: 29px;
    color: #fff;
    opacity: 1;
  }
  .el-button span {
    color: #fff;
  }
  .el-dialog__footer .dialog-footer {
    display: inline-block;
  }
  .el-dialog__footer .dialog-footer .el-button {
    width: 140px;
    height: 40px;
    background: transparent;
    -webkit-box-shadow: 0 8px 12px rgba(0,0,0,.3);
    box-shadow: 0 8px 12px rgba(0,0,0,.3);
    border: 2px solid #fff;
    border-radius: 6px;
    font-size: 18px;
    font-weight: 500;
    color: #fff;
    line-height: 0.05;
  }
  &.error {
    background:rgba(242,76,23,1);
    &.fade-enter, &.fade-leave-active {
      opacity:0;
      transform:translate(-50%, -100%)
    }
  }
  &.warn {
    background:#FCCB28;
    &.fade-enter, &.fade-leave-active {
      opacity:0;
      transform:translate(-50%, -100%)
    }
  }
  &.confirm {
    background:rgba(27,119,225,1);
    &.fade-enter, &.fade-leave-active {
      opacity:0;
    }
  }
}
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
