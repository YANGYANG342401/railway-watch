import { useState, useEffect } from 'react'
import {
  Sun,
  MoonStar,
  Zap,
  Gift,
  Trophy,
  Medal,
  Lock,
  Flame,
  Moon,
  Footprints,
  Clock,
  Shield,
  Coins,
  Crown,

  Pencil,
  Info,
  X,
  Camera,
} from 'lucide-react'
import '../index.css'

// 模拟数据
const profileData = {
  user: {
    name: '张师傅',
    workId: 'BL-2087',
    team: 'A车队',
    bio: '跑了8年港口，安全第一，多拉快跑。',
    avatar: '',
  },

  // 积分
  points: {
    total: 1280,
    thisMonth: 320,
    // 可兑换示例（实际由公司后台配置）
    rewards: [
      { icon: 'rest', name: '调休半天', cost: 2000, hot: true },
      { icon: 'shift', name: '优先选班次', cost: 800 },
      { icon: 'money', name: '健康补贴 200元', cost: 3000 },
      { icon: 'check', name: '免费体检升级', cost: 1500 },
    ],
  },

  // 本周挑战（只挑司机自己能控制的行为）
  challenges: [
    { icon: 'moon', title: '睡够觉', desc: '本周睡够6小时', current: 4, target: 5, unit: '天', reward: 50 },
    { icon: 'walk', title: '动一动', desc: '等货时活动满500步', current: 380, target: 500, unit: '步', reward: 30 },
    { icon: 'clock', title: '作息稳', desc: '本周按点上床', current: 3, target: 5, unit: '天', reward: 40 },
    { icon: 'ring', title: '戴满勤', desc: '本周佩戴达标', current: 6, target: 7, unit: '天', reward: 60 },
  ],

  // 勋章（硬朗风格，里程碑式）
  medals: [
    { icon: 'flame', name: '坚持百日', desc: '连续佩戴100天', got: true },
    { icon: 'moon', name: '早睡标兵', desc: '一个月规律作息', got: true },
    { icon: 'walk', name: '活力老司机', desc: '单月步数破10万', got: true },
    { icon: 'crown', name: '车队之星', desc: '月度排行第1', got: false },
    { icon: 'shield', name: '零异常月', desc: '一整月状态达标', got: false },
    { icon: 'trophy', name: '全勤王', desc: '季度佩戴全勤', got: false },
  ],

  // 车队排行（带谈资氛围）
  ranking: {
    joined: true,
    myRank: 3,
    list: [
      { rank: 1, name: '老李', steps: 12400, tag: '溜达冠军', me: false },
      { rank: 2, name: '王胖子', steps: 10800, tag: '', me: false },
      { rank: 3, name: '张师傅', steps: 9200, tag: '', me: true },
      { rank: 4, name: '老赵', steps: 8600, tag: '', me: false },
      { rank: 5, name: '小陈', steps: 7300, tag: '', me: false },
    ],
  },
}

