import type { Metadata } from 'next';
import { Inter_Tight, JetBrains_Mono } from 'next/font/google';
import { Footer } from '@/components/layout/Footer';
import { Nav } from '@/components/layout/Nav';
import { SkipLink } from '@/components/layout/SkipLink';
import { MotionProvider } from '@/components/motion/MotionProvider';
import { getSite } from '@/lib/content';
import { siteUrl } from '@/lib/url';
import './globals.css';

// One family for all text (display + body), one for labels. See ui-rules.md → Font.
const interTight = Inter_Tight({
  variable: '--font-inter-tight',
  subsets: ['latin'],
  display: 'swap',
});

const jetBrainsMono = JetBrains_Mono({
  variable: '--font-jetbrains-mono',
  subsets: ['latin'],
  display: 'swap',
});

// Runs before first paint. Marks that JS is present so globals.css may apply the hidden
// start states of motion wrappers (`html[data-js] [data-reveal]`): no flash on hydration,
// and nothing is hidden for visitors without JavaScript.
const JS_MARKER = "document.documentElement.dataset.js='';";

const site = getSite();

export const metadata: Metadata = {
  metadataBase: siteUrl(),
  title: { default: site.name, template: `%s — ${site.name}` },
  description: `Director, editor and colorist. Selected work, craft and showreel of ${site.name}, ${site.city}.`,
  openGraph: {
    type: 'website',
    siteName: site.name,
    images: [{ url: site.assets.ogDefault, width: 1200, height: 630, alt: site.name }],
  },
  twitter: { card: 'summary_large_image' },
  robots: { index: true, follow: true },
};

export default function RootLayout({ children }: LayoutProps<'/'>) {
  return (
    <html
      lang="en"
      className={`${interTight.variable} ${jetBrainsMono.variable} h-full antialiased`}
      // The JS_MARKER script adds `data-js` (and Lenis later adds its classes) to <html>
      // before/after hydration; React would flag the attribute mismatch. Same fix as theme
      // scripts: suppress on this one element only — children stay fully checked.
      suppressHydrationWarning
    >
      <head>
        <script dangerouslySetInnerHTML={{ __html: JS_MARKER }} />
      </head>
      <body className="relative flex min-h-full flex-col">
        <MotionProvider>
          <SkipLink />
          <Nav name={site.name} />
          <div className="flex-1">{children}</div>
          <Footer />
        </MotionProvider>
      </body>
    </html>
  );
}
