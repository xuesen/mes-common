<template>
  <ii-upload-org
    :action="endPoint"
    :http-request="handleSelfDefineUpload"
    :auto-upload="autoUpload"
    :file-list="file_list"
    :show-file-list="true"
    :multiple="true"
    :on-preview="handlePreview"
    :on-remove="removefile"
    :on-success="uploadSuccess"
    :on-error="uploadError"
    ref="upload">
      <ii-button type="primary" slot="trigger">minio上传</ii-button>
  </ii-upload-org>
</template>
<style lang="css" scoped>
</style>
<i18n>
{
  "en": {
  },
  "cn": {
    "button": {
      "upload": "上传"
    }
  }
}
</i18n>
<script>
import _ from 'lodash'
import * as Minio from 'minio'
import stream from 'stream'
// var minioClient = new Minio.Client({
//     // endPoint: 'localhost',
//     // port: 8092,
//     // useSSL: false,
//     // accessKey: 'admin',
//     // secretKey: 'adminminio'
//     endPoint: 'play.min.io',
//     port: 9000,
//     useSSL: true,
//     accessKey: 'Q3AM3UQ867SPQQA43P2F',
//     secretKey: 'zuf+tfteSlswRu7BJ86wekitnifILbZam1KYY3TG'
// })
export default {
  name: 'IiUploadMinio',
  props: {
    autoUpload: {
      type: Boolean,
      default: true
    },
    fileList: Array,
    endPoint: {
      type: String,
      default: 'play.min.io'
    },
    port: {
      type: Number,
      default: 9000
    },
    usessl: {
      type: Boolean,
      default: true
    },
    accessKey: {
      type: String,
      default: 'Q3AM3UQ867SPQQA43P2F'
    },
    secretKey: {
      type: String,
      default: 'zuf+tfteSlswRu7BJ86wekitnifILbZam1KYY3TG'
    },
    bucket: String
  },
  data () {
    return {
      file_list: [],
      self_updating: false
    }
  },
  methods: {
    handle_connect_minio () {
      let minioClient = new Minio.Client({
          endPoint: this.endPoint,
          port: this.port,
          useSSL: this.usessl,
          accessKey: this.accessKey,
          secretKey: this.secretKey
      })
      return minioClient
    },
    async handleSelfDefineUpload (params) {
      console.log(params)
      let _this = this
      const fileName = params.file.name
      const mineType = params.file.type
      const fileSize = params.file.size
      let metadata = {
        "content-type": mineType,
        "content-length": fileSize
      }
      // 验证存储桶是否存在
      let minioClient = this.handle_connect_minio()
      minioClient.bucketExists(_this.bucket, async function(err) {
        if (err) {
          if (err.code == 'NoSuchBucket') {
            await _this.$ii_message('error', _this.bucket + 'not exist')
            return console.log("bucket does not exist.")
          }
          return console.log(err)
        }
        console.log('Bucket exists.')
        let reader = new FileReader()
        reader.readAsArrayBuffer(params.file)

        reader.onload = function(ex) {
          //定义流
          let bufferStream = new stream.PassThrough();
          //将buffer写入
          bufferStream.end(new Buffer(ex.target.result));
          //上传
          minioClient.putObject(_this.bucket, fileName, bufferStream, fileSize, metadata, async function(err, etag) {
            if (err) {
              _this.file_list.splice(_this.file_list.length - 1, 1)
              await _this.$ii_message('error', fileName + ':fail')
              return console.log(fileName + ":fail")
            }
            params.onSuccess({file: params.file, status: 'success'})
            // console.log(fileName + ":success")
          })
        }
      })
    },
    handlePreview (file) {
      let _this = this
      this.handle_minio_download(_this.bucket, file.name)
    },
    removefile (file, fileList) {
      let _this = this
      this.file_list = fileList

      this.self_updating = true
      this.$emit('update:fileList', _.map(fileList, (o) => {
        return {
          name: o.name,
          status: o.status,
          size: o.size,
          uid: o.uid
        } 
      }))

      this.handle_minio_delete(_this.bucket, file.name)
    },
    uploadSuccess (response, file, fileList) {
      if (response) {
        if (response.status !== 'success') {
          this.$ii_message('error', 'upload error. ' + response.file.name)
        } else {
          this.file_list = fileList
          console.log(this.file_list)
          this.self_updating = true
          this.$emit('update:fileList', _.map(fileList, o => {
            return {
              name: o.name,
              status: o.status,
              size: o.size,
              uid: o.uid
            }
          }))
        }
      }
    },
    uploadError (err, file, fileList) {
      this.$ii_message('error', 'upload error. ' + err.message)
    },
    handle_minio_download (bucket, filename) {
      let _this = this
      let size = 0
      let chunks = []
      let a = document.createElement('a');
      let minioClient = this.handle_connect_minio()
      minioClient.getObject(bucket, filename, function(err, dataStream) {
        if (err) {
          return console.log(err)
        }
        dataStream.on('data', function(chunk) {
          chunks = chunk
          const blob = new Blob([chunk])
          a.download = filename;
          a.href =  URL.createObjectURL(blob);
          size += chunk.length
        })
        dataStream.on('end', function() {
          if (chunks.length !== size) {
            console.log('error stream,size:' + chunks.length)
          } else {
            let event = new MouseEvent('click');
            a.dispatchEvent(event);
          }
          console.log('End. Total size = ' + size)
        })
        dataStream.on('error', function(err) {
          console.log(err)
        })
      })
    },
    handle_minio_delete (bucket, filename) {
      let _this = this
      let minioClient = this.handle_connect_minio()
      minioClient.removeObject(bucket, filename, function(err) {
        if (err) {
          return console.log('Unable to remove object', err)
        }
        console.log('Removed the object：' + filename)
      })
    },
    init_file_list (files) {
      if (!files || files.length === 0) {
        this.file_list = []
        return
      }
      this.file_list = _.map(files, (o) => {
        return {
          name: o.name ? o.name : '',
          status: o.status ? o.status : '',
          size: o.size ? o.size : '',
          uid: o.uid ? o.uid : ''
        }
      })
    }
  },
  mounted () {
    this.init_file_list(this.fileList)
  },
  watch: {
    'fileList' (val) {
      if (this.self_updating) {
        this.self_updating = false
        return
      }
      this.init_file_list(val)
    }
  }
}
</script>