export function ProfilePage() {
  const [isDark, setIsDark] = useState(true)
  const [mounted, setMounted] = useState(false)
  const [joinedRank, setJoinedRank] = useState(profileData.ranking.joined)

  // 个人信息编辑
  const [editing, setEditing] = useState(false)
  const [name, setName] = useState(profileData.user.name)
  const [bio, setBio] = useState(profileData.user.bio)
  const [avatar, setAvatar] = useState(profileData.user.avatar)
  // 编辑弹窗的临时值
  const [draftName, setDraftName] = useState(name)
  const [draftBio, setDraftBio] = useState(bio)
  const [draftAvatar, setDraftAvatar] = useState(avatar)

  useEffect(() => {
    setMounted(true)
  }, [])

  const openEdit = () => {
    setDraftName(name)
    setDraftBio(bio)
    setDraftAvatar(avatar)
    setEditing(true)
  }

  const saveEdit = () => {
    setName(draftName.trim() || '张师傅')
    setBio(draftBio.trim())
    setAvatar(draftAvatar)
    setEditing(false)
  }

  const handleAvatarPick = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0]
    if (file) {
      const reader = new FileReader()
      reader.onload = () => setDraftAvatar(reader.result as string)
      reader.readAsDataURL(file)
    }
  }

  // 退出/弹窗类
  const [selectedReward, setSelectedReward] = useState<{ name: string; cost: number; enough: boolean } | null>(null)
  const [selectedMedal, setSelectedMedal] = useState<{ name: string; desc: string; got: boolean } | null>(null)

  const d = profileData

  return (
    <div className={`min-h-screen transition-colors duration-500 ${isDark ? 'bg-[#121721]' : 'bg-[#f3efe7]'}`}>
      <div className="max-w-[430px] mx-auto px-5 py-5 pb-32">

        {/* 顶部栏 */}
        <div className="flex items-center justify-between mb-5">
          <p className={`text-2xl font-bold ${isDark ? 'text-white' : 'text-slate-800'}`}>我的</p>
          <button
            onClick={() => setIsDark(!isDark)}
            className={`w-11 h-11 rounded-full flex items-center justify-center transition-all active:scale-90 ${
              isDark ? 'bg-slate-800 text-amber-400' : 'bg-white text-slate-600 shadow-md'
            }`}
          >
            {isDark ? <Sun className="w-5 h-5" /> : <MoonStar className="w-5 h-5" />}
          </button>
        </div>

        {/* 个人信息卡 */}
        <div className={`mb-4 rounded-3xl p-5 transition-all duration-500 ${
          mounted ? 'opacity-100 translate-y-0' : 'opacity-0 translate-y-4'
        } ${isDark ? 'bg-gradient-to-br from-teal-900/40 to-slate-800/60 border border-teal-800/30' : 'bg-gradient-to-br from-teal-50 to-white border border-teal-200 shadow-sm'}`}>
          <div className="flex items-center gap-4">
            {/* 头像 */}
            {avatar ? (
              <img src={avatar} alt="头像" className="w-16 h-16 rounded-2xl object-cover flex-shrink-0" />
            ) : (
              <div className={`w-16 h-16 rounded-2xl flex items-center justify-center text-2xl font-black flex-shrink-0 ${
                isDark ? 'bg-teal-500/20 text-teal-300' : 'bg-teal-100 text-teal-700'
              }`}>
                {name.charAt(0)}
              </div>
            )}
            <div className="flex-1 min-w-0">
              <p className={`text-2xl font-bold ${isDark ? 'text-white' : 'text-slate-800'}`}>{name}</p>
              <div className="flex items-center gap-3 mt-1">
                <span className={`text-sm ${isDark ? 'text-slate-400' : 'text-slate-500'}`}>工号 {d.user.workId}</span>
                <span className={`text-sm px-2 py-0.5 rounded-full ${isDark ? 'bg-slate-700 text-slate-300' : 'bg-slate-100 text-slate-600'}`}>{d.user.team}</span>
              </div>
            </div>
            {/* 编辑按钮 */}
            <button
              onClick={openEdit}
              className={`w-10 h-10 rounded-full flex items-center justify-center flex-shrink-0 transition-all active:scale-90 ${
                isDark ? 'bg-slate-700/60 text-slate-300' : 'bg-white text-slate-600 shadow-sm'
              }`}
            >
              <Pencil className="w-4 h-4" />
            </button>
          </div>
          {/* 自我介绍 */}
          <div className={`mt-3 pt-3 border-t ${isDark ? 'border-slate-700/50' : 'border-slate-200/70'}`}>
            {bio ? (
              <p className={`text-sm ${isDark ? 'text-slate-300' : 'text-slate-600'}`}>{bio}</p>
            ) : (
              <button onClick={openEdit} className={`text-sm ${isDark ? 'text-slate-500' : 'text-slate-400'}`}>
                写句话介绍下自己 →
              </button>
            )}
          </div>
        </div>

        {/* 我的积分（游戏化核心） */}
        <Section isDark={isDark} mounted={mounted} delay={80}>
          <div className="flex items-center justify-between mb-4">
            <div className="flex items-center gap-2">
              <Coins className={`w-5 h-5 ${isDark ? 'text-amber-400' : 'text-amber-500'}`} />
              <span className={`text-lg font-bold ${isDark ? 'text-white' : 'text-slate-800'}`}>我的积分</span>
            </div>
            <span className={`text-sm font-semibold ${isDark ? 'text-emerald-400' : 'text-emerald-600'}`}>
              本月 +{d.points.thisMonth}
            </span>
          </div>

          {/* 总积分大数字 */}
          <div className="flex items-baseline gap-2 mb-4">
            <span className="text-5xl font-black text-amber-400">{d.points.total.toLocaleString()}</span>
            <span className={`text-lg font-bold ${isDark ? 'text-slate-400' : 'text-slate-500'}`}>分</span>
          </div>

          {/* 可兑换 */}
          <div className="flex items-center gap-2 mb-3">
            <Gift className={`w-4 h-4 ${isDark ? 'text-teal-400' : 'text-teal-600'}`} />
            <span className={`text-sm font-semibold ${isDark ? 'text-slate-300' : 'text-slate-600'}`}>能换啥</span>
          </div>
          <div className="grid grid-cols-2 gap-3 mb-2">
            {d.points.rewards.map((r, i) => {
              const enough = d.points.total >= r.cost
              return (
                <button key={i} onClick={() => setSelectedReward({ name: r.name, cost: r.cost, enough })} className={`relative p-3 rounded-2xl text-left active:scale-[0.97] transition-transform ${isDark ? 'bg-slate-700/40' : 'bg-slate-50'}`}>
                  {r.hot && (
                    <span className="absolute top-2 right-2 text-[10px] px-1.5 py-0.5 rounded-full bg-red-500/20 text-red-400 font-semibold">热门</span>
                  )}
                  <RewardIcon name={r.icon} isDark={isDark} />
                  <p className={`text-sm font-bold mt-2 ${isDark ? 'text-white' : 'text-slate-800'}`}>{r.name}</p>
                  <div className="flex items-center gap-1 mt-1">
                    <span className={`text-sm font-semibold ${enough ? 'text-amber-400' : (isDark ? 'text-slate-500' : 'text-slate-400')}`}>{r.cost}分</span>
                    {enough && <span className={`text-xs ${isDark ? 'text-emerald-400' : 'text-emerald-600'}`}>可换</span>}
                  </div>
                </button>
              )
            })}
          </div>
          <p className={`text-xs text-center mt-2 ${isDark ? 'text-slate-500' : 'text-slate-400'}`}>
            兑换内容由公司提供，具体以车队公告为准
          </p>
        </Section>

        {/* 本周挑战 */}
        <Section isDark={isDark} mounted={mounted} delay={160}>
          <div className="flex items-center gap-2 mb-4">
            <Flame className={`w-5 h-5 ${isDark ? 'text-orange-400' : 'text-orange-500'}`} />
            <span className={`text-lg font-bold ${isDark ? 'text-white' : 'text-slate-800'}`}>本周挑战</span>
            <span className={`ml-auto text-sm ${isDark ? 'text-slate-400' : 'text-slate-500'}`}>完成攒积分</span>
          </div>

          <div className="space-y-3">
            {d.challenges.map((c, i) => {
              const pct = Math.min((c.current / c.target) * 100, 100)
              const done = c.current >= c.target
              return (
                <div key={i} className={`p-3.5 rounded-2xl ${isDark ? 'bg-slate-700/30' : 'bg-slate-50'}`}>
                  <div className="flex items-center gap-3 mb-2">
                    <div className={`w-9 h-9 rounded-xl flex items-center justify-center flex-shrink-0 ${
                      done ? (isDark ? 'bg-emerald-500/20' : 'bg-emerald-100') : (isDark ? 'bg-slate-600/50' : 'bg-white')
                    }`}>
                      <ChallengeIcon name={c.icon} done={done} isDark={isDark} />
                    </div>
                    <div className="flex-1">
                      <div className="flex items-center gap-2">
                        <span className={`text-base font-bold ${isDark ? 'text-white' : 'text-slate-800'}`}>{c.title}</span>
                        <span className={`text-xs ${isDark ? 'text-slate-400' : 'text-slate-500'}`}>{c.desc}</span>
                      </div>
                    </div>
                    <span className={`text-sm font-semibold flex items-center gap-0.5 ${isDark ? 'text-amber-400' : 'text-amber-500'}`}>
                      +{c.reward}
                    </span>
                  </div>
                  <div className="flex items-center gap-3">
                    <div className={`flex-1 h-2.5 rounded-full overflow-hidden ${isDark ? 'bg-slate-600' : 'bg-slate-200'}`}>
                      <div className={`h-full rounded-full transition-all duration-700 ${done ? 'bg-emerald-500' : 'bg-teal-500'}`} style={{ width: `${pct}%` }} />
                    </div>
                    <span className={`text-sm font-medium flex-shrink-0 ${done ? (isDark ? 'text-emerald-400' : 'text-emerald-600') : (isDark ? 'text-slate-300' : 'text-slate-600')}`}>
                      {done ? '已达成' : `${c.current}/${c.target}${c.unit}`}
                    </span>
                  </div>
                </div>
              )
            })}
          </div>
        </Section>

        {/* 我的勋章 */}
        <Section isDark={isDark} mounted={mounted} delay={240}>
          <div className="flex items-center gap-2 mb-4">
            <Medal className={`w-5 h-5 ${isDark ? 'text-amber-400' : 'text-amber-500'}`} />
            <span className={`text-lg font-bold ${isDark ? 'text-white' : 'text-slate-800'}`}>我的勋章</span>
            <span className={`ml-auto text-sm ${isDark ? 'text-slate-400' : 'text-slate-500'}`}>
              已得 {d.medals.filter(m => m.got).length}/{d.medals.length}
            </span>
          </div>

          <div className="grid grid-cols-3 gap-3">
            {d.medals.map((m, i) => (
              <button key={i} onClick={() => setSelectedMedal({ name: m.name, desc: m.desc, got: m.got })} className={`flex flex-col items-center text-center p-3 rounded-2xl active:scale-[0.97] transition-transform ${
                m.got
                  ? (isDark ? 'bg-gradient-to-b from-amber-500/15 to-slate-700/30' : 'bg-gradient-to-b from-amber-50 to-white border border-amber-100')
                  : (isDark ? 'bg-slate-700/20' : 'bg-slate-50')
              }`}>
                <div className={`w-12 h-12 rounded-full flex items-center justify-center ${
                  m.got
                    ? (isDark ? 'bg-amber-500/20' : 'bg-amber-100')
                    : (isDark ? 'bg-slate-600/40' : 'bg-slate-200')
                }`}>
                  {m.got
                    ? <MedalIcon name={m.icon} isDark={isDark} />
                    : <Lock className={`w-5 h-5 ${isDark ? 'text-slate-500' : 'text-slate-400'}`} />
                  }
                </div>
                <p className={`text-sm font-bold mt-2 ${m.got ? (isDark ? 'text-white' : 'text-slate-800') : (isDark ? 'text-slate-500' : 'text-slate-400')}`}>{m.name}</p>
                <p className={`text-[11px] mt-0.5 leading-tight ${isDark ? 'text-slate-500' : 'text-slate-400'}`}>{m.desc}</p>
              </button>
            ))}
          </div>
        </Section>

        {/* 车队排行 */}
        <Section isDark={isDark} mounted={mounted} delay={320}>
          <div className="flex items-center gap-2 mb-1">
            <Trophy className={`w-5 h-5 ${isDark ? 'text-amber-400' : 'text-amber-500'}`} />
            <span className={`text-lg font-bold ${isDark ? 'text-white' : 'text-slate-800'}`}>车队溜达榜</span>
            {/* 参加开关 */}
            <button
              onClick={() => setJoinedRank(!joinedRank)}
              className={`ml-auto relative w-12 h-6 rounded-full transition-colors ${joinedRank ? 'bg-teal-500' : (isDark ? 'bg-slate-600' : 'bg-slate-300')}`}
            >
              <span className={`absolute top-0.5 w-5 h-5 rounded-full bg-white transition-all ${joinedRank ? 'left-6' : 'left-0.5'}`} />
            </button>
          </div>

          {/* 开关说明 */}
          <div className={`flex items-start gap-2 p-3 rounded-2xl mb-4 ${
            joinedRank
              ? (isDark ? 'bg-slate-700/30' : 'bg-slate-50')
              : (isDark ? 'bg-amber-500/10' : 'bg-amber-50')
          }`}>
            <Info className={`w-4 h-4 flex-shrink-0 mt-0.5 ${joinedRank ? (isDark ? 'text-slate-400' : 'text-slate-500') : (isDark ? 'text-amber-400' : 'text-amber-600')}`} />
            <p className={`text-sm leading-relaxed ${joinedRank ? (isDark ? 'text-slate-400' : 'text-slate-500') : (isDark ? 'text-amber-200' : 'text-amber-700')}`}>
              {joinedRank
                ? '开关打开中：你的步数会出现在车队溜达榜，工友能看到。关掉开关就退出不参加排名，工友看不见你的步数。'
                : '开关已关闭：你不参与排名，工友看不到你的步数。想跟大伙比一比，打开开关就行。'}
            </p>
          </div>

          {joinedRank ? (
            <>
              {/* 排行列表 */}
              <div className="space-y-2">
                {d.ranking.list.map((p) => (
                  <div key={p.rank} className={`flex items-center gap-3 p-3 rounded-2xl ${
                    p.me ? (isDark ? 'bg-teal-500/15 border border-teal-500/30' : 'bg-teal-50 border border-teal-200') : (isDark ? 'bg-slate-700/30' : 'bg-slate-50')
                  }`}>
                    <span className={`w-7 h-7 rounded-full flex items-center justify-center text-sm font-black flex-shrink-0 ${
                      p.rank === 1 ? 'bg-amber-400 text-amber-900' : p.rank === 2 ? 'bg-slate-300 text-slate-700' : p.rank === 3 ? 'bg-orange-400/80 text-orange-900' : (isDark ? 'bg-slate-600 text-slate-300' : 'bg-slate-200 text-slate-500')
                    }`}>
                      {p.rank}
                    </span>
                    <span className={`text-base font-bold ${p.me ? (isDark ? 'text-teal-300' : 'text-teal-700') : (isDark ? 'text-white' : 'text-slate-800')}`}>
                      {p.name}{p.me && ' (我)'}
                    </span>
                    {p.tag && (
                      <span className="text-xs px-2 py-0.5 rounded-full bg-amber-500/20 text-amber-400 font-semibold flex items-center gap-0.5">
                        <Crown className="w-3 h-3" />{p.tag}
                      </span>
                    )}
                    <span className={`ml-auto text-base font-bold ${isDark ? 'text-slate-200' : 'text-slate-700'}`}>
                      {p.steps.toLocaleString()}<span className={`text-xs font-normal ml-0.5 ${isDark ? 'text-slate-500' : 'text-slate-400'}`}>步</span>
                    </span>
                  </div>
                ))}
              </div>
            </>
          ) : (
            <div className={`p-6 rounded-2xl text-center ${isDark ? 'bg-slate-700/20' : 'bg-slate-50'}`}>
              <p className={`text-sm ${isDark ? 'text-slate-400' : 'text-slate-500'}`}>打开开关，加入车队溜达榜</p>
            </div>
          )}
        </Section>

      </div>

      {/* 编辑个人信息弹窗 */}
      {editing && (
        <div className="fixed inset-0 z-[60] flex items-end justify-center">
          {/* 遮罩 */}
          <div className="absolute inset-0 bg-black/50 backdrop-blur-sm" onClick={() => setEditing(false)} />
          {/* 弹窗内容 */}
          <div className={`relative w-full max-w-[430px] rounded-t-3xl p-5 pb-8 animate-fade-in-up ${isDark ? 'bg-[#1a2230]' : 'bg-white'}`}>
            <div className="flex items-center justify-between mb-5">
              <span className={`text-lg font-bold ${isDark ? 'text-white' : 'text-slate-800'}`}>编辑资料</span>
              <button onClick={() => setEditing(false)} className={`w-9 h-9 rounded-full flex items-center justify-center ${isDark ? 'bg-slate-700/60 text-slate-300' : 'bg-slate-100 text-slate-500'}`}>
                <X className="w-5 h-5" />
              </button>
            </div>

            {/* 头像上传 */}
            <div className="flex flex-col items-center mb-5">
              <label className="relative cursor-pointer active:scale-95 transition-transform">
                {draftAvatar ? (
                  <img src={draftAvatar} alt="头像" className="w-20 h-20 rounded-3xl object-cover" />
                ) : (
                  <div className={`w-20 h-20 rounded-3xl flex items-center justify-center text-3xl font-black ${isDark ? 'bg-teal-500/20 text-teal-300' : 'bg-teal-100 text-teal-700'}`}>
                    {(draftName || '张').charAt(0)}
                  </div>
                )}
                <div className="absolute -bottom-1 -right-1 w-7 h-7 rounded-full bg-teal-500 flex items-center justify-center border-2 border-white dark:border-[#1a2230]">
                  <Camera className="w-4 h-4 text-white" />
                </div>
                <input type="file" accept="image/*" className="hidden" onChange={handleAvatarPick} />
              </label>
              <span className={`text-xs mt-2 ${isDark ? 'text-slate-500' : 'text-slate-400'}`}>点头像换照片</span>
            </div>

            {/* 姓名 */}
            <label className={`block text-sm font-semibold mb-1.5 ${isDark ? 'text-slate-300' : 'text-slate-600'}`}>名字</label>
            <input
              type="text"
              value={draftName}
              onChange={(e) => setDraftName(e.target.value)}
              maxLength={12}
              placeholder="怎么称呼你"
              className={`w-full px-4 py-3 rounded-2xl text-base mb-4 outline-none ${
                isDark ? 'bg-slate-700/50 text-white placeholder:text-slate-500 focus:bg-slate-700' : 'bg-slate-100 text-slate-800 placeholder:text-slate-400 focus:bg-slate-50'
              }`}
            />

            {/* 自我介绍 */}
            <label className={`block text-sm font-semibold mb-1.5 ${isDark ? 'text-slate-300' : 'text-slate-600'}`}>说句话介绍下自己</label>
            <textarea
              value={draftBio}
              onChange={(e) => setDraftBio(e.target.value)}
              maxLength={40}
              rows={2}
              placeholder="比如：跑了8年港口，安全第一"
              className={`w-full px-4 py-3 rounded-2xl text-base resize-none outline-none ${
                isDark ? 'bg-slate-700/50 text-white placeholder:text-slate-500 focus:bg-slate-700' : 'bg-slate-100 text-slate-800 placeholder:text-slate-400 focus:bg-slate-50'
              }`}
            />
            <p className={`text-xs text-right mt-1 mb-5 ${isDark ? 'text-slate-500' : 'text-slate-400'}`}>{draftBio.length}/40</p>

            {/* 保存按钮 */}
            <button
              onClick={saveEdit}
              className="w-full py-3.5 rounded-2xl bg-gradient-to-r from-teal-500 to-cyan-500 text-white text-base font-bold active:scale-[0.98] transition-transform"
            >
              保存
            </button>
          </div>
        </div>
      )}

      {/* 兑换确认弹窗 */}
      {selectedReward && (
        <div className="fixed inset-0 z-[60] flex items-center justify-center px-8">
          <div className="absolute inset-0 bg-black/50 backdrop-blur-sm" onClick={() => setSelectedReward(null)} />
          <div className={`relative w-full max-w-[320px] rounded-3xl p-6 ${isDark ? 'bg-[#1a2230]' : 'bg-white'}`}>
            <div className={`w-14 h-14 rounded-2xl mx-auto mb-3 flex items-center justify-center ${isDark ? 'bg-amber-500/20' : 'bg-amber-100'}`}>
              <Gift className={`w-7 h-7 ${isDark ? 'text-amber-400' : 'text-amber-500'}`} />
            </div>
            <p className={`text-lg font-bold text-center ${isDark ? 'text-white' : 'text-slate-800'}`}>{selectedReward.name}</p>
            <p className="text-center text-amber-400 font-semibold mt-1">{selectedReward.cost} 积分</p>
            <p className={`text-sm text-center mt-3 mb-5 ${isDark ? 'text-slate-400' : 'text-slate-500'}`}>
              {selectedReward.enough
                ? '确认兑换吗？兑换后凭车队公告领取。'
                : `积分还差 ${selectedReward.cost - d.points.total} 分，再攒攒就能换了。`}
            </p>
            <div className="flex gap-3">
              <button
                onClick={() => setSelectedReward(null)}
                className={`flex-1 py-3 rounded-2xl text-base font-semibold ${isDark ? 'bg-slate-700/60 text-slate-300' : 'bg-slate-100 text-slate-600'}`}
              >
                {selectedReward.enough ? '再想想' : '知道了'}
              </button>
              {selectedReward.enough && (
                <button
                  onClick={() => setSelectedReward(null)}
                  className="flex-1 py-3 rounded-2xl text-base font-bold bg-gradient-to-r from-teal-500 to-cyan-500 text-white active:scale-[0.98] transition-transform"
                >
                  确认兑换
                </button>
              )}
            </div>
          </div>
        </div>
      )}

      {/* 勋章详情弹窗 */}
      {selectedMedal && (
        <div className="fixed inset-0 z-[60] flex items-center justify-center px-8">
          <div className="absolute inset-0 bg-black/50 backdrop-blur-sm" onClick={() => setSelectedMedal(null)} />
          <div className={`relative w-full max-w-[300px] rounded-3xl p-6 text-center ${isDark ? 'bg-[#1a2230]' : 'bg-white'}`}>
            <div className={`w-20 h-20 rounded-full mx-auto mb-4 flex items-center justify-center ${
              selectedMedal.got
                ? (isDark ? 'bg-amber-500/20' : 'bg-amber-100')
                : (isDark ? 'bg-slate-700' : 'bg-slate-200')
            }`}>
              {selectedMedal.got
                ? <Medal className={`w-10 h-10 ${isDark ? 'text-amber-400' : 'text-amber-500'}`} />
                : <Lock className={`w-9 h-9 ${isDark ? 'text-slate-500' : 'text-slate-400'}`} />}
            </div>
            <p className={`text-xl font-bold ${isDark ? 'text-white' : 'text-slate-800'}`}>{selectedMedal.name}</p>
            <p className={`text-sm mt-2 ${isDark ? 'text-slate-400' : 'text-slate-500'}`}>{selectedMedal.desc}</p>
            <p className={`text-sm mt-3 font-semibold ${selectedMedal.got ? 'text-emerald-400' : (isDark ? 'text-slate-500' : 'text-slate-400')}`}>
              {selectedMedal.got ? '✓ 已获得' : '还没解锁，继续加油'}
            </p>
            <button
              onClick={() => setSelectedMedal(null)}
              className={`w-full mt-5 py-3 rounded-2xl text-base font-bold ${isDark ? 'bg-slate-700/60 text-slate-200' : 'bg-slate-100 text-slate-700'}`}
            >
              知道了
            </button>
          </div>
        </div>
      )}

      <BottomNav isDark={isDark} />
    </div>
  )
}

