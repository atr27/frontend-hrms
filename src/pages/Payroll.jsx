import { useEffect, useState } from 'react'
import { payrollService } from '../services/payrollService'
import toast from 'react-hot-toast'
import { Banknote, Download } from 'lucide-react'
import { format } from 'date-fns'

const Payroll = () => {
  const [payrolls, setPayrolls] = useState([])
  const [loading, setLoading] = useState(true)
  const [month, setMonth] = useState(new Date().getMonth() + 1)
  const [year, setYear] = useState(new Date().getFullYear())
  const [page, setPage] = useState(1)
  const [total, setTotal] = useState(0)
  const [summary, setSummary] = useState(null)
  const limit = 10

  useEffect(() => {
    loadPayrolls()
    loadSummary()
  }, [page, month, year])

  const loadPayrolls = async () => {
    try {
      const response = await payrollService.getPayrolls({
        page,
        limit,
        month,
        year,
      })
      // Handle both response formats
      let payrollsData, totalCount
      if (Array.isArray(response)) {
        payrollsData = response
        totalCount = response.length
      } else {
        payrollsData = response.data || []
        totalCount = response.total || 0
      }
      setPayrolls(payrollsData)
      setTotal(totalCount)
    } catch (error) {
      toast.error('Gagal memuat gaji')
    } finally {
      setLoading(false)
    }
  }

  const loadSummary = async () => {
    try {
      const response = await payrollService.getPayrollSummary(month, year)
      // Handle both response formats - summary may be in data property or direct
      const summaryData = response.data || response
      setSummary(summaryData)
    } catch (error) {
      console.error('Failed to load summary')
    }
  }

  const handleGenerate = async () => {
    try {
      await payrollService.generatePayroll(month, year)
      toast.success('Gaji berhasil digenerate')
      loadPayrolls()
      loadSummary()
    } catch (error) {
      toast.error('Gagal generate gaji')
    }
  }

  const handleProcessPayment = async (id) => {
    try {
      await payrollService.processPayment(id)
      toast.success('Pembayaran berhasil diproses')
      loadPayrolls()
    } catch (error) {
      toast.error('Gagal memproses pembayaran')
    }
  }

  const handleDownload = async (id, employeeName) => {
    console.log('🔽 [Download Slip] Starting download workflow', { id, employeeName })
    try {
      console.log('🔽 [Download Slip] Requesting PDF from API for ID:', id)
      const blob = await payrollService.downloadPayrollSlip(id)
      console.log('✅ [Download Slip] Blob received:', { size: blob.size, type: blob.type })
      
      const url = window.URL.createObjectURL(blob)
      console.log('🔗 [Download Slip] Created blob URL:', url)
      
      const link = document.createElement('a')
      link.href = url
      link.download = `slip_gaji_${employeeName.replace(/\s+/g, '_')}.pdf`
      console.log('📄 [Download Slip] Download filename:', link.download)
      
      document.body.appendChild(link)
      link.click()
      console.log('✅ [Download Slip] Download triggered successfully')
      
      document.body.removeChild(link)
      window.URL.revokeObjectURL(url)
      console.log('🧹 [Download Slip] Cleanup completed')
      
      toast.success('Slip gaji berhasil diunduh')
    } catch (error) {
      console.error('❌ [Download Slip] Error occurred:', error)
      console.error('❌ [Download Slip] Error details:', {
        message: error.message,
        response: error.response?.data,
        status: error.response?.status
      })
      toast.error('Gagal mengunduh slip gaji')
    }
  }

  const totalPages = Math.ceil(total / limit)

  return (
    <div>
      <div className="mb-8 flex items-center justify-between">
        <div>
          <h1 className="text-3xl font-bold text-gray-900">Manajemen Gaji</h1>
          <p className="text-gray-600 mt-2">Kelola gaji karyawan</p>
        </div>
        <button onClick={handleGenerate} className="btn btn-primary flex items-center">
          <Banknote className="w-5 h-5 mr-2" />
          Generate Gaji
        </button>
      </div>

      {/* Summary Cards */}
      {summary && (
        <div className="grid grid-cols-1 md:grid-cols-3 gap-6 mb-6">
          <div className="card">
            <p className="text-sm font-medium text-gray-600">Total Karyawan</p>
            <p className="text-3xl font-bold text-gray-900 mt-2">{summary.total_employees}</p>
          </div>
          <div className="card">
            <p className="text-sm font-medium text-gray-600">Total Gaji Bersih</p>
            <p className="text-3xl font-bold text-gray-900 mt-2">
              Rp {summary.total_net_pay?.toLocaleString('id-ID')}
            </p>
          </div>
          <div className="card">
            <p className="text-sm font-medium text-gray-600">Total Pajak</p>
            <p className="text-3xl font-bold text-gray-900 mt-2">
              Rp {summary.total_tax?.toLocaleString('id-ID')}
            </p>
          </div>
        </div>
      )}

      {/* Filter */}
      <div className="card mb-6">
        <div className="grid grid-cols-2 gap-4 max-w-md">
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

      {/* Table */}
      <div className="card overflow-hidden">
        {loading ? (
          <div className="flex items-center justify-center h-64">
            <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-primary-600"></div>
          </div>
        ) : payrolls.length === 0 ? (
          <div className="text-center py-12">
            <p className="text-gray-500">Tidak ada catatan gaji ditemukan</p>
          </div>
        ) : (
          <>
            <div className="overflow-x-auto">
              <table className="table">
                <thead className="bg-gray-50">
                  <tr>
                    <th className="min-w-[120px]">Karyawan</th>
                    <th className="min-w-[80px]">Periode</th>
                    <th className="min-w-[90px]">Pokok</th>
                    <th className="min-w-[90px]">Tunjangan</th>
                    <th className="min-w-[90px]">Potongan</th>
                    <th className="min-w-[80px]">Pajak</th>
                    <th className="min-w-[90px]">Bersih</th>
                    <th className="min-w-[70px]">Status</th>
                    <th className="min-w-[80px]">Aksi</th>
                  </tr>
                </thead>
                <tbody className="bg-white divide-y divide-gray-200">
                  {payrolls.map((payroll) => (
                    <tr key={payroll.id}>
                      <td className="font-medium">
                        {payroll.employee?.first_name} {payroll.employee?.last_name}
                      </td>
                      <td className="text-center">
                        {new Date(2000, payroll.month - 1).toLocaleString('default', {
                          month: 'short',
                        })}{' '}
                        {payroll.year}
                      </td>
                      <td className="text-right">{(payroll.basic_salary / 1000000).toFixed(1)}jt</td>
                      <td className="text-right">{(payroll.allowances / 1000000).toFixed(1)}jt</td>
                      <td className="text-right">{(payroll.deductions / 1000000).toFixed(1)}jt</td>
                      <td className="text-right">{(payroll.tax / 1000000).toFixed(1)}jt</td>
                      <td className="font-semibold text-right">{(payroll.net_salary / 1000000).toFixed(1)}jt</td>
                      <td>
                        <span
                          className={`badge ${payroll.status === 'paid' ? 'badge-success' : 'badge-warning'
                            }`}
                        >
                          {payroll.status === 'pending' ? 'Pending' : 'Lunas'}
                        </span>
                      </td>
                      <td>
                        {payroll.status === 'pending' && (
                          <button
                            onClick={() => handleProcessPayment(payroll.id)}
                            className="btn btn-success text-xs px-2 py-1"
                            title="Proses Pembayaran"
                          >
                            Bayar
                          </button>
                        )}
                        {payroll.status === 'paid' && (
                          <button
                            onClick={() => handleDownload(payroll.id, `${payroll.employee?.first_name}_${payroll.employee?.last_name}`)}
                            className="text-blue-600 hover:text-blue-800"
                            title="Download"
                          >
                            <Download className="w-4 h-4" />
                          </button>
                        )}
                      </td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>

            {/* Pagination */}
            <div className="px-6 py-4 border-t border-gray-200 flex items-center justify-between">
              <div className="text-sm text-gray-700">
                Menampilkan {(page - 1) * limit + 1} hingga {Math.min(page * limit, total)} dari {total} hasil
              </div>
              <div className="flex space-x-2">
                <button
                  onClick={() => setPage((p) => Math.max(1, p - 1))}
                  disabled={page === 1}
                  className="btn btn-secondary disabled:opacity-50"
                >
                  Sebelumnya
                </button>
                <button
                  onClick={() => setPage((p) => Math.min(totalPages, p + 1))}
                  disabled={page === totalPages}
                  className="btn btn-secondary disabled:opacity-50"
                >
                  Selanjutnya
                </button>
              </div>
            </div>
          </>
        )}
      </div>
    </div>
  )
}

export default Payroll
