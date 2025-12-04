import api from './api'

export const payrollService = {
  getPayrolls: async (params = {}) => {
    const response = await api.get('/penggajian', { params })
    return response.data
  },

  getPayrollById: async (id) => {
    const response = await api.get(`/penggajian/${id}`)
    return response.data
  },

  generatePayroll: async (month, year) => {
    const response = await api.post('/penggajian/buat', { month, year })
    return response.data
  },

  updatePayroll: async (id, data) => {
    const response = await api.put(`/penggajian/${id}`, data)
    return response.data
  },

  processPayment: async (id) => {
    const response = await api.post(`/penggajian/${id}/proses-pembayaran`)
    return response.data
  },

  getPayrollSummary: async (month, year) => {
    const response = await api.get('/penggajian/ringkasan', {
      params: { month, year },
    })
    return response.data
  },

  downloadPayrollSlip: async (id) => {
    try {
      console.log('📡 [API] Requesting payroll slip download for ID:', id)
      const response = await api.get(`/penggajian/${id}/unduh`, {
        responseType: 'blob',
      })
      console.log('📡 [API] Payroll slip response received:', {
        size: response.data?.size || 'unknown',
        type: response.data?.type || 'unknown',
        status: response.status,
        headers: response.headers
      })
      return response.data
    } catch (error) {
      console.error('❌ [API] Failed to download payroll slip:', {
        id,
        status: error.response?.status,
        statusText: error.response?.statusText,
        data: error.response?.data,
        message: error.message
      })
      throw error
    }
  },
}
