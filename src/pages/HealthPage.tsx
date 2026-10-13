import { useMemo, useState } from 'react'
import { ChevronLeft, ChevronRight, Heart, Droplets, Activity, Thermometer, Moon, Footprints, TrendingUp, TrendingDown } from 'lucide-react'
import { BottomNav } from '@/components/BottomNav'

// —— 种子随机：拟真序列 ——
function rng(seed: number) {
  return () => {
    seed |= 0; seed = (seed + 0x6D2B79F5) | 0
    let t = Math.imul(seed ^ (seed >>> 15), 1 | seed)
    t = (t + Math.imul(t ^ (t >>> 7), 61 | t)) ^ t
    return ((t ^ (t >>> 14)) >>> 0) / 4294967296
  }
}
const series = (n: number, base: number, amp: number, seed: number) => {
  const r = rng(seed)
  return Array.from({ length: n }, () => +(base + (r() - 0.5) * 2 * amp).toFixed(1))
}

const DATA: Record<string, { vals: number[]; vals2?: number[] }> = {
  hr: { vals: series(60, 64, 5, 11) },
  spo2: { vals: series(60, 97.4, 0.9, 22).map(v => Math.min(99, v)) },
  bp: { vals: series(60, 128, 7, 33), vals2: series(60, 83, 5, 44) },
  temp: { vals: series(60, 36.5, 0.25, 55) },
  sleep: { vals: series(60, 6.6, 0.9, 66) },
  steps: { vals: series(60, 7200, 2800, 77).map(v => Math.round(v)) },
}

// 每晚睡眠：总时长 = 深睡 + 浅睡 + 做梦（三段堆叠柱）
const rd = rng(123)
const NIGHTS = DATA.sleep.vals.map(total => {
  const deep = +Math.min(total - 2.5, total * (0.26 + rd() * 0.08)).toFixed(1)
  const rem = +((total - deep) * (0.28 + rd() * 0.1)).toFixed(1)
  return { total, deep, rem, light: +(total - deep - rem).toFixed(1) }
})

type MetricKey = 'hr' | 'spo2' | 'bp' | 'temp' | 'sleep' | 'steps'

const METRICS: Record<MetricKey, {
  name: string; unit: string; color: string
  fmt: (v: number) => string; note: (vals: number[]) => string
}> = {
  hr: {
    name: '静息心率', unit: 'bpm', color: '#f87171',
    fmt: v => Math.round(v).toString(),
    note: v => `近30天平均 ${Math.round(v.slice(-30).reduce((a, b) => a + b, 0) / 30)} bpm，波动平稳`,
  },
  spo2: {
    name: '血氧', unit: '%', color: '#5aa2ff',
    fmt: v => Math.round(v).toString(),
    note: v => `近30天最低 ${Math.min(...v.slice(-30)).toFixed(0)}%，无偏低记录`,
  },
  bp: {
    name: '血压', unit: 'mmHg', color: '#10b981',
    fmt: v => Math.round(v).toString(),
    note: v => `近30天高压平均 ${Math.round(v.slice(-30).reduce((a, b) => a + b, 0) / 30)} mmHg（光电估算值）`,
  },
  temp: {
    name: '体温', unit: '°C', color: '#f0b25a',
    fmt: v => v.toFixed(1),
    note: v => `近30天在 ${Math.min(...v.slice(-30)).toFixed(1)}~${Math.max(...v.slice(-30)).toFixed(1)}°C 之间，正常`,
  },
  sleep: {
    name: '睡眠', unit: '小时', color: '#818cf8',
    fmt: v => v.toFixed(1),
    note: v => `近30天平均 ${(v.slice(-30).reduce((a, b) => a + b, 0) / 30).toFixed(1)} 小时`,
  },
  steps: {
    name: '步数', unit: '步', color: '#2fbfae',
    fmt: v => Math.round(v).toLocaleString(),
    note: v => `近30天日均 ${Math.round(v.slice(-30).reduce((a, b) => a + b, 0) / 30).toLocaleString()} 步`,
  },
}

