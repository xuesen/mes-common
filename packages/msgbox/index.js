import MessageBox from './src/message-box.vue'
import { ErrormsgConstructor } from 'element-ui'
MessageBox.install = function (Vue) {
  let seed = 0
  Object.defineProperty(Vue.prototype, '$iimessage', {
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
        Vue.erinstance.vm = Vue.erinstance.$mount()
        document.body.appendChild(Vue.erinstance.vm.$el)
        Vue.erinstance.vm.$el.style.zIndex = 3000
        return Vue.erinstance.open(tip)
      }
      return errormsg
    }
  })
}

export default MessageBox
