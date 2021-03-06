<template>
<div class="ii-select">
  <ii-select-org v-model="selected_value" multiple v-loading="loading" :placeholder="placeholder" :disabled="disabled" autocomplete="on" :filterable="true" :allow-create="allow_create" @clear="$emit('clear')" :clearable="clearable" @change="selectChange">
    <ii-option-org
      v-for="item in ordered_options"
      :key="value_field ? item[value_field] : item"
      :label="labels(item)"
      :value="value_field ? item[value_field] : item"
      :clearable="true">
    </ii-option-org>
  </ii-select-org>
</div>
</template>
<script>
import _ from 'lodash'
export default {
  name: 'IiMultiSelect',
  props: {
    initOptions: Object,
    value: Array,
    valueObj: Array,
    valueField: String,
    labelField: String,
    lazyLoad: Boolean,
    options: Array,
    disabled: Boolean,
    placeholder: {
      type: String,
      default: undefined
    },
    allowCreate: {
      type: Boolean,
      default: false
    },
    clearable: {
      type: Boolean,
      default: true
    },
    defaultSelectFirst: {
      type: Boolean,
      default: false
    },
    orderBy: {
      type: String,
      default: ''
    },
    orderDisabled: {
      type: Boolean,
      default: false
    }
  },
  data () {
    return {
      select_items: [],
      selected_value: this.value || [],
      label_field: undefined,
      value_field: undefined,
      allow_create: undefined,
      default_select_first: undefined,
      loading: false
    }
  },
  beforeCreate () {
  },
  created () {
    this.label_field = this.initOptions && this.initOptions.label_field ? this.initOptions.label_field : this.labelField
    this.value_field = this.initOptions && this.initOptions.value_field ? this.initOptions.value_field : this.valueField
    this.allow_create = this.initOptions && this.initOptions.allow_create ? this.initOptions.allow_create : this.allowCreate
    this.default_select_first = this.initOptions && this.initOptions.default_select_first ? this.initOptions.default_select_first : this.defaultSelectFirst
  },
  beforeMount () {
  },
  methods: {
    selectChange (selected) {
      let selectedObj = _.filter(this.select_items, (item) => { return _.some(selected, (selected_one) => { return (this.value_field ? item[this.value_field] : item) === selected_one }) })
      if (selectedObj) {
        this.$emit('update:valueObj', _.cloneDeep(selectedObj))
      } else {
        this.$emit('update:valueObj', [])
      }
      if (this.value_field) {
        this.$emit('input', _.map(selectedObj, (item) => {
          return item[this.value_field]
        }))
      } else {
        this.$emit('input', selected)
      }
      this.$emit('change', selected)
    },
    labels (item) {
      if (this.label_field) {
        if (this.label_field.indexOf('+') >= 0) {
          let array = []
          array = this.label_field.split('+')
          return item[array[0]] + '-' + item[array[1]]
        } else {
          return item[this.label_field]
        }
      } else {
        return item
      }
    },
    async refresh_options (key, value, donot_clear_value) {
      let result
      if (!donot_clear_value) {
        this.selected_value = []
        this.async_parent()
      }
      if (!this.initOptions.params) this.initOptions.params = {}
      this.initOptions.params[key] = value
      this.loading = true
      if (this.initOptions.refresh_options) {
        this.select_items = await this.initOptions.refresh_options(this.initOptions.params)
      } else {
        if (!this.initOptions.lazyLoad) {
          result = await this.$axios(this.initOptions.api_path, this.initOptions.req_type, this.initOptions.params)
        }
      }
      this.loading = false
      this.select_items = result.data
      if (this.default_select_first) {
        this.selected_value = this.select_items[0][this.value_field]
      }
    },
    async_parent () {
      this.$emit('update:valueObj', [])
      this.$emit('input', null)
      this.$emit('change', null)
    }
  },
  async mounted () {
    if (!this.lazyLoad && (!this.initOptions || !this.initOptions.lazyLoad)) {
      let result
      this.loading = true
      if (this.initOptions.api_path) {
        result = await this.$axios(this.initOptions.api_path, this.initOptions.req_type, this.initOptions.params)
      } else {
        result = await this.$maintain_service_agent(this.initOptions.entity, 'findEnabled', 'post', this.initOptions.condition)
      }
      this.loading = false
      this.select_items = result.data
    } else {
      this.select_items = this.options || this.initOptions.options
    }
    if (this.default_select_first) {
      this.selected_value = this.select_items[0][this.value_field]
    }
  },
  computed: {
    ordered_options () {
      if (this.orderDisabled || (this.initOptions && this.initOptions.order_disabled)) {
        return this.select_items
      }
      if (this.orderBy || (this.initOptions && this.initOptions.order_by)) {
        return _.orderBy(this.select_items, [this.orderBy || this.initOptions.order_by])
      } else {
        if (this.label_field) {
          if (this.label_field.indexOf('+') >= 0) {
            let array = []
            array = this.label_field.split('+')
            return _.orderBy(this.select_items, [array[0], array[1]])
          } else {
            return _.orderBy(this.select_items, [this.label_field])
          }
        } else {
          return _.sortedUniq(this.select_items)
        }
      }
    }
  },
  watch: {
    'value' (val) {
      if ((this.selected_value && !val) || (!this.selected_value && val) || (this.selected_value && val && JSON.stringify(this.selected_value) !== JSON.stringify(val))) {
        this.selected_value = val || []
        this.selectChange(val || [])
      }
    },
    'options' (val) {
      this.select_items = val
    },
    'initOptions.options' (val) {
      this.select_items = val
    }
  }
}
</script>
