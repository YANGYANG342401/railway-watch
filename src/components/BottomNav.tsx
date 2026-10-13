import { TrainFront, Activity, FileText } from 'lucide-react'

export function BottomNav({ active = 'home', reportNew = false }: { active?: string; reportNew?: boolean }) {
  const tabs = [
    { key: 'home', hash: '', label: '首页' },
    { key: 'health', hash: '#health', label: '健康' },
    { key: 'report', hash: '#report', label: '报告' },
    { key: 'mine', hash: '#mine', label: '我的' },
  ]
  const icons: Record<string, React.ReactNode> = {
    home: <TrainFront className="w-6 h-6" />,
    health: <Activity className="w-6 h-6" />,
    report: <FileText className="w-6 h-6" />,
    mine: <span className="block w-6 h-6 rounded-full border-2 border-current" />,
  }
  return (
    <nav className="fixed bottom-0 inset-x-0 z-50" style={{ paddingBottom: 'env(safe-area-inset-bottom, 0px)' }}>
      <div className="max-w-[430px] mx-auto nav-bg backdrop-blur border-t br-line">
        <div className="flex items-stretch px-4 py-2">
          {tabs.map(t => {
            const on = t.key === active
            return (
              <button key={t.key} onClick={() => { window.location.hash = t.hash }}
                className={`relative flex-1 flex flex-col items-center gap-1 py-1.5 active:scale-90 transition-transform ${on ? 'ta' : 't4'}`}>
                {icons[t.key]}
                <span className="text-[14px] font-medium">{t.label}</span>
                <span className={`w-1.5 h-1.5 rounded-full transition-colors ${on ? 'bg-[#5aa2ff] shadow-[0_0_6px_rgba(90,162,255,0.9)]' : 'bg-transparent'}`} />
                {t.key === 'report' && reportNew && (
                  <span className="absolute top-0 right-4 bg-[#e60012] text-white text-[11px] font-bold leading-none px-1.5 py-[3px] rounded-full border-2 br-app">新</span>
                )}
              </button>
            )
          })}
        </div>
      </div>
      <div className="bg-app" style={{ height: 'env(safe-area-inset-bottom, 0px)' }} />
    </nav>
  )
}
