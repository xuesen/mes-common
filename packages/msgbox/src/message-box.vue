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
    <input style="width: 0px;height: 0px;border: none; padding: 0px; margin: 0px;" ref="definput"/>
    <div v-cloak v-html="tip"></div>
    <span slot="footer" class="dialog-footer">
      <ii-button v-if="type === 'confirm'" @click="handleAction('no')">{{vue_instance && vue_instance.$t('button.cancel')}}</ii-button>
      <ii-button @click="handleAction('yes')">{{vue_instance && vue_instance.$t('button.confirm')}}</ii-button>
    </span>
  </ii-dialog>
</template>
<style lang="scss" scoped>
</style>
<script>
import i18n from '../../i18n'
export default {
  name: 'IiMessageBox',
  props: {
    locale: String,
    type: {
      type: [String],
      default: 'error'
    }
  },
  data () {
    return {
      centerDialogVisible: false,
      promiseStatus: null,
      tip: '',
      vue_instance: null
    }
  },
  computed: {
    message: {
      get: function () {
        return i18n[this.locale || 'cn']
      }
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
    open (tip = '未输出错误信息!', vue_instance) {
      let _this = this
      this.vue_instance = vue_instance
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
