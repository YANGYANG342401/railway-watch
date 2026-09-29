import { useState } from 'react'
import { 
  Search,
  ChevronRight,
  Heart,
  AlertTriangle,
  CheckCircle2,
  Eye,
  Bell,
  RefreshCw,
  Users,
  Activity,
  Shield,
  TrendingUp,
  MoreHorizontal,
  Phone,
  UserCircle,
  Filter,
  FileText,
  Settings
} from 'lucide-react'

// ========== 模拟数据 ==========
const teamsData = [
  {
    id: 'team-a', name: 'A车队',
    leader: { name: '张建军', phone: '138****2201' },
    totalDrivers: 86, onDuty: 32, abnormal: 2, caution: 3, offline: 4, compliance: 97.2,
    drivers: [
      { id: 'D001', name: '王建国', status: 'abnormal', heartRate: 128, spo2: 91, wearHours: 6.5, score: 45, lastAlert: '14:32', alertType: '疲劳预警' },
      { id: 'D006', name: '赵磊', status: 'normal', heartRate: 72, spo2: 98, wearHours: 7.5, score: 86, lastAlert: '-', alertType: '-' },
      { id: 'D009', name: '吴刚', status: 'normal', heartRate: 70, spo2: 98, wearHours: 6.9, score: 88, lastAlert: '-', alertType: '-' },
      { id: 'D015', name: '钱进', status: 'caution', heartRate: 95, spo2: 94, wearHours: 7.8, score: 64, lastAlert: '11:05', alertType: '心率偏高' },
      { id: 'D016', name: '孙明', status: 'normal', heartRate: 68, spo2: 99, wearHours: 5.2, score: 92, lastAlert: '-', alertType: '-' },
    ]
  },
  {
    id: 'team-b', name: 'B车队',
    leader: { name: '李国强', phone: '139****5587' },
    totalDrivers: 92, onDuty: 35, abnormal: 1, caution: 4, offline: 3, compliance: 95.8,
    drivers: [
      { id: 'D002', name: '陈强', status: 'abnormal', heartRate: 112, spo2: 89, wearHours: 5.2, score: 38, lastAlert: '13:41', alertType: '血氧偏低' },
      { id: 'D005', name: '刘洋', status: 'caution', heartRate: 88, spo2: 95, wearHours: 8.0, score: 59, lastAlert: '12:20', alertType: '疲劳预警' },
      { id: 'D010', name: '郑涛', status: 'normal', heartRate: 74, spo2: 97, wearHours: 7.8, score: 82, lastAlert: '-', alertType: '-' },
      { id: 'D017', name: '周海', status: 'normal', heartRate: 71, spo2: 98, wearHours: 6.4, score: 85, lastAlert: '-', alertType: '-' },
    ]
  },
  {
    id: 'team-c', name: 'C车队',
    leader: { name: '王志远', phone: '137****8834' },
    totalDrivers: 78, onDuty: 28, abnormal: 1, caution: 2, offline: 5, compliance: 94.1,
    drivers: [
      { id: 'D004', name: '张伟', status: 'caution', heartRate: 82, spo2: 96, wearHours: 3.8, score: 68, lastAlert: '13:55', alertType: '佩戴异常' },
      { id: 'D008', name: '周杰', status: 'normal', heartRate: 75, spo2: 97, wearHours: 7.2, score: 84, lastAlert: '-', alertType: '-' },
      { id: 'D013', name: '林峰', status: 'offline', heartRate: 0, spo2: 0, wearHours: 2.1, score: 0, lastAlert: '-', alertType: '离线' },
    ]
  },
  {
    id: 'team-d', name: 'D车队',
    leader: { name: '赵德明', phone: '136****4412' },
    totalDrivers: 68, onDuty: 25, abnormal: 0, caution: 1, offline: 3, compliance: 93.5,
    drivers: [
      { id: 'D007', name: '孙浩', status: 'normal', heartRate: 68, spo2: 99, wearHours: 6.8, score: 91, lastAlert: '-', alertType: '-' },
      { id: 'D011', name: '马超', status: 'normal', heartRate: 69, spo2: 98, wearHours: 5.5, score: 90, lastAlert: '-', alertType: '-' },
      { id: 'D018', name: '杨帆', status: 'caution', heartRate: 92, spo2: 95, wearHours: 7.9, score: 66, lastAlert: '10:30', alertType: '连续工作' },
    ]
  },
  {
    id: 'team-e', name: 'E车队',
    leader: { name: '陈卫东', phone: '135****7790' },
    totalDrivers: 62, onDuty: 22, abnormal: 1, caution: 2, offline: 3, compliance: 91.2,
    drivers: [
      { id: 'D012', name: '黄伟', status: 'normal', heartRate: 77, spo2: 96, wearHours: 8.1, score: 79, lastAlert: '-', alertType: '-' },
      { id: 'D014', name: '何军', status: 'offline', heartRate: 0, spo2: 0, wearHours: 1.5, score: 0, lastAlert: '-', alertType: '离线' },
      { id: 'D019', name: '徐亮', status: 'abnormal', heartRate: 118, spo2: 90, wearHours: 6.0, score: 42, lastAlert: '14:50', alertType: '心率+血氧' },
    ]
  },
]

// 预警数据
const alertsData = [
  { id: 1, driver: '王建国', team: 'A车队', type: '疲劳预警', level: 'high', time: '2024-03-15 14:32', detail: 'HRV持续偏低，连续工作6.5小时未休息', heartRate: 128, spo2: 91, status: 'pending', handler: '' },
  { id: 2, driver: '陈强', team: 'B车队', type: '血氧偏低', level: 'high', time: '2024-03-15 13:41', detail: '血氧89%，低于安全阈值90%，持续12分钟', heartRate: 112, spo2: 89, status: 'handled', handler: '李国强（B车队队长）' },
  { id: 3, driver: '徐亮', team: 'E车队', type: '心率+血氧', level: 'high', time: '2024-03-15 14:50', detail: '心率118bpm + 血氧90%，复合异常', heartRate: 118, spo2: 90, status: 'pending', handler: '' },
  { id: 4, driver: '李明', team: 'A车队', type: '心率异常', level: 'medium', time: '2024-03-15 14:18', detail: '心率128bpm持续8分钟，已自行恢复', heartRate: 98, spo2: 96, status: 'handled', handler: '张建军（A车队队长）' },
  { id: 5, driver: '张伟', team: 'C车队', type: '佩戴异常', level: 'low', time: '2024-03-15 13:55', detail: '离线超过45分钟，疑似未佩戴', heartRate: 0, spo2: 0, status: 'pending', handler: '' },
  { id: 6, driver: '刘洋', team: 'B车队', type: '疲劳预警', level: 'medium', time: '2024-03-15 12:20', detail: '昨晚睡眠仅4.2小时，疲劳风险高', heartRate: 88, spo2: 95, status: 'handled', handler: '李国强（B车队队长）' },
  { id: 7, driver: '钱进', team: 'A车队', type: '心率偏高', level: 'medium', time: '2024-03-15 11:05', detail: '心率95bpm持续30分钟，轻度偏高', heartRate: 95, spo2: 94, status: 'handled', handler: '张建军（A车队队长）' },
  { id: 8, driver: '杨帆', team: 'D车队', type: '连续工作', level: 'medium', time: '2024-03-15 10:30', detail: '连续工作7.9小时未休息，建议安排换班', heartRate: 92, spo2: 95, status: 'handled', handler: '赵德明（D车队队长）' },
  { id: 9, driver: '何军', team: 'E车队', type: '佩戴异常', level: 'low', time: '2024-03-15 09:15', detail: '上班后1.5小时仍未佩戴指环', heartRate: 0, spo2: 0, status: 'ignored', handler: '陈卫东（E车队队长）备注：请假未报' },
  { id: 10, driver: '林峰', team: 'C车队', type: '佩戴异常', level: 'low', time: '2024-03-15 08:40', detail: '指环信号断续，疑似接触不良', heartRate: 0, spo2: 0, status: 'handled', handler: '王志远（C车队队长）备注：已更换指环' },
]

