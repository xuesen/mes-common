import ImportExcel from './src/import-excel.vue'

/* istanbul ignore next */
ImportExcel.install = function (Vue) {
  Vue.component(ImportExcel.name, ImportExcel)
}

export default ImportExcel
