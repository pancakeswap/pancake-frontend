import { createStyles } from './createStyles'
import { createStaticStyles } from './createStaticStyles'
import type {
  ConfigConditions,
  CSSProperties,
  ConfigStaticProperties,
  ConfigDynamicProperties,
  ConfigShorthands,
} from './types'

type ConditionalMap<Conditions> = {
  default: string
  conditions: Record<keyof Conditions, string>
}

type ReturnConditionalDynamic<DynamicProperties extends ConfigDynamicProperties, Conditions extends ConfigConditions> =
  {
    config: {
      [Property in keyof DynamicProperties]: {
        dynamic: ConditionalMap<Conditions>
        dynamicScale: DynamicProperties[Property]
        name: Property
        vars: ConditionalMap<Conditions>
      }
    }
  }
type ReturnDynamic<DynamicProperties extends ConfigDynamicProperties> = {
  config: {
    [Property in keyof DynamicProperties]: {
      dynamic: { default: string }
      dynamicScale: DynamicProperties[Property]
      name: Property
      vars: { default: string }
    }
  }
}

type Values<Property, Result> = {
  [Value in Property extends ReadonlyArray<any>
    ? Property[number]
    : Property extends Array<any>
    ? Property[number]
    : keyof Property]: Result
}

type ReturnConditionalStatic<StaticProperties extends ConfigStaticProperties, Conditions extends ConfigConditions> = {
  config: {
    [Property in keyof StaticProperties]: {
      values: Values<StaticProperties[Property], ConditionalMap<Conditions>>
      staticScale: StaticProperties[Property]
      name: Property
    }
  }
}
type ReturnStatic<StaticProperties extends ConfigStaticProperties> = {
  config: {
    [Property in keyof StaticProperties]: {
      values: Values<StaticProperties[Property], { default: string }>
      staticScale: StaticProperties[Property]
      name: Property
    }
  }
}

type ReturnShorthands<Shorthands extends { [k: string]: Array<string | number | symbol> }> = {
  config: {
    [Shorthand in keyof Shorthands]: {
      mappings: Shorthands[Shorthand]
    }
  }
}

export type OptionsConditionalDynamic<
  DynamicProperties extends ConfigDynamicProperties,
  Conditions extends ConfigConditions,
  Shorthands extends { [k: string]: Array<keyof DynamicProperties> },
> = {
  dynamicProperties: DynamicProperties
  conditions: Conditions
  defaultCondition: keyof Conditions
  shorthands?: Shorthands
}
export type OptionsConditionalStatic<
  StaticProperties extends ConfigStaticProperties,
  Conditions extends ConfigConditions,
  Shorthands extends { [k: string]: Array<keyof StaticProperties> },
> = {
  staticProperties: StaticProperties
  conditions: Conditions
  defaultCondition: keyof Conditions
  shorthands?: Shorthands
}
export type OptionsConditionalBoth<
  DynamicProperties extends ConfigDynamicProperties,
  StaticProperties extends ConfigStaticProperties,
  Conditions extends ConfigConditions,
  Shorthands extends ConfigShorthands<DynamicProperties, StaticProperties>,
> = {
  dynamicProperties: DynamicProperties
  staticProperties: StaticProperties
  conditions: Conditions
  defaultCondition: keyof Conditions
  shorthands?: Shorthands
}
export type OptionsDynamic<
  DynamicProperties extends ConfigDynamicProperties,
  Shorthands extends { [k: string]: Array<keyof DynamicProperties> },
> = {
  dynamicProperties: DynamicProperties
  shorthands?: Shorthands
}
export type OptionsStatic<
  StaticProperties extends ConfigStaticProperties,
  Shorthands extends { [k: string]: Array<keyof StaticProperties> },
> = {
  staticProperties: StaticProperties
  shorthands?: Shorthands
}
export type OptionsBoth<
  DynamicProperties extends ConfigDynamicProperties,
  StaticProperties extends ConfigStaticProperties,
  Shorthands extends ConfigShorthands<DynamicProperties, StaticProperties>,
