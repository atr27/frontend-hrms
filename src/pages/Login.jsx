import { useState } from 'react'
import { useNavigate } from 'react-router-dom'
import { useAuthStore } from '../store/authStore'
import { authService } from '../services/authService'
import toast from 'react-hot-toast'
import { LogIn } from 'lucide-react'

const Login = () => {
  const [email, setEmail] = useState('')
  const [password, setPassword] = useState('')
  const [loading, setLoading] = useState(false)
  const { setAuth } = useAuthStore()
  const navigate = useNavigate()

  const handleSubmit = async (e) => {
    e.preventDefault()
    setLoading(true)

    try {
      const response = await authService.login(email, password)
      setAuth(response.token, response.user)
      toast.success('Login berhasil!')
      navigate('/dasbor')
    } catch (error) {
      toast.error(error.error?.message || 'Login gagal')
    } finally {
      setLoading(false)
    }
  }

  return (
    <div className="min-h-screen flex bg-white">
      {/* Left Side - Hero Section */}
      <div className="hidden lg:flex lg:w-1/2 relative bg-slate-900 overflow-hidden">
        <div className="absolute inset-0 bg-gradient-to-br from-brand-600 to-brand-900 opacity-90"></div>
        <div className="absolute inset-0 bg-[url('https://images.unsplash.com/photo-1497366216548-37526070297c?auto=format&fit=crop&q=80')] bg-cover bg-center mix-blend-overlay"></div>

        <div className="relative z-10 flex flex-col justify-between w-full p-12 text-white">
          <div>
            <div className="flex items-center gap-3">
              <div className="w-10 h-10 rounded-xl bg-white/10 backdrop-blur-sm flex items-center justify-center border border-white/20">
                <span className="font-bold text-xl">K</span>
              </div>
              <span className="text-xl font-display font-bold tracking-tight">KaryaSync</span>
            </div>
          </div>

          <div className="max-w-md">
            <h2 className="text-4xl font-display font-bold mb-6 leading-tight">
              Kelola Sumber Daya Manusia dengan Lebih Efisien
            </h2>
            <p className="text-lg text-brand-100 leading-relaxed">
              Platform HR modern untuk meningkatkan produktivitas tim, mengelola kehadiran, dan menyederhanakan proses penggajian Anda.
            </p>
          </div>

          <div className="flex items-center gap-4 text-sm text-brand-200">
            <span>© 2024 KaryaSync Inc.</span>
            <span>•</span>
            <span>Privacy Policy</span>
            <span>•</span>
            <span>Terms of Service</span>
          </div>
        </div>
      </div>

      {/* Right Side - Login Form */}
      <div className="w-full lg:w-1/2 flex items-center justify-center p-8 bg-slate-50">
        <div className="max-w-md w-full bg-white p-8 rounded-2xl shadow-card border border-slate-100">
          <div className="text-center mb-10">
            <div className="inline-flex items-center justify-center w-14 h-14 bg-brand-50 rounded-2xl mb-6 text-brand-600">
              <LogIn className="w-7 h-7" />
            </div>
            <h2 className="text-2xl font-display font-bold text-slate-900">Selamat Datang Kembali</h2>
            <p className="text-slate-500 mt-2">Masuk untuk mengakses akun Anda</p>
          </div>

          <form onSubmit={handleSubmit} className="space-y-6">
            <div>
              <label htmlFor="email" className="block text-sm font-medium text-slate-700 mb-2">
                Alamat Email
              </label>
              <input
                id="email"
                type="email"
                value={email}
                onChange={(e) => setEmail(e.target.value)}
                className="input"
                placeholder="anda@perusahaan.com"
                required
              />
            </div>

            <div>
              <div className="flex items-center justify-between mb-2">
                <label htmlFor="password" className="block text-sm font-medium text-slate-700">
                  Kata Sandi
                </label>
                <a href="#" className="text-sm font-medium text-brand-600 hover:text-brand-700">
                  Lupa kata sandi?
                </a>
              </div>
              <input
                id="password"
                type="password"
                value={password}
                onChange={(e) => setPassword(e.target.value)}
                className="input"
                placeholder="••••••••"
                required
              />
            </div>

            <button
              type="submit"
              disabled={loading}
              className="w-full btn btn-primary py-3 text-base shadow-lg shadow-brand-500/25"
            >
              {loading ? 'Memproses...' : 'Masuk ke Akun'}
            </button>
          </form>

          <div className="mt-8 pt-6 border-t border-slate-100">
            <div className="bg-slate-50 rounded-xl p-4 border border-slate-100">
              <p className="text-xs font-semibold text-slate-500 uppercase tracking-wider mb-2 text-center">
                Demo Credentials
              </p>
              <div className="flex justify-between text-sm">
                <span className="text-slate-600">Email: <span className="font-medium text-slate-900">budi.santoso@company.com</span></span>
                <span className="text-slate-600">Pass: <span className="font-medium text-slate-900">password123</span></span>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  )
}

export default Login
