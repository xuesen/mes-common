<template>
  <el-cascader
    :disabled="disabled"
    v-if="dataReady"
    v-model="selectedValue"
    :placeholder="$t('basic.selectPlaceholder')"
    @active-item-change="handleItemChange"
    @change="selectChange"
    :options="selectItems"
    :clearable="true"
    filterable>
  </el-cascader>
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
    disabled: Boolean
  },
  data () {
    return {
      dataReady: false,
      selectItems: [],
      selectedValue: []
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
    async handleItemChange (val) {
      if (val.length === this.initOptions.dataSource.length) {
        return
      }
      let querySource = this.initOptions.dataSource[val.length]
      let cascadeSource = this.initOptions.dataSource[val.length - 1]
      let params = querySource.condition ? querySource.condition : {}
      let cascadeEntity = cascadeSource.correctcascadesname ? cascadeSource.correctcascadesname : cascadeSource.entity
      params[cascadeEntity] = {}
      params[cascadeEntity].id = val[val.length - 1]
      let toPushChild = this.selectItems
      _.each(val, (id, index) => {
        toPushChild = _.find(toPushChild, {value: id}).children
      })
      if (toPushChild.length !== 0) {
        return
      }
      let result = await this.$maintain_service_agent(querySource.entity, 'findEnabled', 'post', params)
      _.each(result.data, (option) => {
        let child = val.length === this.initOptions.dataSource.length - 1
          ? {label: option[querySource.label], value: option.id}
          : {label: option[querySource.label], value: option.id, children: []}
        toPushChild.push(child)
      })
    },
    selectChange (selected) {
      let selectedObj = _.find(this.selectItems, (item) => { return item[this.initOptions.valueFiled ? this.initOptions.valueFiled : 'id'] === selected })
      this.$emit('update:valueObj', selectedObj)
      this.$emit('input', selected[selected.length - 1])
    },
    async getSelectedValueArray () {
      if (!this.value || this.value === -1) {
        this.selectedValue = []
        return
      }
      if (_.isNumber(this.value)) {
        return
      }
      let selectedValueArray = []
      let setVaule = this.value
      for (let index = this.initOptions.dataSource.length - 1; index >= 0; index--) {
        let correctcascadesname = this.initOptions.dataSource[index]['correctcascadesname'] ? this.initOptions.dataSource[index]['correctcascadesname'] : this.initOptions.dataSource[index]['entity']
        // if (!setVaule[correctcascadesname]) {
        //   debugger
        //   selectedValueArray = []
        //   break
        // }
        let levelId = setVaule[correctcascadesname].id
        selectedValueArray.push(levelId)
        if (index > 0) {
          setVaule = setVaule[correctcascadesname]
        }
      }
      this.selectedValue = _.reverse(selectedValueArray)
      this.$emit('input', this.selectedValue[this.selectedValue.length - 1])
      let loadPath = []
      for (let selectedValueLength = this.selectedValue.length, index = 0; index < selectedValueLength; index++) {
        let val = this.selectedValue[index]
        loadPath.push(val)
        if (loadPath.length >= this.initOptions.dataSource.length) {
          return
        }
        await this.handleItemChange(_.clone(loadPath))
      }
    }
  },
  async mounted () {
    this.selectItems = []
    let searchcondition = this.initOptions.dataSource[0].condition ? this.initOptions.dataSource[0].condition : {}
    let result = await this.$maintain_service_agent(this.initOptions.dataSource[0].entity, 'findEnabled', 'post', searchcondition)
    this.selectItems = _.map(result.data, (option) => {
      return {label: option[this.initOptions.dataSource[0].label], value: option.id, children: []}
    })
    this.dataReady = true
    await this.getSelectedValueArray()
  },
  watch: {
    'value' (val) {
      if (this.dataReady) {
        this.getSelectedValueArray()
      }
    }
  }
}
</script>
