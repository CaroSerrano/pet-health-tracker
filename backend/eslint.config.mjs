import { FlatCompat } from '@eslint/eslintrc'
import js from '@eslint/js'
import vitest from 'eslint-plugin-vitest'

const compat = new FlatCompat({
  baseDirectory: import.meta.dirname,
  recommendedConfig: js.configs.recommended,
  allConfig: js.configs.all
})

export default [
  {
    ignores: [
      '**/dist',
      '**/linter',
      '**/node_modules',
      '**/src/generated/prisma/**'
    ]
  },
  ...compat.extends(
    'eslint:recommended',
    'plugin:@typescript-eslint/eslint-recommended',
    'plugin:@typescript-eslint/recommended',
    'plugin:prettier/recommended'
  ),
  {
    env: {
      'node': true
    }
  },
  {
    files: ['**/*.test.ts', '**/*.spec.ts'],
    plugins: {
      vitest: vitest
    },
    rules: {
      '@typescript-eslint/no-unused-vars': 'warn',
      '@typescript-eslint/no-explicit-any': 'warn',
      'prettier/prettier': 'warn'
      //'vitest/expect-expect': 'error',
      //'vitest/no-disabled-tests': 'error',
      //'vitest/no-focused-tests': 'warn',
      //'vitest/no-identical-title': 'warn',
      //'vitest/prefer-to-have-length': 'warn',
      //'vitest/require-top-level-describe': 'off',
      //'vitest/consistent-test-it': 'off'
    }
  }
]
