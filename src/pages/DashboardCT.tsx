import { useState, useEffect, useMemo, useRef } from 'react'
import {
  HeartPulse, ShieldAlert, Cpu, Activity, Radio, Siren, MapPin,
  MessageSquareText, Phone, CheckCircle2, Loader2, XCircle, TrainFront, Zap,
} from 'lucide-react'
import { PLATFORM_NAME, PLATFORM_SUB, kpi, lines, eventPool, notifyTargets, scenarios, spots as spotDefs } from '@/data/ctDashboard'
import { provinces, nodes, regionLabels } from '@/data/ctMapBase'

type Mode = 'live' | 'offline'

export function DashboardCT() {
  const [mode, setMode] = useState<Mode>('live')
  const [now, setNow] = useState(new Date())
  const [guardian, setGuardian] = useState(kpi.guardianBase)
  const [events, setEvents] = useState(() => eventPool.slice(0, 10).map((e, i) => ({ ...e, uid: i })))
  const uidRef = useRef(eventPool.length)
  const [scenario, setScenario] = useState<{ key: string; step: number } | null>(null)
  const timerRef = useRef<number | null>(null)

  // 实时时钟 / 守护时长 / 事件流（离线模式全部冻结；事件流放慢到8.5秒一条，保证可读）
  useEffect(() => {
    if (mode !== 'live') return
    const clock = window.setInterval(() => setNow(new Date()), 1000)
    const counter = window.setInterval(() => setGuardian(g => g + 1 + Math.floor(Math.random() * 3)), 2000)
    const feed = window.setInterval(() => {
      setEvents(prev => {
        const next = eventPool[Math.floor(Math.random() * eventPool.length)]
        if (prev[0]?.text === next.text) return prev
        return [{ ...next, uid: ++uidRef.current }, ...prev].slice(0, 10)
      })
    }, 8500)
    return () => { clearInterval(clock); clearInterval(counter); clearInterval(feed) }
  }, [mode])

  // 演练剧本推进（放慢节奏，每步 6.5 秒）
  const startScenario = (key: string) => {
    if (timerRef.current) window.clearInterval(timerRef.current)
    setScenario({ key, step: 0 })
    timerRef.current = window.setInterval(() => {
      setScenario(s => {
        if (!s) return s
        const total = scenarios[s.key].steps.length
        if (s.step >= total - 1) { window.clearInterval(timerRef.current!); return s }
        return { ...s, step: s.step + 1 }
      })
    }, 6500)
  }
  const stopScenario = () => {
    if (timerRef.current) window.clearInterval(timerRef.current)
    setScenario(null)
  }
  useEffect(() => () => { if (timerRef.current) window.clearInterval(timerRef.current) }, [])

  const sc = scenario ? scenarios[scenario.key] : null
  const curStep = sc ? sc.steps[scenario!.step] : null
  const sosActive = !!curStep?.sosActive
  const bannerList = curStep ? (curStep.banners ?? (curStep.banner ? [curStep.banner] : undefined)) : undefined
  const [bannerIdx, setBannerIdx] = useState(0)
  useEffect(() => {
    setBannerIdx(0)
    if (!bannerList || bannerList.length < 2) return
    const t = window.setInterval(() => setBannerIdx(i => (i + 1) % bannerList.length), 4200)
    return () => window.clearInterval(t)
  }, [curStep])
  const bannerText = bannerList?.[bannerIdx]

  const clockText = mode === 'live'
    ? now.toLocaleString('zh-CN', { hour12: false })
    : '2026-09-27 18:00:00（离线快照）'

  return (
    <div className="h-screen flex flex-col overflow-hidden bg-[#050d1f] text-slate-200 select-none">
      {/* 背景网格 */}
      <div className="fixed inset-0 pointer-events-none opacity-[0.35]"
        style={{ backgroundImage: 'linear-gradient(#12294d22 1px, transparent 1px), linear-gradient(90deg, #12294d22 1px, transparent 1px)', backgroundSize: '48px 48px' }} />

      {/* SOS 告警横幅 */}
      {bannerText && (
        <div className={`relative z-50 flex items-center gap-3 px-6 py-2.5 text-sm font-medium ${sosActive ? 'bg-gradient-to-r from-[#e60012] to-[#8f000c] text-white ct-glow-red' : 'bg-gradient-to-r from-[#7a4a00] to-[#3d2a05] text-amber-200'}`}>
          {sosActive ? <Siren className="w-5 h-5 animate-pulse shrink-0" /> : <ShieldAlert className="w-5 h-5 shrink-0" />}
          {!!curStep?.queue && curStep.queue > 1 && (
            <span className="px-2 py-0.5 rounded bg-white/20 text-[11px] font-bold shrink-0">{curStep.queue}起并行</span>
          )}
          <span className="flex-1 truncate">{bannerText}</span>
          {bannerList && bannerList.length > 1 && (
            <span className="text-[11px] shrink-0 tabular-nums opacity-80">{bannerIdx + 1}/{bannerList.length}</span>
          )}
          <span className={`px-2 py-0.5 rounded text-[11px] border ${sosActive ? 'border-white/40 bg-white/10' : 'border-amber-300/40 bg-amber-300/10'}`}>演练</span>
        </div>
      )}

      {/* 顶部 */}
      <header className="relative z-10 flex items-center justify-between px-6 py-4 border-b border-[#1c3462] bg-[#071429]/90">
        <div className="flex items-center gap-4">
          <div className="w-11 h-11 rounded-xl bg-gradient-to-br from-[#e60012] to-[#a3000d] flex items-center justify-center shadow-lg shadow-red-900/40">
            <TrainFront className="w-6 h-6 text-white" />
          </div>
          <div>
            <h1 className="text-[22px] font-bold tracking-wide text-white">{PLATFORM_NAME}</h1>
            <p className="text-xs text-slate-400 mt-0.5">{PLATFORM_SUB} · 演示数据（人名工号虚构）</p>
          </div>
        </div>
        <div className="flex items-center gap-3">
          <div className="flex items-center gap-1.5 mr-2">
            {Object.entries(scenarios).map(([key, s]) => (
              <button key={key} onClick={() => startScenario(key)}
                className={`px-3 py-1.5 rounded-lg text-xs font-medium border transition-all active:scale-95 ${
                  scenario?.key === key
                    ? 'bg-[#e60012]/20 border-[#e60012]/60 text-[#ff8f8f]'
                    : 'bg-[#0f2347] border-[#24406f] text-slate-300 hover:border-[#5aa2ff]/60'}`}>
                {s.title}
              </button>
            ))}
            {scenario && (
              <button onClick={stopScenario} className="px-3 py-1.5 rounded-lg text-xs bg-[#13264a] border border-[#24406f] text-slate-400 hover:text-white flex items-center gap-1">
                <XCircle className="w-3.5 h-3.5" /> 结束
              </button>
            )}
          </div>
          <div className="flex rounded-lg overflow-hidden border border-[#24406f] text-xs">
            <button onClick={() => { stopScenario(); setMode('live') }}
              className={`px-3 py-1.5 ${mode === 'live' ? 'bg-[#5aa2ff]/20 text-[#8cc0ff]' : 'bg-[#0f2347] text-slate-400'}`}>● 实时</button>
            <button onClick={() => { stopScenario(); setMode('offline') }}
              className={`px-3 py-1.5 ${mode === 'offline' ? 'bg-amber-500/20 text-amber-300' : 'bg-[#0f2347] text-slate-400'}`}>⏸ 离线回放</button>
          </div>
          <div className="text-right">
            <p className="text-sm font-semibold tabular-nums text-white">{clockText.split(' ')[1] ?? clockText}</p>
            <p className="text-[11px] text-slate-500">{clockText.split(' ')[0]} {mode === 'offline' ? '· 数据截至昨日18:00' : '· 星期' + '日一二三四五六'[now.getDay()]}</p>
          </div>
        </div>
      </header>

      {/* 主体三区：满高布局，无底部留白 */}
      <main className="relative z-10 flex-1 min-h-0 flex gap-4 p-4">

        {/* ═══ 左区：健康关爱 ═══ */}
        <section className="w-[300px] shrink-0 flex flex-col gap-3">
          <ZoneTitle icon={<HeartPulse className="w-4 h-4" />} title="健康关爱" narrative="对员工健康的关爱" />
          <div className="grid grid-cols-2 gap-3">
            <KpiCard label="覆盖员工" value={kpi.totalStaff.toLocaleString()} unit="人" sub={`设备在线 ${kpi.onlineDevices}`} />
            <KpiCard label="重点人群" value={kpi.keyGroup} unit="人" sub="基础疾病筛查建档" accent="#5aa2ff" />
            <KpiCard label="今日健康预警" value={kpi.todayAlerts} unit="例" sub={`较昨日 ${kpi.todayAlerts - kpi.yesterdayAlerts >= 0 ? '+' : ''}${kpi.todayAlerts - kpi.yesterdayAlerts}`} accent="#fbbf24" />
            <KpiCard label="待跟进" value={kpi.pendingFollow} unit="例" sub="医务室处理中" accent="#fbbf24" />
          </div>
          <Panel title="全员健康评分分布">
            <div className="space-y-2">
              {([
                ['良好', kpi.scoreDist.green, 'bg-emerald-500', 'text-emerald-400'],
                ['需关注', kpi.scoreDist.yellow, 'bg-amber-500', 'text-amber-400'],
                ['异常关怀', kpi.scoreDist.red, 'bg-red-500', 'text-red-400'],
              ] as const).map(([label, v, bar, text]) => (
                <div key={label} className="flex items-center gap-2">
                  <span className="text-[11px] text-slate-400 w-14 shrink-0">{label}</span>
                  <div className="flex-1 h-2 rounded-full bg-[#13264a] overflow-hidden">
                    <div className={`h-full rounded-full ${bar}`} style={{ width: `${(v / kpi.totalStaff) * 100}%` }} />
                  </div>
                  <span className={`text-xs font-bold tabular-nums w-16 text-right shrink-0 ${text}`}>
                    {v}<span className="text-[10px] text-slate-500 font-normal ml-0.5">人</span>
                  </span>
                  <span className="text-[10px] text-slate-600 w-9 text-right tabular-nums shrink-0">{(v / kpi.totalStaff * 100).toFixed(1)}%</span>
                </div>
              ))}
            </div>
          </Panel>
          <Panel title={`成功干预 · 近7日（今日 +${kpi.todayInterventions}）`} className="flex-1 flex flex-col">
            <div className="flex-1 flex items-end gap-2 min-h-[96px]">
              {kpi.interventions7d.map((v, i) => (
                <div key={i} className="flex-1 flex flex-col items-center justify-end gap-1 h-full">
                  <span className="text-[10px] text-[#8cc0ff] tabular-nums">{v}</span>
                  <div className="w-full rounded-t bg-gradient-to-t from-[#1d4ed8] to-[#5aa2ff]" style={{ height: `${v * 7}%`, minHeight: 8 }} />
                  <span className="text-[10px] text-slate-600">{['一', '二', '三', '四', '五', '六', '日'][i]}</span>
                </div>
              ))}
            </div>
          </Panel>
        </section>

        {/* ═══ 中区：应急布局 ═══ */}
        <section className="flex-1 min-w-0 flex flex-col gap-3">
          <ZoneTitle icon={<ShieldAlert className="w-4 h-4" />} title="应急布局" narrative="突发事件的提前布防" />
          {/* 地图 + 事件流侧栏 */}
          <div className="flex-1 min-h-0 flex gap-3">
            <div className="flex-1 min-w-0 relative rounded-2xl border border-[#24406f] bg-[#081631]/80 p-3">
              <NetworkMap spotsNow={curStep?.spots ?? (!scenario ? ['k42sos', 'k118'] : scenario.key === 'lone' ? ['k118'] : ['k42sos'])} />
              {/* 演练时间线面板 */}
              {sc && (
                <div className="absolute top-3 left-3 w-[300px] rounded-xl border border-[#e60012]/40 bg-[#0a1730]/95 backdrop-blur p-3 ct-fade-in">
                  <p className="text-xs font-bold text-[#ff8f8f] mb-2 flex items-center gap-1.5">
                    <Zap className="w-3.5 h-3.5" /> {sc.title}
                  </p>
                  <ol className="space-y-1.5">
                    {sc.steps.slice(0, scenario!.step + 1).map((st, i) => (
                      <li key={i} className="flex items-start gap-2 text-[11px] leading-snug">
                        {i < scenario!.step
                          ? <CheckCircle2 className="w-3.5 h-3.5 text-emerald-400 shrink-0 mt-0.5" />
                          : <Loader2 className="w-3.5 h-3.5 text-[#ff8f8f] shrink-0 mt-0.5 animate-spin" />}
                        <span className={i === scenario!.step ? 'text-white' : 'text-slate-400'}>{st.timeline}</span>
                      </li>
                    ))}
                  </ol>
                  {!!curStep?.notifications && (
                    <div className="mt-2 pt-2 border-t border-[#24406f] space-y-1">
                      {notifyTargets.slice(0, curStep.notifications).map((n, i) => (
                        <div key={i} className="flex items-center gap-1.5 text-[11px] text-slate-300 ct-fade-in">
                          {n.channel === '短信'
                            ? <MessageSquareText className="w-3.5 h-3.5 text-[#5aa2ff]" />
                            : <Phone className="w-3.5 h-3.5 text-emerald-400" />}
                          <span className="flex-1">{n.name} · {n.channel}</span>
                          <span className="text-emerald-400">{n.status} ✓</span>
                        </div>
                      ))}
                    </div>
                  )}
                </div>
              )}
            </div>
            {/* 事件流侧栏 */}
            <div className="w-60 shrink-0 rounded-2xl border border-[#24406f] bg-[#081631]/80 p-3 flex flex-col">
              <div className="flex items-center gap-2 mb-2">
                <Radio className="w-4 h-4 text-[#5aa2ff]" />
                <span className="text-xs font-semibold text-slate-300">实时动态</span>
                <span className={`text-[10px] px-1.5 py-0.5 rounded ${mode === 'live' ? 'bg-red-500/20 text-red-400' : 'bg-amber-500/20 text-amber-400'}`}>{mode === 'live' ? 'LIVE' : 'REPLAY'}</span>
              </div>
              <div className="flex-1 min-h-0 overflow-hidden space-y-2">
                {events.map((e, i) => (
                  <div key={e.uid} className={`flex items-start gap-2 text-[11px] leading-snug ${i === 0 && mode === 'live' ? 'text-white ct-fade-in' : 'text-slate-400'}`}>
                    <span className="tabular-nums text-slate-600 shrink-0">{e.time.slice(0, 5)}</span>
                    <i className={`w-1.5 h-1.5 rounded-full shrink-0 mt-1 ${e.level === 'warn' ? 'bg-amber-400' : e.level === 'ok' ? 'bg-emerald-400' : 'bg-[#5aa2ff]'}`} />
                    <span>{e.text}</span>
                  </div>
                ))}
              </div>
            </div>
          </div>
          {/* 应急响应统计条 */}
          <div className="grid grid-cols-4 gap-3">
            <MiniStat label="今日SOS" value={kpi.sosToday} unit="起" accent="#ff6b6b" />
            <MiniStat label="单人作业进行中" value={kpi.loneTasksActive} unit="人" accent="#5aa2ff" />
            <MiniStat label="平均响应时长" value={kpi.avgResponse} accent="#34d399" />
            <MiniStat label="超时处置率" value={kpi.overtimeHandledRate} unit="%" accent="#34d399" />
          </div>
        </section>

        {/* ═══ 右区：数字化能力 ═══ */}
        <section className="w-[300px] shrink-0 flex flex-col gap-3">
          <ZoneTitle icon={<Cpu className="w-4 h-4" />} title="数字化能力" narrative="信息化走在前列" />
          <Panel title="累计健康守护">
            <p className="text-3xl font-black text-white tabular-nums tracking-tight">
              {guardian.toLocaleString()}<span className="text-sm text-slate-400 font-normal ml-1.5">人次</span>
            </p>
            <p className="text-[11px] text-[#8cc0ff] mt-1 flex items-center gap-1">
              <Activity className="w-3 h-3" /> {mode === 'live' ? '每日监测与守护服务 · 实时累计' : '离线快照（截至昨日18:00）'}
            </p>
          </Panel>
          <Panel title="设备在线率">
            <div className="flex items-center gap-4">
              <svg viewBox="0 0 80 80" className="w-20 h-20 -rotate-90 shrink-0">
                <circle cx="40" cy="40" r="32" fill="none" stroke="#1c3462" strokeWidth="9" />
                <circle cx="40" cy="40" r="32" fill="none" stroke="#5aa2ff" strokeWidth="9"
                  strokeDasharray={2 * Math.PI * 32} strokeDashoffset={2 * Math.PI * 32 * (1 - kpi.onlineRate / 100)} />
              </svg>
              <div>
                <p className="text-2xl font-bold text-white tabular-nums">{kpi.onlineRate}%</p>
                <p className="text-[11px] text-slate-500">在线 {kpi.onlineDevices} / {kpi.totalStaff} 台</p>
              </div>
            </div>
          </Panel>
          <div className="grid grid-cols-2 gap-3">
            <KpiCard label="AI健康报告" value={kpi.aiReports.toLocaleString()} unit="份" sub="Med-go · 二期增强" accent="#a78bfa" />
            <KpiCard label="应急演练" value={kpi.drills} unit="次" sub="含本月综合演练" />
            <KpiCard label="预警处置率" value={kpi.alertHandledRate} unit="%" sub="7日内动态" accent="#34d399" />
            <KpiCard label="覆盖车间" value={6} unit="个" sub="机务·供电·线路·车务·电务·通信" />
          </div>
          <Panel title="系统运行状态" className="flex-1 flex flex-col">
            <div className="flex-1 flex flex-col justify-evenly gap-2">
              {[
                ['数据接入服务', '正常'], ['定位服务', '正常'], ['通知网关（短信/语音）', '正常'], ['Med-go 分析引擎', '待接入'],
              ].map(([n, s]) => (
                <div key={n} className="flex items-center gap-2 text-xs">
                  <i className={`w-2 h-2 rounded-full ${s === '正常' ? 'bg-emerald-400 animate-pulse' : 'bg-slate-500'}`} />
                  <span className="flex-1 text-slate-400">{n}</span>
                  <span className={s === '正常' ? 'text-emerald-400' : 'text-slate-500'}>{s}</span>
                </div>
              ))}
            </div>
            <p className="text-[10px] text-slate-600 pt-2 mt-2 border-t border-[#1c3462]">数据更新：实时 · v0.2 演示版</p>
          </Panel>
        </section>
      </main>
    </div>
  )
}