const statusConfig = {
  abnormal: { label: '异常', color: 'bg-red-500/20 text-red-400 border-red-500/30' },
  caution: { label: '关注', color: 'bg-amber-500/20 text-amber-400 border-amber-500/30' },
  normal: { label: '正常', color: 'bg-emerald-500/20 text-emerald-400 border-emerald-500/30' },
  offline: { label: '离线', color: 'bg-slate-500/20 text-slate-400 border-slate-500/30' },
}

type NavPage = 'monitor' | 'alerts' | 'stats' | 'personnel' | 'settings'

export function Workbench() {
  const [currentPage, setCurrentPage] = useState<NavPage>('monitor')

  return (
    <div className="min-h-screen bg-[#0f1219] text-white">
      {/* 侧边栏 */}
      <aside className="fixed left-0 top-0 bottom-0 w-60 bg-[#0a0e16] border-r border-slate-800/50 flex flex-col z-40">
        <div className="p-5 border-b border-slate-800/50">
          <div className="flex items-center gap-3">
            <div className="w-9 h-9 rounded-xl bg-gradient-to-br from-teal-400 to-cyan-500 flex items-center justify-center">
              <Shield className="w-5 h-5 text-white" />
            </div>
            <div>
              <h1 className="text-sm font-bold">北仑港指环</h1>
              <p className="text-xs text-slate-500">管理平台</p>
            </div>
          </div>
        </div>
        <nav className="flex-1 p-3 space-y-1">
          <a href="#dashboard" className="flex items-center gap-3 px-3 py-2.5 rounded-xl text-sm text-slate-400 hover:text-slate-200 hover:bg-slate-800/50 transition-colors">
            <Activity className="w-4 h-4" /> <span className="flex-1">数据大屏</span>
          </a>
          <NavBtn icon={<Users className="w-4 h-4" />} label="实时监控" active={currentPage === 'monitor'} onClick={() => setCurrentPage('monitor')} />
          <NavBtn icon={<AlertTriangle className="w-4 h-4" />} label="预警中心" active={currentPage === 'alerts'} onClick={() => setCurrentPage('alerts')} badge={alertsData.filter(a => a.status === 'pending').length} />
          <NavBtn icon={<TrendingUp className="w-4 h-4" />} label="数据统计" active={currentPage === 'stats'} onClick={() => setCurrentPage('stats')} />
          <NavBtn icon={<FileText className="w-4 h-4" />} label="人员管理" active={currentPage === 'personnel'} onClick={() => setCurrentPage('personnel')} />
          <NavBtn icon={<Settings className="w-4 h-4" />} label="系统设置" active={currentPage === 'settings'} onClick={() => setCurrentPage('settings')} />
        </nav>
        <div className="p-4 border-t border-slate-800/50">
          <div className="flex items-center gap-3">
            <div className="w-8 h-8 rounded-full bg-slate-700 flex items-center justify-center text-xs">管</div>
            <div>
              <p className="text-sm text-slate-300">调度主管</p>
              <p className="text-xs text-slate-500">张主管</p>
            </div>
          </div>
        </div>
      </aside>

      {/* 主内容区 */}
      <main className="ml-60 p-6">
        {currentPage === 'monitor' && <MonitorPage />}
        {currentPage === 'alerts' && <AlertsPage />}
        {currentPage === 'stats' && <StatsPage />}
        {currentPage === 'personnel' && <PersonnelPage />}
        {currentPage === 'settings' && <SettingsPage />}
      </main>
    </div>
  )
}

