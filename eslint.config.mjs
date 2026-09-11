import { defineConfig, globalIgnores } from 'eslint/config';
import nextVitals from 'eslint-config-next/core-web-vitals';
import nextTs from 'eslint-config-next/typescript';

const eslintConfig = defineConfig([
  ...nextVitals,
  ...nextTs,
  {
    // Guardrail from architecture.md → Invariants: components never read src/data
    // directly; every read goes through src/lib/content.ts so swapping the placeholder
    // client for a real one touches src/data/ only.
    files: ['src/**/*.{ts,tsx}'],
    ignores: ['src/lib/content.ts'],
    rules: {
      'no-restricted-imports': [
        'error',
        {
          patterns: [
            {
              group: ['@/data', '@/data/*'],
              message: 'Read content through @/lib/content, never from @/data directly.',
            },
          ],
        },
      ],
    },
  },
  {
    // Guardrail from architecture.md → Invariants: gsap and lenis are imported only by the
    // motion and prologue components; scenes and layout use the wrappers.
    files: ['src/**/*.{ts,tsx}'],
    ignores: ['src/components/motion/**', 'src/components/prologue/**'],
    rules: {
      'no-restricted-imports': [
        'error',
        {
          patterns: [
            {
              group: ['gsap', 'gsap/*', '@gsap/react', 'lenis', 'lenis/*'],
              message:
                'Animate through the wrappers in @/components/motion; gsap and lenis are imported only there.',
            },
          ],
        },
      ],
    },
  },
  // Override default ignores of eslint-config-next.
  globalIgnores([
    // Default ignores of eslint-config-next:
    '.next/**',
    'out/**',
    'build/**',
    'next-env.d.ts',
  ]),
]);

export default eslintConfig;