/* ─────────── 子组件 ─────────── */

function ZoneTitle({ icon, title, narrative }: { icon: React.ReactNode; title: string; narrative: string }) {
  return (
    <div className="flex items-center gap-2.5 px-1 h-9">
      <span className="w-8 h-8 rounded-lg bg-[#0f2347] border border-[#24406f] flex items-center justify-center text-[#5aa2ff]">{icon}</span>
      <div>
        <h2 className="text-base font-bold text-white leading-tight">{title}</h2>
        <p className="text-[11px] text-slate-500">—— {narrative}</p>
      </div>
    </div>
  )
}

function KpiCard({ label, value, unit, sub, accent = '#5aa2ff' }: { label: string; value: string | number; unit?: string; sub?: string; accent?: string }) {
  return (
    <div className="rounded-xl border border-[#24406f] bg-[#0d1f3f]/80 p-3">
      <p className="text-[11px] text-slate-500">{label}</p>
      <p className="mt-1 text-[26px] font-bold tabular-nums leading-none" style={{ color: accent === '#5aa2ff' ? '#fff' : accent }}>
        {value}<span className="text-xs text-slate-400 font-normal ml-1">{unit}</span>
      </p>
      {sub && <p className="text-[10px] text-slate-600 mt-1.5">{sub}</p>}
    </div>
  )
}

