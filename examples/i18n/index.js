import iielement from '../../packages/index.js'
import _ from 'lodash'
let Messages = {}
_.merge(Messages, iielement.MessagesBase, {
  en: {
  },
  cn: {
    factory: {
      moduleName: '工厂',
      code: '工厂代码',
      name: '工厂名称',
      group: '集团',
      desc: '描述'
    },
    workshop: {
      moduleName: '车间',
      code: '车间代码',
      name: '车间名称',
      desc: '描述',
      factoryname: '工厂名称'
    },
    line: {
      moduleName: '生产线',
      code: '生产线代码',
      name: '生产线名称',
      desc: '描述',
      nameForWO: ''
    },
    stage: {
      moduleName: '生产阶段',
      code: '生产阶段代码',
      name: '生产阶段名称',
      desc: '描述'
    }
  }
})
export default Messages
