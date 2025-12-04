import api from './api'

export const departmentService = {
  getDepartments: async () => {
    const response = await api.get('/departemen')
    return response.data
  },

  getDepartmentById: async (id) => {
    const response = await api.get(`/departemen/${id}`)
    return response.data
  },

  createDepartment: async (data) => {
    const response = await api.post('/departemen', data)
    return response.data
  },

  updateDepartment: async (id, data) => {
    const response = await api.put(`/departemen/${id}`, data)
    return response.data
  },

  deleteDepartment: async (id) => {
    const response = await api.delete(`/departemen/${id}`)
    return response.data
  },
}
