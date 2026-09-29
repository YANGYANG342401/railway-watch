import { useState, useEffect } from 'react'
import { 
  Users, 
  AlertTriangle, 
  Activity, 
  Shield,
  TrendingUp,
  TrendingDown,
  Clock,
  CheckCircle2,
  XCircle,
  WifiOff
} from 'lucide-react'

// ========== 模拟数据 ==========
// 基于宁波舟山港实际规模：某车队约300-500名集卡司机
const dashboardData = {
  // 核心指标
  totalDrivers: 386,
  onDuty: 142,
  offline: 18,
  abnormal: 5,
  complianceRate: 94.7,
  
  // 健康风险分布
  riskDistribution: {
    normal: 119,   // 绿色
    caution: 18,   // 黄色
    abnormal: 5,   // 红色
  },
  
  // 今日预警
  alerts: {
    total: 23,
    handled: 19,
    pending: 4,
    handleRate: 82.6,
  },
  
  // 安全指标
  safety: {
    monthAccidents: 0,
    lastMonthAccidents: 1,
    interventions: 47,
    consecutiveSafeDays: 34,
  },
  
  // 近7日预警趋势
  alertTrend: [
    { day: '周一', count: 18 },
    { day: '周二', count: 22 },
    { day: '周三', count: 15 },
    { day: '周四', count: 28 },
    { day: '周五', count: 19 },
    { day: '周六', count: 12 },
    { day: '周日', count: 23 },
  ],
  
  // 近7日合规率趋势
  complianceTrend: [
    { day: '周一', rate: 93.2 },
    { day: '周二', rate: 94.1 },
    { day: '周三', rate: 95.8 },
    { day: '周四', rate: 94.7 },
    { day: '周五', rate: 93.9 },
    { day: '周六', rate: 96.2 },
    { day: '周日', rate: 94.7 },
  ],

  // 实时预警列表
  recentAlerts: [
    { id: 1, driver: '王建国', type: '疲劳预警', level: 'high', time: '14:32', detail: 'HRV持续偏低，连续工作6.5小时', status: 'pending' },
    { id: 2, driver: '李明', type: '心率异常', level: 'medium', time: '14:18', detail: '心率128bpm持续8分钟', status: 'handled' },
    { id: 3, driver: '张伟', type: '佩戴异常', level: 'low', time: '13:55', detail: '离线超过45分钟', status: 'pending' },
    { id: 4, driver: '陈强', type: '血氧偏低', level: 'high', time: '13:41', detail: '血氧89%，低于安全阈值', status: 'handled' },
    { id: 5, driver: '刘洋', type: '疲劳预警', level: 'medium', time: '12:20', detail: '睡眠不足，昨晚仅4.2小时', status: 'handled' },
  ],
  
  // 车队排名
  teamRanking: [
    { name: 'A车队', compliance: 97.2, drivers: 86 },
    { name: 'B车队', compliance: 95.8, drivers: 92 },
    { name: 'C车队', compliance: 94.1, drivers: 78 },
    { name: 'D车队', compliance: 93.5, drivers: 68 },
    { name: 'E车队', compliance: 91.2, drivers: 62 },
  ],
  
  // 当前时间
  currentTime: new Date(),
}

