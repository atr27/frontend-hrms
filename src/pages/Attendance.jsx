import { useEffect, useState } from 'react'
import { attendanceService } from '../services/attendanceService'
import { employeeService } from '../services/employeeService'
import toast from 'react-hot-toast'
import { Clock, Calendar } from 'lucide-react'
import { format } from 'date-fns'

const Attendance = () => {
  const [attendances, setAttendances] = useState([])
  const [employees, setEmployees] = useState([])
  const [loading, setLoading] = useState(true)
  const [selectedEmployee, setSelectedEmployee] = useState('')
  const [month, setMonth] = useState(new Date().getMonth() + 1)
  const [year, setYear] = useState(new Date().getFullYear())

  useEffect(() => {
    loadEmployees()
  }, [])

  useEffect(() => {
    if (selectedEmployee) {
      loadAttendance()
    }
  }, [selectedEmployee, month, year])

  const loadEmployees = async () => {
    try {
      const response = await employeeService.getEmployees({ limit: 100 })
      // Handle both response formats
      const employeesData = Array.isArray(response) ? response : (response.data || [])
      setEmployees(employeesData)
    } catch (error) {
      toast.error('Gagal memuat karyawan')
    } finally {
      setLoading(false)
    }
  }

  const loadAttendance = async () => {
    try {
      setLoading(true)
      const response = await attendanceService.getAttendance({
        employee_id: selectedEmployee,
        month,
        year,
      })
      // Handle both response formats
      const attendanceData = Array.isArray(response) ? response : (response.data || [])
      setAttendances(attendanceData)
    } catch (error) {
      toast.error('Gagal memuat kehadiran')
    } finally {
      setLoading(false)
    }
  }

  const handleClockIn = async () => {
    if (!selectedEmployee) {
      toast.error('Silakan pilih karyawan')
      return
    }

    try {
      const now = new Date()
      await attendanceService.clockIn(
        parseInt(selectedEmployee),
        format(now, 'yyyy-MM-dd'),
        now.toISOString()
      )
      toast.success('Berhasil absen masuk')
      loadAttendance()
    } catch (error) {
      toast.error(error.error?.message || 'Gagal absen masuk')
    }
  }

  const handleClockOut = async () => {
    if (!selectedEmployee) {
      toast.error('Silakan pilih karyawan')
      return
    }

    try {
      const now = new Date()
      await attendanceService.clockOut(
        parseInt(selectedEmployee),
        format(now, 'yyyy-MM-dd'),
        now.toISOString()
      )
      toast.success('Berhasil absen keluar')
      loadAttendance()
    } catch (error) {
      toast.error(error.error?.message || 'Gagal absen keluar')
    }
  }

  return (
    <div>
      <div className="mb-8">
        <h1 className="text-3xl font-display font-bold text-slate-900">Kehadiran</h1>
        <p className="text-slate-500 mt-2">Lacak kehadiran karyawan</p>
      </div>

      {/* Clock In/Out */}
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6 mb-6">
        <div className="card">
          <h3 className="text-lg font-display font-bold text-slate-900 mb-4 flex items-center">
            <Clock className="w-5 h-5 mr-2 text-brand-500" />
            Aksi Cepat
          </h3>
          <div className="space-y-4">
            <select
              value={selectedEmployee}
              onChange={(e) => setSelectedEmployee(e.target.value)}
              className="input"
            >
              <option value="">Pilih Karyawan</option>
              {employees.map((emp) => (
                <option key={emp.id} value={emp.id}>
                  {emp.first_name} {emp.last_name} ({emp.employee_code})
                </option>
              ))}
            </select>
            <div className="flex space-x-4">
              <button onClick={handleClockIn} className="btn btn-success flex-1 shadow-lg shadow-green-500/20">
                Absen Masuk
              </button>
              <button onClick={handleClockOut} className="btn btn-danger flex-1 shadow-lg shadow-red-500/20">
                Absen Keluar
              </button>
            </div>
          </div>
        </div>

        <div className="card">
          <h3 className="text-lg font-display font-bold text-slate-900 mb-4 flex items-center">
            <Calendar className="w-5 h-5 mr-2 text-brand-500" />
            Filter
          </h3>
          <div className="grid grid-cols-2 gap-4">
            <select value={month} onChange={(e) => setMonth(Number(e.target.value))} className="input">
              {Array.from({ length: 12 }, (_, i) => (
                <option key={i + 1} value={i + 1}>
                  {new Date(2000, i).toLocaleString('default', { month: 'long' })}
                </option>
              ))}
            </select>
            <select value={year} onChange={(e) => setYear(Number(e.target.value))} className="input">
              {Array.from({ length: 5 }, (_, i) => {
                const y = new Date().getFullYear() - i
                return (
                  <option key={y} value={y}>
                    {y}
                  </option>
                )
              })}
            </select>
          </div>
        </div>
      </div>

      {/* Attendance Records */}
      <div className="table-container">
        <div className="p-6 border-b border-slate-100">
          <h3 className="text-lg font-display font-bold text-slate-900">Catatan Kehadiran</h3>
        </div>
        {loading ? (
          <div className="flex items-center justify-center h-64">
            <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-brand-600"></div>
          </div>
        ) : attendances.length === 0 ? (
          <div className="text-center py-12">
            <p className="text-slate-500">Tidak ada catatan kehadiran ditemukan</p>
          </div>
        ) : (
          <div className="overflow-x-auto">
            <table className="table">
              <thead>
                <tr>
                  <th>Tanggal</th>
                  <th>Absen Masuk</th>
                  <th>Absen Keluar</th>
                  <th>Jam Kerja</th>
                  <th>Jam Lembur</th>
                  <th>Status</th>
                </tr>
              </thead>
              <tbody className="bg-white divide-y divide-slate-100">
                {attendances.map((att) => (
                  <tr key={att.id} className="hover:bg-slate-50/50 transition-colors">
                    <td className="font-medium text-slate-900">{format(new Date(att.date), 'MMM dd, yyyy')}</td>
                    <td>{att.clock_in ? format(new Date(att.clock_in), 'hh:mm a') : '-'}</td>
                    <td>{att.clock_out ? format(new Date(att.clock_out), 'hh:mm a') : '-'}</td>
                    <td>{att.working_hours?.toFixed(2) || '0.00'} hrs</td>
                    <td>{att.overtime_hours?.toFixed(2) || '0.00'} hrs</td>
                    <td>
                      <span
                        className={`badge ${att.status === 'present'
                          ? 'badge-success'
                          : att.status === 'absent'
                            ? 'badge-danger'
                            : 'badge-warning'
                          }`}
                      >
                        {att.status}
                      </span>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        )}
      </div>
    </div>
  )
}

export default Attendance
