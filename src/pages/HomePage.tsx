import { useEffect, useState } from 'react'
import {
  TrainFront,
  Watch,
  Heart,
  Droplets,
  Activity,
  Thermometer,
  Footprints,
  ChevronRight,
  Siren,
  TrendingUp,
  MapPin,
  Sun,
  Moon,
} from 'lucide-react'
import { BottomNav } from '@/components/BottomNav'
import { STAGE, ties, totalSleep, stageHours, APP_VERSION } from '@/data/ctMock'

// —— mock 数据（机车乘务·45岁·倒班）——
const mock = {
  userName: '王师傅',
  jobTitle: '机车司机',
  weather: '小雨 15℃',
  location: '达州市达川区',
  watch: { battery: 67, connected: true },
  sleep: {
    hours: 7, minutes: 12,
    verdict: { level: 'green' as const, label: '睡得不错' },
    changeMinutes: +40,
    fellAsleep: '22:47',
    wokeUp: '05:59',
    interruptions: 1,
  },
  today: { recovery: 78, restingHr: 63, spo2: 98 },
  metrics: {
    bp: { value: '128/82', hint: '光电估算 · 仅供参考' },
    temp: { value: '36.5', hint: '正常' },
    steps: { value: '6,432', hint: '目标8,000步' },
    wear: { value: '7h32m', hint: '值乘时段建议全程佩戴' },
  },
  report: { ready: true },
  sos: { monthCount: 0, lastRecord: '9月12日 · 已核实平安' },
}

// —— 信号灯三态（铁路信号语言：绿=正常 黄=注意 红=异常）——
const SIGNAL = {
  green: { dot: 'bg-emerald-400', glow: 'shadow-[0_0_8px_rgba(52,211,153,0.9)]', text: 'text-emerald-400', chip: 'bg-emerald-500/10 border-emerald-500/25' },
  amber: { dot: 'bg-amber-400', glow: 'shadow-[0_0_8px_rgba(251,191,36,0.9)]', text: 'text-amber-400', chip: 'bg-amber-500/10 border-amber-500/25' },
  red: { dot: 'bg-red-400', glow: 'shadow-[0_0_8px_rgba(248,113,113,0.9)]', text: 'text-red-400', chip: 'bg-red-500/10 border-red-500/25' },
}

const CARD = 'bg-card border br-card rounded-3xl'

function SignalChip({ level, label, dark = false }: { level: keyof typeof SIGNAL; label: string; dark?: boolean }) {
  const s = SIGNAL[level]
  return (
    <span className={`inline-flex items-center gap-1.5 px-2.5 py-1 rounded-full border text-[14px] font-medium ${s.chip} ${s.text}`}>
      <span className={`w-2 h-2 rounded-full ${s.dot} ${s.glow} ${dark ? '' : 'signal-breathe'}`} />
      {label}
    </span>
  )
}

function greeting() {
  const h = new Date().getHours()
  if (h < 6) return '夜班辛苦了'
  if (h < 12) return '早上好'
  if (h < 14) return '中午好'
  if (h < 18) return '下午好'
  return '晚上好'
}

