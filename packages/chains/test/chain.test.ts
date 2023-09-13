import { describe, expect, it } from 'vitest'
import { ChainId } from '../src'

describe('chains', () => {
  it('should be defined', () => {
    expect(ChainId).toBeDefined()
  })
})
