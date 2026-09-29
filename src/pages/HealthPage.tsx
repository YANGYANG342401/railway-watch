import { useState, useEffect } from 'react'
import {
  Moon,
  Heart,
  Zap,
  Footprints,
  Sun,
  MoonStar,
  TrendingUp,
  TrendingDown,
  Minus,
  Award,
  Flame,
  CalendarDays,
  Sparkles,
} from 'lucide-react'
import '../index.css'

// 模拟数据 —— 健康页主打"趋势 + 长期 + 针对司机"，区别于首页的"今天此刻"
const healthData = {
  // 身体年龄（强钩子）
  bodyAge: {
    real: 38,
    body: 42,
    lastMonthBody: 43,
    plain: '主要是睡得少、坐得久拉高的。最近一个月降了 1 岁，在往好走。',
  },

  // 这周 vs 上周
  weekCompare: [
    { label: '睡眠', value: '6.8 小时', trend: 'up', changeText: '比上周多睡半小时', good: true },
    { label: '心跳平稳', value: '挺稳', trend: 'flat', changeText: '和上周差不多', good: true },
    { label: '身体恢复', value: '75 分', trend: 'up', changeText: '比上周好一些', good: true },
    { label: '活动量', value: '偏少', trend: 'down', changeText: '比上周少走了不少路', good: false },
  ],

  // 最近30天状态（色块，good/warn/bad/off）
  month: {
    days: [
      'g','g','w','g','g','g','b','g','w','g','g','g','g','b','g','g','w','g','g','g','g','g','w','g','g','g','b','g','g','g',
    ],
    goodDays: 23,
    plain: '这个月大部分日子状态都不错，有几天熬夜后掉下来了。',
  },

  // 这阵子身体给的提醒（针对司机：夜班/久坐/作息）
  reminders: [
    { icon: 'moon', title: '这两周上了 5 个夜班', desc: '比平时多，白天记得补觉，别硬扛', level: 'warning' as const },
    { icon: 'sit', title: '每天平均坐 9 个多小时', desc: '腰和脖子容易出问题，等货时多下来活动', level: 'warning' as const },
    { icon: 'clock', title: '作息比上个月规律了', desc: '上床时间稳定了，继续保持', level: 'good' as const },
  ],

  // 我的坚持（轻量成就）
  achievements: [
    { icon: 'flame', value: 28, unit: '天', label: '连续佩戴' },
    { icon: 'moon', value: 5, unit: '天', label: '本周睡够6小时' },
    { icon: 'award', value: 23, unit: '天', label: '本月状态达标' },
  ],
}

const levelStyle = {
  good: { text: 'text-emerald-400', textLight: 'text-emerald-600', bg: 'bg-emerald-500/15', bgLight: 'bg-emerald-100', bar: 'bg-emerald-500' },
  warning: { text: 'text-amber-400', textLight: 'text-amber-600', bg: 'bg-amber-500/15', bgLight: 'bg-amber-100', bar: 'bg-amber-500' },
  danger: { text: 'text-red-400', textLight: 'text-red-600', bg: 'bg-red-500/15', bgLight: 'bg-red-100', bar: 'bg-red-500' },
}

