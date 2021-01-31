function MarketStore() {
  let state = {}

  const store = {
    listeners: [],
    getState() {
      return state
    },
    dispatch(priceMap) {
      state = {
        ...state,
        ...priceMap,
      }
      this.listeners.forEach((fn) => fn.call(null, state))
    },
    subscribe(fn) {
      this.listeners.push(fn)
      return () => {
        const index = this.listeners.indexOf(fn)
        if (index >= 0) {
          this.listeners.splice(index, 1)
        }
      }
    },
  }

  return store
}

export const marketStore = MarketStore()

export default {}
