
<template>
<div>
  <ii-maintain-page
     :entity="entity"
     :cascades="cascades"
     :searchItem="searchItem"
     :formDefine="formDefine">
  </ii-maintain-page>
</div>
</template>

<script>
export default {
  data () {
    return {
      entity: 'line',
      cascades: [{ entity: 'workshop', cascades: [{ entity: 'factory' }] }],
      searchItem: [{ label: 'code', value: 'code', width: 120 },
        { label: 'name', value: 'name', width: 120 },
        { label: 'desc', value: 'desc', width: 250 },
        { label: 'workshop.name', value: 'workshop.name', width: 120 },
        { label: 'factory.name', value: 'factory.name', width: 120 }],
      formDefine: {
        labelWidth: '120px',
        prop: [
          [{
            dataSource: [{ entity: 'factory', label: 'name' }, { entity: 'workshop', label: 'name' }],
            key: 'workshop',
            label: 'name',
            control: 'cascaderSelect',
            span: 23,
            rules: [{
              required: true,
              validator: (rule, value, callback) => {
                if (!value) {
                  callback(new Error(this.$t('rulebasic.please_select') + this.$t('workshop.name')))
                } else {
                  callback()
                }
              },
              trigger: 'change'
            }]
          }],
          [{
            key: 'code',
            control: 'input',
            span: 23,
            rules: [{ max: 20, message: this.$t('rulebasic.character_length'), trigger: ['blur', 'change'] }],
            readonly: function (editdata) {
              for (const key in editdata) { // 如果不为空，则会执行到这一步，返回true
                return true
              }
              return false // 如果为空，返回false
            },
            inputconvert: function (value) {
              return String(value).toUpperCase()
            }
          }],
          [{
            key: 'name',
            control: 'input',
            span: 23,
            rules: [{
              required: true,
              validator: (rule, value, callback) => {
                if (!value || value.trim() === '') {
                  callback(new Error(this.$t('rulebasic.please_enter') + this.$t('line.name')))
                } else {
                  callback()
                }
              },
              trigger: ['blur', 'change']
            },
            { max: 50, message: this.$t('rulebasic.character_length'), trigger: ['blur', 'change'] }]
          }],
          [{
            key: 'desc',
            control: 'textarea',
            span: 23,
            rules: [{ max: 255, message: this.$t('rulebasic.character_length'), trigger: ['blur', 'change'] }]
          }]
        ]
      }
    }
  },
  watch: {
  }
}
</script>

<style scoped>
</style>
