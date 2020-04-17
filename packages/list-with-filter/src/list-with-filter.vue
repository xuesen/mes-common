<template>
<div style="width: 100%; height: 100%;">
  <div class="filter">
      <el-input
      v-model="filterKeyWord"
      placeholder="Filter..."
      ></el-input>
  </div>
  <slot name="buttonGroup"></slot>
  <div style="width: calc(100%);" :style="{height: 'calc(100% - ' + headerHeight + ')'}">
    <DynamicScroller
    :min-item-size="minitemsize"
    :items="filteredItems"
    style="height: 100%;"
    >
    <template v-slot="{ item, index, active }">
      <DynamicScrollerItem
      :ref="'dynamicScrollerItem'+item[searchFiled]"
      :item="item"
      :active="active"
      :data-index="index"
      :data-active="active"
      >
        <slot name="listitem" v-bind:row="{item: item, index: index}"></slot>
      </DynamicScrollerItem>
    </template>
    </DynamicScroller>
  </div>
</div>
</template>
<style lang="scss" scoped="" type="text/css">
@import '../../styles/variables.scss';
  .el-select .el-input input, .el-input input {
    border-bottom: 1px solid rgba(112,112,112,1);
  }
</style>

<script>
import _ from 'lodash'
export default {
  name: 'IiListWithFilter',
  props: {
    minitemsize: Number,
    items: Array,
    labelFiled: String,
    searchFiled: String,
    headerHeight: {
      type: String,
      default: '43px'
    }
  },
  data () {
    return {
      ready: false,
      filterKeyWord: ''
    }
  },
  computed: {
    filteredItems () {
      let activeItems = []
      if (!this.filterKeyWord) {
        activeItems = _.clone(this.items)
      } else {
        const lowerCaseSearch = this.filterKeyWord.toLowerCase()
        activeItems = this.items.filter(item => item[this.searchFiled ? this.searchFiled : this.labelFiled].toLowerCase().includes(lowerCaseSearch))
      }
      return activeItems
    }
  },
  created () {
    // _.each(this.items, (item) => {
    //   item.resize = false
    // })
    // this.ready = true
  },
  methods: {
    resizeItem (item) {
      this.$nextTick(() => {
        setTimeout(() => {
          if (this.$refs['dynamicScrollerItem' + item[this.searchFiled]]) {
            this.$refs['dynamicScrollerItem' + item[this.searchFiled]].updateSize()
          }
        }, 400)
      })
    }
  },
  async mounted () {
  },
  watch: {
  }
}
</script>
