<template>
  <ii-radio-group-org v-model="selected_value" :disabled="disabled" @change="selectChange">
    <ii-radio v-for="item in select_items" :key="value_field ? item[value_field] : item" :label="value_field ? item[value_field] : item" border>{{ labels(item) }}</ii-radio>
  </ii-radio-group-org>
</template>
<script>
export default {
  name: 'IiRadioGroup',
  props: {
    initOptions: Object,
    value: [Number, String, Boolean],
    valueObj: [Object, String],
    valueField: String,
    labelField: String,
    lazyLoad: Boolean,
    options: Array,
    disabled: Boolean
  },
  data () {
    return {
      select_items: [],
      selected_value: this.value,
      label_field: undefined,
      value_field: undefined
    }
  },
  beforeCreate () {
  },
  created () {
    this.label_field = this.initOptions && this.initOptions.label_field ? this.initOptions.label_field : this.labelField
    this.value_field = this.initOptions && this.initOptions.value_field ? this.initOptions.value_field : this.valueField
  },
  beforeMount () {
  },
  methods: {
    selectChange (selected) {
      let selectedObj = _.find(this.select_items, (item) => { return (this.value_field ? item[this.value_field] : item) === selected })
      this.$emit('update:valueObj', selectedObj)
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
          return item[array[0]] + '-' + item[array[1]]
        } else {
          return item[this.label_field]
        }
      } else {
        return item
      }
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
  },
  watch: {
    'value' (val) {
      this.selected_value = val
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