export function HealthPage() {
  const [isDark, setIsDark] = useState(true)
  const [mounted, setMounted] = useState(false)

  useEffect(() => {
    setMounted(true)
  }, [])

  const d = healthData

  return (
    <div className={`min-h-screen transition-colors duration-500 ${isDark ? 'bg-[#121721]' : 'bg-[#f3efe7]'}`}>
      <div className="max-w-[430px] mx-auto px-5 py-5 pb-32">

        {/* 顶部栏 */}
        <div className="flex items-center justify-between mb-6">
          <div>
            <p className={`text-base ${isDark ? 'text-slate-400' : 'text-slate-500'}`}>最近身体怎么样</p>
            <p className={`text-3xl font-bold ${isDark ? 'text-white' : 'text-slate-800'}`}>张师傅</p>
          </div>
          <button
            onClick={() => setIsDark(!isDark)}
            className={`w-11 h-11 rounded-full flex items-center justify-center transition-all active:scale-90 ${
              isDark ? 'bg-slate-800 text-amber-400' : 'bg-white text-slate-600 shadow-md'
            }`}
          >
            {isDark ? <Sun className="w-5 h-5" /> : <MoonStar className="w-5 h-5" />}
          </button>
        </div>

        {/* 身体年龄 —— 强钩子 */}
        <Section isDark={isDark} mounted={mounted} delay={0}>
          <div className="flex items-center gap-2 mb-3">
            <Heart className={`w-5 h-5 ${isDark ? 'text-rose-400' : 'text-rose-500'}`} fill="currentColor" />
            <span className={`text-lg font-bold ${isDark ? 'text-white' : 'text-slate-800'}`}>你的身体年龄</span>
          </div>

          <div className="flex items-end gap-3 mb-3">
            <div className="flex items-baseline gap-1">
              <span className={`text-6xl font-black ${d.bodyAge.body > d.bodyAge.real ? 'text-amber-400' : 'text-emerald-400'}`}>
                {d.bodyAge.body}
              </span>
              <span className={`text-2xl font-bold ${isDark ? 'text-slate-400' : 'text-slate-500'}`}>岁</span>
            </div>
            <div className={`flex items-center gap-1 mb-2 px-2.5 py-1 rounded-full ${isDark ? 'bg-amber-500/15' : 'bg-amber-100'}`}>
              <span className={`text-sm font-semibold ${isDark ? 'text-amber-400' : 'text-amber-700'}`}>
                比实际大 {d.bodyAge.body - d.bodyAge.real} 岁
              </span>
            </div>
          </div>

          {/* 实际年龄对照 */}
          <div className="flex items-center gap-2 mb-3">
            <span className={`text-sm ${isDark ? 'text-slate-500' : 'text-slate-400'}`}>你今年 {d.bodyAge.real} 岁</span>
            <span className={`flex items-center gap-1 text-sm font-medium ${isDark ? 'text-emerald-400' : 'text-emerald-600'}`}>
              <TrendingDown className="w-4 h-4" /> 比上月降了 {d.bodyAge.lastMonthBody - d.bodyAge.body} 岁
            </span>
          </div>

          <PlainBox isDark={isDark}>{d.bodyAge.plain}</PlainBox>

          <button
            onClick={() => { window.location.hash = '#ask' }}
            className={`w-full mt-3 py-2.5 rounded-2xl text-sm font-semibold flex items-center justify-center gap-1.5 active:scale-[0.98] transition-transform ${
              isDark ? 'bg-teal-500/15 text-teal-300' : 'bg-teal-50 text-teal-700'
            }`}
          >
            <Sparkles className="w-4 h-4" /> 问问怎么才能降下来
          </button>
        </Section>

        {/* 这周 vs 上周 */}
        <Section isDark={isDark} mounted={mounted} delay={80}>
          <div className="flex items-center gap-2 mb-4">
            <CalendarDays className={`w-5 h-5 ${isDark ? 'text-teal-400' : 'text-teal-600'}`} />
            <span className={`text-lg font-bold ${isDark ? 'text-white' : 'text-slate-800'}`}>这周比上周</span>
          </div>

          <div className="space-y-3">
            {d.weekCompare.map((item, i) => (
              <div key={i} className={`flex items-center gap-3 p-3 rounded-2xl ${isDark ? 'bg-slate-700/30' : 'bg-slate-50'}`}>
                <span className={`text-base font-semibold w-20 flex-shrink-0 ${isDark ? 'text-slate-200' : 'text-slate-700'}`}>{item.label}</span>
                <span className={`text-base font-bold ${isDark ? 'text-white' : 'text-slate-800'}`}>{item.value}</span>
                <div className="flex items-center gap-1.5 ml-auto">
                  <TrendArrow trend={item.trend} good={item.good} />
                  <span className={`text-sm ${item.good ? (isDark ? 'text-emerald-400' : 'text-emerald-600') : (isDark ? 'text-amber-400' : 'text-amber-600')}`}>
                    {item.changeText}
                  </span>
                </div>
              </div>
            ))}
          </div>
        </Section>

        {/* 最近30天状态 —— 色块条 */}
        <Section isDark={isDark} mounted={mounted} delay={160}>
          <div className="flex items-center justify-between mb-4">
            <div className="flex items-center gap-2">
              <Flame className={`w-5 h-5 ${isDark ? 'text-orange-400' : 'text-orange-500'}`} />
              <span className={`text-lg font-bold ${isDark ? 'text-white' : 'text-slate-800'}`}>最近30天</span>
            </div>
            <span className={`text-sm font-semibold px-2.5 py-1 rounded-full ${isDark ? 'bg-emerald-500/15 text-emerald-400' : 'bg-emerald-100 text-emerald-700'}`}>
              {d.month.goodDays} 天状态好
            </span>
          </div>

          {/* 30个色块 */}
          <div className="grid grid-cols-10 gap-1.5 mb-4">
            {d.month.days.map((s, i) => {
              const color = s === 'g' ? 'bg-emerald-500' : s === 'w' ? 'bg-amber-500' : s === 'b' ? 'bg-red-500' : (isDark ? 'bg-slate-700' : 'bg-slate-200')
              return <div key={i} className={`aspect-square rounded-md ${color}`} />
            })}
          </div>

          {/* 图例 */}
          <div className="flex items-center gap-4 mb-3">
            <LegendDot color="bg-emerald-500" label="状态好" isDark={isDark} />
            <LegendDot color="bg-amber-500" label="一般" isDark={isDark} />
            <LegendDot color="bg-red-500" label="差" isDark={isDark} />
          </div>

          <PlainBox isDark={isDark}>{d.month.plain}</PlainBox>
        </Section>

        {/* 这阵子身体给的提醒 */}
        <Section isDark={isDark} mounted={mounted} delay={240}>
          <div className="flex items-center gap-2 mb-4">
            <Zap className={`w-5 h-5 ${isDark ? 'text-teal-400' : 'text-teal-600'}`} />
            <span className={`text-lg font-bold ${isDark ? 'text-white' : 'text-slate-800'}`}>身体给你提个醒</span>
          </div>

          <div className="space-y-3">
            {d.reminders.map((r, i) => {
              const s = levelStyle[r.level]
              return (
                <div key={i} className={`flex items-start gap-3 p-3.5 rounded-2xl ${isDark ? s.bg : s.bgLight}`}>
                  <div className={`w-9 h-9 rounded-xl flex items-center justify-center flex-shrink-0 ${isDark ? 'bg-white/10' : 'bg-white'}`}>
                    <ReminderIcon name={r.icon} className={`w-5 h-5 ${isDark ? s.text : s.textLight}`} />
                  </div>
                  <div className="flex-1">
                    <p className={`text-base font-bold ${isDark ? 'text-white' : 'text-slate-800'}`}>{r.title}</p>
                    <p className={`text-sm mt-0.5 ${isDark ? 'text-slate-300' : 'text-slate-600'}`}>{r.desc}</p>
                  </div>
                </div>
              )
            })}
          </div>
        </Section>

        {/* 我的坚持 —— 轻量成就 */}
        <Section isDark={isDark} mounted={mounted} delay={320}>
          <div className="flex items-center gap-2 mb-4">
            <Award className={`w-5 h-5 ${isDark ? 'text-amber-400' : 'text-amber-500'}`} />
            <span className={`text-lg font-bold ${isDark ? 'text-white' : 'text-slate-800'}`}>我的坚持</span>
          </div>

          <div className="grid grid-cols-3 gap-3">
            {d.achievements.map((a, i) => (
              <div key={i} className={`flex flex-col items-center justify-center p-4 rounded-2xl ${isDark ? 'bg-slate-700/30' : 'bg-slate-50'}`}>
                <AchieveIcon name={a.icon} isDark={isDark} />
                <div className="flex items-baseline gap-0.5 mt-2">
                  <span className={`text-3xl font-black ${isDark ? 'text-white' : 'text-slate-800'}`}>{a.value}</span>
                  <span className={`text-sm ${isDark ? 'text-slate-400' : 'text-slate-500'}`}>{a.unit}</span>
                </div>
                <span className={`text-xs mt-1 text-center ${isDark ? 'text-slate-400' : 'text-slate-500'}`}>{a.label}</span>
              </div>
            ))}
          </div>
        </Section>

      </div>

      <BottomNav isDark={isDark} />
    </div>
  )
}

