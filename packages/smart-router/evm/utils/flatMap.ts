export function flatMap<T = void, R = void>(list: T[], map: (item: T) => R[]) {
  return list.reduce<R[]>((acc, cur) => [...acc, ...map(cur)], [])
}
