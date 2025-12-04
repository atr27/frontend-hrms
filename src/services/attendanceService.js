import api from './api'

export const attendanceService = {
  clockIn: async (employeeId, date, clockIn) => {
    const response = await api.post('/kehadiran/absen-masuk', {
      employee_id: employeeId,
      date,
      clock_in: clockIn,
    })
    return response.data
  },

  clockOut: async (employeeId, date, clockOut) => {
    const response = await api.post('/kehadiran/absen-keluar', {
      employee_id: employeeId,
      date,
      clock_out: clockOut,
    })
    return response.data
  },

  getAttendance: async (params = {}) => {
    const response = await api.get('/kehadiran', { params })
    return response.data
  },

  getAttendanceReport: async (startDate, endDate) => {
    const response = await api.get('/kehadiran/laporan', {
      params: { start_date: startDate, end_date: endDate },
    })
    return response.data
  },

  createManualAttendance: async (data) => {
    const response = await api.post('/kehadiran/manual', data)
    return response.data
  },
}
