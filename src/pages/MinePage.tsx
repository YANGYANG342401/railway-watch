import { useState } from 'react'
import { ChevronLeft, ChevronRight, Watch, Siren, ShieldCheck, Bell, RefreshCw, Check, X, Pencil } from 'lucide-react'
import { BottomNav } from '@/components/BottomNav'
import { APP_VERSION } from '@/data/ctMock'

const AVATARS = [
  'bg-gradient-to-br from-[#2f7bff] to-[#5aa2ff]',
  'bg-gradient-to-br from-emerald-500 to-teal-400',
  'bg-gradient-to-br from-amber-500 to-orange-400',
  'bg-gradient-to-br from-violet-500 to-purple-400',
  'bg-gradient-to-br from-rose-500 to-pink-400',
  'bg-gradient-to-br from-cyan-500 to-sky-400',
]

const CARD = 'bg-card border br-card rounded-3xl'
const TOPLINE = 'fixed top-0 inset-x-0 z-40 h-[3px] bg-gradient-to-r from-[#e60012] via-[#e60012] via-30% to-[#2f7bff] to-90%'

function SubPage({ title, children }: { title: string; children: React.ReactNode }) {
  return (
    <div className="min-h-screen bg-app">
      <div className={TOPLINE} />
      <div className="max-w-[430px] mx-auto px-5 pt-5 pb-10">
        <button onClick={() => { window.location.hash = '#mine' }} className="flex items-center gap-1 text-[15px] ta mb-5 active:opacity-70">
          <ChevronLeft className="w-5 h-5" /> 我的
        </button>
        <h1 className="text-[24px] font-bold t1 mb-4">{title}</h1>
        {children}
      </div>
    </div>
  )
}

function Row({ icon, label, sub, to }: { icon: React.ReactNode; label: string; sub: string; to: string }) {
  return (
    <button onClick={() => { window.location.hash = to }} className="w-full flex items-center gap-3 p-4 active:opacity-70">
      <span className="w-10 h-10 rounded-xl bg-[#2f7bff]/12 border border-[#2f7bff]/30 flex items-center justify-center shrink-0 ta">{icon}</span>
      <span className="flex-1 text-left min-w-0">
        <span className="block text-[16.5px] font-bold t1">{label}</span>
        <span className="block text-[14px] t3 mt-0.5 truncate">{sub}</span>
      </span>
      <ChevronRight className="w-5 h-5 t4 shrink-0" />
    </button>
  )
}

const DEFAULT_PROFILE = { age: '45', h: '172', w: '68' }

