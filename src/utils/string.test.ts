import { escapeRegExp, normalizeTextInput, trimToLength } from 'src/utils/string'

describe(trimToLength, () => {
  it('handles empty string', () => {
    expect(trimToLength('', 1)).toBe('')
  })

  it('handles string longer than max length', () => {
    expect(trimToLength('teststring', 1)).toBe('t...')
  })

  it('handles string shorter than max length', () => {
    expect(trimToLength('teststring', 20)).toBe('teststring')
  })
})

describe(normalizeTextInput, () => {
  it('handles empty string', () => {
    expect(normalizeTextInput('')).toBe('')
  })

  it('handles string with multiple spaces'