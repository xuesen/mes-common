<template>
  <el-radio-group v-model="selectedValue" @change="selectChange">
    <el-radio v-for="item in selectItems" :key="item.id" :label="item.id" border>{{ item[initOptions.label] }}</el-radio>
  </el-radio-group>
</template>
<script>
export default {
  name: 'IiRadioGroup',
  props: {
    initOptions: Object,
    value: Number
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
      this.$emit('input', selected)
    }
  },
  async mounted () {
    let result = await this.$maintain_service_agent(this.initOptions.entity, 'findEnabled', 'post')
    this.selectItems = result.data
  },
  watch: {
    'value' (val) {
      this.selectedValue = val
    }
  }
}
</script>
