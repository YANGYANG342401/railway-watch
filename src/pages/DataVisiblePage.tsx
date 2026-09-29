import { useState } from 'react'
import { ChevronLeft, Eye, EyeOff, ShieldCheck, Check, X } from 'lucide-react'
import '../index.css'

const visible = [
  { item: '在岗 / 离岗状态', why: '安排调度、确认你在不在岗位' },
  { item: '佩戴合规率', why: '看指环有没有正常戴着' },
  { item: '健康风险等级（红/黄/绿）', why: '只是个等级，不含具体数值' },
  { item: '异常预警（如心率持续过高）', why: '危险时能及时通知你和队长' },
]

const invisible = [
  '具体心率、血氧、体温数值',
  '睡眠时长和睡眠细节',
  '身体年龄、健康评分明细',
  '和健康助手的聊天内容',
  '你写的自我介绍、个人备注',
]

export function DataVisiblePage() {
  const [isDark] = useState(true)

  return (
    <div className={`min-h-screen ${isDark ? 'bg-[#121721]' : 'bg-[#f3efe7]'}`}>
      <div className="max-w-[430px] mx-auto">
        <SubHeader title="公司能看到啥" isDark={isDark} />

        <div className="px-5 py-4 pb-10">
          {/* 顶部说明 */}
          <div className={`rounded-3xl p-5 mb-4 ${isDark ? 'bg-teal-500/10 border border-teal-500/20' : 'bg-teal-50 border border-teal-100'}`}>
            <div className="flex items-center gap-2 mb-2">
              <ShieldCheck className={`w-5 h-5 ${isDark ? 'text-teal-400' : 'text-teal-600'}`} />
              <span className={`text-base font-bold ${isDark ? 'text-teal-200' : 'text-teal-800'}`}>你的数据，你做主</span>
            </div>
            <p className={`text-sm leading-relaxed ${isDark ? 'text-teal-100/80' : 'text-teal-700'}`}>
              这里清清楚楚告诉你：公司能看到哪些、看不到哪些。我们只把和安全、调度有关的最少信息给到公司，你的健康隐私都留在你自己手里。
            </p>
          </div>

          {/* 公司能看到 */}
          <div className="flex items-center gap-2 mb-2 px-1">
            <Eye className={`w-4 h-4 ${isDark ? 'text-amber-400' : 'text-amber-600'}`} />
            <span className={`text-sm font-semibold ${isDark ? 'text-slate-300' : 'text-slate-600'}`}>公司能看到</span>
          </div>
          <div className={`rounded-3xl overflow-hidden mb-4 ${isDark ? 'bg-slate-800/50 border border-slate-700/50' : 'bg-white border border-slate-200 shadow-sm'}`}>
            {visible.map((v, i) => (
              <div key={i} className={`flex items-start gap-3 px-5 py-3.5 ${i > 0 ? (isDark ? 'border-t border-slate-700/40' : 'border-t border-slate-100') : ''}`}>
                <div className={`w-5 h-5 rounded-full flex items-center justify-center flex-shrink-0 mt-0.5 ${isDark ? 'bg-amber-500/20' : 'bg-amber-100'}`}>
                  <Check className={`w-3.5 h-3.5 ${isDark ? 'text-amber-400' : 'text-amber-600'}`} />
                </div>
                <div>
                  <p className={`text-base font-medium ${isDark ? 'text-white' : 'text-slate-800'}`}>{v.item}</p>
                  <p className={`text-xs mt-0.5 ${isDark ? 'text-slate-500' : 'text-slate-400'}`}>为什么：{v.why}</p>
                </div>
              </div>
            ))}
          </div>

          {/* 公司看不到 */}
          <div className="flex items-center gap-2 mb-2 px-1">
            <EyeOff className={`w-4 h-4 ${isDark ? 'text-emerald-400' : 'text-emerald-600'}`} />
            <span className={`text-sm font-semibold ${isDark ? 'text-slate-300' : 'text-slate-600'}`}>公司看不到（只有你自己能看）</span>
          </div>
          <div className={`rounded-3xl overflow-hidden ${isDark ? 'bg-slate-800/50 border border-slate-700/50' : 'bg-white border border-slate-200 shadow-sm'}`}>
            {invisible.map((item, i) => (
              <div key={i} className={`flex items-center gap-3 px-5 py-3.5 ${i > 0 ? (isDark ? 'border-t border-slate-700/40' : 'border-t border-slate-100') : ''}`}>
                <div className={`w-5 h-5 rounded-full flex items-center justify-center flex-shrink-0 ${isDark ? 'bg-emerald-500/20' : 'bg-emerald-100'}`}>
                  <X className={`w-3.5 h-3.5 ${isDark ? 'text-emerald-400' : 'text-emerald-600'}`} />
                </div>
                <p className={`text-base font-medium ${isDark ? 'text-white' : 'text-slate-800'}`}>{item}</p>
              </div>
            ))}
          </div>

          <p className={`text-xs text-center mt-5 ${isDark ? 'text-slate-500' : 'text-slate-400'}`}>
            数据使用规则已写入用工协议，公司不得用于解雇、降薪或绩效考核
          </p>
        </div>
      </div>
    </div>
  )
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
