import moment from 'moment'
import MsgBox from './msgbox/index.js'
import SvgIcon from './svg-icon/index.js'
import Messenger from './cross-iframe-messenger/index.js'
import MessagesBase from './i18n/index.js'
import CodeView from './code-view/index.js'
import IiCascader from './cascader/index.js'
import IiKeyboardInput from './keyboard-input/index.js'
import IiQuickInput from './quick-input/index.js'
import IiRadioGroup from './radio-group/index.js'
import IiSingleSelect from './single-select/index.js'
import IiMultiSelect from './multi-select/index.js'
import IiUpload from './upload/index.js'
import IiPanel from './panel/index.js'
import {
  locale,
  Loading,
  Container,
  Input,
  ButtonGroup,
  Button,
  RadioGroup,
  Radio,
  RadioButton,
  CheckboxGroup,
  Checkbox,
  InputNumber,
  Switch,
  TimeSelect,
  DatePicker,
  Upload,
  Form,
  Table,
  Dialog,
  Row,
  Main,
  Aside,
  Header,
  Footer,
  FormItem,
  TableColumn,
  Col,
  Tooltip,
  Select,
  Cascader,
  Option,
  Card,
  Menu,
  MenuItem,
  Submenu,
  Scrollbar,
  Breadcrumb,
  BreadcrumbItem,
  Dropdown,
  DropdownItem,
  DropdownMenu,
  Tabs,
  TabPane,
  Tree,
  Message,
  Collapse,
  CollapseItem,
  Divider,
  Link,
  Image,
  Popover,
  Tag,
  Steps,
  Step
} from 'element-ui'
import Icons from './icons/index.js'
const components = [
  SvgIcon,
  CodeView
]

const elcomponents = [
  Container,
  Input,
  ButtonGroup,
  Button,
  CheckboxGroup,
  Checkbox,
  InputNumber,
  Switch,
  Form,
  Table,
  Row,
  Dialog,
  Card,
  Menu,
  Scrollbar,
  Breadcrumb,
  Dropdown,
  Tabs,
  Tree,
  Collapse,
  TimeSelect,
  DatePicker,
  Tag
]

const elcomponentsin = [
  Main,
  Aside,
  Header,
  Footer,
  FormItem,
  TableColumn,
  Col,
  Tooltip,
  MenuItem,
  Submenu,
  BreadcrumbItem,
  DropdownItem,
  DropdownMenu,
  TabPane,
  CollapseItem,
  Divider,
  Radio,
  RadioButton,
  Link,
  Image,
  Popover,
  Steps,
  Step
]
const install = function (Vue, opts = {}) {
  const requireAll = requireContext => requireContext.keys().map(requireContext)
  // const req = require.context('./svg', true, /\.svg$/)
  requireAll(Icons)
  require('element-ui/lib/theme-chalk/index.css')
  require('./styles/index.scss')
  Vue.use(Loading.directive)
  Vue.prototype.$loading = Loading.service
  Vue.prototype.$message = Message
  Vue.component('ii-select-org', {
    render () { return <div class='ii-select-org'>{this.$options.extends.render.apply(this, [this.$createElement])}</div> },
    extends: Select
  })
  Vue.component('ii-scrollbar-org', Scrollbar)
  Vue.component('ii-menu-org', Menu)
  Vue.component('ElTag', Tag)
  Vue.component('el-tag', Tag)
  Vue.component('ii-option-org', Option)
  Vue.component('ii-cascader-org', {
    render () { return <div class='ii-cascader-org'>{this.$options.extends.render.apply(this, [this.$createElement])}</div> },
    extends: Cascader
  })
  Vue.component('ii-radio-group-org', {
    render () { return <div class='ii-radio-group-org'>{this.$options.extends.render.apply(this, [this.$createElement])}</div> },
    extends: RadioGroup
  })
  Vue.component('ii-upload-org', {
    render () { return <div class='ii-upload-org'>{this.$options.extends.render.apply(this, [this.$createElement])}</div> },
    extends: Upload
  })
  Vue.use(MsgBox)
  Vue.use(Messenger)
  Vue.use(IiCascader)
  Vue.use(IiKeyboardInput)
  Vue.use(IiQuickInput)
  Vue.use(IiRadioGroup)
  Vue.use(IiSingleSelect)
  Vue.use(IiMultiSelect)
  Vue.use(IiUpload)
  Vue.use(IiPanel)
  components.forEach(component => {
    Vue.component(component.name, component)
  })
  elcomponents.forEach(component => {
    let componentname = component.name.substr(2)
    Vue.component('Ii' + componentname, {
      render () {
        let superRendered
        if (componentname === 'DatePicker') {
          superRendered = this.$options.extends.mixins[0].render.apply(this, [this.$createElement])
        } else {
          superRendered = this.$options.extends.render.apply(this, [this.$createElement])
        }
        let renderclass
        switch (componentname) {
          case 'ButtonGroup':
            renderclass = 'ii-button-group'
            break
          case 'CheckboxGroup':
            renderclass = 'ii-checkbox-group'
            break
          case 'RadioGroup':
            renderclass = 'ii-radio-group'
            break
          case 'InputNumber':
            renderclass = 'ii-input-number'
            break
          case 'TimeSelect':
            renderclass = 'ii-time-select'
            break
          case 'DatePicker':
            renderclass = 'ii-date-picker'
            break
          case 'DropdownMenu':
            renderclass = 'ii-dropdown-menu'
            break
          default:
            renderclass = 'ii-' + componentname.toLowerCase()
        }
        return <div class={renderclass}>{superRendered}</div>
      },
      extends: component
    })
  })
  elcomponentsin.forEach(component => {
    let componentname = component.name.substr(2)
    Vue.component('Ii' + componentname, component)
  })
  Vue.filter('date', function (value) {
    if (!value) return ''
    value = moment(value).format('YYYY-MM-DD HH:mm:ss')
    return value
  })
  Vue.filter('null', function (value) {
    if (!value) return ''
    return value
  })

  /* istanbul ignore if */
  if (typeof window !== 'undefined' && window.Vue) {
    install(window.Vue)
  }
}

if (typeof window !== 'undefined' && window.Vue) {
  install(window.Vue)
}

export default {
  version: '2.13.0',
  locale: locale.use,
  i18n: locale.i18n,
  MessagesBase,
  install,
  MsgBox,
  SvgIcon,
  Messenger
}
