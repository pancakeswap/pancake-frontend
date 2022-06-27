import { NextRouter, useRouter } from 'next/router'
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
            if (payload.error) {
              reject(payload.message)
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

const miniProgramPaths = new Set(['farms', 'add', 'remove', 'find', 'pools', 'swap'])
const handleLinkClick = (e: MouseEvent, router: NextRouter) => {
  // @ts-ignore
  const { href } = e.target
  if (href) {
    const url = new URL(href)
    const [entry, ...params] = url.pathname.slice(1).split('/')
    if (miniProgramPaths.has(entry)) {
      if (entry === 'add') {
        const [currency1, currency2] = params
        _bridgeUtils.jump({ path: entry, query: { currency1, currency2 } })
      } else if (entry === 'farms') {
        const newPathname = `/_mp${url.pathname}`
        router.push(newPathname)
      }
      console.log('~ hit path: ', url.pathname)
      e.stopPropagation()
      e.preventDefault()
    }
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
  }, [])
}

export default getWeb3Provider
