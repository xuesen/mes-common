<template>
  <el-dialog class="genery" :modal="false" :visible.sync="show" @closed="closediag()" :close-on-click-modal="false" :width="width" :title="$t(tableDefine.i18n + '.' + 'title')">
    <div class="filters">
      <el-form ref='queryForm'>
          <el-row style="margin-top:5px;">
            <el-col :span="8">
              <el-form-item>
                <el-select v-model="queryForm.condition">
                  <el-option
                    v-for="item in filteroptions"
                    :key="item.columnname"
                    :label="getColumnlable(item.columnname)"
                    :value="item.columnname">
                  </el-option>
                </el-select>
              </el-form-item>
            </el-col>
            <el-col :span="8" style="padding-left: 16px;">
              <el-form-item>
                <el-input clearable autosize v-model="queryForm.value" @keyup.enter.native="filterdata"></el-input>
              </el-form-item>
            </el-col>
            <el-col :span="8" class="filter_button">
              <el-button type="primary" @click="filterdata" >{{$t("button.search")}}</el-button>
            </el-col>
          </el-row>
      </el-form>
    </div>
    <el-table
      ref="Table"
      :data="tableData"
      @row-click="rowclick"
      stripe
      :border="true"
      highlight-current-row
      :height="tableHeight"
      v-loading="loading"
      :fit="true"
      style="width: 100%">
      <el-table-column v-for="column in tableDefine.columnset"
        :key="'tableColumn' + column.columnname"
        :label="getColumnlable(column.columnname)"
        :prop="column.columnname"
        :show-overflow-tooltip="true"
        sortable
        :resizable="true"
        :min-width="column.width">
        <template slot-scope="scope">
            <span>{{  column.formater ? column.formater(scope.row) : getColumnValue(column.columnname, scope.row)}}</span>
        </template>
      </el-table-column>
      </el-table>
    <span slot="footer" class="dialog-footer">
      <el-button type="text" @click="handleSave()">{{$t('button.confirm')}}</el-button>
    </span>
  </el-dialog>
</template>

<style lang="scss" scoped>
@import '../../styles/variables.scss';
.genery {
  /deep/ .el-dialog .el-dialog__title{
    font-size:$fontSize2;
    @media #{$media} and ($feature: $value){
      font-size: $smallfontsize1;
    }
  }
}
.filters {
  .el-form-item {
    margin-bottom: 47px;
    @media #{$media} and ($feature: $value) {
      margin-bottom: $smallfontsize1;
    }
  }
  .filter_button {
    text-align: right;
    line-height: 40px;
  }
}
/deep/ .el-select .el-input .el-select__caret {
  @media #{$media} and ($feature: $value) {
    line-height: 40px;
  }
}
</style>

<script>
import _ from 'lodash'
import axios from 'axios'
let alldata = []
export default {
  name: 'IiFilter',
  props: {
    top: {
      type: [String, Number],
      default: '15%'
    },
    width: {
      type: String,
      default: '100%'
    },
    tableHeight: {
      type: String,
      default: '300px'
    },
    tableDefine: Object
  },
  data () {
    return {
      queryForm: {
        condition: null,
        value: null
      },
      tableData: [],
      show: false,
      currentrow: null,
      loading: false
    }
  },
  methods: {
    closediag () {
      this.$refs.Table.setCurrentRow()
      this.initdata()
    },
    rowclick (row, column, event) {
      this.currentrow = row
    },
    async open () {
      this.show = true
      await this.refresh()
      this.filterdata()
    },
    handleCancel () {
      this.show = false
    },
    handleSave () {
      if (!this.currentrow) {
        this.$defmsgbox('error', this.$t('msg.selectRow'))
        return
      }
      this.$emit('getrowdata', this.currentrow)
      this.show = false
    },
    filterdata () {
      this.loading = true
      if (alldata.length > 0 && this.queryForm.condition && this.queryForm.value) {
        this.tableData = _.filter(alldata, (o) => {
          let temp = _.cloneDeep(o)
          if (this.queryForm.condition.indexOf('.') >= 0) {
            let pathArray = this.queryForm.condition.split('.')
            _.each(pathArray, (key, index) => {
              if (!temp || temp === null || temp === 'null') {
                return
              }
              temp = temp[key]
            })
            return String(temp).indexOf(String(this.queryForm.value)) > -1
          } else {
            return String(o[this.queryForm.condition]).indexOf(String(this.queryForm.value)) > -1
          }
        })
      } else if (alldata.length > 0) {
        this.tableData = alldata
      }
      this.loading = false
    },
    getColumnlable (value) {
      return this.$t(this.tableDefine.i18n + '.' + value)
    },
    // getColumnValue (key, rowdata) {
    //   if (_.has(rowdata, key)) return rowdata[key]
    // },
    getColumnValue (column, rowData) {
      if (column.indexOf('.') >= 0) {
        let result = rowData
        let pathArray = column.split('.')
        _.each(pathArray, (key, index) => {
          if (!result || result === null || result === 'null') {
            return
          }
          result = result[key]
        })
        return result
      } else {
        return rowData[column]
      }
    },
    initdata () {
      this.currentrow = null
      this.tableData = []
      // alldata = []
      this.queryForm.condition = null
      this.queryForm.value = null
      this.loading = false
    },
    async refresh () {
      let _this = this
      if (!Reflect.has(this.tableDefine, 'anotherData')) {
        let result = await axios[this.tableDefine.requesturl.type](this.tableDefine.requesturl.api, this.tableDefine.requesturl.type.toUpperCase() === 'GET' ? {params: this.tableDefine.requesturl.params} : this.tableDefine.requesturl.params)
        if (result.data && result.data.errMsg) {
          this.$defmsgbox('error', result.data.errMsg)
          return false
        }
        if (result.data && !result.data.errMsg) {
          alldata = String(result.data.result).toLowerCase() === 'ok' ? result.data.data : result.data
          _this.filterdata()
        }
      } else {
        alldata = _this.tableDefine['anotherData']
        _this.filterdata()
      }
    }
  },
  async mounted () {
    // 获取数据
    await this.refresh()
  },
  computed: {
    // 下拉选项的获取
    filteroptions: function () {
      return _.filter(this.tableDefine.columnset, function (o) { return _.has(o, 'isfilter') && o['isfilter'] })
    }
  }
}
</script>
