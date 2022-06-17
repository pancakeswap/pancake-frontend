import { useEffect } from 'react'
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
const bridgeUtils = {
  jump(payload) {
    return new Promise((resolve) => {
      window.bn.miniProgram.postMessage({ action: 'jump', payload, id })
      cbList[id] = resolve
      id++
    })
  },
}
export const useInterceptLink = () => {
  useEffect(() => {
    const miniProgramPaths = new Set(['farms', 'add', 'remove', 'find', 'pools', 'swap'])
    document.body.addEventListener(
      'click',
      (e) => {
        const { href } = e.target
        if (href) {
          const url = new URL(href)
          const [entry, ...params] = url.pathname.slice(1).split('/')
          if (miniProgramPaths.has(entry)) {
            if (entry === 'add') {
              const [currency1, currency2] = params
              bridgeUtils.jump({ path: entry, query: { currency1, currency2 } })
            }
            console.log('~ hit path: ', url.pathname)
            e.stopPropagation()
            e.preventDefault()
          }
        }
      },
      true,
    )
  }, [])
}

export default getWeb3Provider