export function MinePage() {
  const [notify, setNotify] = useState({ abnormal: true, report: true })
  const [profile, setProfile] = useState<{ age: string; h: string; w: string }>(() => {
    try { return JSON.parse(localStorage.getItem('ct-profile') || 'null') || DEFAULT_PROFILE } catch { return DEFAULT_PROFILE }
  })
  const [avatarIdx, setAvatarIdx] = useState(() => Number(localStorage.getItem('ct-avatar')) || 0)
  const [editing, setEditing] = useState(false)
  const [form, setForm] = useState({ age: profile?.age ?? '', h: profile?.h ?? '', w: profile?.w ?? '' })

  const saveProfile = () => {
    localStorage.setItem('ct-profile', JSON.stringify(form))
    localStorage.setItem('ct-avatar', String(avatarIdx))
    setProfile(form)
    setEditing(false)
  }
  const Toggle = ({ on, onClick }: { on: boolean; onClick: () => void }) => (
    <button onClick={onClick} className={`w-12 h-7 rounded-full transition-colors relative shrink-0 ${on ? 'bg-[#2f7bff]' : 'bg-slate-700'}`}>
      <span className={`absolute top-1 w-5 h-5 rounded-full bg-white transition-all ${on ? 'left-6' : 'left-1'}`} />
    </button>
  )
  return (
    <div className="min-h-screen bg-app pb-28">
      {editing && (
        <div className="fixed inset-0 z-[60] bg-black/60 flex items-end" onClick={() => setEditing(false)}>
          <div className="w-full max-w-[430px] mx-auto bg-sheet border-t br-card rounded-t-3xl p-5 pb-8" onClick={e => e.stopPropagation()}>
            <div className="flex items-center justify-between mb-4">
              <p className="text-[19px] font-bold t1">编辑资料</p>
              <button onClick={() => setEditing(false)} className="p-1 t4"><X className="w-5 h-5" /></button>
            </div>
            <p className="text-[14px] t3 mb-2">选择头像</p>
            <div className="flex gap-3 mb-5 overflow-x-auto pb-1">
              {AVATARS.map((a, i) => (
                <button key={i} onClick={() => setAvatarIdx(i)}
                  className={`w-12 h-12 rounded-full flex items-center justify-center text-[18px] font-black text-white shrink-0 ${a} ${i === avatarIdx ? 'ring-2 ring-[#5aa2ff] ring-offset-2 ring-offset-sheet' : 'opacity-70'}`}>王</button>
              ))}
            </div>
            <div className="space-y-3 mb-2">
              {([['age', '年龄（岁）'], ['h', '身高（cm）'], ['w', '体重（kg）']] as const).map(([k, label]) => (
                <div key={k} className="flex items-center justify-between">
                  <span className="text-[15px] t2">{label}<span className="t4 ml-1">选填</span></span>
                  <input value={form[k]} onChange={e => setForm({ ...form, [k]: e.target.value.replace(/\D/g, '').slice(0, 3) })}
                    inputMode="numeric" placeholder="—"
                    className="w-28 text-right bg-input border br-card rounded-xl px-3 py-2 text-[16px] t1 tabular-nums focus:border-[#5aa2ff] outline-none" />
                </div>
              ))}
            </div>
            <p className="text-[13px] t4 mb-4">仅用于健康参考（如 BMI、心率区间），仅自己可见</p>
            <button onClick={saveProfile} className="w-full py-3.5 rounded-2xl bg-[#2f7bff] text-white font-bold text-[16px] active:scale-[0.98] transition">保存</button>
          </div>
        </div>
      )}
      <div className={TOPLINE} />
      <div className="max-w-[430px] mx-auto px-5 pt-6">
        {/* 个人卡 */}
        <div className={`${CARD} p-5 mb-4`}>
          <div className="flex items-center gap-4">
            <button onClick={() => setEditing(true)} className={`w-16 h-16 rounded-full flex items-center justify-center text-[26px] font-black text-white shrink-0 ${AVATARS[avatarIdx]}`}>王</button>
            <div className="flex-1 min-w-0">
              <p className="text-[22px] font-bold t1">王师傅</p>
              <p className="text-[14.5px] t3 mt-0.5 whitespace-nowrap">机车司机 · 达州机务段</p>
            </div>
            <button onClick={() => setEditing(true)} className="p-2.5 rounded-xl bg-[#2f7bff]/12 border border-[#2f7bff]/30 active:scale-95 transition-transform shrink-0" aria-label="编辑资料">
              <Pencil className="w-4 h-4 ta" />
            </button>
          </div>
          <div className="flex items-center justify-between pt-3 mt-3 border-t br-line">
            <p className="text-[14.5px] t2 whitespace-nowrap">
              {profile.age && `${profile.age}岁`}{profile.h && ` · ${profile.h}cm`}{profile.w && ` · ${profile.w}kg`}
              {!profile.age && !profile.h && !profile.w && <span className="t4">点右上角补充年龄 · 身高 · 体重</span>}
            </p>
            <button onClick={() => { window.location.hash = '#watch' }} className="flex items-center gap-1.5 px-3 py-2 rounded-xl bg-[#2f7bff]/12 border border-[#2f7bff]/30 active:scale-95 transition-transform shrink-0">
              <Watch className="w-4 h-4 ta" />
              <span className="text-[14px] ta whitespace-nowrap">已连接 67%</span>
            </button>
          </div>
        </div>

        {/* 功能入口 */}
        <div className={`${CARD} divide-y divide-line mb-4`}>
          <Row icon={<Watch className="w-5 h-5" />} label="手表管理" sub="BT01 守护手表 · 电量67%" to="#watch" />
          <Row icon={<Siren className="w-5 h-5" />} label="SOS 记录" sub="本月0次 · 上次9月12日 · 已核实平安" to="#sos" />
          <Row icon={<ShieldCheck className="w-5 h-5" />} label="数据透明说明" sub="谁能看到我的健康数据" to="#datavisible" />
        </div>

        {/* 通知设置 */}
        <div className={`${CARD} p-4`}>
          <div className="flex items-center gap-2 mb-2">
            <Bell className="w-5 h-5 ta" />
            <span className="text-[16.5px] font-bold t1">消息通知</span>
          </div>
          <div className="flex items-center justify-between py-2.5 border-b br-line">
            <div>
              <p className="text-[15px] t1">异常提醒</p>
              <p className="text-[13px] t4 mt-0.5">心率/血氧明显异常时提醒</p>
            </div>
            <Toggle on={notify.abnormal} onClick={() => setNotify({ ...notify, abnormal: !notify.abnormal })} />
          </div>
          <div className="flex items-center justify-between py-2.5">
            <div>
              <p className="text-[15px] t1">报告生成提醒</p>
              <p className="text-[13px] t4 mt-0.5">每月报告生成后通知</p>
            </div>
            <Toggle on={notify.report} onClick={() => setNotify({ ...notify, report: !notify.report })} />
          </div>
        </div>

        <p className="text-center text-[12.5px] t4 mt-6">成铁健康 · 预览版 {APP_VERSION}</p>
      </div>
      <BottomNav active="mine" />
    </div>
  )
}