function Section({ children, isDark, mounted, delay }: { children: React.ReactNode; isDark: boolean; mounted: boolean; delay: number }) {
  return (
    <div
      className={`mb-4 rounded-3xl p-5 transition-all duration-500 ${
        mounted ? 'opacity-100 translate-y-0' : 'opacity-0 translate-y-4'
      } ${isDark ? 'bg-slate-800/50 border border-slate-700/50' : 'bg-white border border-slate-200 shadow-sm'}`}
      style={{ transitionDelay: `${delay}ms` }}
    >
      {children}
    </div>
  )
}

function RewardIcon({ name, isDark }: { name: string; isDark: boolean }) {
  const cls = `w-7 h-7 ${isDark ? 'text-teal-400' : 'text-teal-600'}`
  if (name === 'rest') return <Moon className={cls} />
  if (name === 'shift') return <Clock className={cls} />
  if (name === 'money') return <Coins className={cls} />
  return <Shield className={cls} />
}

function ChallengeIcon({ name, done, isDark }: { name: string; done: boolean; isDark: boolean }) {
  const cls = `w-5 h-5 ${done ? (isDark ? 'text-emerald-400' : 'text-emerald-600') : (isDark ? 'text-slate-300' : 'text-slate-500')}`
  if (name === 'moon') return <Moon className={cls} />
  if (name === 'walk') return <Footprints className={cls} />
  if (name === 'clock') return <Clock className={cls} />
  return <RingGlyph className={cls} />
}

