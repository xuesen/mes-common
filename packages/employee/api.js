import axios from 'axios'
let base = './usermanagementservice'
export const fetchCompaniesByDomain = params => { return axios.post(`${base}/department/findcompanys`, {}) }
export const fetchDeptsByCompany = params => { return axios.post(`${base}/department/findEnabled`, params) }
export const fetchUsersByDepartment = params => {
  let url = `${base}/employee/findEnabled`
  let searchCondition = {}
  if (params.keyword) {
    searchCondition.name = params.keyword
    url = `${base}/employee/findEnabledWhereLike`
  }
  if (params.department) {
    searchCondition.cascades = [{entity: 'department', condittion: {id: params.department}}]
  }
  return axios.post(url, searchCondition)
}
