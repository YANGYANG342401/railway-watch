import { useState, useEffect, useRef } from 'react'
import {
  Sun,
  MoonStar,
  ChevronLeft,
  Mic,
  Send,
  Sparkles,
  ShieldCheck,
  Moon,
  Activity,
  HeartPulse,
  FileText,
  Coffee,
  Bed,
} from 'lucide-react'
import '../index.css'
import { scriptedReplies, openingMessage, quickQuestions, type ScriptedReply } from '../data/askScript'

type Bubble = {
  id: number
  role: 'ai' | 'user'
  text: string
  // AI 气泡可带的后续追问选项
  followups?: { label: string; topic: string }[]
  // AI 气泡可带的小贴士/免责
  note?: string
}

let bubbleSeq = 100

export function AskPage() {
  const [isDark, setIsDark] = useState(true)
  const [bubbles, setBubbles] = useState<Bubble[]>([])
  const [input, setInput] = useState('')
  const [typing, setTyping] = useState(false)
  const [thinkingStage, setThinkingStage] = useState(0)
  const [listening, setListening] = useState(false)
  const scrollRef = useRef<HTMLDivElement>(null)
  const pendingTimers = useRef<ReturnType<typeof setTimeout>[]>([])

  // 进页面：AI 先开口
  useEffect(() => {
    const opening: Bubble = {
      id: bubbleSeq++,
      role: 'ai',
      text: openingMessage.text,
      followups: openingMessage.followups,
    }
    setBubbles([opening])
  }, [])

  // 自动滚到底
  useEffect(() => {
    scrollRef.current?.scrollTo({ top: scrollRef.current.scrollHeight, behavior: 'smooth' })
  }, [bubbles, typing])

  const pushUser = (text: string) => {
    setBubbles((prev) => [...prev, { id: bubbleSeq++, role: 'user', text }])
  }

  const pushAiReply = (reply: ScriptedReply) => {
    setTyping(true)
    setThinkingStage(0)
    // 模拟 AI 思考检索：先"正在思考"，再"正在查询资料"，最后给出回答
    const t1 = setTimeout(() => setThinkingStage(1), 900)
    // 总时长 1.6~2.8 秒随机，更接近真实大模型的检索时间
    const total = 1600 + Math.random() * 1200
    const t2 = setTimeout(() => {
      setTyping(false)
      setThinkingStage(0)
      setBubbles((prev) => [
        ...prev,
        {
          id: bubbleSeq++,
          role: 'ai',
          text: reply.text,
          followups: reply.followups,
          note: reply.note,
        },
      ])
    }, total)
    pendingTimers.current = [t1, t2]
  }

  // 根据 topic 或自由文本回应
  const respondTo = (topic: string | null, userText: string) => {
    const reply =
      (topic && scriptedReplies[topic]) ||
      scriptedReplies[matchTopic(userText)] ||
      scriptedReplies['_fallback']
    pushAiReply(reply)
  }

  const handleQuick = (q: { label: string; topic: string }) => {
    pushUser(q.label)
    respondTo(q.topic, q.label)
  }

  const handleSend = () => {
    const text = input.trim()
    if (!text) return
    setInput('')
    pushUser(text)
    respondTo(null, text)
  }

  const handleVoice = () => {
    setListening(true)
  }

  // 完成录音，模拟识别出文字
  const finishVoice = () => {
    if (!listening) return
    setListening(false)
    const demoText = '我最近开车老是犯困'
    pushUser(demoText)
    respondTo('drowsy', demoText)
  }

  const cancelVoice = () => {
    setListening(false)
  }

  return (
    <div className={`min-h-screen flex flex-col transition-colors duration-500 ${isDark ? 'bg-[#121721]' : 'bg-[#f3efe7]'}`}>
      <div className="max-w-[430px] w-full mx-auto flex flex-col flex-1 relative">

        {/* 顶部栏 */}
        <header className={`sticky top-0 z-20 flex items-center gap-3 px-4 py-3 backdrop-blur-xl ${isDark ? 'bg-[#121721]/90 border-b border-slate-800' : 'bg-[#f3efe7]/90 border-b border-slate-200'}`}>
          <button
            onClick={() => { window.location.hash = '#' }}
            className={`w-9 h-9 rounded-full flex items-center justify-center active:scale-90 transition-transform ${isDark ? 'bg-slate-800 text-slate-300' : 'bg-white text-slate-600 shadow-sm'}`}
          >
            <ChevronLeft className="w-5 h-5" />
          </button>

          <div className="flex items-center gap-2.5 flex-1">
            <div className="relative w-9 h-9 rounded-full bg-gradient-to-br from-teal-400 to-cyan-500 flex items-center justify-center">
              <Sparkles className="w-5 h-5 text-white" />
              <span className="absolute -bottom-0.5 -right-0.5 w-3 h-3 rounded-full bg-emerald-400 border-2 border-[#121721]" />
            </div>
            <div>
              <p className={`text-base font-bold leading-tight ${isDark ? 'text-white' : 'text-slate-800'}`}>健康助手</p>
              <p className={`text-xs ${isDark ? 'text-slate-500' : 'text-slate-400'}`}>在线 · 懂你的身体数据</p>
            </div>
          </div>

          <button
            onClick={() => setIsDark(!isDark)}
            className={`w-9 h-9 rounded-full flex items-center justify-center active:scale-90 transition-transform ${isDark ? 'bg-slate-800 text-amber-400' : 'bg-white text-slate-600 shadow-sm'}`}
          >
            {isDark ? <Sun className="w-4 h-4" /> : <MoonStar className="w-4 h-4" />}
          </button>
        </header>

        {/* 隐私提示条 */}
        <div className={`flex items-center gap-2 px-4 py-2 ${isDark ? 'bg-teal-500/10' : 'bg-teal-50'}`}>
          <ShieldCheck className={`w-4 h-4 flex-shrink-0 ${isDark ? 'text-teal-400' : 'text-teal-600'}`} />
          <p className={`text-xs ${isDark ? 'text-teal-200/80' : 'text-teal-700'}`}>
            你和我说的话，公司看不到，放心说
          </p>
        </div>

        {/* 对话区 */}
        <div ref={scrollRef} className="flex-1 overflow-y-auto px-4 py-4 space-y-4">
          {bubbles.map((b) => (
            <BubbleView key={b.id} bubble={b} isDark={isDark} onFollowup={handleQuick} />
          ))}

          {/* 正在输入 */}
          {typing && <TypingBubble isDark={isDark} stage={thinkingStage} />}

          {/* 首轮快捷问题（只在仅有开场白时显示在底部） */}
          {bubbles.length === 1 && !typing && (
            <div className="pt-2">
              <p className={`text-xs mb-2.5 ${isDark ? 'text-slate-500' : 'text-slate-400'}`}>大家常问</p>
              <div className="flex flex-wrap gap-2">
                {quickQuestions.map((q) => (
                  <button
                    key={q.topic}
                    onClick={() => handleQuick(q)}
                    className={`flex items-center gap-1.5 px-3.5 py-2 rounded-full text-sm transition-all active:scale-95 ${
                      isDark ? 'bg-slate-800 border border-slate-700 text-slate-200' : 'bg-white border border-slate-200 text-slate-700 shadow-sm'
                    }`}
                  >
                    <QuickIcon name={q.icon} isDark={isDark} />
                    {q.label}
                  </button>
                ))}
              </div>
            </div>
          )}
        </div>

        {/* 底部输入区 */}
        <div className={`sticky bottom-0 px-3 pt-2 pb-[calc(env(safe-area-inset-bottom,0px)+10px)] ${isDark ? 'bg-[#121721] border-t border-slate-800' : 'bg-[#f3efe7] border-t border-slate-200'}`}>
          <div className="flex items-end gap-2">
            <button
              onClick={handleVoice}
              className={`w-11 h-11 rounded-full flex items-center justify-center flex-shrink-0 transition-all active:scale-90 ${
                listening
                  ? 'bg-red-500 text-white animate-pulse'
                  : (isDark ? 'bg-slate-800 text-teal-400' : 'bg-white text-teal-600 shadow-sm')
              }`}
            >
              <Mic className="w-5 h-5" />
            </button>

            <div className={`flex-1 flex items-center rounded-3xl px-4 ${isDark ? 'bg-slate-800' : 'bg-white shadow-sm'}`}>
              <input
                value={input}
                onChange={(e) => setInput(e.target.value)}
                onKeyDown={(e) => { if (e.key === 'Enter') handleSend() }}
                placeholder={listening ? '正在听…' : '哪里不舒服，问问我'}
                className={`flex-1 bg-transparent py-3 text-base outline-none ${isDark ? 'text-white placeholder:text-slate-500' : 'text-slate-800 placeholder:text-slate-400'}`}
              />
            </div>

            <button
              onClick={handleSend}
              disabled={!input.trim()}
              className={`w-11 h-11 rounded-full flex items-center justify-center flex-shrink-0 transition-all active:scale-90 ${
                input.trim()
                  ? 'bg-gradient-to-br from-teal-400 to-cyan-500 text-white'
                  : (isDark ? 'bg-slate-800 text-slate-600' : 'bg-slate-200 text-slate-400')
              }`}
            >
              <Send className="w-5 h-5" />
            </button>
          </div>
          <p className={`text-center text-[11px] mt-2 ${isDark ? 'text-slate-600' : 'text-slate-400'}`}>
            建议仅供参考，真不舒服还是要找医生看看
          </p>
        </div>

        {/* 语音输入浮层 */}
        {listening && (
          <div className="fixed inset-0 z-50 flex items-end justify-center">
            {/* 遮罩 */}
            <div className="absolute inset-0 bg-black/40 backdrop-blur-sm" onClick={cancelVoice} />
            {/* 弹窗 */}
            <div className={`relative w-full max-w-[430px] rounded-t-3xl px-6 pt-7 pb-[calc(env(safe-area-inset-bottom,0px)+24px)] voice-sheet-in ${isDark ? 'bg-[#1a2230]' : 'bg-white'}`}>
              {/* 声波动效 */}
              <div className="flex flex-col items-center">
                <div className="relative w-24 h-24 flex items-center justify-center mb-5">
                  {/* 外圈扩散波 */}
                  <span className="absolute inset-0 rounded-full bg-teal-500/20 voice-ripple" />
                  <span className="absolute inset-0 rounded-full bg-teal-500/20 voice-ripple" style={{ animationDelay: '0.6s' }} />
                  {/* 中心话筒 */}
                  <div className="relative w-16 h-16 rounded-full bg-gradient-to-br from-teal-400 to-cyan-500 flex items-center justify-center">
                    <Mic className="w-7 h-7 text-white" />
                  </div>
                </div>

                {/* 跳动声波条 */}
                <div className="flex items-end gap-1 h-6 mb-3">
                  {[0, 1, 2, 3, 4, 5, 6].map((i) => (
                    <span
                      key={i}
                      className="w-1 rounded-full bg-teal-400 voice-bar"
                      style={{ animationDelay: `${i * 0.12}s` }}
                    />
                  ))}
                </div>

                <p className={`text-lg font-bold mb-1 ${isDark ? 'text-white' : 'text-slate-800'}`}>我在听…</p>
                <p className={`text-sm mb-6 ${isDark ? 'text-slate-400' : 'text-slate-500'}`}>对着手机说，说完点完成</p>

                {/* 操作按钮 */}
                <div className="flex items-center gap-4 w-full">
                  <button
                    onClick={cancelVoice}
                    className={`flex-1 py-3 rounded-2xl text-base font-semibold ${isDark ? 'bg-slate-700/60 text-slate-300' : 'bg-slate-100 text-slate-600'}`}
                  >
                    取消
                  </button>
                  <button
                    onClick={finishVoice}
                    className="flex-1 py-3 rounded-2xl text-base font-bold bg-gradient-to-r from-teal-500 to-cyan-500 text-white active:scale-[0.98] transition-transform"
                  >
                    完成
                  </button>
                </div>
              </div>
            </div>
          </div>
        )}
      </div>
    </div>
  )
}

