<template>
  <div class="importExcel">
    <el-dropdown placement="left">
      <el-upload
        ref="upload"
        :multiple="false"
        :show-file-list="false"
        name="erpdata"
        accept=".xls,.xlsx"
        :data="params"
        :action="uploadAction"
        :before-upload="beforeUpload"
        :on-progress="() => { this.uploading=true }"
        :on-error="uploadError"
        :on-success="handleSuccess">
        <el-button v-loading="uploading" slot="trigger"><svg-icon width="24" height="24" :name="'btnicon/import'"/></el-button>
      </el-upload>
      <el-dropdown-menu slot="dropdown">
        <el-dropdown-item><el-link :underline="false" :href="'./static/template/' + this.entity + '.xlsx'"><svg-icon :name="'btnicon/excel'" style="vertical-align: middle;" width="20" height="20"/><span style="display:inline-block;padding-left:10px;vertical-align: middle;">{{ $t("importExcel.downloadTemplate") }}</span></el-link></el-dropdown-item>
      </el-dropdown-menu>
    </el-dropdown>
  </div>
</template>
<i18n>
{
  "en": {
    "importExcel": {
      "downloadTemplate": "下载模板"
    }
  },

  "cn": {
    "importExcel": {
      "downloadTemplate": "下载模板"
    }
  }
}
</i18n>
<style lang="scss" scoped="" type="text/css">
  @import "../../styles/variables.scss";
  .importExcel {
    width: 30px;
    display: inline-block;
    position: relative;
    line-height: 1;
    vertical-align: top;
    /deep/ .el-loading-spinner {
      margin-top: -10px;
      /deep/ .circular {
        height: 20px;
        width: 20px;
      }
    }
  }
  .el-dropdown-menu {
    padding: 0px;
  }
  /deep/ .el-dropdown-menu__item {
    height: 48px;
    line-height: 48px;
    font-size:16px;
    font-weight:500;
    color:$color3;
    &:hover,&:focus {
      background-color: $backcolor1;
      color: $color3;
    }
  }
  /deep/ .el-select-dropdown__item {
      font-size:$smallfontsize1;
      &.selected {
        background-color: #3fd1db !important;
        color: #fff !important;
      }
      &:hover, &:focus {
          background-color: #3fd1db !important;
          color: #fff !important;
      }
      @media #{$media} and ($feature: $value) {
        font-size:$smallfontsize2;
      }
  }
</style>
<script>
import { saveAs } from 'file-saver'
var moment = require('moment')
export default {
  name: 'IiImportExcel',
  props: {
    uploadAction: String,
    entity: String
  },
  data () {
    return {
      params: {
        entity: this.entity,
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
      this.$defmsgbox('error', this.$t('msg.importError') + '\n' + err)
    },
    handleSuccess () {
      this.uploading = false
      this.$emit('importSuccess')
      this.$message({
        type: 'success',
        message: this.$t('msg.importSuccess')
      })
    },
    downloadTemplate () {
      saveAs(window.location.origin + '/static/template/' + this.entity + '.xlsx', this.entity + '.xlsx')
    }
  },
  mounted () {
  },
  watch: {
  }
}
</script>