// ===== 通用组件 =====

function Section({ children, isDark, mounted, delay }: { children: React.ReactNode; isDark: boolean; mounted: boolean; delay: number }) {
  return (
    <div
      className={`mb-4 rounded-3xl p-5 transition-all duration-500 ${
        mounted ? 'opacity-100 translate-y-0' : 'opacity-0 translate-y-4'
      } ${isDark ? 'bg-slate-800/50 border border-slate-700/50' : 'bg-white border border-slate-200 shadow-sm'}`}
      style={{ transitionDelay: `${delay}ms` }}
    >
      {children}
    </div>
  )
}

function PlainBox({ children, isDark }: { children: React.ReactNode; isDark: boolean }) {
  return (
    <div className={`p-3 rounded-2xl ${isDark ? 'bg-slate-700/30' : 'bg-slate-50'}`}>
      <p className={`text-base leading-relaxed ${isDark ? 'text-slate-300' : 'text-slate-600'}`}>{children}</p>
    </div>
  )
}

function LegendDot({ color, label, isDark }: { color: string; label: string; isDark: boolean }) {
  return (
    <div className="flex items-center gap-1.5">
      <span className={`w-3 h-3 rounded-sm ${color}`} />
      <span className={`text-sm ${isDark ? 'text-slate-400' : 'text-slate-500'}`}>{label}</span>
    </div>
  )
}

