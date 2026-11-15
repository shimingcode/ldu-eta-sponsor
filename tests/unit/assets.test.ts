import { describe, expect, it } from 'vitest'
import { assetUrl, safeContactUrl } from '../../src/data/assets'

describe('public asset URLs', () => {
  it('resolves local files under the fixed GitHub Pages repository path', () => {
    expect(import.meta.env.BASE_URL).toBe('/ldu-eta-sponsor/')
    expect(assetUrl('images/avatar-placeholder.svg')).toBe(
      '/ldu-eta-sponsor/images/avatar-placeholder.svg',
    )
    expect(assetUrl('/images/avatar-placeholder.svg')).toBe(
      '/ldu-eta-sponsor/images/avatar-placeholder.svg',
    )
    expect(assetUrl('images/活动照片.webp')).toBe(
      '/ldu-eta-sponsor/images/活动照片.webp',
    )
  })

  it('preserves an explicitly provided HTTPS image address', () => {
    expect(assetUrl('https://example.com/photo.webp')).toBe(
      'https://example.com/photo.webp',
    )
  })

  it.each([undefined, '', '   '])(
    'treats an absent path %s as missing',
    (path) => {
      expect(assetUrl(path)).toBeUndefined()
    },
  )

  it.each([
    'javascript:alert(1)',
    'data:image/svg+xml,<svg/>',
    'http://example.com/photo.svg',
    '//example.com/photo.svg',
    '../private.svg',
    'images/../../private.svg',
    '..\\private.svg',
    '%2e%2e/private.svg',
    'images/%2E%2E/%2E%2E/private.svg',
  ])('rejects unsafe or base-escaping path %s', (path) => {
    expect(assetUrl(path)).toBeUndefined()
  })
})

describe('public contact URL protocols', () => {
  it.each([
    'https://example.com',
    'mailto:public@example.com',
    'tel:+8610000000000',
  ])('accepts %s', (url) => {
    expect(safeContactUrl(url)).toBe(url)
  })

  it.each([
    'javascript:alert(1)',
    'data:text/html,hello',
    'http://example.com',
    '//example.com',
    '/relative',
    '',
  ])('rejects %s', (url) => {
    expect(safeContactUrl(url)).toBeUndefined()
  })
})
