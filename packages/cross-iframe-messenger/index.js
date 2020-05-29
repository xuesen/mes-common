import Messenger from './src/messenger.js'

/* istanbul ignore next */
export default {
  install: function (Vue) {
    let messenger = new Messenger()
    messenger.init()
    messenger.listen()
    Object.defineProperty(Vue.prototype, '$ii_messenger', {
      get () {
        return messenger
      }
    })
  }
}
