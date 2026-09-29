// AI 问诊 demo 脚本数据
// 注：真实产品由 med-go 医疗大模型 + 指环数据动态生成，此处为 demo 模拟

export type ScriptedReply = {
  text: string
  note?: string
  followups?: { label: string; topic: string }[]
}

// 进入页面，AI 主动开口（结合数据搭话）
export const openingMessage = {
  text: '张师傅，今天感觉怎么样？\n我看你这周有三天没睡够6小时，昨晚睡了6个半小时，好一点了。\n长期睡不够，开车容易犯困，这个得当回事。有什么不舒服的，随时跟我说。',
  followups: [
    { label: '我最近老犯困', topic: 'drowsy' },
    { label: '怎么样能睡好', topic: 'sleep' },
    { label: '我没事，挺好', topic: 'fine' },
  ],
}

// 底部快捷问题
export const quickQuestions = [
  { label: '开车犯困', topic: 'drowsy', icon: 'drowsy' },
  { label: '睡不好', topic: 'sleep', icon: 'sleep' },
  { label: '腰酸背疼', topic: 'back', icon: 'back' },
  { label: '看体检单', topic: 'report', icon: 'report' },
  { label: '血压问题', topic: 'heart', icon: 'heart' },
  { label: '胃不舒服', topic: 'stomach', icon: 'sleep' },
]

