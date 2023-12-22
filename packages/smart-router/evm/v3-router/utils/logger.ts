import debug from 'debug'

const SCOPE_PREFIX = 'smart-router'
const SCOPE = {
  metric: 'metric',
  log: 'log',
  error: 'error',
} as const

type ScopePrefix = typeof SCOPE_PREFIX

type Namespace =
  | `${ScopePrefix}:*`
  | `${ScopePrefix}:${(typeof SCOPE)[keyof typeof SCOPE]}`
  | (string & Record<never, never>)

const log_ = debug(SCOPE_PREFIX)

export const metric = log_.extend(SCOPE.metric)
export const log = log_.extend(SCOPE.log)

export const logger = {
  metric,
  log,
  error: debug(SCOPE_PREFIX).extend(SCOPE.error),
  enable: (namespace: Namespace) => debug.enable(namespace),
}
