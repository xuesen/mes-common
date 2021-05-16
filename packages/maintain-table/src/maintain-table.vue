<template>
  <div class="ii-maintain-table">
    <div class="ii-table-result" v-if="!hiddeResutTag">result:{{recordCount}}</div>
    <ii-table
      @current-change="change_current_row"
      @selection-change="handle_selection_change"
      @row-click="handle_row_click" ref="maintainTable"
      empty-text=" "
      class="virtualTable"
      :row-class-name="rowClassName"
      v-loading="loading"
      :fit="true"
      :data="pageData"
      @sort-change="handleSortChange"
      v-if="dataReady"
      :height="tableHeight"
      :row-key="rowKey"
      highlight-current-row
      stripe
      :border="true">
      <ii-table-column
        v-if="showSelection"
        type="selection"
        :reserve-selection="true"
        width="70">
      </ii-table-column>
      <ii-table-column
        v-if="showIndex"
        :key="'tableColumnxuhao'"
        :label="$t('table.xuhao')"
        prop="index"
        width="80">
      </ii-table-column>
      <ii-table-column v-for="column in tableColumn"
        :key="'tableColumn' + column.value"
        :label="$t(column.title)"
        :prop="column.value"
        :show-overflow-tooltip="true"
        :sortable="sortable ? 'custom' : false"
        :resizable="true"
        :min-width="column.width">
        <template slot-scope="scope">
          <ColumnContent v-if="column.formater" :formater="column.formater" :row-data="scope.row"></ColumnContent>
          <span v-else>{{ get_column_value(column.value, scope.row) }}</span>
        </template>
      </ii-table-column>
      <ii-table-column
        v-if="!hideRecordFixInfo"
        prop="editor.name"
        :label='$t("table.editor_name")'
        min-width="120"
        :sortable="sortable ? 'custom' : false">
      </ii-table-column>
      <ii-table-column
        v-if="!hideRecordFixInfo"
        prop="update_time"
        :label='$t("table.update_time")'
        :sortable="sortable ? 'custom' : false"
        min-width="150">
        <template slot-scope="scope">
          <span>{{scope.row.update_time | date}}</span>
        </template>
      </ii-table-column>
      <ii-table-column class-name="row-handler-group" fixed="right" v-if="!onlyView && !custButtonGroup" :label='rowButtonGroupLabel || $t("table.btn_group_in_row")' :width="rowButtonGroupWidth || 95">
        <template slot-scope="scope">
          <slot name="row-handler-first" v-bind:row="scope.row"></slot>
          <ii-button v-if="!hideEditBtn" size="small" @click="handle_edit(scope.$index, scope.row)" :disabled="disableEdit ? disableEdit(scope.row) : false"><ii-svg-icon :name="'btnicon/edit'"/></ii-button>
          <slot name="row-handler-middle" v-bind:row="scope.row"></slot>
          <ii-button v-if="!hideDeleteBtn" size="small" @click="customizeDelete ? customizeDelete(scope.$index, scope.row): handle_delete(scope.$index, scope.row)" :disabled="disableDelete ? disableDelete(scope.row) : false"><ii-svg-icon :name="'btnicon/delete'"/></ii-button>
          <slot name="row-handler-last" v-bind:row="scope.row"></slot>
        </template>
      </ii-table-column>
      <ii-table-column class-name="cust-button-group" fixed="right" v-if="custButtonGroup" :label='rowButtonGroupLabel' :width="rowButtonGroupWidth || 95">
        <template slot-scope="scope">
          <slot name="cust-button-group" v-bind:row="scope.row"></slot>
        </template>
      </ii-table-column>
      <div class="append" slot="append" style="text-align: center"></div>
    </ii-table>
    <ii-edit-form ref="editForm" v-if="!onlyView || forcedShowButtonGroup" :top="dialogtop" :formDefine="formDefine" @haveSaved="have_saved">
      <!-- <template v-for="row in formDefine">
        <template v-for="item in row" v-if="item.control === 'slot'" v-slot:[item.model]="form">
          <slot :name="item.model" v-bind:form="form"></slot>
        </template>
      </template> -->
      <template v-for="_slot in slots" v-slot:[_slot]="form">
        <slot :name="_slot" v-bind:form="form.form"></slot>
      </template>
    </ii-edit-form>
  </div>
</template>

