<template>
<div class="ii-cascader">
  <ii-cascader-org
    :disabled="disabled"
    v-if="dataReady"
    v-model="selected_value"
    :placeholder="placeholder ? placeholder :$t('placeholder.select')"
    @active-item-change="handle_item_change"
    @change="select_change"
    :options="select_items"
    :clearable="true"
    filterable>
  </ii-cascader-org>
</div>
</template>

<style lang="scss" scoped>
</style>

<script>
import _ from 'lodash'
export default {
  name: 'IiCascader',
  props: {
    initOptions: Object,
    value: [Object, String, Number],
    valueObj: Object,
    disabled: Boolean,
    placeholder: String
  },
  data () {
    return {
      dataReady: false,
      select_items: [],
      selected_value: []
    }
  },
  computed: {
  },
  beforeCreate () {
  },
  created () {
  },
  beforeMount () {
  },
  methods: {
    async handle_item_change (val) {
      if (val.length === this.initOptions.data_source.length) {
        return
      }
      let query_source = this.initOptions.data_source[val.length]
      let cascade_source = this.initOptions.data_source[val.length - 1]
      let params = query_source.params ? query_source.params : {}
      if (query_source.filter) {
        if (query_source.filter.indexOf('.') > 0) {
          let filters = query_source.filter.split('.')
          params[filters[0]] = {}
          params[filters[0]][filters[1]] = val[val.length - 1]
        } else {
          params[query_source.filter] = val[val.length - 1]
        }
      }
      let toPushChild = this.select_items
      _.each(val, (id, index) => {
        toPushChild = _.find(toPushChild, {value: id}).children
      })
      if (toPushChild.length !== 0) {
        return
      }
      let result = await this.$axios(query_source.api_path, query_source.req_type, params)
      _.each(result.data, (option) => {
        let child = val.length === this.initOptions.data_source.length - 1
          ? {obj: option, label: query_source.label_field ? option[query_source.label_field] : option, value: query_source.value_field ? option[query_source.value_field] : option}
          : {obj: option, label: query_source.label_field ? option[query_source.label_field] : option, value: query_source.value_field ? option[query_source.value_field] : option, children: []}
        toPushChild.push(child)
      })
    },
    select_change (selected) {
      let selected_obj_array = []
      let level_list = this.select_items
      for (let index = 0; index < selected.length; index++) {
        let selected_obj = _.find(level_list, (item) => { return item.value === selected[index] })
        selected_obj_array.push(selected_obj)
        level_list = selected_obj.children
      }
      let selected_obj_all
      let parent_obj
      if (selected_obj_array.length > 0 && this.initOptions.value_path && this.initOptions.value_path.length > 0) {
        for (let index2 = this.initOptions.value_path.length - 1; index2 >= 0; index2--) {
          if (index2 === this.initOptions.value_path.length - 1) {
            selected_obj_all = selected_obj_array[index2].obj
            parent_obj = selected_obj_all
          } else {
            selected_obj_all[this.initOptions.value_path[index2]] = selected_obj_array[index2].obj
            parent_obj = parent_obj[this.initOptions.value_path[index2]]
          }
        }
      } else {
        selected_obj_all = undefined
      }
      this.$emit('update:valueObj', selected_obj_all)
      this.$emit('input', selected && selected.length > 0 ? selected[selected.length - 1] : '')
    },
    async get_selected_value_array () {
      if (!this.value || this.value === -1) {
        this.selected_value = []
        return
      }
      if (_.isNumber(this.value)) {
        return
      }
      let selected_value_array = []
      let setVaule = this.value
      for (let index = this.initOptions.value_path.length - 1; index >= 0; index--) {
        let levelId = this.initOptions.data_source[index].value_field ? setVaule[this.initOptions.value_path[index]][this.initOptions.data_source[index].value_field] : setVaule[this.initOptions.value_path[index]]
        selected_value_array.push(levelId)
        if (index > 0) {
          setVaule = setVaule[this.initOptions.value_path[index]]
        }
      }
      this.selected_value = _.reverse(selected_value_array)
      this.$emit('input', this.selected_value[this.selected_value.length - 1])
      let loadPath = []
      for (let selected_value_length = this.selected_value.length, index = 0; index < selected_value_length; index++) {
        let val = this.selected_value[index]
        loadPath.push(val)
        if (loadPath.length >= this.initOptions.data_source.length) {
          return
        }
        await this.handle_item_change(_.clone(loadPath))
      }
    }
  },
  async mounted () {
    this.select_items = []
    let search_condition = this.initOptions.data_source[0].params ? this.initOptions.data_source[0].params : {}
    let result = await this.$axios(this.initOptions.data_source[0].api_path, this.initOptions.data_source[0].req_type, search_condition)
    this.select_items = _.map(result.data, (option) => {
      if (this.initOptions.data_source[0].label_field) {
        return {obj: option, label: option[this.initOptions.data_source[0].label_field], value: option[this.initOptions.data_source[0].value_field], children: []}
      } else {
        return {obj: option, label: option, value: option, children: []}
      }
    })
    this.dataReady = true
    await this.get_selected_value_array()
  },
  watch: {
    'value' (val) {
      if (this.dataReady) {
        if (typeof (val) === 'object') {
          this.get_selected_value_array()
        }
      }
    }
  }
}
</script>