// 详情页健康参考文案（健康管理口径，不含诊断性表述）
const INFO: Record<MetricKey, { title: string; lines: string[] }> = {
  sleep: {
    title: '关于睡眠，你可以了解',
    lines: [
      '成年人每天建议睡 7~9 小时；倒班岗位尽量不低于 7 小时。夜班后先补 2~3 小时、当晚再早睡，比一口气睡 12 小时更解乏。',
      '深睡（约占 13%~23%）：身体修复和体力恢复的主要时段，深睡足，白天不容易累。',
      '浅睡（约占 50%~60%）：占大头，是深睡与做梦之间的过渡。',
      '做梦/快速眼动（约占 20%~25%）：与记忆整理、情绪调节有关，后半夜占比更多。',
      '想提高深睡占比：固定起床时间、睡前 1 小时远离手机、下午 3 点后不喝浓茶咖啡、卧室拉帘保持黑暗安静、值乘间隙小睡不超过 30 分钟。',
      '睡眠分期由手表算法估算，趋势比单晚数值更有参考意义。',
    ],
  },
  hr: {
    title: '关于心率，你可以了解',
    lines: [
      '成年人静息心率正常范围 60~100 次/分；长期坚持锻炼的人可低至 50~60，只要没有头晕乏力等不适，偏低一般不用担心。',
      '让心率更稳：规律有氧运动（快走、慢跑、骑行）、睡够觉、戒烟、少浓茶和酒、学会放松。',
      '若静息心率长期超过 100，或伴有心慌胸闷，建议到医疗机构检查确认。',
    ],
  },
  bp: {
    title: '关于血压，你可以了解',
    lines: [
      '成年人正常血压一般小于 120/80 mmHg；120~139/80~89 属正常高值；140/90 及以上需要引起关注（以医疗机构测量为准）。',
      '保持血压稳定：每天吃盐不超过 5 克（约一个啤酒瓶盖），少吃腌菜、咸菜、卤味；多喝水、少熬夜；戒烟限酒；每周 3~5 次快走等适度运动；保持情绪平稳。',
      '手表血压为光电算法估算，趋势有参考意义；若连续多日偏高或感不适，请用上臂式血压计复测，或到医疗机构检测确认。',
    ],
  },
  spo2: {
    title: '关于血氧，你可以了解',
    lines: [
      '健康人群血氧一般在 95% 以上，夜间短暂、轻度的波动属于正常现象。',
      '打鼾严重、感冒鼻塞、体重偏大可能让夜间血氧偏低；侧睡、控制体重有助于改善。',
      '若多次低于 93%，建议到医疗机构评估。',
    ],
  },
  temp: {
    title: '关于体温，你可以了解',
    lines: [
      '正常体温一般在 36.1~37.2°C，下午比清晨略高，运动后短暂升高属正常。',
      '37.3~38°C 为低热参考：多喝水、休息半小时后再测；持续超过 38.5°C 或明显不适请及时就医。',
      '手表测的是体表温度，受环境影响，趋势比单次数值更有参考性。',
    ],
  },
  steps: {
    title: '关于步数，你可以了解',
    lines: [
      '日常健康建议每天 6000~10000 步；值乘日久坐时间长，退乘后走一走，对血压和睡眠都有好处。',
      '目标可在下方自行调整，循序渐进就好，不必强求一步到位。',
    ],
  },
}

const CARD = 'bg-card border br-card rounded-3xl'
const avg = (a: number[]) => a.reduce((x, y) => x + y, 0) / a.length

function Delta({ v, unit, good = 'up' }: { v: number; unit: string; good?: 'up' | 'down' }) {
  if (Math.abs(v) < 0.05) return <span className="text-[14.5px] t4">与上期持平</span>
  const up = v > 0
  const positive = (up && good === 'up') || (!up && good === 'down')
  return (
    <span className={`inline-flex items-center gap-0.5 text-[14.5px] font-medium ${positive ? 'text-emerald-400' : 'text-amber-400'}`}>
      {up ? <TrendingUp className="w-4 h-4" /> : <TrendingDown className="w-4 h-4" />}
      {unit === 'h' ? `${Math.abs(v).toFixed(1)}小时` : unit === 'bpm' ? `${Math.abs(v).toFixed(0)}bpm` : unit === 'mmHg' ? `${Math.abs(v).toFixed(0)}` : Math.abs(v).toFixed(0)} vs 上期
    </span>
  )
}

