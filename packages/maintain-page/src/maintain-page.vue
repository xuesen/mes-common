<template>
<ii-container direction="vertical" class="ii-maitain-page">
    <ii-header :height="headerHeight">
    <div class="ii-table-top">
      <ii-row>
        <ii-col :span="4" v-if="!onlyView && (!hideAdd || !hideExport || showImport) || forcedShowButtonGroup">
          <ii-button-group>
            <ii-tooltip class="item" effect="dark" :content='$t("button.add")' placement="top" v-if="!hideAdd">
              <ii-button @click="handle_add()"><ii-svg-icon :name="'btnicon/add'" width="24" height="24"/></ii-button>
            </ii-tooltip>
            <ii-tooltip class="item" effect="dark" :content='$t("button.export")' placement="top" v-if="!hideExport">
              <ii-button @click="handle_export()"><ii-svg-icon :name="'btnicon/export'" width="24" height="24"/></ii-button>
            </ii-tooltip>
            <ii-tooltip class="item" effect="dark" :content='$t("button.import")' placement="top" v-if="showImport">
              <ii-import-excel v-on:importSuccess="refresh_data" :import-action="importAction" :import-param="importParam"></ii-import-excel>
            </ii-tooltip>
          </ii-button-group>
        </ii-col>
        <ii-col :span="3" v-if="!hideSearch">
          <ii-select-org v-model="search_key" :placeholder='$t("placeholder.select")'>
            <ii-option-org
              v-for="item in search_keys"
              :key="'searchselectoption' + item.value"
              :label="$t(item.title)"
              :value="item.value">
            </ii-option-org>
          </ii-select-org>
        </ii-col>
        <ii-col :span="3" style="margin-left: 16px;" v-if="!hideSearch">
          <ii-input
            :placeholder="$t('placeholder.input')"
            v-model="search_value"
            @keyup.enter.native="refresh_data()"></ii-input>
        </ii-col>
        <ii-col :span="2" v-if="!hideSearch" class="search">
          <ii-tooltip class="item" effect="dark" :content='$t("button.search")' placement="top-start">
             <ii-button><ii-svg-icon :name="'btnicon/search'" width="24" height="24" @click.native="datamaintain_serach"/></ii-button>
          </ii-tooltip>
        </ii-col>
      </ii-row>
    </div>
    </ii-header>
    <ii-main>
      <ii-maintain-table
        ref="maintainTable"
        v-loading="loading"
        :show-selection="showSelection"
        :sortable="tableSortable"
        :fixTableHeight="fixTableHeight"
        :delete-data-api="deleteDataApi"
        :table-column="tableColumn"
        :form-define="formDefine"
        :row-button-group-label="rowButtonGroupLabel"
        :row-button-group-width="rowButtonGroupWidth"
        :dialogtop="maintaintop"
        :hide-edit-btn="hideEditBtn"
        :hide-delete-btn="hideDeleteBtn"
        :row-height="tableRowHeight"
        v-on:row-click="maintain_row_click"
        :only-view="onlyView"
        :forced-show-button-group="forcedShowButtonGroup"
        :hide-record-fix-info="hideRecordFixInfo"
        :disable-edit="disableEdit"
        :disable-delete="disableDelete"
        :virtual-mix-forbidden="virtualMixForbidden"
        @dataUpdated="data_updated">
        <template v-slot:row-handler-first="row">
          <slot name="row-handler-first" v-bind:row="row"></slot>
        </template>
        <template v-slot:row-handler-middle="row">
          <slot name="row-handler-middle" v-bind:row="row"></slot>
        </template>
        <template v-slot:row-handler-last="row">
          <slot name="row-handler-last" v-bind:row="row"></slot>
        </template>
        <template v-for="_slot in slots" v-slot:[_slot]="form">
          <slot :name="_slot" v-bind:form="form.form"></slot>
        </template>
      </ii-maintain-table>
    </ii-main>
  </ii-container>
</template>