function TrendArrow({ trend, good }: { trend: string; good: boolean }) {
  const color = good ? 'text-emerald-500' : 'text-amber-500'
  if (trend === 'up') return <TrendingUp className={`w-4 h-4 ${color}`} />
  if (trend === 'down') return <TrendingDown className={`w-4 h-4 ${color}`} />
  return <Minus className={`w-4 h-4 ${color}`} />
}

function ReminderIcon({ name, className }: { name: string; className?: string }) {
  if (name === 'moon') return <Moon className={className} />
  if (name === 'sit') return <Footprints className={className} />
  return <CalendarDays className={className} />
}

function AchieveIcon({ name, isDark }: { name: string; isDark: boolean }) {
  const cls = `w-6 h-6 ${isDark ? 'text-amber-400' : 'text-amber-500'}`
  if (name === 'flame') return <Flame className={cls} />
  if (name === 'moon') return <Moon className={`w-6 h-6 ${isDark ? 'text-indigo-400' : 'text-indigo-500'}`} />
  return <Award className={cls} />
}

// ===== 底部导航 =====
function BottomNav({ isDark }: { isDark: boolean }) {
  const [activeTab, setActiveTab] = useState('health')

  const handleNavClick = (tab: string) => {
    setActiveTab(tab)
    if (tab === 'home') {
      window.location.hash = '#'
    } else if (tab === 'mine') {
      window.location.hash = '#mine'
    } else if (tab === 'settings') {
      window.location.hash = '#settings'
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
          <NavItem icon={<SettingsIcon />} label="设置" active={activeTab === 'settings'} onClick={() => handleNavClick('settings')} isDark={isDark} />
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
function SettingsIcon() {
  return <svg className="h-5 w-5" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><circle cx="12" cy="12" r="3" /><path d="M19.4 15a1.65 1.65 0 0 0 .33 1.82l.06.06a2 2 0 0 1 0 2.83 2 2 0 0 1-2.83 0l-.06-.06a1.65 1.65 0 0 0-1.82-.33 1.65 1.65 0 0 0-1 1.51V21a2 2 0 0 1-2 2 2 2 0 0 1-2-2v-.09A1.65 1.65 0 0 0 9 19.4a1.65 1.65 0 0 0-1.82.33l-.06.06a2 2 0 0 1-2.83 0 2 2 0 0 1 0-2.83l.06-.06a1.65 1.65 0 0 0 .33-1.82 1.65 1.65 0 0 0-1.51-1H3a2 2 0 0 1-2-2 2 2 0 0 1 2-2h.09A1.65 1.65 0 0 0 4.6 9a1.65 1.65 0 0 0-.33-1.82l-.06-.06a2 2 0 0 1 0-2.83 2 2 0 0 1 2.83 0l.06.06a1.65 1.65 0 0 0 1.82.33H9a1.65 1.65 0 0 0 1-1.51V3a2 2 0 0 1 2-2 2 2 0 0 1 2 2v.09a1.65 1.65 0 0 0 1 1.51 1.65 1.65 0 0 0 1.82-.33l.06-.06a2 2 0 0 1 2.83 0 2 2 0 0 1 0 2.83l-.06.06a1.65 1.65 0 0 0-.33 1.82V9a1.65 1.65 0 0 0 1.51 1H21a2 2 0 0 1 2 2 2 2 0 0 1-2 2h-.09a1.65 1.65 0 0 0-1.51 1z" /></svg>
}
