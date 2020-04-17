import _ from 'lodash'
import $ from 'jquery'
import ResizeObserver from 'resize-observer-polyfill'
let orderMap = {ascending: 'asc', descending: 'desc'}
export default {
  created () {
  },

  data: () => ({
    tableHeight: '100%',
    tableData: [],
    recordCount: 0,
    pageData: [],
    sortWay: {
      prop: '',
      order: ''
    }
  }),

  watch: {
    tableHeight () {
      this.$nextTick(() => {
        this.initTableData()
      })
    }
  },

  computed: {
  },
  mounted () {
    var ro = new ResizeObserver((entries, observer) => {
      this.$nextTick(() => {
        this.initTableData()
      })
    })

    ro.observe(this.$el)
  },
  methods: {
    handleSortChange (sortWay) {
      this.sortWay = {
        prop: sortWay.prop,
        order: sortWay.order
      }
      this.refreshPage()
    },
    initTableData () {
      if ($(this.$el).find('.virtualTable.el-table .el-table__fixed-body-wrapper').length > 0 && $(this.$el).find('.virtualTable.el-table .el-table__fixed-body-wrapper .append').length === 0) {
        $(this.$el).find('.virtualTable.el-table .el-table__fixed-body-wrapper').append('<div class="append" slot="append" style="text-align: center"></div>')
      }
      let visableHeight = $(this.$el).find('.virtualTable.el-table .el-table__body-wrapper')[0].clientHeight
      // let visableHeight = this.$el.clientHeight - 32
      // if (visableHeight === 0) {
      //   visableHeight = this.tableHeight - 32
      // }
      let visableRecordCount = Math.ceil(visableHeight / 31) + 1
      $(this.$el).find('.virtualTable.el-table .append').height(this.recordCount * 31 - visableRecordCount * 31)
      $(this.$el).find('.virtualTable.el-table .el-table__body-wrapper').unbind()
      $(this.$el).find('.virtualTable.el-table .el-table__body-wrapper').scroll(this.refreshPage)
      $(this.$el).find('.virtualTable.el-table .el-table__body-wrapper').scrollLeft(0)
      this.refreshPage()
    },
    refreshTableData (data) {
      this.tableData = data
      this.recordCount = this.tableData ? this.tableData.length : 0
      $(this.$el).find('.virtualTable.el-table .el-table__body-wrapper').scrollTop(0)
      $(this.$el).find('.virtualTable.el-table .el-table__body-wrapper').scrollLeft(0)
      this.initTableData()
    },
    refreshPage () {
      // let totalHeight = this.recordCount * 31
      let tableScrollTop = $(this.$el).find('.virtualTable.el-table .el-table__body-wrapper').scrollTop()
      let visableHeight = $(this.$el).find('.virtualTable.el-table .el-table__body-wrapper')[0].clientHeight
      let recordHeight = $(this.$el).find('.virtualTable.el-table .el-table__body-wrapper .el-table__body tbody')[0].clientHeight
      // let visableHeight = this.$el.clientHeight - 32
      // if (visableHeight === 0) {
      //   visableHeight = this.tableHeight - 32
      // }
      let visableRecordCount = Math.ceil(visableHeight / 31) + 1
      let visableStartRecordIndex = Math.ceil(tableScrollTop / 31)
      // let halfRowHeight = (visableRecordCount - 1) * 31 - visableHeight
      if (this.sortWay && this.sortWay.prop) {
        // ASC DESC
        this.tableData = _.orderBy(this.tableData, [this.sortWay.prop], [orderMap[this.sortWay.order]])
      } else {

      }
      if (this.recordCount < visableRecordCount) {
        this.pageData = this.tableData ? this.tableData.slice(0, this.recordCount) : []
        $(this.$el).find('.virtualTable.el-table .el-table__body-wrapper .el-table__body tbody').css('transform', 'translate(0px, 0px)')
        $(this.$el).find('.virtualTable.el-table .el-table__fixed-body-wrapper .el-table__body tbody').css('transform', 'translate(0px, 0px)')
      } else if (visableStartRecordIndex + visableRecordCount >= this.recordCount) {
        this.pageData = this.tableData ? this.tableData.slice(this.recordCount - visableRecordCount, this.recordCount) : []
        $(this.$el).find('.virtualTable.el-table .el-table__body-wrapper .el-table__body tbody').css('transform', 'translate(0px,' + (tableScrollTop - (recordHeight - visableHeight)) + 'px)')
        $(this.$el).find('.virtualTable.el-table .el-table__fixed-body-wrapper .el-table__body tbody').css('transform', 'translate(0px,' + (tableScrollTop - (recordHeight - visableHeight)) + 'px)')
      } else {
        this.pageData = this.tableData ? this.tableData.slice(visableStartRecordIndex, visableStartRecordIndex + visableRecordCount) : []
        $(this.$el).find('.virtualTable.el-table .el-table__body-wrapper .el-table__body tbody').css('transform', 'translate(0px,' + tableScrollTop + 'px)')
        $(this.$el).find('.virtualTable.el-table .el-table__fixed-body-wrapper .el-table__body tbody').css('transform', 'translate(0px,' + tableScrollTop + 'px)')
      }
    }
  }
}