// ========== 实时监控页 ==========
function MonitorPage() {
  const [expandedTeam, setExpandedTeam] = useState<string | null>('team-a')
  const [searchQuery, setSearchQuery] = useState('')
  const totalOnDuty = teamsData.reduce((sum, t) => sum + t.onDuty, 0)
  const totalAbnormal = teamsData.reduce((sum, t) => sum + t.abnormal, 0)
  const totalOffline = teamsData.reduce((sum, t) => sum + t.offline, 0)

  return (
    <>
      <div className="flex items-center justify-between mb-6">
        <div>
          <h2 className="text-xl font-bold">实时监控</h2>
          <p className="text-sm text-slate-500 mt-1">按车队查看司机状态，异常情况通知车队队长处理</p>
        </div>
        <button className="flex items-center gap-2 px-4 py-2 rounded-xl bg-slate-800 border border-slate-700 text-sm text-slate-300 hover:bg-slate-700 transition-colors">
          <RefreshCw className="w-4 h-4" /> 刷新数据
        </button>
      </div>

      <div className="grid grid-cols-4 gap-4 mb-6">
        <div className="bg-[#111827]/80 border border-slate-800/50 rounded-2xl p-4">
          <p className="text-xs text-slate-500 mb-1">车队数量</p>
          <p className="text-3xl font-bold text-slate-200">{teamsData.length}<span className="text-lg text-slate-500 ml-1">支</span></p>
        </div>
        <div className="bg-[#111827]/80 border border-slate-800/50 rounded-2xl p-4">
          <p className="text-xs text-slate-500 mb-1">当前在岗</p>
          <p className="text-3xl font-bold text-teal-400">{totalOnDuty}<span className="text-lg text-slate-500 ml-1">人</span></p>
        </div>
        <div className="bg-[#111827]/80 border border-red-500/20 rounded-2xl p-4">
          <p className="text-xs text-slate-500 mb-1">异常人数</p>
          <p className="text-3xl font-bold text-red-400">{totalAbnormal}<span className="text-lg text-slate-500 ml-1">人</span></p>
        </div>
        <div className="bg-[#111827]/80 border border-slate-800/50 rounded-2xl p-4">
          <p className="text-xs text-slate-500 mb-1">离线/未佩戴</p>
          <p className="text-3xl font-bold text-slate-400">{totalOffline}<span className="text-lg text-slate-500 ml-1">人</span></p>
        </div>
      </div>

      <div className="flex items-center gap-3 mb-5">
        <div className="relative flex-1 max-w-sm">
          <Search className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-slate-500" />
          <input type="text" placeholder="搜索司机姓名或工号..." value={searchQuery} onChange={(e) => setSearchQuery(e.target.value)}
            className="w-full pl-10 pr-4 py-2.5 rounded-xl bg-slate-800/80 border border-slate-700 text-sm text-slate-200 placeholder:text-slate-500 focus:outline-none focus:border-teal-500/50" />
        </div>
      </div>

      <div className="space-y-4">
        {teamsData.map((team) => {
          const isExpanded = expandedTeam === team.id
          const hasIssue = team.abnormal > 0
          return (
            <div key={team.id} className={`bg-[#111827]/80 border rounded-2xl overflow-hidden transition-all ${hasIssue ? 'border-red-500/20' : 'border-slate-800/50'}`}>
              <div className="flex items-center gap-4 px-5 py-4 cursor-pointer hover:bg-slate-800/30 transition-colors" onClick={() => setExpandedTeam(isExpanded ? null : team.id)}>
                <ChevronRight className={`w-4 h-4 text-slate-500 transition-transform ${isExpanded ? 'rotate-90' : ''}`} />
                <div className="flex-1">
                  <div className="flex items-center gap-3">
                    <h3 className="text-base font-semibold text-slate-200">{team.name}</h3>
                    {hasIssue && <span className="text-xs px-2 py-0.5 rounded-full bg-red-500/20 text-red-400 border border-red-500/30 animate-pulse">{team.abnormal}人异常</span>}
                  </div>
                  <div className="flex items-center gap-4 mt-1">
                    <span className="text-xs text-slate-500"><UserCircle className="w-3 h-3 inline mr-1" />队长：{team.leader.name}</span>
                    <span className="text-xs text-slate-500">总计 {team.totalDrivers} 人</span>
                  </div>
                </div>
                <div className="flex items-center gap-6">
                  <div className="text-center"><p className="text-lg font-bold text-teal-400">{team.onDuty}</p><p className="text-xs text-slate-500">在岗</p></div>
                  <div className="text-center"><p className={`text-lg font-bold ${team.abnormal > 0 ? 'text-red-400' : 'text-slate-600'}`}>{team.abnormal}</p><p className="text-xs text-slate-500">异常</p></div>
                  <div className="text-center"><p className={`text-lg font-bold ${team.compliance >= 95 ? 'text-emerald-400' : 'text-amber-400'}`}>{team.compliance}%</p><p className="text-xs text-slate-500">合规率</p></div>
                  <button onClick={(e) => { e.stopPropagation() }}
                    className={`flex items-center gap-2 px-3 py-2 rounded-xl border text-xs transition-colors ${hasIssue ? 'bg-amber-500/20 border-amber-500/30 text-amber-400 hover:bg-amber-500/30' : 'bg-slate-800/50 border-slate-700 text-slate-400 hover:bg-slate-700 hover:text-slate-300'}`}>
                    <Phone className="w-3.5 h-3.5" /> 通知队长
                  </button>
                </div>
              </div>
              {isExpanded && (
                <div className="border-t border-slate-800/50">
                  <div className="grid grid-cols-12 gap-4 px-5 py-2.5 bg-slate-800/20 text-xs text-slate-500 font-medium">
                    <div className="col-span-2">司机</div><div className="col-span-1">状态</div><div className="col-span-1 text-center">评分</div><div className="col-span-1 text-center">心率</div><div className="col-span-1 text-center">血氧</div><div className="col-span-2">佩戴时长</div><div className="col-span-2">最近预警</div><div className="col-span-2 text-right">操作</div>
                  </div>
                  <div className="divide-y divide-slate-800/30">
                    {team.drivers.sort((a, b) => { const o = { abnormal: 0, caution: 1, normal: 2, offline: 3 }; return (o[a.status as keyof typeof o] || 2) - (o[b.status as keyof typeof o] || 2) }).map((driver) => <DriverRow key={driver.id} driver={driver} />)}
                  </div>
                  <div className="px-5 py-3 bg-slate-800/10 text-center">
                    <button className="text-xs text-teal-400 hover:text-teal-300 transition-colors">查看{team.name}全部 {team.totalDrivers} 名司机 →</button>
                  </div>
                </div>
              )}
            </div>
          )
        })}
      </div>
    </>
  )
}

