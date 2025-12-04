import { BrowserRouter as Router, Routes, Route, Navigate } from 'react-router-dom'
import { Toaster } from 'react-hot-toast'
import { useAuthStore } from './store/authStore'

// Pages
import Login from './pages/Login'
import Dashboard from './pages/Dashboard'
import Employees from './pages/Employees'
import Attendance from './pages/Attendance'
import Leaves from './pages/Leaves'
import Payroll from './pages/Payroll'
import NotFound from './pages/NotFound'

// Layouts
import MainLayout from './layouts/MainLayout'

// Protected Route Component
const ProtectedRoute = ({ children }) => {
  const { token } = useAuthStore()
  return token ? children : <Navigate to="/masuk" replace />
}

function App() {
  return (
    <>
      <Router>
        <Routes>
          <Route path="/masuk" element={<Login />} />

          <Route path="/" element={
            <ProtectedRoute>
              <MainLayout />
            </ProtectedRoute>
          }>
            <Route index element={<Navigate to="/dasbor" replace />} />
            <Route path="dasbor" element={<Dashboard />} />
            <Route path="karyawan" element={<Employees />} />
            <Route path="kehadiran" element={<Attendance />} />
            <Route path="cuti" element={<Leaves />} />
            <Route path="penggajian" element={<Payroll />} />
          </Route>

          <Route path="*" element={<NotFound />} />
        </Routes>
      </Router>
      <Toaster position="top-right" />
    </>
  )
}

export default App
