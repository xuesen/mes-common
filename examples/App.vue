/* eslint-disable @typescript-eslint/no-var-requires */
<template>
  <div class="app" id="app" style="padding: 20px;">
    <!-- <ii-select-org></ii-select-org> -->
    <ii-upload
      :file-metadata="file_metadata"
      :before-upload="before_upload"
      :file-list.sync="file_list"
      :list-type="list_type"
      :limit="1"
      :multiple="false"
      :support-picture-paste="true">
    </ii-upload>
    <ii-collapse v-model="activeNames" accordion>
      <ii-collapse-item title="过滤器" name="1">
        <ii-row>
          <ii-col :span="24">
            {{ new Date() | date }}
            <ii-divider content-position="left">代码</ii-divider>
            <ii-code-view :code="filter_code"></ii-code-view>
          </ii-col>
        </ii-row>
      </ii-collapse-item>
      <ii-collapse-item title="错误，确认信息提示框" name="2">
        <ii-row>
          <ii-col :span="24">
            <ii-button @click="show_error">错误</ii-button>
            <ii-divider content-position="left">代码</ii-divider>
            <ii-code-view :code="show_error_code"></ii-code-view>
          </ii-col>
        </ii-row>
        <ii-row>
          <ii-col :span="24">
            <ii-button @click="show_confirm">{{this.$t('button.ok')}}</ii-button>
            <ii-divider content-position="left">代码</ii-divider>
            <ii-code-view :code="show_confirm_code"></ii-code-view>
          </ii-col>
        </ii-row>
        <ii-row>
          <ii-col :span="24">
            <ii-button @click="show_warn">警告</ii-button>
            <ii-divider content-position="left">代码</ii-divider>
            <ii-code-view :code="show_warn_code"></ii-code-view>
          </ii-col>
        </ii-row>
      </ii-collapse-item>
      <ii-collapse-item title="图标库" name="3">
        <ii-row>
          <ii-col :span="24">
            <ii-card :key="icon" v-for="icon in icons" style="display: inline-block; width: 120px; height: 120px; padding: 0 10px;">
              <ii-svg-icon :width="24" :height="24" :name="icon.replace('./', '').replace('.svg', '')" />
              <div><span v-text="icon.replace('./', '').replace('.svg', '')"></span></div>
            </ii-card>
            <ii-divider content-position="left">代码</ii-divider>
            <ii-code-view :code="icon_code"></ii-code-view>
          </ii-col>
        </ii-row>
      </ii-collapse-item>
      <ii-collapse-item title="minio上传" name="4">
        <ii-row style="padding-bottom:10px;padding-top:10px;">
          <ii-col :span="3">
            <ii-input v-model="bucket" placeholder="请输入bucket"></ii-input>
          </ii-col>
          <ii-col :span="5">
            <ii-button type="primary" @click="handle_minio_create_bucket()">minio服务端创建bucket</ii-button>
          </ii-col>
        </ii-row>
      </ii-collapse-item>
      <ii-collapse-item title="minio上传组件" name="5">
        <ii-row>
          <ii-col :span="10">
            <ii-upload-minio
              :file-list.sync="fileList"
              :bucket="params.bucket"
              :end-point="params.endPoint"
              :port="params.port"
              :usessl="params.useSSL"
              :access-key="params.accessKey"
              :secret-key="params.secretKey"
            >
            </ii-upload-minio>
          </ii-col>
          <!-- <ii-col :span="3">
            <ii-button type="primary" @click="handle_filelist()">打印文件列表</ii-button>
          </ii-col> -->
        </ii-row>
      </ii-collapse-item>
    </ii-collapse>


  </div>
</template>

<script>
import Codes from './example-code/index.js'
import Icons from '../packages/icons/index.js'
import * as Minio from 'minio'
import stream from 'stream'

