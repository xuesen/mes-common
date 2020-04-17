<template>
<el-container>
    <el-header :height="headerHeight">
    <div class="tableTop">
      <el-row>
        <el-col :span="4" v-if="!hideAdd || !hideExport || showImport">
          <el-button-group>
            <el-tooltip class="item" effect="dark" :content='$t("button.add")' placement="top" v-if="!hideAdd">
              <el-button @click="handleAdd()"><ii-svg-icon :name="'btnicon/add'" width="24" height="24"/></el-button>
            </el-tooltip>
            <el-tooltip class="item" effect="dark" :content='$t("button.export")' placement="top" v-if="!hideExport">
              <el-button @click="handleExport()"><ii-svg-icon :name="'btnicon/export'" width="24" height="24"/></el-button>
            </el-tooltip>
            <el-tooltip class="item" effect="dark" :content='$t("button.import")' placement="top" v-if="showImport">
              <ii-import-excel v-on:importSuccess="refreshData" :entity="entity" :uploadAction="uploadAction"></ii-import-excel>
            </el-tooltip>
          </el-button-group>
        </el-col>
        <el-col :span="3" v-if="!hideSearch">
          <el-select v-model="searchKey" :placeholder='$t("basic.selectPlaceholder")'>
            <el-option
              v-for="item in searchItem"
              :key="'searchselectoption' + item.value"
              :label="getColumnLabel(item.label)"
              :value="item.value">
            </el-option>
          </el-select>
        </el-col>
        <el-col :span="3" style="margin-left: 16px;" v-if="!hideSearch">
          <el-input
            :placeholder="$t('placeholder.inputKeyWord')"
            v-model="searchValue"
            @keyup.enter.native="refreshData()"></el-input>
        </el-col>
        <el-col :span="2" v-if="!hideSearch" class="serach">
          <el-tooltip class="item" effect="dark" :content='$t("button.search")' placement="top-start">
             <el-button><ii-svg-icon :name="'btnicon/search'" width="24" height="24" @click.native="datamaintainserach"/></el-button>
          </el-tooltip>
        </el-col>
      </el-row>
    </div>
    </el-header>
    <el-main>
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
    </el-main>
  </el-container>
</template>

<style lang="scss" scoped="" type="text/css">
.serach .el-button:hover {
  background-color: rgba(63, 209, 219, 0.16);
  border-radius: 50%;
  color:#606266;
}
</style>

<script>
import _ from 'lodash'
import Vue from 'vue'
import IiMaintainTable from '../../maintain-table'
import IiImportExcel from '../..//import-excel'
import IiSvgIcon from '../..//svg-icon'
export default {
  name: 'IiMaintainPage',
  components: {
    IiMaintainTable,
    IiImportExcel
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
      headerHeight: '100px',
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
      let result = _.find(cascades, {entity: entity})
      if (result) {
        return result
      } else {
        let resultInner = null
        _.each(cascades, (cascade, index) => {
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
      let searchCondition = this.cascades ? {cascades: _.cloneDeep(this.cascades)} : {}
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
