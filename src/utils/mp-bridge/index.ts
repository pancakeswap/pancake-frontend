const cbList = {}
const onCallbackIdList = {}

setTimeout(() => {
  if (typeof window !== 'undefined') {
    window.bn.onMessage = ({ data: { id, payload } }) => {
      console.log('~ onMessage: ', id, payload)
      if (typeof payload === 'string') {
        payload = JSON.parse(payload)
        console.log('~ onMessage parse payload: ', payload)
      }
      console.log(cbList[id])
      if (typeof cbList[id] === 'function') {
        cbList[id](payload)
      }
    }
  }
})
function getWeb3Provider() {
  let id = 0
  return {
    on(event, cb) {
      onCallbackIdList[cb] = id
      window.bn.miniProgram.postMessage({ action: 'on', id: id++, payload: { event } })
    },
    request(params) {
      console.log('~ bridge start request')
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
