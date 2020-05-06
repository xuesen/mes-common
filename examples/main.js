// The Vue build version to load with the `import` command
// (runtime-only or standalone) has been set in webpack.base.conf with an alias.
import Vue from 'vue'
import App from './App.vue'
import './registerServiceWorker'
import router from './router'
import VueI18n from 'vue-i18n'
import messages from './i18n/index.js'
import axios from 'axios'
import IiElement from '../packages'
import _ from 'lodash'
import '../packages/styles/index.scss'
Vue.use(VueI18n)
const i18n = new VueI18n({
  locale: process.env.VUE_APP_LANGUAGE,
  messages: messages
})
Vue.config.productionTip = false

const axiosInstDefault = axios.create({})
// http响应拦截器
axiosInstDefault.interceptors.response.use(data => {
  return data
}, (error) => {
  let errmsg = error.message ? error.message : error
  if (error.response && error.response.data) {
    if (_.isObject(error.response.data)) errmsg = error.response.data.message
    if (!_.isObject(error.response.data)) errmsg = error.response.data
  }
  this.$msgbox.open(errmsg)
  return Promise.reject(errmsg)
})

const maintain_service_stub = async (entity, path, type, params) => {
  const result = await axiosInstDefault[type]('./datacenterservice/' + entity + '/' + path,
    type.toUpperCase() === 'GET' ? { params: params } : params)
  return result
}
const data_import_service_stub = async (entity, path, type, params) => {
  const result = await axiosInstDefault[type]('./dataimportservice/' + entity + '/' + path,
    type.toUpperCase() === 'GET' ? { params: params } : params)
  return result
}

Object.defineProperty(Vue.prototype, '$maintain_service_agent', {
  get () {
    return maintain_service_stub
  }
})
Object.defineProperty(Vue.prototype, '$data_import_service_agent', {
  get () {
    return data_import_service_stub
  }
})

Vue.use(IiElement, { maintain_service_agent: maintain_service_stub })

new Vue({
  router,
  i18n,
  render: h => h(App)
}).$mount('#app')