> = {
  dynamicProperties: DynamicProperties
  staticProperties: StaticProperties
  shorthands?: Shorthands
}

// Conditional Dynamic Properties + Shorthands
export function defineProperties<
  DynamicProperties extends ConfigDynamicProperties,
  Conditions extends ConfigConditions,
  Shorthands extends { [k: string]: Array<keyof DynamicProperties> },
>(
  options: OptionsConditionalDynamic<DynamicProperties, Conditions, Shorthands>,
): ReturnConditionalDynamic<DynamicProperties, Conditions> & ReturnShorthands<Shorthands>
// Conditional Static Properties + Shorthands
export function defineProperties<
  StaticProperties extends ConfigStaticProperties,
  Conditions extends ConfigConditions,
  Shorthands extends { [k: string]: Array<keyof StaticProperties> },
>(
  options: OptionsConditionalStatic<StaticProperties, Conditions, Shorthands>,
): ReturnConditionalStatic<StaticProperties, Conditions> & ReturnShorthands<Shorthands>
// Conditional Dynamic Properties + Conditional Static Properties + Shorthands
export function defineProperties<
  DynamicProperties extends ConfigDynamicProperties,
  StaticProperties extends ConfigStaticProperties,
  Conditions extends ConfigConditions,
  Shorthands extends ConfigShorthands<DynamicProperties, StaticProperties>,
>(
  options: OptionsConditionalBoth<DynamicProperties, StaticProperties, Conditions, Shorthands>,
): ReturnConditionalStatic<StaticProperties, Conditions> &
  ReturnConditionalDynamic<DynamicProperties, Conditions> &
  ReturnShorthands<Shorthands>
// Dynamic Properties + Shorthands
export function defineProperties<
  DynamicProperties extends ConfigDynamicProperties,
  Shorthands extends { [k: string]: Array<keyof DynamicProperties> },
>(
  options: OptionsDynamic<DynamicProperties, Shorthands>,
): ReturnDynamic<DynamicProperties> & ReturnShorthands<Shorthands>
// Static Properties + Shorthands
export function defineProperties<
  StaticProperties extends ConfigStaticProperties,
  Shorthands extends { [k: string]: Array<keyof StaticProperties> },
>(options: OptionsStatic<StaticProperties, Shorthands>): ReturnStatic<StaticProperties> & ReturnShorthands<Shorthands>
// Dynamic Properties + Static Properties + Shorthands
export function defineProperties<
  DynamicProperties extends ConfigDynamicProperties,
  StaticProperties extends ConfigStaticProperties,
  Shorthands extends ConfigShorthands<DynamicProperties, StaticProperties>,
>(
  options: OptionsBoth<DynamicProperties, StaticProperties, Shorthands>,
): ReturnStatic<StaticProperties> & ReturnDynamic<DynamicProperties> & ReturnShorthands<Shorthands>
export function defineProperties(options: any): any {
  const { conditions, dynamicProperties, staticProperties, shorthands, defaultCondition } = options

  let config: any = shorthands
    ? Object.fromEntries(Object.entries(options.shorthands).map(([prop, mappings]) => [prop, { mappings }]))
    : {}

  for (const dynamicProp in dynamicProperties) {
    // console.log(config[dynamicProp], 'config[dynamicProp]')
    config[dynamicProp] = createStyles(
      dynamicProp as keyof CSSProperties,
      dynamicProperties[dynamicProp],
      conditions,
      defaultCondition,
    )
    if ('responsiveArray' in options && config[dynamicProp]) {
      config[dynamicProp].responsiveArray = options.responsiveArray
    }
  }

  for (const staticProp in staticProperties) {
    const style = createStaticStyles(
      staticProp as keyof CSSProperties,
      staticProperties[staticProp],
      conditions,
      defaultCondition,
    )
    if ('responsiveArray' in options && config[staticProp]) {
      config[staticProp].responsiveArray = options.responsiveArray
    }
    config[staticProp] = Object.assign({}, config?.[staticProp], style)
  }


  return {
    config,
  }
}
