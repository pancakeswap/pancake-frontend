import type { Properties } from './css';

export interface CSSProperties extends Properties {}

type PropertyCssValue<T> = T extends keyof CSSProperties
  ? CSSProperties[T]
  : never;

// Configuration

export type ConfigStaticProperties = {
  [k in keyof CSSProperties]?:
    | ReadonlyArray<CSSProperties[k]>
    | Record<string, CSSProperties[k]>;
};

export type ConfigDynamicProperties = {
  [k in keyof CSSProperties]?: Record<string, CSSProperties[k]> | true;
};

export type ConfigConditions = {
  [conditionName: string]: {
    '@media'?: string;
    '@supports'?: string;
    selector?: string;
  };
};

export type ConfigShorthands<DynamicProperties, StaticProperties> = {
  [shorthandName: string]: Array<
    keyof DynamicProperties | keyof StaticProperties
  >;
};

export type ConditionalPropertyValue = {
  default: string;
  conditions: { [conditionName: string]: string };
};

type NonConditionalPropertyValue = {
  default: string;
};

export type DynamicProperty = {
  dynamic: NonConditionalPropertyValue;
  vars: NonConditionalPropertyValue;
  dynamicScale:
    | {
        [token: string]: string;
      }
    | true;
  name: string;
};
export type DynamicConditionalProperty = {
  dynamic: ConditionalPropertyValue;
  vars: ConditionalPropertyValue;
  dynamicScale:
    | {
        [token: string]: string;
      }
    | true;
  name: string;
};

export type StaticPropertyArray = {
  values: {
    [value: string]: NonConditionalPropertyValue;
  };
  staticScale: string[];
  name: string;
};
export type StaticConditionalPropertyArray = {
  values: {
    [value: string]: ConditionalPropertyValue;
  };
  staticScale: string[];
  name: string;
};

export type StaticProperty = {
  values: {
    [value: string]: NonConditionalPropertyValue;
  };
  staticScale: {
    [token: string]: string;
  };
  name: string;
};
export type StaticConditionalProperty = {
  values: {
    [value: string]: ConditionalPropertyValue;
  };
  staticScale: {
    [token: string]: string;
  };
  name: string;
};

export type StaticDynamicPropertyArray = {
  dynamic: NonConditionalPropertyValue;
  values: {
    [value: string]: NonConditionalPropertyValue;
  };
  name: string;
  staticScale: string[];
  dynamicScale: true;
  vars: NonConditionalPropertyValue;
};
export type StaticDynamicConditionalPropertyArray = {
  dynamic: ConditionalPropertyValue;
  values: {
    [value: string]: ConditionalPropertyValue;
  };
  name: string;
  staticScale: string[];
  dynamicScale: true;
  vars: ConditionalPropertyValue;
};

export type StaticDynamicProperty = {
  dynamic: NonConditionalPropertyValue;
  values: {
    [value: string]: NonConditionalPropertyValue;
  };
  name: string;
  vars: NonConditionalPropertyValue;
  staticScale: {
    [token: string]: string;
  };
  dynamicScale: true;
};
export type StaticDynamicConditionalProperty = {
  dynamic: ConditionalPropertyValue;
  values: {
    [value: string]: ConditionalPropertyValue;
  };
  name: string;
  vars: ConditionalPropertyValue;
  staticScale: {
    [token: string]: string;
  };
  dynamicScale: true;
};

export type ShorthandProperty = {
  mappings: string[];
};

export type SprinkleProperties = {
  [k: string]:
    | DynamicProperty
    | StaticProperty
    | StaticPropertyArray
    | StaticDynamicPropertyArray
    | StaticDynamicProperty
    | DynamicConditionalProperty
    | StaticConditionalProperty
    | StaticConditionalPropertyArray
    | StaticDynamicConditionalPropertyArray
    | StaticDynamicConditionalProperty
    | ShorthandProperty;
};

/**
 * All of the possible permutations of a Sprinkle Property, combined
 * together and made conditional
 */
