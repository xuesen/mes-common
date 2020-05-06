
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
      entity: 'workshop',
      cascades: [{ entity: 'factory' }],
      searchItem: [{ label: 'code', value: 'code', width: 100 },
        { label: 'name', value: 'name', width: 150 },
        { label: 'desc', value: 'desc', width: 250 },
        { label: 'factory.name', value: 'factory.name', width: 150 }],
      formDefine: {
        labelWidth: '120px',
        prop: [
          [{
            key: 'factory',
            entity: 'factory',
            label: 'code+name',
            correctLabel: 'factoryname',
            control: 'select',
            span: 23,
            rules: [{
              required: true,
              validator: (rule, value, callback) => {
                if (!value) {
                  callback(new Error(this.$t('rulebasic.please_select') + this.$t('factory.name')))
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
                  callback(new Error(this.$t('rulebasic.please_enter') + this.$t('workshop.name')))
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