export function WatchPage() {
  const [sync, setSync] = useState<'idle' | 'doing' | 'done'>('idle')
  const [bound, setBound] = useState(true)
  const [confirming, setConfirming] = useState(false)

  if (!bound) {
    return (
      <SubPage title="手表管理">
        <div className={`${CARD} p-8 flex flex-col items-center text-center mb-3`}>
          <div className="w-16 h-16 rounded-2xl bg-soft border br-card flex items-center justify-center mb-4">
            <Watch className="w-8 h-8 t4" />
          </div>
          <p className="text-[18px] font-bold t1 mb-1">还未绑定守护手表</p>
          <p className="text-[14px] t3 leading-relaxed">绑定后自动同步健康数据，并开启 SOS 守护</p>
          <button onClick={() => setBound(true)} className="mt-5 px-8 py-3 rounded-2xl bg-[#2f7bff] text-white font-bold text-[16px] active:scale-[0.98] transition">绑定新手表</button>
        </div>
        <p className="text-[13px] t4 leading-relaxed px-1">新手表首次绑定时，用「成铁健康」App 扫描表盘上的二维码即可。</p>
      </SubPage>
    )
  }

  return (
    <SubPage title="手表管理">
      {confirming && (
        <div className="fixed inset-0 z-[60] bg-black/60 flex items-center justify-center px-8" onClick={() => setConfirming(false)}>
          <div className="w-full bg-sheet border br-card rounded-3xl p-5" onClick={e => e.stopPropagation()}>
            <p className="text-[18px] font-bold t1 mb-2">确认解除绑定？</p>
            <p className="text-[14px] t3 leading-relaxed mb-5">解绑后手表不再上报健康数据，SOS 守护同步停用；重新绑定后数据继续累计，不会被删除。</p>
            <div className="flex gap-3">
              <button onClick={() => setConfirming(false)} className="flex-1 py-3 rounded-2xl bg-slate-700 text-white font-bold text-[15px] active:scale-[0.98] transition">取消</button>
              <button onClick={() => { setBound(false); setConfirming(false) }} className="flex-1 py-3 rounded-2xl bg-[#e60012] text-white font-bold text-[15px] active:scale-[0.98] transition">确认解绑</button>
            </div>
          </div>
        </div>
      )}
      <div className={`${CARD} p-5 mb-3`}>
        <div className="flex items-center gap-4 mb-4">
          <div className="w-14 h-14 rounded-2xl bg-[#2f7bff]/12 border border-[#2f7bff]/30 flex items-center justify-center shrink-0">
            <Watch className="w-7 h-7 ta" />
          </div>
          <div className="flex-1">
            <p className="text-[18px] font-bold t1">BT01 守护手表</p>
            <p className="flex items-center gap-1.5 text-[14px] text-emerald-400 mt-1">
              <span className="w-2 h-2 rounded-full bg-emerald-400 shadow-[0_0_6px_rgba(52,211,153,0.9)] signal-breathe" /> 已连接
            </p>
          </div>
          <div className="text-right">
            <p className="text-[30px] font-black t1 leading-none tabular-nums">67<span className="text-[15px] t3 font-medium">%</span></p>
            <p className="text-[13px] t4 mt-1">电量</p>
          </div>
        </div>
        <div className="h-2 rounded-full bg-[#1c3462] overflow-hidden mb-1">
          <div className="h-full rounded-full bg-gradient-to-r from-[#2f7bff] to-[#3ddc97]" style={{ width: '67%' }} />
        </div>
      </div>

      <div className={`${CARD} p-4 mb-3`}>
        {[
          ['设备型号', 'BT01 智能守护手表'],
          ['固件版本', 'V2.3.1（最新）'],
          ['绑定时间', '2026年5月8日'],
          ['上次同步', '今天 06:12'],
          ['今日佩戴', '7小时32分'],
        ].map(([k, v]) => (
          <div key={k} className="flex items-center justify-between py-2.5 border-b br-line last:border-0">
            <span className="text-[15px] t3">{k}</span>
            <span className="text-[15px] font-medium t1">{v}</span>
          </div>
        ))}
      </div>

      <button onClick={() => { if (sync !== 'idle') return; setSync('doing'); setTimeout(() => setSync('done'), 1200) }}
        className={`w-full flex items-center justify-center gap-2 py-3.5 rounded-2xl font-bold text-[16px] active:scale-[0.98] transition ${sync === 'done' ? 'bg-soft text-[#3ddc97] border border-[#3ddc97]/40' : 'bg-[#2f7bff] text-white'}`}>
        {sync === 'done' ? <><Check className="w-5 h-5" /> 已同步至最新</> : <><RefreshCw className={`w-5 h-5 ${sync === 'doing' ? 'animate-spin' : ''}`} />{sync === 'doing' ? '正在同步…' : '立即同步'}</>}
      </button>
      <button onClick={() => setConfirming(true)} className="w-full py-3 mt-2 text-[15px] t4 active:opacity-70">解除绑定</button>

      <p className="text-[13px] t4 leading-relaxed mt-4 px-1">值乘与户外作业时段建议全程佩戴，睡眠数据更完整，守护更连续。</p>
    </SubPage>
  )
}

