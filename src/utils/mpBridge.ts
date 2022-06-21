import { useEffect, useState } from 'react'
/* eslint-disable no-console */
const cbList = {}
const onCallbackIdList = {}

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
      }
    }
  }
}
let id = 0
function getWeb3Provider() {
  return {
    on(event, cb) {
      onCallbackIdList[cb] = id
      window.bn.miniProgram.postMessage({ action: 'on', id: id++, payload: { event } })
    },
    request(params) {
      return new Promise((resolve) => {
        const localId = id
        window.bn.miniProgram.postMessage({ action: 'request', payload: params, id: id++ })
        cbList[localId] = resolve
        console.log('~ cbList', cbList)
      })
    },
    removeEventListener(event, cb) {
      const localId = onCallbackIdList[cb]
      delete cbList[localId]
      delete onCallbackIdList[cb]
    },
  }
}

const _bridgeUtils = {
  jump(payload) {
    return new Promise((resolve) => {
      window.bn.miniProgram.postMessage({ action: 'jump', payload, id })
      cbList[id] = resolve
      id++
    })
  },
  getSystemInfo() {
    return new Promise((resolve) => {
      window.bn.miniProgram.postMessage({ action: 'getSystemInfo', id })
      cbList[id] = resolve
      id++
    })
  },
}
export const bridgeUtils = {
  toWallet() {
    return new Promise((resolve) => {
      window.bn.miniProgram.postMessage({ action: 'toWallet', id })
      cbList[id] = resolve
      id++
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
const handleLinkClick = (e: MouseEvent) => {
  // @ts-ignore
  const { href } = e.target
  if (href) {
    const url = new URL(href)
    const [entry, ...params] = url.pathname.slice(1).split('/')
    if (miniProgramPaths.has(entry)) {
      if (entry === 'add') {
        const [currency1, currency2] = params
        _bridgeUtils.jump({ path: entry, query: { currency1, currency2 } })
      }
      console.log('~ hit path: ', url.pathname)
      e.stopPropagation()
      e.preventDefault()
    }
  }
}
export const useInterceptLink = () => {
  useEffect(() => {
    document.body.addEventListener('click', handleLinkClick, true)
    return () => {
      document.body.removeEventListener('click', handleLinkClick, true)
    }
  }, [])
}

export default getWeb3Provider
