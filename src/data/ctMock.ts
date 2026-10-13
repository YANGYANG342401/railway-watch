// 成铁员工端共享 mock：昨晚睡眠时间轴（首页与健康页共用）
export const STAGE: Record<string, { label: string; color: string }> = {
  deep: { label: '深睡', color: '#5aa2ff' },
  light: { label: '浅睡', color: '#3ddc97' },
  rem: { label: '做梦', color: '#f0b25a' },
  awake: { label: '清醒', color: '#64748b' },
}

export const sleepBlocks: { stage: string; h: number }[] = [
  { stage: 'light', h: 0.3 }, { stage: 'deep', h: 0.8 }, { stage: 'light', h: 0.4 },
  { stage: 'deep', h: 0.7 }, { stage: 'light', h: 0.3 }, { stage: 'deep', h: 0.6 },
  { stage: 'light', h: 0.5 }, { stage: 'rem', h: 0.3 }, { stage: 'light', h: 0.4 },
  { stage: 'awake', h: 0.2 }, { stage: 'light', h: 0.5 }, { stage: 'rem', h: 0.3 },
  { stage: 'light', h: 0.4 }, { stage: 'awake', h: 0.3 }, { stage: 'rem', h: 0.3 },
  { stage: 'light', h: 0.4 }, { stage: 'rem', h: 0.3 }, { stage: 'light', h: 0.2 },
]

// 夜间时间轴 → 枕木序列（15分钟/根）
export const ties: string[] = sleepBlocks.flatMap(b =>
  Array(Math.max(1, Math.round(b.h / 0.25))).fill(b.stage) as string[]
)

export const totalSleep = sleepBlocks.reduce((s, b) => s + b.h, 0)

export const stageHours = (key: string) =>
  sleepBlocks.filter(b => b.stage === key).reduce((s, b) => s + b.h, 0)
export const APP_VERSION = 'v1013-14'
