import { useState, useEffect } from 'react'
import {
  Sun,
  MoonStar,
  Zap,
  ChevronRight,
  Vibrate,
  Bell,
  BellRing,
  Moon as MoonIcon,
  RefreshCw,
  ShieldCheck,
  FileText,
  Info,
  LogOut,
  Eye,
  Watch,
  Clock,
} from 'lucide-react'
import '../index.css'

export function SettingsPage() {
  const [isDark, setIsDark] = useState(true)
  const [mounted, setMounted] = useState(false)

  // 提醒设置开关
  const [alertVibrate, setAlertVibrate] = useState(true)
  const [wearRemind, setWearRemind] = useState(true)
  const [dailyPush, setDailyPush] = useState(true)
  const [autoSync, setAutoSync] = useState(true)

  // 退出登录确认
  const [showLogout, setShowLogout] = useState(false)

  useEffect(() => {
    setMounted(true)
  }, [])

  return (
    <div className={`min-h-screen transition-colors duration-500 ${isDark ? 'bg-[#121721]' : 'bg-[#f3efe7]'}`}>
      <div className="max-w-[430px] mx-auto px-5 py-5 pb-32">

        {/* 顶部栏 */}
        <div className="flex items-center justify-between mb-5">
          <p className={`text-2xl font-bold ${isDark ? 'text-white' : 'text-slate-800'}`}>设置</p>
          <button
            onClick={() => setIsDark(!isDark)}
            className={`w-11 h-11 rounded-full flex items-center justify-center transition-all active:scale-90 ${
              isDark ? 'bg-slate-800 text-amber-400' : 'bg-white text-slate-600 shadow-md'
            }`}
          >
            {isDark ? <Sun className="w-5 h-5" /> : <MoonStar className="w-5 h-5" />}
          </button>
        </div>

        {/* 我的设备与记录 */}
        <SettingGroup title="我的设备与记录" isDark={isDark} mounted={mounted} delay={0}>
          <LinkRow icon={<Watch className="w-5 h-5" />} label="指环管理" hint="电量 67% · 已连接" isDark={isDark} onClick={() => { window.location.hash = '#ring' }} />
          <Divider isDark={isDark} />
          <LinkRow icon={<Clock className="w-5 h-5" />} label="工时记录" hint="本月 168 小时" isDark={isDark} onClick={() => { window.location.hash = '#worktime' }} />
          <Divider isDark={isDark} />
          <LinkRow icon={<Eye className="w-5 h-5" />} label="公司能看到啥" hint="数据透明" isDark={isDark} highlight onClick={() => { window.location.hash = '#datavisible' }} />
        </SettingGroup>

        {/* 提醒设置 */}
        <SettingGroup title="提醒" isDark={isDark} mounted={mounted} delay={80}>
          <ToggleRow
            icon={<Vibrate className="w-5 h-5" />}
            label="预警震动"
            desc="心率、血氧异常时指环震动提醒"
            value={alertVibrate}
            onToggle={() => setAlertVibrate(!alertVibrate)}
            isDark={isDark}
          />
          <Divider isDark={isDark} />
          <ToggleRow
            icon={<BellRing className="w-5 h-5" />}
            label="佩戴提醒"
            desc="忘戴或离线超30分钟时提醒"
            value={wearRemind}
            onToggle={() => setWearRemind(!wearRemind)}
            isDark={isDark}
          />
          <Divider isDark={isDark} />
          <ToggleRow
            icon={<Bell className="w-5 h-5" />}
            label="每日健康推送"
            desc="每天上班前推送状态评分，最多1条"
            value={dailyPush}
            onToggle={() => setDailyPush(!dailyPush)}
            isDark={isDark}
          />
        </SettingGroup>

        {/* 通用 */}
        <SettingGroup title="通用" isDark={isDark} mounted={mounted} delay={160}>
          <ToggleRow
            icon={<MoonIcon className="w-5 h-5" />}
            label="深色模式"
            desc="夜班护眼，默认开启"
            value={isDark}
            onToggle={() => setIsDark(!isDark)}
            isDark={isDark}
          />
          <Divider isDark={isDark} />
          <ToggleRow
            icon={<RefreshCw className="w-5 h-5" />}
            label="自动同步数据"
            desc="连上指环时自动上传，省流量可关"
            value={autoSync}
            onToggle={() => setAutoSync(!autoSync)}
            isDark={isDark}
          />
        </SettingGroup>

        {/* 隐私与说明 */}
        <SettingGroup title="隐私与说明" isDark={isDark} mounted={mounted} delay={240}>
          <LinkRow icon={<ShieldCheck className="w-5 h-5" />} label="数据怎么用的" hint="" isDark={isDark} onClick={() => { window.location.hash = '#doc-data' }} />
          <Divider isDark={isDark} />
          <LinkRow icon={<FileText className="w-5 h-5" />} label="用户协议" hint="" isDark={isDark} onClick={() => { window.location.hash = '#doc-agreement' }} />
          <Divider isDark={isDark} />
          <LinkRow icon={<FileText className="w-5 h-5" />} label="隐私政策" hint="" isDark={isDark} onClick={() => { window.location.hash = '#doc-privacy' }} />
        </SettingGroup>

        {/* 关于 */}
        <SettingGroup title="关于" isDark={isDark} mounted={mounted} delay={320}>
          <LinkRow icon={<Info className="w-5 h-5" />} label="版本信息" hint="v1.0.0" isDark={isDark} onClick={() => { window.location.hash = '#doc-about' }} />
        </SettingGroup>

        {/* 退出登录 */}
        <button
          onClick={() => setShowLogout(true)}
          className={`w-full mt-2 py-3.5 rounded-2xl text-base font-bold flex items-center justify-center gap-2 transition-all active:scale-[0.98] ${
            isDark ? 'bg-slate-800/60 text-red-400 border border-slate-700/50' : 'bg-white text-red-500 border border-slate-200 shadow-sm'
          }`}>
          <LogOut className="w-5 h-5" />
          退出登录
        </button>

      </div>

      {/* 退出登录确认弹窗 */}
      {showLogout && (
        <div className="fixed inset-0 z-50 flex items-center justify-center px-8">
          <div className="absolute inset-0 bg-black/50 backdrop-blur-sm" onClick={() => setShowLogout(false)} />
          <div className={`relative w-full max-w-[320px] rounded-3xl p-6 ${isDark ? 'bg-[#1a2230]' : 'bg-white'}`}>
            <p className={`text-lg font-bold text-center mb-2 ${isDark ? 'text-white' : 'text-slate-800'}`}>确定退出登录？</p>
            <p className={`text-sm text-center mb-6 ${isDark ? 'text-slate-400' : 'text-slate-500'}`}>退出后指环数据会暂停同步</p>
            <div className="flex gap-3">
              <button
                onClick={() => setShowLogout(false)}
                className={`flex-1 py-3 rounded-2xl text-base font-semibold ${isDark ? 'bg-slate-700/60 text-slate-300' : 'bg-slate-100 text-slate-600'}`}
              >
                再想想
              </button>
              <button
                onClick={() => setShowLogout(false)}
                className="flex-1 py-3 rounded-2xl text-base font-bold bg-red-500 text-white active:scale-[0.98] transition-transform"
              >
                退出
              </button>
            </div>
          </div>
        </div>
      )}

      <BottomNav isDark={isDark} />
    </div>
  )
}