function CardHead({ icon, title, onMore, children }: { icon: React.ReactNode; title: string; onMore: () => void; children?: React.ReactNode }) {
  return (
    <div className="flex items-center justify-between mb-3">
      <div className="flex items-center gap-2">
        {icon}
        <span className="text-[15px] font-semibold">{title}</span>
      </div>
      <div className="flex items-center gap-3">
        {children}
        <button onClick={onMore} className="text-[14px] flex items-center gap-0.5 ta">详情 <ChevronRight className="w-4 h-4" /></button>
      </div>
    </div>
  )
}

export function HealthPage() {
  const [sel, setSel] = useState<MetricKey | null>(null)
  const [detailRange, setDetailRange] = useState<7 | 30>(7)
  const [range, setRange] = useState<7 | 30>(7)
  const [bpNotice, setBpNotice] = useState(false)
  const [goal, setGoal] = useState(() => Number(localStorage.getItem('ct-step-goal')) || 8000)
  const updateGoal = (g: number) => { localStorage.setItem('ct-step-goal', String(g)); setGoal(g) }

  const open = (k: MetricKey) => {
    if (k === 'bp' && !localStorage.getItem('ct-bp-notice')) setBpNotice(true)
    setDetailRange(range)
    setSel(k)
  }

  const today = new Date()
  const S = useMemo(() => {
    const nights = NIGHTS.slice(-range), prevNights = NIGHTS.slice(-2 * range, -range)
    const sl = DATA.sleep.vals.slice(-range), slP = DATA.sleep.vals.slice(-2 * range, -range)
    const hr = DATA.hr.vals.slice(-range), hrP = DATA.hr.vals.slice(-2 * range, -range)
    const sys = DATA.bp.vals.slice(-range), sysP = DATA.bp.vals.slice(-2 * range, -range)
    const dia = DATA.bp.vals2!.slice(-range), diaP = DATA.bp.vals2!.slice(-2 * range, -range)
    const sp = DATA.steps.vals.slice(-range), spP = DATA.steps.vals.slice(-2 * range, -range)
    const so2 = DATA.spo2.vals.slice(-range), tpm = DATA.temp.vals.slice(-range)
    return {
      nights, prevNights, sl, slP, hr, hrP, sys, sysP, dia, diaP, sp, spP, so2, tpm,
      deepShare: avg(nights.map(n => n.deep / n.total)),
    }
  }, [range])
  const goalDays = S.sp.filter(v => v >= goal).length

  const dayLabel = (back: number) => {
    const dt = new Date(today)
    dt.setDate(dt.getDate() - back)
    return `${dt.getMonth() + 1}/${dt.getDate()}`
  }

  return (
    <div className="relative min-h-screen bg-app t1">
      <div className="fixed inset-0 pointer-events-none" style={{ background: 'radial-gradient(ellipse 90% 45% at 50% -8%, rgba(90,162,255,0.12), transparent 70%)' }} />
      <div className="fixed top-0 inset-x-0 z-40 h-[3px] bg-gradient-to-r from-[#e60012] via-[#e60012] via-30% to-[#2f7bff] to-90%" />

      <div className="relative max-w-[430px] mx-auto px-5 pt-6 pb-32">

        {sel === null ? (
          <>
            <header className="flex items-end justify-between mb-5 animate-fade-in">
              <div>
                <h1 className="text-[24px] font-bold">健康</h1>
                <p className="text-[14.5px] t3 mt-1">近{range}天汇总 · 更新于今晨 06:12</p>
              </div>
              <div className="flex bg-soft border br-card rounded-full p-0.5">
                {([7, 30] as const).map(r => (
                  <button key={r} onClick={() => setRange(r)}
                    className={`px-3.5 py-1.5 rounded-full text-[14px] font-medium transition-colors ${range === r ? 'bg-[#2f7bff] text-white' : 't3'}`}>
                    {r}天
                  </button>
                ))}
              </div>
            </header>

            {/* 睡眠：每晚堆叠柱（深睡+其余） */}
            <section className={`${CARD} p-5 mb-4 animate-fade-in-up`}>
              <CardHead icon={<Moon className="w-[18px] h-[18px] text-[#818cf8]" />} title="睡眠" onMore={() => open('sleep')}>
                <Delta v={avg(S.sl) - avg(S.slP)} unit="h" />
              </CardHead>
              <div className="flex items-baseline gap-3 mb-3">
                <p className="text-[34px] font-black tabular-nums leading-none">{avg(S.sl).toFixed(1)}<span className="text-[15px] t3 font-medium ml-1">小时/晚</span></p>
              </div>
              <SleepBars nights={S.nights} labels={[dayLabel(range - 1), dayLabel(Math.floor(range / 2)), dayLabel(0)]} />
              <div className="flex justify-between text-[13.5px] t3 mt-3 pt-3 border-t br-line">
                <span>深睡占比 <b className="t2 tabular-nums">{(S.deepShare * 100).toFixed(0)}%</b></span>
                <span>最短一晚 <b className="t2 tabular-nums">{Math.min(...S.sl).toFixed(1)}h</b></span>
                <span>入睡 <b className="t2">22:40 ±25分</b></span>
              </div>
            </section>

            {/* 静息心率：趋势 + 均值线 */}
            <section className={`${CARD} p-5 mb-4 animate-fade-in-up`} style={{ animationDelay: '0.06s' }}>
              <CardHead icon={<Heart className="w-[18px] h-[18px] text-red-400" fill="#f87171" />} title="静息心率" onMore={() => open('hr')}>
                <Delta v={avg(S.hr) - avg(S.hrP)} unit="bpm" good="down" />
              </CardHead>
              <div className="flex items-baseline gap-3 mb-3">
                <p className="text-[34px] font-black tabular-nums leading-none">{avg(S.hr).toFixed(0)}<span className="text-[15px] t3 font-medium ml-1">bpm 均值</span></p>
                <span className="text-[13.5px] t4">区间 {Math.min(...S.hr).toFixed(0)}~{Math.max(...S.hr).toFixed(0)}</span>
              </div>
              <LineChart vals={S.hr} color="#f87171" mean labels={[dayLabel(range - 1), dayLabel(Math.floor(range / 2)), dayLabel(0)]} />
            </section>

            {/* 血压：高压/低压双线 */}
            <section className={`${CARD} p-5 mb-4 animate-fade-in-up`} style={{ animationDelay: '0.12s' }}>
              <CardHead icon={<Activity className="w-[18px] h-[18px] text-[#34d399]" />} title="血压（光电估算）" onMore={() => open('bp')}>
                <Delta v={avg(S.sys) - avg(S.sysP)} unit="mmHg" />
              </CardHead>
              <div className="flex items-baseline gap-4 mb-3">
                <p className="text-[34px] font-black tabular-nums leading-none">{avg(S.sys).toFixed(0)}<span className="t3 font-bold">/{avg(S.dia).toFixed(0)}</span><span className="text-[15px] t3 font-medium ml-1">mmHg</span></p>
                <span className="text-[12.5px] t4 ml-auto">仅供参考 · <span className="text-emerald-400">仅自己可见</span></span>
              </div>
              <LineChart vals={S.sys} vals2={S.dia} color="#34d399" mean labels={[dayLabel(range - 1), dayLabel(Math.floor(range / 2)), dayLabel(0)]} />
            </section>

            {/* 血氧 / 体温 */}
            <div className="grid grid-cols-2 gap-3 mb-4 animate-fade-in-up" style={{ animationDelay: '0.18s' }}>
              <button onClick={() => open('spo2')} className={`${CARD} p-4 text-left active:scale-[0.97] transition-transform`}>
                <div className="flex items-center gap-2 mb-2 ta">
                  <Droplets className="w-[18px] h-[18px]" />
                  <span className="text-[14.5px] t3">血氧均值</span>
                </div>
                <p className="text-[28px] font-black tabular-nums leading-none">{avg(S.so2).toFixed(0)}<span className="text-[14px] t4 font-medium ml-0.5">%</span></p>
                <p className="text-[13px] t4 mt-1.5">期间最低 {Math.min(...S.so2).toFixed(0)}% · 无偏低</p>
              </button>
              <button onClick={() => open('temp')} className={`${CARD} p-4 text-left active:scale-[0.97] transition-transform`}>
                <div className="flex items-center gap-2 mb-2 text-[#f0b25a]">
                  <Thermometer className="w-[18px] h-[18px]" />
                  <span className="text-[14.5px] t3">体温均值</span>
                </div>
                <p className="text-[28px] font-black tabular-nums leading-none">{avg(S.tpm).toFixed(1)}<span className="text-[14px] t4 font-medium ml-0.5">°C</span></p>
                <p className="text-[13px] t4 mt-1.5">平稳 · 无异常体温</p>
              </button>
            </div>

            {/* 活动：日均步数 + 目标线 + 达标天数 */}
            <section className={`${CARD} p-5 mb-2 animate-fade-in-up`} style={{ animationDelay: '0.24s' }}>
              <CardHead icon={<Footprints className="w-[18px] h-[18px] text-[#2fbfae]" />} title="活动" onMore={() => open('steps')}>
                <Delta v={avg(S.sp) - avg(S.spP)} unit="步" />
              </CardHead>
              <div className="flex items-baseline gap-3 mb-3">
                <p className="text-[34px] font-black tabular-nums leading-none">{Math.round(avg(S.sp)).toLocaleString()}<span className="text-[15px] t3 font-medium ml-1">步/日均</span></p>
                <span className="text-[13.5px] t4">达标 <b className="text-[#3ddc97]">{goalDays}</b>/{range}天</span>
              </div>
              <StepBars vals={S.sp} goal={goal} labels={[dayLabel(range - 1), dayLabel(Math.floor(range / 2)), dayLabel(0)]} />
            </section>
          </>
        ) : (
          <MetricDetail k={sel} range={detailRange} onRange={setDetailRange} onBack={() => setSel(null)} today={today} goal={goal} onGoal={updateGoal} />
        )}
      </div>

      {/* 血压免责弹窗（首次进入血压详情） */}
      {bpNotice && sel === 'bp' && (
        <div className="fixed inset-0 z-[60] bg-black/70 flex items-end sm:items-center justify-center p-5" onClick={() => { localStorage.setItem('ct-bp-notice', '1'); setBpNotice(false) }}>
          <div className="w-full max-w-[390px] rounded-3xl bg-soft border br-card p-5 animate-fade-in-up" onClick={e => e.stopPropagation()}>
            <p className="text-[16px] font-bold mb-2.5">关于手表血压数据</p>
            <p className="text-[15.5px] t2 leading-relaxed mb-5">
              手表血压为<b className="t1">光电算法估算值</b>，仅供参考，不作为医疗依据。
              如感不适或数值持续偏高，请使用正规血压计测量或到医疗机构检测确认。
              你的血压数据<span className="text-emerald-400">仅自己可见</span>，不会推送给他人。
            </p>
            <button onClick={() => { localStorage.setItem('ct-bp-notice', '1'); setBpNotice(false) }}
              className="w-full py-3 rounded-2xl bg-[#2f7bff] text-white font-medium active:scale-[0.98] transition-transform">
              我知道了
            </button>
          </div>
        </div>
      )}

      <BottomNav active="health" />
    </div>
  )
}

