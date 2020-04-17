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
import ElementUI, { locale } from 'element-ui'
import Icons from './icons/index.js'
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

const install = function (Vue, opts = {}) {
  const requireAll = requireContext => requireContext.keys().map(requireContext)
  // const req = require.context('./svg', true, /\.svg$/)
  requireAll(Icons)
  EditForm.$maintain_service_agent = opts.maintain_service_agent
  Vue.use(ElementUI)
  Vue.use(VirtualScroller)
  components.forEach(component => {
    Vue.component(component.name, component)
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
