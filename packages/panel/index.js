import Panel from './src/panel.vue'

/* istanbul ignore next */
Panel.install = function (Vue) {
  Vue.component(Panel.name, Panel)
}

export default Panel