// 每晚睡眠堆叠柱：下→上 深睡(蓝)/浅睡(绿)/做梦(琥珀)
function SleepBars({ nights, labels }: { nights: { total: number; deep: number; rem: number }[]; labels: string[] }) {
  const W = 350, H = 120, PAD = 8
  const max = Math.max(...nights.map(n => n.total)) * 1.05
  const unit = (W - PAD * 2) / nights.length
  const y = (v: number) => PAD + (1 - v / max) * (H - PAD * 2)
  return (
    <div>
      <svg viewBox={`0 0 ${W} ${H}`} className="w-full">
        {nights.map((n, i) => {
          const bx = PAD + (i + 0.14) * unit
          const bw = unit * 0.72
          const last = i === nights.length - 1
          const yDeepTop = y(n.deep)
          const yRemTop = y(n.deep + n.rem)
          return (
            <g key={i} opacity={last ? 1 : 0.62}>
              <rect x={bx} y={yDeepTop} width={bw} height={H - PAD - yDeepTop} rx="2" fill="#5aa2ff" />
              <rect x={bx} y={yRemTop} width={bw} height={yDeepTop - yRemTop} fill="#3ddc97" opacity="0.7" />
              <rect x={bx} y={y(n.total)} width={bw} height={yRemTop - y(n.total)} rx="2" fill="#f0b25a" opacity="0.85" />
            </g>
          )
        })}
        <line x1={PAD} x2={W - PAD} y1={y(7)} y2={y(7)} stroke="#818cf8" strokeWidth="1" strokeDasharray="4 3" opacity="0.6" />
      </svg>
      <div className="flex justify-between text-[11.5px] t4 tabular-nums mt-1">
        <span>{labels[0]}</span><span className="text-[#818cf8]">— 建议7小时</span><span>{labels[2]}</span>
      </div>
      <div className="flex gap-4 mt-1.5">
        <span className="flex items-center gap-1.5 text-[13px] t3"><span className="w-[7px] h-[7px] rounded-[2px] bg-[#5aa2ff]" />深睡</span>
        <span className="flex items-center gap-1.5 text-[13px] t3"><span className="w-[7px] h-[7px] rounded-[2px] bg-[#3ddc97]" />浅睡</span>
        <span className="flex items-center gap-1.5 text-[13px] t3"><span className="w-[7px] h-[7px] rounded-[2px] bg-[#f0b25a]" />做梦</span>
      </div>
    </div>
  )
}

