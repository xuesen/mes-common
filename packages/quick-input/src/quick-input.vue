<template>
  <div class="ii-quick-input" :isMobile="isMobile">
    <ii-input
      ref="quick_input"
      :placeholder="currentWaitInputPlaceholder"
      size="middle"
      :disabled="disabled"
      :readonly="isMobile && readonly"
      v-model.trim="input_show"
      @focus="input_focus"
      @blur="input_blur"
      @keydown.native="push_input">
    </ii-input>
    <div class="quick-input-cover" v-if="isMobile" @mousedown="corver_click()"></div>
    <img v-show="isMobile && waitingScanning" :src="scanImgUrl" style="position: absolute; left: 12px; top: 16px; font-size: 72px; padding: 0px 10px 0px 5px;"/>
    <ii-keyboard-input v-if="isMobile" @inputed="after_keyboard_input" @cancel="cancel_keyboard_input"></ii-keyboard-input>
  </div>
</template>
<style lang="scss" scoped>
</style>
<script>
export default {
  name: 'IiQuickInput',
  props: {
    inputVal: String,
    disabled: {
      type: Boolean,
      default: false
    },
    isMobile: {
      type: Boolean,
      default: false
    },
    quickInput: {
      type: Boolean,
      default: true
    },
    clearShow: {
      type: Boolean,
      default: true
    },
    currentWaitInputPlaceholder: String
  },
  data () {
    return {
      input_show: this.inputVal || '',
      input_array: [],
      waitInputTimer: null,
      waitingScanning: false,
      scanImgUrl: require('./img/scan.gif')
    }
  },
  computed: {
  },
  created () {
  },
  methods: {
    focus () {
      this.$nextTick(() => {
        this.$refs.quick_input.focus()
      })
    },
    input_focus () {
      this.waitingScanning = true
      if (this.isMobile) {
        this.$el.querySelector('.quick-input-cover').style.display = ''
        setTimeout(() => {
          this.readonly = false
        }, 100)
      }
    },
    input_blur () {
      this.waitingScanning = false
      if (this.isMobile) {
        this.$el.querySelector('.quick-input-cover').style.display = 'none'
        this.readonly = true
      }
    },
    corver_click () {
      let _this = this
      this.readonly = true
      setTimeout(function () {
        _this.$nextTick(() => {
          _this.$refs.scaninput.focus()
          setTimeout(function () {
            _this.readonly = false
          }, 100)
        })
      }, 100)
      window.event.stopPropagation()
      window.event.preventDefault()
    },
    push_input (event) {
      if (event.keyCode !== 13 && event.keyCode !== 9) {
        return
      }
      event.stopPropagation()
      event.preventDefault()
      if (!this.quickInput) {
        this.$emit('nextData', this.input_show)
        if (this.clearShow) {
          this.input_show = ''
        }
        return
      }
      if (!this.input_show) {
        return
      }
      this.input_array.push(this.input_show)
      this.input_show = ''
    },
    clear_input () {
      this.input_show = ''
      this.input_array = []
      this.get_input_data()
    },
    get_input_data () {
      if (this.input_array.length === 0) {
        let self = this
        window.clearTimeout(this.waitInputTimer)
        this.waitInputTimer = window.setTimeout(function () { self.get_input_data() }, 300)
      } else {
        let input = this.input_array[0]
        this.input_array.splice(0, 1)
        this.$emit('nextData', input)
      }
    },
    cancel_keyboard_input () {
      this.focus()
      this.waitingScanning = true
    },
    after_keyboard_input (value) {
      this.input_show = value
      this.push_input()
      if (this.quickInput) {
        this.focus()
        this.waitingScanning = true
      }
    }
  },
  mounted () {
    this.get_input_data()
  },
  watch: {
    'inputVal' () {
      this.input_show = this.inputVal
    },
    'input_show' () {
      this.$emit('update:inputVal', this.input_show)
    }
  }
}
</script>
