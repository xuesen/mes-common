<template>
  <ii-edit-form v-if="preprocess_ready" ref="form" :top="dialogTop" :form-define="form_define">
  </ii-edit-form>
</template>
<i18n>
{
  "en": {
  },
  "cn": {
    "module-name": "属性维护",
    "please-input": "不能为空",
    "invalid-defaultvalue": "默认值不合法"
  }
}
</i18n>
<script>
import _ from 'lodash-es'
const control_type_dic = {input: 'input', list: 'selectval', multiselect: 'multi-select'}
export default {
  name: 'IiAttributeForm',
  props: {
    dialogTop: {
      type: Number,
      default: 0
    },
    attribute_definition_query_api: {
      type: Object,
      default: () => {
        return {
          api_path: './datacenterservice/api/attributedefinition/query',
          req_type: 'post'
        }
      }
    },
    owner_type: String,
    owner_subtype_id: Number,
    attribute_value_query_api: {
      type: Object,
      default: () => {
        return {
          api_path: './datacenterservice/api/attributevalue/query',
          req_type: 'post'
        }
      }
    },
    attribute_value_save_api: {
      type: Object,
      default: () => {
        return {
          api_path: './datacenterservice/api/attributeValue/valuelist',
          req_type: 'post'
        }
      }
    }
  },
  data () {
    return {
      preprocess_ready: false,
      attribute_definitions: [],
      form_define: {},
      owner_id: -1
    }
  },
  methods: {
    async open (row) {
      this.owner_id = row.id
      let result = await this.$axios(this.attribute_value_query_api.api_path,
        this.attribute_value_query_api.req_type,
        {name: 'OwnerType', value: this.owner_type})
      let form_data = _.mapValues(_.keyBy(result.data, 'AttributeDefinitionId'), (o) => { return o.Value })
      this.$nextTick(() => {
        this.$refs.form.open(form_data)
      })
    }
  },
  async mounted () {
    this.form_define = {
      add_api: this.attribute_value_save_api,
      module_name: this.$t('module-name'),
      width: '900px',
      labelWidth: '120px',
      preprocess_data: (data, type) => {
        if (type === 'data_init_form') {
          return data
        } else if (type === 'data_to_save' || type === 'data_to_create') {
          let attribute_value_lst = _.map(this.attribute_definitions, (attribute_define) => {
            return {
              OwnerId: this.owner_id,
              OwnerType: this.owner_type,
              AttributeDefinitionId: attribute_define.id,
              AttributeDefinitionCode: attribute_define.code,
              Value: control_type_dic[attribute_define.controlType] === 'multi-select' ? JSON.stringify(data[attribute_define.id.toString()] || '[]') : data[attribute_define.id.toString()]
            }
          })
          return {
            Editor: this.$session.get('loginstate') && this.$session.get('loginstate').user && this.$session.get('loginstate').user.code ? this.$session.get('loginstate').user.code : '9999',
            AttributeValueLst: attribute_value_lst
          }
        }
      },
      new_anather: false,
      prop: []
    }
    try {
      let result = await this.$axios(this.attribute_definition_query_api.api_path,
        this.attribute_definition_query_api.req_type,
        {name: 'OwnerType', value: this.owner_type})
      this.attribute_definitions = result.data
      let row_index = -1
      _.each(result.data, (attribute, index) => {
        let cell_define = {
          model: attribute.id.toString(),
          label: attribute.name,
          control: control_type_dic[attribute.controlType],
          span: 11
        }
        if (attribute.defaultValue) {
          try {
            cell_define.default = control_type_dic[attribute.controlType] === 'multi-select' ? JSON.parse(attribute.defaultValue || '[]') : attribute.defaultValue
          } catch (e) {
            this.$ii_message('error', '\'' + attribute.name + '\'' + this.$t('invalid-defaultvalue'))
          }
        }
        if (attribute.isReadonly) {
          cell_define.disabled = true
        }
        if (attribute.isMandatory) {
          cell_define.rules = []
          cell_define.rules.push({
            required: true,
            validator: (rule, value, callback) => {
              if (control_type_dic[attribute.controlType] === 'multi-select' && value.length === 0) {
                callback(new Error(this.$t('rulebasic.please_select') + attribute.name))
              } else if (control_type_dic[attribute.controlType] !== 'multi-select' && (!value || value.trim() === '')) {
                callback(new Error(this.$t('rulebasic.please_enter') + attribute.name))
              } else {
                callback()
              }
            },
            message: this.$t('please-input'),
            trigger: ['blur', 'change']
          })
        }
        if (control_type_dic[attribute.controlType] === 'selectval' || control_type_dic[attribute.controlType] === 'multi-select') {
          cell_define.control_options = {
            api_path: './datacenterservice/api/datadictionaryvalue/query',
            req_type: 'post',
            params: {name: 'DataDictionaryId', value: attribute.valueDataSource},
            label_field: 'code+name',
            value_field: 'code'
          }
        }
        if (index % 2 === 0) {
          row_index = row_index + 1
          this.form_define.prop.push([])
          this.form_define.prop[row_index][0] = cell_define
        } else {
          this.form_define.prop[row_index][1] = cell_define
        }
      })

      this.preprocess_ready = true
    } catch (e) {
      console.log(e)
    } finally {
    }
  }
}
</script>