function LineChart({ vals, vals2, color, mean, labels }: {
  vals: number[]; vals2?: number[]; color: string; mean?: boolean; labels: string[]
}) {
  const W = 350, H = 110, PAD = 8
  const all = vals2 ? [...vals, ...vals2] : vals
  const min = Math.min(...all), max = Math.max(...all)
  const span = max - min || 1
  const x = (i: number) => PAD + (i / (vals.length - 1)) * (W - PAD * 2)
  const y = (v: number) => PAD + (1 - (v - min) / span) * (H - PAD * 2)
  const path = (arr: number[]) => arr.map((v, i) => `${i === 0 ? 'M' : 'L'}${x(i).toFixed(1)},${y(v).toFixed(1)}`).join(' ')
  const m = avg(vals)
  return (
    <div>
      <svg viewBox={`0 0 ${W} ${H}`} className="w-full">
        {mean && <line x1={PAD} x2={W - PAD} y1={y(m)} y2={y(m)} stroke={color} strokeWidth="1" strokeDasharray="4 3" opacity="0.7" />}
        {vals2 && <path d={path(vals2)} fill="none" stroke={color} strokeWidth="1.8" opacity="0.45" strokeDasharray="4 3" />}
        <path d={path(vals)} fill="none" stroke={color} strokeWidth="2.5" strokeLinecap="round" />
        <circle cx={x(vals.length - 1)} cy={y(vals[vals.length - 1])} r="3.5" fill={color} />
        <circle cx={x(vals.length - 1)} cy={y(vals[vals.length - 1])} r="7" fill={color} opacity="0.25" />
      </svg>
      <div className="flex justify-between text-[11.5px] t4 tabular-nums mt-1">
        <span>{labels[0]}</span>
        {mean && <span style={{ color }}>均值 {m.toFixed(0)}</span>}
        <span>{labels[2]}</span>
      </div>
    </div>
  )
}

