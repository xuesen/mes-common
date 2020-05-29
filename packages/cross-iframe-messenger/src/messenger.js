let CD = function () {
  this.DEFAULT_NAME_MASTER = 'MASTER'
  this.DEFAULT_NAME_SLAVE = 'SLAVE'
  this.component = {}
  this.components = {}
  this.interfaces = {}
  /**
         * 初使化
         */
  this.init = function () {
    this.component = {
      type: this.isMaster() ? this.DEFAULT_NAME_MASTER : this.DEFAULT_NAME_SLAVE,
      name: this.isMaster() ? this.DEFAULT_NAME_MASTER : window.name,
      url: window.location.host,
      port: window.location.port || 80
    }
    if (!this.component.name) {
      throw new Error('Error iframe must has a name')
    }
    // this.components[this.component.name] = this.component;
    this.register(this.component)
    this.extends('register', function (data) {
      this.components[data.component.name] = data.component
    })
  }
  /**
     * 是否是Master
     * 如果窗口为顶层窗口则认为是Master
     */
  this.isMaster = function () {
    return window === window.top
  }
  /**
         * Salve将自身组件注册到MASTER端
         */
  this.register = function () {
    this.send(this.DEFAULT_NAME_MASTER, 'register', {info: "i'm coming register!", component: this.component})
  }
  /**
         * 扩展接口方法
         * @param {String} name接口名称
         * @param {Function} fun 接口方法
         */
  this.extends = function (name, fun) {
    this.interfaces[name] = fun
  }
  /**
         * 打印跨域日志的方法
         *
         * @param {Object} mesg 要打印跨域消息的内容
         */
  this.log = function (mesg) {
    if (!window.console || typeof window.console === 'undefined') { return }
    window.console.log('[' + new Date() + '][' + this.version + '][' + this.component.type + '][' + this.component.name + '][' + mesg.type + '][' + window.JSON.stringify(mesg) + ']')
  }
  /**
         * 发送信息到其它组件 - html5原生态方法包装
         *
         * @param {Window} targetWindow目标系统window对象
         * @param {String} targetUrl目标系统 URL
         * @param {Object} mesg 对象
         */
  this.postMessage = function (targetWindow, targetUrl, mesg) {
    this.log(mesg)
    targetWindow.postMessage(mesg, targetUrl)
  }
  /**
         * 发送消息方法
         * @param {String} componentName组件名称
         * @param {String} method接口名称
         * @param {Object} data数据
         * @param {Function} callback回调
         */
  this.send = function (componentName, method, data, callback, type) {
    if (this.isMaster() && componentName === this.DEFAULT_NAME_MASTER) { return }
    let source = this.component.name
    let mesg = {
      chanel: 'iframe_messenger',
      source: source,
      target: componentName,
      method: method,
      data: data,
      type: type || 'REQUEST'
    }
    if (callback) { this.extends(method + 'Callback', callback) }
    let w = this.isMaster() ? window.document[componentName] : window.top
    // let host = this.isMaster() ? this.components[componentName].host : '*'
    // console.info(host);
    this.postMessage(w, '*', mesg)
  }
  /**
         * 处理接收到的其它系统的请求跨域请求
         *
         * @param {Event} event事件对象
         */
  this.process = function (event) {
    let mesg = event.data
    if (mesg.chanel !== 'iframe_messenger') return
    // console.log(event);
    this.log(mesg)
    let interfaceMethd = this.interfaces[mesg.method]
    let result
    if (interfaceMethd) {
      result = interfaceMethd.call(this, mesg.data)
    } else {
      throw new Error('[' + this.component.name + '] not have interface:[' + mesg.method + ']')
    }
    if (result) {
      this.send(mesg.source, mesg.method + 'Callback', result, null, 'RETURN')
    }
  }
  /**
         * 绑定窗口事件，用于监听跨域事件
         */
  this.listen = function () {
    let _this = this
    if (window.addEventListener) { // 非IE
      window.addEventListener('message', function (event) {
        _this.process(event)
      }, false)
    } else { // IE
      window.attachEvent('onmessage', function (event) {
        _this.process(event)
      })
    }
  }
}

export default CD
