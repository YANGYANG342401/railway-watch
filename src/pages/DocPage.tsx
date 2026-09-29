import { useState } from 'react'
import { ChevronLeft } from 'lucide-react'
import '../index.css'

type DocContent = { title: string; sections: { h?: string; p: string }[] }

const docs: Record<string, DocContent> = {
  'doc-data': {
    title: '数据怎么用的',
    sections: [
      { p: '我们知道，把身体数据交出去，你会有担忧。所以这里把数据怎么收、怎么用、谁能看，全说清楚。' },
      { h: '收集什么', p: '指环只采集和健康、安全有关的生理数据：心率、血氧、体温、睡眠、活动量。不录音、不定位你的生活轨迹。' },
      { h: '用来干什么', p: '一是给你自己看健康情况、提供健康建议；二是危险时（如心率持续异常）及时预警，保护你的安全。' },
      { h: '谁能看到', p: '公司只能看到在岗状态、佩戴合规率、风险等级这些最少信息。具体数值、睡眠、聊天内容只有你自己能看。' },
      { h: '绝不做什么', p: '数据不会用于解雇、降薪、绩效考核，不会卖给第三方（比如保险公司）。这一条写进了用工协议。' },
      { h: '下班后', p: '下班和休息时间的数据，公司看不到在岗相关内容，只有你自己用来管理健康。' },
    ],
  },
  'doc-agreement': {
    title: '用户协议',
    sections: [
      { p: '本协议是你与北仑港智能指环服务之间的约定。使用本 App 即表示你已阅读并同意以下条款。' },
      { h: '一、服务内容', p: '本 App 为智能指环的配套软件，提供健康数据查看、健康建议、工时记录、AI 健康咨询等功能。' },
      { h: '二、账号使用', p: '你应妥善保管账号，因个人原因泄露账号导致的损失由本人承担。' },
      { h: '三、健康建议说明', p: 'App 内的健康建议、AI 问答仅供参考，不构成医疗诊断。如有不适，请及时就医。' },
      { h: '四、数据与隐私', p: '我们按《隐私政策》收集和使用你的数据，保护你的合法权益。' },
      { h: '五、协议变更', p: '协议如有更新，会在 App 内通知你。继续使用即视为接受更新后的协议。' },
    ],
  },
  'doc-privacy': {
    title: '隐私政策',
    sections: [
      { p: '我们非常重视你的隐私。本政策说明我们如何收集、使用、存储和保护你的个人信息。' },
      { h: '一、收集的信息', p: '包括生理数据（心率、血氧、体温、睡眠、活动量）、设备信息、佩戴记录。' },
      { h: '二、使用目的', p: '用于健康管理、安全预警、工时记录及改善服务。不用于与上述无关的用途。' },
      { h: '三、信息共享', p: '除安全预警等必要场景外，未经你同意，不向第三方提供你的个人健康数据。绝不向保险公司等出售数据。' },
      { h: '四、信息保护', p: '采用加密传输和存储，严格控制访问权限，防止数据泄露。' },
      { h: '五、你的权利', p: '你有权查看、导出自己的数据，有权关闭排行等可选功能，有权注销账号。' },
    ],
  },
  'doc-about': {
    title: '关于',
    sections: [
      { p: '北仑港智能指环 · 司机健康伙伴' },
      { h: '版本', p: 'v1.0.0' },
      { h: '我们想做的事', p: '不是为了盯着你，而是想在你日夜奔波时，多一个看着你身体的伙伴。开车在外，安全和健康最重要。' },
      { h: '更新日志', p: 'v1.0.0：首页健康概览、健康趋势、AI 健康助手、积分挑战、工时记录等功能上线。' },
    ],
  },
}

export function DocPage({ docKey }: { docKey: string }) {
  const [isDark] = useState(true)
  const doc = docs[docKey] || docs['doc-about']

  return (
    <div className={`min-h-screen ${isDark ? 'bg-[#121721]' : 'bg-[#f3efe7]'}`}>
      <div className="max-w-[430px] mx-auto">
        <SubHeader title={doc.title} isDark={isDark} />
        <div className="px-5 py-5 pb-10 space-y-4">
          {doc.sections.map((s, i) => (
            <div key={i}>
              {s.h && <p className={`text-base font-bold mb-1.5 ${isDark ? 'text-white' : 'text-slate-800'}`}>{s.h}</p>}
              <p className={`text-base leading-relaxed ${isDark ? 'text-slate-300' : 'text-slate-600'}`}>{s.p}</p>
            </div>
          ))}
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