export function Dashboard() {
  const [time, setTime] = useState(new Date())
  const [mounted, setMounted] = useState(false)
  
  useEffect(() => {
    setMounted(true)
    const timer = setInterval(() => setTime(new Date()), 1000)
    return () => clearInterval(timer)
  }, [])

  const data = dashboardData
  const totalOnDuty = data.riskDistribution.normal + data.riskDistribution.caution + data.riskDistribution.abnormal

  return (
    <div className="min-h-screen bg-[#0a0e1a] text-white overflow-hidden relative">
      {/* 背景网格 */}
      <div className="absolute inset-0 opacity-[0.03]" style={{
        backgroundImage: `linear-gradient(rgba(45,139,139,0.3) 1px, transparent 1px), linear-gradient(90deg, rgba(45,139,139,0.3) 1px, transparent 1px)`,
        backgroundSize: '60px 60px'
      }} />
      {/* 背景光晕 */}
      <div className="absolute top-0 left-1/4 w-[600px] h-[600px] bg-teal-500/5 rounded-full blur-[120px]" />
      <div className="absolute bottom-0 right-1/4 w-[400px] h-[400px] bg-cyan-500/5 rounded-full blur-[100px]" />
      
      <div className="relative z-10 p-6 max-w-[1920px] mx-auto">
        {/* 顶部标题栏 */}
        <header className={`flex items-center justify-between mb-6 transition-all duration-700 ${mounted ? 'opacity-100 translate-y-0' : 'opacity-0 -translate-y-4'}`}>
          <div className="flex items-center gap-4">
            <div className="w-10 h-10 rounded-xl bg-gradient-to-br from-teal-400 to-cyan-500 flex items-center justify-center">
              <Shield className="w-6 h-6 text-white" />
            </div>
            <div>
              <h1 className="text-2xl font-bold tracking-tight">北仑港智能指环监控平台</h1>
              <p className="text-sm text-slate-500">集卡司机健康管理与安全监控系统</p>
            </div>
          </div>
          <div className="flex items-center gap-6">
            <a href="#workbench" className="flex items-center gap-2 px-4 py-2 rounded-xl bg-slate-800/80 border border-slate-700 text-sm text-slate-300 hover:bg-slate-700 hover:text-white transition-colors">
              <Users className="w-4 h-4" />
              进入工作台
            </a>
            <div className="flex items-center gap-2 text-sm text-slate-400">
              <div className="w-2 h-2 rounded-full bg-emerald-400 animate-pulse" />
              <span>系统运行中</span>
            </div>
            <div className="text-right">
              <p className="text-2xl font-mono font-bold text-slate-200">
                {time.toLocaleTimeString('zh-CN', { hour12: false })}
              </p>
              <p className="text-xs text-slate-500">
                {time.toLocaleDateString('zh-CN', { year: 'numeric', month: 'long', day: 'numeric', weekday: 'long' })}
              </p>
            </div>
          </div>
        </header>

        {/* 核心指标卡片 */}
        <div className={`grid grid-cols-5 gap-4 mb-6 transition-all duration-700 delay-100 ${mounted ? 'opacity-100 translate-y-0' : 'opacity-0 translate-y-4'}`}>
          <MetricCard icon={<Users className="w-5 h-5" />} label="在岗司机" value={data.onDuty} suffix="人" subtext={`总计 ${data.totalDrivers} 人`} color="teal" />
          <MetricCard icon={<XCircle className="w-5 h-5" />} label="异常人数" value={data.abnormal} suffix="人" subtext="需立即关注" color="red" pulse />
          <MetricCard icon={<WifiOff className="w-5 h-5" />} label="离线/未佩戴" value={data.offline} suffix="人" subtext="超过30分钟" color="amber" />
          <MetricCard icon={<CheckCircle2 className="w-5 h-5" />} label="佩戴合规率" value={data.complianceRate} suffix="%" subtext="今日实时" color="emerald" />
          <MetricCard icon={<Shield className="w-5 h-5" />} label="连续安全天数" value={data.safety.consecutiveSafeDays} suffix="天" subtext="零事故运行" color="cyan" />
        </div>

        {/* 主体区域：三列布局 */}
        <div className={`grid grid-cols-12 gap-4 transition-all duration-700 delay-200 ${mounted ? 'opacity-100 translate-y-0' : 'opacity-0 translate-y-4'}`}>
          
          {/* 左侧：风险分布 + 车队排名 */}
          <div className="col-span-3 space-y-4">
            {/* 健康风险分布 */}
            <div className="bg-[#111827]/80 border border-slate-800/50 rounded-2xl p-5 backdrop-blur-sm">
              <h3 className="text-sm font-medium text-slate-400 mb-4 flex items-center gap-2">
                <Activity className="w-4 h-4 text-teal-400" />
                在岗司机健康分布
              </h3>
              {/* 环形图 */}
              <div className="flex items-center justify-center mb-4">
                <div className="relative w-40 h-40">
                  <svg className="w-full h-full -rotate-90" viewBox="0 0 120 120">
                    {/* 正常 - 绿色 */}
                    <circle cx="60" cy="60" r="50" fill="none" stroke="#10b981" strokeWidth="14"
                      strokeDasharray={`${(data.riskDistribution.normal / totalOnDuty) * 314} 314`} strokeLinecap="round" />
                    {/* 需关注 - 黄色 */}
                    <circle cx="60" cy="60" r="50" fill="none" stroke="#f59e0b" strokeWidth="14"
                      strokeDasharray={`${(data.riskDistribution.caution / totalOnDuty) * 314} 314`}
                      strokeDashoffset={`${-(data.riskDistribution.normal / totalOnDuty) * 314}`} strokeLinecap="round" />
                    {/* 异常 - 红色 */}
                    <circle cx="60" cy="60" r="50" fill="none" stroke="#ef4444" strokeWidth="14"
                      strokeDasharray={`${(data.riskDistribution.abnormal / totalOnDuty) * 314} 314`}
                      strokeDashoffset={`${-((data.riskDistribution.normal + data.riskDistribution.caution) / totalOnDuty) * 314}`} strokeLinecap="round" />
                  </svg>
                  <div className="absolute inset-0 flex flex-col items-center justify-center">
                    <span className="text-3xl font-bold">{totalOnDuty}</span>
                    <span className="text-xs text-slate-500">在岗总数</span>
                  </div>
                </div>
              </div>
              {/* 图例 */}
              <div className="space-y-2">
                <LegendItem color="bg-emerald-500" label="状态正常" value={data.riskDistribution.normal} percent={((data.riskDistribution.normal / totalOnDuty) * 100).toFixed(1)} />
                <LegendItem color="bg-amber-500" label="需要关注" value={data.riskDistribution.caution} percent={((data.riskDistribution.caution / totalOnDuty) * 100).toFixed(1)} />
                <LegendItem color="bg-red-500" label="状态异常" value={data.riskDistribution.abnormal} percent={((data.riskDistribution.abnormal / totalOnDuty) * 100).toFixed(1)} />
              </div>
            </div>

            {/* 车队合规排名 */}
            <div className="bg-[#111827]/80 border border-slate-800/50 rounded-2xl p-5 backdrop-blur-sm">
              <h3 className="text-sm font-medium text-slate-400 mb-4">车队合规率排名</h3>
              <div className="space-y-3">
                {data.teamRanking.map((team, i) => (
                  <div key={team.name} className="flex items-center gap-3">
                    <span className={`w-6 h-6 rounded-full flex items-center justify-center text-xs font-bold ${
                      i === 0 ? 'bg-amber-500/20 text-amber-400' : i === 1 ? 'bg-slate-400/20 text-slate-300' : i === 2 ? 'bg-orange-500/20 text-orange-400' : 'bg-slate-700 text-slate-500'
                    }`}>{i + 1}</span>
                    <span className="text-sm text-slate-300 flex-1">{team.name}</span>
                    <span className="text-xs text-slate-500">{team.drivers}人</span>
                    <span className={`text-sm font-semibold ${team.compliance >= 95 ? 'text-emerald-400' : team.compliance >= 93 ? 'text-amber-400' : 'text-red-400'}`}>
                      {team.compliance}%
                    </span>
                  </div>
                ))}
              </div>
            </div>
          </div>

          {/* 中间：趋势图表 */}
          <div className="col-span-5 space-y-4">
            {/* 预警趋势 */}
            <div className="bg-[#111827]/80 border border-slate-800/50 rounded-2xl p-5 backdrop-blur-sm">
              <div className="flex items-center justify-between mb-4">
                <h3 className="text-sm font-medium text-slate-400 flex items-center gap-2">
                  <AlertTriangle className="w-4 h-4 text-amber-400" />
                  近7日预警趋势
                </h3>
                <span className="text-xs text-slate-500">单位：次</span>
              </div>
              <BarChart data={data.alertTrend.map(d => ({ label: d.day, value: d.count }))} color="#f59e0b" maxValue={35} />
            </div>

            {/* 合规率趋势 */}
            <div className="bg-[#111827]/80 border border-slate-800/50 rounded-2xl p-5 backdrop-blur-sm">
              <div className="flex items-center justify-between mb-4">
                <h3 className="text-sm font-medium text-slate-400 flex items-center gap-2">
                  <TrendingUp className="w-4 h-4 text-emerald-400" />
                  近7日佩戴合规率
                </h3>
                <span className="text-xs text-slate-500">目标：95%</span>
              </div>
              <LineChart data={data.complianceTrend.map(d => ({ label: d.day, value: d.rate }))} color="#10b981" min={90} max={100} target={95} />
            </div>

            {/* 今日预警概览 */}
            <div className="bg-[#111827]/80 border border-slate-800/50 rounded-2xl p-5 backdrop-blur-sm">
              <h3 className="text-sm font-medium text-slate-400 mb-4 flex items-center gap-2">
                <Clock className="w-4 h-4 text-cyan-400" />
                今日预警处理
              </h3>
              <div className="grid grid-cols-4 gap-4">
                <div className="text-center">
                  <p className="text-3xl font-bold text-white">{data.alerts.total}</p>
                  <p className="text-xs text-slate-500 mt-1">预警总数</p>
                </div>
                <div className="text-center">
                  <p className="text-3xl font-bold text-emerald-400">{data.alerts.handled}</p>
                  <p className="text-xs text-slate-500 mt-1">已处理</p>
                </div>
                <div className="text-center">
                  <p className="text-3xl font-bold text-amber-400">{data.alerts.pending}</p>
                  <p className="text-xs text-slate-500 mt-1">待处理</p>
                </div>
                <div className="text-center">
                  <p className="text-3xl font-bold text-cyan-400">{data.alerts.handleRate}%</p>
                  <p className="text-xs text-slate-500 mt-1">处理率</p>
                </div>
              </div>
            </div>
          </div>

          {/* 右侧：实时预警列表 + 安全指标 */}
          <div className="col-span-4 space-y-4">
            {/* 实时预警列表 */}
            <div className="bg-[#111827]/80 border border-slate-800/50 rounded-2xl p-5 backdrop-blur-sm">
              <div className="flex items-center justify-between mb-4">
                <h3 className="text-sm font-medium text-slate-400 flex items-center gap-2">
                  <AlertTriangle className="w-4 h-4 text-red-400" />
                  实时预警
                </h3>
                <span className="text-xs px-2 py-1 rounded-full bg-red-500/20 text-red-400 animate-pulse">
                  {data.alerts.pending} 条待处理
                </span>
              </div>
              <div className="space-y-3">
                {data.recentAlerts.map((alert) => (
                  <AlertItem key={alert.id} alert={alert} />
                ))}
              </div>
            </div>

            {/* 安全指标 */}
            <div className="bg-[#111827]/80 border border-slate-800/50 rounded-2xl p-5 backdrop-blur-sm">
              <h3 className="text-sm font-medium text-slate-400 mb-4 flex items-center gap-2">
                <Shield className="w-4 h-4 text-teal-400" />
                安全运营指标
              </h3>
              <div className="grid grid-cols-2 gap-4">
                <div className="bg-slate-800/50 rounded-xl p-4 text-center">
                  <p className="text-4xl font-bold text-emerald-400">{data.safety.monthAccidents}</p>
                  <p className="text-xs text-slate-500 mt-1">本月事故</p>
                  <p className="text-xs text-emerald-400 mt-1 flex items-center justify-center gap-1">
                    <TrendingDown className="w-3 h-3" /> 较上月-{data.safety.lastMonthAccidents}
                  </p>
                </div>
                <div className="bg-slate-800/50 rounded-xl p-4 text-center">
                  <p className="text-4xl font-bold text-cyan-400">{data.safety.interventions}</p>
                  <p className="text-xs text-slate-500 mt-1">成功干预</p>
                  <p className="text-xs text-cyan-400 mt-1">本月累计</p>
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  )
}

