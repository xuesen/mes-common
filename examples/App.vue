/* eslint-disable @typescript-eslint/no-var-requires */
<template>
  <div class="app" id="app" style="padding: 20px;">
    <ii-upload
      accept="jpg,png,jpeg"
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
            <ii-button @click="show_confirm">确认</ii-button>
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
    </ii-collapse>
  </div>
</template>

<script>
import Codes from './example-code/index.js'
import Icons from '../packages/icons/index.js'
export default {
  name: 'App',
  components: {
  },
  data () {
    return {
      islogined: undefined,
      activeNames: ['1'],
      show_error_code: Codes('./show-error.code'),
      show_warn_code: Codes('./show-warn.code'),
      show_confirm_code: Codes('./show-confirm.code'),
      icon_code: Codes('./icon.code'),
      filter_code: Codes('./filter.code'),
      icons: Icons.keys(),
      file_list: [],
      file_metadata: {appName: 'test', module: 'demo-pic-upload'},
      list_type: 'text' // text/picture/picture-card
    }
  },
  methods: {
    before_upload (file) {
      console.log(file)
      return true
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
  },
  mounted () {
    const requireAll = requireContext => requireContext.keys().map(requireContext)
    requireAll(Codes)
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
