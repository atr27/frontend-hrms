import axios from 'axios'

const API_BASE_URL = import.meta.env.VITE_API_BASE_URL || 'http://localhost:8080/api/v1'

const api = axios.create({
  baseURL: API_BASE_URL,
  headers: {
    'Content-Type': 'application/json',
  },
})

// Request interceptor
api.interceptors.request.use(
  (config) => {
    const token = localStorage.getItem('token')
    if (token) {
      config.headers.Authorization = `Bearer ${token}`
    }
    return config
  },
  (error) => {
    return Promise.reject(error)
  }
)

// Response interceptor
api.interceptors.response.use(
  (response) => {
    // Debug logging for download requests
    if (response.config.url?.includes('/unduh')) {
      console.log('🔍 [API Interceptor] Download response:', {
        url: response.config.url,
        responseType: response.config.responseType,
        isBlob: response.data instanceof Blob,
        hasData: !!response.data
      })
    }

    // For blob responses (file downloads), return the full response object
    // because we need access to headers and the blob data
    if (response.config.responseType === 'blob') {
      return response
    }

    // For JSON responses, backend returns: {success: true, data: [...], message: "..."}
    // We want to return just the data part for easier consumption
    return response.data
  },
  (error) => {
    if (error.response?.status === 401) {
      localStorage.removeItem('token')
      localStorage.removeItem('user')
      window.location.href = '/masuk'
    }
    return Promise.reject(error.response?.data || error.message)
  }
)

export default api
