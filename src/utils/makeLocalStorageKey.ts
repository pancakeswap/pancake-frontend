import { LS_PREFIX } from 'config'

const appVersion = process.env.REACT_APP_VERSION

/**
 * E.g. pancakeswap-0.1.0-key
 */
const makeLocalStorageKey = (key?: string) => {
  if (!key) {
    return `${LS_PREFIX}-${appVersion}`
  }

  return `${LS_PREFIX}-${appVersion}-${key}`
}

export default makeLocalStorageKey
