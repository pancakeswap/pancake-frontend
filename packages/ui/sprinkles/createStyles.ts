import { createVar, style } from '@vanilla-extract/css';
import type { CreateStylesOutput } from './types';
import { mapValues } from './utils';

export function createStyles(
  property: string,
  scale: true | Record<string, string>,
  conditions: Record<string, Record<string, string>>,
  defaultCondition: string,
): CreateStylesOutput {
  if (!conditions) {
    const cssVar = createVar(property);
    const className = style({ [property]: cssVar }, property);

    return {
      vars: { default: cssVar },
      dynamic: { default: className },
      dynamicScale: scale,
      name: property,
    };
  }

  const vars = mapValues(conditions, (_, conditionName) =>
    createVar(`${property}-${conditionName}`),
  );

  const classes = mapValues(conditions, (conditionValue, conditionName) => {
    let styleValue = { [property]: vars[conditionName] };

    if (conditionValue['@media']) {
      styleValue = {
        '@media': {
          [conditionValue['@media']]: styleValue,
        },
      };
    }
    if (conditionValue['@supports']) {
      styleValue = {
        '@supports': {
          [conditionValue['@supports']]: styleValue,
        },
      };
    }
    if (conditionValue['selector']) {
      styleValue = {
        selectors: {
          [conditionValue['selector']]: styleValue,
        },
      };
    }

    return style(styleValue, `${property}-${conditionName}`);
  });

  return {
    dynamic: { default: classes[defaultCondition], conditions: classes },
    name: property,
    vars: { conditions: vars, default: vars[defaultCondition] },
    dynamicScale: scale,
  };
}

export type CreateStyles = typeof createStyles;
