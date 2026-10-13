import { useEffect, useState } from 'react'
import { ChevronLeft, ChevronRight, Download, Moon, HeartPulse, Gauge, Footprints, Watch, Sparkles, Check } from 'lucide-react'
import { BottomNav } from '@/components/BottomNav'

const SEEN_KEY = 'ct-report-seen'
const LATEST = '2026-09'

const REPORTS = [
  {
    id: '2026-09', label: '2026年9月', gen: '10月3日 06:30 生成', fresh: true,
    brief: '睡眠结构改善明显，深睡占比升至22%，静息心率整体平稳。',
    summary: '本月整体状态稳中有升。睡眠总量与结构同步改善，22:30 前入睡的夜晚深睡明显更足；月中连续高温天静息心率略有升高，其余时间平稳。血压多数处于正常高值区间，建议持续留意。',
    wear: { days: '28/30', cover: '93%', daily: '16.2小时' },
    sleep: { avg: '7小时05分', delta: '较上月 +18分钟', deep: '22%', deepDelta: '较上月 +2个百分点', sleepAt: '22:40 前后', shortest: '5小时40分（9月18日）' },
    hr: { avg: '62次/分', peak: '112次/分（9月12日 14:20，出乘中）', high: '晨起静息心率超70：3天，均在连续出乘后' },
    bp: { avg: '126 / 81', range: '多数处于正常高值区间' },
    steps: { avg: '6,800步', okDays: '达标18天（目标8,000步）' },
    tips: [
      '这个月 22:30 前入睡的夜晚深睡明显更足，尽量保住这个习惯。',
      '有 3 天晨起静息心率超过 70，都出现在连续出乘后——退乘后先补一觉，比喝浓茶管用。',
      '血压多数处于正常高值，注意少盐少酒；若连续几天清晨超过 140/90，建议尽快去医院复测。',
    ],
  },
  {
    id: '2026-08', label: '2026年8月', gen: '9月2日 06:30 生成', fresh: false,
    brief: '月中连续高温，静息心率偏高，睡眠总量基本达标。',
    summary: '本月睡眠总量基本达标，但月中连续高温期间静息心率偏高、夜醒次数增多，进入下旬后逐步回落。活动量较上月略有下降。',
    wear: { days: '27/31', cover: '87%', daily: '15.6小时' },
    sleep: { avg: '6小时48分', delta: '较上月 +6分钟', deep: '20%', deepDelta: '与上月持平', sleepAt: '22:55 前后', shortest: '5小时12分（8月15日）' },
    hr: { avg: '64次/分', peak: '118次/分（8月14日 15:40，出乘中）', high: '静息心率超70：5天，集中在8月中旬高温周' },
    bp: { avg: '128 / 83', range: '多数处于正常高值区间' },
    steps: { avg: '6,100步', okDays: '达标14天（目标8,000步）' },
    tips: [
      '高温天出汗多，出乘前后各补一杯水，睡前避免冰饮，夜醒会少一些。',
      '8月中旬有 5 天静息心率偏高，若再次出现连日偏高并伴胸闷，建议去医院查一下。',
      '步数达标天数比上月少了 4 天，退乘后傍晚散散步 20 分钟就够了，不用猛走。',
    ],
  },
  {
    id: '2026-07', label: '2026年7月', gen: '8月2日 06:30 生成', fresh: false,
    brief: '夜班周睡眠偏碎、浅睡占比高，恢复度波动较大。',
    summary: '本月前半月夜班较多，睡眠偏碎、浅睡占比偏高，恢复度波动较大；后半月转白班后睡眠结构明显好转。整体呈前低后高走势。',
    wear: { days: '29/31', cover: '94%', daily: '16.8小时' },
    sleep: { avg: '6小时42分', delta: '较上月 -25分钟', deep: '19%', deepDelta: '较上月 -1个百分点', sleepAt: '23:10 前后', shortest: '4小时58分（7月9日）' },
    hr: { avg: '63次/分', peak: '109次/分（7月9日 02:15，夜班中）', high: '夜班周晨起静息心率普遍偏高' },
    bp: { avg: '125 / 80', range: '多数处于正常高值区间' },
    steps: { avg: '7,300步', okDays: '达标18天（目标8,000步）' },
    tips: [
      '夜班周睡眠被切散是难免的，退乘后固定补一觉 90 分钟左右，别硬扛到晚上。',
      '夜班期间心跳偏快，接班前少喝浓茶咖啡，可以用凉白开替代。',
      '步数表现不错，白班周继续保持；夜班周不强求步数，恢复优先。',
    ],
  },
]