// ========== 子组件 ==========

function MetricCard({ icon, label, value, suffix, subtext, color, pulse }: {
  icon: React.ReactNode; label: string; value: number; suffix: string; subtext: string; color: string; pulse?: boolean
}) {
  const colorMap: Record<string, string> = {
    teal: 'from-teal-500/20 to-teal-600/5 border-teal-500/30',
    red: 'from-red-500/20 to-red-600/5 border-red-500/30',
    amber: 'from-amber-500/20 to-amber-600/5 border-amber-500/30',
    emerald: 'from-emerald-500/20 to-emerald-600/5 border-emerald-500/30',
    cyan: 'from-cyan-500/20 to-cyan-600/5 border-cyan-500/30',
  }
  const iconColorMap: Record<string, string> = {
    teal: 'text-teal-400', red: 'text-red-400', amber: 'text-amber-400', emerald: 'text-emerald-400', cyan: 'text-cyan-400',
  }
  const valueColorMap: Record<string, string> = {
    teal: 'text-teal-300', red: 'text-red-300', amber: 'text-amber-300', emerald: 'text-emerald-300', cyan: 'text-cyan-300',
  }

  return (
    <div className={`bg-gradient-to-br ${colorMap[color]} border rounded-2xl p-4 backdrop-blur-sm ${pulse ? 'animate-pulse' : ''}`}>
      <div className="flex items-center gap-2 mb-3">
        <span className={iconColorMap[color]}>{icon}</span>
        <span className="text-xs text-slate-400">{label}</span>
      </div>
      <p className={`text-3xl font-bold ${valueColorMap[color]}`}>
        {value}<span className="text-lg text-slate-500 ml-1">{suffix}</span>
      </p>
      <p className="text-xs text-slate-500 mt-1">{subtext}</p>
    </div>
  )
}

