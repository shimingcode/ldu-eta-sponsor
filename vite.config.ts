import { site, association } from './src/data/sponsor.ts'
import react from '@vitejs/plugin-react'
import tailwindcss from '@tailwindcss/vite'
import { defineConfig } from 'vite'

// https://vite.dev/config/
export default defineConfig({
  plugins: [
    react(),
    tailwindcss(),
    {
      name: 'site-metadata',
      transformIndexHtml(html) {
        const escape = (v: string) =>
          v
            .replaceAll('&', '&amp;')
            .replaceAll('"', '&quot;')
            .replaceAll('<', '&lt;')
        return html
          .replace(
            /<title>.*?<\/title>/s,
            `<title>${escape(site.title)}</title>`,
          )
          .replace(
            /content="鲁东大学电子科技协会赞助者专属空间。[^"]*"/s,
            `content="${escape(site.description)}"`,
          )
          .replace('images/association-placeholder.svg', association.logo)
          .replace(
            '</head>',
            `<link rel="canonical" href="${site.url}"/><meta property="og:type" content="website"/><meta property="og:title" content="${escape(site.title)}"/><meta property="og:description" content="${escape(site.description)}"/><meta property="og:url" content="${site.url}"/><meta property="og:image" content="${site.url}images/share-cover.png"/><meta name="twitter:card" content="summary_large_image"/></head>`,
          )
      },
    },
  ],
  base: '/ldu-eta-sponsor/',
})
