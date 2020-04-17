<template>
  <ii-draggable-dialog :close-on-click-modal="false" @closed="closediag()" :top="top+'vh'"  :visible="show" :title="title" :width="formDefine.width ? formDefine.width : '600px'" @close="handleClose" class="viewinfor">
    <el-form :model="form" v-if="dataReady" :rules="rules" ref="form" :label-width="formDefine.labelWidth">
      <el-row v-for="(row, index) in fromprop" :key="'formRow' + index">
          <el-col v-for="item in row" v-if="!item.hidden" :span="item.span" :key="item.key">
            <el-form-item :label='item.getdefinelable ? item.getdefinelable($data) :getItemLabel(item)' v-if="String(item.control).toLowerCase().indexOf('select') === -1 && !item.disenable" :prop="item.key">
              <el-row v-if="item.control === 'input'">
                <el-col :span="item.unit ? 23 :24">
                  <el-input :disabled="item.onlyread || item.disenable" v-model="form[item.key]"></el-input>
                </el-col>
                <el-col :span="1" justify="end" v-if="item.unit">
                  <span>{{item.unit($data)}}</span>
                </el-col>
              </el-row>
              <el-input :disabled="item.onlyread || item.disenable" type="textarea" :rows="4" v-if="item.control === 'textarea'" v-model="form[item.key]"></el-input>
              <el-date-picker :disabled="item.onlyread || item.disenable" v-if="item.control === 'datetime'" value-format="yyyy-MM-dd HH:mm:ss" v-model="form[item.key]" type="datetime" placeholder=""></el-date-picker>
              <el-date-picker :disabled="item.onlyread || item.disenable" v-if="item.control === 'date'"  value-format="yyyy-MM-dd" v-model="form[item.key]" type="date" placeholder=""></el-date-picker>
            </el-form-item>
            <el-form-item :label='getItemLabel(item)' v-if="item.control === 'select'" :prop="item.key+'.id'">
              <ii-select :disabled="item.onlyread || item.disenable" v-model="form[item.key].id" :valueObj.sync="singleselectonj"  :initOptions="item" :ref="item.key" v-if="item.control === 'select'" ></ii-select>
           </el-form-item>
            <el-form-item :label='getItemLabel(item)' v-if="item.control === 'selectval'" :prop="item.key">
              <ii-select :disabled="item.onlyread || item.disenable" v-model="form[item.key]" :valueObj.sync="singleselectonj"  :initOptions="item" v-if="item.control === 'selectval'" ></ii-select>
           </el-form-item>
            <el-form-item :label='getItemLabel(item)' v-if="item.control ==='cascaderSelect'" :prop="item.correctcascadesname ? item.correctcascadesname + '.id' : item.key + '.id'">
              <ii-cascader :disabled="item.onlyread || item.disenable" v-model="form[item.correctcascadesname ? item.correctcascadesname : item.key].id" :initOptions="item" v-if="item.control === 'cascaderSelect'"></ii-cascader>
            </el-form-item>
         </el-col>
      </el-row>
    </el-form>
    <span slot="footer" class="dialog-footer">
      <el-button type="text" @click="handleCancel()">{{$t('button.cancel')}}</el-button>
      <el-button type="primary" @click="handleSave()">{{$t('button.save')}}</el-button>
    </span>
  </ii-draggable-dialog>
</template>

