<template>
<ii-container direction="vertical" class="ii-maitain-page">
    <ii-header :height="headerHeight">
    <div class="ii-table-top">
      <ii-row>
        <ii-col :span="4" v-if="!hideAdd || !hideExport || showImport">
          <ii-button-group>
            <ii-tooltip class="item" effect="dark" :content='$t("button.add")' placement="top" v-if="!hideAdd">
              <ii-button @click="handleAdd()"><ii-svg-icon :name="'btnicon/add'" width="24" height="24"/></ii-button>
            </ii-tooltip>
            <ii-tooltip class="item" effect="dark" :content='$t("button.export")' placement="top" v-if="!hideExport">
              <ii-button @click="handleExport()"><ii-svg-icon :name="'btnicon/export'" width="24" height="24"/></ii-button>
            </ii-tooltip>
            <ii-tooltip class="item" effect="dark" :content='$t("button.import")' placement="top" v-if="showImport">
              <ii-import-excel v-on:importSuccess="refreshData" :entity="entity" :uploadAction="uploadAction"></ii-import-excel>
            </ii-tooltip>
          </ii-button-group>
        </ii-col>
        <ii-col :span="3" v-if="!hideSearch">
          <ii-select-org v-model="searchKey" :placeholder='$t("basic.selectPlaceholder")'>
            <ii-option-org
              v-for="item in searchItem"
              :key="'searchselectoption' + item.value"
              :label="getColumnLabel(item.label)"
              :value="item.value">
            </ii-option-org>
          </ii-select-org>
        </ii-col>
        <ii-col :span="3" style="margin-left: 16px;" v-if="!hideSearch">
          <ii-input
            :placeholder="$t('placeholder.inputKeyWord')"
            v-model="searchValue"
            @keyup.enter.native="refreshData()"></ii-input>
        </ii-col>
        <ii-col :span="2" v-if="!hideSearch" class="search">
          <ii-tooltip class="item" effect="dark" :content='$t("button.search")' placement="top-start">
             <ii-button><ii-svg-icon :name="'btnicon/search'" width="24" height="24" @click.native="datamaintainserach"/></ii-button>
          </ii-tooltip>
        </ii-col>
      </ii-row>
    </div>
    </ii-header>
    <ii-main>
      <ii-maintain-table
        ref="maintainTable"
        :fixTableHeight="fixTableHeight"
        :entity="entity"
        :cascades="cascades"
        :searchItem="searchItem"
        :formDefine="formDefine"
        :rowButtonGroupLabel="rowButtonGroupLabel"
        :rowButtonGroupWidth="rowButtonGroupWidth"
        :dialogtop="maintaintop"
        :hidedeletebtn="hidedeletebtn"
        v-on:row-click="maintainrowclick"
        @dataUpdated="dataupdated">
        <template v-slot:rowHandlerLast="row">
          <slot name="rowHandlerFirst" v-bind:row="row"></slot>
        </template>
        <template v-slot:rowHandlerMiddle="row">
          <slot name="rowHandlerMiddle" v-bind:row="row"></slot>
        </template>
        <template v-slot:rowHandlerLast="row">
          <slot name="rowHandlerLast" v-bind:row="row"></slot>
        </template>
      </ii-maintain-table>
    </ii-main>
  </ii-container>
</template>

<script>
import _ from 'lodash'
import IiMaintainTable from '../../maintain-table'
import IiImportExcel from '../..//import-excel'
import IiSvgIcon from '../..//svg-icon'
export default {
  name: 'IiMaintainPage',
  components: {
    IiMaintainTable,
    IiImportExcel,
    IiSvgIcon
  },
  props: {
    maintaintop: {
      type: Number,
      default: 0
    },
    entity: String,
    cascades: Array,
    orderby: Array,
    searchItem: Array,
    formDefine: Object,
    hideSearch: Boolean,
    hideAdd: Boolean,
    hideExport: Boolean,
    showImport: {
      type: Boolean,
      default: false
    },
    fixTableHeight: [Number, String],
    rowButtonGroupLabel: String,
    rowButtonGroupWidth: [Number, String],
    hidedeletebtn: {
      type: Boolean,
      default: false
    }
  },
  data () {
    return {
      headerHeight: '50px',
      searchKey: this.searchItem[0].value,
      searchValue: '',
      dataReady: false,
      loading: false,
      recordCount: 0,
      uploadAction: 'dataimportservice/'
    }
  },
  methods: {
    // 确认当前操作是查询
    datamaintainserach () {
      this.$emit('filterdata')
      this.refreshData()
    },
    maintainrowclick (row) {
      this.$emit('dataMaintainRowclick', row)
    },
    handleExport () {
      this.$refs.maintainTable.Exportdata()
    },
    handleAdd () {
      this.$refs.maintainTable.openEditDialog()
    },
    findJoinCondition (cascades, entity) {
      let result = _.find(cascades, { entity: entity })
      if (result) {
        return result
      } else {
        let resultInner = null
        _.each(cascades, (cascade) => {
          resultInner = this.findJoinCondition(cascade.cascades, entity)
          if (resultInner) {
            return false
          }
        })
        if (resultInner) {
          return resultInner
        } else {
          return null
        }
      }
    },
    // actiontype:下层的触发源
    async dataupdated (actiontype) {
      this.$emit('dataUpdated', actiontype)
      await this.refreshData()
    },
    async refreshData () {
      this.loading = true
      let result = null
      let searchCondition = this.cascades ? { cascades: _.cloneDeep(this.cascades) } : {}
      if (this.orderby) {
        searchCondition.orderby = this.orderby
      } else {
        searchCondition.orderby = [['code', 'ASC']]
      }
      if (this.searchValue) {
        // modify  ITC-1744-0143
        let searchval = this.searchValue
        let reg = new RegExp('%', 'g') // g代表全部
        if (searchval.indexOf('%') >= 0) {
          searchval = searchval.replace(reg, '\\%')
        }
        let _reg = new RegExp('_', 'g') // g代表全部
        if (searchval.indexOf('_') >= 0) {
          searchval = searchval.replace(_reg, '\\_')
        }
        if (this.searchKey.indexOf('.') >= 0) {
          let [entityName, propName] = this.searchKey.split('.')
          let joinCondition = this.findJoinCondition(searchCondition.cascades, entityName)
          if (!joinCondition) {
            this.$message({
              message: 'config error',
              type: 'error'
            })
          }
          joinCondition.condition = {}
          joinCondition.condition[propName] = searchval
        } else {
          searchCondition[this.searchKey] = searchval
        }
        result = await this.$maintain_service_agent(this.entity, 'findEnabledWhereLike', 'post', searchCondition)
      } else {
        result = await this.$maintain_service_agent(this.entity, 'findEnabled', 'post', searchCondition)
      }
      this.loading = false
      this.$refs.maintainTable.refreshTableData(result.data)
    },
    getColumnLabel (column) {
      if (column.indexOf('.') >= 0) {
        let [entityName, propName] = column.split('.')
        return this.$t(entityName + '.' + propName)
      } else {
        return this.$t(this.entity + '.' + column)
      }
    },
    getTableHightlightRow () {
      return this.$refs.maintainTable.getCurrentRow()
    },
    recreateFormLayout () {
      this.$refs.maintainTable.recreateFormLayout()
    }
  },
  async mounted () {
    this.dataReady = true
    this.$nextTick(() => {
      this.refreshData()
    })
  }
}
</script>

<style scoped>
</style>
