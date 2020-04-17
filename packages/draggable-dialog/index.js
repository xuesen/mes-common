import DraggableDialog from './src/draggable-dialog.vue'

/* istanbul ignore next */
DraggableDialog.install = function (Vue) {
  Vue.component(DraggableDialog.name, DraggableDialog)
}

export default DraggableDialog
