import { describe, expect, it } from 'vitest'
import { slugify } from '../../app/utils/slugify'

describe('slugify', () => {
  it('lowercases and hyphenates spaces', () => {
    expect(slugify('Zeg \'ns Aaa')).toBe('zeg-ns-aaa')
  })

  it('strips accents', () => {
    expect(slugify('Amélie')).toBe('amelie')
  })

  it('collapses consecutive special characters into a single hyphen', () => {
    expect(slugify('The Matrix: Reloaded!!')).toBe('the-matrix-reloaded')
  })

  it('trims leading and trailing hyphens', () => {
    expect(slugify('  -- Se7en -- ')).toBe('se7en')
  })

  it('returns an empty string for an empty input', () => {
    expect(slugify('')).toBe('')
  })
})