function Panel({ title, children, className = '' }: { title: string; children: React.ReactNode; className?: string }) {
  return (
    <div className={`rounded-xl border border-[#24406f] bg-[#0d1f3f]/80 p-3.5 ${className}`}>
      <p className="text-[11px] text-slate-500 mb-2.5">{title}</p>
      {children}
    </div>
  )
}

function MiniStat({ label, value, unit, accent }: { label: string; value: string | number; unit?: string; accent: string }) {
  return (
    <div className="rounded-xl border border-[#24406f] bg-[#0d1f3f]/80 px-3 py-2.5 flex items-center justify-between">
      <span className="text-[11px] text-slate-500">{label}</span>
      <span className="text-lg font-bold tabular-nums" style={{ color: accent }}>
        {value}{unit && <span className="text-[10px] text-slate-500 ml-0.5 font-normal">{unit}</span>}
      </span>
    </div>
  )
}

/* ─────────── 真实底图 + 线网示意 ─────────── */

function NetworkMap({ spotsNow }: { spotsNow: string[] }) {
  const pathD = useMemo(() => lines.map(l => ({
    ...l,
    pts: l.path.map(k => `${nodes[k].x},${nodes[k].y}`).join(' '),
  })), [])

  return (
    <div className="h-full flex flex-col">
      <div className="flex items-center justify-between mb-1 shrink-0">
        <p className="text-[11px] text-slate-500">成都局管线网 · 达州段试点高亮</p>
        <div className="flex rounded-md overflow-hidden border border-[#24406f] text-[10px]">
          <span className="px-2 py-1 bg-[#5aa2ff]/20 text-[#8cc0ff]">线网模式</span>
          <span className="px-2 py-1 bg-[#0f2347] text-slate-600">GIS实景（待接入离线瓦片）</span>
        </div>
      </div>
      <div className="flex-1 min-h-0">
        <svg viewBox="0 0 700 760" preserveAspectRatio="xMidYMid meet" className="w-full h-full">
          {/* 真实省界底图（DataV GeoJSON 投影） */}
          <defs>
            <linearGradient id="ctProv" x1="0" y1="0" x2="0" y2="1">
              <stop offset="0%" stopColor="#10254c" />
              <stop offset="100%" stopColor="#0b1c3a" />
            </linearGradient>
          </defs>
          {provinces.map(p => (
            <path key={p.name} d={p.d} fill="url(#ctProv)" stroke="#3a5fa8" strokeWidth="1.2" opacity="0.9" />
          ))}
          {/* 区域名 */}
          {Object.values(regionLabels).map(r => (
            <text key={r.text} x={r.x} y={r.y} fill="#3d5c96" fontSize="19" fontWeight="bold" letterSpacing="4">{r.text}</text>
          ))}

          {/* 线路：普通 */}
          {pathD.filter(l => !l.dazhou).map((l, i) => (
            <polyline key={i} points={l.pts} fill="none" stroke="#3a6ecf" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" opacity="0.7" />
          ))}
          {/* 线路：达州段高亮 + 流动 */}
          {pathD.filter(l => l.dazhou).map((l, i) => (
            <g key={`d${i}`}>
              <polyline points={l.pts} fill="none" stroke="#5aa2ff" strokeWidth="4.5" strokeLinecap="round" strokeLinejoin="round" opacity="0.9" />
              <polyline points={l.pts} fill="none" stroke="#bfe0ff" strokeWidth="2" strokeLinecap="round" strokeDasharray="6 26" className="ct-dashflow" opacity="0.9" />
            </g>
          ))}

          {/* 节点 */}
          {Object.entries(nodes).map(([k, n]) => (
            <g key={k}>
              {n.major ? (
                <>
                  <circle cx={n.x} cy={n.y} r="7" fill="#0a1730" stroke="#5aa2ff" strokeWidth="2.5" />
                  <text x={n.x} y={n.y - 12} textAnchor="middle" fill="#dbeafe" fontSize="13" fontWeight="bold">{n.label}</text>
                </>
              ) : (
                <>
                  <circle cx={n.x} cy={n.y} r="3.5" fill="#3a6ecf" />
                  <text x={n.x} y={n.y - 7} textAnchor="middle" fill="#7a93c4" fontSize="10">{n.label}</text>
                </>
              )}
            </g>
          ))}
          {/* 达州段重点光环 */}
          <circle cx={nodes.dazhou.x} cy={nodes.dazhou.y} r="16" fill="none" stroke="#e60012" strokeWidth="1.5" opacity="0.7" />
          <circle cx={nodes.dazhou.x} cy={nodes.dazhou.y} r="16" fill="none" stroke="#e60012" strokeWidth="1.5" className="ct-pulse-ring" />

          {/* 事件点位（支持多起并发） */}
          {spotsNow.map(k => {
            const m = spotDefs[k]
            if (!m) return null
            const isSos = m.type === 'sos'
            return (
              <g key={k}>
                <circle cx={m.x} cy={m.y} r={isSos ? 7 : 6} fill={isSos ? '#e60012' : '#f59e0b'} stroke="#fff" strokeWidth="1.5" />
                <circle cx={m.x} cy={m.y} r="10" fill="none" stroke={isSos ? '#e60012' : '#f59e0b'} strokeWidth="2" className="ct-pulse-ring" />
                <circle cx={m.x} cy={m.y} r="10" fill="none" stroke={isSos ? '#e60012' : '#f59e0b'} strokeWidth="2" className="ct-pulse-ring" style={{ animationDelay: '0.7s' }} />
                <text x={m.x + 10} y={m.y - 10} fill={isSos ? '#ff8f8f' : '#fbbf24'} fontSize="11" fontWeight="bold">{isSos ? 'SOS' : '报平安超时'}</text>
              </g>
            )
          })}

          {/* 方向标注 */}
          <text x="604" y="106" fill="#5c76a8" fontSize="11">→ 安康方向</text>
          <text x="626" y="284" fill="#5c76a8" fontSize="11">→ 万州方向</text>
          <text x="30" y="726" fill="#5c76a8" fontSize="11">→ 昆明方向</text>
          <text x="420" y="744" fill="#5c76a8" fontSize="11">→ 昆明方向</text>
        </svg>
      </div>
      <div className="flex items-center gap-4 mt-1 shrink-0 text-[10px] text-slate-500">
        <span className="flex items-center gap-1"><i className="inline-block w-4 h-[3px] rounded bg-[#3a6ecf]" />局管线路</span>
        <span className="flex items-center gap-1"><i className="inline-block w-4 h-[4px] rounded bg-[#5aa2ff]" />达州段试点线路</span>
        <span className="flex items-center gap-1"><i className="inline-block w-2 h-2 rounded-full bg-[#e60012]" />SOS事件</span>
        <span className="flex items-center gap-1"><i className="inline-block w-2 h-2 rounded-full bg-[#f59e0b]" />报平安超时</span>
        <span className="ml-auto flex items-center gap-1 text-slate-600"><MapPin className="w-3 h-3" />定位以最终硬件参数为准</span>
      </div>
    </div>
  )
}
