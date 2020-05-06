<template>
  <div class="ii-maintain-table">
    <div class="ii-table-result" v-if="!hiddeResutTag">result:{{recordCount}}</div>
    <ii-table @current-change="changeCurrentRow" @row-click="handleRowClick" ref="table" empty-text=" " class="virtualTable" v-loading="loading" :fit="true" :data="pageData" @sort-change="handleSortChange" v-if="dataReady" :height="tableHeight" highlight-current-row stripe :border="true">
      <ii-table-column v-for="column in searchItem"
        :key="'tableColumn' + column.value"
        :label="getColumnLabel(column.label)"
        :prop="column.value"
        :show-overflow-tooltip="true"
        sortable
        :resizable="true"
        :min-width="column.width">
        <template slot-scope="scope">
            <span>{{  column.formater ? column.formater(scope.row) : getColumnValue(column.value, scope.row)}}</span>
        </template>
      </ii-table-column>
      <ii-table-column
        v-if="!hideRecordFixInfo"
        prop="editor.name"
        :label='$t("basic.editorName")'
        min-width="120"
        sortable>
      </ii-table-column>
      <!-- <ii-table-column
        v-if="!hideRecordFixInfo"
        prop="updateTime"
        :label='$t("basic.updateTime")'
        sortable
        min-width="150">
        <template slot-scope="scope">
          <span>{{scope.row.update_time | dateFormat}}</span>
        </template>
      </ii-table-column> -->
      <ii-table-column class-name="row-handler-group" fixed="right" v-if="!onlyView && !custButtonGroup" :label='rowButtonGroupLabel || $t("basic.btnGroupInRow")' :width="rowButtonGroupWidth || 95">
        <template slot-scope="scope">
          <slot name="rowHandlerFirst" v-bind:row="scope.row"></slot>
          <ii-button size="small" @click="handleEdit(scope.$index, scope.row)" :disabled="editfunc(scope.row)"><ii-svg-icon :name="'btnicon/edit'"/></ii-button>
          <slot name="rowHandlerMiddle" v-bind:row="scope.row"></slot>
          <ii-button v-if="!hidedeletebtn" size="small" @click="customizedelete ? customizedelete(scope.$index, scope.row): handleDelete(scope.$index, scope.row)" :disabled="deletefunc(scope.row)"><ii-svg-icon :name="'btnicon/delete'"/></ii-button>
          <slot name="rowHandlerLast" v-bind:row="scope.row"></slot>
        </template>
      </ii-table-column>
      <ii-table-column class-name="cust-button-group" fixed="right" v-if="custButtonGroup" :label='rowButtonGroupLabel' :width="rowButtonGroupWidth || 95">
        <template slot-scope="scope">
          <slot name="custButtonGroup" v-bind:row="scope.row"></slot>
        </template>
      </ii-table-column>
      <div class="append" slot="append" style="text-align: center"></div>
    </ii-table>
    <ii-edit-form ref="editForm" v-if="!onlyView" :top="dialogtop" :entity="entity" :formDefine="formDefine" @haveSaved="$emit('dataUpdated')"></ii-edit-form>
  </div>
</template>

