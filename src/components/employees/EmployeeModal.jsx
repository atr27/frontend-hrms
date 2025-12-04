import { useState, useEffect } from 'react'
import { employeeService } from '../../services/employeeService'
import toast from 'react-hot-toast'
import { X } from 'lucide-react'

const EmployeeModal = ({ employee, departments, onClose }) => {
    console.log('🔧 [MODAL] EmployeeModal mounted/updated')
    console.log('🔧 [MODAL] Employee prop:', employee)
    console.log('🔧 [MODAL] Departments prop:', departments)
    console.log('🔧 [MODAL] Departments count:', departments?.length)

    const [loading, setLoading] = useState(false)
    const [formData, setFormData] = useState({
        email: '',
        password: '',
        employee_code: '',
        first_name: '',
        last_name: '',
        phone: '',
        department_id: '',
        position: '',
        hire_date: '',
        salary: '',
        role: 'employee',
    })

    useEffect(() => {
        console.log('🔄 [MODAL] useEffect triggered')
        console.log('🔄 [MODAL] Employee:', employee)
        if (employee) {
            const newFormData = {
                first_name: employee.first_name || '',
                last_name: employee.last_name || '',
                phone: employee.phone || '',
                department_id: employee.department_id || '',
                position: employee.position || '',
                salary: employee.salary || '',
            }
            console.log('📝 [MODAL] Setting form data for edit:', newFormData)
            setFormData(newFormData)
        } else {
            console.log('➕ [MODAL] Creating new employee, generating code...')
            generateCode()
        }
    }, [employee])

    const generateCode = async () => {
        try {
            console.log('🔢 [MODAL] Generating employee code...')
            const data = await employeeService.generateEmployeeCode()
            console.log('✅ [MODAL] Generated code:', data)
            setFormData((prev) => ({ ...prev, employee_code: data.employee_code }))
        } catch (error) {
            console.error('❌ [MODAL] Failed to generate employee code:', error)
        }
    }

    const handleSubmit = async (e) => {
        e.preventDefault()
        setLoading(true)

        // Prepare data for submission
        const submissionData = {
            ...formData,
            // Convert department_id to number or null if empty
            department_id: formData.department_id ? Number(formData.department_id) : null,
            // Convert salary to number
            salary: formData.salary ? Number(formData.salary) : 0,
        }

        try {
            if (employee) {
                await employeeService.updateEmployee(employee.id, submissionData)
                toast.success('Karyawan berhasil diperbarui')
            } else {
                await employeeService.createEmployee(submissionData)
                toast.success('Karyawan berhasil dibuat')
            }
            onClose(true)
        } catch (error) {
            toast.error(error.error?.message || 'Operasi gagal')
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

                <div className="inline-block align-bottom bg-white rounded-lg text-left overflow-hidden shadow-xl transform transition-all sm:my-8 sm:align-middle sm:max-w-2xl sm:w-full">
                    <div className="bg-white px-6 py-4 border-b border-gray-200 flex items-center justify-between">
                        <h3 className="text-lg font-semibold text-gray-900">
                            {employee ? 'Edit Karyawan' : 'Tambah Karyawan'}
                        </h3>
                        <button onClick={() => onClose(false)} className="text-gray-400 hover:text-gray-600">
                            <X className="w-6 h-6" />
                        </button>
                    </div>

                    <form onSubmit={handleSubmit} className="p-6">
                        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                            {!employee && (
                                <>
                                    <div>
                                        <label className="block text-sm font-medium text-gray-700 mb-1">Email</label>
                                        <input
                                            type="email"
                                            name="email"
                                            value={formData.email}
                                            onChange={handleChange}
                                            className="input"
                                            required
                                        />
                                    </div>
                                    <div>
                                        <label className="block text-sm font-medium text-gray-700 mb-1">Kata Sandi</label>
                                        <input
                                            type="password"
                                            name="password"
                                            value={formData.password}
                                            onChange={handleChange}
                                            className="input"
                                            required
                                        />
                                    </div>
                                    <div>
                                        <label className="block text-sm font-medium text-gray-700 mb-1">Kode Karyawan</label>
                                        <input
                                            type="text"
                                            name="employee_code"
                                            value={formData.employee_code}
                                            onChange={handleChange}
                                            className="input"
                                            required
                                        />
                                    </div>
                                    <div>
                                        <label className="block text-sm font-medium text-gray-700 mb-1">Peran</label>
                                        <select name="role" value={formData.role} onChange={handleChange} className="input" required>
                                            <option value="employee">Karyawan</option>
                                            <option value="department_manager">Manajer Departemen</option>
                                            <option value="hr_manager">Manajer HR</option>
                                            <option value="admin">Admin</option>
                                        </select>
                                    </div>
                                </>
                            )}
                            <div>
                                <label className="block text-sm font-medium text-gray-700 mb-1">Nama Depan</label>
                                <input
                                    type="text"
                                    name="first_name"
                                    value={formData.first_name}
                                    onChange={handleChange}
                                    className="input"
                                    required
                                />
                            </div>
                            <div>
                                <label className="block text-sm font-medium text-gray-700 mb-1">Nama Belakang</label>
                                <input
                                    type="text"
                                    name="last_name"
                                    value={formData.last_name}
                                    onChange={handleChange}
                                    className="input"
                                    required
                                />
                            </div>
                            <div>
                                <label className="block text-sm font-medium text-gray-700 mb-1">Telepon</label>
                                <input
                                    type="tel"
                                    name="phone"
                                    value={formData.phone}
                                    onChange={handleChange}
                                    className="input"
                                />
                            </div>
                            <div>
                                <label className="block text-sm font-medium text-gray-700 mb-1">Departemen</label>
                                <select name="department_id" value={formData.department_id} onChange={handleChange} className="input">
                                    <option value="">Pilih Departemen</option>
                                    {departments.map((dept) => (
                                        <option key={dept.id} value={dept.id}>
                                            {dept.name}
                                        </option>
                                    ))}
                                </select>
                            </div>
                            <div>
                                <label className="block text-sm font-medium text-gray-700 mb-1">Posisi</label>
                                <input
                                    type="text"
                                    name="position"
                                    value={formData.position}
                                    onChange={handleChange}
                                    className="input"
                                />
                            </div>
                            {!employee && (
                                <div>
                                    <label className="block text-sm font-medium text-gray-700 mb-1">Tanggal Bergabung</label>
                                    <input
                                        type="date"
                                        name="hire_date"
                                        value={formData.hire_date}
                                        onChange={handleChange}
                                        className="input"
                                        required
                                    />
                                </div>
                            )}
                            <div>
                                <label className="block text-sm font-medium text-gray-700 mb-1">Gaji</label>
                                <input
                                    type="number"
                                    name="salary"
                                    value={formData.salary}
                                    onChange={handleChange}
                                    className="input"
                                    step="0.01"
                                />
                            </div>
                        </div>

                        <div className="mt-6 flex justify-end space-x-3">
                            <button type="button" onClick={() => onClose(false)} className="btn btn-secondary">
                                Batal
                            </button>
                            <button type="submit" disabled={loading} className="btn btn-primary disabled:opacity-50">
                                {loading ? 'Menyimpan...' : employee ? 'Perbarui' : 'Buat'}
                            </button>
                        </div>
                    </form>
                </div>
            </div>
        </div>
    )
}

export default EmployeeModal