function StepBars({ vals, goal, labels }: { vals: number[]; goal: number; labels: string[] }) {
  const W = 350, H = 110, PAD = 8
  const max = Math.max(...vals, goal) * 1.05
  const unit = (W - PAD * 2) / vals.length
  const y = (v: number) => PAD + (1 - v / max) * (H - PAD * 2)
  return (
    <div>
      <svg viewBox={`0 0 ${W} ${H}`} className="w-full">
        {vals.map((v, i) => {
          const bx = PAD + (i + 0.14) * unit
          const last = i === vals.length - 1
          return <rect key={i} x={bx} y={y(v)} width={unit * 0.72} height={H - PAD - y(v)} rx="2" fill={v >= goal ? '#3ddc97' : '#1f6f64'} opacity={last ? 1 : 0.75} />
        })}
        <line x1={PAD} x2={W - PAD} y1={y(goal)} y2={y(goal)} stroke="#3ddc97" strokeWidth="1" strokeDasharray="4 3" opacity="0.7" />
      </svg>
      <div className="flex justify-between text-[11.5px] t4 tabular-nums mt-1">
        <span>{labels[0]}</span><span className="text-[#3ddc97]">— 目标8,000步</span><span>{labels[2]}</span>
      </div>
    </div>
  )
}

function MetricDetail({ k, range, onRange, onBack, today, goal, onGoal }: {
  k: MetricKey; range: 7 | 30; onRange: (r: 7 | 30) => void; onBack: () => void; today: Date
  goal?: number; onGoal?: (g: number) => void
}) {
  const m = METRICS[k]
  const d = DATA[k]
  const vals = useMemo(() => d.vals.slice(-range), [d, range])
  const vals2 = useMemo(() => d.vals2?.slice(-range) ?? null, [d, range])

  const dayLabel = (i: number) => {
    const dt = new Date(today)
    dt.setDate(dt.getDate() - (range - 1 - i))
    return `${dt.getMonth() + 1}/${dt.getDate()}`
  }

  return (
    <>
      <header className="flex items-center gap-3 mb-5 animate-fade-in">
        <button onClick={onBack} className="w-9 h-9 rounded-full bg-soft border br-card flex items-center justify-center active:scale-90 transition-transform">
          <ChevronLeft className="w-5 h-5 ta" />
        </button>
        <div>
          <h1 className="text-[19px] font-bold leading-tight">{m.name}</h1>
          <p className="text-[14.5px] t4">近{range}天详情</p>
        </div>
        <div className="ml-auto flex bg-soft border br-card rounded-full p-0.5">
          {([7, 30] as const).map(r => (
            <button key={r} onClick={() => onRange(r)}
              className={`px-3.5 py-1.5 rounded-full text-[14px] font-medium transition-colors ${range === r ? 'bg-[#2f7bff] text-white' : 't3'}`}>
              {r}天
            </button>
          ))}
        </div>
      </header>

      <div className={`${CARD} p-4 mb-4 animate-fade-in-up`}>
        <div className="flex gap-4 mb-4">
          <div className="flex-1">
            <p className="text-[13px] t4 mb-1">平均</p>
            <p className="text-[20px] font-bold tabular-nums">{m.fmt(avg(vals))}</p>
          </div>
          <div className="flex-1">
            <p className="text-[13px] t4 mb-1">最高</p>
            <p className="text-[20px] font-bold tabular-nums">{m.fmt(Math.max(...vals))}</p>
          </div>
          <div className="flex-1">
            <p className="text-[13px] t4 mb-1">最低</p>
            <p className="text-[20px] font-bold tabular-nums">{m.fmt(Math.min(...vals))}</p>
          </div>
        </div>
        <TrendChart vals={vals} vals2={vals2} color={m.color} bars={k === 'sleep' || k === 'steps'} labels={[dayLabel(0), dayLabel(Math.floor((range - 1) / 2)), dayLabel(range - 1)]} />
        <p className="text-[14px] t3 mt-3 leading-relaxed">{m.note(d.vals)}</p>
        {k === 'bp' && (
          <p className="text-[13px] t4 mt-2 pt-3 border-t br-line">
            光电算法估算 · 仅供参考 · <span className="text-emerald-400">仅自己可见</span>
          </p>
        )}
      </div>

      {/* 步数目标设置 */}
      {k === 'steps' && goal !== undefined && onGoal && (
        <div className={`${CARD} p-4 mb-4 animate-fade-in-up`}>
          <p className="text-[15px] font-semibold mb-3">我的每日目标</p>
          <div className="flex gap-2">
            {[6000, 8000, 10000, 12000].map(g => (
              <button key={g} onClick={() => onGoal(g)}
                className={`flex-1 py-2.5 rounded-2xl text-[14.5px] font-bold tabular-nums transition-colors ${goal === g ? 'bg-[#2f7bff] text-white' : 'bg-soft t2'}`}>
                {g.toLocaleString()}
              </button>
            ))}
          </div>
          <p className="text-[13px] t4 mt-2.5">已保存 · 健康页的达标天数会按新目标计算</p>
        </div>
      )}

      {/* 健康参考文案 */}
      <div className={`${CARD} p-4 animate-fade-in-up`}>
        <p className="text-[16.5px] font-bold mb-3">{INFO[k].title}</p>
        <ul className="space-y-2.5">
          {INFO[k].lines.map((l, i) => (
            <li key={i} className="flex gap-2 text-[15.5px] t2 leading-relaxed">
              <span className="w-1.5 h-1.5 rounded-full bg-[#5aa2ff] mt-[7px] flex-shrink-0" />
              {l}
            </li>
          ))}
        </ul>
      </div>
    </>
  )
}

