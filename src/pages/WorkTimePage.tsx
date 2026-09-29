import { useState } from 'react'
import { ChevronLeft, Clock, Calendar, TrendingUp } from 'lucide-react'
import '../index.css'

const workData = {
  today: { hours: 5, minutes: 32 },
  month: { hours: 168, target: 200 },
  overtime: 12,
  // 本月每日工时明细（最近10天）
  daily: [
    { date: '03-15', hours: 5.5, shift: '白班', overtime: false },
    { date: '03-14', hours: 9.2, shift: '白班', overtime: true },
    { date: '03-13', hours: 8.0, shift: '白班', overtime: false },
    { date: '03-12', hours: 10.5, shift: '夜班', overtime: true },
    { date: '03-11', hours: 7.8, shift: '白班', overtime: false },
    { date: '03-10', hours: 0, shift: '休息', overtime: false },
    { date: '03-09', hours: 8.5, shift: '夜班', overtime: false },
    { date: '03-08', hours: 9.8, shift: '白班', overtime: true },
    { date: '03-07', hours: 8.0, shift: '白班', overtime: false },
    { date: '03-06', hours: 7.5, shift: '白班', overtime: false },
  ],
}

export function WorkTimePage() {
  const [isDark] = useState(true)
  const d = workData

  return (
    <div className={`min-h-screen ${isDark ? 'bg-[#121721]' : 'bg-[#f3efe7]'}`}>
      <div className="max-w-[430px] mx-auto">
        <SubHeader title="工时记录" isDark={isDark} />

        <div className="px-5 py-4 pb-10">
          {/* 今日工时大卡 */}
          <div className={`rounded-3xl p-5 mb-4 ${isDark ? 'bg-gradient-to-br from-teal-900/40 to-slate-800/60 border border-teal-800/30' : 'bg-gradient-to-br from-teal-50 to-white border border-teal-200 shadow-sm'}`}>
            <div className="flex items-center gap-2 mb-3">
              <Clock className={`w-5 h-5 ${isDark ? 'text-teal-400' : 'text-teal-600'}`} />
              <span className={`text-base font-bold ${isDark ? 'text-white' : 'text-slate-800'}`}>今天已工作</span>
            </div>
            <div className="flex items-baseline gap-1">
              <span className={`text-6xl font-black ${isDark ? 'text-white' : 'text-slate-800'}`}>{d.today.hours}</span>
              <span className={`text-2xl font-bold ${isDark ? 'text-slate-400' : 'text-slate-500'}`}>时</span>
              <span className={`text-5xl font-black ml-1 ${isDark ? 'text-white' : 'text-slate-800'}`}>{d.today.minutes}</span>
              <span className={`text-2xl font-bold ${isDark ? 'text-slate-400' : 'text-slate-500'}`}>分</span>
            </div>
          </div>

          {/* 本月累计 + 加班 */}
          <div className="grid grid-cols-2 gap-4 mb-4">
            <div className={`rounded-3xl p-5 ${isDark ? 'bg-slate-800/50 border border-slate-700/50' : 'bg-white border border-slate-200 shadow-sm'}`}>
              <div className="flex items-center gap-2 mb-2">
                <Calendar className={`w-4 h-4 ${isDark ? 'text-slate-400' : 'text-slate-500'}`} />
                <span className={`text-sm ${isDark ? 'text-slate-400' : 'text-slate-500'}`}>本月累计</span>
              </div>
              <div className="flex items-baseline gap-1">
                <span className={`text-4xl font-black ${isDark ? 'text-white' : 'text-slate-800'}`}>{d.month.hours}</span>
                <span className={`text-sm ${isDark ? 'text-slate-500' : 'text-slate-400'}`}>/{d.month.target}时</span>
              </div>
              <div className={`h-2 rounded-full overflow-hidden mt-3 ${isDark ? 'bg-slate-700' : 'bg-slate-200'}`}>
                <div className="h-full rounded-full bg-teal-500" style={{ width: `${(d.month.hours / d.month.target) * 100}%` }} />
              </div>
            </div>
            <div className={`rounded-3xl p-5 ${isDark ? 'bg-slate-800/50 border border-slate-700/50' : 'bg-white border border-slate-200 shadow-sm'}`}>
              <div className="flex items-center gap-2 mb-2">
                <TrendingUp className="w-4 h-4 text-amber-500" />
                <span className={`text-sm ${isDark ? 'text-slate-400' : 'text-slate-500'}`}>本月加班</span>
              </div>
              <div className="flex items-baseline gap-1">
                <span className="text-4xl font-black text-amber-500">{d.overtime}</span>
                <span className={`text-sm ${isDark ? 'text-slate-500' : 'text-slate-400'}`}>小时</span>
              </div>
              <p className={`text-xs mt-3 ${isDark ? 'text-slate-500' : 'text-slate-400'}`}>这是你的劳动记录</p>
            </div>
          </div>

          {/* 每日明细 */}
          <p className={`text-sm font-semibold mb-2 px-1 ${isDark ? 'text-slate-400' : 'text-slate-500'}`}>本月明细</p>
          <div className={`rounded-3xl overflow-hidden ${isDark ? 'bg-slate-800/50 border border-slate-700/50' : 'bg-white border border-slate-200 shadow-sm'}`}>
            {d.daily.map((day, i) => (
              <div key={i} className={`flex items-center gap-3 px-5 py-3.5 ${i > 0 ? (isDark ? 'border-t border-slate-700/40' : 'border-t border-slate-100') : ''}`}>
                <span className={`text-sm font-medium w-14 ${isDark ? 'text-slate-300' : 'text-slate-600'}`}>{day.date}</span>
                <span className={`text-xs px-2 py-0.5 rounded-full ${
                  day.shift === '夜班' ? (isDark ? 'bg-indigo-500/20 text-indigo-300' : 'bg-indigo-100 text-indigo-600')
                  : day.shift === '休息' ? (isDark ? 'bg-slate-600/40 text-slate-400' : 'bg-slate-100 text-slate-500')
                  : (isDark ? 'bg-amber-500/15 text-amber-400' : 'bg-amber-50 text-amber-600')
                }`}>{day.shift}</span>
                {day.overtime && <span className="text-xs px-2 py-0.5 rounded-full bg-red-500/15 text-red-400">加班</span>}
                <span className={`ml-auto text-base font-bold ${day.hours === 0 ? (isDark ? 'text-slate-600' : 'text-slate-300') : (isDark ? 'text-white' : 'text-slate-800')}`}>
                  {day.hours === 0 ? '—' : `${day.hours}h`}
                </span>
              </div>
            ))}
          </div>
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