// ========== 预警中心页 ==========
function AlertsPage() {
  const [statusFilter, setStatusFilter] = useState<'all' | 'pending' | 'handled' | 'ignored'>('all')
  const [levelFilter, setLevelFilter] = useState<'all' | 'high' | 'medium' | 'low'>('all')

  const filtered = alertsData
    .filter(a => statusFilter === 'all' || a.status === statusFilter)
    .filter(a => levelFilter === 'all' || a.level === levelFilter)

  const pendingCount = alertsData.filter(a => a.status === 'pending').length
  const handledCount = alertsData.filter(a => a.status === 'handled').length
  const ignoredCount = alertsData.filter(a => a.status === 'ignored').length

  return (
    <>
      <div className="flex items-center justify-between mb-6">
        <div>
          <h2 className="text-xl font-bold">预警中心</h2>
          <p className="text-sm text-slate-500 mt-1">查看和处理所有健康预警事件</p>
        </div>
        <div className="flex items-center gap-3">
          <button className="flex items-center gap-2 px-4 py-2 rounded-xl bg-slate-800 border border-slate-700 text-sm text-slate-300 hover:bg-slate-700 transition-colors">
            <Filter className="w-4 h-4" /> 高级筛选
          </button>
        </div>
      </div>

      {/* 预警统计 */}
      <div className="grid grid-cols-4 gap-4 mb-6">
        <button onClick={() => setStatusFilter('all')} className={`p-4 rounded-2xl border text-left transition-all ${statusFilter === 'all' ? 'bg-slate-800 border-slate-600' : 'bg-[#111827]/80 border-slate-800/50 hover:border-slate-700'}`}>
          <p className="text-3xl font-bold text-slate-200">{alertsData.length}</p>
          <p className="text-xs text-slate-500 mt-1">全部预警</p>
        </button>
        <button onClick={() => setStatusFilter('pending')} className={`p-4 rounded-2xl border text-left transition-all ${statusFilter === 'pending' ? 'bg-red-500/20 border-red-500/30' : 'bg-[#111827]/80 border-slate-800/50 hover:border-slate-700'}`}>
          <p className="text-3xl font-bold text-red-400">{pendingCount}</p>
          <p className="text-xs text-slate-500 mt-1">待处理</p>
        </button>
        <button onClick={() => setStatusFilter('handled')} className={`p-4 rounded-2xl border text-left transition-all ${statusFilter === 'handled' ? 'bg-emerald-500/20 border-emerald-500/30' : 'bg-[#111827]/80 border-slate-800/50 hover:border-slate-700'}`}>
          <p className="text-3xl font-bold text-emerald-400">{handledCount}</p>
          <p className="text-xs text-slate-500 mt-1">已处理</p>
        </button>
        <button onClick={() => setStatusFilter('ignored')} className={`p-4 rounded-2xl border text-left transition-all ${statusFilter === 'ignored' ? 'bg-slate-700 border-slate-600' : 'bg-[#111827]/80 border-slate-800/50 hover:border-slate-700'}`}>
          <p className="text-3xl font-bold text-slate-400">{ignoredCount}</p>
          <p className="text-xs text-slate-500 mt-1">已忽略</p>
        </button>
      </div>

      {/* 严重程度筛选 */}
      <div className="flex items-center gap-2 mb-4">
        <span className="text-xs text-slate-500 mr-2">严重程度：</span>
        {(['all', 'high', 'medium', 'low'] as const).map(level => (
          <button key={level} onClick={() => setLevelFilter(level)}
            className={`px-3 py-1.5 rounded-lg text-xs transition-colors ${levelFilter === level ? 'bg-teal-500/20 text-teal-400 border border-teal-500/30' : 'bg-slate-800 text-slate-400 border border-slate-700 hover:text-slate-200'}`}>
            {{ all: '全部', high: '高危', medium: '中等', low: '低' }[level]}
          </button>
        ))}
      </div>

      {/* 预警列表 */}
      <div className="bg-[#111827]/80 border border-slate-800/50 rounded-2xl overflow-hidden">
        <div className="divide-y divide-slate-800/30">
          {filtered.map((alert) => (
            <div key={alert.id} className={`px-5 py-4 transition-colors hover:bg-slate-800/20 ${alert.status === 'pending' ? 'bg-red-500/[0.03]' : ''}`}>
              <div className="flex items-start gap-4">
                {/* 严重程度标识 */}
                <div className={`w-2 h-2 rounded-full mt-2 flex-shrink-0 ${
                  alert.level === 'high' ? 'bg-red-500' : alert.level === 'medium' ? 'bg-amber-500' : 'bg-slate-500'
                }`} />
                
                {/* 主要内容 */}
                <div className="flex-1 min-w-0">
                  <div className="flex items-center gap-3 mb-1">
                    <span className="text-sm font-medium text-slate-200">{alert.driver}</span>
                    <span className="text-xs text-slate-500">{alert.team}</span>
                    <span className={`text-xs px-2 py-0.5 rounded-full border ${
                      alert.level === 'high' ? 'bg-red-500/20 text-red-400 border-red-500/30' :
                      alert.level === 'medium' ? 'bg-amber-500/20 text-amber-400 border-amber-500/30' :
                      'bg-slate-500/20 text-slate-400 border-slate-500/30'
                    }`}>
                      {alert.type}
                    </span>
                  </div>
                  <p className="text-sm text-slate-400 mb-2">{alert.detail}</p>
                  {/* 生理数据快照 */}
                  {alert.heartRate > 0 && (
                    <div className="flex items-center gap-4 mb-2">
                      <span className="text-xs text-slate-500 flex items-center gap-1">
                        <Heart className="w-3 h-3" /> 心率 <span className={alert.heartRate > 100 ? 'text-red-400' : 'text-slate-300'}>{alert.heartRate}bpm</span>
                      </span>
                      <span className="text-xs text-slate-500 flex items-center gap-1">
                        血氧 <span className={alert.spo2 < 93 ? 'text-red-400' : 'text-slate-300'}>{alert.spo2}%</span>
                      </span>
                    </div>
                  )}
                  {/* 处理信息 */}
                  {alert.handler && (
                    <p className="text-xs text-slate-500">
                      <CheckCircle2 className="w-3 h-3 inline mr-1 text-emerald-400" />
                      处理人：{alert.handler}
                    </p>
                  )}
                </div>

                {/* 右侧：时间和操作 */}
                <div className="flex-shrink-0 text-right">
                  <p className="text-xs text-slate-500 mb-2">{alert.time.split(' ')[1]}</p>
                  <span className={`text-xs px-2 py-1 rounded-lg ${
                    alert.status === 'pending' ? 'bg-red-500/20 text-red-400' :
                    alert.status === 'handled' ? 'bg-emerald-500/20 text-emerald-400' :
                    'bg-slate-700 text-slate-400'
                  }`}>
                    {alert.status === 'pending' ? '待处理' : alert.status === 'handled' ? '已处理' : '已忽略'}
                  </span>
                  {alert.status === 'pending' && (
                    <div className="flex items-center gap-1 mt-2 justify-end">
                      <button className="p-1.5 rounded-lg bg-emerald-500/20 text-emerald-400 hover:bg-emerald-500/30 transition-colors" title="标记已处理">
                        <CheckCircle2 className="w-3.5 h-3.5" />
                      </button>
                      <button className="p-1.5 rounded-lg bg-amber-500/20 text-amber-400 hover:bg-amber-500/30 transition-colors" title="通知队长">
                        <Phone className="w-3.5 h-3.5" />
                      </button>
                      <button className="p-1.5 rounded-lg bg-slate-700 text-slate-400 hover:bg-slate-600 transition-colors" title="忽略">
                        <MoreHorizontal className="w-3.5 h-3.5" />
                      </button>
                    </div>
                  )}
                </div>
              </div>
            </div>
          ))}
        </div>
      </div>
    </>
  )
}

