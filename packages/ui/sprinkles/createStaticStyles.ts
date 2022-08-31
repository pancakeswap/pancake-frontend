import { style } from '@vanilla-extract/css';
import type { CreateStylesOutput } from './types';
import { mapValues } from './utils';

export function createStaticStyles(
  property: string,
  scale: ReadonlyArray<string> | Record<string, string>,
  conditions: Record<string, Record<string, string>>,
  defaultCondition: string,
): CreateStylesOutput {
  const scaleObj = Array.isArray(scale)
    ? Object.assign(
        {},
        ...scale.map((s) => ({
          [s]: s,
        })),
      )
    : scale;

  const values = mapValues(scaleObj, (scaleValue, scaleKey) => {
    if (!conditions) {
      return {
        default: style({ [property]: scaleValue }, `${property}-${scaleKey}`),
      };
    }

    const classes = mapValues(conditions, (conditionValue, conditionName) => {
      let styleValue = { [property]: scaleValue };
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
      return style(styleValue, `${property}-${scaleKey}-${conditionName}`);
    });
    return {
      conditions: classes,
      default: classes[defaultCondition],
    };
  });

  return {
    values,
    name: property,
    staticScale: scaleObj,
  };
}