// ===== 气泡组件 =====
function BubbleView({ bubble, isDark, onFollowup }: { bubble: Bubble; isDark: boolean; onFollowup: (q: { label: string; topic: string }) => void }) {
  if (bubble.role === 'user') {
    return (
      <div className="flex justify-end">
        <div className="max-w-[80%] rounded-3xl rounded-tr-lg px-4 py-3 bg-gradient-to-br from-teal-500 to-cyan-500 text-white">
          <p className="text-base leading-relaxed whitespace-pre-line">{bubble.text}</p>
        </div>
      </div>
    )
  }

  return (
    <div className="flex gap-2.5">
      <div className="w-8 h-8 rounded-full bg-gradient-to-br from-teal-400 to-cyan-500 flex items-center justify-center flex-shrink-0 mt-0.5">
        <Sparkles className="w-4 h-4 text-white" />
      </div>
      <div className="max-w-[85%] space-y-2">
        <div className={`rounded-3xl rounded-tl-lg px-4 py-3 ${isDark ? 'bg-slate-800 text-slate-100' : 'bg-white text-slate-800 shadow-sm'}`}>
          <p className="text-base leading-relaxed whitespace-pre-line">{bubble.text}</p>
          {bubble.note && (
            <p className={`text-xs mt-2 pt-2 border-t ${isDark ? 'border-slate-700 text-slate-400' : 'border-slate-100 text-slate-400'}`}>
              {bubble.note}
            </p>
          )}
        </div>

        {/* 追问选项 */}
        {bubble.followups && bubble.followups.length > 0 && (
          <div className="flex flex-wrap gap-2">
            {bubble.followups.map((f, i) => (
              <button
                key={i}
                onClick={() => onFollowup(f)}
                className={`px-3.5 py-2 rounded-full text-sm transition-all active:scale-95 ${
                  isDark ? 'bg-teal-500/15 text-teal-300 border border-teal-500/25' : 'bg-teal-50 text-teal-700 border border-teal-200'
                }`}
              >
                {f.label}
              </button>
            ))}
          </div>
        )}
      </div>
    </div>
  )
}

