// The Vue build version to load with the `import` command
// (runtime-only or standalone) has been set in webpack.base.conf with an alias.
import Vue from 'vue'
import App from './App.vue'
import IiElement from '../packages/index.js'
Vue.use(IiElement)
new Vue({
  render: h => h(App)
}).$mount('#app')
