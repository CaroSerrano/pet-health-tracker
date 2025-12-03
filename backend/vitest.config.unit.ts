import { defineConfig } from 'vitest/config'

export default defineConfig({
  test: {
    include: ['src/**/*.test.ts']
  },
  resolve: {
    alias: {
      services: '/src/services',
      controllers: '/src/controllers',
      types: '/src/types'
    }
  }
})