// ========== 数据统计页 ==========
function StatsPage() {
  const [tab, setTab] = useState<'compliance' | 'health' | 'alertStats'>('compliance')

  const complianceData = [
    { date: '3/9', rate: 92.1 }, { date: '3/10', rate: 93.5 }, { date: '3/11', rate: 94.8 },
    { date: '3/12', rate: 93.2 }, { date: '3/13', rate: 95.1 }, { date: '3/14', rate: 94.7 }, { date: '3/15', rate: 94.7 },
  ]
  const teamCompliance = [
    { name: 'A车队', rate: 97.2, change: +0.5 }, { name: 'B车队', rate: 95.8, change: -0.3 },
    { name: 'C车队', rate: 94.1, change: +1.2 }, { name: 'D车队', rate: 93.5, change: +0.8 }, { name: 'E车队', rate: 91.2, change: -1.1 },
  ]
  const healthDistribution = [
    { range: '90-100分', count: 45, percent: 31.7 }, { range: '80-89分', count: 52, percent: 36.6 },
    { range: '70-79分', count: 28, percent: 19.7 }, { range: '60-69分', count: 12, percent: 8.5 }, { range: '60分以下', count: 5, percent: 3.5 },
  ]
  const alertTypeStats = [
    { type: '疲劳预警', count: 89, percent: 38.2 }, { type: '心率异常', count: 56, percent: 24.0 },
    { type: '佩戴异常', count: 45, percent: 19.3 }, { type: '血氧偏低', count: 28, percent: 12.0 }, { type: '连续工作', count: 15, percent: 6.5 },
  ]

  return (
    <>
      <div className="flex items-center justify-between mb-6">
        <div>
          <h2 className="text-xl font-bold">数据统计</h2>
          <p className="text-sm text-slate-500 mt-1">佩戴合规、健康数据、预警分析</p>
        </div>
        <button className="flex items-center gap-2 px-4 py-2 rounded-xl bg-teal-500/20 border border-teal-500/30 text-sm text-teal-400 hover:bg-teal-500/30 transition-colors">
          <FileText className="w-4 h-4" /> 导出报表
        </button>
      </div>

      {/* Tab切换 */}
      <div className="flex items-center gap-2 mb-6">
        {([['compliance', '佩戴合规'], ['health', '健康数据'], ['alertStats', '预警分析']] as const).map(([key, label]) => (
          <button key={key} onClick={() => setTab(key)}
            className={`px-4 py-2 rounded-xl text-sm transition-colors ${tab === key ? 'bg-teal-500/20 text-teal-400 border border-teal-500/30' : 'bg-slate-800 text-slate-400 border border-slate-700 hover:text-slate-200'}`}>
            {label}
          </button>
        ))}
      </div>

      {tab === 'compliance' && (
        <div className="grid grid-cols-3 gap-4">
          {/* 合规率趋势 */}
          <div className="col-span-2 bg-[#111827]/80 border border-slate-800/50 rounded-2xl p-5">
            <h3 className="text-sm font-medium text-slate-400 mb-4">近7日佩戴合规率趋势</h3>
            <div className="flex items-end justify-between gap-3 h-40">
              {complianceData.map((d, i) => (
                <div key={i} className="flex-1 flex flex-col items-center gap-2">
                  <span className="text-xs text-slate-400">{d.rate}%</span>
                  <div className="w-full relative h-28">
                    <div className="absolute bottom-0 w-full rounded-t-md bg-teal-500/80" style={{ height: `${((d.rate - 88) / 12) * 100}%` }} />
                    {/* 95%目标线 */}
                    <div className="absolute w-full border-t border-dashed border-slate-600" style={{ bottom: `${((95 - 88) / 12) * 100}%` }} />
                  </div>
                  <span className="text-xs text-slate-500">{d.date}</span>
                </div>
              ))}
            </div>
            <p className="text-xs text-slate-500 mt-3 text-right">虚线为95%目标线</p>
          </div>
          {/* 车队排名 */}
          <div className="bg-[#111827]/80 border border-slate-800/50 rounded-2xl p-5">
            <h3 className="text-sm font-medium text-slate-400 mb-4">车队合规率排名</h3>
            <div className="space-y-4">
              {teamCompliance.map((team) => (
                <div key={team.name}>
                  <div className="flex items-center justify-between mb-1">
                    <span className="text-sm text-slate-300">{team.name}</span>
                    <div className="flex items-center gap-2">
                      <span className={`text-xs ${team.change >= 0 ? 'text-emerald-400' : 'text-red-400'}`}>{team.change >= 0 ? '+' : ''}{team.change}%</span>
                      <span className="text-sm font-semibold text-slate-200">{team.rate}%</span>
                    </div>
                  </div>
                  <div className="h-2 bg-slate-800 rounded-full overflow-hidden">
                    <div className={`h-full rounded-full ${team.rate >= 95 ? 'bg-emerald-500' : team.rate >= 93 ? 'bg-amber-500' : 'bg-red-500'}`} style={{ width: `${team.rate}%` }} />
                  </div>
                </div>
              ))}
            </div>
          </div>
        </div>
      )}

      {tab === 'health' && (
        <div className="grid grid-cols-2 gap-4">
          <div className="bg-[#111827]/80 border border-slate-800/50 rounded-2xl p-5">
            <h3 className="text-sm font-medium text-slate-400 mb-4">全员健康评分分布</h3>
            <div className="space-y-3">
              {healthDistribution.map((item) => (
                <div key={item.range}>
                  <div className="flex items-center justify-between mb-1">
                    <span className="text-sm text-slate-300">{item.range}</span>
                    <span className="text-sm text-slate-400">{item.count}人 ({item.percent}%)</span>
                  </div>
                  <div className="h-3 bg-slate-800 rounded-full overflow-hidden">
                    <div className={`h-full rounded-full ${
                      item.range.includes('90') ? 'bg-emerald-500' : item.range.includes('80') ? 'bg-teal-500' : item.range.includes('70') ? 'bg-amber-500' : item.range.includes('60-') ? 'bg-orange-500' : 'bg-red-500'
                    }`} style={{ width: `${item.percent * 2.5}%` }} />
                  </div>
                </div>
              ))}
            </div>
          </div>
          <div className="bg-[#111827]/80 border border-slate-800/50 rounded-2xl p-5">
            <h3 className="text-sm font-medium text-slate-400 mb-4">高风险人员（评分&lt;60）</h3>
            <div className="space-y-3">
              {[{ name: '陈强', score: 38, team: 'B车队', reason: '血氧持续偏低' }, { name: '徐亮', score: 42, team: 'E车队', reason: '心率+血氧复合异常' }, { name: '王建国', score: 45, team: 'A车队', reason: '疲劳累积严重' }, { name: '刘洋', score: 59, team: 'B车队', reason: '睡眠严重不足' }, { name: '钱进', score: 64, team: 'A车队', reason: '心率偏高' }].map(p => (
                <div key={p.name} className="flex items-center gap-3 p-3 rounded-xl bg-slate-800/50">
                  <div className="w-8 h-8 rounded-full bg-red-500/20 text-red-400 flex items-center justify-center text-xs font-medium">{p.name.charAt(0)}</div>
                  <div className="flex-1">
                    <div className="flex items-center gap-2"><span className="text-sm text-slate-200">{p.name}</span><span className="text-xs text-slate-500">{p.team}</span></div>
                    <p className="text-xs text-slate-500">{p.reason}</p>
                  </div>
                  <span className="text-lg font-bold text-red-400">{p.score}</span>
                </div>
              ))}
            </div>
          </div>
        </div>
      )}

      {tab === 'alertStats' && (
        <div className="grid grid-cols-2 gap-4">
          <div className="bg-[#111827]/80 border border-slate-800/50 rounded-2xl p-5">
            <h3 className="text-sm font-medium text-slate-400 mb-4">本月预警类型分布</h3>
            <div className="space-y-3">
              {alertTypeStats.map((item) => (
                <div key={item.type}>
                  <div className="flex items-center justify-between mb-1">
                    <span className="text-sm text-slate-300">{item.type}</span>
                    <span className="text-sm text-slate-400">{item.count}次 ({item.percent}%)</span>
                  </div>
                  <div className="h-3 bg-slate-800 rounded-full overflow-hidden">
                    <div className="h-full rounded-full bg-amber-500/80" style={{ width: `${item.percent * 2.5}%` }} />
                  </div>
                </div>
              ))}
            </div>
          </div>
          <div className="bg-[#111827]/80 border border-slate-800/50 rounded-2xl p-5">
            <h3 className="text-sm font-medium text-slate-400 mb-4">预警处理效率</h3>
            <div className="grid grid-cols-2 gap-4 mb-6">
              <div className="bg-slate-800/50 rounded-xl p-4 text-center">
                <p className="text-3xl font-bold text-emerald-400">82.6%</p>
                <p className="text-xs text-slate-500 mt-1">处理率</p>
              </div>
              <div className="bg-slate-800/50 rounded-xl p-4 text-center">
                <p className="text-3xl font-bold text-cyan-400">4.2<span className="text-lg">min</span></p>
                <p className="text-xs text-slate-500 mt-1">平均响应时间</p>
              </div>
            </div>
            <div className="space-y-3">
              <div className="flex items-center justify-between p-3 rounded-xl bg-slate-800/30">
                <span className="text-sm text-slate-300">本月预警总数</span>
                <span className="text-lg font-bold text-slate-200">233</span>
              </div>
              <div className="flex items-center justify-between p-3 rounded-xl bg-slate-800/30">
                <span className="text-sm text-slate-300">较上月变化</span>
                <span className="text-lg font-bold text-emerald-400">-12%</span>
              </div>
              <div className="flex items-center justify-between p-3 rounded-xl bg-slate-800/30">
                <span className="text-sm text-slate-300">成功干预事故</span>
                <span className="text-lg font-bold text-cyan-400">47次</span>
              </div>
            </div>
          </div>
        </div>
      )}
    </>
  )
}