// ===== 通用组件 =====

function SettingGroup({ title, children, isDark, mounted, delay }: { title: string; children: React.ReactNode; isDark: boolean; mounted: boolean; delay: number }) {
  return (
    <div
      className={`mb-4 transition-all duration-500 ${mounted ? 'opacity-100 translate-y-0' : 'opacity-0 translate-y-4'}`}
      style={{ transitionDelay: `${delay}ms` }}
    >
      <p className={`text-sm font-semibold mb-2 px-1 ${isDark ? 'text-slate-400' : 'text-slate-500'}`}>{title}</p>
      <div className={`rounded-3xl px-5 py-1 ${isDark ? 'bg-slate-800/50 border border-slate-700/50' : 'bg-white border border-slate-200 shadow-sm'}`}>
        {children}
      </div>
    </div>
  )
}

function ToggleRow({ icon, label, desc, value, onToggle, isDark }: {
  icon: React.ReactNode; label: string; desc: string; value: boolean; onToggle: () => void; isDark: boolean
}) {
  return (
    <div className="flex items-center gap-3 py-3.5">
      <div className={`w-10 h-10 rounded-xl flex items-center justify-center flex-shrink-0 ${isDark ? 'bg-slate-700 text-slate-300' : 'bg-slate-100 text-slate-600'}`}>
        {icon}
      </div>
      <div className="flex-1 min-w-0">
        <p className={`text-base font-semibold ${isDark ? 'text-white' : 'text-slate-800'}`}>{label}</p>
        <p className={`text-xs mt-0.5 ${isDark ? 'text-slate-500' : 'text-slate-400'}`}>{desc}</p>
      </div>
      <button
        onClick={onToggle}
        className={`relative w-12 h-6 rounded-full flex-shrink-0 transition-colors ${value ? 'bg-teal-500' : (isDark ? 'bg-slate-600' : 'bg-slate-300')}`}
      >
        <span className={`absolute top-0.5 w-5 h-5 rounded-full bg-white transition-all ${value ? 'left-6' : 'left-0.5'}`} />
      </button>
    </div>
  )
}

