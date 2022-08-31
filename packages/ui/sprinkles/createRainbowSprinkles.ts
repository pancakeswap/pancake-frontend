import { addFunctionSerializer } from '@vanilla-extract/css/functionSerializer';
import type {
  RuntimeFnReturn,
  DefinePropertiesReturn,
  SprinklesProps,
} from './types';
import { createRuntimeFn } from './createRuntimeFn';

export type SprinklesFn<Args extends ReadonlyArray<DefinePropertiesReturn>> = (
  props: SprinklesProps<Args>,
) => RuntimeFnReturn;

export function createRainbowSprinkles<
  Args extends ReadonlyArray<DefinePropertiesReturn>,
>(...args: Args): SprinklesFn<Args> {
  const cssConfig = Object.assign({}, ...args.map((a) => a.config));
  const properties = Object.keys(cssConfig);

  const shorthandNames = properties.filter(
    (property) => 'mappings' in cssConfig[property],
  );

  const config = {
    cssConfig,
    shorthandNames,
    properties,
  };

  return addFunctionSerializer(createRuntimeFn(config), {
    importPath: '@pancakeswap/ui/sprinkles/createRuntimeFn',
    importName: 'createRuntimeFn',
    args: [config],
  });
}
