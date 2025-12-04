import { useEffect, useState } from 'react'
import { useNavigate } from 'react-router-dom'
import { employeeService } from '../services/employeeService'
import toast from 'react-hot-toast'
import { Users, UserCheck, UserX, Calendar } from 'lucide-react'

const Dashboard = () => {
  const navigate = useNavigate()
  const [stats, setStats] = useState(null)
  const [loading, setLoading] = useState(true)

  useEffect(() => {
    loadStats()
  }, [])

  const loadStats = async () => {
    try {
      const response = await employeeService.getDashboardStats()
      // Handle both response formats
      const statsData = response.data || response
      setStats(statsData)
    } catch (error) {
      console.error('Failed to load stats:', error)
      toast.error('Gagal memuat statistik dasbor')
    } finally {
      setLoading(false)
    }
  }

  const statCards = [
    {
      title: 'Total Karyawan',
      value: stats?.total_employees || 0,
      icon: Users,
      color: 'text-blue-600',
      bg: 'bg-blue-50',
      border: 'border-blue-100',
    },
    {
      title: 'Hadir Hari Ini',
      value: stats?.present_today || 0,
      icon: UserCheck,
      color: 'text-emerald-600',
      bg: 'bg-emerald-50',
      border: 'border-emerald-100',
    },
    {
      title: 'Sedang Cuti',
      value: stats?.on_leave_today || 0,
      icon: Calendar,
      color: 'text-amber-600',
      bg: 'bg-amber-50',
      border: 'border-amber-100',
    },
    {
      title: 'Tidak Hadir Hari Ini',
      value: stats?.absent_today || 0,
      icon: UserX,
      color: 'text-rose-600',
      bg: 'bg-rose-50',
      border: 'border-rose-100',
    },
  ]

  if (loading) {
    return (
      <div className="flex items-center justify-center h-96">
        <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-brand-600"></div>
      </div>
    )
  }

  return (
    <div className="space-y-8">
      <div>
        <h1 className="text-3xl font-display font-bold text-slate-900">Dasbor Overview</h1>
        <p className="text-slate-500 mt-2 text-lg">Ringkasan aktivitas dan performa HR Anda hari ini.</p>
      </div>

      {/* Stats Grid */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
        {statCards.map((stat, index) => {
          const Icon = stat.icon
          return (
            <div key={index} className="card hover:shadow-card-hover transition-shadow duration-300">
              <div className="flex items-start justify-between">
                <div>
                  <p className="text-sm font-medium text-slate-500">{stat.title}</p>
                  <p className="text-4xl font-display font-bold text-slate-900 mt-3">{stat.value}</p>
                </div>
                <div className={`p-3 rounded-xl ${stat.bg} ${stat.color} border ${stat.border}`}>
                  <Icon className="w-6 h-6" />
                </div>
              </div>
            </div>
          )
        })}
      </div>

      {/* Recent Activity */}
      <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
        <div className="lg:col-span-2 card">
          <div className="flex items-center justify-between mb-6">
            <h3 className="text-xl font-display font-bold text-slate-900">Aksi Cepat</h3>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
            <button onClick={() => navigate('/kehadiran')} className="flex flex-col items-start p-5 rounded-2xl bg-brand-50 border border-brand-100 hover:bg-brand-100 transition-all duration-200 group">
              <div className="p-3 rounded-xl bg-white text-brand-600 shadow-sm mb-4 group-hover:scale-110 transition-transform duration-200">
                <UserCheck className="w-6 h-6" />
              </div>
              <p className="font-bold text-brand-900">Absen Masuk/Keluar</p>
              <p className="text-sm text-brand-600 mt-1 text-left">Catat waktu kehadiran Anda sekarang</p>
            </button>

            <button onClick={() => navigate('/cuti')} className="flex flex-col items-start p-5 rounded-2xl bg-emerald-50 border border-emerald-100 hover:bg-emerald-100 transition-all duration-200 group">
              <div className="p-3 rounded-xl bg-white text-emerald-600 shadow-sm mb-4 group-hover:scale-110 transition-transform duration-200">
                <Calendar className="w-6 h-6" />
              </div>
              <p className="font-bold text-emerald-900">Ajukan Cuti</p>
              <p className="text-sm text-emerald-600 mt-1 text-left">Buat permintaan cuti baru</p>
            </button>

            <button onClick={() => navigate('/karyawan')} className="flex flex-col items-start p-5 rounded-2xl bg-violet-50 border border-violet-100 hover:bg-violet-100 transition-all duration-200 group">
              <div className="p-3 rounded-xl bg-white text-violet-600 shadow-sm mb-4 group-hover:scale-110 transition-transform duration-200">
                <Users className="w-6 h-6" />
              </div>
              <p className="font-bold text-violet-900">Data Karyawan</p>
              <p className="text-sm text-violet-600 mt-1 text-left">Kelola data karyawan tim Anda</p>
            </button>
          </div>
        </div>

        <div className="card h-full">
          <h3 className="text-xl font-display font-bold text-slate-900 mb-6">Status Sistem</h3>
          <div className="space-y-6">
            <div className="flex items-center justify-between">
              <div className="flex items-center gap-3">
                <div className="w-2 h-2 rounded-full bg-emerald-500 animate-pulse"></div>
                <span className="text-slate-600 font-medium">Server Status</span>
              </div>
              <span className="badge badge-success">Online</span>
            </div>
            <div className="flex items-center justify-between">
              <div className="flex items-center gap-3">
                <div className="w-2 h-2 rounded-full bg-emerald-500"></div>
                <span className="text-slate-600 font-medium">Database</span>
              </div>
              <span className="badge badge-success">Connected</span>
            </div>
            <div className="pt-6 border-t border-slate-100">
              <p className="text-xs font-semibold text-slate-400 uppercase tracking-wider mb-2">Last Backup</p>
              <p className="text-sm font-medium text-slate-900">Today, 02:00 AM</p>
            </div>
          </div>
        </div>
      </div>
    </div>
  )
}

export default Dashboard
