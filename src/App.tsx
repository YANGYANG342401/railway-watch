import { useState, useEffect } from 'react'
import { TrainFront, ChevronLeft } from 'lucide-react'
import { HomePage } from './pages/HomePage'
import { DashboardCT } from './pages/DashboardCT'

const pageNames: Record<string, string> = {
  health: '健康',
  ask: '问问AI',
  mine: '我的',
  settings: '设置',
  worktime: '值乘工时',
  watch: '手表管理',
  datavisible: '数据透明',
  sos: 'SOS记录',
}

function ComingSoon({ pageKey }: { pageKey: string }) {
  const name = pageNames[pageKey] ?? '该模块'
  return (
    <div className="min-h-screen bg-[#0a1730]">
      <div className="fixed top-0 inset-x-0 z-40 h-[3px] bg-gradient-to-r from-[#e60012] via-[#e60012] via-30% to-[#2f7bff] to-90%" />
      <div className="max-w-[430px] mx-auto px-5 py-5">
        <button
          onClick={() => { window.location.hash = '' }}
          className="flex items-center gap-1 text-sm text-[#5aa2ff] mb-10 active:opacity-70"
        >
          <ChevronLeft className="w-4 h-4" /> 返回首页
        </button>
        <div className="flex flex-col items-center justify-center py-24 text-center">
          <div className="w-16 h-16 rounded-2xl bg-[#13264a] border border-[#24406f] flex items-center justify-center mb-5">
            <TrainFront className="w-8 h-8 text-[#5aa2ff]" />
          </div>
          <p className="text-lg font-bold text-white mb-2">「{name}」建设中</p>
          <p className="text-sm text-slate-400 leading-relaxed">
            当前为成铁健康 App 首页样式预览<br />其余模块将沿用统一底层逐步开放
          </p>
        </div>
      </div>
    </div>
  )
}

function App() {
  const getHash = () => window.location.hash

  const [hash, setHash] = useState(getHash)

  useEffect(() => {
    const handler = () => setHash(getHash())
    window.addEventListener('hashchange', handler)
    return () => window.removeEventListener('hashchange', handler)
  }, [])

  if (hash === '#dashboard') return <DashboardCT />
  if (hash.startsWith('#doc-')) return <ComingSoon pageKey={hash.slice(1)} />
  if (pageNames[hash.slice(1)]) return <ComingSoon pageKey={hash.slice(1)} />

  return <HomePage />
}

export default App
