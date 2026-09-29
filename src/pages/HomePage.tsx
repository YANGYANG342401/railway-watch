import { useState, useEffect } from 'react'
import { Card, CardContent } from '@/components/ui/card'
import {
  Heart,
  Droplets,
  Moon,
  ChevronRight,
  Zap,
  TrendingUp,
  TrendingDown,
  Minus,
  MessageCircle,
  Sparkles,
  Sun,
  MoonStar,
  Flame,
  Coins,
  Watch,
  TrainFront,
  Siren,
  Activity
} from 'lucide-react'

// 模拟数据（铁路重点人员·机车乘务）
const mockData = {
  userName: '王师傅',
  jobTitle: '机车司机',
  score: 82,
  scoreChange: +3,
  status: 'good' as const,
  advice: '状态不错，昨晚睡眠比前天多了40分钟。今日值乘K4832次，注意途中补水，退乘后早点休息。',
  currentHeartRate: 72,
  metrics: {
    heartRate: { value: 72, unit: 'bpm', status: 'good' as const, label: '静息心率', trend: 'stable' as const },
    bloodOxygen: { value: 98, unit: '%', status: 'good' as const, label: '血氧', trend: 'stable' as const },
    sleep: { value: 6.5, unit: '小时', status: 'warning' as const, label: '昨晚睡眠', detail: '深睡2.1h', trend: 'up' as const },
    recovery: { value: 78, unit: '%', status: 'good' as const, label: '身体恢复度', trend: 'up' as const },
    bloodPressure: { value: '128/82', unit: 'mmHg', status: 'good' as const, label: '血压', trend: 'stable' as const }
  },
  workTime: { today: { hours: 5, minutes: 32 }, month: { hours: 141, target: 167 }, overwork: { count: 0 } },
  wearTime: { hours: 7, minutes: 32, compliant: true, offlineMinutes: 23, maxAllowed: 60 },
  watchBattery: 67,
  watchConnected: true,
  sos: { monthCount: 0, lastRecord: '9月12日 已解除', normal: true },
  quickQuestions: ['我今天状态怎么样？', '夜班退乘后怎么补觉？', '血压偏高要注意什么？']
}

const statusConfig = {
  good: { label: '状态良好', color: '#34d399', lightBg: 'bg-emerald-50', darkBg: 'bg-emerald-500/10', lightText: 'text-emerald-700', darkText: 'text-emerald-400', lightBorder: 'border-emerald-200', darkBorder: 'border-emerald-500/25' },
  warning: { label: '需要注意', color: '#fbbf24', lightBg: 'bg-amber-50', darkBg: 'bg-amber-500/10', lightText: 'text-amber-700', darkText: 'text-amber-400', lightBorder: 'border-amber-200', darkBorder: 'border-amber-500/25' },
  danger: { label: '状态异常', color: '#f87171', lightBg: 'bg-red-50', darkBg: 'bg-red-500/10', lightText: 'text-red-700', darkText: 'text-red-400', lightBorder: 'border-red-200', darkBorder: 'border-red-500/25' },
}

// 铁路蓝主色
const ACCENT = { dark: 'text-[#5aa2ff]', light: 'text-blue-600' }

