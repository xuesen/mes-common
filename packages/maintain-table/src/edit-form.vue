<template>
  <ii-draggable-dialog :close-on-click-modal="false" @opend="handle_opend" @closed="closediag()" :top="top+'vh'" :visible="show" :title="title" :width="formDefine.width ? formDefine.width : '600px'" @close="handleClose">
    <ii-form :model="form" v-if="dataReady" :rules="rules" ref="form" :label-width="formDefine.labelWidth">
      <ii-row v-for="(row, index) in fromprop" :key="'formRow' + index">
          <ii-col v-for="item in row" v-if="!item.hidden" :span="item.span" :key="item.model">
            <ii-form-item :label='item.getdefinelabel ? item.getdefinelabel($data) : $t(item.label)' v-if="String(item.control).toLowerCase().indexOf('select') === -1 && String(item.control).toLowerCase().indexOf('multi-select') === -1 && String(item.control).toLowerCase().indexOf('selectval') === -1 && String(item.control).toLowerCase().indexOf('cascader') === -1 && String(item.control).toLowerCase().indexOf('cascaderval') === -1 && String(item.control).toLowerCase().indexOf('upload') === -1 && String(item.control).toLowerCase().indexOf('slot') === -1" :prop="item.model" :label-width="item.labelWidth || formDefine.labelWidth">
              <ii-row v-if="item.control === 'input'">
                <ii-col :span="item.unit ? 23 :24">
                  <ii-input :placeholder='item.placeholder ? $t(item.placeholder) : undefined' v-if="item.model.indexOf('.') === -1" :disabled="(editdata && item.dismodify) || item.disabled" v-model="form[item.model]" :clearable="true"></ii-input>
                  <ii-input :placeholder='item.placeholder ? $t(item.placeholder) : undefined' v-else :disabled="(editdata && item.dismodify) || item.disabled" v-model="form[item.model.split('.')[0]][item.model.split('.')[1]]" :clearable="true"></ii-input>
                </ii-col>
                <ii-col :span="1" justify="end" v-if="item.unit">
                  <span>{{item.unit($data)}}</span>
                </ii-col>
              </ii-row>
              <ii-input :placeholder='item.placeholder ? $t(item.placeholder) : undefined' :disabled="(editdata && item.dismodify) || item.disabled" type="textarea" :rows="4" v-if="item.control === 'textarea' && item.model.indexOf('.') === -1" v-model="form[item.model]" :clearable="true"></ii-input>
              <ii-input :placeholder='item.placeholder ? $t(item.placeholder) : undefined' :disabled="(editdata && item.dismodify) || item.disabled" type="textarea" :rows="4" v-if="item.control === 'textarea' && item.model.indexOf('.') > 0" v-model="form[item.model.split('.')[0]][item.model.split('.')[1]]" :clearable="true"></ii-input>
              <ii-date-picker :placeholder='item.placeholder ? $t(item.placeholder) : undefined' :disabled="(editdata && item.dismodify) || item.disabled" v-if="item.control === 'datetime' && item.model.indexOf('.') === -1" value-format="yyyy-MM-dd HH:mm:ss" v-model="form[item.model]" type="datetime" ></ii-date-picker>
              <ii-date-picker :placeholder='item.placeholder ? $t(item.placeholder) : undefined' :disabled="(editdata && item.dismodify) || item.disabled" v-if="item.control === 'datetime' && item.model.indexOf('.') > 0" value-format="yyyy-MM-dd HH:mm:ss" v-model="form[item.model.split('.')[0]][item.model.split('.')[1]]" type="datetime" ></ii-date-picker>
              <ii-date-picker :placeholder='item.placeholder ? $t(item.placeholder) : undefined' :disabled="(editdata && item.dismodify) || item.disabled" v-if="item.control === 'date' && item.model.indexOf('.') === -1"  value-format="yyyy-MM-dd" v-model="form[item.model]" type="date" ></ii-date-picker>
              <ii-date-picker :placeholder='item.placeholder ? $t(item.placeholder) : undefined' :disabled="(editdata && item.dismodify) || item.disabled" v-if="item.control === 'date' && item.model.indexOf('.') > 0"  value-format="yyyy-MM-dd" v-model="form[item.model.split('.')[0]][item.model.split('.')[1]]" type="date" ></ii-date-picker>
            </ii-form-item>
            <ii-form-item :label='$t(item.label)' v-if="item.control === 'select'" :prop="item.model" :label-width="item.labelWidth || formDefine.labelWidth">
              <ii-select :ref="item.model" :placeholder='item.placeholder ? $t(item.placeholder) : undefined'  :disabled="(editdata && item.dismodify) || item.disabled" v-model="form[item.model.split('.')[0]][item.model.split('.')[1]]" :valueObj.sync="form[item.model.split('.')[0]]" :initOptions="item.control_options" v-if="item.control === 'select'"></ii-select>
           </ii-form-item>
            <ii-form-item :label='$t(item.label)' v-if="item.control === 'selectval'" :prop="item.model" :label-width="item.labelWidth || formDefine.labelWidth">
              <ii-select :ref="item.model" :placeholder='item.placeholder ? $t(item.placeholder) : undefined' :disabled="(editdata && item.dismodify) || item.disabled" v-model="form[item.model]" :valueObj.sync="singleselectonj"  :initOptions="item.control_options" v-if="item.control === 'selectval'" ></ii-select>
           </ii-form-item>
            <ii-form-item :label='$t(item.label)' v-if="item.control === 'multi-select'" :prop="item.model" :label-width="item.labelWidth || formDefine.labelWidth">
              <ii-multi-select :ref="item.model" :placeholder='item.placeholder ? $t(item.placeholder) : undefined'  :disabled="(editdata && item.dismodify) || item.disabled" v-model="form[item.model]" :valueObj.sync="form[item.model + '_obj_array']" :initOptions="item.control_options" v-if="item.control === 'multi-select'"></ii-multi-select>
           </ii-form-item>
            <ii-form-item :label='$t(item.label)' v-if="item.control === 'multi-selectval'" :prop="item.model" :label-width="item.labelWidth || formDefine.labelWidth">
              <ii-multi-select :ref="item.model" :placeholder='item.placeholder ? $t(item.placeholder) : undefined'  :disabled="(editdata && item.dismodify) || item.disabled" v-model="form[item.model]" :initOptions="item.control_options" v-if="item.control === 'multi-selectval'"></ii-multi-select>
           </ii-form-item>
            <ii-form-item :label='$t(item.label)' v-if="item.control ==='cascader'" :prop="item.model" :label-width="item.labelWidth || formDefine.labelWidth">
              <ii-cascader :placeholder='item.placeholder ? $t(item.placeholder) : undefined' :disabled="(editdata && item.dismodify) || item.disabled" v-model="form[item.model.split('.')[0]][item.model.split('.')[1]]" :initOptions="item.control_options" v-if="item.control === 'cascader'"></ii-cascader>
            </ii-form-item>
            <ii-form-item :label='$t(item.label)' v-if="item.control ==='cascaderval'" :prop="item.model" :label-width="item.labelWidth || formDefine.labelWidth">
              <ii-cascader :placeholder='item.placeholder ? $t(item.placeholder) : undefined' :disabled="(editdata && item.dismodify) || item.disabled" v-model="form[item.model]" :initOptions="item.control_options" v-if="item.control === 'cascaderval'"></ii-cascader>
            </ii-form-item>
            <ii-form-item :label='$t(item.label)' v-if="item.control ==='upload'" :label-width="item.labelWidth || formDefine.labelWidth">
              <ii-upload :disabled="(editdata && item.dismodify) || item.disabled" :file-list.sync="form[item.model]" :initOptions="item.control_options" v-if="item.control === 'upload'"></ii-upload>
            </ii-form-item>
            <ii-form-item :label='$t(item.label)' v-if="item.control ==='slot'" :prop="item.model" :label-width="item.labelWidth || formDefine.labelWidth">
              <slot :name="item.model" v-bind:form="form"></slot>
            </ii-form-item>
         </ii-col>
      </ii-row>
    </ii-form>
    <span slot="footer" class="dialog-footer">
      <ii-button type="text" @click="handleCancel()">{{btn_close_label}}</ii-button>
      <ii-button type="primary" @click="handleSave()">{{btn_save_label}}</ii-button>
    </span>
  </ii-draggable-dialog>
