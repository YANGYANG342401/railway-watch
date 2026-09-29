import { useState } from 'react'
import { ChevronLeft, Battery, Bluetooth, RefreshCw, Download, Unlink } from 'lucide-react'
import '../index.css'

export function RingManagePage() {
  const [isDark] = useState(true)
  const ring = {
    name: '北仑指环 R1',
    sn: 'BLR1-08872',
    battery: 67,
    connected: true,
    firmware: 'v2.3.1',
    hasUpdate: true,
    wearFinger: '左手中指',
    size: 'L 号',
  }

  return (
    <div className={`min-h-screen ${isDark ? 'bg-[#121721]' : 'bg-[#f3efe7]'}`}>
      <div className="max-w-[430px] mx-auto">
        <SubHeader title="指环管理" isDark={isDark} />

        <div className="px-5 py-4 pb-10">
          {/* 指环状态大卡 */}
          <div className={`rounded-3xl p-5 mb-4 flex items-center gap-4 ${isDark ? 'bg-gradient-to-br from-teal-900/40 to-slate-800/60 border border-teal-800/30' : 'bg-gradient-to-br from-teal-50 to-white border border-teal-200 shadow-sm'}`}>
            <div className={`w-20 h-20 rounded-full flex items-center justify-center flex-shrink-0 ${isDark ? 'bg-slate-800' : 'bg-white'}`}>
              <RingGlyph className={`w-12 h-12 ${isDark ? 'text-teal-400' : 'text-teal-600'}`} />
            </div>
            <div className="flex-1">
              <p className={`text-xl font-bold ${isDark ? 'text-white' : 'text-slate-800'}`}>{ring.name}</p>
              <div className="flex items-center gap-1.5 mt-1">
                <span className={`w-2 h-2 rounded-full ${ring.connected ? 'bg-emerald-400' : 'bg-red-400'}`} />
                <span className={`text-sm ${isDark ? 'text-slate-400' : 'text-slate-500'}`}>{ring.connected ? '已连接' : '未连接'}</span>
              </div>
              <div className="flex items-center gap-1.5 mt-2">
                <Battery className={`w-4 h-4 ${ring.battery > 20 ? 'text-emerald-500' : 'text-red-500'}`} />
                <span className={`text-base font-bold ${isDark ? 'text-white' : 'text-slate-800'}`}>{ring.battery}%</span>
              </div>
            </div>
          </div>

          {/* 信息列表 */}
          <div className={`rounded-3xl overflow-hidden mb-4 ${isDark ? 'bg-slate-800/50 border border-slate-700/50' : 'bg-white border border-slate-200 shadow-sm'}`}>
            <InfoRow label="设备编号" value={ring.sn} isDark={isDark} />
            <InfoRow label="佩戴位置" value={ring.wearFinger} isDark={isDark} divider />
            <InfoRow label="尺码" value={ring.size} isDark={isDark} divider />
            <InfoRow label="固件版本" value={ring.firmware} isDark={isDark} divider
              badge={ring.hasUpdate ? '有更新' : undefined} />
          </div>

          {/* 操作按钮 */}
          <div className="space-y-3">
            {ring.hasUpdate && (
              <ActionBtn icon={<Download className="w-5 h-5" />} label="升级固件到 v2.4.0" desc="修复了同步偶尔断开的问题" isDark={isDark} primary />
            )}
            <ActionBtn icon={<Bluetooth className="w-5 h-5" />} label="重新连接" desc="连不上时试试" isDark={isDark} />
            <ActionBtn icon={<RefreshCw className="w-5 h-5" />} label="重新配对" desc="换手机或换指环后用" isDark={isDark} />
            <ActionBtn icon={<Unlink className="w-5 h-5" />} label="解除绑定" desc="解绑后将停止数据同步" isDark={isDark} danger />
          </div>
        </div>
      </div>
    </div>
  )
}

function InfoRow({ label, value, isDark, divider, badge }: { label: string; value: string; isDark: boolean; divider?: boolean; badge?: string }) {
  return (
    <div className={`flex items-center px-5 py-3.5 ${divider ? (isDark ? 'border-t border-slate-700/40' : 'border-t border-slate-100') : ''}`}>
      <span className={`text-base ${isDark ? 'text-slate-300' : 'text-slate-600'}`}>{label}</span>
      <span className={`ml-auto text-base font-medium ${isDark ? 'text-white' : 'text-slate-800'}`}>{value}</span>
      {badge && <span className="ml-2 text-xs px-2 py-0.5 rounded-full bg-amber-500/20 text-amber-400">{badge}</span>}
    </div>
  )
}

function ActionBtn({ icon, label, desc, isDark, primary, danger }: { icon: React.ReactNode; label: string; desc: string; isDark: boolean; primary?: boolean; danger?: boolean }) {
  return (
    <button className={`w-full flex items-center gap-3 px-5 py-4 rounded-2xl text-left active:scale-[0.98] transition-transform ${
      primary ? 'bg-gradient-to-r from-teal-500 to-cyan-500 text-white'
      : danger ? (isDark ? 'bg-slate-800/50 border border-red-500/30' : 'bg-white border border-red-200 shadow-sm')
      : (isDark ? 'bg-slate-800/50 border border-slate-700/50' : 'bg-white border border-slate-200 shadow-sm')
    }`}>
      <span className={primary ? 'text-white' : danger ? 'text-red-400' : (isDark ? 'text-teal-400' : 'text-teal-600')}>{icon}</span>
      <div>
        <p className={`text-base font-bold ${primary ? 'text-white' : danger ? 'text-red-400' : (isDark ? 'text-white' : 'text-slate-800')}`}>{label}</p>
        <p className={`text-xs mt-0.5 ${primary ? 'text-white/80' : (isDark ? 'text-slate-500' : 'text-slate-400')}`}>{desc}</p>
      </div>
    </button>
  )
}

function RingGlyph({ className }: { className?: string }) {
  return <svg className={className} viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.6"><circle cx="12" cy="12" r="8" /><circle cx="12" cy="12" r="4" /></svg>
}

function SubHeader({ title, isDark }: { title: string; isDark: boolean }) {
  return (
    <header className={`sticky top-0 z-20 flex items-center gap-3 px-4 py-3 backdrop-blur-xl ${isDark ? 'bg-[#121721]/90 border-b border-slate-800' : 'bg-[#f3efe7]/90 border-b border-slate-200'}`}>
      <button
        onClick={() => window.history.back()}
        className={`w-9 h-9 rounded-full flex items-center justify-center active:scale-90 transition-transform ${isDark ? 'bg-slate-800 text-slate-300' : 'bg-white text-slate-600 shadow-sm'}`}
      >
        <ChevronLeft className="w-5 h-5" />
      </button>
      <span className={`text-lg font-bold ${isDark ? 'text-white' : 'text-slate-800'}`}>{title}</span>
    </header>
  )
}