export function SosPage() {
  return (
    <SubPage title="SOS 记录">
      <div className={`${CARD} p-4 mb-3`}>
        <p className="text-[15.5px] t2 leading-relaxed">
          长按手表侧键 <span className="t1 font-bold">SOS 键 3 秒</span>，手表震动确认后自动上报位置与状态。守护中心会第一时间来电核实。
        </p>
      </div>

      <div className={`${CARD} p-4 mb-3`}>
        <p className="text-[16.5px] font-bold t1 mb-3">触发后会发生什么</p>
        {[
          ['手表震动确认', '避免误触，松手即取消'],
          ['位置与状态上报', '上报至守护中心，不在群内广播'],
          ['来电核实', '守护中心致电你或紧急联系人'],
          ['应急联动', '必要时联系段应急值守，就近处置'],
        ].map(([t, s], i) => (
          <div key={i} className="flex gap-3 py-2">
            <span className="shrink-0 w-6 h-6 rounded-full bg-[#2f7bff]/15 border border-[#2f7bff]/40 ta text-[14px] font-bold flex items-center justify-center">{i + 1}</span>
            <div>
              <p className="text-[15px] font-medium t1">{t}</p>
              <p className="text-[13.5px] t4 mt-0.5">{s}</p>
            </div>
          </div>
        ))}
      </div>

      <div className={`${CARD} p-4 mb-3`}>
        <div className="flex items-center justify-between mb-3">
          <p className="text-[16.5px] font-bold t1">历史记录</p>
          <span className="text-[14px] t4">本月 0 次</span>
        </div>
        {[
          { d: '9月12日 14:32', s: '已核实平安', ok: true },
          { d: '6月28日 10:05', s: '演练测试 · 已结束', ok: false },
        ].map((r, i) => (
          <div key={i} className="flex items-center justify-between py-2.5 border-b br-line last:border-0">
            <span className="text-[15px] t2 tabular-nums">{r.d}</span>
            <span className={`flex items-center gap-1.5 text-[14px] ${r.ok ? 'text-emerald-400' : 't4'}`}>
              <span className={`w-1.5 h-1.5 rounded-full ${r.ok ? 'bg-emerald-400' : 'bg-slate-600'}`} />{r.s}
            </span>
          </div>
        ))}
      </div>

      <p className="text-[13px] t4 leading-relaxed px-1">SOS 记录仅自己可见；触发时的位置信息只用于应急守护处置。</p>
    </SubPage>
  )
}

