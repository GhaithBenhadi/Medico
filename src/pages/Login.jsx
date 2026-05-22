import { useState } from 'react'
import { Stethoscope, Eye, EyeOff, ArrowRight, AlertCircle } from 'lucide-react'
import { useAuth } from '../context/AuthContext'

const demoAccounts = [
  { role: 'Medicalliance',      email: 'karim@medicalliance.fr',    color: 'from-brand-500 to-blue-600',    initials: 'KM', name: 'Karim Mansouri' },
  { role: 'Centrale',           email: 'sophie@groupement-so.fr',   color: 'from-violet-500 to-purple-600', initials: 'SL', name: 'Sophie Lambert' },
  { role: 'Adhérent',           email: 'pierre@medipro.fr',         color: 'from-emerald-500 to-green-600', initials: 'PM', name: 'Pierre Martin' },
  { role: 'Établissement',      email: 'isabelle@ehpad-jardins.fr', color: 'from-amber-500 to-orange-500',  initials: 'IM', name: 'Isabelle Morin' },
]

export default function Login({ onLogin }) {
  const { login } = useAuth()
  const [email,    setEmail]    = useState('')
  const [password, setPassword] = useState('')
  const [showPwd,  setShowPwd]  = useState(false)
  const [loading,  setLoading]  = useState(false)
  const [error,    setError]    = useState('')

  const handleSubmit = async (e) => {
    e.preventDefault()
    setError('')
    setLoading(true)
    try {
      const user = await login(email, password)
      onLogin(user)
    } catch (err) {
      setError(err.message || 'Identifiants incorrects')
    } finally {
      setLoading(false)
    }
  }

  const fillDemo = (acc) => {
    setEmail(acc.email)
    setPassword('demo1234')
    setError('')
  }

  return (
    <div className="min-h-screen bg-surface-50 flex">
      {/* Left panel — démo */}
      <div className="hidden lg:flex flex-col w-96 bg-gradient-to-br from-brand-900 via-brand-800 to-blue-900 p-10 text-white shrink-0">
        <div className="flex items-center gap-3 mb-12">
          <div className="w-9 h-9 rounded-xl bg-white/15 backdrop-blur flex items-center justify-center">
            <Stethoscope className="w-5 h-5 text-white" strokeWidth={2.2} />
          </div>
          <div>
            <span className="text-base font-bold tracking-tight">Medico</span>
            <span className="text-sm text-blue-300 font-semibold ml-1.5">Pro</span>
          </div>
        </div>

        <div className="flex-1">
          <h2 className="text-2xl font-bold mb-2 leading-tight">
            La plateforme des équipements médicaux
          </h2>
          <p className="text-blue-200 text-sm leading-relaxed mb-10">
            Connectez centrales, fournisseurs et établissements autour d'un flux unique, moderne et intelligent.
          </p>

          <p className="text-xs font-bold text-blue-300 uppercase tracking-widest mb-4">
            Comptes de démo
          </p>
          <div className="space-y-3">
            {demoAccounts.map((acc) => (
              <button
                key={acc.email}
                onClick={() => fillDemo(acc)}
                className="w-full flex items-center gap-3 bg-white/8 hover:bg-white/15 border border-white/10 rounded-xl p-3.5 transition-all text-left group"
              >
                <div className={`w-9 h-9 rounded-xl bg-gradient-to-br ${acc.color} flex items-center justify-center text-white text-xs font-bold shrink-0`}>
                  {acc.initials}
                </div>
                <div className="min-w-0">
                  <p className="text-sm font-semibold text-white truncate">{acc.name}</p>
                  <p className="text-xs text-blue-300 truncate">{acc.role}</p>
                </div>
                <ArrowRight className="w-4 h-4 text-blue-400 opacity-0 group-hover:opacity-100 ml-auto transition-opacity shrink-0" />
              </button>
            ))}
          </div>
          <p className="text-xs text-blue-400 mt-4">Mot de passe démo : <code className="bg-white/10 px-1.5 py-0.5 rounded">demo1234</code></p>
        </div>

        <p className="text-xs text-blue-500 mt-8">© 2026 Medicalliance · Tous droits réservés</p>
      </div>

      {/* Right panel — formulaire */}
      <div className="flex-1 flex items-center justify-center p-8">
        <div className="w-full max-w-sm">
          {/* Mobile logo */}
          <div className="flex items-center gap-2 mb-8 lg:hidden">
            <div className="w-8 h-8 rounded-xl bg-brand-600 flex items-center justify-center">
              <Stethoscope className="w-4 h-4 text-white" strokeWidth={2.2} />
            </div>
            <span className="text-sm font-bold text-gray-900">Medico Pro</span>
          </div>

          <h1 className="text-2xl font-bold text-gray-900 mb-1">Connexion</h1>
          <p className="text-sm text-gray-500 mb-8">Accédez à votre espace Medico Pro</p>

          <form onSubmit={handleSubmit} className="space-y-4">
            <div>
              <label className="block text-xs font-semibold text-gray-700 mb-1.5">
                Adresse email
              </label>
              <input
                type="email"
                autoComplete="email"
                required
                value={email}
                onChange={e => setEmail(e.target.value)}
                className="w-full px-4 py-3 border border-surface-200 rounded-xl text-sm focus:outline-none focus:border-brand-400 focus:ring-2 focus:ring-brand-100 transition-all bg-white"
                placeholder="vous@exemple.fr"
              />
            </div>

            <div>
              <label className="block text-xs font-semibold text-gray-700 mb-1.5">
                Mot de passe
              </label>
              <div className="relative">
                <input
                  type={showPwd ? 'text' : 'password'}
                  autoComplete="current-password"
                  required
                  value={password}
                  onChange={e => setPassword(e.target.value)}
                  className="w-full px-4 py-3 pr-11 border border-surface-200 rounded-xl text-sm focus:outline-none focus:border-brand-400 focus:ring-2 focus:ring-brand-100 transition-all bg-white"
                  placeholder="••••••••"
                />
                <button
                  type="button"
                  onClick={() => setShowPwd(!showPwd)}
                  className="absolute right-3.5 top-1/2 -translate-y-1/2 text-gray-400 hover:text-gray-600 transition-colors"
                >
                  {showPwd ? <EyeOff className="w-4 h-4" /> : <Eye className="w-4 h-4" />}
                </button>
              </div>
            </div>

            {error && (
              <div className="flex items-center gap-2 text-red-600 bg-red-50 border border-red-200 rounded-xl px-4 py-3 text-sm animate-fade-in">
                <AlertCircle className="w-4 h-4 shrink-0" />
                {error}
              </div>
            )}

            <button
              type="submit"
              disabled={loading}
              className="w-full py-3 bg-brand-600 hover:bg-brand-700 disabled:opacity-60 disabled:cursor-not-allowed text-white font-semibold rounded-xl transition-colors shadow-sm flex items-center justify-center gap-2"
            >
              {loading ? (
                <span className="w-4 h-4 border-2 border-white/40 border-t-white rounded-full animate-spin" />
              ) : (
                <>Se connecter <ArrowRight className="w-4 h-4" /></>
              )}
            </button>
          </form>

          {/* Mobile demo accounts */}
          <div className="mt-8 lg:hidden">
            <p className="text-xs font-semibold text-gray-400 uppercase tracking-widest mb-3">
              Comptes de démo
            </p>
            <div className="grid grid-cols-2 gap-2">
              {demoAccounts.map((acc) => (
                <button
                  key={acc.email}
                  onClick={() => fillDemo(acc)}
                  className="flex items-center gap-2 p-3 bg-white border border-surface-200 rounded-xl hover:border-brand-300 hover:bg-brand-50 transition-all text-left shadow-xs"
                >
                  <div className={`w-7 h-7 rounded-lg bg-gradient-to-br ${acc.color} flex items-center justify-center text-white text-[10px] font-bold shrink-0`}>
                    {acc.initials}
                  </div>
                  <div className="min-w-0">
                    <p className="text-xs font-semibold text-gray-700 truncate">{acc.role}</p>
                  </div>
                </button>
              ))}
            </div>
            <p className="text-[11px] text-gray-400 mt-2">Mot de passe : <code>demo1234</code></p>
          </div>
        </div>
      </div>
    </div>
  )
}