function MedalIcon({ name, isDark }: { name: string; isDark: boolean }) {
  const cls = `w-6 h-6 ${isDark ? 'text-amber-400' : 'text-amber-500'}`
  if (name === 'flame') return <Flame className={cls} />
  if (name === 'moon') return <Moon className={cls} />
  if (name === 'walk') return <Footprints className={cls} />
  if (name === 'crown') return <Crown className={cls} />
  if (name === 'shield') return <Shield className={cls} />
  return <Trophy className={cls} />
}

function RingGlyph({ className }: { className?: string }) {
  return <svg className={className} viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2"><circle cx="12" cy="12" r="8" /><circle cx="12" cy="12" r="4" /></svg>
}

// ===== 底部导航 =====
function BottomNav({ isDark }: { isDark: boolean }) {
  const [activeTab, setActiveTab] = useState('mine')

  const handleNavClick = (tab: string) => {
    setActiveTab(tab)
    if (tab === 'home') {
      window.location.hash = '#'
    } else if (tab === 'health') {
      window.location.hash = '#health'
    } else if (tab === 'settings') {
      window.location.hash = '#settings'
    } else if (tab === 'ask') {
      window.location.hash = '#ask'
    }
  }

  return (
    <div className="fixed bottom-0 inset-x-0 z-50" style={{ paddingBottom: 'env(safe-area-inset-bottom, 0px)' }}>
      <div className={`max-w-[430px] mx-auto ${isDark ? 'bg-[#121721]' : 'bg-white'} border-t ${isDark ? 'border-slate-800' : 'border-slate-200'}`}>
        <div className="flex items-center justify-between px-6 py-3">
          <NavItem icon={<HomeIcon />} label="首页" active={activeTab === 'home'} onClick={() => handleNavClick('home')} isDark={isDark} />
          <NavItem icon={<ChartIcon />} label="健康" active={activeTab === 'health'} onClick={() => handleNavClick('health')} isDark={isDark} />
          <button onClick={() => handleNavClick('ask')} className={`relative -mt-8 w-16 h-16 rounded-full bg-gradient-to-br from-teal-400 via-teal-500 to-cyan-600 flex items-center justify-center shadow-lg shadow-teal-500/40 transition-all duration-200 active:scale-90 ${activeTab === 'ask' ? 'ring-4 ring-teal-400/30' : ''}`}>
            <div className="absolute inset-0 rounded-full bg-gradient-to-br from-white/20 to-transparent" />
            <div className="absolute top-1 right-2 w-2 h-2 rounded-full bg-white/60 animate-pulse" />
            <Zap className="w-7 h-7 text-white relative z-10" />
          </button>
          <NavItem icon={<UserIcon />} label="我的" active={activeTab === 'mine'} onClick={() => handleNavClick('mine')} isDark={isDark} />
          <NavItem icon={<SettingsGlyph />} label="设置" active={activeTab === 'settings'} onClick={() => handleNavClick('settings')} isDark={isDark} />
        </div>
      </div>
      <div className={`${isDark ? 'bg-[#121721]' : 'bg-white'}`} style={{ height: 'env(safe-area-inset-bottom, 0px)' }} />
    </div>
  )
}