export function HomePage() {
  const [mounted, setMounted] = useState(false)
  const [arcOn, setArcOn] = useState(false)
  const [heartBeat, setHeartBeat] = useState(false)
  const [light, setLight] = useState(() => document.documentElement.classList.contains('theme-light'))
  const toggleTheme = () => {
    const on = !light
    document.documentElement.classList.toggle('theme-light', on)
    localStorage.setItem('ct-theme', on ? 'light' : 'dark')
    setLight(on)
  }

  useEffect(() => {
    setMounted(true)
    const t = setTimeout(() => setArcOn(true), 600)
    const beat = setInterval(() => {
      setHeartBeat(true)
      setTimeout(() => setHeartBeat(false), 200)
    }, 1100)
    return () => { clearTimeout(t); clearInterval(beat) }
  }, [])

  const sleep = mock.sleep
  const arcLen = 2 * Math.PI * 18

  return (
    <div className="relative min-h-screen bg-app t1 overflow-x-hidden">
      {/* 氛围层：站台灯光雾 + 钢轨水平线 */}
      <div className="fixed inset-0 pointer-events-none" style={{
        background: 'radial-gradient(ellipse 90% 45% at 50% -8%, rgba(90,162,255,0.12), transparent 70%)',
      }} />
      <div className="fixed inset-0 pointer-events-none opacity-60" style={{
        backgroundImage: 'repeating-linear-gradient(to bottom, rgba(148,184,255,0.03) 0 1px, transparent 1px 64px)',
      }} />
      {/* 品牌线：复兴号红蓝 */}
      <div className="fixed top-0 inset-x-0 z-40 h-[3px] bg-gradient-to-r from-[#e60012] via-[#e60012] via-30% to-[#2f7bff] to-90%" />

      <div className="relative max-w-[430px] mx-auto px-5 pt-6 pb-32">

        {/* ── 顶部 ── */}
        <header className={`flex items-start justify-between mb-6 ${mounted ? 'animate-fade-in' : 'opacity-0'}`}>
          <div>
            <div className="flex items-center gap-2 mb-1.5">
              <span className="inline-flex items-center gap-1 px-2 py-0.5 rounded-md text-[12.5px] font-semibold bg-[#e60012]/15 text-[#ff6b6b] border border-[#e60012]/30">
                <TrainFront className="w-3.5 h-3.5" /> 成铁健康
              </span>
              <span className="text-[12.5px] px-1.5 py-0.5 rounded-md bg-slate-700/60 t2">{mock.jobTitle}</span>
            </div>
            <p className="text-[24px] font-bold leading-tight">{greeting()}，{mock.userName}</p>
            <p className="flex items-center gap-1 text-[14.5px] t3 mt-1">
              10月12日 星期一 ·
              <MapPin className="w-3.5 h-3.5 t4" />
              <span>{mock.location}</span>
              · {mock.weather}
            </p>
          </div>
          <div className="flex flex-col items-end gap-1.5 shrink-0 mr-2">
            <button onClick={toggleTheme} aria-label="切换主题" className="flex items-center gap-1 h-7 px-3 rounded-full bg-card border br-card active:scale-95 transition-transform">
              {light ? <Moon className="w-3.5 h-3.5 ta" /> : <Sun className="w-3.5 h-3.5 ta" />}
              <span className="text-[12.5px] ta font-medium">{light ? '深色' : '浅色'}</span>
            </button>
            <button onClick={() => { window.location.hash = '#watch' }} className="flex flex-col items-center gap-1 px-3 py-2.5 rounded-2xl bg-card border br-card active:scale-95 transition-transform">
              <Watch className="w-5 h-5 ta" />
              <div className="flex items-center gap-1">
                <span className={`w-1.5 h-1.5 rounded-full ${mock.watch.connected ? 'bg-emerald-400' : 'bg-red-400'}`} />
                <span className="text-[14.5px] font-medium t2">{mock.watch.battery}%</span>
              </div>
            </button>
          </div>
        </header>

        {/* ── 睡眠 Hero：枕木式分段条 ── */}
        <section className={`${CARD} p-5 mb-4 ${mounted ? 'animate-fade-in-up' : 'opacity-0'}`} style={{ animationDelay: '0.08s' }}>
          <div className="flex items-center justify-between mb-3">
            <div className="flex items-center gap-2">
              <Moon className="w-[18px] h-[18px] text-[#818cf8]" />
              <span className="text-[15px] font-semibold">昨晚睡眠</span>
            </div>
            <SignalChip level={sleep.verdict.level} label={sleep.verdict.label} />
          </div>

          <div className="flex items-end justify-between mb-4">
            <div className="flex items-baseline gap-1 tabular-nums">
              <span className="text-[56px] leading-none font-black tracking-tight">{sleep.hours}</span>
              <span className="text-lg t3 font-medium">小时</span>
              <span className="text-[34px] leading-none font-black tracking-tight ml-1">{sleep.minutes}</span>
              <span className="text-lg t3 font-medium">分</span>
            </div>
            <span className="flex items-center gap-1 text-[14.5px] text-emerald-400 mb-1.5">
              <TrendingUp className="w-3.5 h-3.5" /> 比前天多{Math.abs(sleep.changeMinutes)}分钟
            </span>
          </div>

          {/* 睡眠时间轴：双轨钢轨 + 等距枕木（每根=15分钟，颜色=睡眠阶段） */}
          <div className="mb-3">
            <div className="relative h-[30px]">
              <div className="absolute inset-x-0 top-0 h-[2.5px] rounded-full bg-gradient-to-r from-[#1c3462] via-[#41639e] to-[#1c3462]" />
              <div className="absolute inset-x-[2px] top-[5px] flex gap-[5px] h-[15px]">
                {ties.map((st, i) => (
                  <span key={i} className="flex-1 rounded-[2.5px] seg-grow" style={{
                    backgroundColor: STAGE[st].color,
                    animationDelay: `${0.45 + i * 0.045}s`,
                  }} />
                ))}
              </div>
              <div className="absolute inset-x-0 bottom-0 h-[2.5px] rounded-full bg-gradient-to-r from-[#1c3462] via-[#41639e] to-[#1c3462]" />
            </div>
            <div className="flex justify-between mt-2 text-[13px] t4 tabular-nums">
              <span>{sleep.fellAsleep} 入睡</span>
              <span>{sleep.wokeUp} 醒来</span>
            </div>
          </div>

          <div className="flex flex-wrap gap-x-4 gap-y-1.5 mb-4">
            {Object.entries(STAGE).map(([key, meta]) => (
              <span key={key} className="flex items-center gap-1.5 text-[14px] t3">
                <span className="w-[4px] h-[11px] rounded-[1px]" style={{ backgroundColor: meta.color }} />
                {meta.label} <span className="t2 font-medium tabular-nums">{stageHours(key).toFixed(1)}h</span>
              </span>
            ))}
          </div>

          <div className="flex items-center justify-between pt-3 border-t br-line text-[14.5px] t3">
            <span>深睡占比 <span className="t2 font-medium tabular-nums">{Math.round((stageHours('deep') / totalSleep) * 100)}%</span></span>
            <span>夜间清醒 <span className="t2 font-medium tabular-nums">{sleep.interruptions} 次</span></span>
          </div>
        </section>

        {/* ── 今日状态三卡 ── */}
        <section className={`grid grid-cols-3 gap-3 mb-4 ${mounted ? 'animate-fade-in-up' : 'opacity-0'}`} style={{ animationDelay: '0.16s' }}>
          <div className={`${CARD} p-4`}>
            <div className="flex items-center justify-between h-7 mb-2.5">
              <span className="text-[14px] t3">恢复度</span>
              <svg className="w-6 h-6 -rotate-90" viewBox="0 0 40 40">
                <circle cx="20" cy="20" r="18" fill="none" stroke="#1c3462" strokeWidth="4" />
                <circle cx="20" cy="20" r="18" fill="none" stroke="#34d399" strokeWidth="4" strokeLinecap="round"
                  strokeDasharray={arcLen} strokeDashoffset={arcOn ? arcLen * (1 - mock.today.recovery / 100) : arcLen}
                  className="transition-all duration-[1400ms] ease-out" />
              </svg>
            </div>
            <p className="text-[30px] font-black tabular-nums leading-none">{mock.today.recovery}<span className="text-[15px] t3 font-medium ml-0.5">%</span></p>
            <p className="text-[13px] text-emerald-400 mt-1.5">恢复良好</p>
          </div>
          <div className={`${CARD} p-4`}>
            <div className="flex items-center justify-between h-7 mb-2.5">
              <span className="text-[14px] t3">静息心率</span>
              <Heart className={`w-6 h-6 text-red-400 transition-transform duration-200 ${heartBeat ? 'scale-125' : 'scale-100'}`} fill="#f87171" />
            </div>
            <p className="text-[30px] font-black tabular-nums leading-none">{mock.today.restingHr}<span className="text-[15px] t3 font-medium ml-0.5">bpm</span></p>
            <p className="text-[13px] text-emerald-400 mt-1.5">正常范围</p>
          </div>
          <div className={`${CARD} p-4`}>
            <div className="flex items-center justify-between h-7 mb-2.5">
              <span className="text-[14px] t3">血氧</span>
              <Droplets className="w-6 h-6 ta" />
            </div>
            <p className="text-[30px] font-black tabular-nums leading-none">{mock.today.spo2}<span className="text-[15px] t3 font-medium ml-0.5">%</span></p>
            <p className="text-[13px] text-emerald-400 mt-1.5">正常</p>
          </div>
        </section>

        {/* ── 身体指标 2×2 ── */}
        <section className={`grid grid-cols-2 gap-3 mb-4 ${mounted ? 'animate-fade-in-up' : 'opacity-0'}`} style={{ animationDelay: '0.22s' }}>
          <button onClick={() => { window.location.hash = '#health' }} className={`${CARD} p-4 text-left active:scale-[0.97] transition-transform`}>
            <div className="flex items-center gap-2 mb-2">
              <Activity className="w-[18px] h-[18px] ta" />
              <span className="text-[14.5px] t3">血压</span>
              <span className="ml-auto w-2 h-2 rounded-full bg-emerald-400 shadow-[0_0_8px_rgba(52,211,153,0.9)]" />
            </div>
            <p className="text-[28px] font-black tabular-nums leading-none">{mock.metrics.bp.value}<span className="text-[14px] t4 font-medium ml-1">mmHg</span></p>
            <p className="text-[13px] t4 mt-1.5 leading-snug">{mock.metrics.bp.hint}<br />仅自己可见</p>
          </button>
          <button onClick={() => { window.location.hash = '#health' }} className={`${CARD} p-4 text-left active:scale-[0.97] transition-transform`}>
            <div className="flex items-center gap-2 mb-2">
              <Thermometer className="w-[18px] h-[18px] ta" />
              <span className="text-[14.5px] t3">体温</span>
              <span className="ml-auto w-2 h-2 rounded-full bg-emerald-400 shadow-[0_0_8px_rgba(52,211,153,0.9)]" />
            </div>
            <p className="text-[28px] font-black tabular-nums leading-none">{mock.metrics.temp.value}<span className="text-[14px] t4 font-medium ml-1">°C</span></p>
            <p className="text-[13px] t4 mt-1.5">{mock.metrics.temp.hint}</p>
          </button>
          <button onClick={() => { window.location.hash = '#health' }} className={`${CARD} p-4 text-left active:scale-[0.97] transition-transform`}>
            <div className="flex items-center gap-2 mb-2">
              <Footprints className="w-[18px] h-[18px] ta" />
              <span className="text-[14.5px] t3">今日步数</span>
              <span className="ml-auto w-2 h-2 rounded-full bg-amber-400 shadow-[0_0_8px_rgba(251,191,36,0.9)]" />
            </div>
            <p className="text-[28px] font-black tabular-nums leading-none">{mock.metrics.steps.value}<span className="text-[14px] t4 font-medium ml-1">步</span></p>
            <p className="text-[13px] t4 mt-1.5">{mock.metrics.steps.hint}</p>
          </button>
          <button onClick={() => { window.location.hash = '#watch' }} className={`${CARD} p-4 text-left active:scale-[0.97] transition-transform`}>
            <div className="flex items-center gap-2 mb-2">
              <Watch className="w-[18px] h-[18px] ta" />
              <span className="text-[14.5px] t3">佩戴时长</span>
              <span className="ml-auto w-2 h-2 rounded-full bg-emerald-400 shadow-[0_0_8px_rgba(52,211,153,0.9)]" />
            </div>
            <p className="text-[28px] font-black tabular-nums leading-none">{mock.metrics.wear.value}</p>
            <p className="text-[13px] t4 mt-1.5">{mock.metrics.wear.hint}</p>
          </button>
        </section>

        {/* ── SOS ── */}
        <section className={`rounded-3xl p-4 mb-3 bg-[#e60012]/10 border border-[#e60012]/25 ${mounted ? 'animate-fade-in-up' : 'opacity-0'}`} style={{ animationDelay: '0.32s' }}>
          <div className="flex items-center justify-between">
            <div className="flex items-center gap-3">
              <div className="w-11 h-11 rounded-2xl bg-[#e60012]/15 flex items-center justify-center">
                <Siren className="w-[22px] h-[22px] text-[#ff6b6b]" />
              </div>
              <div>
                <p className="text-[15px] font-semibold">SOS 紧急求助</p>
                <p className="text-[14px] t3 mt-0.5">系统正常 · 上次 {mock.sos.lastRecord}</p>
              </div>
            </div>
            <button className="relative w-14 h-14 rounded-full bg-gradient-to-br from-[#e60012] to-[#a3000d] flex flex-col items-center justify-center shadow-lg shadow-red-900/40 active:scale-90 transition-transform">
              <span className="absolute inset-0 rounded-full bg-[#e60012]/30 animate-ping" style={{ animationDuration: '3s' }} />
              <span className="text-[11px] font-bold text-white/90 leading-none relative z-10">长按</span>
              <span className="text-[15px] font-black text-white leading-tight relative z-10">呼救</span>
            </button>
          </div>
        </section>

        {/* 数据说明（弱化footnote） */}
        <button onClick={() => { window.location.hash = '#datavisible' }}
          className="w-full flex items-center justify-center gap-0.5 text-[12.5px] t4 active:opacity-70">
          健康数据仅自己可见 · 了解数据说明 <ChevronRight className="w-3 h-3" />
        </button>
        <p className="text-center text-[11px] t4 mt-2">预览版 {APP_VERSION}</p>

      </div>

      <BottomNav reportNew={localStorage.getItem('ct-report-seen') !== '2026-09'} />
    </div>
  )
}