export function HomePage() {
  const data = mockData
  const config = statusConfig[data.status]
  const [isDark, setIsDark] = useState(true)
  const [scoreAnimated, setScoreAnimated] = useState(0)
  const [ringProgress, setRingProgress] = useState(0)
  const [heartBeat, setHeartBeat] = useState(false)
  const [mounted, setMounted] = useState(false)

  // 页面加载动画
  useEffect(() => {
    setMounted(true)
    const scoreTimer = setTimeout(() => {
      let current = 0
      const interval = setInterval(() => {
        current += 2
        if (current >= data.score) {
          setScoreAnimated(data.score)
          clearInterval(interval)
        } else {
          setScoreAnimated(current)
        }
      }, 20)
    }, 300)
    const ringTimer = setTimeout(() => {
      setRingProgress(data.score)
    }, 500)
    return () => { clearTimeout(scoreTimer); clearTimeout(ringTimer) }
  }, [data.score])

  // 心跳动画
  useEffect(() => {
    const interval = setInterval(() => {
      setHeartBeat(true)
      setTimeout(() => setHeartBeat(false), 200)
    }, 1000)
    return () => clearInterval(interval)
  }, [])

  const circumference = 2 * Math.PI * 54
  const strokeDashoffset = circumference - (ringProgress / 100) * circumference

  return (
    <div className={`min-h-screen transition-colors duration-500 ${isDark ? 'bg-[#0a1730]' : 'bg-[#eff4fb]'}`}>
      {/* 顶部铁路涂装饰线（复兴号红蓝） */}
      <div className="fixed top-0 inset-x-0 z-40 h-[3px] bg-gradient-to-r from-[#e60012] via-[#e60012] via-30% to-[#2f7bff] to-90%" />

      <div className="max-w-[430px] mx-auto px-5 py-5 pb-32">

        {/* 顶部栏 */}
        <div className={`flex items-center justify-between mb-6 ${mounted ? 'animate-fade-in' : 'opacity-0'}`}>
          <div>
            <div className="flex items-center gap-2 mb-0.5">
              <span className={`inline-flex items-center gap-1 px-2 py-0.5 rounded-md text-[10px] font-semibold tracking-wide ${
                isDark ? 'bg-[#e60012]/15 text-[#ff6b6b] border border-[#e60012]/30' : 'bg-red-50 text-red-600 border border-red-200'
              }`}>
                <TrainFront className="w-3 h-3" /> 成铁健康
              </span>
              <span className={`text-[10px] px-1.5 py-0.5 rounded-md ${isDark ? 'bg-slate-700/60 text-slate-300' : 'bg-slate-200/70 text-slate-600'}`}>
                {data.jobTitle}
              </span>
            </div>
            <p className={`text-lg ${isDark ? 'text-slate-400' : 'text-slate-500'}`}>今天好，</p>
            <p className={`text-2xl font-bold ${isDark ? 'text-white' : 'text-slate-800'}`}>{data.userName}</p>
          </div>
          <div className="flex items-center gap-3">
            {/* 深浅色切换 */}
            <button
              onClick={() => setIsDark(!isDark)}
              className={`w-10 h-10 rounded-full flex items-center justify-center transition-all active:scale-90 ${
                isDark ? 'bg-[#13264a] text-[#5aa2ff] border border-[#24406f]' : 'bg-white text-blue-500 shadow-md'
              }`}
            >
              {isDark ? <Sun className="w-5 h-5" /> : <MoonStar className="w-5 h-5" />}
            </button>
            {/* 手表状态 */}
            <button onClick={() => { window.location.hash = '#watch' }} className={`flex items-center gap-2 px-3 py-2 rounded-2xl text-xs transition-all active:scale-95 ${
              isDark ? 'bg-[#13264a] border border-[#24406f]' : 'bg-white border border-slate-200 shadow-sm'
            }`}>
              <Watch className={`w-4 h-4 ${isDark ? 'text-[#5aa2ff]' : 'text-blue-600'}`} />
              <div className="flex flex-col items-start">
                <span className={`text-[10px] leading-tight ${isDark ? 'text-slate-500' : 'text-slate-400'}`}>手表电量</span>
                <div className="flex items-center gap-1">
                  <span className={`w-1.5 h-1.5 rounded-full ${data.watchConnected ? 'bg-emerald-400' : 'bg-red-400'}`} />
                  <span className={`font-medium ${isDark ? 'text-slate-300' : 'text-slate-700'}`}>{data.watchBattery}%</span>
                </div>
              </div>
            </button>
          </div>
        </div>

        {/* 核心评分卡片 - 带圆环动效 */}
        <div className={`relative overflow-hidden rounded-3xl p-5 mb-5 transition-all duration-500 ${mounted ? 'animate-fade-in-up' : 'opacity-0 translate-y-4'} ${
          isDark
            ? `${config.darkBg} border ${config.darkBorder}`
            : `${config.lightBg} border ${config.lightBorder} shadow-lg`
        }`} style={{ animationDelay: '0.1s' }}>

          <div className="flex items-center gap-6">
            {/* 圆环进度 */}
            <div className="relative w-32 h-32 flex-shrink-0">
              <svg className="w-full h-full -rotate-90" viewBox="0 0 120 120">
                <circle cx="60" cy="60" r="54" fill="none" stroke={isDark ? '#1c3462' : '#dbe6f5'} strokeWidth="8" />
                <circle
                  cx="60" cy="60" r="54" fill="none" stroke={config.color} strokeWidth="8" strokeLinecap="round"
                  strokeDasharray={circumference} strokeDashoffset={strokeDashoffset}
                  className="transition-all duration-[2000ms] ease-out"
                />
                <circle
                  cx="60" cy="60" r="54" fill="none" stroke={config.color} strokeWidth="12" strokeLinecap="round"
                  strokeDasharray={circumference} strokeDashoffset={strokeDashoffset} opacity="0.3"
                  className="transition-all duration-[2000ms] ease-out blur-sm"
                />
              </svg>
              <div className="absolute inset-0 flex flex-col items-center justify-center">
                <span className="text-4xl font-black" style={{ color: config.color }}>
                  {scoreAnimated}
                </span>
                <span className={`text-xs ${isDark ? 'text-slate-400' : 'text-slate-500'}`}>健康评分</span>
              </div>
            </div>

            {/* 右侧信息 */}
            <div className="flex-1">
              <div className="flex items-center gap-2 mb-2">
                <span className={`text-sm font-medium ${isDark ? config.darkText : config.lightText}`}>
                  {config.label}
                </span>
                {data.scoreChange !== 0 && (
                  <span className={`text-xs px-2 py-0.5 rounded-full ${
                    data.scoreChange > 0
                      ? isDark ? 'bg-emerald-500/20 text-emerald-400' : 'bg-emerald-100 text-emerald-700'
                      : isDark ? 'bg-red-500/20 text-red-400' : 'bg-red-100 text-red-700'
                  }`}>
                    {data.scoreChange > 0 ? '↑' : '↓'}{Math.abs(data.scoreChange)}
                  </span>
                )}
              </div>
              <p className={`text-sm leading-relaxed ${isDark ? 'text-slate-300' : 'text-slate-600'}`}>
                {data.advice}
              </p>
            </div>
          </div>
        </div>

        {/* 实时心率 + 身体恢复度 */}
        <div className="grid grid-cols-2 gap-3 mb-3">
          <Card className={`overflow-hidden transition-all duration-300 active:scale-[0.97] ${
            isDark ? 'bg-[#13264a]/80 border-[#24406f]' : 'bg-white border-slate-200 shadow-md'
          }`}>
            <CardContent className="p-4">
              <div className="flex items-center justify-between mb-3">
                <span className={`text-xs ${isDark ? 'text-slate-500' : 'text-slate-400'}`}>实时心率</span>
                <Heart className={`w-5 h-5 text-red-500 transition-transform duration-200 ${heartBeat ? 'scale-125' : 'scale-100'}`} fill="#ef4444" />
              </div>
              <div className="flex items-baseline gap-1">
                <span className={`text-4xl font-bold ${isDark ? 'text-white' : 'text-slate-800'}`}>{data.currentHeartRate}</span>
                <span className={`text-sm ${isDark ? 'text-slate-500' : 'text-slate-400'}`}>bpm</span>
              </div>
              <p className="text-xs text-emerald-500 mt-1">正常范围</p>
            </CardContent>
          </Card>

          <Card className={`overflow-hidden transition-all duration-300 active:scale-[0.97] ${
            isDark ? 'bg-[#13264a]/80 border-[#24406f]' : 'bg-white border-slate-200 shadow-md'
          }`}>
            <CardContent className="p-4">
              <div className="flex items-center justify-between mb-3">
                <span className={`text-xs ${isDark ? 'text-slate-500' : 'text-slate-400'}`}>身体恢复度</span>
                <Zap className="w-5 h-5 text-amber-500" />
              </div>
              <div className="flex items-baseline gap-1">
                <span className={`text-4xl font-bold ${isDark ? 'text-white' : 'text-slate-800'}`}>{data.metrics.recovery.value}</span>
                <span className={`text-sm ${isDark ? 'text-slate-500' : 'text-slate-400'}`}>%</span>
              </div>
              <p className="text-xs text-emerald-500 mt-1 flex items-center gap-1">
                <TrendingUp className="w-3 h-3" /> 恢复良好
              </p>
            </CardContent>
          </Card>
        </div>

        {/* SOS 紧急求助（铁路手表项目专属） */}
        <Card className={`mb-5 overflow-hidden transition-all duration-300 active:scale-[0.98] ${
          isDark
            ? 'bg-gradient-to-r from-[#2a0a10] to-[#13264a]/80 border-[#e60012]/30'
            : 'bg-gradient-to-r from-red-50 to-white border-red-200 shadow-md'
        }`}>
          <CardContent className="p-4">
            <div className="flex items-center justify-between">
              <div className="flex items-center gap-3">
                <div className={`w-11 h-11 rounded-2xl flex items-center justify-center ${isDark ? 'bg-[#e60012]/15' : 'bg-red-100'}`}>
                  <Siren className={`h-5 w-5 ${isDark ? 'text-[#ff6b6b]' : 'text-red-600'}`} />
                </div>
                <div>
                  <p className={`text-sm font-semibold ${isDark ? 'text-white' : 'text-slate-800'}`}>SOS 紧急求助</p>
                  <p className={`text-xs mt-0.5 ${isDark ? 'text-slate-400' : 'text-slate-500'}`}>
                    {data.sos.normal ? '系统正常' : '有未处理事件'} · 本月 {data.sos.monthCount} 次 · 上次：{data.sos.lastRecord}
                  </p>
                </div>
              </div>
              <button className={`relative w-14 h-14 rounded-full bg-gradient-to-br from-[#e60012] to-[#a3000d] flex flex-col items-center justify-center shadow-lg shadow-red-900/40 transition-all duration-200 active:scale-90`}>
                <span className="absolute inset-0 rounded-full bg-[#e60012]/30 animate-ping" style={{ animationDuration: '3s' }} />
                <span className="text-[10px] font-bold text-white/90 leading-none relative z-10">长按</span>
                <span className="text-sm font-black text-white leading-tight relative z-10">呼救</span>
              </button>
            </div>
          </CardContent>
        </Card>

        {/* 健康指标横向滚动 */}
        <div className="mb-5">
          <div className="flex items-center justify-between mb-3">
            <h3 className={`text-sm font-medium ${isDark ? 'text-slate-400' : 'text-slate-500'}`}>健康指标</h3>
            <button onClick={() => { window.location.hash = '#health' }} className={`text-xs flex items-center gap-1 active:opacity-70 ${isDark ? ACCENT.dark : ACCENT.light}`}>
              查看全部 <ChevronRight className="w-3 h-3" />
            </button>
          </div>
          <div className="flex gap-3 overflow-x-auto pb-2 -mx-5 px-5">
            <MetricPill icon={<Droplets className="w-4 h-4" />} label="血氧" value={98} unit="%" status="good" hint="正常" isDark={isDark} />
            <MetricPill icon={<Activity className="w-4 h-4" />} label="血压" value="128/82" unit="mmHg" status="good" hint="正常" isDark={isDark} />
            <MetricPill icon={<Moon className="w-4 h-4" />} label="睡眠" value={6.5} unit="h" status="warning" hint="深睡2.1h" trend="up" isDark={isDark} />
            <MetricPill icon={<Heart className="w-4 h-4" />} label="静息心率" value={72} unit="bpm" status="good" hint="正常" isDark={isDark} />
          </div>
        </div>

        {/* 今日值乘 */}
        <Card className={`mb-5 transition-all duration-300 active:scale-[0.98] ${
          isDark ? 'bg-gradient-to-br from-[#0e2a5c]/60 to-[#13264a]/80 border-[#2f5ba8]/30' : 'bg-gradient-to-br from-blue-50 to-white border-blue-200 shadow-md'
        }`}>
          <CardContent className="p-4">
            <div className="flex items-center justify-between mb-4">
              <div className="flex items-center gap-2">
                <TrainFront className={`w-5 h-5 ${isDark ? 'text-[#5aa2ff]' : 'text-blue-600'}`} />
                <span className={`text-sm font-medium ${isDark ? 'text-slate-300' : 'text-slate-700'}`}>今日值乘</span>
              </div>
              <button onClick={() => { window.location.hash = '#worktime' }} className={`text-xs flex items-center gap-1 ${isDark ? ACCENT.dark : ACCENT.light}`}>
                详情 <ChevronRight className="w-3 h-3" />
              </button>
            </div>
            <div className="grid grid-cols-3 gap-4">
              <div>
                <p className={`text-3xl font-bold ${isDark ? 'text-white' : 'text-slate-800'}`}>
                  {data.workTime.today.hours}<span className={`text-lg ${isDark ? 'text-slate-400' : 'text-slate-500'}`}>h</span>
                  {data.workTime.today.minutes}<span className={`text-lg ${isDark ? 'text-slate-400' : 'text-slate-500'}`}>m</span>
                </p>
                <p className={`text-xs mt-1 ${isDark ? 'text-slate-500' : 'text-slate-400'}`}>今日已值乘</p>
              </div>
              <div>
                <p className={`text-2xl font-bold ${isDark ? 'text-slate-300' : 'text-slate-700'}`}>
                  {data.workTime.month.hours}<span className={`text-sm ${isDark ? 'text-slate-500' : 'text-slate-400'}`}>/{data.workTime.month.target}h</span>
                </p>
                <p className={`text-xs mt-1 ${isDark ? 'text-slate-500' : 'text-slate-400'}`}>本月累计</p>
              </div>
              <div>
                <p className={`text-2xl font-bold ${data.workTime.overwork.count > 0 ? 'text-red-500' : 'text-emerald-500'}`}>{data.workTime.overwork.count}<span className={`text-sm ${isDark ? 'text-slate-500' : 'text-slate-400'}`}>次</span></p>
                <p className={`text-xs mt-1 ${isDark ? 'text-slate-500' : 'text-slate-400'}`}>本月超劳</p>
              </div>
            </div>
          </CardContent>
        </Card>

        {/* 佩戴状态 */}
        <Card className={`mb-5 transition-all duration-300 active:scale-[0.98] ${
          isDark ? 'bg-[#13264a]/80 border-[#24406f]' : 'bg-white border-slate-200 shadow-md'
        }`}>
          <CardContent className="p-4">
            <div className="flex items-center justify-between">
              <div className="flex items-center gap-3">
                <div className={`w-11 h-11 rounded-2xl flex items-center justify-center ${isDark ? 'bg-[#1c3462]' : 'bg-blue-50'}`}>
                  <Watch className={`h-5 w-5 ${isDark ? 'text-[#5aa2ff]' : 'text-blue-600'}`} />
                </div>
                <div>
                  <p className={`text-sm ${isDark ? 'text-slate-400' : 'text-slate-500'}`}>今日佩戴</p>
                  <p className={`text-lg font-semibold ${isDark ? 'text-white' : 'text-slate-800'}`}>
                    {data.wearTime.hours}h {data.wearTime.minutes}m
                    <span className={`text-xs font-normal ml-2 ${isDark ? 'text-slate-500' : 'text-slate-400'}`}>离线{data.wearTime.offlineMinutes}分钟</span>
                  </p>
                </div>
              </div>
              <div className={`px-3 py-1.5 rounded-xl text-sm font-medium ${
                data.wearTime.compliant
                  ? isDark ? 'bg-emerald-500/20 text-emerald-400' : 'bg-emerald-100 text-emerald-700'
                  : isDark ? 'bg-amber-500/20 text-amber-400' : 'bg-amber-100 text-amber-700'
              }`}>
                {data.wearTime.compliant ? '✓ 合规' : '未达标'}
              </div>
            </div>
            <div className="mt-3">
              <div className={`flex justify-between text-xs mb-1 ${isDark ? 'text-slate-500' : 'text-slate-400'}`}>
                <span>离线时长</span>
                <span>{data.wearTime.offlineMinutes}/{data.wearTime.maxAllowed}分钟</span>
              </div>
              <div className={`h-1.5 rounded-full overflow-hidden ${isDark ? 'bg-[#1c3462]' : 'bg-slate-200'}`}>
                <div className={`h-full rounded-full transition-all duration-500 ${
                  data.wearTime.offlineMinutes / data.wearTime.maxAllowed > 0.8 ? 'bg-amber-500' : 'bg-emerald-500'
                }`} style={{ width: `${(data.wearTime.offlineMinutes / data.wearTime.maxAllowed) * 100}%` }} />
              </div>
            </div>
          </CardContent>
        </Card>

        {/* 本周挑战引流卡片 -> 我的 */}
        <button
          onClick={() => { window.location.hash = '#mine' }}
          className={`w-full mb-5 rounded-2xl p-4 flex items-center gap-4 text-left transition-all duration-300 active:scale-[0.98] ${
            isDark
              ? 'bg-gradient-to-r from-amber-900/30 to-[#13264a]/60 border border-amber-700/30'
              : 'bg-gradient-to-r from-amber-50 to-white border border-amber-200 shadow-md'
          }`}
        >
          <div className={`w-12 h-12 rounded-2xl flex items-center justify-center flex-shrink-0 ${isDark ? 'bg-amber-500/20' : 'bg-amber-100'}`}>
            <Flame className={`w-6 h-6 ${isDark ? 'text-amber-400' : 'text-amber-500'}`} />
          </div>
          <div className="flex-1 min-w-0">
            <div className="flex items-center gap-2">
              <span className={`text-base font-bold ${isDark ? 'text-white' : 'text-slate-800'}`}>本周挑战还差 120 步</span>
            </div>
            <p className={`text-sm mt-0.5 ${isDark ? 'text-slate-400' : 'text-slate-500'}`}>
              值乘间隙走两圈，达成得
              <span className={`font-semibold ${isDark ? 'text-amber-400' : 'text-amber-600'}`}> 30 积分</span>
            </p>
          </div>
          <div className="flex items-center gap-1 flex-shrink-0">
            <Coins className={`w-4 h-4 ${isDark ? 'text-amber-400' : 'text-amber-500'}`} />
            <span className={`text-sm font-bold ${isDark ? 'text-amber-400' : 'text-amber-600'}`}>1280</span>
            <ChevronRight className={`w-5 h-5 ${isDark ? 'text-slate-500' : 'text-slate-400'}`} />
          </div>
        </button>

        {/* 快捷问答 */}
        <div className="mb-5">
          <div className="flex items-center gap-2 mb-3">
            <MessageCircle className={`w-4 h-4 ${isDark ? ACCENT.dark : ACCENT.light}`} />
            <h3 className={`text-sm font-medium ${isDark ? 'text-slate-400' : 'text-slate-500'}`}>快捷提问</h3>
          </div>
          <div className="flex flex-wrap gap-2">
            {data.quickQuestions.map((q, i) => (
              <button key={i} onClick={() => { window.location.hash = '#ask' }} className={`px-4 py-2 rounded-full text-sm transition-all duration-150 active:scale-95 ${
                isDark
                  ? 'bg-[#13264a] hover:bg-[#1c3462] border border-[#24406f] text-slate-300'
                  : 'bg-white hover:bg-blue-50 border border-slate-200 text-slate-600 shadow-sm'
              }`}>
                {q}
              </button>
            ))}
          </div>
        </div>

      </div>

      {/* 底部导航栏 */}
      <BottomNav isDark={isDark} />
    </div>
  )
}

