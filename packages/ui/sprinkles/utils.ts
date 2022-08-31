const VALUE_REGEX = /^\$(\w*)/;

export function trim$(rawValue: string): string | undefined {
  const matches = rawValue.match(VALUE_REGEX);
  return matches?.[1];
}

export function mapValues<
  Value,
  Obj extends Record<string, Value>,
  Result = Value,
>(
  obj: Obj & Record<string, Value>,
  callback: (value: Value, key: string, object: typeof obj) => Result,
): Record<keyof Obj, Result> {
  const result = {};

  for (const key in obj) {
    Object.assign(result, { [key]: callback(obj[key], key, obj) });
  }

  return result as any;
}