function LegendItem({ color, label, value, percent }: { color: string; label: string; value: number; percent: string }) {
  return (
    <div className="flex items-center gap-3">
      <span className={`w-3 h-3 rounded-full ${color}`} />
      <span className="text-sm text-slate-400 flex-1">{label}</span>
      <span className="text-sm font-medium text-slate-300">{value}人</span>
      <span className="text-xs text-slate-500 w-12 text-right">{percent}%</span>
    </div>
  )
}

function AlertItem({ alert }: { alert: typeof dashboardData.recentAlerts[0] }) {
  const levelColors = {
    high: 'bg-red-500/20 text-red-400 border-red-500/30',
    medium: 'bg-amber-500/20 text-amber-400 border-amber-500/30',
    low: 'bg-slate-500/20 text-slate-400 border-slate-500/30',
  }
  const levelLabels = { high: '高', medium: '中', low: '低' }

  return (
    <div className={`flex items-start gap-3 p-3 rounded-xl border ${
      alert.status === 'pending' ? 'bg-slate-800/50 border-slate-700' : 'bg-slate-900/30 border-slate-800/30 opacity-70'
    }`}>
      <span className={`text-xs px-1.5 py-0.5 rounded border ${levelColors[alert.level as keyof typeof levelColors]}`}>
        {levelLabels[alert.level as keyof typeof levelLabels]}
      </span>
      <div className="flex-1 min-w-0">
        <div className="flex items-center gap-2">
          <span className="text-sm font-medium text-slate-200">{alert.driver}</span>
          <span className="text-xs text-slate-500">{alert.type}</span>
        </div>
        <p className="text-xs text-slate-500 mt-0.5 truncate">{alert.detail}</p>
      </div>
      <div className="text-right flex-shrink-0">
        <p className="text-xs text-slate-500">{alert.time}</p>
        <p className={`text-xs mt-0.5 ${alert.status === 'pending' ? 'text-amber-400' : 'text-emerald-400'}`}>
          {alert.status === 'pending' ? '待处理' : '已处理'}
        </p>
      </div>
    </div>
  )
}