function TrendChart({ vals, vals2, color, bars, labels }: {
  vals: number[]; vals2: number[] | null; color: string; bars: boolean; labels: string[]
}) {
  const W = 350, H = 150, PAD = 8
  const all = vals2 ? [...vals, ...vals2] : vals
  const min = Math.min(...all), max = Math.max(...all)
  const span = max - min || 1
  const x = (i: number) => PAD + (i / (vals.length - 1)) * (W - PAD * 2)
  const y = (v: number) => PAD + (1 - (v - min) / span) * (H - PAD * 2)
  const path = (arr: number[]) => arr.map((v, i) => `${i === 0 ? 'M' : 'L'}${x(i).toFixed(1)},${y(v).toFixed(1)}`).join(' ')
  return (
    <div>
      <svg viewBox={`0 0 ${W} ${H}`} className="w-full">
        <defs>
          <linearGradient id={`ta-${color.slice(1)}`} x1="0" y1="0" x2="0" y2="1">
            <stop offset="0%" stopColor={color} stopOpacity="0.25" />
            <stop offset="100%" stopColor={color} stopOpacity="0" />
          </linearGradient>
        </defs>
        {[0.25, 0.5, 0.75].map(t => (
          <line key={t} x1={PAD} x2={W - PAD} y1={PAD + t * (H - PAD * 2)} y2={PAD + t * (H - PAD * 2)} stroke="#1c3462" strokeWidth="0.5" strokeDasharray="3 3" />
        ))}
        {bars
          ? vals.map((v, i) => {
              const unit = (W - PAD * 2) / vals.length
              return <rect key={i} x={PAD + (i + 0.19) * unit} y={y(v)} width={unit * 0.62} height={H - PAD - y(v)} rx="2" fill={color} opacity={i === vals.length - 1 ? 1 : 0.45} />
            })
          : (
            <>
              <path d={`${path(vals)} L${W - PAD},${H - PAD} L${PAD},${H - PAD} Z`} fill={`url(#ta-${color.slice(1)})`} />
              {vals2 && <path d={path(vals2)} fill="none" stroke={color} strokeWidth="2" opacity="0.5" strokeDasharray="4 3" />}
              <path d={path(vals)} fill="none" stroke={color} strokeWidth="2.5" strokeLinecap="round" />
              <circle cx={x(vals.length - 1)} cy={y(vals[vals.length - 1])} r="4" fill={color} />
              <circle cx={x(vals.length - 1)} cy={y(vals[vals.length - 1])} r="8" fill={color} opacity="0.25" />
            </>
          )}
      </svg>
      <div className="flex justify-between text-[11.5px] t4 tabular-nums mt-1">
        {labels.map((l, i) => <span key={i}>{l}</span>)}
      </div>
    </div>
  )
}
