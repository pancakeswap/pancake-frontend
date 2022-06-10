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
function getWeb3Provider() {
  let id = 0
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
export default getWeb3Provider
