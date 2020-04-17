import MenuItem from './src/menu-item.vue'

/* istanbul ignore next */
MenuItem.install = function (Vue) {
  Vue.component(MenuItem.name, MenuItem)
}

export default MenuItem