function LinkRow({ icon, label, hint, isDark, highlight, onClick }: { icon: React.ReactNode; label: string; hint: string; isDark: boolean; highlight?: boolean; onClick?: () => void }) {
  return (
    <button onClick={onClick} className="w-full flex items-center gap-3 py-3.5 active:opacity-60 transition-opacity">
      <div className={`w-10 h-10 rounded-xl flex items-center justify-center flex-shrink-0 ${
        highlight ? (isDark ? 'bg-teal-500/15 text-teal-400' : 'bg-teal-50 text-teal-600') : (isDark ? 'bg-slate-700 text-slate-300' : 'bg-slate-100 text-slate-600')
      }`}>
        {icon}
      </div>
      <span className={`text-base font-semibold ${isDark ? 'text-white' : 'text-slate-800'}`}>{label}</span>
      <span className={`ml-auto text-sm ${isDark ? 'text-slate-500' : 'text-slate-400'}`}>{hint}</span>
      <ChevronRight className={`w-5 h-5 ${isDark ? 'text-slate-600' : 'text-slate-300'}`} />
    </button>
  )
}

function Divider({ isDark }: { isDark: boolean }) {
  return <div className={`h-px ${isDark ? 'bg-slate-700/50' : 'bg-slate-100'}`} />
}

// ===== 底部导航 =====
function BottomNav({ isDark }: { isDark: boolean }) {
  const [activeTab, setActiveTab] = useState('settings')

  const handleNavClick = (tab: string) => {
    setActiveTab(tab)
    if (tab === 'home') {
      window.location.hash = '#'
    } else if (tab === 'health') {
      window.location.hash = '#health'
    } else if (tab === 'mine') {
      window.location.hash = '#mine'
    } else if (tab === 'ask') {
      window.location.hash = '#ask'
    }
  }

  return (
    <div className="fixed bottom-0 inset-x-0 z-50" style={{ paddingBottom: 'env(safe-area-inset-bottom, 0px)' }}>
      <div className={`max-w-[430px] mx-auto ${isDark ? 'bg-[#121721]' : 'bg-white'} border-t ${isDark ? 'border-slate-800' : 'border-slate-200'}`}>
        <div className="flex items-center justify-between px-6 py-3">
          <NavItem icon={<HomeIcon />} label="首页" active={activeTab === 'home'} onClick={() => handleNavClick('home')} isDark={isDark} />
          <NavItem icon={<ChartIcon />} label="健康" active={activeTab === 'health'} onClick={() => handleNavClick('health')} isDark={isDark} />
          <button onClick={() => handleNavClick('ask')} className={`relative -mt-8 w-16 h-16 rounded-full bg-gradient-to-br from-teal-400 via-teal-500 to-cyan-600 flex items-center justify-center shadow-lg shadow-teal-500/40 transition-all duration-200 active:scale-90 ${activeTab === 'ask' ? 'ring-4 ring-teal-400/30' : ''}`}>
            <div className="absolute inset-0 rounded-full bg-gradient-to-br from-white/20 to-transparent" />
            <div className="absolute top-1 right-2 w-2 h-2 rounded-full bg-white/60 animate-pulse" />
            <Zap className="w-7 h-7 text-white relative z-10" />
          </button>
          <NavItem icon={<UserIcon />} label="我的" active={activeTab === 'mine'} onClick={() => handleNavClick('mine')} isDark={isDark} />
          <NavItem icon={<SettingsGlyph />} label="设置" active={activeTab === 'settings'} onClick={() => handleNavClick('settings')} isDark={isDark} />
        </div>
      </div>
      <div className={`${isDark ? 'bg-[#121721]' : 'bg-white'}`} style={{ height: 'env(safe-area-inset-bottom, 0px)' }} />
    </div>
  )
}

