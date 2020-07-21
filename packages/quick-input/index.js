import QuickInput from './src/quick-input.vue'

/* istanbul ignore next */
QuickInput.install = function (Vue) {
  Vue.component(QuickInput.name, QuickInput)
}

export default QuickInput
