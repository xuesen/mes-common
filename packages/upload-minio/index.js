import UploadMinio from './src/upload-minio.vue'

/* istanbul ignore next */
UploadMinio.install = function (Vue) {
  Vue.component(UploadMinio.name, UploadMinio)
}

export default UploadMinio