<script>
import Vue from 'vue'
import _ from 'lodash'
import moment from 'moment'
import IiDraggableDialog from '../../draggable-dialog'
import IiSelect from '../../single-select'
import Iicascader from '../../cascader'
export default {
  name: 'IiEditForm',
  components: {
    IiSelect,
    Iicascader
  },
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
      dataReady: false,
      title: '',
      form: {},
      rules: {},
      haveSaved: false,
      fromprop: this.formDefine.prop,
      clonedata: null,
      beforesave: this.formDefine.beforeSave ? this.formDefine.beforeSave : null,
      editdata: null,
      singleselectonj: null,
      cascaderselect: null,
      doSaving: false,
      beforeSavedata: null
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
          let correctcascadesname = item.correctcascadesname ? item.correctcascadesname : item.key
          if (_.hasIn(item, 'default')) {
            if (item.control === 'select') {
              this.form[item.key]['id'] = String(item.default) === '0' ? String(item.default) : item.default
            } else if (item.control === 'cascaderSelect') {
              this.form[correctcascadesname]['id'] = String(item.default) === '0' ? String(item.default) : item.default
            } else {
              this.form[item.key] = String(item.default) === '0' ? String(item.default) : item.default
            }
          }
        })
      })
      this.clonedata = _.cloneDeep(this.form)
    },
    handlenewAnother () {
      if (!this.formDefine['saveAfter']) {
        _.each(this.formDefine.prop, (row) => {
          _.each(row, (item) => {
            if (item['onlyread']) delete item['onlyread']
          })
        })
      }
      this.$refs['form'].clearValidate()
      this.editdata = null
      this.doSaving = false
    },
    closediag () {
      _.each(this.formDefine.prop, (row) => {
        _.each(row, (item) => {
          if (item['onlyread']) delete item['onlyread']
        })
      })
      this.$refs['form'].clearValidate()
      this.editdata = null
      this.doSaving = false
    },
    setdisenable (newdata, olddata) {
      let _this = this
      if (olddata && !_.isEqual(newdata, olddata)) {
        _.forIn(newdata, function (value, key) {
          if (!_.isEqual(newdata[key], olddata[key])) {
            _.forEach(_this.fromprop, function (v1, k1) {
              _.forEach(v1, function (v2, k2) {
                if (_.hasIn(v2, 'disenbaledep') && v2['disenbaledep']['control'] && v2['disenbaledep']['key'] === key) {
                  let result = false
                  if (_.isFunction(v2['disenbaledep']['getdepend'])) {
                    let getfunc = v2['disenbaledep']['getdepend']
                    let targetobj = String(v2['disenbaledep']['control']).includes('select') ? _this.singleselectonj : value
                    result = getfunc(targetobj)
                  }
                  _this.$set(v2, 'disenable', result)
                  return false
                }
              })
            })
          }
        })
      }
    },
    recreateLayout () {
      this.form = {}
      this.createLayout()
    },
    createLayout () {
      this.dataReady = false
      this.$nextTick(() => {
        _.each(this.formDefine.prop, (row) => {
          _.each(row, (item) => {
            let correctcascadesname = item.correctcascadesname ? item.correctcascadesname : item.key
            this.rules['disenable'] = false
            if (item.control === 'select') {
              this.$set(this.form, item.key, {})
              this.$set(this.form[item.key], 'id', null)
              this.rules[item.key] = {}
              this.form[item.key]['id'] = item.default ? item.default : null
              if (_.hasIn(item, 'rules')) this.rules[item.key]['id'] = item.rules
              // 添加监视器
              if (_.hasIn(item, 'watcher')) this.$watch(item['watcher']['exps'], (newVal, oldVal) => { item['watcher']['func'](newVal, oldVal, item) }, {immediate: true})
            } else if (item.control === 'cascaderSelect') {
              this.$set(this.form, correctcascadesname, {})
              this.$set(this.form[correctcascadesname], 'id', null)
              if (_.hasIn(item, 'rules')) this.rules[item.correctcascadesname ? item.correctcascadesname : item.key] = {id: item.rules}
            } else if (item.control === 'datetime') {
              this.$set(this.form, item.key, null)
              if (_.hasIn(item, 'rules')) this.rules[item.key] = item.rules
            } else {
              if (item.value) {
                if (item.entity) {
                  this.form[correctcascadesname] = {}
                  this.form[correctcascadesname]['id'] = item.value
                } else {
                  this.$set(this.form, item.key, item.value)
                }
              } else {
                this.$set(this.form, correctcascadesname, null)
              }
              if (_.hasIn(item, 'rules')) {
                this.rules[item.key] = item.rules
              }
            }
          })
        })
        this.$set(this.form, 'id', null)
        this.dataReady = true
      })
    },
    open (editData) {
      let _this = this
      _this.editdata = editData
      if (editData) {
        _.each(this.formDefine.prop, (row) => {
          _.each(row, (item) => {
            if (item.control === 'select') {
              this.form[item.key]['id'] = editData[item.key] ? (editData[item.key]['id'] === -1 ? null : editData[item.key]['id']) : null
            } else if (item.control === 'cascaderSelect') {
              let correctcascadesname = item.correctcascadesname ? item.correctcascadesname : item.key
              this.form[correctcascadesname]['id'] = editData[correctcascadesname] ? editData : null
            } else if (item.control === 'datetime') {
              this.form[item.key] = editData[item.key] ? moment(editData[item.key]).format('YYYY-MM-DD HH:mm:ss') : null
            } else {
              _this.form[item.key] = item['displayformat'] ? item['displayformat'](editData) : editData[item.key]
            }
          })
        })
        this.form.id = editData.id
        this.title = this.$t(this.entity + '.moduleName') + '-' + this.$t('basic.editDailogTitle')
      } else {
        this.setinitvalue()
        this.title = this.$t(this.entity + '.moduleName') + '-' + this.$t('basic.addDailogTitle')
      }
      _.each(this.formDefine.prop, (row) => {
        _.each(row, (item) => {
          item['onlyread'] = _.isFunction(item['readonly']) ? item['readonly'](editData) : false
        })
      })
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
    handleCancel () {
      this.show = false
      this.closediag()
    },
    handleClose () {
      if (this.show) {
        this.show = false
      }
      if (this.haveSaved) {
        this.$emit('haveSaved')
      }
      this.clearData()
    },
    clearData () {
      //  let _this = this
      let hiddenset = []
      _.each(this.formDefine.prop, (row) => {
        _.each(row, (item) => {
          if (_.has(item, 'hidden') && item['hidden']) hiddenset.push(item['key'])
        })
      })
      if (this.formDefine['saveAfter']) {
        this.formDefine['saveAfter'](hiddenset, this.form, this.beforeSavedata)
      } else {
        for (let key in this.form) {
          if (_.findIndex(hiddenset, function (o) { return o === key }) > -1) continue
          if (_.isObject(this.form[key])) {
            this.$set(this.form[key], 'id', -1)
            this.$nextTick(() => {
              this.$set(this.form[key], 'id', null)
            })
          } else {
            this.form[key] = null
          }
        }
      }
    },
    async handleSave () {
      if (this.doSaving) {
        return
      }
      this.beforeSavedata = _.clone(this.form)
      this.doSaving = true
      this.form.editor_id = this.$session.get('loginstate').user.code ? this.$session.get('loginstate').user.code : '9999'
      this.$refs['form'].validate(async (valid) => {
        if (valid) {
          let beforesave = null
          if (this.beforesave) {
            beforesave = await this.beforesave(this.editdata, this.form, this.$data)
          }
          let dataToSave = _.clone(this.form)
          if (this.beforesave && !beforesave) {
            this.doSaving = false
            return false
          }
          _.each(this.formDefine.prop, (row) => {
            _.each(row, (item) => {
              if (_.isFunction(item['inputconvert'])) dataToSave[item['key']] = item['inputconvert'](dataToSave[item['key']])
              if (item.control === 'select') {
                if (!dataToSave[item.key]['id']) {
                  delete dataToSave[item.key]
                }
              } else if (item.control === 'cascaderSelect') {
                let correctcascadesname = item.correctcascadesname ? item.correctcascadesname : item.key
                if (!dataToSave[correctcascadesname]['id']) {
                  delete dataToSave[correctcascadesname]
                }
              } else if (item.control === 'datetime') {
                if (!dataToSave[item.key]) {
                  delete dataToSave[item.key]
                }
              } else {
                dataToSave[item.key] = dataToSave[item.key] ? (_.isObject(dataToSave[item.key]) ? dataToSave[item.key] : String(dataToSave[item.key]).trim()) : null
              }
            })
          })
          if (!this.editdata && _.hasIn(this.formDefine, 'initparams')) {
            dataToSave[this.formDefine['initparams'].key] = this.formDefine['initparams'].value
          }
          if (this.form.id) {
            await this.$maintain_service_agent(this.entity, 'updateById/' + this.form.id, 'put', dataToSave)
            this.haveSaved = true
            this.show = false
          } else {
            await this.$maintain_service_agent(this.entity, 'create', 'post', dataToSave)
            this.haveSaved = true
            let _this = this
            if (_.has(this.formDefine, 'newAnather') && !this.formDefine['newAnather']) {
              this.clearData()
              this.show = false
              this.doSaving = false
              return
            }
            try {
              await this.$defmsgbox('confirm', _this.$t('confirmMsg.newAnather'))
              this.handlenewAnother()
              this.clearData()
              this.doSaving = false
              this.$nextTick(() => {
                window.setTimeout(() => {
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
    },
    getItemLabel (item) {
      if (item.control === 'cascaderSelect') {
        return this.$t(item.key + '.' + item.label)
      } else {
        return item.entity
          ? (item.correctLabel ? this.$t(this.entity + '.' + item.correctLabel) : this.$t(item.key + '.' + item.label))
          : this.$t(this.entity + '.' + item.key)
      }
    }
  },
  watch: {
    form: {
      handler: function (val) {
        this.setdisenable(val, this.clonedata)
        this.clonedata = _.cloneDeep(this.form)
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
