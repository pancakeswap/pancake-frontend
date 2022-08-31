import type { CreateStylesOutput } from './types';
import { trim$ } from './utils';

export function assignClasses(
  propertyConfig: CreateStylesOutput,
  propValue: unknown,
): string {
  if (!propValue) {
    return '';
  }

  const { dynamic, values, name: propName } = propertyConfig;

  // Value is a string or number, ie not responsive
  if (typeof propValue === 'string') {
    const value = trim$(propValue) ?? propValue;
    // Check for static value first
    if (values?.[value]) {
      return values[value].default;
    }
    if (dynamic) {
      return dynamic.default;
    }
    // If the property is not dynamic, and unrecognized value is provided
    // Quietly warn
    // eslint-disable-next-line no-console
    console.error(
      `Rainbow Sprinkles: invalid value provided to prop '${propName}'. Expected one of ${Object.keys(
        // @ts-ignore
        values,
      )
        .map((className) => `"${className}"`)
        .join(', ')}. Received: ${JSON.stringify(propValue)}.`,
    );
    return '';
  }

  const keys = Object.keys(propValue);

  // If no entries, exit gracefully
  if (keys.length < 1) {
    return '';
  }

  const className = keys
    .map((bp) => {
      const rawValueAtBp = propValue[bp];
      const valueAtBp = trim$(rawValueAtBp) ?? rawValueAtBp;

      // Check for static value first
      if (values?.[valueAtBp]) {
        return values[valueAtBp].conditions[bp];
      }
      if (dynamic) {
        return dynamic.conditions[bp];
      }
      // If the property is not dynamic, and unrecognized value is provided
      // Quietly warn
      // eslint-disable-next-line no-console
      console.error(
        `Rainbow Sprinkles: invalid value provided to prop '${propName}'. Expected one of ${Object.keys(
          values,
        )
          .map((className) => `"${className}"`)
          .join(', ')}. Received: ${JSON.stringify(valueAtBp)}.`,
      );
      return null;
    })
    .filter(Boolean);

  return className.join(' ').trim();
}