function NavItem({ icon, label, active, onClick, isDark }: { icon: React.ReactNode; label: string; active: boolean; onClick: () => void; isDark: boolean }) {
  return (
    <button onClick={onClick} className={`flex flex-col items-center gap-1 px-3 py-1 transition-all duration-150 active:scale-90 ${active ? (isDark ? 'text-teal-400' : 'text-teal-600') : (isDark ? 'text-slate-500' : 'text-slate-400')}`}>
      <span className="h-5 w-5">{icon}</span>
      <span className="text-xs font-medium">{label}</span>
    </button>
  )
}

function HomeIcon() {
  return <svg className="h-5 w-5" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><path d="M3 9l9-7 9 7v11a2 2 0 0 1-2 2H5a2 2 0 0 1-2-2z" /><polyline points="9 22 9 12 15 12 15 22" /></svg>
}
function ChartIcon() {
  return <svg className="h-5 w-5" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><line x1="18" y1="20" x2="18" y2="10" /><line x1="12" y1="20" x2="12" y2="4" /><line x1="6" y1="20" x2="6" y2="14" /></svg>
}
function UserIcon() {
  return <svg className="h-5 w-5" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><path d="M20 21v-2a4 4 0 0 0-4-4H8a4 4 0 0 0-4 4v2" /><circle cx="12" cy="7" r="4" /></svg>
}
function SettingsGlyph() {
  return <svg className="h-5 w-5" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><circle cx="12" cy="12" r="3" /><path d="M19.4 15a1.65 1.65 0 0 0 .33 1.82l.06.06a2 2 0 0 1 0 2.83 2 2 0 0 1-2.83 0l-.06-.06a1.65 1.65 0 0 0-1.82-.33 1.65 1.65 0 0 0-1 1.51V21a2 2 0 0 1-2 2 2 2 0 0 1-2-2v-.09A1.65 1.65 0 0 0 9 19.4a1.65 1.65 0 0 0-1.82.33l-.06.06a2 2 0 0 1-2.83 0 2 2 0 0 1 0-2.83l.06-.06a1.65 1.65 0 0 0 .33-1.82 1.65 1.65 0 0 0-1.51-1H3a2 2 0 0 1-2-2 2 2 0 0 1 2-2h.09A1.65 1.65 0 0 0 4.6 9a1.65 1.65 0 0 0-.33-1.82l-.06-.06a2 2 0 0 1 0-2.83 2 2 0 0 1 2.83 0l.06.06a1.65 1.65 0 0 0 1.82.33H9a1.65 1.65 0 0 0 1-1.51V3a2 2 0 0 1 2-2 2 2 0 0 1 2 2v.09a1.65 1.65 0 0 0 1 1.51 1.65 1.65 0 0 0 1.82-.33l.06-.06a2 2 0 0 1 2.83 0 2 2 0 0 1 0 2.83l-.06.06a1.65 1.65 0 0 0-.33 1.82V9a1.65 1.65 0 0 0 1.51 1H21a2 2 0 0 1 2 2 2 2 0 0 1-2 2h-.09a1.65 1.65 0 0 0-1.51 1z" /></svg>
}