<script>
import XLSX from 'xlsx'
import _ from 'lodash'
import IiEditForm from './edit-form.vue'
import VirtualTable from './virtual-table.mixin.js'
import moment from 'moment'
import Vue from 'vue'
let ColumnContentComponent = Vue.extend({
  props: {
    formater: Function,
    rowData: Object
  },
  render (h) {
    return this.formater(this.rowData)
  }
})
export default {
  name: 'IiMaintainTable',
  components: {
    IiEditForm,
    ColumnContent: ColumnContentComponent
  },
  mixins: [VirtualTable],
  props: {
    sortable: {
      type: Boolean,
      default: true
    },
    dialogtop: Number,
    tableColumn: Array,
    showIndex: {
      type: Boolean,
      default: false
    },
    showSelection: {
      type: Boolean,
      default: false
    },
    rowKey: {
      tpe: String,
      default: 'id'
    },
    deleteDataApi: Object,
    formDefine: Object,
    rowButtonGroupWidth: Number,
    rowButtonGroupLabel: String,
    fixTableHeight: [Number, String],
    onlyView: Boolean,
    forcedShowButtonGroup: {
      type: Boolean,
      default: false
    },
    custButtonGroup: Boolean,
    hiddeResutTag: Boolean,
    hideEditBtn: {
      type: Boolean,
      default: false
    },
    hideDeleteBtn: {
      type: Boolean,
      default: false
    },
    hideRecordFixInfo: Boolean,
    customizeDelete: Function,
    titleHeight: {
      type: Number,
      default: 40
    },
    rowHeight: {
      type: Number,
      default: 31
    },
    disableEdit: Function,
    disableDelete: Function,
    rowClassName: Function
  },
  data () {
    return {
      dataReady: false,
      loading: false,
      currentRow: undefined,
      export_data: [],
      deletefunc: this.formDefine.deletefunc ? this.formDefine.deletefunc : () => { return false },
      editfunc: this.formDefine.editfunc ? this.formDefine.editfunc : () => { return false }
    }
  },
  computed: {
    slots () {
      let _slots = []
      _.forEach(this.formDefine.prop, function (row) {
        _.forEach(row, function (form_item) {
          if (form_item.control === 'slot') {
            _slots.push(form_item.model)
          }
        })
      })
      return _slots
    }
  },
  methods: {
    clear_data () {
      this.pageData = []
      this.table_data = []
    },
    handle_export_data () {
      let _this = this
      // modify ITC-1744-0142
      if (this.table_data && this.table_data.length > 0) {
        this.export_data = []
        let columndata = []
        this.tableColumn.forEach(column => {
          columndata.push(this.$t(column.title))
        })
        if (!this.hideRecordFixInfo) {
          columndata.push('编辑人')
          columndata.push('编辑时间')
        }
        this.export_data.push(columndata)
        let rowdata = []
        this.table_data.forEach(row => {
          rowdata = []
          this.tableColumn.forEach(column => {
            let has_formater = column.formater
            let new_coulnm_content
            if (has_formater) {
              let new_coulnm_content_comp = new ColumnContentComponent()
              new_coulnm_content_comp.rowData = row
              new_coulnm_content_comp.formater = column.formater
              new_coulnm_content = new_coulnm_content_comp.$mount().$el.innerText
            } else {
              new_coulnm_content = this.get_column_value(column.value, row)
            }
            rowdata.push(new_coulnm_content)
          })
          if (!this.hideRecordFixInfo) {
            rowdata.push(row.editor.name)
            rowdata.push(moment(row.update_time).format('YYYY-MM-DD HH:mm:ss')) 
          }
          this.export_data.push(rowdata)
        })
        const ws = XLSX.utils.aoa_to_sheet(_this.export_data)
        const wb = XLSX.utils.book_new()
        XLSX.utils.book_append_sheet(wb, ws)
        XLSX.writeFile(wb, this.$route.name + '(' + moment().format('YYYY-MM-DD HH:mm:ss') + ')' + '.xlsx')
      } else {
        this.$ii_message('warn', _this.$t('workorder.no_current_workorder_data_can_not_be_exported'))
      }
    },
    open_edit_dialog () {
      this.$refs.editForm.open()
    },
    handle_edit (rowIndex, data) {
      this.$refs.editForm.open(data)
    },
    have_saved (new_data) {
      this.$emit('dataUpdated', new_data)
    },
    set_current_row (row) {
      this.$refs.maintainTable.setCurrentRow(row)
    },
    handle_row_click (row, column, event) {
      this.hightlight_key = row
      if (column.className === 'row-handler-group' || column.className === 'cust-button-group') {
        return
      }
      this.$emit('row-click', row)
    },
    async handle_delete (rowIndex, data) {
      let _this = this
      console.log(data)
      // 确认操作
      await this.$ii_message('confirm', this.$t('msg.confirm.delete_msg'))
      try {
        let editor = this.$session.get('loginstate') && this.$session.get('loginstate').user && this.$session.get('loginstate').user.code ? this.$session.get('loginstate').user.code : '9999'
        await _this.$axios(_this.deleteDataApi.api_path + data[this.formDefine.primary_column] + '?editor=' + editor, _this.deleteDataApi.req_type, {})
        _this.$emit('dataUpdated', 'delete')
      } catch (error) {
        // modify ITC-1744-0140
        this.$ii_message('error', error)
        console.log(error)
      }
    },
    get_column_value (column, rowData) {
      if (column.indexOf('.') >= 0) {
        let result = rowData
        let value_path = column.split('.')
        _.each(value_path, (key, index) => {
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
    change_current_row (currentRow, oldCurrentRow) {
      this.currentRow = currentRow
    },
    get_current_row () {
      return this.currentRow
    },
    async recreate_form_layout () {
      await this.$refs.editForm.recreateLayout()
    },
    handle_selection_change (selection) {
      this.$emit('selection-change', selection)
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
    '$i18n.locale' () {
      this.recreate_form_layout()
    }
  }
}
</script>

<!-- Add "scoped" attribute to limit CSS to this component only -->
<style scoped>
</style>
