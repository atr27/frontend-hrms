import { useEffect, useState } from 'react'
import { leaveService } from '../services/leaveService'
import { employeeService } from '../services/employeeService'
import toast from 'react-hot-toast'
import { Plus, Calendar, CheckCircle, XCircle } from 'lucide-react'
import { format } from 'date-fns'
import LeaveModal from '../components/leaves/LeaveModal'

const Leaves = () => {
  const [leaves, setLeaves] = useState([])
  const [employees, setEmployees] = useState([])
  const [loading, setLoading] = useState(true)
  const [statusFilter, setStatusFilter] = useState('')
  const [page, setPage] = useState(1)
  const [total, setTotal] = useState(0)
  const [modalOpen, setModalOpen] = useState(false)
  const limit = 10

  useEffect(() => {
    loadLeaves()
    loadEmployees()
  }, [page, statusFilter])

  const loadLeaves = async () => {
    try {
      const response = await leaveService.getLeaves({
        page,
        limit,
        status: statusFilter || undefined,
      })
      // Handle both response formats
      let leavesData, totalCount
      if (Array.isArray(response)) {
        leavesData = response
        totalCount = response.length
      } else {
        leavesData = response.data || []
        totalCount = response.total || 0
      }
      setLeaves(leavesData)
      setTotal(totalCount)
    } catch (error) {
      toast.error('Gagal memuat cuti')
    } finally {
      setLoading(false)
    }
  }

  const loadEmployees = async () => {
    try {
      const response = await employeeService.getEmployees({ limit: 100 })
      // Handle both response formats
      const employeesData = Array.isArray(response) ? response : (response.data || [])
      setEmployees(employeesData)
    } catch (error) {
      console.error('Failed to load employees')
    }
  }

  const handleApprove = async (id) => {
    try {
      await leaveService.approveLeave(id, 'approved')
      toast.success('Cuti berhasil disetujui')
      loadLeaves()
    } catch (error) {
      toast.error('Gagal menyetujui cuti')
    }
  }

  const handleReject = async (id) => {
    try {
      await leaveService.approveLeave(id, 'rejected')
      toast.success('Cuti berhasil ditolak')
      loadLeaves()
    } catch (error) {
      toast.error('Gagal menolak cuti')
    }
  }

  const handleModalClose = (refresh) => {
    setModalOpen(false)
    if (refresh) {
      loadLeaves()
    }
  }

  const totalPages = Math.ceil(total / limit)

  return (
    <div>
      <div className="mb-8 flex items-center justify-between">
        <div>
          <h1 className="text-3xl font-display font-bold text-slate-900">Manajemen Cuti</h1>
          <p className="text-slate-500 mt-2">Kelola permintaan cuti karyawan</p>
        </div>
        <button onClick={() => setModalOpen(true)} className="btn btn-primary flex items-center shadow-lg shadow-brand-500/20">
          <Plus className="w-5 h-5 mr-2" />
          Ajukan Cuti
        </button>
      </div>

      {/* Filter */}
      <div className="card mb-6">
        <select
          value={statusFilter}
          onChange={(e) => setStatusFilter(e.target.value)}
          className="input max-w-xs"
        >
          <option value="">Semua Status</option>
          <option value="pending">Menunggu</option>
          <option value="approved">Disetujui</option>
          <option value="rejected">Ditolak</option>
        </select>
      </div>

      {/* Table */}
      <div className="table-container">
        {loading ? (
          <div className="flex items-center justify-center h-64">
            <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-brand-600"></div>
          </div>
        ) : leaves.length === 0 ? (
          <div className="text-center py-12">
            <p className="text-slate-500">Tidak ada permintaan cuti ditemukan</p>
          </div>
        ) : (
          <>
            <div className="overflow-x-auto">
              <table className="table">
                <thead>
                  <tr>
                    <th>Karyawan</th>
                    <th>Jenis Cuti</th>
                    <th>Tanggal Mulai</th>
                    <th>Tanggal Selesai</th>
                    <th>Hari</th>
                    <th>Alasan</th>
                    <th>Status</th>
                    <th>Aksi</th>
                  </tr>
                </thead>
                <tbody className="bg-white divide-y divide-slate-100">
                  {leaves.map((leave) => (
                    <tr key={leave.id} className="hover:bg-slate-50/50 transition-colors">
                      <td className="font-medium text-slate-900">
                        {leave.employee?.first_name} {leave.employee?.last_name}
                      </td>
                      <td className="capitalize">{leave.leave_type}</td>
                      <td>{format(new Date(leave.start_date), 'MMM dd, yyyy')}</td>
                      <td>{format(new Date(leave.end_date), 'MMM dd, yyyy')}</td>
                      <td className="font-medium">{leave.total_days}</td>
                      <td className="truncate">{leave.reason || '-'}</td>
                      <td>
                        <span
                          className={`badge ${leave.status === 'approved'
                            ? 'badge-success'
                            : leave.status === 'rejected'
                              ? 'badge-danger'
                              : 'badge-warning'
                            }`}
                        >
                          {leave.status}
                        </span>
                      </td>
                      <td>
                        {leave.status === 'pending' && (
                          <div className="flex items-center space-x-2">
                            <button
                              onClick={() => handleApprove(leave.id)}
                              className="p-1 text-success-600 hover:text-success-800 hover:bg-success-50 rounded-lg transition-colors"
                              title="Approve"
                            >
                              <CheckCircle className="w-5 h-5" />
                            </button>
                            <button
                              onClick={() => handleReject(leave.id)}
                              className="p-1 text-danger-600 hover:text-danger-800 hover:bg-danger-50 rounded-lg transition-colors"
                              title="Reject"
                            >
                              <XCircle className="w-5 h-5" />
                            </button>
                          </div>
                        )}
                      </td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>

            {/* Pagination */}
            <div className="px-6 py-4 border-t border-slate-100 flex items-center justify-between bg-slate-50/50">
              <div className="text-sm text-slate-500">
                Menampilkan <span className="font-medium text-slate-900">{(page - 1) * limit + 1}</span> hingga <span className="font-medium text-slate-900">{Math.min(page * limit, total)}</span> dari <span className="font-medium text-slate-900">{total}</span> hasil
              </div>
              <div className="flex space-x-2">
                <button
                  onClick={() => setPage((p) => Math.max(1, p - 1))}
                  disabled={page === 1}
                  className="btn btn-secondary disabled:opacity-50 py-2 px-3 text-sm"
                >
                  Sebelumnya
                </button>
                <button
                  onClick={() => setPage((p) => Math.min(totalPages, p + 1))}
                  disabled={page === totalPages}
                  className="btn btn-secondary disabled:opacity-50 py-2 px-3 text-sm"
                >
                  Selanjutnya
                </button>
              </div>
            </div>
          </>
        )}
      </div>

      {/* Modal */}
      {modalOpen && <LeaveModal employees={employees} onClose={handleModalClose} />}
    </div>
  )
}

export default Leaves