// 各话题的回答 + 追问
export const scriptedReplies: Record<string, ScriptedReply> = {
  // 犯困
  drowsy: {
    text: '嗯，这跟你睡眠不够有关系。开车犯困太危险了，给你几个管用的办法：\n\n1. 犯困别硬扛，找个服务区停车眯15分钟，比什么都强\n2. 嚼点口香糖、薄荷糖，开窗凉快一下\n3. 别指望抽烟提神，那其实是错觉\n\n你最近一周平均才睡5个多小时，这是犯困的主要原因。要不要我帮你看看睡眠数据，找找原因？',
    followups: [
      { label: '帮我看看睡眠', topic: 'sleep_data' },
      { label: '夜班怎么调', topic: 'sleep' },
      { label: '知道了，谢谢', topic: 'thanks' },
    ],
  },

  sleep_data: {
    text: '我看了一下你这周的睡眠：\n· 入睡时间不固定，最晚到凌晨1点多\n· 深睡偏少，平均每晚才1.5小时（正常要2小时以上）\n· 有两晚中间醒了好几次\n\n简单说就是睡得晚、睡得浅。建议先从固定上床时间开始，哪怕睡前躺着不玩手机也行。要不要我每天提醒你一下该睡了？',
    followups: [
      { label: '好，提醒我', topic: 'set_remind' },
      { label: '深睡怎么变多', topic: 'deep_sleep' },
    ],
  },

  deep_sleep: {
    text: '想让深睡多一点，几个实在的办法：\n\n1. 睡前一小时别看手机，蓝光会让大脑以为还是白天\n2. 晚饭别吃太晚、太饱，睡前别喝浓茶和酒\n3. 房间弄暗一点、凉一点，人在偏凉的环境睡得沉\n4. 白天就算累，也别睡超过半小时，不然晚上更难睡\n\n你坚持一周试试，我帮你留意深睡的变化。',
    note: '建议仅供参考，长期睡眠差建议去医院睡眠科看看。',
    followups: [
      { label: '帮我留意', topic: 'set_remind' },
    ],
  },

  // 睡眠 / 夜班
  sleep: {
    text: '夜班最熬人的就是睡眠。给你几个实在的办法：\n\n1. 白天睡觉拉好遮光帘、戴个眼罩，把房间弄暗，身体才会以为是晚上\n2. 下班别马上玩手机，蓝光会让你更睡不着\n3. 睡前别喝浓茶、咖啡\n\n你要是连着上夜班，我可以帮你排个"补觉时间表"，要不要？',
    followups: [
      { label: '帮我排补觉表', topic: 'set_remind' },
      { label: '睡不沉怎么办', topic: 'deep_sleep' },
    ],
  },

  // 腰背
  back: {
    text: '腰一坐久就酸，开车这行太常见了，多半是久坐引起的，肌肉长时间一个姿势就僵了。\n\n教你两个办法：\n1. 等货的时候下车走两圈，活动活动腰\n2. 开车时腰后面垫个靠垫，别让腰悬空\n\n想问一下，你的疼是哪种？',
    followups: [
      { label: '就是酸，休息会儿就好', topic: 'back_mild' },
      { label: '疼，还有点麻', topic: 'back_serious' },
    ],
  },

  back_mild: {
    text: '那问题不大，就是肌肉劳损。注意上面说的多活动、垫靠垫，平时可以热敷一下腰，睡硬一点的床垫。\n\n我可以每两小时提醒你活动一下腰，要不要？',
    followups: [
      { label: '好，提醒我', topic: 'set_remind' },
    ],
  },

  back_serious: {
    text: '又疼又麻，还串到腿上的话，得当回事了——这可能是腰椎压到神经了，不只是肌肉的事。\n\n建议你找时间去医院骨科或者康复科查一下，拍个片子。这个拖久了不好。要我帮你记着，提醒你去检查吗？',
    note: '出现腿麻、无力，建议尽快就医，别硬扛。',
    followups: [
      { label: '帮我记着', topic: 'set_remind' },
      { label: '挂什么科', topic: 'which_dept' },
    ],
  },

  which_dept: {
    text: '腰疼带腿麻，先挂骨科，他们会看是不是腰椎间盘的问题。如果当地医院有"脊柱外科"或"康复医学科"更对口。\n\n去之前别做剧烈活动，开车久了中途多停下来休息一下。',
  },

  // 体检报告
  report: {
    text: '你可以把体检报告拍照发给我，我帮你一项一项讲清楚是什么意思、要不要紧。\n\n或者你直接说哪一项看不懂，比如血脂、脂肪肝、心电图这些，我都能给你说明白。',
    followups: [
      { label: '说说轻度脂肪肝', topic: 'fatty_liver' },
      { label: '窦性心律不齐是什么', topic: 'arrhythmia' },
    ],
  },

  fatty_liver: {
    text: '轻度脂肪肝很常见，开车这行久坐、应酬喝酒、吃得油，十个里有好几个。好消息是——它能逆转，不用吃药，靠调整就行。\n\n记住三件事：少喝酒、少吃油腻和甜的、动起来（哪怕每天快走半小时）。三个月到半年复查一次。你要是能把体重降几斤，肝上的油基本就下去了。\n\n要不要我帮你定个"管住嘴、迈开腿"的小计划？',
    followups: [
      { label: '帮我定个计划', topic: 'set_remind' },
    ],
  },

  arrhythmia: {
    text: '别被这名字吓到，"窦性心律不齐"大多数是正常的，尤其身体好的人很常见，就是心跳跟着呼吸快慢变化而已，一般不用治。\n\n要是你平时有心慌、胸闷、喘不上气，那就拿着单子找心内科再看看。',
    note: '建议仅供参考，有明显不适请及时就医。',
  },

  // 心脏 / 血压 / 头晕
  heart: {
    text: '说到心脏和血压，我先看了下你的数据：这三天你白天的心跳比平时快了点（平时72左右，这两天82上下）。\n\n这种情况可能是没休息好、有心事，或者最近喝咖啡浓茶多了。你具体是哪里不舒服？',
    followups: [
      { label: '蹲下站起来头晕', topic: 'dizzy' },
      { label: '心跳有点快、慌', topic: 'palpitation' },
    ],
  },

  dizzy: {
    text: '蹲下站起来眼前发黑、头晕，多数是"体位性低血压"——起得太猛，血一下没供上脑子，缓两秒就好，一般不要紧。\n\n但你要是经常这样、或者晕得厉害站不稳，那得查查血压和血糖。开车这行吃饭不规律，低血糖确实也容易有。\n\n我帮你记一下，要是这周再晕超过两三次，就提醒你去测个血压血糖，可以吗？',
    followups: [
      { label: '好，帮我记着', topic: 'set_remind' },
    ],
  },

  palpitation: {
    text: '偶尔心慌、心跳快，多数跟疲劳、紧张、喝浓茶咖啡有关，休息一下能缓过来。\n\n但如果心慌得厉害、还伴着胸闷喘不上气、或者持续好几分钟不停，那要重视，建议去心内科查个心电图。\n\n我可以帮你留意心率数据，一有异常就提醒你，要不要？',
    note: '胸闷、胸痛持续不缓解，请立即就医。',
    followups: [
      { label: '帮我留意', topic: 'set_remind' },
    ],
  },

  // 胃
  stomach: {
    text: '开车这行三餐不规律、吃饭快，胃最容易出问题。你这是哪种情况？',
    followups: [
      { label: '反酸、烧心', topic: 'stomach_acid' },
      { label: '胃胀、不消化', topic: 'stomach_bloat' },
    ],
  },

  stomach_acid: {
    text: '反酸烧心，多半是胃酸多、或者吃完马上开车坐着压着了。几个办法：\n\n1. 别吃太饱，少吃辣的、甜的、太酸的\n2. 吃完别马上坐下开车，能站一会儿最好\n3. 睡觉把枕头垫高点\n\n要是经常反酸、还感觉胸口烧得难受，建议去消化科看看，别拖成食管的毛病。',
    note: '建议仅供参考，症状反复请及时就医。',
  },

  stomach_bloat: {
    text: '胃胀不消化，跟吃太快、吃完久坐有关系。试试这几点：\n\n1. 吃饭慢一点，别狼吞虎咽\n2. 等货的时候下车走两圈，帮助消化\n3. 少喝碳酸饮料\n\n要是一直胀、还没胃口、人变瘦，那得去查查。',
  },

  // 设置提醒类（统一收口）
  set_remind: {
    text: '好的，我帮你记下了，到点会提醒你。👌\n你忙你的，这些事我帮你留意着，有情况第一时间告诉你。\n\n还有别的不舒服，随时问我。',
  },

  // 我没事
  fine: {
    text: '那就好！身体没事是最大的本钱。\n你这周佩戴很规律，继续保持。要是哪天觉得累了、不舒服，别硬扛，随时来找我聊两句。',
    followups: [
      { label: '看看我的睡眠', topic: 'sleep_data' },
      { label: '怎么保养身体', topic: 'sleep' },
    ],
  },

  thanks: {
    text: '不客气，师傅！开车在外，安全和身体最重要。\n有需要随时叫我。',
  },

  // 兜底
  _fallback: {
    text: '这个问题我帮你问问看。你可以说得再具体点，比如哪里不舒服、什么时候开始的、是什么感觉？\n\n或者点下面的常见问题，我直接帮你说明白。',
    followups: [
      { label: '开车犯困', topic: 'drowsy' },
      { label: '睡不好', topic: 'sleep' },
      { label: '腰酸背疼', topic: 'back' },
    ],
  },
}