export function DataVisiblePage() {
  return (
    <SubPage title="数据透明说明">
      <div className={`${CARD} p-4 mb-3`}>
        <p className="text-[16.5px] font-bold t1 mb-3">谁能看到我的数据</p>
        {[
          { who: '我自己', what: '全部健康明细，仅本人账号可见', color: 'text-emerald-400', dot: 'bg-emerald-400' },
          { who: '段 / 公司管理侧', what: '只能看整体汇总统计（如月度佩戴情况），看不到任何个人的明细数据', color: 'ta', dot: 'bg-[#5aa2ff]' },
          { who: '手表厂商', what: '云端加密存储，仅用于生成你自己的健康报告', color: 't2', dot: 'bg-slate-400' },
        ].map((r, i) => (
          <div key={i} className="flex gap-3 py-2.5 border-b br-line last:border-0">
            <span className={`w-2 h-2 rounded-full ${r.dot} mt-2 shrink-0`} />
            <div>
              <p className={`text-[15.5px] font-bold ${r.color}`}>{r.who}</p>
              <p className="text-[14px] t3 mt-0.5 leading-relaxed">{r.what}</p>
            </div>
          </div>
        ))}
      </div>

      <div className={`${CARD} p-4 mb-3`}>
        <p className="text-[16.5px] font-bold t1 mb-3">我们的承诺</p>
        {[
          '健康数据不用于任何考核、评价或分配',
          '不向无关第三方提供你的个人数据',
          '不想继续使用时，可申请删除全部数据',
        ].map((t, i) => (
          <div key={i} className="flex gap-2.5 py-2">
            <Check className="w-5 h-5 text-emerald-400 shrink-0 mt-0.5" />
            <p className="text-[15px] t2 leading-relaxed">{t}</p>
          </div>
        ))}
      </div>

      <div className={`${CARD} p-4 mb-3`}>
        <p className="text-[15.5px] t2 leading-relaxed">
          唯一例外：<span className="t1 font-medium">SOS 求救触发时</span>，位置与状态会同步给守护中心和段应急值守，仅用于救援处置。
        </p>
      </div>

      <p className="text-[13px] t4 leading-relaxed px-1">依据《个人信息保护法》，你可随时查询、更正、删除自己的健康数据；如有疑问可通过段工会或客服反映。</p>
    </SubPage>
  )
}
