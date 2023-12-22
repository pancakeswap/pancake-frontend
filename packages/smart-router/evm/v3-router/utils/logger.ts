import debug from 'debug'

const SCOPE_PREFIX = 'smart-router'
const SCOPE = {
  metric: 'metric',
  log: 'log',
  error: 'error',
} as const

type Scope = (typeof SCOPE)[keyof typeof SCOPE]

type CommaSeparated<T extends string, U extends T = T> = T extends string
  ? [U] extends [T]
    ? T
    : `${`${T},` | ''}${CommaSeparated<Exclude<U, T>>}`
  : never

type Namespace = '*' | Scope | CommaSeparated<Scope> | (string & Record<never, never>)

const log_ = debug(SCOPE_PREFIX)

export const metric = log_.extend(SCOPE.metric)
export const log = log_.extend(SCOPE.log)

export const logger = {
  metric,
  log,
  error: debug(SCOPE_PREFIX).extend(SCOPE.error),
  enable: (namespace: Namespace) => {
    let namespaces = namespace
    if (namespace.includes(',')) {
      namespaces = namespace
        .split(',')
        .map((ns) => `${SCOPE_PREFIX}:${ns}`)
        .join(',')
    } else {
      namespaces = `${SCOPE_PREFIX}:${namespace}`
    }
    debug.enable(namespaces)
  },
}
