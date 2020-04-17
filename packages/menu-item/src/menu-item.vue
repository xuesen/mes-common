<template>
<div style="width: 100%; height: 100%;">
  <div class="menuitem" v-for="item in items" :key="item.id">
    <el-menu-item :index="index" v-if="item.leaf===true" @click.native="menuItemClick(item)">
      {{getlable(item)}}
    </el-menu-item>
    <el-submenu :show-timeout="10" :hide-timeout="10" v-else :index="''+item.id">
      <template slot="title">
        <el-tooltip effect="dark" :content="item.label" placement="top-start">
          <span>{{getlable(item)}}</span>
        </el-tooltip>
      </template>
      <menu-item @click="menuItemClick" :itemdata="item.children"></menu-item>
    </el-submenu>
  </div>
</div>
</template>

<style lang="scss" scoped="" type="text/css">
.menuitem .el-button+.el-button {
  margin-left: 0px;
}
</style>

<script>
import _ from 'lodash'
export default {
  name: 'IiMenuItem',
  props: {
    // route object
    loadFunc: Function,
    itemdata: Array,
    color: {
      type: String,
      default: null
    },
    index: [Number, String]
  },
  data () {
    return {
      items: []
    }
  },
  computed: {
  },
  methods: {
    getlable: function (item) {
      let l = _.truncate(item.label, {
        'length': 16,
        'omission': '...'
      })
      return l
    },
    handleoperate (type) {
      this.$emit('handleoperate', type, this.item)
    },
    menuItemClick (item) {
      this.$emit('click', item)
    }
  },
  async mounted () {
    if (this.loadFunc) {
      let result = await this.loadFunc()
      this.items = result
    } else {
      this.items = this.itemdata
    }
  },
  watch: {
  }
}
</script>