export default {
  name: 'App',
  components: {
  },
  mounted () {
    const requireAll = requireContext => requireContext.keys().map(requireContext)
    requireAll(Codes)
  },
  data () {
    return {
      params: {
        bucket: 'iimes',
        // endPoint: 'localhost',
        // port: 8092,
        // useSSL: false,
        // accessKey: 'admin',
        // secretKey: 'adminminio'
        endPoint: 'play.min.io',
        port: 9000,
        useSSL: true,
        accessKey: 'Q3AM3UQ867SPQQA43P2F',
        secretKey: 'zuf+tfteSlswRu7BJ86wekitnifILbZam1KYY3TG'
      },
      fileList: [
        // {
        //   name: 'bar2.btw'
        // }
      ],
      bucket: 'iimes',
      islogined: undefined,
      activeNames: ['4', '5'],
      show_error_code: Codes('./show-error.code'),
      show_warn_code: Codes('./show-warn.code'),
      show_confirm_code: Codes('./show-confirm.code'),
      icon_code: Codes('./icon.code'),
      filter_code: Codes('./filter.code'),
      icons: Icons.keys(),
      file_list: [],
      file_metadata: {appName: 'test', module: 'demo-pic-upload'},
      list_type: 'text', // text/picture/picture-card
      filestring: ''
    }
  },
  methods: {
    handle_filelist () {
      console.log(this.fileList)
    },
    handle_connect_minio () {
      let minioClient = new Minio.Client({
          endPoint: this.params.endPoint,
          port: this.params.port,
          useSSL: this.params.useSSL,
          accessKey: this.params.accessKey,
          secretKey: this.params.secretKey
      })
      return minioClient
    },
    handle_minio_create_bucket () {
      let minioClient = this.handle_connect_minio()
      console.log(minioClient)
      minioClient.makeBucket(this.bucket, 'us-east-1', function(err) {
        if (err) return console.log('Error creating bucket. ' + err)
        console.log('Bucket created successfully in "us-east-1".')
      })
    },
    before_upload (file) {
      return true
    },
    base64toBlob (base64Data) {
      let byteString = base64Data
      if (base64Data.split(',')[0].indexOf('base64') >= 0) {
        byteString = atob(base64Data.split(',')[1]) // base64 解码
      } else {
        byteString = unescape(base64Data.split(',')[1])
      }
      // 获取文件类型
      let mimeString = base64Data.split(';')[0].split(":")[1] // mime类型

      // ArrayBuffer 对象用来表示通用的、固定长度的原始二进制数据缓冲区
      // let arrayBuffer = new ArrayBuffer(byteString.length) // 创建缓冲数组
      // let uintArr = new Uint8Array(arrayBuffer) // 创建视图

      let uintArr = new Uint8Array(byteString.length) // 创建视图

      for (let i = 0; i < byteString.length; i++) {
        uintArr[i] = byteString.charCodeAt(i)
      }
      // 生成blob
      const blob = new Blob([uintArr], {
        type: mimeString
      })
      // 使用 Blob 创建一个指向类型化数组的URL, URL.createObjectURL是new Blob文件的方法,可以生成一个普通的url,可以直接使用,比如用在img.src上
      return blob
    },
    async show_error () {
      try {
        await this.$ii_message('error', '错误信息')
      } catch (e) {
      }
    },
    async show_confirm () {
      try {
        await this.$ii_message('confirm', 'Are you sure?')
        alert('sure!')
      } catch (e) {
        alert('cancel!')
      }
    },
    async show_warn () {
      try {
        await this.$ii_message('warn', '警报')
      } catch (e) {
      }
    }
  }
}
</script>

<style rel="stylesheet/scss" lang="scss">
.app {
  font-family: Source Han Sans CN,Helvetica Neue,Helvetica,PingFang SC,Hiragino Sans GB,Microsoft YaHei,Arial,"sans-serif";
  box-sizing: border-box;
  height: 100%;
  .el-collapse-item__header {
    padding: 0 20px;
    background-color: #ecf9fd;
    font-size: 20px;
  }
  .el-collapse-item__content {
    padding: 20px;
    background-color: #e8f1f8;
  }
  .el-divider__text {
    background-color: transparent;
  }
}
</style>
