<template>
<div class="ii-select">
  <ii-select-org v-model="selected_value" :placeholder="placeholder ? placeholder : $t('placeholder.select')" :disabled="disabled" autocomplete="on" :filterable="true" :allow-create="allow_create" @clear="$emit('clear')" :clearable="clearable" @change="selectChange">
    <ii-option-org
      v-for="item in select_items"
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
  name: 'IiSelect',
  props: {
    initOptions: Object,
    value: {
      type: [Number, String, Boolean],
      default: null
    },
    valueObj: [Object, String],
    valueField: String,
    labelField: String,
    lazyLoad: Boolean,
    options: Array,
    disabled: Boolean,
    placeholder: String,
    allowCreate: {
      type: Boolean,
      default: false
    },
    clearable: {
      type: Boolean,
      default: true
    }
  },
  data () {
    return {
      select_items: [],
      selected_value: this.value,
      label_field: undefined,
      value_field: undefined,
      allow_create: undefined
    }
  },
  beforeCreate () {
  },
  created () {
    this.label_field = this.initOptions && this.initOptions.label_field ? this.initOptions.label_field : this.labelField
    this.value_field = this.initOptions && this.initOptions.value_field ? this.initOptions.value_field : this.valueField
    this.allow_create = this.initOptions && this.initOptions.allow_create ? this.initOptions.allow_create : this.allowCreate
},
  beforeMount () {
  },
  methods: {
    selectChange (selected) {
      let selectedObj = _.find(this.select_items, (item) => { return (this.value_field ? item[this.value_field] : item) === selected })
      if (!selectedObj) {
        selectedObj = {}
        if (this.select_items.length > 0) {
          selectedObj = _.clone(this.select_items[0])
          _.each(_.keys(selectedObj), (item_key) => {
            selectedObj[item_key] = null
          })
        }
      }
      this.$emit('update:valueObj', _.clone(selectedObj))
      if (this.value_field) {
        this.$emit('input', selectedObj ? selectedObj[this.value_field] : undefined)
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
          // return item[array[0]] + '-' + item[array[1]]
          return '(' + item[array[0]] + ')' + item[array[1]]
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
        this.selected_value = ''
        this.async_parent()
      }
      if (!this.initOptions.params) this.initOptions.params = {}
      this.initOptions.params[key] = value
      if (this.initOptions.refresh_options) {
        this.select_items = this.initOptions.refresh_options(this.initOptions.params)
      } else {
        if (!this.initOptions.lazyLoad) {
          result = await this.$axios(this.initOptions.api_path, this.initOptions.req_type, this.initOptions.params)
        }
      }
      this.select_items = result.data
    },
    async_parent () {
      let selectedObj = {}
      if (this.select_items.length > 0) {
        selectedObj = _.clone(this.select_items[0])
        _.each(_.keys(selectedObj), (item_key) => {
          selectedObj[item_key] = null
        })
      }
      this.$emit('update:valueObj', selectedObj)
      this.$emit('input', null)
      this.$emit('change', null)
    }
  },
  async mounted () {
    if (!this.lazyLoad && (!this.initOptions || !this.initOptions.lazyLoad)) {
      let result
      if (this.initOptions.api_path) {
        result = await this.$axios(this.initOptions.api_path, this.initOptions.req_type, this.initOptions.params)
      } else {
        result = await this.$maintain_service_agent(this.initOptions.entity, 'findEnabled', 'post', this.initOptions.condition)
      }
      this.select_items = result.data
    } else {
      this.select_items = this.options || this.initOptions.options
    }
    if (this.selected_value) {
      this.selectChange(this.selected_value)
    }
  },
  watch: {
    'value' (val) {
      this.selected_value = val
      this.selectChange(val)
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