function TypingBubble({ isDark, stage }: { isDark: boolean; stage: number }) {
  const label = stage === 0 ? '正在思考…' : '正在帮你查资料…'
  return (
    <div className="flex gap-2.5">
      <div className="w-8 h-8 rounded-full bg-gradient-to-br from-teal-400 to-cyan-500 flex items-center justify-center flex-shrink-0">
        <Sparkles className="w-4 h-4 text-white" />
      </div>
      <div className={`rounded-3xl rounded-tl-lg px-4 py-3 flex items-center gap-2.5 ${isDark ? 'bg-slate-800' : 'bg-white shadow-sm'}`}>
        <div className="flex gap-1.5">
          <span className="w-2 h-2 rounded-full bg-teal-400 animate-bounce" style={{ animationDelay: '0ms' }} />
          <span className="w-2 h-2 rounded-full bg-teal-400 animate-bounce" style={{ animationDelay: '150ms' }} />
          <span className="w-2 h-2 rounded-full bg-teal-400 animate-bounce" style={{ animationDelay: '300ms' }} />
        </div>
        <span className={`text-sm transition-opacity duration-300 ${isDark ? 'text-slate-400' : 'text-slate-500'}`}>{label}</span>
      </div>
    </div>
  )
}

function QuickIcon({ name, isDark }: { name: string; isDark: boolean }) {
  const cls = `w-4 h-4 ${isDark ? 'text-teal-400' : 'text-teal-600'}`
  if (name === 'drowsy') return <Coffee className={cls} />
  if (name === 'sleep') return <Bed className={cls} />
  if (name === 'back') return <Activity className={cls} />
  if (name === 'report') return <FileText className={cls} />
  if (name === 'heart') return <HeartPulse className={cls} />
  return <Moon className={cls} />
}

// 自由文本的关键词匹配（demo 用简单匹配）
function matchTopic(text: string): string {
  if (/困|瞌睡|累|疲劳|打盹/.test(text)) return 'drowsy'
  if (/睡|失眠|夜班|睡不着/.test(text)) return 'sleep'
  if (/腰|背|脖|肩|颈/.test(text)) return 'back'
  if (/体检|报告|单子|指标|血脂|脂肪肝/.test(text)) return 'report'
  if (/心|血压|血氧|头晕/.test(text)) return 'heart'
  if (/胃|反酸|吃|饭/.test(text)) return 'stomach'
  return '_fallback'
}
