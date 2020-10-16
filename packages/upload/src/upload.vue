<template>
  <ii-upload-org
    ref="upload"
    :multiple="initOptions ? initOptions.multiple : multiple"
    :limit="limit"
    :data="initOptions ? initOptions.file_metadata : fileMetadata"
    :accept="initOptions ? initOptions.accept : accept"
    :action="upload_action"
    :auto-upload="autoUpload"
    :list-type="initOptions ? initOptions.list_type : listType"
    :file-list="file_list"
    :before-upload="initOptions ? initOptions.before_upload : beforeUpload"
    :on-remove="remove_file"
    :on-success="upload_success"
    :on-error="upload_error"
    :disabled="disabled">
    <slot v-if="$slots.trigger" name="trigger" slot="trigger"></slot>
    <ii-button-group v-if="!$slots.trigger && (initOptions ? initOptions.list_type : listType) !== 'picture-card'" slot="trigger">
      <ii-tooltip :content='$t("button.upload")' placement="top-start">
        <ii-button :disabled="disabled || (limit && limit === file_list.length)"><ii-svg-icon :width="24" :height="24" name="btnicon/upload"></ii-svg-icon></ii-button>
      </ii-tooltip>
      <ii-tooltip v-if="supportPicturePaste" :content='$t("button.upload_from_paste")' placement="top-start">
        <ii-button :disabled="disabled || (limit && limit === file_list.length)" @click.stop="open_paste_dialog"><ii-svg-icon :size="24" name="btnicon/paste"></ii-svg-icon></ii-button>
      </ii-tooltip>
    </ii-button-group>
    <ii-button :disabled="disabled || (limit && limit === file_list.length)" v-if="!$slots.trigger && (initOptions ? initOptions.list_type : listType) === 'picture-card'" slot="trigger" size="small"><ii-svg-icon width="32" height="32" name="btnicon/add"></ii-svg-icon></ii-button>
    <ii-button class="el-upload el-upload--picture-card" style="" :disabled="disabled || (limit && limit === file_list.length)" v-if="supportPicturePaste && !$slots.trigger && (initOptions ? initOptions.list_type : listType) === 'picture-card'" @click.stop="open_paste_dialog" size="small"><ii-svg-icon size="32" name="btnicon/paste"></ii-svg-icon></ii-button>
    <ii-dialog
      @paste.native="get_paste_file"
      :title="$t('dialog.paste_title')"
      :show-close="true"
      :visible="paste_dialog.visible"
      @close="handle_paste_dialog_cancel">
      <ii-image v-if="paste_dialog.url" :src="paste_dialog.url" fit="fill"></ii-image>
      <ii-input v-else ref="paste_dialog_paste_area" type="textarea" resize="none" :rows="4" :value="$t('msg.paste_dialog.please_paste')" :readonly="true"/>
      <span slot="footer" class="dialog-footer">
        <ii-button type="text" @click="paste_dialog_clear">{{ $t('button.clear') }}</ii-button>
        <ii-button type="primary" @click="handle_paste_dialog_ok">{{ $t('button.confirm') }}</ii-button>
      </span>
    </ii-dialog>
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
function is_image (items) {
  let i = 0
  let item
  while (i < items.length) {
    item = items[i]
    if (item.type.indexOf('image') !== -1) {
      return item
    }
    i++
  }
  return false
}
function get_file_name (e) {
  let value
  if (window.clipboardData && window.clipboardData.getData) {
    value = window.clipboardData.getData('Text')
  } else if (event.clipboardData && event.clipboardData.getData) {
    value = event.clipboardData.getData('Text')
  }
  return value ? value.split('\r').first() : ''
}
export default {
  name: 'IiUpload',
  props: {
    autoUpload: {
      type: Boolean,
      default: true
    },
    action: String,
    initOptions: Object,
    limit: Number,
    accept: String,
    fileMetadata: Object,
    multiple: Boolean,
    listType: String,
    fileList: Array,
    beforeUpload: Function,
    disabled: Boolean,
    supportPicturePaste: {
      type: Boolean,
      default: false
    }
  },
  data () {
    return {
      upload_action: this.action || './storageservice/api/asset',
      file_list: [],
      self_updating: false,
      paste_dialog: {
        visible: false,
        file: null,
        url: ''
      }
    }
  },
  methods: {
    upload () {
      this.$refs.upload.submit()
    },
    open_paste_dialog () {
      this.paste_dialog.visible = true
      this.$nextTick(() => {
        this.$refs.paste_dialog_paste_area.focus()
      })
    },
    get_paste_file (event) {
      if (event.clipboardData && event.clipboardData.items) {
        let image = is_image(event.clipboardData.items)
        if (image) {
          event.preventDefault()
          let file = image.getAsFile()
          file.status = ''
          this.paste_dialog.file = file
          this.paste_dialog.url = URL.createObjectURL(file)
        }
      }
    },
    handle_paste_dialog_cancel () {
      this.paste_dialog.visible = false
      this.paste_dialog_clear()
    },
    handle_paste_dialog_ok () {
      if (!this.paste_dialog.file) {
        this.$ii_message('error', this.$t('msg.paste_dialog.please_paste'))
        return
      }
      this.paste_dialog.visible = false
      _.find(this.$refs.upload.$children, 'uploadFiles').uploadFiles([this.paste_dialog.file])
      this.paste_dialog_clear()
    },
    paste_dialog_clear () {
      this.paste_dialog.file = null
      this.paste_dialog.url = ''
      this.$nextTick(() => {
        if (this.$refs.paste_dialog_paste_area) this.$refs.paste_dialog_paste_area.focus()
      })
    },
    upload_success (response, file, file_list) {
      if (response.result !== 'ok') {
        this.$ii_message('error', 'upload error. ' + response.errMsg)
      } else {
        file.storageId = response.data
        this.file_list = file_list // _.map(file_list, (file_item) => { return {name: file_item.name, storageId: file_item.storageId, url: file_item.url, status: file_item.status} })
        this.self_updating = true
        this.$emit('update:fileList', _.map(file_list, (file_item) => { return {name: file_item.name, storageId: file_item.storageId, url: file_item.url, status: file_item.status} }))
      }
    },
    upload_error (err) {
      this.$ii_message('error', 'upload error. ' + err.message)
    },
    init_file_list (files) {
      if (!files || files.length === 0) {
        this.file_list = []
        return
      }
      this.file_list = _.map(files, (file_item) => {
        return {
          name: file_item.name,
          storageId: file_item.storageId,
          status: file_item.status,
          url: './storageservice/api/asset/' + file_item.storageId
        }
      })
    },
    remove_file (file, file_list) {
      // this.$axios('./storageservice/api/asset/' + file.storageId, 'delete', {})
      this.file_list = file_list // _.map(file_list, (file_item) => { return {name: file_item.name, storageId: file_item.storageId, url: file_item.url, status: file_item.status} })
      this.self_updating = true
      this.$emit('update:fileList', _.map(file_list, (file_item) => { return {name: file_item.name, storageId: file_item.storageId, url: file_item.url, status: file_item.status} }))
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
