<template>
  <div class="import-excel ii-button">
    <ii-dropdown placement="left">
      <ii-upload-org
        ref="upload"
        :multiple="false"
        :show-file-list="false"
        name="erpdata"
        accept=".xls,.xlsx"
        :data="params"
        :action="'./dataimportservice' + importAction"
        :before-upload="beforeUpload"
        :on-progress="() => { this.uploading=true }"
        :on-error="uploadError"
        :on-success="handleSuccess">
        <ii-button v-loading="uploading" slot="trigger"><ii-svg-icon width="24" height="24" :name="'btnicon/import'"/></ii-button>
      </ii-upload-org>
      <ii-dropdown-menu slot="dropdown">
        <ii-dropdown-item>
          <ii-link :underline="false" @click="downloadTemplate">
          <ii-svg-icon :name="'btnicon/excel'" style="vertical-align: middle;" width="20" height="20"/>
            <span style="display:inline-block;padding-left:10px;vertical-align: middle;">{{ $t("importExcel.downloadTemplate") }}</span>
          </ii-link>
        </ii-dropdown-item>
      </ii-dropdown-menu>
    </ii-dropdown>
  </div>
</template>
<i18n>
{
  "en": {
    "importExcel": {
      "downloadTemplate": "下载模板",
      "importError": "导入失败",
      "importSuccess": "导入成功"
    }
  },

  "cn": {
    "importExcel": {
      "downloadTemplate": "下载模板",
      "importError": "导入失败",
      "importSuccess": "导入成功"
    }
  }
}
</i18n>
<style lang="scss" scoped="" type="text/css">
</style>
<script>
import { saveAs } from 'file-saver'
import moment from 'moment'
export default {
  name: 'IiImportExcel',
  props: {
    importAction: {
      type: String,
      default: '/api/temporarytable/upload'
    },
    importParam: Object
  },
  data () {
    return {
      params: {
        ...this.importParam,
        editor: this.$session.get('loginstate').user.code ? this.$session.get('loginstate').user.code : '9999',
        time: moment(new Date()).format('YYYY-MM-DD HH:mm:ss')
      },
      uploading: false
    }
  },
  methods: {
    beforeUpload () {
      this.params.time = moment(new Date()).format('YYYY-MM-DD HH:mm:ss')
    },
    uploadError (err, file, fileList) {
      this.uploading = false
      this.$ii_message('error', this.$t('importExcel.importError') + '\n' + err.message)
    },
    async handleSuccess (response, file, file_list) {
      this.uploading = false
      if (response.result !== 'ok') {
        await this.$ii_message('error', 'upload error. ' + response.errMsg)
        return
      }
      this.$emit('importSuccess')
      this.$message({
        type: 'success',
        message: this.$t('importExcel.importSuccess')
      })
    },
    downloadTemplate () {
      saveAs(window.location.origin + window.location.pathname + 'template/' + this.$route.name + '.xlsx', this.$route.name + '.xlsx')
    }
  },
  mounted () {
  },
  watch: {
  }
}
</script>
