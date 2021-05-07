// The Vue build version to load with the `import` command
// (runtime-only or standalone) has been set in webpack.base.conf with an alias.
import Vue from 'vue'
import App from './App.vue'
import IiElement from '../packages/index.js'
import VueI18n from 'vue-i18n'
import axios from 'axios'
import _ from 'lodash'
Vue.use(IiElement, {locale: process.env.VUE_APP_LANGUAGE})
Vue.use(VueI18n)
const i18n = new VueI18n({
  locale: process.env.VUE_APP_LANGUAGE,
  messages: IiElement.MessagesBase
})

let vue_instance
const axiosInstDefault = axios.create()
// http响应拦截器
// axiosInstDefault.interceptors.response.use(data => {
//   if (data.data.result.toLowerCase() !== 'ok') {
//     vue_instance.$ii_message('error', data.data.errMsg)
//     return Promise.reject(data.data.errMsg)
//   } else {
//     return data.data   
//   }
//   // return data.data
// }, (error) => {
//   let errmsg = error.message ? error.message : error
//   if (error.response && error.response.data) {
//     if (_.isObject(error.response.data)) errmsg = error.response.data.message
//     if (!_.isObject(error.response.data)) errmsg = error.response.data
//   }
//   vue_instance.$ii_message('error', errmsg)
//   return Promise.reject(errmsg)
// })

Object.defineProperty(Vue.prototype, '$axios', {
  get () {
    return async (api_path, type, params) => {
      const result = await axiosInstDefault[type](api_path,
        type.toUpperCase() === 'GET' ? { params: params } : params)
      return result
    }
  }
})

vue_instance = new Vue({
  i18n,
  render: h => h(App)
}).$mount('#app')
