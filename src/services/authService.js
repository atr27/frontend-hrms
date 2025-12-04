import api from './api'

export const authService = {
  login: async (email, password) => {
    const response = await api.post('/otentikasi/masuk', { email, password })
    return response.data
  },

  logout: async () => {
    await api.post('/otentikasi/keluar')
  },

  getProfile: async () => {
    const response = await api.get('/otentikasi/profil')
    return response.data
  },

  changePassword: async (oldPassword, newPassword) => {
    const response = await api.post('/otentikasi/ubah-kata-sandi', {
      old_password: oldPassword,
      new_password: newPassword,
    })
    return response.data
  },
}