</template>

<script>
import _ from 'lodash'
import moment from 'moment'
export default {
  name: 'IiEditForm',
  props: {
    top: {
      type: Number,
      default: 0
    },
    entity: String,
    formDefine: Object
  },
  data () {
    return {
      show: false,
      ui_ready: false,
      dataReady: false,
      title: '',
      form: {},
      rules: {},
      haveSaved: false,
      saved_data: {},
      fromprop: this.formDefine.prop,
      clonedata: null,
      before_save: this.formDefine.beforeSave ? this.formDefine.beforeSave : null,
      editdata: null,
      singleselectonj: null,
      cascaderselect: null,
      doSaving: false,
      beforeSavedata: null,
      form_clearing: false,
      form_object_item_clearing: false,
      initing_form_data: false
    }
  },
  computed: {
    btn_close_label () {
      return this.$t('button.cancel')
    },
    btn_save_label () {
      return this.$t('button.save')
    }
  },
  created () {
    this.createLayout()
    this.clonedata = _.cloneDeep(this.form)
  },
  methods: {
    setinitvalue () {
      _.each(this.formDefine.prop, (row) => {
        _.each(row, (item) => {
          if (_.hasIn(item, 'default')) {
            // if (item.control === 'select' || item.control === 'cascader') {
            if (item.model.indexOf('.') > 0) {
              let item_models = item.model.split('.')
              this.form[item_models[0]][item_models[1]] = String(item.default) === '0' ? String(item.default) : item.default
            } else {
              this.form[item.model] = String(item.default) === '0' ? String(item.default) : item.default
            }
          }
        })
      })
      this.clonedata = _.cloneDeep(this.form)
    },
    handlenewAnother () {
      if (!this.formDefine['save_after'] && !this.formDefine['save_after']) {
        // _.each(this.formDefine.prop, (row) => {
        //   _.each(row, (item) => {
        //     if (item['readonly']) delete item['readonly']
        //   })
        // })
      }
      this.$refs['form'].clearValidate()
      this.editdata = null
      this.doSaving = false
    },
    closediag () {
      // _.each(this.formDefine.prop, (row) => {
      //   _.each(row, (item) => {
      //     if (item['readonly']) delete item['readonly']
      //   })
      // })
      this.$refs['form'].clearValidate()
      this.editdata = null
      this.doSaving = false
    },
    change_affect (newdata, olddata) {
      let _this = this
      if (olddata && !_.isEqual(newdata, olddata)) {
        _.forIn(newdata, function (value, key) {
          if (!_.isEqual(newdata[key], olddata[key])) {
            _.forEach(_this.fromprop, function (row, row_index) {
              _.forEach(row, function (form_item, form_item_index) {
                let form_item_model = form_item.model
                let form_item_model_array
                if (form_item.model.indexOf('.') !== -1) {
                  form_item_model_array = form_item.model.split('.')
                  form_item_model = form_item_model_array[0]
                }
                if (_.hasIn(form_item, 'disabled_customize_func')) {
                  let result = form_item.disabled_customize_func(newdata)
                  _this.$set(form_item, 'disabled', result)
                }
                if (form_item_model === key &&
                  ((form_item.model.indexOf('.') !== -1 ? newdata[form_item_model_array[0]][form_item_model_array[1]] : newdata[form_item_model]) !==
                    (form_item.model.indexOf('.') !== -1 ? (olddata[form_item_model_array[0]] ? olddata[form_item_model_array[0]][form_item_model_array[1]] : null) : olddata[form_item_model]))) {
                  if (_.has(form_item, 'change_affect_select_options')) {
                    _.each(form_item.change_affect_select_options, (refresh_options_item) => {
                      if (_this.$refs[refresh_options_item.target]) {
                        _this.$refs[refresh_options_item.target][0].refresh_options(refresh_options_item.param_key, form_item.model.indexOf('.') !== -1 ? newdata[form_item_model_array[0]][form_item_model_array[1]] : newdata[form_item_model], _this.initing_form_data)
                      }
                    })
                  }
                }
              })
            })
          }
        })
        _this.$nextTick(() => {
          _this.initing_form_data = false
        })
      }
    },
    clear_affect () {
      let _this = this
      _.forEach(_this.fromprop, function (row, row_index) {
        _.forEach(row, function (form_item, form_item_index) {
          if (_.hasIn(form_item, 'disabled_customize_func')) {
            _this.$set(form_item, 'disabled', false)
          }
          if (_.has(form_item, 'change_affect_select_options')) {
            _.each(form_item.change_affect_select_options, (refresh_options_item) => {
              if (_this.$refs[refresh_options_item.target]) {
                _this.$refs[refresh_options_item.target][0].refresh_options(refresh_options_item.param_key, '')
              }
            })
          }
        })
      })
    },
    async recreateLayout () {
      this.title = this.formDefine.title ? this.formDefine.title : this.formDefine.module_name + '-' + this.$t('dialog.edit_title')
      this.form = {}
      await this.createLayout()
    },
    async createLayout () {
      this.dataReady = false
      await this.$nextTick(async () => {
        _.each(this.formDefine.prop, (row) => {
          _.each(row, (item) => {
            this.rules['disabled'] = false
            let item_models
            if (item.control === 'select') {
              item_models = item.model.split('.')
              if (!_.has(this.form, item_models[0])) {
                this.$set(this.form, item_models[0], {})
              }
              this.$set(this.form, item_models[0], {})
              this.$set(this.form[item_models[0]], item_models[1], null)
              if (!_.hasIn(this.rules, item_models[0])) {
                this.rules[item_models[0]] = {}
              }
              // this.rules[item_models[0]] = {}
              this.form[item_models[0]][item_models[1]] = item.default ? item.default : null
              if (_.hasIn(item, 'rules')) this.rules[item_models[0]][item_models[1]] = item.rules
              // 添加监视器
              if (_.hasIn(item, 'watcher')) this.$watch(item['watcher']['exps'], (newVal, oldVal) => { item['watcher']['func'](newVal, oldVal, item) }, {immediate: true})
            } else if (item.control === 'multi-select') {
              this.$set(this.form, item.model, [])
              this.$set(this.form, item.model + '_obj_array', [])
              this.rules[item.model] = {}
              // this.form[item_models] = item.default ? item.default : null
              if (_.hasIn(item, 'rules')) this.rules[item.model] = item.rules
              // 添加监视器
              if (_.hasIn(item, 'watcher')) this.$watch(item['watcher']['exps'], (newVal, oldVal) => { item['watcher']['func'](newVal, oldVal, item) }, {immediate: true})
            } else if (item.control === 'cascader') {
              item_models = item.model.split('.')
              if (!_.has(this.form, item_models[0])) {
                this.$set(this.form, item_models[0], {})
              }
              this.$set(this.form, item_models[0], {})
              this.$set(this.form[item_models[0]], item_models[1], null)
              if (_.hasIn(item, 'rules')) {
                if (!_.hasIn(this.rules, item_models[0])) {
                  this.rules[item_models[0]] = {}
                }
                // this.rules[item_models[0]] = {}
                this.rules[item_models[0]][item_models[1]] = item.rules
              }
            // } else if (item.control === 'datetime') {
            //   this.$set(this.form, item.model, null)
            //   if (_.hasIn(item, 'rules')) this.rules[item.model] = item.rules
            } else if (item.control === 'cascaderval') {
              this.$set(this.form, item.control_options.value_path[item.control_options.value_path.length - 1], {})
              if (_.hasIn(item, 'rules')) {
                this.rules[item.model] = item.rules
              }
            // } else if (item.control === 'datetime') {
            //   this.$set(this.form, item.model, null)
            //   if (_.hasIn(item, 'rules')) this.rules[item.model] = item.rules
            } else if (item.control === 'upload') {
              this.$set(this.form, item.model, [])
            } else {
              if (item.value) {
                if (item.model.indexOf('.') > 0) {
                  item_models = item.model.split('.')
                  if (!_.has(this.form, item_models[0])) {
                    this.$set(this.form, item_models[0], {})
                  }
                  this.$set(this.form[item_models[0]], item_models[1], item.control === 'datetime' ? item.value : moment(item.value).format('YYYY-MM-DD HH:mm:ss'))
                } else {
                  this.$set(this.form, item.model, item.control === 'datetime' ? item.value : moment(item.value).format('YYYY-MM-DD HH:mm:ss'))
                }
              } else {
                if (item.model.indexOf('.') > 0) {
                  item_models = item.model.split('.')
                  if (!_.has(this.form, item_models[0])) {
                    this.$set(this.form, item_models[0], {})
                  }
                  this.$set(this.form[item_models[0]], item_models[1], null)
                } else {
                  this.$set(this.form, item.model, null)
                }
              }
              if (_.hasIn(item, 'rules')) {
                if (item.model.indexOf('.') > 0) {
                  item_models = item.model.split('.')
                  if (!_.hasIn(this.rules, item_models[0])) {
                    this.rules[item_models[0]] = {}
                  }
                  // this.rules[item_models[0]] = {}
                  this.rules[item_models[0]][item_models[1]] = item.rules
                } else {
                  this.rules[item.model] = item.rules
                }
              }
            }
          })
        })
        this.$set(this.form, this.formDefine.primary_column, null)
        this.dataReady = true
        await this.$nextTick(() => {
          this.ui_ready = true
        })
      })
    },
    open (editData) {
      let _this = this
      _this.editdata = this.formDefine.preprocess_data ? this.formDefine.preprocess_data(editData, 'data_init_form') : editData
      editData = _this.editdata
      if (editData) {
        this.initing_form_data = true
        _.each(this.formDefine.prop, (row) => {
          _.each(row, (item) => {
            let item_models
            if (item.control === 'select') {
              item_models = item.model.split('.')
              // _this.form[item_models[0]][item_models[1]] = editData[item_models[0]] ? (editData[item_models[0]][item_models[1]] === -1 ? null : editData[item_models[0]][item_models[1]]) : null
              this.$set(_this.form[item_models[0]], item_models[1], editData[item_models[0]] ? (editData[item_models[0]][item_models[1]] === -1 ? null : editData[item_models[0]][item_models[1]]) : null)
            } else if (item.control === 'multi-select') {
              this.form[item.model] = item['displayformat'] ? item['displayformat'](editData) : editData[item.model]
              this.form[item.model + '_obj_array'] = editData[item.model + '_obj_array']
            } else if (item.control === 'cascader') {
              item_models = item.model.split('.')
              _this.form[item_models[0]][item_models[1]] = editData[item_models[0]] ? editData : null
              // this.$set(this.form[item_models[0]], item_models[1], editData[item_models[0]] ? editData : null)
            } else if (item.control === 'datetime') {
              if (item.model.indexOf('.') > 0) {
                item_models = item.model.split('.')
                _this.form[item_models[0]][item_models[1]] = editData[item_models[0]] ? (editData[item_models[0]][item_models[1]] ? moment(editData[item_models[0]][item_models[1]]).format('YYYY-MM-DD HH:mm:ss') : null) : null
              } else {
                _this.form[item.model] = editData[item.model] ? moment(editData[item.model]).format('YYYY-MM-DD HH:mm:ss') : null
              }
            } else {
              if (item.model.indexOf('.') > 0) {
                item_models = item.model.split('.')
                _this.form[item_models[0]][item_models[1]] = item['displayformat'] ? item['displayformat'](editData) : editData[item_models[0]][item_models[1]].toString()
              } else {
                _this.form[item.model] = item['displayformat'] ? item['displayformat'](editData) : ((editData[item.model] || editData[item.model] === 0) ? (_.isNumber(editData[item.model]) ? editData[item.model].toString() : editData[item.model]) : (_.isArray(editData[item.model]) ? [] : ''))
              }
            }
          })
        })
        _this.form[this.formDefine.primary_column] = editData[this.formDefine.primary_column]
        _this.title = this.formDefine.title ? this.formDefine.title : this.formDefine.module_name + '-' + _this.$t('dialog.edit_title')
      } else {
        _this.setinitvalue()
        _this.title = this.formDefine.title ? this.formDefine.title : this.formDefine.module_name + '-' + _this.$t('dialog.add_title')
      }
      // _.each(this.formDefine.prop, (row) => {
      //   _.each(row, (item) => {
      //     item['readonly'] = _.isFunction(item['readonly']) ? item['readonly'](editData) : false
      //   })
      // })
      for (let key in _this.rules) {
        if (_.isArray(_this.rules[key])) {
          for (let rule of _this.rules[key].values()) {
            this.$set(rule, 'data', _this.$data)
          }
        }
      }
      this.beforeSavedata = null
      this.haveSaved = false
      this.show = true
    },
    handle_opend () {
    },
    handleCancel () {
      this.show = false
      this.closediag()
    },
    handleClose () {
      if (this.show) {
        this.show = false
      }
      if (this.haveSaved) {
        this.$emit('haveSaved', this.saved_data)
      }
      this.clearData()
    },
    clearData () {
      this.form_clearing = true
      //  let _this = this
      let hiddenset = []
      _.each(this.formDefine.prop, (row) => {
        _.each(row, (item) => {
          if (_.has(item, 'hidden') && item['hidden']) hiddenset.push(item['key'])
        })
      })
      let save_after_func = this.formDefine['save_after'] || this.formDefine['saveAfter']
      if (save_after_func) {
        save_after_func(hiddenset, this.form, this.beforeSavedata)
      } else {
        for (let key in this.form) {
          if (_.findIndex(hiddenset, function (o) { return o === key }) > -1) continue
          if (_.isArray(this.form[key])) {
            this.$set(this.form, key, [])
          } else if (_.isObject(this.form[key])) {
            _.each(_.keys(this.form[key]), (item_key) => {
              this.$set(this.form[key], item_key, -1)
              this.$nextTick(() => {
                this.form_object_item_clearing = true
                this.$set(this.form[key], item_key, null)
                this.$nextTick(() => {
                  this.form_object_item_clearing = false
                })
              })
            })
          } else {
            this.$set(this.form, key, null)
          }
        }
      }
      this.$nextTick(() => {
        this.form_clearing = false
      })
      this.clear_affect()
    },
    async handleSave () {
      if (this.doSaving) {
        return
      }
      this.beforeSavedata = _.cloneDeep(this.form)
      this.doSaving = true
      this.form.editor_id = this.$session.get('loginstate') && this.$session.get('loginstate').user && this.$session.get('loginstate').user.code ? this.$session.get('loginstate').user.code : '9999'
      this.form.editor = {code: this.form.editor_id}
      this.form.updateEditor = this.form.editor_id
      this.$refs['form'].validate(async (valid) => {
        if (valid) {
          let before_save = null
          let dataToSave = _.clone(this.form)
          if (this.before_save) {
            before_save = await this.before_save(this.editdata, dataToSave, this.$data)
          }
          if (this.before_save && !before_save) {
            this.doSaving = false
            return false
          }
          _.each(this.formDefine.prop, (row) => {
            _.each(row, (item) => {
              if (_.isFunction(item['inputconvert'])) dataToSave[item['key']] = item['inputconvert'](dataToSave[item['key']])
              if (item.control === 'select') {
              } else if (item.control === 'cascader') {
              } else if (item.control === 'datetime') {
              } else if (item.model.indexOf('.') > 0) {
              } else {
                dataToSave[item.model] = dataToSave[item.model] ? (_.isObject(dataToSave[item.model]) ? dataToSave[item.model] : String(dataToSave[item.model]).trim()) : ''
              }
            })
          })
          let data_to_save = {}
          if (_.hasIn(this.formDefine, 'create_add_params')) {
            _.merge(data_to_save, this.formDefine['create_add_params'])
          }
          _.mergeWith(data_to_save, this.editdata, dataToSave, (objValue, srcValue) => {
            if (_.isArray(objValue)) {
              return srcValue
            }
          })
          _.each(this.formDefine.prop, (row) => {
            _.each(row, (item) => {
              let item_models
              if (item.control === 'select') {
                item_models = item.model.split('.')
                if (!dataToSave[item_models[0]] || !dataToSave[item_models[0]][item_models[1]]) {
                  delete data_to_save[item_models[0]]
                }
              } else if (item.control === 'cascader') {
                item_models = item.model.split('.')
                if (!dataToSave[item_models[0]] || !dataToSave[item_models[0]][item_models[1]]) {
                  delete data_to_save[item_models[0]]
                }
              } else if (item.control === 'datetime') {
                if (item.model.indexOf('.') > 0) {
                  item_models = item.model.split('.')
                  if (!dataToSave[item_models[0]] || !dataToSave[item_models[0]][item_models[1]]) {
                    delete data_to_save[item_models[0]]
                  }
                } else {
                  if (!dataToSave[item.model]) {
                    delete data_to_save[item.model]
                  }
                }
              } else if (item.model.indexOf('.') > 0) {
                item_models = item.model.split('.')
                if (!dataToSave[item_models[0]] || (!dataToSave[item_models[0]][item_models[1]] && (item_models[1] === 'id' || item_models[1] === 'code'))) {
                  delete data_to_save[item_models[0]]
                }
              } else {
                if (!dataToSave[item.model]) {
                  delete data_to_save[item.model]
                } else if ((_.isArray(dataToSave[item.model]) && dataToSave[item.model].length === 0)) {
                  data_to_save[item.model] = []
                }
              }
            })
          })
          if (this.formDefine.preprocess_data) { data_to_save = this.formDefine.preprocess_data(data_to_save, this.editdata ? 'data_to_save' : 'data_to_create') }
          if (this.editdata && this.editdata[this.formDefine.primary_column]) {
            try {
              if (this.formDefine.save_api) {
                await this.$axios(this.formDefine.save_api.api_path + data_to_save[this.formDefine.primary_column], this.formDefine.save_api.req_type, data_to_save)
              } else if (this.formDefine.controller_path) {
                await this.$axios(this.formDefine.controller_path + 'updateById/' + data_to_save[this.formDefine.primary_column], 'put', data_to_save)
              } else {
                await this.$maintain_service_agent(this.entity, 'updateById/' + data_to_save[this.formDefine.primary_column], 'put', data_to_save)
              }
            } catch (error) {
              this.doSaving = false
              return
            }
            this.saved_data = data_to_save
            this.haveSaved = true
            this.show = false
          } else {
            try {
              let saved_data
              if (this.formDefine.add_api) {
                saved_data = await this.$axios(this.formDefine.add_api.api_path, this.formDefine.add_api.req_type, data_to_save)
              } else if (this.formDefine.controller_path) {
                saved_data = await this.$axios(this.formDefine.controller_path + 'create', 'post', data_to_save)
              } else {
                saved_data = await this.$maintain_service_agent(this.entity, 'create', 'post', data_to_save)
              }
              this.saved_data = saved_data.data
            } catch (error) {
              this.doSaving = false
              return
            }
            this.haveSaved = true
            let _this = this
            if (_.has(this.formDefine, 'new_anather') && !this.formDefine['new_anather']) {
              this.clearData()
              this.show = false
              this.doSaving = false
              return
            }
            try {
              await this.$ii_message('confirm', _this.$t('msg.confirm.new_anather'))
              this.handlenewAnother()
              this.clearData()
              this.doSaving = false
              this.$nextTick(() => {
                window.setTimeout(() => {
                  this.setinitvalue()
                  this.$refs['form'].clearValidate()
                }, 0)
              })
            } catch (error) {
              this.clearData()
              this.doSaving = false
              this.show = false
            }
          }
          this.doSaving = false
        } else {
          this.doSaving = false
        }
      })
    }
  },
  watch: {
    form: {
      handler: function (val) {
        if (this.ui_ready && !this.form_clearing && !this.form_object_item_clearing) {
          this.$nextTick(() => {
            this.change_affect(val, this.clonedata)
            this.clonedata = _.cloneDeep(this.form)
          })
        } else {
          this.clonedata = _.cloneDeep(this.form)
        }
      },
      deep: true,
      immediate: true
    }
  }
}
</script>

<!-- Add "scoped" attribute to limit CSS to this component only -->
<style scoped>
</style>
