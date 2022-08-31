import { assignClasses } from './assignClasses'
import { assignInlineVars } from './assignInlineVars'
import { ShorthandProperty, SprinkleProperties } from './types'

export const createRuntimeFn = ({
  cssConfig,
  shorthandNames,
  properties,
}: {
  cssConfig: SprinkleProperties
  shorthandNames: string[]
  properties: string[]
}) => {
  return (props: any) => {
    const style: Record<string, string> = {}
    const className: string[] = []
    const otherProps: Record<string, any> = {}

    const shorthands: any = {}
    const nonShorthands: any = { ...props }
    let hasShorthands = false

    for (const shorthand of shorthandNames) {
      const value = props[shorthand]
      if (value != null) {
        const sprinkle = cssConfig[shorthand] as ShorthandProperty
        hasShorthands = true
        for (const propMapping of sprinkle.mappings) {
          shorthands[propMapping] = value
          if (nonShorthands[propMapping] == null) {
            delete nonShorthands[propMapping]
          }
        }
      }
    }

    const finalProps = hasShorthands ? { ...shorthands, ...nonShorthands } : props

    for (const property in finalProps) {
      if (!properties.includes(property)) {
        otherProps[property] = props[property]
        continue
      }

      const propertyConfig = cssConfig[property]
      const propValue = finalProps[property]

      if ('mappings' in propertyConfig) {
        continue
      }

      if (propertyConfig) {
        if (Array.isArray(propValue)) {
          let _propValue = {}
          for (let responsiveIndex = 0; responsiveIndex < propValue.length; responsiveIndex++) {
            const responsiveValue = propValue[responsiveIndex]

            if (responsiveValue != null) {
              _propValue[propertyConfig.responsiveArray[responsiveIndex]] = responsiveValue
            }
          }
          className.push(assignClasses(propertyConfig, _propValue))
          Object.assign(style, assignInlineVars(propertyConfig, _propValue))
        } else {
          className.push(assignClasses(propertyConfig, propValue))
          Object.assign(style, assignInlineVars(propertyConfig, propValue))
        }
      }
    }

    return {
      className: className.join(' ').trim(),
      style,
      otherProps,
    }
  }
}
