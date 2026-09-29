// 成铁大屏 mock 数据与演练剧本（达州段试点语境，人名工号均为虚构）
// 节点/边界底图数据见 ctMapBase.ts（真实川渝黔边界+统一投影坐标）

export const PLATFORM_NAME = '成铁智慧健康与应急管理平台'
export const PLATFORM_SUB = '成都铁路局集团 · 达州段试点'

export const kpi = {
  totalStaff: 1000,
  onlineDevices: 964,
  onlineRate: 96.4,
  keyGroup: 186,
  todayAlerts: 12,
  yesterdayAlerts: 15,
  pendingFollow: 3,
  scoreDist: { green: 812, yellow: 158, red: 30 },
  interventions7d: [6, 9, 8, 11, 10, 14, 13],
  todayInterventions: 3,
  sosToday: 1,
  loneTasksActive: 23,
  overtimeHandledRate: 100,
  avgResponse: '4分32秒',
  guardianBase: 8742193,
  aiReports: 1286,
  drills: 5,
  alertHandledRate: 98.7,
}

export const lines: { name: string; path: string[]; dazhou?: boolean }[] = [
  { name: '宝成线', path: ['chengdu', 'mianyang', 'guangyuan'] },
  { name: '西成高铁', path: ['chengdu', 'mianyang', 'guangyuan'] },
  { name: '成昆线', path: ['chengdu', 'xichang', 'panzhihua'] },
  { name: '成渝线', path: ['chengdu', 'neijiang', 'chongqing'] },
  { name: '达成线', path: ['dazhou', 'nanchong', 'suining', 'chengdu'], dazhou: true },
  { name: '襄渝线', path: ['dazhou', 'wanyuan'], dazhou: true },
  { name: '达万线', path: ['dazhou', 'wanzhou'], dazhou: true },
  { name: '成贵高铁', path: ['chengdu', 'yibin', 'guiyang'] },
  { name: '渝贵线', path: ['chongqing', 'zunyi', 'guiyang'] },
  { name: '沪昆线', path: ['guiyang', 'liupanshui'] },
]

// 实时事件池（轮换展示）
export const eventPool = [
  { time: '10:42:15', level: 'info', text: '达州机务车间 王建国 完成报平安确认（襄渝线K118）' },
  { time: '10:41:03', level: 'ok', text: '健康干预完成：重点人群 李长河 血压复查正常' },
  { time: '10:38:47', level: 'warn', text: '达州供电车间 张明全 报平安临期（剩余3分钟）' },
  { time: '10:35:20', level: 'info', text: '设备 DZ-0871 固件升级完成（v2.3.1）' },
  { time: '10:31:56', level: 'ok', text: 'SOS事件 #S0921 已解除，处置用时4分32秒' },
  { time: '10:27:12', level: 'warn', text: '万源线路车间 刘思远 心率持续偏高，已推送提醒' },
  { time: '10:22:40', level: 'info', text: '单人外出作业登记：陈国富 · 达成线K76 · 预计3小时' },
  { time: '10:18:05', level: 'ok', text: '今日第3例健康干预确认：周建军 睡眠指导完成' },
  { time: '10:12:33', level: 'info', text: '批量设备激活：DZ-0900 ~ DZ-0924（25台）' },
]

// SOS 通知对象（演练动效用）
export const notifyTargets = [
  { name: '段值班室', channel: '短信', status: '送达' },
  { name: '安全科·科长', channel: '短信', status: '送达' },
  { name: '副段长（分管安全）', channel: '语音外呼', status: '已接通' },
]

// 演练剧本：每步 { timeline, banner?, notifications?, sosActive?, rescue? }
export type ScenarioStep = { banner?: string; banners?: string[]; queue?: number; spots?: string[]; timeline: string; notifications?: number; sosActive?: boolean; rescue?: boolean }

// 地图事件点位坐标（与ctMapBase同坐标系）：k42sos 达万线K42 / k76sos 达成线K76 / k118 襄渝线报平安
export const spots: Record<string, { x: number; y: number; type: 'sos' | 'timeout'; label: string }> = {
  k42sos: { x: 571.3, y: 238.5, type: 'sos', label: 'SOS · 达万线K42' },
  k76sos: { x: 464.4, y: 244.7, type: 'sos', label: 'SOS · 达成线K76' },
  k118: { x: 555.1, y: 181.6, type: 'timeout', label: '报平安超时 · 襄渝线K118' },
}

