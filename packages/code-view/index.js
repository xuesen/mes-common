import CodeView from './src/code-view.vue'

/* istanbul ignore next */
CodeView.install = function (Vue) {
  Vue.component(CodeView.name, CodeView)
}

export default CodeView