// 柱状图组件
function BarChart({ data, color, maxValue }: { data: { label: string; value: number }[]; color: string; maxValue: number }) {
  return (
    <div className="flex items-end justify-between gap-2 h-32">
      {data.map((item, i) => (
        <div key={i} className="flex-1 flex flex-col items-center gap-2">
          <span className="text-xs text-slate-400">{item.value}</span>
          <div className="w-full relative" style={{ height: '80px' }}>
            <div 
              className="absolute bottom-0 w-full rounded-t-md transition-all duration-1000"
              style={{ 
                height: `${(item.value / maxValue) * 100}%`,
                backgroundColor: color,
                opacity: 0.8,
              }}
            />
          </div>
          <span className="text-xs text-slate-500">{item.label}</span>
        </div>
      ))}
    </div>
  )
}

// 折线图组件
function LineChart({ data, color, min, max, target }: { data: { label: string; value: number }[]; color: string; min: number; max: number; target?: number }) {
  const range = max - min
  const points = data.map((d, i) => {
    const x = (i / (data.length - 1)) * 100
    const y = 100 - ((d.value - min) / range) * 100
    return `${x},${y}`
  }).join(' ')

  const targetY = target ? 100 - ((target - min) / range) * 100 : null

  return (
    <div className="relative h-32">
      <svg className="w-full h-full" viewBox="0 0 100 100" preserveAspectRatio="none">
        {/* 目标线 */}
        {targetY !== null && (
          <line x1="0" y1={targetY} x2="100" y2={targetY} stroke="#475569" strokeWidth="0.5" strokeDasharray="2,2" />
        )}
        {/* 填充区域 */}
        <polygon
          points={`0,100 ${points} 100,100`}
          fill={color}
          opacity="0.1"
        />
        {/* 折线 */}
        <polyline
          points={points}
          fill="none"
          stroke={color}
          strokeWidth="1.5"
          strokeLinecap="round"
          strokeLinejoin="round"
        />
        {/* 数据点 */}
        {data.map((d, i) => {
          const x = (i / (data.length - 1)) * 100
          const y = 100 - ((d.value - min) / range) * 100
          return <circle key={i} cx={x} cy={y} r="2" fill={color} />
        })}
      </svg>
      {/* X轴标签 */}
      <div className="flex justify-between mt-2">
        {data.map((d, i) => (
          <span key={i} className="text-xs text-slate-500">{d.label}</span>
        ))}
      </div>
      {/* 目标标签 */}
      {target && (
        <span className="absolute right-0 text-xs text-slate-500" style={{ top: `${targetY}%`, transform: 'translateY(-50%)' }}>
          目标{target}%
        </span>
      )}
    </div>
  )
}
