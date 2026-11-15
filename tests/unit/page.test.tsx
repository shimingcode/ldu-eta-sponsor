import { fireEvent, render, screen } from '@testing-library/react'
import { describe, expect, it } from 'vitest'
import { SponsorPage } from '../../src/App'
import { LocalImage } from '../../src/components/LocalImage'
import type { Sponsor } from '../../src/data/sponsor'

// Test-only records; these are never included in the public sample profile.
const completeFixture: Sponsor = {
  name: '测试专用赞助者',
  nickname: '测试昵称',
  title: '测试头衔',
  avatar: 'images/avatar-placeholder.svg',
  cover: 'images/cover-placeholder.svg',
  biography: ['测试个人介绍。'],
  sponsorSince: '2024',
  contributions: [
    {
      id: 'fixture-contribution',
      date: '2024-09',
      title: '测试支持记录',
      description: '仅用于自动化测试。',
    },
  ],
  honors: [
    {
      id: 'fixture-honor',
      title: '测试荣誉称号',
      issuer: '测试颁发机构',
      date: '2025-01',
      description: '测试荣誉说明。',
    },
  ],
  activities: [
    {
      id: 'fixture-activity',
      title: '测试活动标题',
      image: 'images/activity-workshop.svg',
      imageAlt: '测试活动图片',
    },
  ],
  message: '测试感谢寄语。',
  isPlaceholder: false,
  contactLinks: [
    {
      label: '授权个人主页',
      url: 'https://example.com/profile',
      authorized: true,
    },
    { label: '授权邮箱', url: 'mailto:sponsor@example.com', authorized: true },
    {
      label: '未授权私人链接',
      url: 'https://example.com/private',
      authorized: false,
    },
    { label: '脚本链接', url: 'javascript:alert(1)', authorized: true },
    { label: '不安全协议链接', url: 'http://example.com', authorized: true },
  ],
}

describe('sponsor page data handling', () => {
  it('renders a minimal empty profile without missing-value artifacts or contact links', () => {
    const { container } = render(<SponsorPage sponsor={{ name: '' }} />)
    expect(
      screen.getByRole('heading', { level: 1, name: '赞助者姓名待补充' }),
    ).toBeInTheDocument()
    expect(
      screen.getByText(
        '个人介绍待补充。经本人确认和授权后，将在这里分享真实的故事。',
      ),
    ).toBeInTheDocument()
    expect(screen.getByText('尚未公开赞助贡献记录。')).toBeInTheDocument()
    expect(screen.getByText('荣誉资料待补充')).toBeInTheDocument()
    expect(screen.getByText('暂无已公开的协会活动资料。')).toBeInTheDocument()
    expect(screen.getByText('图片待补充')).toBeInTheDocument()
    expect(
      screen.queryByLabelText('经授权公开的联系方式'),
    ).not.toBeInTheDocument()
    expect(container.textContent).not.toMatch(/undefined|null|NaN/)
  })

  it('renders supplied profile, contribution, activity and honor records', () => {
    render(<SponsorPage sponsor={completeFixture} />)
    expect(
      screen.getByRole('heading', { level: 1, name: completeFixture.name }),
    ).toBeInTheDocument()
    expect(screen.getByText('测试个人介绍。')).toBeInTheDocument()
    expect(screen.getByText('自 2024 起同行')).toBeInTheDocument()
    expect(
      screen.getByRole('heading', { name: '测试支持记录' }),
    ).toBeInTheDocument()
    expect(
      screen.getByRole('heading', { name: '测试荣誉称号' }),
    ).toBeInTheDocument()
    expect(screen.getByText('测试颁发机构')).toBeInTheDocument()
    expect(screen.getByText('测试荣誉说明。')).toBeInTheDocument()
    expect(
      screen.getByRole('heading', { name: '测试活动标题' }),
    ).toBeInTheDocument()
    expect(screen.getByText('测试感谢寄语。')).toBeInTheDocument()
    expect(screen.queryByText('荣誉资料待补充')).not.toBeInTheDocument()
    expect(screen.queryByText('示例档案')).not.toBeInTheDocument()
  })

  it('shows only authorized contacts using accepted protocols', () => {
    render(<SponsorPage sponsor={completeFixture} />)
    const website = screen.getByRole('link', { name: '授权个人主页' })
    expect(website).toHaveAttribute('href', 'https://example.com/profile')
    expect(website).toHaveAttribute('target', '_blank')
    expect(website).toHaveAttribute('rel', 'noopener noreferrer')
    expect(screen.getByRole('link', { name: '授权邮箱' })).toHaveAttribute(
      'href',
      'mailto:sponsor@example.com',
    )
    expect(
      screen.queryByRole('link', { name: '未授权私人链接' }),
    ).not.toBeInTheDocument()
    expect(
      screen.queryByRole('link', { name: '脚本链接' }),
    ).not.toBeInTheDocument()
    expect(
      screen.queryByRole('link', { name: '不安全协议链接' }),
    ).not.toBeInTheDocument()
  })
})

describe('local image fallbacks', () => {
  it('resolves images beneath the Pages base and substitutes an accessible fallback after failure', () => {
    const view = render(
      <LocalImage path="images/not-present.svg" alt="测试头像" />,
    )
    const image = screen.getByRole('img', { name: '测试头像' })
    expect(image).toHaveAttribute(
      'src',
      '/ldu-eta-sponsor/images/not-present.svg',
    )
    fireEvent.error(image)
    expect(screen.getByText('图片待补充')).toBeInTheDocument()
    expect(screen.getByRole('img', { name: '测试头像' }).tagName).toBe('DIV')

    // A subsequently corrected path must get a chance to load.
    view.rerender(
      <LocalImage path="images/avatar-placeholder.svg" alt="测试头像" />,
    )
    expect(screen.getByRole('img', { name: '测试头像' })).toHaveAttribute(
      'src',
      '/ldu-eta-sponsor/images/avatar-placeholder.svg',
    )
    expect(screen.queryByText('图片待补充')).not.toBeInTheDocument()
  })

  it('shows an accessible fallback when the path is omitted or unsafe', () => {
    const view = render(<LocalImage alt="待添加活动照片" />)
    expect(
      screen.getByRole('img', { name: '待添加活动照片' }),
    ).toHaveTextContent('图片待补充')
    view.rerender(
      <LocalImage path="javascript:alert(1)" alt="待添加活动照片" />,
    )
    expect(screen.getByRole('img', { name: '待添加活动照片' }).tagName).toBe(
      'DIV',
    )
  })
})
