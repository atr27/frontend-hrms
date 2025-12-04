import { useState } from 'react'
import { leaveService } from '../../services/leaveService'
import toast from 'react-hot-toast'
import { X } from 'lucide-react'

const LeaveModal = ({ employees, onClose }) => {
    const [loading, setLoading] = useState(false)
    const [formData, setFormData] = useState({
        employee_id: '',
        leave_type: 'annual',
        start_date: '',
        end_date: '',
        reason: '',
    })

    const handleSubmit = async (e) => {
        e.preventDefault()
        setLoading(true)

        try {
            await leaveService.createLeave({
                ...formData,
                employee_id: parseInt(formData.employee_id),
            })
            toast.success('Permintaan cuti berhasil dikirim')
            onClose(true)
        } catch (error) {
            toast.error(error.error?.message || 'Gagal mengirim permintaan cuti')
        } finally {
            setLoading(false)
        }
    }

    const handleChange = (e) => {
        const { name, value } = e.target
        setFormData((prev) => ({ ...prev, [name]: value }))
    }

    return (
        <div className="fixed inset-0 z-50 overflow-y-auto">
            <div className="flex items-center justify-center min-h-screen px-4 pt-4 pb-20 text-center sm:block sm:p-0">
                <div className="fixed inset-0 transition-opacity bg-gray-500 bg-opacity-75" onClick={() => onClose(false)} />

                <div className="inline-block align-bottom bg-white rounded-lg text-left overflow-hidden shadow-xl transform transition-all sm:my-8 sm:align-middle sm:max-w-lg sm:w-full">
                    <div className="bg-white px-6 py-4 border-b border-gray-200 flex items-center justify-between">
                        <h3 className="text-lg font-semibold text-gray-900">Ajukan Cuti</h3>
                        <button onClick={() => onClose(false)} className="text-gray-400 hover:text-gray-600">
                            <X className="w-6 h-6" />
                        </button>
                    </div>

                    <form onSubmit={handleSubmit} className="p-6">
                        <div className="space-y-4">
                            <div>
                                <label className="block text-sm font-medium text-gray-700 mb-1">Karyawan</label>
                                <select
                                    name="employee_id"
                                    value={formData.employee_id}
                                    onChange={handleChange}
                                    className="input"
                                    required
                                >
                                    <option value="">Pilih Karyawan</option>
                                    {employees.map((emp) => (
                                        <option key={emp.id} value={emp.id}>
                                            {emp.first_name} {emp.last_name} ({emp.employee_code})
                                        </option>
                                    ))}
                                </select>
                            </div>

                            <div>
                                <label className="block text-sm font-medium text-gray-700 mb-1">Jenis Cuti</label>
                                <select
                                    name="leave_type"
                                    value={formData.leave_type}
                                    onChange={handleChange}
                                    className="input"
                                    required
                                >
                                    <option value="annual">Cuti Tahunan</option>
                                    <option value="sick">Cuti Sakit</option>
                                    <option value="casual">Cuti Dadakan</option>
                                    <option value="unpaid">Cuti Tidak Dibayar</option>
                                </select>
                            </div>

                            <div className="grid grid-cols-2 gap-4">
                                <div>
                                    <label className="block text-sm font-medium text-gray-700 mb-1">Tanggal Mulai</label>
                                    <input
                                        type="date"
                                        name="start_date"
                                        value={formData.start_date}
                                        onChange={handleChange}
                                        className="input"
                                        required
                                    />
                                </div>
                                <div>
                                    <label className="block text-sm font-medium text-gray-700 mb-1">Tanggal Selesai</label>
                                    <input
                                        type="date"
                                        name="end_date"
                                        value={formData.end_date}
                                        onChange={handleChange}
                                        className="input"
                                        required
                                    />
                                </div>
                            </div>

                            <div>
                                <label className="block text-sm font-medium text-gray-700 mb-1">Alasan</label>
                                <textarea
                                    name="reason"
                                    value={formData.reason}
                                    onChange={handleChange}
                                    className="input"
                                    rows="3"
                                    placeholder="Alasan cuti..."
                                />
                            </div>
                        </div>

                        <div className="mt-6 flex justify-end space-x-3">
                            <button type="button" onClick={() => onClose(false)} className="btn btn-secondary">
                                Batal
                            </button>
                            <button type="submit" disabled={loading} className="btn btn-primary disabled:opacity-50">
                                {loading ? 'Mengirim...' : 'Kirim'}
                            </button>
                        </div>
                    </form>
                </div>
            </div>
        </div>
    )
}

export default LeaveModal