// 指标药丸组件
function MetricPill({ icon, label, value, unit, status, hint, trend, isDark }: {
  icon: React.ReactNode; label: string; value: string | number; unit: string; status: 'good' | 'warning' | 'danger'; hint: string; trend?: 'up' | 'down' | 'stable'; isDark: boolean
}) {
  const statusColors = { good: isDark ? 'text-emerald-400' : 'text-emerald-600', warning: isDark ? 'text-amber-400' : 'text-amber-600', danger: isDark ? 'text-red-400' : 'text-red-600' }
  const TrendIcon = trend === 'up' ? TrendingUp : trend === 'down' ? TrendingDown : Minus
  return (
    <div className={`flex-shrink-0 rounded-2xl p-4 min-w-[140px] transition-all duration-150 active:scale-95 ${
      isDark ? 'bg-[#13264a]/80 border border-[#24406f]' : 'bg-white border border-slate-200 shadow-md'
    }`}>
      <div className="flex items-center gap-2 mb-2">
        <span className={statusColors[status]}>{icon}</span>
        <span className={`text-xs ${isDark ? 'text-slate-500' : 'text-slate-400'}`}>{label}</span>
      </div>
      <div className="flex items-baseline gap-1">
        <span className={`text-2xl font-bold ${isDark ? 'text-white' : 'text-slate-800'}`}>{value}</span>
        <span className={`text-xs ${isDark ? 'text-slate-500' : 'text-slate-400'}`}>{unit}</span>
      </div>
      <div className="flex items-center gap-1 mt-1">
        {trend && <TrendIcon className={`w-3 h-3 ${statusColors[status]}`} />}
        <span className={`text-xs ${statusColors[status]}`}>{hint}</span>
      </div>
    </div>
  )
}

