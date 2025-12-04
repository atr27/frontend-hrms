import api from './api'

export const leaveService = {
  getLeaves: async (params = {}) => {
    const response = await api.get('/cuti', { params })
    return response.data
  },

  getLeaveById: async (id) => {
    const response = await api.get(`/cuti/${id}`)
    return response.data
  },

  createLeave: async (data) => {
    const response = await api.post('/cuti', data)
    return response.data
  },

  approveLeave: async (id, status) => {
    const response = await api.put(`/cuti/${id}/setujui`, { status })
    return response.data
  },

  getLeaveBalance: async (employeeId) => {
    const response = await api.get(`/cuti/saldo/${employeeId}`)
    return response.data
  },
}