// ========== 通用组件 ==========
function DriverRow({ driver }: { driver: { id: string; name: string; status: string; heartRate: number; spo2: number; wearHours: number; score: number; lastAlert: string; alertType: string } }) {
  return (
    <div className={`grid grid-cols-12 gap-4 px-5 py-3.5 items-center transition-colors hover:bg-slate-800/30 ${driver.status === 'abnormal' ? 'bg-red-500/5' : ''}`}>
      <div className="col-span-2 flex items-center gap-3">
        <div className={`w-8 h-8 rounded-full flex items-center justify-center text-xs font-medium ${
          driver.status === 'abnormal' ? 'bg-red-500/20 text-red-400' : driver.status === 'caution' ? 'bg-amber-500/20 text-amber-400' : driver.status === 'offline' ? 'bg-slate-700 text-slate-500' : 'bg-teal-500/20 text-teal-400'
        }`}>{driver.name.charAt(0)}</div>
        <div><p className="text-sm font-medium text-slate-200">{driver.name}</p><p className="text-xs text-slate-500">{driver.id}</p></div>
      </div>
      <div className="col-span-1">
        <span className={`text-xs px-2 py-1 rounded-lg border ${statusConfig[driver.status as keyof typeof statusConfig].color}`}>
          {statusConfig[driver.status as keyof typeof statusConfig].label}
        </span>
      </div>
      <div className="col-span-1 text-center">
        {driver.status !== 'offline' ? <span className={`text-lg font-bold ${driver.score >= 80 ? 'text-emerald-400' : driver.score >= 60 ? 'text-amber-400' : 'text-red-400'}`}>{driver.score}</span> : <span className="text-sm text-slate-600">--</span>}
      </div>
      <div className="col-span-1 text-center">
        {driver.status !== 'offline' ? (
          <div className="flex items-center justify-center gap-1">
            <Heart className={`w-3 h-3 ${driver.heartRate > 100 ? 'text-red-400' : 'text-slate-500'}`} fill={driver.heartRate > 100 ? '#f87171' : 'none'} />
            <span className={`text-sm ${driver.heartRate > 100 ? 'text-red-400 font-medium' : 'text-slate-300'}`}>{driver.heartRate}</span>
          </div>
        ) : <span className="text-sm text-slate-600">--</span>}
      </div>
      <div className="col-span-1 text-center">
        {driver.status !== 'offline' ? <span className={`text-sm ${driver.spo2 < 93 ? 'text-red-400 font-medium' : 'text-slate-300'}`}>{driver.spo2}%</span> : <span className="text-sm text-slate-600">--</span>}
      </div>
      <div className="col-span-2 flex items-center gap-2">
        <div className="flex-1 h-1.5 bg-slate-800 rounded-full overflow-hidden">
          <div className={`h-full rounded-full ${driver.wearHours >= 7 ? 'bg-emerald-500' : driver.wearHours >= 4 ? 'bg-amber-500' : 'bg-red-500'}`} style={{ width: `${Math.min((driver.wearHours / 8) * 100, 100)}%` }} />
        </div>
        <span className="text-xs text-slate-400 w-10">{driver.wearHours}h</span>
      </div>
      <div className="col-span-2">
        {driver.lastAlert !== '-' ? <div><p className="text-xs text-slate-300">{driver.alertType}</p><p className="text-xs text-slate-500">{driver.lastAlert}</p></div> : <span className="text-xs text-slate-600">无预警</span>}
      </div>
      <div className="col-span-2 flex items-center justify-end gap-1">
        <button className="p-2 rounded-lg hover:bg-slate-700 text-slate-500 hover:text-slate-300 transition-colors"><Eye className="w-4 h-4" /></button>
        {(driver.status === 'abnormal' || driver.status === 'caution') && <button className="p-2 rounded-lg hover:bg-amber-500/20 text-amber-500 hover:text-amber-400 transition-colors"><Bell className="w-4 h-4" /></button>}
        <button className="p-2 rounded-lg hover:bg-slate-700 text-slate-500 hover:text-slate-300 transition-colors"><MoreHorizontal className="w-4 h-4" /></button>
      </div>
    </div>
  )
}