// 底部导航栏
function BottomNav({ isDark }: { isDark: boolean }) {
  const [activeTab, setActiveTab] = useState('home')

  const handleNavClick = (tab: string) => {
    setActiveTab(tab)
    if (tab !== 'home') {
      window.location.hash = `#${tab}`
    } else {
      window.location.hash = ''
    }
  }

  return (
    <div className="fixed bottom-0 inset-x-0 z-50" style={{ paddingBottom: 'env(safe-area-inset-bottom, 0px)' }}>
      <div className={`max-w-[430px] mx-auto ${isDark ? 'bg-[#0a1730]' : 'bg-white'} border-t ${isDark ? 'border-[#1c3462]' : 'border-slate-200'}`}>
        <div className="flex items-center justify-between px-6 py-3">
          <NavItem icon={<HomeIcon />} label="首页" active={activeTab === 'home'} onClick={() => handleNavClick('home')} isDark={isDark} />
          <NavItem icon={<ChartIcon />} label="健康" active={activeTab === 'health'} onClick={() => handleNavClick('health')} isDark={isDark} />
          {/* 中间AI按钮 */}
          <button onClick={() => handleNavClick('ask')} className={`relative -mt-8 w-16 h-16 rounded-full bg-gradient-to-br from-[#5aa2ff] via-[#2f7bff] to-[#1d4ed8] flex items-center justify-center shadow-lg shadow-blue-600/40 transition-all duration-200 active:scale-90 ${activeTab === 'ask' ? 'ring-4 ring-[#5aa2ff]/30' : ''}`}>
            <div className="absolute inset-0 rounded-full bg-gradient-to-br from-white/20 to-transparent" />
            <div className="absolute top-1 right-2 w-2 h-2 rounded-full bg-white/60 animate-pulse" />
            <Sparkles className="w-7 h-7 text-white relative z-10" />
          </button>
          <NavItem icon={<UserIcon />} label="我的" active={activeTab === 'mine'} onClick={() => handleNavClick('mine')} isDark={isDark} />
          <NavItem icon={<SettingsIcon />} label="设置" active={activeTab === 'settings'} onClick={() => handleNavClick('settings')} isDark={isDark} />
        </div>
      </div>
      <div className={`${isDark ? 'bg-[#0a1730]' : 'bg-white'}`} style={{ height: 'env(safe-area-inset-bottom, 0px)' }} />
    </div>
  )
}


function NavItem({ icon, label, active, onClick, isDark }: { icon: React.ReactNode; label: string; active: boolean; onClick: () => void; isDark: boolean }) {
  return (
    <button onClick={onClick} className={`flex flex-col items-center gap-1 px-3 py-1 transition-all duration-150 active:scale-90 ${active ? (isDark ? 'text-[#5aa2ff]' : 'text-blue-600') : (isDark ? 'text-slate-500' : 'text-slate-400')}`}>
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