<script>
import _ from 'lodash'
import IiMaintainTable from '../../maintain-table'
import IiImportExcel from '../../import-excel'
export default {
  name: 'IiMaintainPage',
  components: {
    IiMaintainTable,
    IiImportExcel
  },
  props: {
    initRefreshData: {
      type: Number,
      default: false
    },
    tableSortable: {
      type: Boolean,
      default: true
    },
    maintaintop: {
      type: Number,
      default: 0
    },
    showSelection: {
      type: Boolean,
      default: false
    },
    rowKey: {
      tpe: String,
      default: 'id'
    },
    fetchDataApi: Object,
    deleteDataApi: Object,
    tableColumn: Array,
    formDefine: Object,
    hideSearch: Boolean,
    hideAdd: Boolean,
    hideExport: Boolean,
    showImport: {
      type: Boolean,
      default: false
    },
    importAction: String,
    importParam: Object,
    fixTableHeight: [Number, String],
    rowButtonGroupLabel: String,
    rowButtonGroupWidth: [Number, String],
    hideEditBtn: {
      type: Boolean,
      default: false
    },
    hideDeleteBtn: {
      type: Boolean,
      default: false
    },
    onlyView: Boolean,
    forcedShowButtonGroup: {
      type: Boolean,
      default: false
    },
    hideRecordFixInfo: Boolean,
    tableRowHeight: {
      type: Number,
      default: 31
    },
    disableEdit: Function,
    disableDelete: Function,
    virtualMixForbidden: {
      type: Boolean,
      default: false
    }
  },
  data () {
    return {
      headerHeight: '50px',
      search_keys: _.filter(this.tableColumn, 'filter_params'),
      search_key: this.tableColumn[0].value,
      search_value: '',
      dataReady: false,
      loading: false,
      recordCount: 0
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
    // 确认当前操作是查询
    datamaintain_serach () {
      this.$refs.maintainTable.hightlight_key = null
      this.$emit('filterdata')
      this.refresh_data()
    },
    maintain_row_click (row) {
      this.$emit('dataMaintainRowclick', row)
    },
    handle_export () {
      this.$refs.maintainTable.handle_export_data()
    },
    handle_add () {
      this.$refs.maintainTable.open_edit_dialog()
    },
    // actiontype:下层的触发源
    async data_updated (actiontype) {
      this.$emit('dataUpdated', actiontype)
      await this.refresh_data(actiontype !== 'delete' ? actiontype : '')
    },
    async reinit () {
      this.search_value = ''
      this.refresh_data()
    },
    async refresh_data (new_data) {
      this.loading = true
      let result = null

      // modify  ITC-1744-0143
      let searchval = this.search_value
      let reg = new RegExp('%', 'g') // g代表全部
      if (searchval.indexOf('%') >= 0) {
        searchval = searchval.replace(reg, '\\%')
      }
      let _reg = new RegExp('_', 'g') // g代表全部
      if (searchval.indexOf('_') >= 0) {
        searchval = searchval.replace(_reg, '\\_')
      }
      let search_column = _.find(this.tableColumn, {value: this.search_key})
      let filter_is_function = _.isFunction(search_column.filter_params)
      let search_params = _.cloneDeep(search_column.filter_params)
      let search_condition = filter_is_function ? search_column.filter_params(this.search_value) : JSON.parse(_.replace(JSON.stringify(search_params), '_xxx_', this.search_value))
      try {
        if (search_column.fetch_data_api) {
          result = await this.$axios(search_column.fetch_data_api.api_path, search_column.fetch_data_api.req_type, search_condition)
        } else {
          result = await this.$axios(this.fetchDataApi.api_path, this.fetchDataApi.req_type, search_condition)
        }
      } catch (e) {
      } finally {
        this.loading = false
      }
      let hightlight_key
      if (new_data) {
        hightlight_key = {}
        hightlight_key[this.formDefine.primary_column] = new_data[this.formDefine.primary_column]
      }
      this.$refs.maintainTable.refresh_table_data(result.data, hightlight_key)
    },
    get_table_hightlight_row () {
      return this.$refs.maintainTable.get_current_row()
    },
    async recreate_form_layout () {
      await this.$refs.maintainTable.recreate_form_layout()
    }
  },
  async mounted () {
    this.dataReady = true
    if (this.initRefreshData) {
      this.$nextTick(() => {
        this.refresh_data()
      })
    }
  }
}
</script>

<style scoped>
</style>