// ========== 人员管理页 ==========
function PersonnelPage() {
  const [tab, setTab] = useState<'drivers' | 'teams' | 'devices'>('drivers')
  const allDrivers = teamsData.flatMap(t => t.drivers.map(d => ({ ...d, team: t.name, teamLeader: t.leader.name })))
  const deviceList = [
    { id: 'R-20240101', driver: '王建国', team: 'A车队', battery: 67, firmware: 'v2.1.3', status: 'online' },
    { id: 'R-20240102', driver: '陈强', team: 'B车队', battery: 45, firmware: 'v2.1.3', status: 'online' },
    { id: 'R-20240103', driver: '赵磊', team: 'A车队', battery: 82, firmware: 'v2.1.3', status: 'online' },
    { id: 'R-20240104', driver: '林峰', team: 'C车队', battery: 12, firmware: 'v2.0.8', status: 'offline' },
    { id: 'R-20240105', driver: '何军', team: 'E车队', battery: 5, firmware: 'v2.0.8', status: 'offline' },
    { id: 'R-20240106', driver: '孙浩', team: 'D车队', battery: 91, firmware: 'v2.1.3', status: 'online' },
    { id: 'R-20240107', driver: '—', team: '—', battery: 100, firmware: 'v2.1.3', status: 'unbound' },
    { id: 'R-20240108', driver: '—', team: '—', battery: 100, firmware: 'v2.1.3', status: 'unbound' },
  ]
  return (
    <>
      <div className="flex items-center justify-between mb-6">
        <div><h2 className="text-xl font-bold">人员管理</h2><p className="text-sm text-slate-500 mt-1">司机档案、车队管理、设备管理</p></div>
        <button className="flex items-center gap-2 px-4 py-2 rounded-xl bg-teal-500/20 border border-teal-500/30 text-sm text-teal-400 hover:bg-teal-500/30 transition-colors">+ 新增人员</button>
      </div>
      <div className="flex items-center gap-2 mb-6">
        {([['drivers', '司机档案'], ['teams', '车队管理'], ['devices', '设备管理']] as const).map(([key, label]) => (
          <button key={key} onClick={() => setTab(key)} className={`px-4 py-2 rounded-xl text-sm transition-colors ${tab === key ? 'bg-teal-500/20 text-teal-400 border border-teal-500/30' : 'bg-slate-800 text-slate-400 border border-slate-700 hover:text-slate-200'}`}>{label}</button>
        ))}
      </div>
      {tab === 'drivers' && (
        <div className="bg-[#111827]/80 border border-slate-800/50 rounded-2xl overflow-hidden">
          <div className="grid grid-cols-8 gap-4 px-5 py-3 bg-slate-800/30 border-b border-slate-800/50 text-xs text-slate-500 font-medium">
            <div className="col-span-2">姓名/工号</div><div>所属车队</div><div>队长</div><div className="text-center">健康评分</div><div className="text-center">状态</div><div>指环ID</div><div className="text-right">操作</div>
          </div>
          <div className="divide-y divide-slate-800/30">
            {allDrivers.map(d => (
              <div key={d.id} className="grid grid-cols-8 gap-4 px-5 py-3.5 items-center hover:bg-slate-800/20 transition-colors">
                <div className="col-span-2 flex items-center gap-3">
                  <div className={`w-8 h-8 rounded-full flex items-center justify-center text-xs font-medium ${d.status === 'abnormal' ? 'bg-red-500/20 text-red-400' : d.status === 'offline' ? 'bg-slate-700 text-slate-500' : 'bg-teal-500/20 text-teal-400'}`}>{d.name.charAt(0)}</div>
                  <div><p className="text-sm text-slate-200">{d.name}</p><p className="text-xs text-slate-500">{d.id}</p></div>
                </div>
                <div className="text-sm text-slate-300">{d.team}</div>
                <div className="text-sm text-slate-500">{d.teamLeader}</div>
                <div className="text-center">{d.status !== 'offline' ? <span className={`font-bold ${d.score >= 80 ? 'text-emerald-400' : d.score >= 60 ? 'text-amber-400' : 'text-red-400'}`}>{d.score}</span> : <span className="text-slate-600">--</span>}</div>
                <div className="text-center"><span className={`text-xs px-2 py-1 rounded-lg border ${statusConfig[d.status as keyof typeof statusConfig].color}`}>{statusConfig[d.status as keyof typeof statusConfig].label}</span></div>
                <div className="text-xs text-slate-500 font-mono">R-2024{d.id.slice(-3)}</div>
                <div className="text-right"><button className="text-xs text-teal-400 hover:text-teal-300">详情</button></div>
              </div>
            ))}
          </div>
        </div>
      )}
      {tab === 'teams' && (
        <div className="grid grid-cols-2 gap-4">
          {teamsData.map(team => (
            <div key={team.id} className="bg-[#111827]/80 border border-slate-800/50 rounded-2xl p-5">
              <div className="flex items-center justify-between mb-4"><h3 className="text-lg font-semibold text-slate-200">{team.name}</h3><span className={`text-sm font-bold ${team.compliance >= 95 ? 'text-emerald-400' : 'text-amber-400'}`}>{team.compliance}%</span></div>
              <div className="space-y-2 text-sm">
                <div className="flex justify-between"><span className="text-slate-500">队长</span><span className="text-slate-300">{team.leader.name}</span></div>
                <div className="flex justify-between"><span className="text-slate-500">联系电话</span><span className="text-slate-300">{team.leader.phone}</span></div>
                <div className="flex justify-between"><span className="text-slate-500">总人数</span><span className="text-slate-300">{team.totalDrivers}人</span></div>
                <div className="flex justify-between"><span className="text-slate-500">当前在岗</span><span className="text-teal-400">{team.onDuty}人</span></div>
                <div className="flex justify-between"><span className="text-slate-500">异常人数</span><span className={team.abnormal > 0 ? 'text-red-400' : 'text-slate-600'}>{team.abnormal}人</span></div>
              </div>
              <div className="flex gap-2 mt-4">
                <button className="flex-1 py-2 rounded-xl bg-slate-800 border border-slate-700 text-xs text-slate-400 hover:text-slate-200 transition-colors">编辑</button>
                <button className="flex-1 py-2 rounded-xl bg-teal-500/20 border border-teal-500/30 text-xs text-teal-400 hover:bg-teal-500/30 transition-colors">查看成员</button>
              </div>
            </div>
          ))}
        </div>
      )}
      {tab === 'devices' && (
        <div className="bg-[#111827]/80 border border-slate-800/50 rounded-2xl overflow-hidden">
          <div className="grid grid-cols-7 gap-4 px-5 py-3 bg-slate-800/30 border-b border-slate-800/50 text-xs text-slate-500 font-medium">
            <div>设备ID</div><div>绑定司机</div><div>所属车队</div><div className="text-center">电量</div><div className="text-center">固件版本</div><div className="text-center">状态</div><div className="text-right">操作</div>
          </div>
          <div className="divide-y divide-slate-800/30">
            {deviceList.map(device => (
              <div key={device.id} className="grid grid-cols-7 gap-4 px-5 py-3.5 items-center hover:bg-slate-800/20 transition-colors">
                <div className="text-sm text-slate-300 font-mono">{device.id}</div>
                <div className="text-sm text-slate-300">{device.driver}</div>
                <div className="text-sm text-slate-500">{device.team}</div>
                <div className="text-center"><span className={`text-sm font-medium ${device.battery > 50 ? 'text-emerald-400' : device.battery > 20 ? 'text-amber-400' : 'text-red-400'}`}>{device.battery}%</span></div>
                <div className="text-center text-xs text-slate-500">{device.firmware}</div>
                <div className="text-center"><span className={`text-xs px-2 py-1 rounded-lg ${device.status === 'online' ? 'bg-emerald-500/20 text-emerald-400' : device.status === 'offline' ? 'bg-red-500/20 text-red-400' : 'bg-slate-700 text-slate-400'}`}>{device.status === 'online' ? '在线' : device.status === 'offline' ? '离线' : '未绑定'}</span></div>
                <div className="text-right"><button className="text-xs text-teal-400 hover:text-teal-300">{device.status === 'unbound' ? '绑定' : '管理'}</button></div>
              </div>
            ))}
          </div>
        </div>
      )}
    </>
  )
}

