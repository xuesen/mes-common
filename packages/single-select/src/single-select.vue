<template>
  <el-select v-model="selectedValue" :disabled="disabled" autocomplete="on" :filterable="true" @clear="$emit('clear')" :clearable="clearable" @change="selectChange" :placeholder='$t("basic.selectPlaceholder")'>
    <el-option
      v-for="item in selectItems"
      :key="item[initOptions.valueFiled ? initOptions.valueFiled : 'id']"
      :label="labels(item)"
      :value="item[initOptions.valueFiled ? initOptions.valueFiled : 'id']"
      :clearable="true">
    </el-option>
  </el-select>
</template>
<script>
import _ from 'lodash'
export default {
  name: 'IiSelect',
  props: {
    initOptions: Object,
    value: [Number, String, Boolean],
    valueObj: Object,
    valueFiled: String,
    lazyLoad: Boolean,
    options: Array,
    disabled: Boolean,
    clearable: {
      type: Boolean,
      default: true
    }
  },
  data () {
    return {
      selectItems: [],
      selectedValue: this.value
    }
  },
  beforeCreate () {
  },
  created () {
  },
  beforeMount () {
  },
  methods: {
    selectChange (selected) {
      var selectedObj = _.find(this.selectItems, (item) => { return item[this.initOptions.valueFiled ? this.initOptions.valueFiled : 'id'] === selected })
      this.$emit('update:valueObj', selectedObj)
      if (this.initOptions.valueFiled) {
        this.$emit('input', selectedObj[this.initOptions.valueFiled])
      } else {
        this.$emit('input', selected)
      }
      this.$emit('change', selected)
    },
    labels (item) {
      if (this.initOptions.label.indexOf('+') >= 0) {
        let array = []
        array = this.initOptions.label.split('+')
        return item[array[0]] + '-' + item[array[1]]
      } else {
        return item[this.initOptions.label]
      }
    }
  },
  async mounted () {
    if (!this.lazyLoad && !this.initOptions.lazyLoad) {
      let result = await this.$maintain_service_agent(this.initOptions.entity, 'findEnabled', 'post', this.initOptions.condition)
      this.selectItems = result.data
    } else {
      this.selectItems = this.options || this.initOptions.options
    }
  },
  watch: {
    'value' (val) {
      this.selectedValue = val
    },
    'options' (val) {
      this.selectItems = val
    },
    'initOptions.options' (val) {
      this.selectItems = val
    }
  }
}
</script>
