import mpService from '@binance/mp-service'

export default {
  getItem(key) {
    return mpService.getStorage({ key }).then((res) => {
      return res.data
    })
  },

  setItem(key, data) {
    return mpService.setStorage({ key, data })
  },

  removeItem(key) {
    return mpService.removeStorage({ key })
  },

  clear() {
    return mpService.clearStorage()
  },
}
