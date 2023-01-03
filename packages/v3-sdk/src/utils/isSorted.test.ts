import { isSorted } from './isSorted'

describe('#isSorted', () => {
  it('empty list', () => {
    expect(isSorted([], (a: number, b: number) => a - b)).toEqual(true)
  })
  it('list with one element', () => {
    expect(isSorted([1], (a: number, b: number) => a - b)).toEqual(true)
  })
  it('list with two sorted elements', () => {
    expect(isSorted([1, 2], (a: number, b: number) => a - b)).toEqual(true)
  })
  it('list with two equal elements', () => {
    expect(isSorted([2, 2], (a: number, b: number) => a - b)).toEqual(true)
  })
  it('list with two unsorted elements', () => {
    expect(isSorted([2, 1], (a: number, b: number) => a - b)).toEqual(false)
  })
  it('list with many elements with one unsorted pair', () => {
    expect(isSorted([1, 2, 3, 4, 6, 5, 7], (a: number, b: number) => a - b)).toEqual(false)
  })
  it('list with many elements with one unsorted pair at the end', () => {
    expect(isSorted([1, 2, 3, 4, 5, 7, 6], (a: number, b: number) => a - b)).toEqual(false)
  })
  it('list with many elements with one unsorted pair at the beginning', () => {
    expect(isSorted([2, 1, 3, 4, 5, 6, 7], (a: number, b: number) => a - b)).toEqual(false)
  })
  it('list with many elements with duplicates', () => {
    expect(isSorted([1, 2, 2, 3, 4, 5, 6, 7], (a: number, b: number) => a - b)).toEqual(true)
  })
  it('list with opposite comparator', () => {
    expect(isSorted([1, 2, 2, 3, 4, 5, 6, 7], (a: number, b: number) => b - a)).toEqual(false)
  })
  it('reverse sorted list with opposite comparator', () => {
    expect(isSorted([1, 2, 2, 3, 4, 5, 6, 7].reverse(), (a: number, b: number) => b - a)).toEqual(true)
  })
})