function NavItem({ icon, label, active, onClick, isDark }: { icon: React.ReactNode; label: string; active: boolean; onClick: () => void; isDark: boolean }) {
  return (
    <button onClick={onClick} className={`flex flex-col items-center gap-1 px-3 py-1 transition-all duration-150 active:scale-90 ${active ? (isDark ? 'text-teal-400' : 'text-teal-600') : (isDark ? 'text-slate-500' : 'text-slate-400')}`}>
      <span className="h-5 w-5">{icon}</span>
      <span className="text-xs font-medium">{label}</span>
    </button>
  )
}

function HomeIcon() {
  return <svg className="h-5 w-5" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><path d="M3 9l9-7 9 7v11a2 2 0 0 1-2 2H5a2 2 0 0 1-2-2z" /><polyline points="9 22 9 12 15 12 15 22" /></svg>
}
function ChartIcon() {
  return <svg className="h-5 w-5" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><line x1="18" y1="20" x2="18" y2="10" /><line x1="12" y1="20" x2="12" y2="4" /><line x1="6" y1="20" x2="6" y2="14" /></svg>
}
function UserIcon() {
  return <svg className="h-5 w-5" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><path d="M20 21v-2a4 4 0 0 0-4-4H8a4 4 0 0 0-4 4v2" /><circle cx="12" cy="7" r="4" /></svg>
}
function SettingsGlyph() {
  return <svg className="h-5 w-5" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><circle cx="12" cy="12" r="3" /><path d="M19.4 15a1.65 1.65 0 0 0 .33 1.82l.06.06a2 2 0 0 1 0 2.83 2 2 0 0 1-2.83 0l-.06-.06a1.65 1.65 0 0 0-1.82-.33 1.65 1.65 0 0 0-1 1.51V21a2 2 0 0 1-2 2 2 2 0 0 1-2-2v-.09A1.65 1.65 0 0 0 9 19.4a1.65 1.65 0 0 0-1.82.33l-.06.06a2 2 0 0 1-2.83 0 2 2 0 0 1 0-2.83l.06-.06a1.65 1.65 0 0 0 .33-1.82 1.65 1.65 0 0 0-1.51-1H3a2 2 0 0 1-2-2 2 2 0 0 1 2-2h.09A1.65 1.65 0 0 0 4.6 9a1.65 1.65 0 0 0-.33-1.82l-.06-.06a2 2 0 0 1 0-2.83 2 2 0 0 1 2.83 0l.06.06a1.65 1.65 0 0 0 1.82.33H9a1.65 1.65 0 0 0 1-1.51V3a2 2 0 0 1 2-2 2 2 0 0 1 2 2v.09a1.65 1.65 0 0 0 1 1.51 1.65 1.65 0 0 0 1.82-.33l.06-.06a2 2 0 0 1 2.83 0 2 2 0 0 1 0 2.83l-.06.06a1.65 1.65 0 0 0-.33 1.82V9a1.65 1.65 0 0 0 1.51 1H21a2 2 0 0 1 2 2 2 2 0 0 1-2 2h-.09a1.65 1.65 0 0 0-1.51 1z" /></svg>
}
