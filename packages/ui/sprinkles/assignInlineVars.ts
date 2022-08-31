import { assignInlineVars } from '@vanilla-extract/dynamic'
import { CSSProperties, CreateStylesOutput } from './types'
import { trim$ } from './utils'

function _assignInlineVars(propertyConfig: CreateStylesOutput, propValue: unknown): CSSProperties | null {
  const { vars, dynamicScale, values, dynamic } = propertyConfig

  // Value is a string, ie not responsive
  if (typeof propValue === 'string') {
    const parsedValue = trim$(propValue) ?? propValue
    // If the propValue matches a static value,
    // don't assign any variables
    if (values?.[parsedValue] || values?.conditions?.[parsedValue] || !dynamic) {
      return {}
    }
    return assignInlineVars({
      [vars.default]: dynamicScale?.[parsedValue] ?? propValue,
    })
  }

  // If no entries, exit gracefully
  if ((propValue && Object.keys(propValue).length < 1) || propValue == null) {
    return {}
  }

  let hasProperty = false

  const variableAssignments = Object.entries(propValue).reduce((acc: Record<string, string>, [bp, value]) => {
    if (value) {
      const parsedValue = trim$(value) ?? value
      if (values?.[parsedValue] || !dynamic) {
        // If value has a static class, don't assign any variables
        return acc
      }
      hasProperty = true
      acc[vars.conditions[bp]] = dynamicScale?.[parsedValue] ?? value
    }
    return acc
  }, {})

  return hasProperty ? assignInlineVars(variableAssignments) : {}
}

export { _assignInlineVars as assignInlineVars }