export type CreateStylesOutput = {
  dynamic?: {
    default: string;
    conditions?: { [condition: string]: string };
  };
  values?: {
    [value: string]: {
      default: string;
      conditions?: { [condition: string]: string };
    };
  };
  name: string;
  vars?: {
    default: string;
    conditions?: { [condition: string]: string };
  };
  staticScale?: string[] | Record<string, string>;
  dynamicScale?: true | Record<string, string>;
};

export type DefinePropertiesReturn = {
  config: SprinkleProperties;
};

// Props

type ValueOrConditionObject<T, Conditions extends ConditionalPropertyValue> =
  | T
  | Partial<Record<keyof Conditions['conditions'], T>>;

type ValueOrConditionObjectStatic<
  T,
  Values extends { [k: string]: ConditionalPropertyValue },
> =
  | T
  | {
      [Condition in keyof Values[keyof Values]['conditions']]?: T;
    };

export type PrefixValue<T> = `$${(string | number) & T}`;

export type ChildSprinkle<
  Sprinkle extends SprinkleProperties[keyof SprinkleProperties],
> = Sprinkle extends StaticDynamicConditionalProperty
  ? ValueOrConditionObject<
      | PropertyCssValue<Sprinkle['name']>
      | PrefixValue<keyof Sprinkle['staticScale']>,
      Sprinkle['vars']
    >
  : Sprinkle extends StaticDynamicConditionalPropertyArray
  ? ValueOrConditionObject<PropertyCssValue<Sprinkle['name']>, Sprinkle['vars']>
  : Sprinkle extends DynamicConditionalProperty
  ? Sprinkle['dynamicScale'] extends boolean
    ? ValueOrConditionObject<
        PropertyCssValue<Sprinkle['name']>,
        Sprinkle['vars']
      >
    : ValueOrConditionObject<
        | PropertyCssValue<Sprinkle['name']>
        | PrefixValue<keyof Sprinkle['dynamicScale']>,
        Sprinkle['vars']
      >
  : Sprinkle extends StaticDynamicConditionalPropertyArray
  ? ValueOrConditionObject<Sprinkle['staticScale'][number], Sprinkle['dynamic']>
  : Sprinkle extends StaticDynamicConditionalProperty
  ? ValueOrConditionObjectStatic<
      PrefixValue<keyof Sprinkle['staticScale']>,
      Sprinkle['values']
    >
  : Sprinkle extends StaticConditionalProperty
  ? ValueOrConditionObjectStatic<
      PrefixValue<keyof Sprinkle['staticScale']>,
      Sprinkle['values']
    >
  : Sprinkle extends StaticConditionalPropertyArray
  ? ValueOrConditionObjectStatic<
      Sprinkle['staticScale'][number],
      Sprinkle['values']
    >
  : Sprinkle extends DynamicProperty
  ?
      | PropertyCssValue<Sprinkle['name']>
      | (Sprinkle['dynamicScale'] extends boolean
          ? never
          : PrefixValue<keyof Sprinkle['dynamicScale']>)
  : Sprinkle extends StaticProperty
  ? PrefixValue<keyof Sprinkle['staticScale']>
  : Sprinkle extends StaticPropertyArray
  ? Sprinkle['staticScale'][number]
  : Sprinkle extends StaticDynamicProperty
  ?
      | PrefixValue<keyof Sprinkle['staticScale']>
      | PropertyCssValue<Sprinkle['name']>
  : Sprinkle extends StaticDynamicPropertyArray
  ? PropertyCssValue<Sprinkle['name']>
  : never;

export type ChildSprinkles<Sprinkles extends SprinkleProperties> = {
  [Prop in keyof Sprinkles]?: Sprinkles[Prop] extends ShorthandProperty
    ? ChildSprinkle<Sprinkles[Sprinkles[Prop]['mappings'][number]]>
    : ChildSprinkle<Sprinkles[Prop]>;
};

export type SprinklesProps<Args extends ReadonlyArray<any>> = Args extends [
  infer L,
  ...infer R,
]
  ? (L extends DefinePropertiesReturn ? ChildSprinkles<L['config']> : never) &
      SprinklesProps<R>
  : {};

// Runtime Function

export type RuntimeFnReturn = {
  style: Record<string, string>;
  className: string;
  otherProps: Record<string, any>;
};
