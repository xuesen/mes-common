import Cascader from './cascader/index.js'
import DraggableDialog from './draggable-dialog/index.js'
import EditForm from './edit-form/index.js'
import Filter from './filter/index.js'
import ImportExcel from './import-excel/index.js'
import ListWithFilter from './list-with-filter/index.js'
import MaintainPage from './maintain-page/index.js'
import MaintainTable from './maintain-table/index.js'
import MenuItem from './menu-item/index.js'
import MsgBox from './msgbox/index.js'
import RadioGroup from './radio-group/index.js'
import SingleSelect from './single-select/index.js'
import SvgIcon from './svg-icon/index.js'
import VirtualTableMix from './virtual-table-mix/index.js'
import VirtualScroller from './vue-virtual-scroller/index.js'
import MessagesBase from './i18n/index.js'
import {
  locale,
  Loading,
  Container,
  Input,
  ButtonGroup,
  Button,
  Radio,
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
  Option
} from 'element-ui'
import Icons from './icons/index.js'
import moment from 'moment'
import VueSession from 'vue-session'
import 'element-ui/lib/theme-chalk/index.css'
import './styles/index.scss'
const components = [
  Cascader,
  DraggableDialog,
  EditForm,
  Filter,
  ImportExcel,
  ListWithFilter,
  MaintainPage,
  MaintainTable,
  MenuItem,
  MsgBox,
  RadioGroup,
  SingleSelect,
  SvgIcon
]

const elcomponents = [
  Container,
  Input,
  ButtonGroup,
  Button,
  RadioGroup,
  Radio,
  CheckboxGroup,
  Checkbox,
  InputNumber,
  Switch,
  TimeSelect,
  DatePicker,
  Upload,
  Form,
  Table,
  Row,
  Dialog
]

const elcomponentsin = [
  Main,
  Aside,
  Header,
  Footer,
  FormItem,
  TableColumn,
  Col,
  Tooltip
]
const install = function (Vue, opts = {}) {
  const requireAll = requireContext => requireContext.keys().map(requireContext)
  // const req = require.context('./svg', true, /\.svg$/)
  requireAll(Icons)
  EditForm.$maintain_service_agent = opts.maintain_service_agent
  Vue.use(VueSession)
  Vue.use(Loading.directive)
  Vue.prototype.$loading = Loading.service
  Vue.component('ii-select-org', Select)
  Vue.component('ii-option-org', Option)
  Vue.use(VirtualScroller)
  components.forEach(component => {
    Vue.component(component.name, component)
  })
  elcomponents.forEach(component => {
    let componentname = component.name.substr(2)
    Vue.component('Ii' + componentname, {
      render () {
        let superRendered = this.$options.extends.render.apply(this, [this.$createElement])
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
  Vue.use(MsgBox)

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
  Cascader,
  DraggableDialog,
  EditForm,
  Filter,
  ImportExcel,
  ListWithFilter,
  MaintainPage,
  MaintainTable,
  MenuItem,
  MsgBox,
  RadioGroup,
  SingleSelect,
  SvgIcon,
  VirtualTableMix,
  VirtualScroller
}