export const scenarios: Record<string, { title: string; steps: ScenarioStep[] }> = {
  sos: {
    title: 'SOS 触发演练',
    steps: [
      { timeline: '达万线K42隧道工点 巡检员周建军 长按SOS键3秒', sosActive: true, banner: 'SOS紧急求助：周建军（DZ-0357）· 达万线K42隧道工点 · 手表已自动上报定位快照' },
      { timeline: '大屏告警高亮，平台同步推送通知', notifications: 1, sosActive: true },
      { timeline: '短信通知：段值班室、安全科', notifications: 2, sosActive: true },
      { timeline: '语音外呼：副段长（分管安全）已接通', notifications: 3, sosActive: true },
      { timeline: '值班室接警确认，派员前往处置', sosActive: true },
      { timeline: '事件解除，处置用时4分32秒，归档至事件档案', rescue: true },
    ],
  },
  lone: {
    title: '单人作业超时演练',
    steps: [
      { timeline: '襄渝线K118 巡线员王建国 报平安周期30分钟', banner: '报平安临期：王建国（DZ-0412）· 襄渝线K118 · 剩余3分钟' },
      { timeline: '一级超时：手表强震提醒，本人未确认', banner: '报平安超时（一级）：王建国 · 襄渝线K118 · 手表已强震提醒' },
      { timeline: '二级升级：通知车间值班，推送最后已知位置', banner: '报平安超时（二级）：已通知万源线路车间值班，推送最后位置', notifications: 2 },
      { timeline: '本人确认平安（虚惊），任务恢复正常', banner: '报平安已确认：王建国 报平安确认，超时解除，记录归档' },
      { timeline: '若持续无响应 → 三级：启动应急预案，按公里标圈定搜索范围', banner: '应急预案就绪：按襄渝线K118上下行各5公里圈定搜索范围' },
    ],
  },
  rescue: {
    title: '应急演练',
    steps: [
      { timeline: '达万线K42隧道内作业2人，预计17:30出洞，应出未出超时自动触发', banners: ['应急核查：达万线K42隧道内2人应出未出（周建军、陈国富）'], queue: 1, spots: ['k42sos'], sosActive: true },
      { timeline: '系统锁定最后已知位置与作业登记公里标（K42+100 ~ K42+500）', banners: ['最后已知位置：K42+300 · 作业登记：K42+100~K42+500 · 应出未出超时已触发'], queue: 1, spots: ['k42sos'], sosActive: true },
      { timeline: '同时段达成线K76 巡检员张明全心率异常SOS触发 —— 双事件并发，进入事件队列', banners: ['应急核查：达万线K42隧道内2人应出未出（周建军、陈国富）', 'SOS紧急求助：张明全（DZ-0412）· 达成线K76 · 心率异常自动触发'], queue: 2, spots: ['k42sos', 'k76sos'], sosActive: true, notifications: 2 },
      { timeline: '多事件并行处置：K42按预案推进救援，K76短信+语音通知责任人', banners: ['应急核查：达万线K42隧道内2人应出未出（周建军、陈国富）', 'SOS紧急求助：张明全（DZ-0412）· 达成线K76 · 通知已送达'], queue: 2, spots: ['k42sos', 'k76sos'], sosActive: true, notifications: 3 },
      { timeline: '救援按公里标圈定范围展开，K76就近工区先行处置', banners: ['应急核查：达万线K42隧道内2人应出未出（周建军、陈国富）', 'SOS处置：张明全 就近工区已到场，情况稳定'], queue: 2, spots: ['k42sos', 'k76sos'], sosActive: true },
      { timeline: '3人全部平安，事件逐一解除归档（全流程响应12分18秒）', rescue: true, banners: ['演练完成：3人平安 · 全流程响应12分18秒 · 演练记录已归档'], queue: 0, spots: [] },
    ],
  },
}
