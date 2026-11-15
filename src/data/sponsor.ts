export interface Contribution {
  id: string
  date: string
  title: string
  description: string
  category?: string
}
export interface Honor {
  id: string
  title: string
  issuer?: string
  date?: string
  description?: string
}
export interface Activity {
  id: string
  title: string
  description?: string
  date?: string
  image?: string
  imageAlt?: string
}
export interface ContactLink {
  label: string
  url: string
  /** Only explicitly authorized public contact information may be rendered. */
  authorized: boolean
}
export interface Sponsor {
  name: string
  nickname?: string
  avatar?: string
  cover?: string
  title?: string
  biography?: string[]
  sponsorSince?: string
  contributions?: Contribution[]
  honors?: Honor[]
  activities?: Activity[]
  message?: string
  contactLinks?: ContactLink[]
  /** Keep true until all examples have been replaced with verified data. */
  isPlaceholder?: boolean
}
/** 示例档案，不代表任何真实人物、荣誉或已发生的赞助。 */
export const sponsor: Sponsor = {
  name: '赞助者姓名',
  nickname: '与热爱同行的人',
  avatar: 'images/avatar-placeholder.svg',
  cover: 'images/cover-placeholder.svg',
  title: '鲁东大学电子科技协会 · 赞助者专属空间',
  biography: [
    '这里将记录一位支持电子科技探索的同行者：他的故事、与协会相遇的契机，以及对青年创新的期待。',
    '正式个人介绍将在获得本人授权后呈现。现在看到的是网站展示样稿，期待用真实的故事填满这一页。',
  ],
  sponsorSince: '',
  contributions: [
    {
      id: 'first-meeting',
      date: '时间待补充',
      title: '从一次相遇开始',
      description:
        '此处用于记录首次支持的背景与初心。具体日期及赞助事实待核实后填写。',
      category: '相遇 · 示例',
    },
    {
      id: 'support',
      date: '时间待补充',
      title: '让想法走向实践',
      description:
        '此处用于记录经确认的设备、物资或活动支持，不预设金额与成果。',
      category: '支持 · 示例',
    },
    {
      id: 'together',
      date: '时间待补充',
      title: '把热爱继续传递',
      description:
        '此处用于记录后续交流与共同成长的故事。当前不代表已发生的活动。',
      category: '同行 · 示例',
    },
  ],
  honors: [],
  activities: [
    {
      id: 'workshop',
      title: '电子实践 · 从原理到电路',
      description: '活动展示位，等待经授权的真实照片与活动记录。',
      image: 'images/activity-workshop.svg',
      imageAlt: '电子电路插画，活动示意而非真实记录',
    },
    {
      id: 'project',
      title: '创意协作 · 让灵感发生',
      description: '活动展示位，等待经授权的真实照片与活动记录。',
      image: 'images/activity-project.svg',
      imageAlt: '科技项目插画，活动示意而非真实记录',
    },
  ],
  message:
    '每一个值得探索的想法，都需要一份被看见的信任。\n愿我们因热爱相遇，以实践回应期待，\n让今天的微小灵感，成为明天的无限可能。',
  contactLinks: [],
  isPlaceholder: true,
}