<script>
import XLSX from 'xlsx'
import _ from 'lodash'
import IiEditForm from './edit-form.vue'
import VirtualTable from './virtual-table.mixin.js'
import IiSvgIcon from '../..//svg-icon'
import moment from 'moment'
export default {
  name: 'IiMaintainTable',
  components: {
    IiEditForm,
    IiSvgIcon
  },
  mixins: [VirtualTable],
  props: {
    dialogtop: Number,
    entity: String,
    cascades: Array,
    searchItem: Array,
    formDefine: Object,
    rowButtonGroupWidth: Number,
    rowButtonGroupLabel: String,
    fixTableHeight: [Number, String],
    onlyView: Boolean,
    custButtonGroup: Boolean,
    hiddeResutTag: Boolean,
    hidedeletebtn: {
      type: Boolean,
      default: false
    },
    hideRecordFixInfo: Boolean,
    customizedelete: Function
  },
  data () {
    return {
      dataReady: false,
      loading: false,
      currentRow: undefined,
      exportdata: [],
      deletefunc: this.formDefine.deletefunc ? this.formDefine.deletefunc : () => { return false },
      editfunc: this.formDefine.editfunc ? this.formDefine.editfunc : () => { return false }
    }
  },
  methods: {
    cleardata () {
      this.pageData = []
      this.tableData = []
    },
    Exportdata () {
      let _this = this
      // modify ITC-1744-0142
      if (this.tableData && this.tableData.length > 0) {
        this.exportdata = []
        let columndata = []
        this.searchItem.forEach(column => {
          columndata.push(this.getColumnLabel(column.label))
        })
        columndata.push('编辑人')
        columndata.push('编辑时间')
        this.exportdata.push(columndata)
        let rowdata = []
        this.tableData.forEach(row => {
          rowdata = []
          this.searchItem.forEach(column => {
            rowdata.push(column.formater ? column.formater(row) : this.getColumnValue(column.value, row))
          })
          rowdata.push(row.editor_id)
          rowdata.push(moment(row.update_time).format('YYYY-MM-DD HH:mm:ss'))
          this.exportdata.push(rowdata)
        })
        const ws = XLSX.utils.aoa_to_sheet(_this.exportdata)
        const wb = XLSX.utils.book_new()
        XLSX.utils.book_append_sheet(wb, ws)
        XLSX.writeFile(wb, 'default' + '(' + moment().format() + ')' + '.xlsx')
      } else {
        this.$ii_message('warn', _this.$t('workorder.no_current_workorder_data_can_not_be_exported'))
      }
    },
    openEditDialog () {
      this.$refs.editForm.open()
    },
    handleEdit (rowIndex, data) {
      this.$refs.editForm.open(data)
    },
    handleRowClick (row, column, event) {
      this.$emit('row-click', row)
    },
    async handleDelete (rowIndex, data) {
      let _this = this
      console.log(data)
      // 确认操作
      await this.$ii_message('confirm', this.$t('confirmMsg.deletemsg'))
      try {
        await _this.$maintain_service_agent(_this.entity, 'deleteById/' + data.id + '/' + (this.$session.get('loginstate') && this.$session.get('loginstate').user && this.$session.get('loginstate').user.code ? this.$session.get('loginstate').user.code : '9999'), 'delete', {})
        _this.$emit('dataUpdated', 'delete')
      } catch (error) {
        // modify ITC-1744-0140
        this.$ii_message('error', error)
        console.log(error)
      }
    },
    getColumnLabel (column) {
      if (column.indexOf('.') >= 0) {
        // let [entityName, propName] = column.split('.')
        return this.$t(column)
      } else {
        return this.$t(this.entity + '.' + column)
      }
    },
    findEntityPath (cascades, entity, parentEntity) {
      let result = _.find(cascades, {entity: entity})
      if (result) {
        return parentEntity ? parentEntity + '.' + result.entity : result.entity
      } else {
        let resultInner = null
        _.each(cascades, (cascade, index) => {
          resultInner = this.findEntityPath(cascade.cascades, entity, cascade.entity)
          if (resultInner) {
            return false
          }
        })
        if (resultInner) {
          return parentEntity ? parentEntity + '.' + resultInner : resultInner
        } else {
          return null
        }
      }
    },
    getColumnValue (column, rowData) {
      if (column.indexOf('.') >= 0) {
        let [entityName, propName] = column.split('.')
        let result = rowData
        let entityPath = this.findEntityPath(this.cascades, entityName)
        if (!entityPath) {
          console.log('this.cascades=' + JSON.stringify(this.cascades) + '; entityName=' + entityName)
        }
        let entityPathArray = entityPath.split('.')
        _.each(entityPathArray, (key, index) => {
          if (!result || result === null || result === 'null') {
            return
          }
          result = result[key]
        })
        result = result ? result[propName] : ''
        return result
      } else {
        return rowData[column]
      }
    },
    changeCurrentRow (currentRow, oldCurrentRow) {
      this.currentRow = currentRow
    },
    getCurrentRow () {
      return this.currentRow
    },
    recreateFormLayout () {
      this.$refs.editForm.recreateLayout()
    }
  },
  async mounted () {
    this.dataReady = true
    if (this.fixTableHeight) {
      this.tableHeight = this.fixTableHeight
    } else {
      // this.$nextTick(() => {
      //   this.caculateTableHeight(this)
      // })
    }
  },
  watch: {
  }
}
</script>

<!-- Add "scoped" attribute to limit CSS to this component only -->
<style scoped>
</style>
