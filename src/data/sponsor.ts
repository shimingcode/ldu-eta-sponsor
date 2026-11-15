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
export const association = {
  name: '鲁东大学电子科技协会',
  logo: 'images/association-logo-v2.webp',
  founded: '1985年3月5日',
  motto: '学以致用，真诚服务；科技创新，引领时代',
  introduction:
    '鲁东大学电子科技协会成立于1985年3月5日，是由电子爱好者自发组建的非营利性学生团体，隶属于能源动力与电气工程学院。协会是集学习、钻研、实践、创新为一体的社团，下设主席团、技术联盟、秘书处、策划部、后勤部、调度部等部门。拥有四十年的深厚积淀，是鲁东大学历史最悠久的社团之一，也是能源动力与电气工程学院的特色社团，运作模式成熟，技术传承稳定。',
}
export const site = {
  title: '任逸轩 · 鲁东大学电子科技协会赞助者专属空间',
  description:
    '食品工程学院任逸轩，热爱科学，喜欢自动铅。感谢以个人名义赞助100元，支持鲁东大学电子科技协会。',
  url: 'https://shimingcode.github.io/ldu-eta-sponsor/',
  contactNotice: '尊重赞助者个人意愿，联系方式不公开。',
}
export const sponsor: Sponsor = {
  name: '任逸轩',
  nickname: '热爱科学，喜欢自动铅',
  avatar: 'images/ren-yixuan-portrait-v2.jpg',
  cover: 'images/cover-placeholder.svg',
  title: '食品工程学院 · 电子科技协会有效赞助者',
  biography: ['来自食品工程学院，热爱科学，喜欢自动铅。'],
  sponsorSince: '',
  contributions: [
    {
      id: 'personal-support',
      date: '日期待补充',
      title: '以个人名义赞助100元',
      description: '任逸轩以个人名义向鲁东大学电子科技协会赞助100元。',
      category: '个人赞助',
    },
  ],
  honors: [
    {
      id: 'effective-sponsor',
      title: '电子科技协会有效赞助者',
      issuer: association.name,
      description: '授予日期及证书图片待补充。',
    },
  ],
  activities: [
    {
      id: 'view-achievements',
      title: '观看协会成果',
      description: '活动日期与现场照片待补充。',
      image: '',
      imageAlt: '观看协会成果，现场照片待补充',
    },
  ],
  message: '十分感谢对我们协会的支持。',
  contactLinks: [],
  isPlaceholder: false,
}
