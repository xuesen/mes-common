import Vue from 'vue'
import Errormsg from './src/message-box.vue'
const ErrormsgConstructor = Vue.extend(Errormsg)
const install = function (Vue, {locale}) {
  let seed = 0
  Object.defineProperty(Vue.prototype, '$ii_message', {
    get () {
      const id = 'message_' + seed++
      const errormsg = (type, tip) => {
        if (!Vue.erinstance) {
          Vue.erinstance = new ErrormsgConstructor({})
          Vue.erinstance.id = id
        }
        // instance = new ErrormsgConstructor({})
        // instance.id = id
        Vue.erinstance.type = type
        Vue.erinstance.locale = locale
        Vue.erinstance.vm = Vue.erinstance.$mount()
        document.body.appendChild(Vue.erinstance.vm.$el)
        Vue.erinstance.vm.$el.style.zIndex = 3000
        return Vue.erinstance.open(tip, this)
      }
      return errormsg
    }
  })
}

export default { install }
