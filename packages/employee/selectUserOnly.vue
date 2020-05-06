<template>
    <div>
       <ii-dialog v-dialogDrag title='Add User' :visible="visible"
            :modal="true" top="0" :close-on-click-modal="false"
            :show-close='false' @open= 'handleOpen' @close= 'handleClose' class="dialogwidth2">
          <div class="filters">
          <el-form ref="department" :model="form" label-width="100px">
              <ii-row>
                  <ii-col :span="18">
                    <el-form-item :label='$t("role.company")'>
                        <el-select v-model="form.company" style="width:100%">
                            <el-option
                            v-for="item in companyOptions"
                            :key="item"
                            :label="item"
                            :value="item">
                            </el-option>
                        </el-select>
                    </el-form-item>
                  </ii-col>
              </ii-row>
              <ii-row>
                  <ii-col :span="18">
                    <el-form-item :label='$t("role.department")'>
                        <el-select v-model="form.department" style="width:100%">
                            <el-option
                            v-for="item in departmentOptions"
                            :key="item.id"
                            :label="item.name"
                            :value="item.id">
                            </el-option>
                        </el-select>
                    </el-form-item>
                  </ii-col>
              </ii-row>
              <ii-row>
                  <ii-col :span="18">
                    <el-form-item :label='$t("role.search")'>
                    <ii-input v-model="form.search"></ii-input>
                    </el-form-item>
                  </ii-col>
                  <ii-col :xs="24" :sm="6" :md="6" :lg="6" :offset = "0" style="text-align: right">
                    <ii-button type="primary" @click="fetchUserData">{{$t("button.search")}}</ii-button>
                </ii-col>
              </ii-row>
          </el-form>
            </div>
          <ii-row>
            <ii-col :span="24">
                <ii-table :data="users" ref="table" height="200" stripe border style="width: 100%"
                    v-loading.body="loading"
                    :highlight-current-row= "true"
                    @selection-change="handleMultiSelectionChange"
                    @row-click="handleSelectionChange">
                    <ii-table-column v-if="multiSelect" width= "40" type="selection" class-name="select_box">
                    </ii-table-column>
                    <ii-table-column prop="name" :label='$t("role.name")' min-width= "140">
                    </ii-table-column>
                    <ii-table-column prop="code" :label='$t("role.login")' min-width= "100">
                    </ii-table-column>
                </ii-table>
            </ii-col>
          </ii-row>
          <div slot="footer" class="dialog-footer">
            <ii-button type="text" @click="handleCancel">{{$t('button.cancel')}}</ii-button>
            <ii-button type="primary" @click="handleSelect">{{$t('button.ok')}}</ii-button>
          </div>
          <Confirm ref="Error" type="error"></Confirm>
      </ii-dialog>
  </div>
</template>
<style lang="css">

  .ii-button + .ii-button
  {
      margin-left: 0px;
  }

  .ii-dialog--customer
  {
    width: 50%
  }
</style>
<i18n>
{
  "en": {
  },
  "cn": {
    "button": {
      "cancel": "取消",
      "ok": "确定",
      "search": "查询"
    },
    "role": {
      "name": "名称",
      "code": "登录名",
      "company": "公司",
      "department": "部门",
      "search": "关键字",
      "searchbutton": "查询",
      "login": "登陆名"
    },
    "msg": {
      "selectUser": "请先选择用户"
    }
  }
}
</i18n>
<script>
import Vue from 'vue'
import Confirm from '@/components/MessageBox'
import {
  // fetchDomain,
  fetchCompaniesByDomain,
  fetchDeptsByCompany,
  fetchUsersByDepartment
} from './api'
Vue.component('Confirm', Confirm)
export default {
  name: 'mltSelectuserOnly',
  props: {
    multiSelect: {
      type: Boolean,
      default: false
    }
  },
  data () {
    return {
      visible: false,
      domainOptions: [],
      companyOptions: [],
      departmentOptions: [],
      department: [],
      users: [],
      selectedUser: '',
      multipleSelectedSelection: [],
      loading: false,
      form: {
        domain: '',
        company: '',
        department: '',
        search: ''
      }
    }
  },
  computed: {
  },
  methods: {
    handleSelectionChange (currentRow, oldRow) {
      this.selectedUser = currentRow
    },
    handleMultiSelectionChange (val) {
      this.multipleSelectedSelection = val
    },
    handleSelect () {
      let _this = this
      if ((this.multiSelect && this.multipleSelectedSelection.length === 0) || (!this.multiSelect && !this.selectedUser)) {
        _this.$refs.Error.open(_this.$t('msg.selectUser')).then(function (data) {
          // 确认操作
          console.log('error')
        }).catch(error => {
          // 取消和异常操作
          console.log(error)
        })
        return
      }
      this.visible = false
      this.$emit('select', this.multiSelect ? this.multipleSelectedSelection : this.selectedUser)
    },
    handleCancel () {
      this.visible = false
      this.$emit('cancel')
    },
    handleOpen () {
      this.clear()
      // this.fetchData()
    },
    handleClose () {
      // this.resetForm()
      this.visible = false
      this.loading = false
    },
    // fetchDomainData () {
    //   fetchDomain().then((res) => {
    //     this.domainOptions = res.data
    //   })
    // },
    fetchCompanyData (val) {
      fetchCompaniesByDomain(val).then((res) => {
        this.companyOptions = res.data
      })
    },
    fetchDepartmentData () {
      fetchDeptsByCompany({company: this.form.company}).then((res) => {
        this.departmentOptions = res.data
      })
    },
    fetchUserData () {
      var _this = this
      if (!this.form.department) {
        return
      }
      this.loading = true
      fetchUsersByDepartment({department: this.form.department, keyword: this.form.search}).then((res) => {
        this.$refs.table.clearSelection()
        this.users = res.data
        this.loading = false
      }).catch(function (error) {
        this.loading = false
        _this.$refs.Error.open(error.message).then(function (data) {
          // 确认操作
          console.log('error')
        }).catch(error => {
          // 取消和异常操作
          console.log(error)
        })
        /* _this.$notify.error({
          title: 'error',
          message: error.message,
          offset: 40,
          duration: 0
        }) */
      })
    },
    resetForm () {
      // this.$refs['form'].resetFields()
    },
    clear () {
      // this.companyOptions = []
      this.departmentOptions = []
      this.selectedUser = ''
      this.department = []
      this.users = []
      this.loading = false
      this.form = {
        domain: '',
        company: '',
        department: '',
        search: ''
      }
    },
    open () {
      this.visible = true
    }
  },
  mounted () {
    // this.fetchDomainData()
    this.fetchCompanyData()
  },
  watch: {
    // 'form.domain' (val) {
    //   this.form.company = ''
    //   // this.departments = []
    //   this.fetchCompanyData(val)
    // },
    'form.company' (val) {
      this.form.department = ''
      this.fetchDepartmentData()
    },
    'form.department' (val) {
      this.$refs.table.clearSelection()
      this.users = []
      this.fetchUserData()
    }
  }
}
</script>
