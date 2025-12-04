import api from './api'

export const employeeService = {
  getEmployees: async (params = {}) => {
    const response = await api.get('/karyawan', { params })
    return response.data
  },

  getEmployeeById: async (id) => {
    const response = await api.get(`/karyawan/${id}`)
    return response.data
  },

  createEmployee: async (data) => {
    const response = await api.post('/karyawan', data)
    return response.data
  },

  updateEmployee: async (id, data) => {
    const response = await api.put(`/karyawan/${id}`, data)
    return response.data
  },

  deleteEmployee: async (id) => {
    const response = await api.delete(`/karyawan/${id}`)
    return response.data
  },

  generateEmployeeCode: async () => {
    const response = await api.get('/karyawan/buat-kode')
    return response.data
  },

  getDashboardStats: async () => {
    const response = await api.get('/dasbor/statistik')
    return response.data
  },
}
