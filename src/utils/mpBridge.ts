import { NextRouter, useRouter } from 'next/router'
import { useTranslation } from 'contexts/Localization'
import { languageList } from 'config/localization/languages'
import { useEffect, useState } from 'react'
/* eslint-disable no-console */
const cbList = {}
const onCallbackIdList = new Map<() => void, string>()

export const listenOnBnMessage = () => {
  if (typeof window !== 'undefined') {
    window.bn.onMessage = ({ data: { id, payload } }) => {
      console.log('~ onMessage: ', id, payload)
      let newPayload = payload
      if (typeof payload === 'string') {
        newPayload = JSON.parse(payload)
        console.log('~ onMessage parse payload: ', payload)
      }
      if (typeof cbList[id] === 'function') {
        cbList[id](newPayload)
        delete cbList[id]
      }
    }
  }
}
let id = 0
const prefix = Math.random() * 1000
const postMessage = ({ action, payload, cb }: { action: string; payload?: any; cb?: (payload?: any) => void }) => {
  const finalId = `${prefix}-${id}`
  window.bn.miniProgram.postMessage({ action, id: finalId, payload })
  cbList[finalId] = cb
  id++
  return finalId
}
function getWeb3Provider() {
  return {
    on(event: string, cb: () => void) {
      const finalId = postMessage({ action: 'on', payload: { event } })
      onCallbackIdList.set(cb, finalId)
    },
    request(params) {
      return new Promise((resolve, reject) => {
        postMessage({
          action: 'request',
          payload: params,
          cb: (payload) => {
            if (payload?.error) {
              reject(payload?.message)
            } else {
              resolve(payload)
            }
          },
        })
      })
    },
    removeEventListener(event: string, cb: () => void) {
      const localId = onCallbackIdList.get(cb)
      delete cbList[localId]
      onCallbackIdList.delete(cb)
    },
  }
}

const _bridgeUtils = {
  jump(payload) {
    return new Promise((resolve) => {
      postMessage({ action: 'jump', payload, cb: resolve })
    })
  },
  getSystemInfo() {
    return new Promise((resolve) => {
      postMessage({ action: 'getSystemInfo', cb: resolve })
    })
  },
  toExternal(payload) {
    return new Promise((resolve) => {
      postMessage({ action: 'toExternal', payload, cb: resolve })
    })
  },
}
export const bridgeUtils = {
  toWallet() {
    return new Promise((resolve) => {
      postMessage({ action: 'toWallet', cb: resolve })
    })
  },
}

// Need to call getSystemInfo only once
let globalInfo
export const useSystemInfo = () => {
  const [info, setInfo] = useState(globalInfo)
  useEffect(() => {
    if (!globalInfo && typeof __NEZHA_BRIDGE__ !== 'undefined') {
      _bridgeUtils.getSystemInfo().then((value) => {
        globalInfo = value
        setInfo(value)
      })
    }
  }, [])
  return info
}

const mpWebviewPath = new Set(['/farms', '/farms/history', '/pools', '/pools/history'])
const handleLinkClick = (e: MouseEvent, router: NextRouter) => {
  // @ts-ignore
  const href = e.target?.closest('a')?.href || ''
  if (href) {
    const url = new URL(href)
    const [entry, ...params] = url.pathname.slice(1).split('/')
    if (entry === 'add') {
      const [currency1, currency2] = params
      _bridgeUtils.jump({ path: entry, query: { currency1, currency2 } })
    } else if (url.pathname === '/swap') {
      const query = url.search ? url.search.slice(1).split('=') : undefined
      _bridgeUtils.jump({ path: 'swap', query: query ? { [query[0]]: query[1] } : undefined })
    } else if (mpWebviewPath.has(url.pathname)) {
      const newPathname = `/_mp${url.pathname}`
      router.push(newPathname)
    } else {
      _bridgeUtils.toExternal({ url: url.href })
    }
    e.stopPropagation()
    e.preventDefault()
  }
}
export const useInterceptLink = () => {
  const router = useRouter()
  useEffect(() => {
    const handle = (e: MouseEvent) => {
      handleLinkClick(e, router)
    }
    document.body.addEventListener('click', handle, true)
    return () => {
      document.body.removeEventListener('click', handle, true)
    }
  }, [router])
}
const code2Lang = languageList.reduce((prev, next) => {
  // eslint-disable-next-line no-param-reassign
  prev[next.code.toLowerCase()] = next
  return prev
}, {})

export const useInjectI18n = () => {
  const [injected, setInjected] = useState(false)
  const systemInfo = useSystemInfo()
  const { setLanguage } = useTranslation()
  useEffect(() => {
    const main = async () => {
      if (systemInfo) {
        const { language } = systemInfo
        const currLanguage = code2Lang[language.toLowerCase()]
        if (currLanguage) {
          await setLanguage(currLanguage)
        }
        setInjected(true)
      }
    }
    main()
  }, [systemInfo, setLanguage])
  return { injected }
}
export default getWeb3Provider
