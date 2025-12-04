import { useEffect, useState } from 'react'
import { employeeService } from '../services/employeeService'
import { departmentService } from '../services/departmentService'
import toast from 'react-hot-toast'
import { Plus, Search, Edit, Trash2, Eye } from 'lucide-react'
import EmployeeModal from '../components/employees/EmployeeModal'

const Employees = () => {
  const [employees, setEmployees] = useState([])
  const [departments, setDepartments] = useState([])
  const [loading, setLoading] = useState(true)
  const [search, setSearch] = useState('')
  const [statusFilter, setStatusFilter] = useState('')
  const [departmentFilter, setDepartmentFilter] = useState('')
  const [page, setPage] = useState(1)
  const [total, setTotal] = useState(0)
  const [modalOpen, setModalOpen] = useState(false)
  const [selectedEmployee, setSelectedEmployee] = useState(null)
  const limit = 10

  useEffect(() => {
    loadEmployees()
    loadDepartments()
  }, [page, search, statusFilter, departmentFilter])

  const loadEmployees = async () => {
    try {
      const params = {
        page,
        limit,
        search: search || undefined,
        status: statusFilter || undefined,
        department_id: departmentFilter || undefined,
      }
      console.log('🔍 [EMPLOYEES] Fetching employees with params:', params)
      const response = await employeeService.getEmployees(params)
      console.log('📥 [EMPLOYEES] Raw API Response:', response)
      console.log('📊 [EMPLOYEES] Response Data Type:', typeof response)
      console.log('📊 [EMPLOYEES] Response is Array:', Array.isArray(response))
      console.log('📦 [EMPLOYEES] Response.data:', response.data)
      console.log('📈 [EMPLOYEES] Response.total:', response.total)
      console.log('🔢 [EMPLOYEES] Data Array Length:', response.data?.length || (Array.isArray(response) ? response.length : 0))

      // Handle both response formats: array directly or {data: [...], total: ...}
      let employeesData
      let totalCount

      if (Array.isArray(response)) {
        // Backend returns array directly
        console.log('✨ [EMPLOYEES] Response is an array directly')
        employeesData = response
        totalCount = response.length
      } else if (response.data) {
        // Backend returns: {success: true, data: [...], total: ...}
        console.log('✨ [EMPLOYEES] Response has data property')
        employeesData = response.data
        totalCount = response.total || response.data.length
      } else {
        console.log('⚠️ [EMPLOYEES] Unknown response format')
        employeesData = []
        totalCount = 0
      }
      console.log('✅ [EMPLOYEES] Extracted employees data:', employeesData)
      console.log('📝 [EMPLOYEES] First employee (if exists):', employeesData[0] || 'No employees')

      setEmployees(employeesData)
      setTotal(totalCount)
      console.log('💾 [EMPLOYEES] State updated - Employees count:', employeesData.length, 'Total:', totalCount)
    } catch (error) {
      console.error('❌ [EMPLOYEES] Error loading employees:', error)
      console.error('❌ [EMPLOYEES] Error details:', error.response?.data || error.message)
      toast.error('Gagal memuat karyawan')
    } finally {
      setLoading(false)
      console.log('🏁 [EMPLOYEES] Loading complete')
    }
  }

  const loadDepartments = async () => {
    try {
      console.log('🏢 [DEPARTMENTS] Fetching departments...')
      const data = await departmentService.getDepartments()
      console.log('📥 [DEPARTMENTS] Raw response:', data)
      console.log('🔢 [DEPARTMENTS] Departments count:', data?.length || 0)
      setDepartments(data || [])
      console.log('💾 [DEPARTMENTS] State updated with', data?.length || 0, 'departments')
    } catch (error) {
      console.error('❌ [DEPARTMENTS] Error loading departments:', error)
      console.error('❌ [DEPARTMENTS] Error details:', error.response?.data || error.message)
    }
  }

  const handleDelete = async (id) => {
    if (!window.confirm('Apakah Anda yakin ingin menghapus karyawan ini?')) return

    try {
      await employeeService.deleteEmployee(id)
      toast.success('Karyawan berhasil dihapus')
      loadEmployees()
    } catch (error) {
      toast.error('Gagal menghapus karyawan')
    }
  }

  const handleEdit = (employee) => {
    setSelectedEmployee(employee)
    setModalOpen(true)
  }

  const handleAdd = () => {
    setSelectedEmployee(null)
    setModalOpen(true)
  }

  const handleModalClose = (refresh) => {
    setModalOpen(false)
    setSelectedEmployee(null)
    if (refresh) {
      loadEmployees()
    }
  }

  const totalPages = Math.ceil(total / limit)

  return (
    <div>
      <div className="mb-8 flex items-center justify-between">
        <div>
          <h1 className="text-3xl font-display font-bold text-slate-900">Karyawan</h1>
          <p className="text-slate-500 mt-2">Kelola tenaga kerja Anda</p>
        </div>
        <button onClick={handleAdd} className="btn btn-primary flex items-center shadow-lg shadow-brand-500/20">
          <Plus className="w-5 h-5 mr-2" />
          Tambah Karyawan
        </button>
      </div>

      {/* Filters */}
      <div className="card mb-6">
        <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
          <div className="relative">
            <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 text-slate-400 w-5 h-5" />
            <input
              type="text"
              placeholder="Cari karyawan..."
              value={search}
              onChange={(e) => setSearch(e.target.value)}
              className="input pl-10"
            />
          </div>
          <select
            value={statusFilter}
            onChange={(e) => setStatusFilter(e.target.value)}
            className="input"
          >
            <option value="">Semua Status</option>
            <option value="active">Aktif</option>
            <option value="inactive">Tidak Aktif</option>
          </select>
          <select
            value={departmentFilter}
            onChange={(e) => setDepartmentFilter(e.target.value)}
            className="input"
          >
            <option value="">Semua Departemen</option>
            {departments.map((dept) => (
              <option key={dept.id} value={dept.id}>
                {dept.name}
              </option>
            ))}
          </select>
        </div>
      </div>

      {/* Table */}
      <div className="table-container">
        {(() => {
          console.log('🎨 [RENDER] Rendering table...')
          console.log('🎨 [RENDER] Loading state:', loading)
          console.log('🎨 [RENDER] Employees state:', employees)
          console.log('🎨 [RENDER] Employees length:', employees?.length)
          console.log('🎨 [RENDER] Employees is array:', Array.isArray(employees))
          return null
        })()}
        {loading ? (
          <div className="flex items-center justify-center h-64">
            <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-brand-600"></div>
          </div>
        ) : employees.length === 0 ? (
          <div className="text-center py-12">
            <p className="text-slate-500">Tidak ada karyawan ditemukan</p>
          </div>
        ) : (
          <>
            <div className="overflow-x-auto">
              <table className="table">
                <thead>
                  <tr>
                    <th>Kode Karyawan</th>
                    <th>Nama</th>
                    <th>Email</th>
                    <th>Departemen</th>
                    <th>Posisi</th>
                    <th>Status</th>
                    <th>Aksi</th>
                  </tr>
                </thead>
                <tbody className="bg-white divide-y divide-slate-100">
                  {employees.map((employee, index) => {
                    console.log(`🎨 [RENDER] Rendering employee ${index + 1}:`, employee)
                    return (
                      <tr key={employee.id} className="hover:bg-slate-50/50 transition-colors">
                        <td className="font-medium">{employee.employee_code}</td>
                        <td>
                          <div className="font-medium">{employee.first_name} {employee.last_name}</div>
                        </td>
                        <td>{employee.user?.email}</td>
                        <td>{employee.department?.name || '-'}</td>
                        <td>{employee.position || '-'}</td>
                        <td>
                          <span
                            className={`badge ${employee.employment_status === 'active'
                              ? 'badge-success'
                              : 'badge-danger'
                              }`}
                          >
                            {employee.employment_status}
                          </span>
                        </td>
                        <td>
                          <div className="flex items-center space-x-2">
                            <button
                              onClick={() => handleEdit(employee)}
                              className="p-1 text-brand-600 hover:text-brand-800 hover:bg-brand-50 rounded-lg transition-colors"
                            >
                              <Edit className="w-4 h-4" />
                            </button>
                            <button
                              onClick={() => handleDelete(employee.id)}
                              className="p-1 text-danger-600 hover:text-danger-800 hover:bg-danger-50 rounded-lg transition-colors"
                            >
                              <Trash2 className="w-4 h-4" />
                            </button>
                          </div>
                        </td>
                      </tr>
                    )
                  })}
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
      {modalOpen && (
        <EmployeeModal
          employee={selectedEmployee}
          departments={departments}
          onClose={handleModalClose}
        />
      )}
    </div>
  )
}

export default Employees
