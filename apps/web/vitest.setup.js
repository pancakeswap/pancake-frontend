// Optional: configure or set up a testing framework before each test.

// Used for __tests__/testing-library.js
// Learn more: https://github.com/testing-library/jest-dom
import { vi } from 'vitest'
import '@testing-library/jest-dom/extend-expect'
import { TextDecoder, TextEncoder } from 'util'

global.setImmediate = vi.useRealTimers
global.TextDecoder = TextDecoder
global.TextEncoder = TextEncoder

Object.defineProperty(window, 'matchMedia', {
  writable: true,
  value: vi.fn().mockImplementation((query) => ({
    matches: false,
    media: query,
    onchange: null,
    addListener: vi.fn(), // Deprecated
    removeListener: vi.fn(), // Deprecated
    addEventListener: vi.fn(),
    removeEventListener: vi.fn(),
    dispatchEvent: vi.fn(),
  })),
})

window.IntersectionObserver = vi.fn(() => ({
  observe: vi.fn(),
  unobserve: vi.fn(),
  disconnect: vi.fn(),
}))

vi.mock('next/router', () => ({
  useRouter: () => ({
    route: '/',
    pathname: '',
    query: '',
    asPath: '',
    push: vi.fn(),
    events: {
      on: vi.fn(),
      off: vi.fn(),
    },
    beforePopState: vi.fn(() => null),
    prefetch: vi.fn(() => null),
  }),
}))