function Section({ icon, title, children }: { icon: React.ReactNode; title: string; children: React.ReactNode }) {
  return (
    <div className="bg-card border br-card rounded-2xl p-4">
      <div className="flex items-center gap-2 mb-3">
        <span className="ta">{icon}</span>
        <h3 className="text-[17px] font-bold t1">{title}</h3>
      </div>
      {children}
    </div>
  )
}

function Row({ k, v, sub }: { k: string; v: string; sub?: string }) {
  return (
    <div className="flex items-baseline justify-between py-2 border-b br-line last:border-0">
      <span className="text-[15px] t3 shrink-0">{k}</span>
      <span className="text-right">
        <span className="text-[17px] font-bold t1">{v}</span>
        {sub && <span className="block text-[14px] t4 mt-0.5">{sub}</span>}
      </span>
    </div>
  )
}

export function ReportPage() {
  const [openId, setOpenId] = useState<string | null>(null)
  const [saved, setSaved] = useState(false)
  useEffect(() => { localStorage.setItem(SEEN_KEY, LATEST) }, [])

  const r = REPORTS.find(x => x.id === openId)

  if (r) {
    return (
      <div className="min-h-screen bg-app pb-28">
        <div className="fixed top-0 inset-x-0 z-40 h-[3px] bg-gradient-to-r from-[#e60012] via-[#e60012] via-30% to-[#2f7bff] to-90%" />
        <div className="max-w-[430px] mx-auto px-5 pt-5">
          <div className="flex items-center justify-between mb-4">
            <button onClick={() => { setOpenId(null); setSaved(false) }} className="flex items-center gap-1 text-[15px] ta active:opacity-70">
              <ChevronLeft className="w-5 h-5" /> 报告列表
            </button>
            <span className="text-[14.5px] t4">{r.label}</span>
          </div>

          <h1 className="text-[26px] font-bold t1 leading-snug">{r.label}健康报告</h1>
          <p className="text-[15px] t3 mt-1 mb-4">王师傅 · 机车司机 · {r.gen.replace(' 生成', '生成')}</p>

          <div className="bg-card border br-card rounded-2xl p-4 mb-3">
            <div className="flex items-center gap-2 mb-2">
              <span className="w-2 h-2 rounded-full bg-[#3ddc97] shadow-[0_0_8px_rgba(61,220,151,0.8)]" />
              <h3 className="text-[17px] font-bold t1">本月概览</h3>
            </div>
            <p className="text-[15.5px] leading-relaxed t2">{r.summary}</p>
          </div>

          <div className="space-y-3">
            <Section icon={<Watch className="w-5 h-5" />} title="佩戴概览">
              <Row k="佩戴天数" v={r.wear.days} sub={`覆盖率 ${r.wear.cover}`} />
              <Row k="日均佩戴" v={r.wear.daily} />
            </Section>

            <Section icon={<Moon className="w-5 h-5" />} title="睡眠">
              <Row k="月均睡眠" v={r.sleep.avg} sub={r.sleep.delta} />
              <Row k="深睡占比" v={r.sleep.deep} sub={r.sleep.deepDelta} />
              <Row k="常见入睡时间" v={r.sleep.sleepAt} />
              <Row k="最短一晚" v={r.sleep.shortest} />
            </Section>

            <Section icon={<HeartPulse className="w-5 h-5" />} title="心率">
              <Row k="静息心率月均" v={r.hr.avg} />
              <Row k="单月最高" v={r.hr.peak} />
              <Row k="需留意" v={r.hr.high} />
            </Section>

            <Section icon={<Gauge className="w-5 h-5" />} title="血压参考（光电估算）">
              <Row k="月均读数" v={r.bp.avg} sub={r.bp.range} />
              <p className="text-[14px] t4 mt-2">光电估算仅供参考，不作为诊断依据 · 数据仅自己可见</p>
            </Section>

            <Section icon={<Footprints className="w-5 h-5" />} title="活动量">
              <Row k="日均步数" v={r.steps.avg} />
              <Row k="目标达成" v={r.steps.okDays} />
            </Section>

            <Section icon={<Sparkles className="w-5 h-5" />} title="本月建议">
              <div className="space-y-3">
                {r.tips.map((t, i) => (
                  <div key={i} className="flex gap-3">
                    <span className="shrink-0 w-6 h-6 rounded-full bg-[#2f7bff]/15 border border-[#2f7bff]/40 ta text-[14.5px] font-bold flex items-center justify-center">{i + 1}</span>
                    <p className="text-[15px] leading-relaxed t2">{t}</p>
                  </div>
                ))}
              </div>
            </Section>

            <p className="text-[14px] t4 leading-relaxed px-1">
              本报告由手表厂商 AI 基于当月佩戴数据自动生成，仅供参考，不构成诊疗建议；如身体不适请及时就医。原始健康数据仅本人可见。
            </p>

            <button onClick={() => setSaved(true)}
              className={`w-full flex items-center justify-center gap-2 py-3.5 rounded-2xl font-bold text-[16px] active:scale-[0.98] transition ${saved ? 'bg-soft text-[#3ddc97] border border-[#3ddc97]/40' : 'bg-[#2f7bff] text-white'}`}>
              {saved ? <><Check className="w-5 h-5" /> 已保存 PDF</> : <><Download className="w-5 h-5" /> 保存 PDF</>}
            </button>
          </div>
        </div>
        <BottomNav active="report" />
      </div>
    )
  }

  return (
    <div className="min-h-screen bg-app pb-28">
      <div className="fixed top-0 inset-x-0 z-40 h-[3px] bg-gradient-to-r from-[#e60012] via-[#e60012] via-30% to-[#2f7bff] to-90%" />
      <div className="max-w-[430px] mx-auto px-5 pt-5">
        <h1 className="text-[26px] font-bold t1">健康报告</h1>
        <p className="text-[15px] t3 mt-1 mb-5">每月一份 · AI 生成 · 仅自己可见</p>

        <div className="space-y-3">
          {REPORTS.map(m => (
            <button key={m.id} onClick={() => setOpenId(m.id)}
              className="w-full flex items-center gap-3 bg-card border br-card rounded-2xl p-4 text-left active:scale-[0.98] transition">
              <div className="w-11 h-11 rounded-xl bg-[#2f7bff]/12 border border-[#2f7bff]/30 flex items-center justify-center shrink-0">
                <Moon className="w-5 h-5 ta" />
              </div>
              <div className="flex-1 min-w-0">
                <div className="flex items-center gap-2">
                  <span className="text-[17px] font-bold t1">{m.label}</span>
                  {m.fresh && localStorage.getItem(SEEN_KEY) !== m.id && (
                    <span className="bg-[#e60012] text-white text-[11px] font-bold px-1.5 py-[2px] rounded-full">新</span>
                  )}
                </div>
                <p className="text-[15px] t3 mt-1 leading-snug">{m.brief}</p>
                <p className="text-[13.5px] t4 mt-1">{m.gen}</p>
              </div>
              <ChevronRight className="w-5 h-5 t4 shrink-0" />
            </button>
          ))}
        </div>

        <button className="w-full py-3 mt-1 text-[15px] t4 active:opacity-70">查看更早报告（2026年6月起）</button>
        <p className="text-[14px] t4 leading-relaxed mt-6">
          报告由手表厂商 AI 基于当月佩戴数据自动生成，以 PDF 形式提供，仅供参考。
        </p>
      </div>
      <BottomNav active="report" />
    </div>
  )
}
