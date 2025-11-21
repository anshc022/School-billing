import { useState } from 'react'
import { useToastContext } from '@/components/ToastProvider'
import { Save, School, Globe, Moon, Info, Shield } from 'lucide-react'

export const SettingsPage = () => {
  const [settings, setSettings] = useState({
    schoolName: 'Your School Name',
    currency: 'INR',
    darkMode: false,
  })
  const { addToast } = useToastContext()

  const handleSave = async () => {
    try {
      const result = await window.api.updateSettings(settings)
      if (result.success) {
        addToast('Settings saved successfully', 'success')
      }
    } catch (error) {
      addToast('Failed to save settings', 'error')
    }
  }

  return (
    <div className="max-w-4xl mx-auto space-y-8">
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-3xl font-bold text-slate-900 dark:text-white tracking-tight">Settings</h1>
          <p className="text-slate-500 dark:text-slate-400 mt-1">Manage your school configuration and preferences.</p>
        </div>
        <button
          onClick={handleSave}
          className="flex items-center gap-2 bg-blue-600 text-white px-6 py-2.5 rounded-xl hover:bg-blue-700 transition-all shadow-lg shadow-blue-500/30 font-medium"
        >
          <Save size={18} />
          Save Changes
        </button>
      </div>

      <div className="grid grid-cols-1 gap-6">
        {/* School Information */}
        <div className="bg-white dark:bg-slate-800 rounded-2xl p-6 shadow-sm border border-slate-100 dark:border-slate-700">
          <div className="flex items-center gap-3 mb-6 pb-4 border-b border-slate-100 dark:border-slate-700">
            <div className="p-2 bg-blue-50 dark:bg-blue-900/30 rounded-lg text-blue-600 dark:text-blue-400">
              <School size={24} />
            </div>
            <div>
              <h2 className="text-lg font-bold text-slate-900 dark:text-white">School Profile</h2>
              <p className="text-sm text-slate-500 dark:text-slate-400">Basic information about your institution</p>
            </div>
          </div>
          
          <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
            <div className="space-y-2">
              <label className="text-sm font-semibold text-slate-700 dark:text-slate-300">
                School Name
              </label>
              <input
                type="text"
                value={settings.schoolName}
                onChange={(e) => setSettings({ ...settings, schoolName: e.target.value })}
                className="w-full px-4 py-2.5 border border-slate-200 dark:border-slate-700 rounded-xl bg-slate-50 dark:bg-slate-900 text-slate-900 dark:text-white focus:ring-2 focus:ring-blue-500/20 focus:border-blue-500 outline-none transition-all"
                placeholder="Enter school name"
              />
            </div>
            <div className="space-y-2">
              <label className="text-sm font-semibold text-slate-700 dark:text-slate-300">
                Currency
              </label>
              <div className="relative">
                <Globe className="absolute left-3 top-3 text-slate-400" size={18} />
                <select
                  value={settings.currency}
                  onChange={(e) => setSettings({ ...settings, currency: e.target.value })}
                  className="w-full pl-10 pr-4 py-2.5 border border-slate-200 dark:border-slate-700 rounded-xl bg-slate-50 dark:bg-slate-900 text-slate-900 dark:text-white focus:ring-2 focus:ring-blue-500/20 focus:border-blue-500 outline-none transition-all appearance-none"
                >
                  <option value="INR">INR (₹) - Indian Rupee</option>
                  <option value="USD">USD ($) - US Dollar</option>
                  <option value="EUR">EUR (€) - Euro</option>
                </select>
              </div>
            </div>
          </div>
        </div>

        {/* Appearance */}
        <div className="bg-white dark:bg-slate-800 rounded-2xl p-6 shadow-sm border border-slate-100 dark:border-slate-700">
          <div className="flex items-center gap-3 mb-6 pb-4 border-b border-slate-100 dark:border-slate-700">
            <div className="p-2 bg-purple-50 dark:bg-purple-900/30 rounded-lg text-purple-600 dark:text-purple-400">
              <Moon size={24} />
            </div>
            <div>
              <h2 className="text-lg font-bold text-slate-900 dark:text-white">Appearance</h2>
              <p className="text-sm text-slate-500 dark:text-slate-400">Customize how the application looks</p>
            </div>
          </div>

          <div className="relative flex items-center justify-between p-4 bg-slate-50 dark:bg-slate-900 rounded-xl border border-slate-100 dark:border-slate-700">
            <div className="flex items-center gap-3">
              <div className={`w-10 h-6 rounded-full p-1 transition-colors ${settings.darkMode ? 'bg-blue-600' : 'bg-slate-300'}`}>
                <div className={`w-4 h-4 rounded-full bg-white shadow-sm transform transition-transform ${settings.darkMode ? 'translate-x-4' : 'translate-x-0'}`} />
              </div>
              <span className="font-medium text-slate-700 dark:text-slate-300">Dark Mode</span>
            </div>
            <input
              type="checkbox"
              checked={settings.darkMode}
              onChange={(e) => {
                const isDark = e.target.checked
                setSettings({ ...settings, darkMode: isDark })
                if (isDark) {
                  document.documentElement.classList.add('dark')
                } else {
                  document.documentElement.classList.remove('dark')
                }
              }}
              className="absolute opacity-0 w-full h-full cursor-pointer left-0 top-0"
            />
          </div>
        </div>

        {/* System Info */}
        <div className="bg-white dark:bg-slate-800 rounded-2xl p-6 shadow-sm border border-slate-100 dark:border-slate-700">
          <div className="flex items-center gap-3 mb-6 pb-4 border-b border-slate-100 dark:border-slate-700">
            <div className="p-2 bg-emerald-50 dark:bg-emerald-900/30 rounded-lg text-emerald-600 dark:text-emerald-400">
              <Info size={24} />
            </div>
            <div>
              <h2 className="text-lg font-bold text-slate-900 dark:text-white">System Information</h2>
              <p className="text-sm text-slate-500 dark:text-slate-400">Technical details about your installation</p>
            </div>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
            <div className="p-4 bg-slate-50 dark:bg-slate-900 rounded-xl border border-slate-100 dark:border-slate-700">
              <p className="text-xs text-slate-500 uppercase tracking-wider font-semibold mb-1">Version</p>
              <p className="font-mono text-slate-900 dark:text-white font-medium">v1.0.0</p>
            </div>
            <div className="p-4 bg-slate-50 dark:bg-slate-900 rounded-xl border border-slate-100 dark:border-slate-700">
              <p className="text-xs text-slate-500 uppercase tracking-wider font-semibold mb-1">Database</p>
              <p className="font-mono text-slate-900 dark:text-white font-medium">SQLite (Local)</p>
            </div>
            <div className="p-4 bg-slate-50 dark:bg-slate-900 rounded-xl border border-slate-100 dark:border-slate-700">
              <p className="text-xs text-slate-500 uppercase tracking-wider font-semibold mb-1">License</p>
              <div className="flex items-center gap-2 text-emerald-600 dark:text-emerald-400 font-medium">
                <Shield size={14} />
                <span>Active</span>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  )
}