// ========== 系统设置页 ==========
function SettingsPage() {
  const [alertRules, setAlertRules] = useState({ heartRateMax: 120, heartRateMin: 45, spo2Min: 90, fatigueHours: 6, offlineMinutes: 60 })
  return (
    <>
      <div className="flex items-center justify-between mb-6">
        <div><h2 className="text-xl font-bold">系统设置</h2><p className="text-sm text-slate-500 mt-1">预警规则、合规规则、通知设置</p></div>
      </div>
      <div className="grid grid-cols-2 gap-6">
        <div className="bg-[#111827]/80 border border-slate-800/50 rounded-2xl p-5">
          <h3 className="text-base font-semibold text-slate-200 mb-4 flex items-center gap-2"><AlertTriangle className="w-4 h-4 text-amber-400" /> 预警规则配置</h3>
          <div className="space-y-4">
            <SettingSlider label="心率上限预警" value={alertRules.heartRateMax} unit="bpm" min={100} max={150} onChange={(v) => setAlertRules(r => ({ ...r, heartRateMax: v }))} />
            <SettingSlider label="心率下限预警" value={alertRules.heartRateMin} unit="bpm" min={30} max={60} onChange={(v) => setAlertRules(r => ({ ...r, heartRateMin: v }))} />
            <SettingSlider label="血氧下限预警" value={alertRules.spo2Min} unit="%" min={80} max={95} onChange={(v) => setAlertRules(r => ({ ...r, spo2Min: v }))} />
            <SettingSlider label="连续工作预警" value={alertRules.fatigueHours} unit="小时" min={4} max={10} onChange={(v) => setAlertRules(r => ({ ...r, fatigueHours: v }))} />
            <SettingSlider label="离线预警时长" value={alertRules.offlineMinutes} unit="分钟" min={15} max={120} onChange={(v) => setAlertRules(r => ({ ...r, offlineMinutes: v }))} />
          </div>
          <button className="w-full mt-5 py-2.5 rounded-xl bg-teal-500/20 border border-teal-500/30 text-sm text-teal-400 hover:bg-teal-500/30 transition-colors">保存规则</button>
        </div>
        <div className="space-y-4">
          <div className="bg-[#111827]/80 border border-slate-800/50 rounded-2xl p-5">
            <h3 className="text-base font-semibold text-slate-200 mb-4 flex items-center gap-2"><Bell className="w-4 h-4 text-cyan-400" /> 通知设置</h3>
            <div className="space-y-3">
              <SettingToggle label="高危预警即时通知队长" desc="检测到高危异常时自动发送通知" defaultOn />
              <SettingToggle label="中等预警汇总通知" desc="每小时汇总一次中等预警发送" defaultOn />
              <SettingToggle label="低级预警仅记录" desc="低级预警不发送通知，仅在系统中记录" defaultOn />
              <SettingToggle label="每日报告推送" desc="每天早8点推送前一天的数据摘要" defaultOn={false} />
            </div>
          </div>
          <div className="bg-[#111827]/80 border border-slate-800/50 rounded-2xl p-5">
            <h3 className="text-base font-semibold text-slate-200 mb-4 flex items-center gap-2"><Shield className="w-4 h-4 text-emerald-400" /> 佩戴合规规则</h3>
            <div className="space-y-3">
              <div className="flex items-center justify-between p-3 rounded-xl bg-slate-800/30"><div><p className="text-sm text-slate-300">每日最大离线时长</p><p className="text-xs text-slate-500">超过此时长视为不合规</p></div><span className="text-lg font-bold text-teal-400">60分钟</span></div>
              <div className="flex items-center justify-between p-3 rounded-xl bg-slate-800/30"><div><p className="text-sm text-slate-300">考核周期</p><p className="text-xs text-slate-500">按月统计合规率</p></div><span className="text-sm font-medium text-slate-300">自然月</span></div>
              <div className="flex items-center justify-between p-3 rounded-xl bg-slate-800/30"><div><p className="text-sm text-slate-300">合规率达标线</p><p className="text-xs text-slate-500">低于此值视为不达标</p></div><span className="text-lg font-bold text-teal-400">90%</span></div>
            </div>
          </div>
        </div>
      </div>
    </>
  )
}

function SettingSlider({ label, value, unit, min, max, onChange }: { label: string; value: number; unit: string; min: number; max: number; onChange: (v: number) => void }) {
  return (
    <div>
      <div className="flex items-center justify-between mb-2"><span className="text-sm text-slate-300">{label}</span><span className="text-sm font-medium text-teal-400">{value} {unit}</span></div>
      <input type="range" min={min} max={max} value={value} onChange={(e) => onChange(Number(e.target.value))}
        className="w-full h-1.5 bg-slate-700 rounded-full appearance-none cursor-pointer [&::-webkit-slider-thumb]:appearance-none [&::-webkit-slider-thumb]:w-4 [&::-webkit-slider-thumb]:h-4 [&::-webkit-slider-thumb]:rounded-full [&::-webkit-slider-thumb]:bg-teal-400" />
    </div>
  )
}

function SettingToggle({ label, desc, defaultOn }: { label: string; desc: string; defaultOn?: boolean }) {
  const [on, setOn] = useState(defaultOn ?? true)
  return (
    <div className="flex items-center justify-between p-3 rounded-xl bg-slate-800/30">
      <div><p className="text-sm text-slate-300">{label}</p><p className="text-xs text-slate-500">{desc}</p></div>
      <button onClick={() => setOn(!on)} className={`w-11 h-6 rounded-full transition-colors relative ${on ? 'bg-teal-500' : 'bg-slate-600'}`}>
        <div className={`w-5 h-5 rounded-full bg-white absolute top-0.5 transition-all ${on ? 'left-[22px]' : 'left-0.5'}`} />
      </button>
    </div>
  )
}

function NavBtn({ icon, label, active, onClick, badge }: { icon: React.ReactNode; label: string; active?: boolean; onClick: () => void; badge?: number }) {
  return (
    <button onClick={onClick}
      className={`w-full flex items-center gap-3 px-3 py-2.5 rounded-xl text-sm transition-colors text-left ${
        active ? 'bg-teal-500/10 text-teal-400 border border-teal-500/20' : 'text-slate-400 hover:text-slate-200 hover:bg-slate-800/50 border border-transparent'
      }`}>
      {icon}
      <span className="flex-1">{label}</span>
      {badge !== undefined && badge > 0 && <span className="px-1.5 py-0.5 rounded-full bg-red-500/20 text-red-400 text-xs font-medium">{badge}</span>}
    </button>
  )
}
