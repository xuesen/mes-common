// The Vue build version to load with the `import` command
// (runtime-only or standalone) has been set in webpack.base.conf with an alias.
import Vue from 'vue'
import App from './App.vue'
import IiElement from '../packages/index.js'
import VueI18n from 'vue-i18n'
Vue.use(IiElement, {locale: process.env.VUE_APP_LANGUAGE})
Vue.use(VueI18n)
const i18n = new VueI18n({
  locale: process.env.VUE_APP_LANGUAGE,
  messages: IiElement.MessagesBase
})

new Vue({
  i18n,
  render: h => h(App)
}).$mount('#app')
