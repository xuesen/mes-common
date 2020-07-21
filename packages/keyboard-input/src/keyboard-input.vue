<template>
<div>
  <ii-button class="keyboard_input_button"
    :style="{'background-image': keyboard_img_url}" @click="keyboard_input"></ii-button>
  <ii-dialog title='请输入' :visible="visible" width="30%"
            :modal="false" top="5%" :show-close="false" :close-on-click-modal="false">
        <div class="content-inner">
          <ii-input
            ref="keyboardInput"
            :autofocus="true"
            v-model="input">
          </ii-input>
        </div>
    <div slot="footer" class="dialog-footer" style="display: block;">
      <ii-button type="text" @click="handle_cancel">{{$t("button.cancel")}}</ii-button>
      <ii-button type="primary" @click="handle_ok">{{$t("button.ok")}}</ii-button>
    </div>
  </ii-dialog>
</div>
</template>
<style lang="scss" scoped>
</style>
<script>
export default {
  name: 'IiKeyboardInput',
  data () {
    return {
      input: '',
      visible: false,
      promiseStatus: null,
      keyboard_img_url: 'url(' + require('../img/keyboard.png') + ')'
    }
  },
  computed: {
  },
  created () {
  },
  methods: {
    keyboard_input () {
      this.visible = true
      this.$nextTick(() => {
        this.$refs.keyboardInput.focus()
      })
    },
    handle_cancel () {
      document.activeElement.blur()
      this.visible = false
      this.$emit('cancel', this.input)
      this.input = ''
    },
    handle_ok () {
      document.activeElement.blur()
      this.visible = false
      this.$emit('inputed', this.input)
      this.input = ''
    }
  },
  mounted () {
  }
}
</script>
