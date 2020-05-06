<template>
  <div>
    <ii-maintain-page
        :maintaintop="0"
        :entity='entity'
        :searchItem="searchItem"
        :formDefine="formDefine">
      </ii-maintain-page>
  </div>
</template>

<script>
export default {
  data () {
    return {
      entity: 'factory',
      searchItem: [{ label: 'code', value: 'code', width: 100 },
        { label: 'name', value: 'name', width: 100 },
        { label: 'group', value: 'group', width: 180 },
        { label: 'desc', value: 'desc', width: 250 }],
      formDefine: {
        labelWidth: '120px',
        prop: [
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
                  callback(new Error(this.$t('rulebasic.please_enter') + this.$t('factory.name')))
                } else {
                  callback()
                }
              },
              trigger: ['blur', 'change']
            },
            { max: 50, message: this.$t('rulebasic.character_length'), trigger: ['blur', 'change'] }]
          }],
          [{
            key: 'group',
            control: 'input',
            span: 23,
            rules: [{
              required: true,
              validator: (rule, value, callback) => {
                if (!value) {
                  callback(new Error(this.$t('rulebasic.please_enter') + this.$t('factory.group')))
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
  methods: {
  },
  watch: {
  }
}
</script>

<style scoped>
</style>
