import usePreviousValue from './usePreviousValue'

export function usePropsChanged(...args: any[]) {
  const prevArgs = usePreviousValue(args)
  return args.length !== prevArgs?.length || args.some((arg, i) => arg !== prevArgs[i])
}
