import _ from 'lodash'
import $ from 'jquery'
import ResizeObserver from 'resize-observer-polyfill'
let orderMap = {ascending: 'asc', descending: 'desc'}
export default {
  created () {
  },
  props: {
    data: Array,
    virtualMixForbidden: {
      type: Boolean,
      default: false
    }
  },
  data: () => ({
    tableHeight: '100%',
    table_data: [],
    recordCount: 0,
    pageData: [],
    sortWay: {
      prop: '',
      order: ''
    },
    hightlight_key: undefined,
    ui_ready: false
  }),

  watch: {
    data: {
      handler: function () {
        this.$nextTick(() => {
          this.refresh_table_data(this.data)
        })
      },
      deep: true,
      immediate: true
    },
    table_data: {
      handler: function () {
        this.$emit('input', this.table_data)
      },
      deep: true,
      immediate: true
    }
  },

  computed: {
  },
  mounted () {
    let ro = new ResizeObserver((entries, observer) => {
      // setTimeout(() => {
      //   this.init_table_data()
      // }, 2000)
      this.$nextTick(() => {
        this.init_table_data()
        this.ui_ready = true
      })
    })
    // ro.observe(this.$el)
    this.$nextTick(() => {
      ro.observe($(this.$el).find('.virtualTable .el-table .el-table__body-wrapper')[0])
    })
  },
  methods: {
    // el_resize () {
    //   clearTimeout(resize_timer)
    //   if ($(this.$el).find('.virtualTable .el-table .el-table__body-wrapper')[0].style.height &&
    //   _.replace($(this.$el).find('.virtualTable .el-table .el-table__body-wrapper')[0].style.height, 'px', '') === $(this.$el).find('.virtualTable .el-table .el-table__body-wrapper')[0].clientHeight.toString()) {
    //     this.init_table_data()
    //   } else {
    //     resize_timer = setTimeout(this.el_resize, 100)
    //   }
    // },
    handleSortChange (sortWay) {
      this.sortWay = {
        prop: sortWay.prop,
        order: sortWay.order
      }
      if (this.sortWay && this.sortWay.prop) {
        // ASC DESC
        this.table_data = _.orderBy(this.table_data, [this.sortWay.prop], [orderMap[this.sortWay.order]])
      } else {
      }
      _.each(this.table_data, (row, index) => {
        row.index = index + 1
      })
      this.refresh_page()
    },
    init_table_data (hightlight_key) {
      if (!this.virtualMixForbidden) {
        if ($(this.$el).find('.virtualTable .el-table .el-table__fixed-body-wrapper').length > 0 && $(this.$el).find('.virtualTable .el-table .el-table__fixed-body-wrapper .append').length === 0) {
          $(this.$el).find('.virtualTable .el-table .el-table__fixed-body-wrapper').append('<div class="append" slot="append" style="text-align: center"></div>')
        }
      }
      let visableHeight = $(this.$el).find('.virtualTable .el-table .el-table__body-wrapper')[0].clientHeight
      // let visableHeight = this.$el.clientHeight - 32
      // if (visableHeight === 0) {
      //   visableHeight = this.tableHeight - 32
      // }
      // let visableRecordCount = Math.ceil(visableHeight / this.rowHeight) + 1
      let visableRecordCount = Math.ceil(visableHeight / this.rowHeight)
      if (!this.virtualMixForbidden) {
        $(this.$el).find('.virtualTable .el-table .append').height(this.recordCount * this.rowHeight - visableRecordCount * this.rowHeight)
      }
      $(this.$el).find('.virtualTable .el-table .el-table__body-wrapper').unbind()
      if (!this.virtualMixForbidden) {
        $(this.$el).find('.virtualTable .el-table .el-table__body-wrapper').scroll(this.refresh_page)
      }
      $(this.$el).find('.virtualTable .el-table .el-table__body-wrapper').scrollLeft(0)
      if (!this.virtualMixForbidden) {
        this.refresh_page()
      } else {
        this.pageData = this.table_data
      }
    },
    refresh_table_data (data, hightlight_key) {
      // data.push({})
      _.each(data, (row, index) => {
        row.index = index + 1
      })
      this.table_data = data
      if (hightlight_key) {
        this.hightlight_key = hightlight_key
      }
      this.recordCount = this.table_data ? this.table_data.length : 0
      $(this.$el).find('.virtualTable .el-table .el-table__body-wrapper').scrollTop(0)
      $(this.$el).find('.virtualTable .el-table .el-table__body-wrapper').scrollLeft(0)
      this.init_table_data()
      if (this.hightlight_key) {
        if (_.some(this.table_data, this.hightlight_key)) {
          $(this.$el).find('.virtualTable .el-table .el-table__body-wrapper').scrollTop(this.rowHeight * (_.findIndex(this.table_data, this.hightlight_key) - 1))
        }
      }
    },
    refresh_page () {
      // let totalHeight = this.recordCount * this.rowHeight
      let tableScrollTop = $(this.$el).find('.virtualTable .el-table .el-table__body-wrapper').scrollTop()
      let visableHeight = $(this.$el).find('.virtualTable .el-table .el-table__body-wrapper')[0].clientHeight
      let offset_height = $(this.$el).find('.virtualTable .el-table .el-table__body-wrapper')[0].offsetHeight
      let recordHeight = $(this.$el).find('.virtualTable .el-table .el-table__body-wrapper .el-table__body tbody')[0].clientHeight
      // let visableHeight = this.$el.clientHeight - 32
      // if (visableHeight === 0) {
      //   visableHeight = this.tableHeight - 32
      // }
      // let visableRecordCount = Math.ceil(visableHeight / this.rowHeight) + 1
      let visableRecordCount = Math.ceil(visableHeight / this.rowHeight)
      // recordHeight = this.rowHeight * visableRecordCount
      let visableStartRecordIndex = Math.ceil(tableScrollTop / this.rowHeight)
      // let halfRowHeight = (visableRecordCount - 1) * this.rowHeight - visableHeight
      if (this.recordCount < visableRecordCount) {
        this.pageData = this.table_data ? this.table_data.slice(0, this.recordCount) : []
        $(this.$el).find('.virtualTable .el-table .el-table__body-wrapper .el-table__body tbody').css('transform', 'translate(0px, 0px)')
        $(this.$el).find('.virtualTable .el-table .el-table__fixed-body-wrapper .el-table__body tbody').css('transform', 'translate(0px, 0px)')
        $(this.$el).find('.virtualTable .el-table .el-table__body').height(this.rowHeight * this.recordCount + 1)
      } else if (visableStartRecordIndex + visableRecordCount >= this.recordCount) {
        this.pageData = this.table_data ? this.table_data.slice(this.recordCount - visableRecordCount, this.recordCount) : []
        if (tableScrollTop < this.rowHeight) {
          $(this.$el).find('.virtualTable .el-table .el-table__body-wrapper .el-table__body tbody').css('transform', 'translate(0px,' + tableScrollTop === 0 ? 0 : this.recordCount * this.rowHeight - visableHeight + 'px)')
          $(this.$el).find('.virtualTable .el-table .el-table__fixed-body-wrapper .el-table__body tbody').css('transform', 'translate(0px,' + tableScrollTop === 0 ? 0 : this.recordCount * this.rowHeight - visableHeight + 'px)')
          // $(this.$el).find('.virtualTable .el-table .el-table__body-wrapper .el-table__body tbody').css('transform', 'translate(0px,' + tableScrollTop + 'px)')
          // $(this.$el).find('.virtualTable .el-table .el-table__fixed-body-wrapper .el-table__body tbody').css('transform', 'translate(0px,' + tableScrollTop + 'px)')
        } else {
          $(this.$el).find('.virtualTable .el-table .el-table__body-wrapper .el-table__body tbody').css('transform', 'translate(0px,' + (tableScrollTop - (recordHeight - visableHeight)) + 'px)')
          $(this.$el).find('.virtualTable .el-table .el-table__fixed-body-wrapper .el-table__body tbody').css('transform', 'translate(0px,' + (tableScrollTop - (recordHeight - visableHeight)) + 'px)')
        }
        // $(this.$el).find('.virtualTable .el-table .el-table__body-wrapper .el-table__body tbody').css('transform', 'translate(0px,' + (-tableScrollTop) + 'px)')
        // $(this.$el).find('.virtualTable .el-table .el-table__fixed-body-wrapper .el-table__body tbody').css('transform', 'translate(0px,' + (-tableScrollTop) + 'px)')
        $(this.$el).find('.virtualTable .el-table .el-table__body').height(offset_height + 1)
      } else {
        this.pageData = this.table_data ? this.table_data.slice(visableStartRecordIndex, visableStartRecordIndex + visableRecordCount) : []
        $(this.$el).find('.virtualTable .el-table .el-table__body-wrapper .el-table__body tbody').css('transform', 'translate(0px,' + tableScrollTop + 'px)')
        $(this.$el).find('.virtualTable .el-table .el-table__fixed-body-wrapper .el-table__body tbody').css('transform', 'translate(0px,' + tableScrollTop + 'px)')
        $(this.$el).find('.virtualTable .el-table .el-table__body').height(offset_height + 1)
      }
      if (this.hightlight_key) {
        let current_row = _.find(this.pageData, this.hightlight_key)
        if (current_row) {
          this.set_current_row(current_row)
        }
      }
    }
  }
}
